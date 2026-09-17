"""
Material filtering service for the ~38k-material dataset (38510.csv).

Drop this file into your project at:
    backend/services/material_filter_service.py

It sits next to your other services (cif_electrical_features.py,
m3gnet_structure_service.py, prediction_service.py, ...) and can be imported
from a route in backend/routes/materials_routes.py once you're ready to wire
up the API endpoint.

Dataset columns (from 38510.csv):
    mv_id, Formula, nsites, E_hull-m (eV/atom), Final M3GNet energy (eV),
    Form. Energy E_f (eV/atom), Band Gap E_g (eV), Bulk Modulus K (GPa),
    Shear Modulus G (GPa), Metal Prob.
"""

import re
import functools
from pathlib import Path
from typing import Optional, Iterable

import pandas as pd

# Path to the dataset relative to this file's location once moved into
# backend/services/. Adjust if you relocate the CSV into a backend-owned
# data directory instead of leaving it under src/data/indianmatter/.
DATASET_PATH = (
    Path(__file__).resolve().parents[2] / "src" / "data" / "indianmatter" / "38510.csv"
)

# Short keys the frontend/API will use to request specific columns for
# display, mapped to the real (messy) CSV column names.
DISPLAY_PROPERTIES = {
    "nsites": "nsites",
    "e_hull": "E_hull-m (eV/atom)",
    "m3gnet_energy": "Final M3GNet energy (eV)",
    "formation_energy": "Form. Energy E_f (eV/atom)",
    "band_gap": "Band Gap E_g (eV)",
    "bulk_modulus": "Bulk Modulus K (GPa)",
    "shear_modulus": "Shear Modulus G (GPa)",
    "metal_prob": "Metal Prob.",
}

# Matches element symbols (one capital + optional lowercase letter).
ELEMENT_TOKEN_RE = re.compile(r"[A-Z][a-z]?")


def _extract_elements(formula: str) -> set:
    """
    Pull the set of element symbols out of a formula string.

    Works even with parentheses/multipliers (e.g. 'LiAg(BiS2)2') because we
    only need the *set* of symbols present, not their stoichiometry — every
    symbol still appears literally in the string regardless of grouping, so
    a plain regex scan is enough (no need to expand parentheses).
    """
    return set(ELEMENT_TOKEN_RE.findall(formula))


@functools.lru_cache(maxsize=1)
def load_materials_df() -> pd.DataFrame:
    """
    Load and parse the dataset once per process, then cache it in memory.
    Call load_materials_df.cache_clear() if the CSV changes and you need
    a fresh reload without restarting the process.
    """
    df = pd.read_csv(DATASET_PATH)
    df["elements"] = df["Formula"].apply(_extract_elements)
    return df


def filter_materials(
    elements: Optional[Iterable[str]] = None,
    match_mode: str = "any",  # "any" | "all" | "exact"
    property_ranges: Optional[dict] = None,
    columns: Optional[Iterable[str]] = None,
) -> list:
    """
    Filter the material dataset by periodic-table element selection and/or
    property ranges, and return only the caller-selected columns.

    Args:
        elements: element symbols selected on the periodic table, e.g. ["Li", "Ag"].
                  None/empty -> no element filtering applied.
        match_mode:
            "any"   -> material contains at least one of the selected elements
            "all"   -> material contains every selected element (may contain others too)
            "exact" -> material's element set is exactly the selected set (no extras)
        property_ranges: {property_key: (min, max)} using the short keys from
                  DISPLAY_PROPERTIES above. Either bound can be None to leave
                  that side open, e.g. {"band_gap": (0.5, None)}.
        columns: which DISPLAY_PROPERTIES keys to include in the output besides
                  the always-included mv_id/Formula. None/empty -> only
                  mv_id + Formula are returned (lets the user avoid "dumping
                  everything").

    Returns:
        list of dicts, one per matching material, containing only the
        requested columns.
    """
    df = load_materials_df()

    if elements:
        wanted = set(elements)
        if match_mode == "all":
            mask = df["elements"].apply(lambda s: wanted.issubset(s))
        elif match_mode == "exact":
            mask = df["elements"].apply(lambda s: s == wanted)
        else:  # "any"
            mask = df["elements"].apply(lambda s: bool(s & wanted))
        df = df[mask]

    if property_ranges:
        for key, bounds in property_ranges.items():
            col = DISPLAY_PROPERTIES.get(key)
            if col is None:
                continue  # unknown property key — ignore rather than error out
            lo, hi = bounds
            if lo is not None:
                df = df[df[col] >= lo]
            if hi is not None:
                df = df[df[col] <= hi]

    base_cols = ["mv_id", "Formula"]
    selected_cols = base_cols + [
        DISPLAY_PROPERTIES[k] for k in (columns or []) if k in DISPLAY_PROPERTIES
    ]
    result = df[selected_cols]

    return result.to_dict(orient="records")


if __name__ == "__main__":
    # Quick manual sanity check — run with:
    #   python material_filter_service.py
    example = filter_materials(
        elements=["Li", "Ag"],
        match_mode="all",
        property_ranges={"band_gap": (0.5, None)},
        columns=["band_gap", "bulk_modulus"],
    )
    print(f"{len(example)} materials matched")
    for row in example[:5]:
        print(row)