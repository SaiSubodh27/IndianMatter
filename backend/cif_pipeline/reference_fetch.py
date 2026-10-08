"""
reference_fetch.py — fetch a reference (measured or DFT) structure for a
formula from COD / OQMD / Materials Project.

Used to attach a comparison reference to a generated CIF so the validation
vector (lattice Δa, XRD Δ2θ, site match) can be computed.

* COD  — open REST, no key (element + formula search, spinel filter).
* OQMD — open REST, no key.
* MP   — requires `MP_API_KEY` in the environment/.env.

Every source is best-effort and wrapped so one failure never blocks the others.
"""

from __future__ import annotations

import csv
import io
import logging
import os
from typing import Dict, List, Optional

import requests
from pymatgen.core import Composition, Structure

log = logging.getLogger("cif_pipeline.reference_fetch")

COD_RESULT = "https://www.crystallography.net/cod/result"
COD_CIF = "https://www.crystallography.net/cod/{cid}.cif"
OQMD_ENTRY = "http://oqmd.org/oqmdapi/formationenergy"


def _is_spinel(comp: Composition) -> bool:
    o = comp.get("O", 0.0)
    if o <= 0:
        return False
    cat = sum(comp.get(el, 0.0) for el in (str(e) for e in comp.elements)
              if el != "O")
    return abs(cat / o - 0.75) < 0.06


def _same_ratio(comp: Composition, target: Composition, tol: float = 0.08) -> bool:
    """True if two compositions have the same cation stoichiometry per oxygen.

    Element-set equality alone is not enough: CoFe2O4 (Co/O = 0.25) and Co2FeO4
    (Co/O = 0.50) share {Co, Fe, O} but are different compounds.  Comparing each
    cation's amount per oxygen distinguishes them.
    """
    o_t = target.get("O", 0.0)
    o_c = comp.get("O", 0.0)
    if o_t <= 0 or o_c <= 0:
        return False
    els = {str(e) for e in comp.elements} | {str(e) for e in target.elements}
    for el in els:
        if el == "O":
            continue
        if abs(comp.get(el, 0.0) / o_c - target.get(el, 0.0) / o_t) > tol:
            return False
    return True


def fetch_cod(formula: str, max_structures: int = 4) -> List[Dict]:
    """Fetch spinel reference CIFs from COD for `formula`."""
    out: List[Dict] = []
    try:
        target = Composition(formula).reduced_composition
    except Exception:
        return out
    target_els = {str(e) for e in target.elements if str(e) != "O"}
    # element search by the distinct elements
    params = {"format": "csv"}
    for i, el in enumerate([str(e) for e in target.elements][:4], start=1):
        params[f"el{i}"] = el
    try:
        r = requests.get(COD_RESULT, params=params, timeout=30)
        if r.status_code != 200:
            return out
        lines = [l for l in r.text.splitlines() if not l.strip().startswith("#")]
        rows = list(csv.DictReader(lines)) if lines else []
    except Exception as e:
        log.warning(f"[COD] search failed: {e}")
        return out

    for row in rows:
        if str(row.get("sgNumber")) not in ("227", "141"):
            continue
        comp = None
        try:
            comp = Composition((row.get("formula") or "").strip("- "))
        except Exception:
            continue
        if not _is_spinel(comp):
            continue
        # Require the SAME non-oxygen element set AND the same cation:oxygen
        # ratio as the target, otherwise the COD element search returns
        # different compounds (e.g. Co2FeO4 for a CoFe2O4 query).
        ref_els = {str(e) for e in comp.elements if str(e) != "O"}
        target_els = {str(e) for e in Composition(formula).elements if str(e) != "O"}
        if ref_els != target_els:
            continue
        if not _same_ratio(comp, Composition(formula)):
            continue
        try:
            cif = requests.get(COD_CIF.format(cid=row["file"]), timeout=30).text
            struct = Structure.from_str(cif, fmt="cif")
        except Exception:
            continue
        out.append({"source": "COD", "id": row["file"], "structure": struct,
                    "url": f"https://www.crystallography.net/cod/{row['file']}.html"})
        if len(out) >= max_structures:
            break
    return out


def fetch_oqmd(formula: str, max_structures: int = 4) -> List[Dict]:
    """Fetch reference structures from the OQMD REST API (open, no key)."""
    out: List[Dict] = []
    try:
        comp = Composition(formula).reduced_formula
        r = requests.get(
            OQMD_ENTRY,
            params={"filter": f"composition=~'{comp}'", "fields": "name,entry_id,unit_cell,sites",
                    "limit": max_structures},
            timeout=12,
        )
        if r.status_code != 200:
            return out
        data = r.json().get("data", [])
    except Exception as e:
        log.warning(f"[OQMD] query failed: {e}")
        return out
    for entry in data:
        try:
            out.append({"source": "OQMD", "id": str(entry.get("entry_id") or entry.get("name")),
                        "structure": None,  # OQMD structures need extra parsing
                        "url": f"http://oqmd.org/materials/entry/{entry.get('entry_id')}"})
        except Exception:
            continue
    return out


def fetch_mp(formula: str, max_structures: int = 4) -> List[Dict]:
    """Fetch reference structures from the Materials Project (needs MP_API_KEY)."""
    out: List[Dict] = []
    # Load the key through config so a project-root .env is read (not just the
    # process environment).
    try:
        from .config import get_mp_api_key
        key = get_mp_api_key()
    except Exception:
        key = os.getenv("MP_API_KEY", "")
    if not key:
        log.info("[MP] MP_API_KEY not set — skipping")
        return out
    try:
        from mp_api.client import MPRester
        with MPRester(key) as mpr:
            docs = mpr.materials.summary.search(
                formula=Composition(formula).reduced_formula,
                fields=["material_id", "structure"], num_chunks=1,
                chunk_size=max(max_structures * 3, 12))
            for d in docs[:max_structures]:
                struct = d.structure
                # Keep only spinel-type compositions (cat/O ~ 0.75), so a
                # different polymorph of the same formula is not compared.
                if struct is None or not _is_spinel(struct.composition):
                    continue
                out.append({"source": "MP", "id": str(d.material_id),
                            "structure": struct,
                            "url": f"https://materialsproject.org/materials/{d.material_id}"})
    except Exception as e:
        log.warning(f"[MP] query failed: {e}")
    return out


def fetch_reference(formula: str, sources=("COD", "OQMD", "MP"),
                    max_structures: int = 4) -> List[Dict]:
    """Fetch reference structures from the requested sources (best-effort)."""
    out: List[Dict] = []
    if "COD" in sources:
        out += fetch_cod(formula, max_structures)
    if "OQMD" in sources:
        out += fetch_oqmd(formula, max_structures)
    if "MP" in sources:
        out += fetch_mp(formula, max_structures)
    return out
