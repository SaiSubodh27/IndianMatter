"""
IndianMatter DB router — 5th data source for the Materials Explorer.

Data sources (place under backend/data/indianmatter/):
    38510.csv                  - core computed properties (mv_id, Formula, nsites,
                                  E_hull-m, Final M3GNet energy, Form. Energy E_f,
                                  Band Gap E_g, Bulk Modulus K, Shear Modulus G,
                                  Metal Prob.)
    pymatgen_matminer.csv       - structural/compositional descriptors, joined on
                                  filename (== "{mv_id}.cif") -> mv_id. Only the
                                  columns we actually use are loaded (usecols) since
                                  the full file is ~57MB / 152 columns.
    38510_CIFs/{mv_id}.cif      - one CIF per material for the 3D structure viewer
                                  and CIF export.

NOTE on space_group / crystal_system:
    Neither CSV contains a computed space group symbol. `crystal_system` below is
    a cheap heuristic classification from the lattice constants/angles (tolerance-
    based), NOT a true symmetry analysis — good enough for a table column, but do
    not treat it as authoritative. A real space group would require running
    pymatgen's SpacegroupAnalyzer against every CIF (one-time offline job); happy
    to write that precompute script separately if you want it later.

NOTE on is_stable:
    Materials Project-style convention: E_hull-m (energy above hull) <= 0.025
    eV/atom is treated as "stable enough" (33,880 / 38,510 materials at that
    threshold). Change STABILITY_THRESHOLD_EV below if you'd rather use a
    stricter cutoff (e.g. 0.0 -> 14,522 materials).
"""

import os
import re
from functools import lru_cache
from typing import Optional, List

import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
import io

router = APIRouter()

_possible_dirs = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "data", "indianmatter")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "indianmatter")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "indianmatter")),
]
DATA_DIR = next((d for d in _possible_dirs if os.path.exists(d)), _possible_dirs[0])
MAIN_CSV = os.path.join(DATA_DIR, "38510.csv")
MATMINER_CSV = os.path.join(DATA_DIR, "pymatgen_matminer.csv")
CIF_DIR = os.path.join(DATA_DIR, "38510_CIFs")

STABILITY_THRESHOLD_EV = 0.025  # eV/atom above hull

# Only pull the matminer columns we actually need — the full file has 152 columns.
MATMINER_USECOLS = [
    "filename", "num_elements", "volume", "density",
    "lattice_a", "lattice_b", "lattice_c",
    "alpha", "beta", "gamma",
]

# Canonical (query_param_prefix -> dataframe_column) map for every wired filter.
# Order here also drives the response payload / property list.
FILTER_COLUMNS = {
    "nsites": "nsites",
    "e_hull": "E_hull-m (eV/atom)",
    "m3gnet_energy": "Final M3GNet energy (eV)",
    "formation_energy": "Form. Energy E_f (eV/atom)",
    "band_gap": "Band Gap E_g (eV)",
    "bulk_modulus": "Bulk Modulus K (GPa)",
    "shear_modulus": "Shear Modulus G (GPa)",
    "metal_prob": "Metal Prob.",
    "num_elements": "num_elements",
    "volume": "volume",
    "density": "density",
    "lattice_a": "lattice_a",
    "lattice_b": "lattice_b",
    "lattice_c": "lattice_c",
    "alpha": "alpha",
    "beta": "beta",
    "gamma": "gamma",
}

_df_cache: Optional[pd.DataFrame] = None


def _classify_crystal_system(a, b, c, alpha, beta, gamma,
                              len_tol: float = 0.02, ang_tol: float = 0.5) -> str:
    """Cheap heuristic classification from lattice constants. NOT a true
    space-group analysis — see module docstring."""
    def close(x, y):
        denom = max(abs(x), abs(y), 1e-9)
        return abs(x - y) / denom < len_tol

    def is90(x):
        return abs(x - 90) < ang_tol

    def is120(x):
        return abs(x - 120) < ang_tol

    ab, bc = close(a, b), close(b, c)
    A90, B90, G90 = is90(alpha), is90(beta), is90(gamma)

    if ab and bc and A90 and B90 and G90:
        return "Cubic"
    if ab and A90 and B90 and G90:
        return "Tetragonal"
    if A90 and B90 and G90:
        return "Orthorhombic"
    if ab and A90 and B90 and is120(gamma):
        return "Hexagonal"
    if ab and bc and close(alpha, beta) and close(beta, gamma) and not A90:
        return "Trigonal"
    if A90 and G90 and not B90:
        return "Monoclinic"
    return "Triclinic"


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

def parse_elements_from_formula(formula: str) -> set:
    if not formula:
        return set()
    return {t for t in re.findall(r'([A-Z][a-z]?)', str(formula)) if t in VALID_ELEMENTS}


