import os
import re
import pandas as pd
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException

router = APIRouter()

# Dataset path. The frontend keeps the IndianMatter data under src/data.
CSV_FILE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "indianmatter", "38510.csv")
)

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

def parse_elements_from_formula(formula: str) -> set:
    """Extracts chemical element symbols from formula string (e.g. 'Li3Ag2AuO4' -> {'Li', 'Ag', 'Au', 'O'})"""
    return set(re.findall(r'([A-Z][a-z]?)', str(formula)))

@router.get("/search")
def search_materials(
    elements: Optional[List[str]] = Query(None, description="Elements selected from Periodic Table, e.g. ?elements=Li&elements=Ag"),
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
        target_elements = set(elements)
        if match_mode == "exact":
            filtered_df = filtered_df[
                filtered_df['Formula'].apply(lambda f: parse_elements_from_formula(f) == target_elements)
            ]
        else:
            filtered_df = filtered_df[
                filtered_df['Formula'].apply(lambda f: target_elements.issubset(parse_elements_from_formula(f)))
            ]

    # Formula/ID search string filtering
    if formula:
        f_query = formula.strip().lower()
        filtered_df = filtered_df[
            filtered_df['Formula'].str.lower().str.contains(f_query, na=False) |
            filtered_df['mv_id'].str.lower().str.contains(f_query, na=False)
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
