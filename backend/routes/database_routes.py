import os
import re
import pandas as pd
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException

router = APIRouter()

# Dataset path. Checks frontend/src/data as well as root src/data.
_possible_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "data", "indianmatter", "38510.csv")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "indianmatter", "38510.csv")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "indianmatter", "38510.csv")),
]
CSV_FILE_PATH = next((p for p in _possible_paths if os.path.exists(p)), _possible_paths[0])

# Global DataFrame cache
df_cache: Optional[pd.DataFrame] = None

def load_dataset() -> pd.DataFrame:
    global df_cache
    if df_cache is None:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail="Dataset CSV file not found.")
        df_cache = pd.read_csv(CSV_FILE_PATH)
        df_cache.columns = df_cache.columns.str.strip()
        # Clean potential NaN/Inf values for JSON serialization
        df_cache = df_cache.fillna("")
    return df_cache

# Standard IUPAC periodic table chemical element symbols
VALID_ELEMENTS = {
    "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
    "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
    "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
    "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
    "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
    "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
    "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
    "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
    "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
    "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
}

ELEMENTS_BY_LOWER = {el.lower(): el for el in VALID_ELEMENTS}

def canonicalize_element(element: str) -> Optional[str]:
    """Return standard chemical element symbol, or None if invalid."""
    if not element:
        return None
    cleaned = str(element).strip()
    return ELEMENTS_BY_LOWER.get(cleaned.lower())

def parse_elements_from_formula(formula: str) -> set:
    """Extracts valid chemical element symbols from formula string (e.g. 'Li3Ag2AuO4' -> {'Li', 'Ag', 'Au', 'O'})"""
    if not formula:
        return set()
    return {t for t in re.findall(r'([A-Z][a-z]?)', str(formula)) if t in VALID_ELEMENTS}

def match_formula_or_query(formula_val: str, mv_id_val: str, query_str: str) -> bool:
    """
    Matches a material's formula or mv_id against a search query using exact chemical element matching.
    DOES NOT perform character/substring search like formula.lower().contains(query).
    """
    if not query_str:
        return True
    q = query_str.strip()
    if not q:
        return True

    q_lower = q.lower()
    mv_id_str = str(mv_id_val or '').lower()

    # 1. Match by Material ID (e.g. 'mv-7214796' or '7214796')
    if q_lower == mv_id_str or (q_lower.startswith('mv-') and q_lower in mv_id_str):
        return True

    f_str = str(formula_val or '')
    f_lower = f_str.lower()

    # 2. Exact chemical formula match (e.g. searching 'LiCoO2', 'LiH')
    if q_lower == f_lower:
        return True

    # 3. Single chemical element symbol search (e.g. 'H', 'Hf', 'C', 'Co', 'N', 'Ni', 'Cl', 'O')
    if q_lower in ELEMENTS_BY_LOWER:
        target_el = ELEMENTS_BY_LOWER[q_lower]
        formula_elements = parse_elements_from_formula(f_str)
        return target_el in formula_elements

    # 4. Multi-element tokens separated by delimiters (e.g. "H, S", "H-S", "H S", "Li O")
    raw_tokens = [t.strip() for t in re.split(r'[,+\s\-]+', q) if t.strip()]
    if raw_tokens and all(t.lower() in ELEMENTS_BY_LOWER for t in raw_tokens):
        target_elements = {ELEMENTS_BY_LOWER[t.lower()] for t in raw_tokens}
        formula_elements = parse_elements_from_formula(f_str)
        return target_elements.issubset(formula_elements)

    # 5. Chemical formula query with element counts (e.g. "Li2O", "Na3PS4", "Li3Hf2AgS6")
    query_elements = parse_elements_from_formula(q)
    if query_elements:
        if q_lower == f_lower:
            return True
        formula_elements = parse_elements_from_formula(f_str)
        return query_elements.issubset(formula_elements)

    # 6. Material ID fallback (e.g. numeric ID string fragment)
    if q_lower in mv_id_str:
        return True

    return False

@router.get("/search")
def search_materials(
    elements: Optional[List[str]] = Query(None, description="Elements selected from Periodic Table, e.g. ?elements=Li&elements=Ag"),
    exclude_elements: Optional[List[str]] = Query(None, description="Elements to exclude from formulas"),
    match_mode: str = Query("contains", description="'contains' matches if formula has all elements; 'exact' matches only formulas composed strictly of selected elements"),
    formula: Optional[str] = Query(None, description="Partial text search on Formula or mv_id"),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_e_hull: Optional[float] = Query(None),
    max_e_hull: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    df = load_dataset()
    filtered_df = df.copy()

    # Periodic table element filtering
    if elements:
        target_elements = {canonicalize_element(e) for e in elements if canonicalize_element(e)}
        if target_elements:
            if match_mode == "exact":
                filtered_df = filtered_df[
                    filtered_df['Formula'].apply(lambda f: parse_elements_from_formula(f) == target_elements)
                ]
            else:
                filtered_df = filtered_df[
                    filtered_df['Formula'].apply(lambda f: target_elements.issubset(parse_elements_from_formula(f)))
                ]

    if exclude_elements:
        excluded = {canonicalize_element(e) for e in exclude_elements if canonicalize_element(e)}
        if excluded:
            filtered_df = filtered_df[
                filtered_df['Formula'].apply(lambda f: excluded.isdisjoint(parse_elements_from_formula(f)))
            ]

    # Formula/ID search string filtering with exact chemical element parsing
    if formula and str(formula).strip():
        raw_query = str(formula).strip()
        filtered_df = filtered_df[
            filtered_df.apply(lambda row: match_formula_or_query(row['Formula'], row['mv_id'], raw_query), axis=1)
        ]

    # Numeric Range Filters
    if min_band_gap is not None and 'Band Gap E_g (eV)' in filtered_df.columns:
        filtered_df = filtered_df[pd.to_numeric(filtered_df['Band Gap E_g (eV)'], errors='coerce') >= min_band_gap]
    if max_band_gap is not None and 'Band Gap E_g (eV)' in filtered_df.columns:
        filtered_df = filtered_df[pd.to_numeric(filtered_df['Band Gap E_g (eV)'], errors='coerce') <= max_band_gap]

    if min_e_hull is not None and 'E_hull-m (eV/atom)' in filtered_df.columns:
        filtered_df = filtered_df[pd.to_numeric(filtered_df['E_hull-m (eV/atom)'], errors='coerce') >= min_e_hull]
    if max_e_hull is not None and 'E_hull-m (eV/atom)' in filtered_df.columns:
        filtered_df = filtered_df[pd.to_numeric(filtered_df['E_hull-m (eV/atom)'], errors='coerce') <= max_e_hull]

    # Pagination
    total_results = len(filtered_df)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_results = filtered_df.iloc[start_idx:end_idx].to_dict(orient="records")

    return {
        "total": total_results,
        "page": page,
        "limit": limit,
        "results": paginated_results
    }