def load_dataset() -> pd.DataFrame:
    global _df_cache
    if _df_cache is not None:
        return _df_cache

    if not os.path.exists(MAIN_CSV):
        raise HTTPException(status_code=404, detail=f"{MAIN_CSV} not found.")
    if not os.path.exists(MATMINER_CSV):
        raise HTTPException(status_code=404, detail=f"{MATMINER_CSV} not found.")

    main_df = pd.read_csv(MAIN_CSV)
    main_df.columns = main_df.columns.str.strip()

    matminer_df = pd.read_csv(MATMINER_CSV, usecols=MATMINER_USECOLS)
    matminer_df["mv_id"] = matminer_df["filename"].str.replace(".cif", "", regex=False)
    matminer_df = matminer_df.drop(columns=["filename"])

    merged = main_df.merge(matminer_df, on="mv_id", how="left")

    merged["crystal_system"] = merged.apply(
        lambda r: _classify_crystal_system(
            r["lattice_a"], r["lattice_b"], r["lattice_c"],
            r["alpha"], r["beta"], r["gamma"],
        ) if pd.notna(r["lattice_a"]) else "Unknown",
        axis=1,
    )
    merged["is_stable"] = merged["E_hull-m (eV/atom)"] <= STABILITY_THRESHOLD_EV

    _df_cache = merged
    return _df_cache


def _apply_range_filters(df: pd.DataFrame, params: dict) -> pd.DataFrame:
    for prefix, column in FILTER_COLUMNS.items():
        lo = params.get(f"min_{prefix}")
        hi = params.get(f"max_{prefix}")
        if lo is not None:
            df = df[pd.to_numeric(df[column], errors="coerce") >= lo]
        if hi is not None:
            df = df[pd.to_numeric(df[column], errors="coerce") <= hi]
    return df


def _native(v):
    """Convert pandas/numpy scalars to plain JSON-serializable Python types."""
    if pd.isna(v):
        return None
    if hasattr(v, "item"):  # numpy int64/float64/bool_ -> native int/float/bool
        return v.item()
    return v


def _row_to_dict(row) -> dict:
    return {
        "material_id": _native(row["mv_id"]),
        "formula": _native(row["Formula"]),
        "space_group": "N/A",  # see module docstring
        "crystal_system": _native(row["crystal_system"]),
        "band_gap": _native(row["Band Gap E_g (eV)"]),
        "formation_energy": _native(row["Form. Energy E_f (eV/atom)"]),
        "density": _native(row["density"]),
        "is_stable": bool(row["is_stable"]),
        # Extra fields beyond the shared ExploreMaterialRow shape — the
        # frontend can read these when dataSource === "indianmatter".
        "nsites": _native(row["nsites"]),
        "e_hull": _native(row["E_hull-m (eV/atom)"]),
        "m3gnet_energy": _native(row["Final M3GNet energy (eV)"]),
        "bulk_modulus": _native(row["Bulk Modulus K (GPa)"]),
        "shear_modulus": _native(row["Shear Modulus G (GPa)"]),
        "metal_prob": _native(row["Metal Prob."]),
        "num_elements": _native(row["num_elements"]),
        "volume": _native(row["volume"]),
        "lattice_a": _native(row["lattice_a"]),
        "lattice_b": _native(row["lattice_b"]),
        "lattice_c": _native(row["lattice_c"]),
        "alpha": _native(row["alpha"]),
        "beta": _native(row["beta"]),
        "gamma": _native(row["gamma"]),
    }


def _build_query(request_params) -> dict:
    """Extract min_*/max_* numeric query params generically."""
    out = {}
    for prefix in FILTER_COLUMNS:
        for bound in ("min", "max"):
            key = f"{bound}_{prefix}"
            val = request_params.get(key)
            if val is not None:
                out[key] = float(val)
    return out


@router.get("/explore")
@router.get("/api/indianmatter/explore")
def explore_indianmatter(
    elements: Optional[List[str]] = Query(None),
    exclude_elements: Optional[List[str]] = Query(None),
    is_stable: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    # All 17 range filters, e.g. min_band_gap, max_band_gap, min_volume, ...
    min_nsites: Optional[float] = None, max_nsites: Optional[float] = None,
    min_e_hull: Optional[float] = None, max_e_hull: Optional[float] = None,
    min_m3gnet_energy: Optional[float] = None, max_m3gnet_energy: Optional[float] = None,
    min_formation_energy: Optional[float] = None, max_formation_energy: Optional[float] = None,
    min_band_gap: Optional[float] = None, max_band_gap: Optional[float] = None,
    min_bulk_modulus: Optional[float] = None, max_bulk_modulus: Optional[float] = None,
    min_shear_modulus: Optional[float] = None, max_shear_modulus: Optional[float] = None,
    min_metal_prob: Optional[float] = None, max_metal_prob: Optional[float] = None,
    min_num_elements: Optional[float] = None, max_num_elements: Optional[float] = None,
    min_volume: Optional[float] = None, max_volume: Optional[float] = None,
    min_density: Optional[float] = None, max_density: Optional[float] = None,
    min_lattice_a: Optional[float] = None, max_lattice_a: Optional[float] = None,
    min_lattice_b: Optional[float] = None, max_lattice_b: Optional[float] = None,
    min_lattice_c: Optional[float] = None, max_lattice_c: Optional[float] = None,
    min_alpha: Optional[float] = None, max_alpha: Optional[float] = None,
    min_beta: Optional[float] = None, max_beta: Optional[float] = None,
    min_gamma: Optional[float] = None, max_gamma: Optional[float] = None,
):
    df = load_dataset().copy()

    if elements:
        target = set()
        for el in elements:
            for item in str(el).split(","):
                if item.strip():
                    target.add(item.strip())
        if target:
            df = df[df["Formula"].apply(lambda f: target.issubset(parse_elements_from_formula(f)))]
    if exclude_elements:
        excl = set()
        for el in exclude_elements:
            for item in str(el).split(","):
                if item.strip():
                    excl.add(item.strip())
        if excl:
            df = df[df["Formula"].apply(lambda f: excl.isdisjoint(parse_elements_from_formula(f)))]
    if is_stable is not None:
        df = df[df["is_stable"] == is_stable]

    df = _apply_range_filters(df, dict(locals()))
    start = (page - 1) * limit
    return [_row_to_dict(row) for _, row in df.iloc[start:start + limit].iterrows()]


@router.get("/structure/{material_id}")
@router.get("/api/indianmatter/structure/{material_id}")
def get_structure(material_id: str):
    cif_path = os.path.join(CIF_DIR, f"{material_id}.cif")
    if not os.path.exists(cif_path):
        raise HTTPException(status_code=404, detail=f"No CIF found for {material_id}.")
    with open(cif_path, "r") as f:
        cif_string = f.read()
    return {"cif_string": cif_string}


@router.get("/download/cif/{material_id}")
@router.get("/api/indianmatter/download/cif/{material_id}")
def download_cif(material_id: str):
    cif_path = os.path.join(CIF_DIR, f"{material_id}.cif")
    if not os.path.exists(cif_path):
        raise HTTPException(status_code=404, detail=f"No CIF found for {material_id}.")
    return FileResponse(cif_path, media_type="chemical/x-cif", filename=f"{material_id}.cif")


@router.get("/download/csv")
@router.get("/api/indianmatter/download/csv")
def download_csv(
    elements: Optional[List[str]] = Query(None),
    exclude_elements: Optional[List[str]] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(100, ge=1, le=38510),
    min_nsites: Optional[float] = None, max_nsites: Optional[float] = None,
    min_e_hull: Optional[float] = None, max_e_hull: Optional[float] = None,
    min_m3gnet_energy: Optional[float] = None, max_m3gnet_energy: Optional[float] = None,
    min_formation_energy: Optional[float] = None, max_formation_energy: Optional[float] = None,
    min_band_gap: Optional[float] = None, max_band_gap: Optional[float] = None,
    min_bulk_modulus: Optional[float] = None, max_bulk_modulus: Optional[float] = None,
    min_shear_modulus: Optional[float] = None, max_shear_modulus: Optional[float] = None,
    min_metal_prob: Optional[float] = None, max_metal_prob: Optional[float] = None,
    min_num_elements: Optional[float] = None, max_num_elements: Optional[float] = None,
    min_volume: Optional[float] = None, max_volume: Optional[float] = None,
    min_density: Optional[float] = None, max_density: Optional[float] = None,
    min_lattice_a: Optional[float] = None, max_lattice_a: Optional[float] = None,
    min_lattice_b: Optional[float] = None, max_lattice_b: Optional[float] = None,
    min_lattice_c: Optional[float] = None, max_lattice_c: Optional[float] = None,
    min_alpha: Optional[float] = None, max_alpha: Optional[float] = None,
    min_beta: Optional[float] = None, max_beta: Optional[float] = None,
    min_gamma: Optional[float] = None, max_gamma: Optional[float] = None,
):
    df = load_dataset().copy()

    if elements:
        target = set(elements)
        df = df[df["Formula"].apply(lambda f: target.issubset(parse_elements_from_formula(f)))]
    if exclude_elements:
        excl = set(exclude_elements)
        df = df[df["Formula"].apply(lambda f: excl.isdisjoint(parse_elements_from_formula(f)))]
    if is_stable is not None:
        df = df[df["is_stable"] == is_stable]

    df = _apply_range_filters(df, dict(locals()))
    rows = [_row_to_dict(row) for _, row in df.head(limit).iterrows()]

    out_df = pd.DataFrame(rows)
    buf = io.StringIO()
    out_df.to_csv(buf, index=False)
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=indianmatter_export.csv"},
    )
