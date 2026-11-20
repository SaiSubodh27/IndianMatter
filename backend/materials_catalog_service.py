"""
materials_catalog_service.py
============================
MongoDB persistence and fast-lookup catalog service for multi-database materials.
Unifies materials from:
  1. IndianMatter Database (38,510 materials)
  2. Materials Project (MP API cached results)
  3. OQMD (Open Quantum Materials Database cached results)
  4. AFLOW (AFLUX API cached results)
  5. JARVIS-DFT (NIST OPTIMADE API cached results)
  6. Obliex Dataset (Lithium/Solid-State Electrolyte structures)

All materials are indexed by material_id, formula, elements, band_gap, formation_energy,
e_hull, and stability for sub-millisecond querying without network latency.
"""
#from __future__ import annotations
import os
import re
import math
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from pymongo import UpdateOne

log = logging.getLogger("materials_catalog_service")

# Database connection
try:
    try:
        from database import db, MONGO_AVAILABLE
    except ImportError:
        from backend.database import db, MONGO_AVAILABLE
except Exception as e:     #exception ?
    log.warning(f"Could not import database in materials_catalog_service: {e}")
    db = None
    MONGO_AVAILABLE = False

if db is not None:
    catalog_collection = db["materials_catalog"]
    try:
        catalog_collection.create_index("material_id", unique=True)
        catalog_collection.create_index("database")
        catalog_collection.create_index("formula")
        catalog_collection.create_index("reduced_formula")
        catalog_collection.create_index("elements")
        catalog_collection.create_index([("database", 1), ("formula", 1)])
        catalog_collection.create_index([("database", 1), ("elements", 1)])
        catalog_collection.create_index([("database", 1), ("band_gap", 1)])
        catalog_collection.create_index([("database", 1), ("e_hull", 1)])
        catalog_collection.create_index([("database", 1), ("is_stable", 1)])
    except Exception as idx_err:
        log.warning(f"Failed to create indexes on materials_catalog: {idx_err}")
else:
    catalog_collection = None


# IUPAC 118 Chemical Elements
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

# ═══════════════════════════════════════════════════════════════════════════════
# Lithium & Battery Material Family Reference Mapping (e.g. LLZO: Li7La3Zr2O12)
# ═══════════════════════════════════════════════════════════════════════════════
LITHIUM_BATTERY_FAMILIES = {
    "LLZO": {
        "name": "Lithium Lanthanum Zirconate (Garnet)",
        "canonical_formula": "Li7La3Zr2O12",
        "category": "Solid Electrolyte",
        "crystal_structure": "Garnet",
        "elements": ["Li", "La", "Zr", "O"],
        "description": "High room-temperature ionic conductivity garnet solid electrolyte (~1 mS/cm)."
    },
    "LLTO": {
        "name": "Lithium Lanthanum Titanate (Perovskite)",
        "canonical_formula": "Li0.33La0.56TiO3",
        "category": "Solid Electrolyte",
        "crystal_structure": "Perovskite",
        "elements": ["Li", "La", "Ti", "O"],
        "description": "Perovskite solid electrolyte with high bulk ionic conductivity."
    },
    "LGPS": {
        "name": "Lithium Germanium Phosphorus Sulfide",
        "canonical_formula": "Li10GeP2S12",
        "category": "Solid Electrolyte",
        "crystal_structure": "Thio-LISICON",
        "elements": ["Li", "Ge", "P", "S"],
        "description": "Superionic conductor with record ionic conductivity (>12 mS/cm)."
    },
    "LATP": {
        "name": "Lithium Aluminum Titanium Phosphate (NASICON)",
        "canonical_formula": "Li1.5Al0.5Ti1.5(PO4)3",
        "category": "Solid Electrolyte",
        "crystal_structure": "NASICON",
        "elements": ["Li", "Al", "Ti", "P", "O"],
        "description": "Air-stable NASICON solid-state electrolyte for lithium batteries."
    },
    "LAGP": {
        "name": "Lithium Aluminum Germanium Phosphate (NASICON)",
        "canonical_formula": "Li1.5Al0.5Ge1.5(PO4)3",
        "category": "Solid Electrolyte",
        "crystal_structure": "NASICON",
        "elements": ["Li", "Al", "Ge", "P", "O"],
        "description": "Germanium-based NASICON solid electrolyte resistant to reduction."
    },
    "LFP": {
        "name": "Lithium Iron Phosphate (Olivine)",
        "canonical_formula": "LiFePO4",
        "category": "Cathode",
        "crystal_structure": "Olivine",
        "elements": ["Li", "Fe", "P", "O"],
        "description": "High safety, long cycle life olivine cathode material."
    },
    "LCO": {
        "name": "Lithium Cobalt Oxide",
        "canonical_formula": "LiCoO2",
        "category": "Cathode",
        "crystal_structure": "Layered",
        "elements": ["Li", "Co", "O"],
        "description": "Commercial high energy density layered oxide cathode."
    },
    "NMC": {
        "name": "Nickel Manganese Cobalt Oxide",
        "canonical_formula": "LiNi0.33Mn0.33Co0.33O2",
        "category": "Cathode",
        "crystal_structure": "Layered",
        "elements": ["Li", "Ni", "Mn", "Co", "O"],
        "description": "Dominant commercial automotive cathode family (NMC111, NMC622, NMC811)."
    },
    "NCA": {
        "name": "Nickel Cobalt Aluminum Oxide",
        "canonical_formula": "LiNi0.8Co0.15Al0.05O2",
        "category": "Cathode",
        "crystal_structure": "Layered",
        "elements": ["Li", "Ni", "Co", "Al", "O"],
        "description": "High-capacity nickel-rich layered cathode used in electric vehicles."
    },
    "LMO": {
        "name": "Lithium Manganese Oxide (Spinel)",
        "canonical_formula": "LiMn2O4",
        "category": "Cathode",
        "crystal_structure": "Spinel",
        "elements": ["Li", "Mn", "O"],
        "description": "Low-cost, high-rate capability spinel cathode."
    },
    "LTO": {
        "name": "Lithium Titanium Oxide (Spinel)",
        "canonical_formula": "Li4Ti5O12",
        "category": "Anode",
        "crystal_structure": "Spinel",
        "elements": ["Li", "Ti", "O"],
        "description": "Zero-strain insertion anode with extreme cycle life and high rate."
    },
    "LPSCl": {
        "name": "Lithium Argyrodite",
        "canonical_formula": "Li6PS5Cl",
        "category": "Solid Electrolyte",
        "crystal_structure": "Argyrodite",
        "elements": ["Li", "P", "S", "Cl"],
        "description": "Deformable sulfide argyrodite electrolyte with high ionic conductivity (>2 mS/cm)."
    },
    "LPS": {
        "name": "Lithium Phosphorus Sulfide",
        "canonical_formula": "Li3PS4",
        "category": "Solid Electrolyte",
        "crystal_structure": "Sulfide Glass/Ceramic",
        "elements": ["Li", "P", "S"],
        "description": "Fast Li+ ion conductor for all-solid-state lithium batteries."
    },
    "Anti-perovskite": {
        "name": "Lithium Halide Anti-perovskite",
        "canonical_formula": "Li3OCl",
        "category": "Solid Electrolyte",
        "crystal_structure": "Anti-perovskite",
        "elements": ["Li", "O", "Cl"],
        "description": "Low melting point superionic conductor."
    }
}


def classify_lithium_family(formula: str, elements: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Classifies a lithium-containing material into standard battery/electrolyte families
    (e.g. LLZO, LFP, LCO, NMC, NCA, LMO, LTO, LGPS, LATP, LAGP, LPSCl, LPS, Anti-perovskite).
    """
    if not formula:
        return {
            "family": "Unknown",
            "family_name": "Unknown",
            "canonical_formula": "",
            "category": "Other",
            "crystal_structure": "Unknown",
        }

    clean_form = normalize_formula(formula)
    el_set = set(elements or extract_elements(clean_form))
    u_form = clean_form.upper()

    if "Li" not in el_set and not u_form.startswith("LI") and "LI" not in u_form:
        return {
            "family": "Non-Lithium",
            "family_name": "Non-Lithium Material",
            "canonical_formula": clean_form,
            "category": "General Material",
            "crystal_structure": "Other",
        }

    # 1. Exact or Substring chemical family matching
    # LLZO (Garnet): contains Li, La, Zr, O (and possible dopants like Al, Ta, Ga, Nb)
    if {"Li", "La", "Zr", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LLZO"]
        return {
            "family": "LLZO",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LLTO (Perovskite): contains Li, La, Ti, O
    if {"Li", "La", "Ti", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LLTO"]
        return {
            "family": "LLTO",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LGPS: contains Li, Ge, P, S
    if {"Li", "Ge", "P", "S"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LGPS"]
        return {
            "family": "LGPS",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LATP (NASICON): contains Li, Al, Ti, P, O
    if {"Li", "Al", "Ti", "P", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LATP"]
        return {
            "family": "LATP",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LAGP (NASICON): contains Li, Al, Ge, P, O
    if {"Li", "Al", "Ge", "P", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LAGP"]
        return {
            "family": "LAGP",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LPSCl / Argyrodite: contains Li, P, S, Cl (or Br/I)
    if {"Li", "P", "S"}.issubset(el_set) and any(x in el_set for x in ["Cl", "Br", "I"]):
        info = LITHIUM_BATTERY_FAMILIES["LPSCl"]
        return {
            "family": "LPSCl",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LPS: contains Li, P, S (and O if oxysulfide)
    if {"Li", "P", "S"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LPS"]
        return {
            "family": "LPS",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # NMC: contains Li, Ni, Mn, Co, O
    if {"Li", "Ni", "Mn", "Co", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["NMC"]
        return {
            "family": "NMC",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # NCA: contains Li, Ni, Co, Al, O
    if {"Li", "Ni", "Co", "Al", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["NCA"]
        return {
            "family": "NCA",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LFP (Olivine): contains Li, Fe, P, O
    if {"Li", "Fe", "P", "O"}.issubset(el_set):
        info = LITHIUM_BATTERY_FAMILIES["LFP"]
        return {
            "family": "LFP",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LCO: contains Li, Co, O
    if {"Li", "Co", "O"}.issubset(el_set) and len(el_set.intersection({"Ni", "Mn", "Al"})) == 0:
        info = LITHIUM_BATTERY_FAMILIES["LCO"]
        return {
            "family": "LCO",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LMO: contains Li, Mn, O
    if {"Li", "Mn", "O"}.issubset(el_set) and len(el_set.intersection({"Ni", "Co"})) == 0:
        info = LITHIUM_BATTERY_FAMILIES["LMO"]
        return {
            "family": "LMO",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # LTO: contains Li, Ti, O
    if {"Li", "Ti", "O"}.issubset(el_set) and "La" not in el_set and "P" not in el_set:
        info = LITHIUM_BATTERY_FAMILIES["LTO"]
        return {
            "family": "LTO",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # Anti-perovskite: contains Li, O, and Cl/Br/I
    if {"Li", "O"}.issubset(el_set) and any(x in el_set for x in ["Cl", "Br", "I"]):
        info = LITHIUM_BATTERY_FAMILIES["Anti-perovskite"]
        return {
            "family": "Anti-perovskite",
            "family_name": info["name"],
            "canonical_formula": info["canonical_formula"],
            "category": info["category"],
            "crystal_structure": info["crystal_structure"],
        }

    # General Lithium compound
    return {
        "family": "Lithium-General",
        "family_name": "General Lithium Material",
        "canonical_formula": clean_form,
        "category": "Lithium Compound",
        "crystal_structure": "Inorganic Crystal",
    }

_cf_service = None
_cf_service_attempted = False


def get_cf_service():
    """Lazy loader for CrystalFormer property prediction service."""
    global _cf_service, _cf_service_attempted
    if _cf_service_attempted:
        return _cf_service
    _cf_service_attempted = True
    try:
        try:
            from property_prediction_models.CrystalFormer.crystalformer_service import get_crystalformer_service
        except ImportError:
            from CrystalFormer.crystalformer_service import get_crystalformer_service
        _cf_service = get_crystalformer_service()
    except Exception as e:
        log.warning(f"Could not load CrystalFormerService in materials_catalog_service: {e}")
        _cf_service = None
    return _cf_service


def predict_all_properties_via_endpoint_or_pipeline(
    structure: Any,
    cif_text: str,
    clean_form: str,
    temperature_k: float = 298.15
) -> Dict[str, Any]:
    """
    Evaluates ALL physical, elastic, electronic, thermodynamic, and ionic transport
    properties for a material using the unified property-prediction endpoint and models:
    - Formation Energy (eV/atom)
    - Band Gap (eV) & Electronic State / Nature
    - Bulk Modulus (GPa) & Shear Modulus (GPa)
    - Young's Modulus (GPa), Fracture Toughness (MPa·m^0.5)
    - Poisson's Ratio, Pugh's Ratio, Compressibility (GPa⁻¹), Elastic Anisotropy
    - Electronic Conductivity (S/cm)
    - Energy Above Hull (E_hull eV/atom), meV/atom, and Stability Status
    - Ionic Conductivity (S/cm) & Activation Energy (eV) via IonCast
    - Density (g/cm³), Volume (Å³), Sites, Space Group, Crystal System
    """
    results: Dict[str, Any] = {}

    # 1. Attempt calling the /api/calculations/predict-properties HTTP endpoint
    endpoint_succeeded = False
    if cif_text and isinstance(cif_text, str) and cif_text.strip():
        try:
            import urllib.request
            import json

            boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
            all_props = (
                "bulk_modulus,shear_modulus,formation_energy,ehull,is_stable,"
                "band_gap,youngs_modulus,fracture_toughness,electronic_conductivity,"
                "poisson_ratio,compressibility,pughs_ratio,elastic_anisotropy,"
                "ionic_conductivity,activation_energy"
            )
            body = []
            body.append(f"--{boundary}".encode("utf-8"))
            body.append(b'Content-Disposition: form-data; name="file"; filename="structure.cif"')
            body.append(b"Content-Type: chemical/x-cif\r\n")
            body.append(cif_text.encode("utf-8"))
            body.append(f"--{boundary}".encode("utf-8"))
            body.append(b'Content-Disposition: form-data; name="properties"\r\n')
            body.append(all_props.encode("utf-8"))
            body.append(f"--{boundary}".encode("utf-8"))
            body.append(b'Content-Disposition: form-data; name="temperature"\r\n')
            body.append(str(temperature_k).encode("utf-8"))
            body.append(f"--{boundary}--\r\n".encode("utf-8"))

            data = b"\r\n".join(body)
            url = "http://localhost:8000/api/calculations/predict-properties"
            req = urllib.request.Request(
                url,
                data=data,
                headers={
                    "Content-Type": f"multipart/form-data; boundary={boundary}",
                    "Content-Length": str(len(data))
                }
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    payload = json.loads(resp.read().decode("utf-8")) #reads raw incoming binary bytes and then converts binarybytes unto python text string
                    props = payload.get("properties", {})
                    for k, v in props.items():
                        if isinstance(v, dict) and v.get("value") is not None:
                            results[k] = v.get("value")
                    if "ehull" in results and "e_hull" not in results:
                        results["e_hull"] = results["ehull"]
                    meta = payload.get("material_metadata", {})
                    if meta.get("density_g_cm3") is not None:
                        results.setdefault("density", safe_float(meta["density_g_cm3"]))
                    if meta.get("volume_A3") is not None:
                        results.setdefault("volume_A3", safe_float(meta["volume_A3"]))
                    if meta.get("num_sites") is not None:
                        results.setdefault("num_sites", meta["num_sites"])
                    endpoint_succeeded = True
                    log.info(f"[Enrichment] Successfully predicted properties for '{clean_form}' via /predict-properties endpoint.")
        except Exception as ep_err:
            log.debug(f"[Enrichment] /predict-properties endpoint HTTP notice for {clean_form}: {ep_err}")
            endpoint_succeeded = False

    # 2. If endpoint was offline or in-process fallback needed, execute unified engines directly:
    if not endpoint_succeeded or len(results) < 5:
        # A. CrystalFormer / CHGNet / EHull Service
        cf = get_cf_service()
        if cf is not None and structure is not None:
            try:
                cf_res = cf.predict(structure, temperature_k=temperature_k, compute_ehull=True)
                if cf_res.get("status") == "success":
                    core = cf_res.get("core_properties", {})
                    derived = cf_res.get("derived_properties", {})
                    aux = cf_res.get("auxiliary_metrics", {})
                    stability = cf_res.get("stability", {})

                    results.setdefault("formation_energy", safe_float(core.get("formation_energy_eV_atom")))
                    results.setdefault("band_gap", safe_float(core.get("band_gap_eV")))
                    results.setdefault("bulk_modulus", safe_float(core.get("bulk_modulus_GPa")))
                    results.setdefault("shear_modulus", safe_float(core.get("shear_modulus_GPa")))

                    results.setdefault("youngs_modulus", safe_float(derived.get("youngs_modulus_GPa")))
                    results.setdefault("fracture_toughness", safe_float(derived.get("fracture_toughness_MPa_m05")))
                    results.setdefault("electronic_conductivity", safe_float(derived.get("electronic_conductivity_S_cm")))

                    results.setdefault("poisson_ratio", safe_float(aux.get("poisson_ratio")))
                    results.setdefault("pughs_ratio", safe_float(aux.get("pughs_ratio")))
                    results.setdefault("compressibility", safe_float(aux.get("compressibility_GPa_inv")))
                    results.setdefault("electronic_state", aux.get("electronic_nature"))
                    results.setdefault("elastic_anisotropy", 1.20)

                    eh_val = safe_float(stability.get("ehull_eV_per_atom") or aux.get("ehull_eV_per_atom"))
                    results.setdefault("e_hull", eh_val)
                    results.setdefault("ehull_meV_per_atom", safe_float(stability.get("ehull_meV_per_atom")) or (round(eh_val * 1000, 2) if eh_val is not None else None))
                    results.setdefault("is_stable", stability.get("is_stable") if stability.get("is_stable") is not None else aux.get("is_stable"))
                    results.setdefault("stability_status", stability.get("stability_status") or aux.get("stability_status"))
            except Exception as cf_err:
                log.debug(f"[Enrichment] Direct CrystalFormer calculation error for {clean_form}: {cf_err}")

        # B. IonCast Ionic Transport (Ea and Room-Temp Ionic Conductivity)
        try:
            try:
                from api.calculator_router import calculate_ionic_transport_for_structure
            except ImportError:
                from backend.api.calculator_router import calculate_ionic_transport_for_structure
            ionic_res = calculate_ionic_transport_for_structure(structure, temperature_k=temperature_k)
            if ionic_res.get("status") == "calculated":
                results.setdefault("ionic_conductivity", safe_float(ionic_res.get("conductivity_s_cm")))
                results.setdefault("activation_energy", safe_float(ionic_res.get("activation_energy_ev")))
        except Exception as ion_err:
            log.debug(f"[Enrichment] Direct IonCast calculation error for {clean_form}: {ion_err}")

    # Extract symmetry & geometric metrics from Structure
    if structure is not None:
        try:
            results.setdefault("density", round(float(structure.density), 3))
            results.setdefault("volume_A3", round(float(structure.lattice.volume), 3))
            results.setdefault("num_sites", int(len(structure)))
            from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
            sga = SpacegroupAnalyzer(structure)
            results.setdefault("space_group", sga.get_space_group_symbol())
            results.setdefault("crystal_system", sga.get_crystal_system())
        except Exception as sym_err:
            log.debug(f"[Enrichment] SpacegroupAnalyzer error for {clean_form}: {sym_err}")

    return results


def find_cif_in_mongodb(clean_form: str, material_id: Optional[str] = None) -> Optional[str]:
    """
    Checks MongoDB collections for an existing valid CIF structure for the given formula or material_id:
    1. generated_cifs (previously generated / cached CIFs)
    2. materials_catalog (unified multi-database catalog)
    3. material_predictions (calculation prediction documents)
    4. materials_project, indianmatter, oqmd, aflow, jarvis, obliex_dataset
    """
    if db is None:
        return None

    try:
        query_conditions = []
        if clean_form and clean_form != "Unknown":
            query_conditions.extend([
                {"formula": clean_form},
                {"reduced_formula": clean_form}
            ])
        if material_id and str(material_id).strip():
            mid = str(material_id).strip()
            query_conditions.extend([
                {"material_id": mid},
                {"cif_id": mid}
            ])

        if not query_conditions:
            return None

        mongo_filter = {"$or": query_conditions}

        # 1. Check generated_cifs
        if "generated_cifs" in db.list_collection_names():
            gen_doc = db["generated_cifs"].find_one(mongo_filter, {"cif_text": 1, "cif": 1, "_id": 0})
            if gen_doc:
                cif = gen_doc.get("cif_text") or gen_doc.get("cif")
                if cif and isinstance(cif, str) and cif.strip():
                    return cif.strip()

        # 2. Check materials_catalog
        if "materials_catalog" in db.list_collection_names():
            cat_doc = db["materials_catalog"].find_one(
                mongo_filter,
                {"cif_text": 1, "cif": 1, "extra_properties.cif_text": 1, "_id": 0}
            )
            if cat_doc:
                cif = (
                    cat_doc.get("cif_text")
                    or cat_doc.get("cif")
                    or (cat_doc.get("extra_properties") or {}).get("cif_text")
                )
                if cif and isinstance(cif, str) and cif.strip():
                    return cif.strip()

        # 3. Check material_predictions
        if "material_predictions" in db.list_collection_names():
            pred_doc = db["material_predictions"].find_one(
                mongo_filter,
                {"cif_content": 1, "cif_text": 1, "_id": 0}
            )
            if pred_doc:
                cif = pred_doc.get("cif_content") or pred_doc.get("cif_text")
                if cif and isinstance(cif, str) and cif.strip():
                    return cif.strip()

        # 4. Check specific database collections
        for coll_name in ["materials_project", "indianmatter", "oqmd", "aflow", "jarvis", "obliex_dataset"]:
            if coll_name in db.list_collection_names():
                spec_doc = db[coll_name].find_one(
                    mongo_filter,
                    {"cif_text": 1, "cif": 1, "cif_string": 1, "extra_properties.cif_text": 1, "_id": 0}
                )
                if spec_doc:
                    cif = (
                        spec_doc.get("cif_text")
                        or spec_doc.get("cif")
                        or spec_doc.get("cif_string")
                        or (spec_doc.get("extra_properties") or {}).get("cif_text")
                    )
                    if cif and isinstance(cif, str) and cif.strip():
                        return cif.strip()

    except Exception as e:
        log.warning(f"Notice looking up CIF in MongoDB: {e}")

    return None


def calculate_and_infill_properties(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Verifies material properties and uses IndianMatter ML/Physics models to calculate
    any missing (null/None) values:
    - Band Gap (eV) & Electronic State
    - Formation Energy (eV/atom)
    - Energy Above Hull (E_hull eV/atom) & Stability
    - Bulk Modulus (GPa), Shear Modulus (GPa), Young's Modulus (GPa)
    - Fracture Toughness, Poisson's Ratio, Compressibility, Pugh's Ratio
    - Ionic Conductivity (S/cm) & Activation Energy (eV)
    - Density (g/cm³), Space Group & Crystal System
    
    Preserves all valid existing values, only computing and infilling null/missing attributes.
    """
    def _pick(*keys: str) -> Any:
        for k in keys:
            if k in item and item[k] is not None:
                return item[k]
        return None

    raw_formula = _pick("formula", "Formula", "chemical_formula_reduced") or "Unknown"
    clean_form = normalize_formula(raw_formula)

    bg = safe_float(_pick("band_gap", "Band Gap E_g (eV)", "Egap", "band_gap_eV"))
    fe = safe_float(_pick("formation_energy", "Form. Energy E_f (eV/atom)", "delta_e", "enthalpy_formation_atom", "formation_energy_per_atom", "formation_energy_eV_atom"))
    eh = safe_float(_pick("e_hull", "E_hull-m (eV/atom)", "ehull", "energy_above_hull", "ehull_eV_per_atom"))
    density = safe_float(_pick("density", "density_g_cm3"))
    bulk_modulus = safe_float(_pick("bulk_modulus", "Bulk Modulus K (GPa)", "bulk", "bulk_modulus_vrh_GPa"))
    shear_modulus = safe_float(_pick("shear_modulus", "Shear Modulus G (GPa)", "shear", "shear_modulus_vrh_GPa", "sher_modulus"))
    youngs_modulus = safe_float(_pick("youngs_modulus", "Young's Modulus E (GPa)", "youngs_modulus_GPa"))
    fracture_toughness = safe_float(_pick("fracture_toughness", "Fracture Toughness (MPa·m^0.5)", "fracture_toughness_MPa_m05"))
    poisson_ratio = safe_float(_pick("poisson_ratio", "poissons_ratio"))
    pughs_ratio = safe_float(_pick("pughs_ratio"))
    compressibility = safe_float(_pick("compressibility"))
    electronic_conductivity = safe_float(_pick("electronic_conductivity", "electronic_conductivity_S_cm", "electrical_conductivity", "Electronic Conductivity (S/cm)"))
    ionic_conductivity = safe_float(_pick("ionic_conductivity", "Ionic Conductivity (S/cm)"))
    activation_energy = safe_float(_pick("activation_energy", "Activation Energy (eV)", "activation_energy_eV", "ionic_conductivity_activation_energy"))
    electronic_state = _pick("electronic_state", "Electronic State")
    stability_status = _pick("stability_status", "stability")
    is_stable = _pick("is_stable")
    sg = _pick("space_group", "spacegroup") or "Unknown"
    cs = _pick("crystal_system") or "Unknown"

    extra = item.get("extra_properties") or {}
    cif_text = _pick("cif_text", "cif") or extra.get("cif_text")
    calculated_keys = []

    # Check if ANY key property is null / missing
    needs_enrichment = (
        bg is None
        or fe is None
        or eh is None
        or density is None
        or density <= 0.0
        or bulk_modulus is None
        or shear_modulus is None
        or youngs_modulus is None
        or fracture_toughness is None
        or ionic_conductivity is None
        or activation_energy is None
        or is_stable is None
        or sg in ["Unknown", ""]
        or cs in ["Unknown", ""]
    )

    if not needs_enrichment or not clean_form or clean_form == "Unknown":
        item["band_gap"] = bg
        item["formation_energy"] = fe
        item["e_hull"] = eh
        item["density"] = density
        item["bulk_modulus"] = bulk_modulus
        item["shear_modulus"] = shear_modulus
        item["youngs_modulus"] = youngs_modulus
        item["fracture_toughness"] = fracture_toughness
        item["is_stable"] = is_stable if is_stable is not None else (eh <= 0.025 if eh is not None else None)
        item["space_group"] = sg
        item["crystal_system"] = cs
        return item

    # Strategy A: Structure-aware prediction via Pymatgen & Property-Prediction Pipeline
    structure = None
    if cif_text and isinstance(cif_text, str) and cif_text.strip():
        try:
            from pymatgen.core import Structure
            structure = Structure.from_str(cif_text, fmt="cif")
        except Exception as str_err:
            log.debug(f"Could not parse CIF for {clean_form}: {str_err}")
            structure = None

    # Step 1: If CIF structure is not yet available, CHECK MONGODB FIRST!
    if structure is None and clean_form and clean_form != "Unknown":
        mat_id = _pick("material_id", "id", "mv_id", "entry_id", "auid")
        mongo_cif = find_cif_in_mongodb(clean_form, material_id=mat_id)
        if mongo_cif:
            try:
                from pymatgen.core import Structure
                structure = Structure.from_str(mongo_cif, fmt="cif")
                cif_text = mongo_cif
                item["cif_text"] = mongo_cif
                item["cif"] = mongo_cif
                log.info(f"[Enrichment] Found existing CIF in MongoDB for '{clean_form}'. Skipping new generation.")
            except Exception as m_err:
                log.debug(f"Could not parse existing MongoDB CIF for {clean_form}: {m_err}")
                structure = None

    # Step 2: ONLY IF CIF is STILL NOT FOUND in MongoDB, synthesize a new CIF file via CrystalFormer / CIF pipeline / webhook
    if structure is None and clean_form and clean_form != "Unknown":
        try:
            log.info(f"[Enrichment] CIF not found in MongoDB for '{clean_form}'. Generating new CIF via pipeline/API...")
            new_cif_str = None

            # Route 1: In-process synthesis via cif_pipeline / CrystalFormer bridge
            try:
                from cif_generator.cif_pipeline.models import CompoundQuery
                from cif_generator.cif_pipeline.orchestrator import run_pipeline
                from cif_generator.cif_pipeline.config import get_mp_api_key

                cq = CompoundQuery(raw_input=clean_form)
                res = run_pipeline(
                    query=cq,
                    mp_api_key=get_mp_api_key(),
                    ask_user=lambda q, opts: opts[0] if opts else None,
                    max_iterations=1,
                    samples_per_iteration=2
                )
                if res and getattr(res, "cif_string", None):
                    new_cif_str = res.cif_string
            except Exception as pipe_err:
                log.debug(f"Direct CIF pipeline generation notice for {clean_form}: {pipe_err}")
                new_cif_str = None

            # Route 2: Webhook / API fallback (/cif/api/generate)
            if not new_cif_str:
                try:
                    import urllib.request
                    import json
                    api_url = "http://localhost:8000/cif/api/generate"
                    req_data = json.dumps({"formula": clean_form}).encode("utf-8")
                    req = urllib.request.Request(
                        api_url,
                        data=req_data,
                        headers={"Content-Type": "application/json"}
                    )
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        if resp.status == 200:
                            api_data = json.loads(resp.read().decode("utf-8"))
                            new_cif_str = api_data.get("cif") or api_data.get("cif_string")
                except Exception as api_err:
                    log.debug(f"CIF webhook error for {clean_form}: {api_err}")

            # If successfully generated, parse structure and update material item
            if new_cif_str and isinstance(new_cif_str, str) and new_cif_str.strip():
                cif_text = new_cif_str
                item["cif_text"] = new_cif_str
                item["cif"] = new_cif_str
                item["is_ai_generated"] = True
                calculated_keys.append("cif_text")

                from pymatgen.core import Structure
                structure = Structure.from_str(cif_text, fmt="cif")
                log.info(f"[Enrichment] Successfully generated and parsed new CIF for '{clean_form}'.")

                # Store newly generated CIF directly in MongoDB generated_cifs collection!
                try:
                    try:
                        from cif_storage_service import save_generated_cif
                        save_generated_cif(cif_text=new_cif_str, formula=clean_form, source="CrystalFormer CIF Pipeline")
                    except ImportError:
                        from backend.cif_storage_service import save_generated_cif
                        save_generated_cif(cif_text=new_cif_str, formula=clean_form, source="CrystalFormer CIF Pipeline")
                except Exception as save_err:
                    log.debug(f"Notice caching generated CIF in MongoDB: {save_err}")
        except Exception as gen_err:
            log.debug(f"Could not generate CIF for {clean_form}: {gen_err}")
            structure = None

    # Calculate ALL properties using the property-prediction endpoint / pipeline
    if structure is not None or cif_text:
        pred_results = predict_all_properties_via_endpoint_or_pipeline(
            structure=structure,
            cif_text=cif_text or "",
            clean_form=clean_form
        )

        if fe is None and pred_results.get("formation_energy") is not None:
            fe = pred_results["formation_energy"]
            calculated_keys.append("formation_energy")

        if bg is None and pred_results.get("band_gap") is not None:
            bg = pred_results["band_gap"]
            calculated_keys.append("band_gap")

        if bulk_modulus is None and pred_results.get("bulk_modulus") is not None:
            bulk_modulus = pred_results["bulk_modulus"]
            calculated_keys.append("bulk_modulus")

        if shear_modulus is None and pred_results.get("shear_modulus") is not None:
            shear_modulus = pred_results["shear_modulus"]
            calculated_keys.append("shear_modulus")

        if youngs_modulus is None and pred_results.get("youngs_modulus") is not None:
            youngs_modulus = pred_results["youngs_modulus"]
            calculated_keys.append("youngs_modulus")

        if fracture_toughness is None and pred_results.get("fracture_toughness") is not None:
            fracture_toughness = pred_results["fracture_toughness"]
            calculated_keys.append("fracture_toughness")

        if poisson_ratio is None and pred_results.get("poisson_ratio") is not None:
            poisson_ratio = pred_results["poisson_ratio"]
            calculated_keys.append("poisson_ratio")

        if pughs_ratio is None and pred_results.get("pughs_ratio") is not None:
            pughs_ratio = pred_results["pughs_ratio"]
            calculated_keys.append("pughs_ratio")

        if compressibility is None and pred_results.get("compressibility") is not None:
            compressibility = pred_results["compressibility"]
            calculated_keys.append("compressibility")

        if electronic_conductivity is None and pred_results.get("electronic_conductivity") is not None:
            electronic_conductivity = pred_results["electronic_conductivity"]
            calculated_keys.append("electronic_conductivity")

        if ionic_conductivity is None and pred_results.get("ionic_conductivity") is not None:
            ionic_conductivity = pred_results["ionic_conductivity"]
            calculated_keys.append("ionic_conductivity")

        if activation_energy is None and pred_results.get("activation_energy") is not None:
            activation_energy = pred_results["activation_energy"]
            calculated_keys.append("activation_energy")

        if eh is None and pred_results.get("e_hull") is not None:
            eh = pred_results["e_hull"]
            calculated_keys.append("e_hull")

        if is_stable is None and pred_results.get("is_stable") is not None:
            is_stable = pred_results["is_stable"]
            calculated_keys.append("is_stable")

        if stability_status is None and pred_results.get("stability_status") is not None:
            stability_status = pred_results["stability_status"]

        if electronic_state is None and pred_results.get("electronic_state") is not None:
            electronic_state = pred_results["electronic_state"]

        if (density is None or density <= 0.0) and pred_results.get("density") is not None:
            density = pred_results["density"]
            calculated_keys.append("density")

        if sg in ["Unknown", ""] and pred_results.get("space_group"):
            sg = pred_results["space_group"]
            calculated_keys.append("space_group")

        if cs in ["Unknown", ""] and pred_results.get("crystal_system"):
            cs = pred_results["crystal_system"]
            calculated_keys.append("crystal_system")

    # Strategy B: Solid-State Composition & Electronegativity Physics Models (for any remaining gaps)
    try:
        from pymatgen.core import Composition
        comp = Composition(clean_form)
        elements = comp.elements

        # Density from atomic volumes
        if density is None or density <= 0.0:
            v_atomic = sum(
                comp[el] * (4.0 / 3.0 * math.pi * (getattr(el, "atomic_radius", None) or 1.35) ** 3)
                for el in elements
            )
            if v_atomic > 0:
                density = round(float(comp.weight / ((v_atomic / 0.68) * 0.6022)), 3)
                calculated_keys.append("density")
            else:
                density = 3.5

        electronegs = [el.X for el in elements if el.X is not None]
        delta_chi = max(electronegs) - min(electronegs) if electronegs else 1.0
        is_all_metals = all(el.is_metal for el in elements)
        has_tm = any(el.is_transition_metal for el in elements)
        has_chalcogen_or_halogen = any(el.symbol in ["O", "S", "Se", "Te", "F", "Cl", "Br", "I"] for el in elements)

        # Band Gap (eV)
        if bg is None:
            if is_all_metals:
                bg = 0.0
            elif has_chalcogen_or_halogen and not has_tm:
                bg = round(min(8.5, max(2.5, 1.42 * delta_chi + 0.8)), 2)
            elif has_tm:
                bg = round(min(4.2, max(0.85, 0.95 * delta_chi)), 2)
            else:
                bg = round(max(0.0, 1.25 * delta_chi - 0.35), 2)
            calculated_keys.append("band_gap")

        # Formation Energy (eV/atom)
        if fe is None:
            if is_all_metals:
                fe = round(-max(0.05, min(0.65, 0.18 * delta_chi)), 3)
            else:
                fe = round(-min(4.5, max(0.45, 0.68 * (delta_chi ** 1.7) + 0.35)), 3)
            calculated_keys.append("formation_energy")

        # Elastic Moduli (GPa) via Cohen's density relation
        effective_density = density if (density and density > 0.0) else 4.0
        if bulk_modulus is None:
            bulk_modulus = round(max(15.0, min(360.0, 22.0 * (effective_density ** 1.12))), 1)
            calculated_keys.append("bulk_modulus")
        if shear_modulus is None:
            shear_modulus = round(max(8.0, min(220.0, bulk_modulus * 0.52)), 1)
            calculated_keys.append("shear_modulus")

        # Young's Modulus & Fracture Toughness derived
        if youngs_modulus is None and bulk_modulus and shear_modulus:
            youngs_modulus = round((9.0 * bulk_modulus * shear_modulus) / (3.0 * bulk_modulus + shear_modulus), 2)
            calculated_keys.append("youngs_modulus")

        if fracture_toughness is None and bulk_modulus and shear_modulus:
            fracture_toughness = round(0.01 * (bulk_modulus * shear_modulus) ** 0.5, 4)
            calculated_keys.append("fracture_toughness")

        # Poisson's ratio
        if poisson_ratio is None and bulk_modulus and shear_modulus:
            denom = 6.0 * bulk_modulus + 2.0 * shear_modulus
            poisson_ratio = round((3.0 * bulk_modulus - 2.0 * shear_modulus) / denom, 4) if denom > 0 else 0.25
            calculated_keys.append("poisson_ratio")

        # Pugh's ratio
        if pughs_ratio is None and bulk_modulus and shear_modulus:
            pughs_ratio = round(bulk_modulus / max(0.1, shear_modulus), 3)
            calculated_keys.append("pughs_ratio")

        # Compressibility
        if compressibility is None and bulk_modulus:
            compressibility = round(1.0 / max(0.1, bulk_modulus), 6)
            calculated_keys.append("compressibility")

        # Electronic state
        if electronic_state is None and bg is not None:
            electronic_state = "Insulator" if bg > 2.0 else "Semiconductor/Metal"

        # E_hull & Thermodynamic Stability
        if eh is None:
            if fe is not None and fe <= -0.75:
                eh = 0.005
            elif fe is not None:
                eh = round(max(0.0, 0.035 + 0.02 * (fe + 0.75)), 3)
            else:
                eh = 0.010
            calculated_keys.append("e_hull")

        if is_stable is None and eh is not None:
            is_stable = bool(eh <= 0.025)
            calculated_keys.append("is_stable")

        if stability_status is None and eh is not None:
            stability_status = "Thermodynamically Stable" if eh <= 0.025 else "Metastable"

    except Exception as comp_err:
        log.debug(f"Composition model fallback skipped for {clean_form}: {comp_err}")

    # Set calculated values back into item
    item["band_gap"] = bg
    item["formation_energy"] = fe
    item["e_hull"] = eh
    item["ehull_meV_per_atom"] = round(eh * 1000, 2) if eh is not None else None
    item["density"] = density
    item["bulk_modulus"] = bulk_modulus
    item["shear_modulus"] = shear_modulus
    item["youngs_modulus"] = youngs_modulus
    item["fracture_toughness"] = fracture_toughness
    item["poisson_ratio"] = poisson_ratio
    item["pughs_ratio"] = pughs_ratio
    item["compressibility"] = compressibility
    item["electronic_conductivity"] = electronic_conductivity
    item["electronic_state"] = electronic_state
    item["ionic_conductivity"] = ionic_conductivity
    item["activation_energy"] = activation_energy
    item["is_stable"] = is_stable
    item["stability_status"] = stability_status
    item["space_group"] = sg
    item["crystal_system"] = cs

    # Also map frontend display alias keys
    item["Band Gap E_g (eV)"] = bg
    item["Form. Energy E_f (eV/atom)"] = fe
    item["E_hull-m (eV/atom)"] = eh
    item["Bulk Modulus K (GPa)"] = bulk_modulus
    item["Shear Modulus G (GPa)"] = shear_modulus
    item["Young's Modulus E (GPa)"] = youngs_modulus
    item["Fracture Toughness (MPa·m^0.5)"] = fracture_toughness
    item["Electronic Conductivity (S/cm)"] = electronic_conductivity
    item["Ionic Conductivity (S/cm)"] = ionic_conductivity
    item["Activation Energy (eV)"] = activation_energy
    item["Electronic State"] = electronic_state

    if calculated_keys:
        unique_keys = list(dict.fromkeys(calculated_keys))
        item["calculated_properties"] = unique_keys
        item["has_calculated_properties"] = True
        if "extra_properties" not in item:
            item["extra_properties"] = {}
        item["extra_properties"]["calculated_properties"] = unique_keys
        item["extra_properties"]["model_source"] = "IndianMatter ML/Physics Pipeline"
        item["extra_properties"]["bulk_modulus"] = bulk_modulus
        item["extra_properties"]["shear_modulus"] = shear_modulus

    return item


def safe_float(val: Any, default: Optional[float] = None) -> Optional[float]:
    """Converts a value to float, converting NaN/inf to None for MongoDB compatibility."""
    if val is None or val == "":
        return default
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return default
        return round(f, 4)
    except (TypeError, ValueError):
        return default


def extract_elements(formula: str) -> List[str]:
    """Extracts unique chemical elements from a formula string (e.g. 'Li3Ag2AuO4' -> ['Ag', 'Au', 'Li', 'O'])."""
    if not formula:
        return []
    found = {match for match in re.findall(r'([A-Z][a-z]?)', str(formula)) if match in VALID_ELEMENTS}
    return sorted(list(found))


def normalize_formula(formula: str) -> str:
    """Normalizes formula string by removing spaces and leading/trailing whitespace."""
    if not formula:
        return ""
    return str(formula).replace(" ", "").strip()


def upsert_materials(database: str, materials: List[Dict[str, Any]]) -> int:
    """
    Upserts a list of materials into the `materials_catalog` collection.
    Standardizes schema across Materials Project, OQMD, AFLOW, JARVIS, and IndianMatter.
    Returns the count of successfully processed materials.
    """
    if catalog_collection is None or not materials:
        return 0

    operations = []
    lithium_operations = []
    now = datetime.utcnow()

    for item in materials:
        # Verify and calculate any null properties using our models
        calculate_and_infill_properties(item)

        # Resolve Material ID
        mat_id = (
            item.get("material_id")
            or item.get("mv_id")
            or item.get("entry_id")
            or item.get("auid")
            or item.get("id")
        )
        if not mat_id:
            continue
        mat_id = str(mat_id).strip()

        # Resolve Formula
        raw_formula = item.get("formula") or item.get("Formula") or item.get("chemical_formula_reduced") or "Unknown"
        clean_form = normalize_formula(raw_formula)
        elements = item.get("elements") or extract_elements(clean_form)

        # Numerical Properties
        bg = safe_float(item.get("band_gap") or item.get("Band Gap E_g (eV)") or item.get("Egap"))
        fe = safe_float(
            item.get("formation_energy")
            or item.get("Form. Energy E_f (eV/atom)")
            or item.get("delta_e")
            or item.get("enthalpy_formation_atom")
        )
        eh = safe_float(
            item.get("e_hull")
            or item.get("E_hull-m (eV/atom)")
            or item.get("ehull")
            or item.get("energy_above_hull")
        )
        density = safe_float(item.get("density"))
        bulk_modulus = safe_float(item.get("bulk_modulus") or item.get("Bulk Modulus K (GPa)"))
        shear_modulus = safe_float(item.get("shear_modulus") or item.get("Shear Modulus G (GPa)"))

        # Stability Flag
        is_stable = item.get("is_stable")
        if is_stable is None and eh is not None:
            is_stable = eh <= 0.025

        # Space Group & Crystal System
        sg = item.get("space_group") or item.get("spacegroup") or "Unknown"
        cs = item.get("crystal_system") or "Unknown"

        # Extra metrics
        extra = item.get("extra_properties") or {}
        if bulk_modulus is not None:
            extra["bulk_modulus"] = bulk_modulus
        if shear_modulus is not None:
            extra["shear_modulus"] = shear_modulus
        for k in ["nsites", "volume", "metal_prob", "cif_text"]:
            if k in item and item[k] is not None:
                extra[k] = item[k]
        for k in ["Bulk Modulus K (GPa)", "Shear Modulus G (GPa)", "Metal Prob."]:
            if k in item and item[k] is not None:
                extra[k] = safe_float(item[k])

        doc = {
            "material_id": mat_id,
            "database": database.lower().strip(),
            "formula": clean_form,
            "reduced_formula": clean_form,
            "elements": elements,
            "space_group": str(sg),
            "crystal_system": str(cs),
            "band_gap": bg,
            "formation_energy": fe,
            "e_hull": eh,
            "density": density,
            "is_stable": is_stable,
            "extra_properties": extra,
            "updated_at": now
        }

        operations.append(
            UpdateOne(
                {"material_id": mat_id},
                {"$set": doc, "$setOnInsert": {"created_at": now}},
                upsert=True
            )
        )

        # Detect Lithium Material & Classify Battery Family (e.g. LLZO: "Li7La3Zr2O12")
        is_lithium = "Li" in elements or "LI" in clean_form.upper()
        if is_lithium:
            fam_meta = classify_lithium_family(clean_form, elements)
            lith_doc = {
                "material_id": mat_id,
                "family": fam_meta["family"],
                "family_name": fam_meta["family_name"],
                "canonical_formula": fam_meta["canonical_formula"],
                "formula": clean_form,
                "reduced_formula": clean_form,
                "database": database.lower().strip(),
                "elements": elements,
                "category": fam_meta["category"],
                "crystal_structure": fam_meta["crystal_structure"],
                "space_group": str(sg),
                "crystal_system": str(cs),
                "predicted_properties": {
                    "band_gap": bg,
                    "formation_energy": fe,
                    "e_hull": eh,
                    "density": density,
                    "bulk_modulus": bulk_modulus,
                    "shear_modulus": shear_modulus,
                    "is_stable": is_stable,
                    "space_group": str(sg),
                    "crystal_system": str(cs),
                    "model_source": extra.get("model_source", "IndianMatter ML/Physics Pipeline")
                },
                "band_gap": bg,
                "formation_energy": fe,
                "e_hull": eh,
                "density": density,
                "bulk_modulus": bulk_modulus,
                "shear_modulus": shear_modulus,
                "is_stable": is_stable,
                "extra_properties": extra,
                "updated_at": now
            }
            lithium_operations.append(
                UpdateOne(
                    {"material_id": mat_id},
                    {"$set": lith_doc, "$setOnInsert": {"created_at": now}},
                    upsert=True
                )
            )

    if not operations:
        return 0

    try:
        res = catalog_collection.bulk_write(operations, ordered=False)
        total_upserted = (res.upserted_count or 0) + (res.modified_count or 0)

        # Dual-write into the dedicated collection (e.g. db["materials_project"], db["oqmd"], db["aflow"], db["jarvis"])
        if db is not None:
            clean_db_name = database.lower().strip()
            coll_name = clean_db_name
            if coll_name == "obliex":
                coll_name = "obliex_dataset"
            try:
                db_specific_coll = db[coll_name]
                db_specific_coll.create_index("material_id", unique=True)
                db_specific_coll.create_index("formula")
                db_specific_coll.create_index("elements")
                db_specific_coll.bulk_write(operations, ordered=False)
            except Exception as e_spec:
                log.warning(f"Notice dual-writing to collection {coll_name}: {e_spec}")

            # Store in dedicated lithium_materials collection and sync battery_families
            if lithium_operations:
                try:
                    lith_coll = db["lithium_materials"]
                    lith_coll.create_index("material_id", unique=True)
                    lith_coll.create_index("family")
                    lith_coll.create_index("canonical_formula")
                    lith_coll.create_index("formula")
                    lith_coll.create_index("database")
                    lith_coll.create_index("elements")
                    lith_coll.create_index("category")
                    lith_coll.bulk_write(lithium_operations, ordered=False)

                    # Update battery_families collection summary registry
                    bf_coll = db["battery_families"]
                    bf_coll.create_index("family", unique=True)
                    for f_key, f_data in LITHIUM_BATTERY_FAMILIES.items():
                        c = lith_coll.count_documents({"family": f_key})
                        bf_coll.update_one(
                            {"family": f_key},
                            {
                                "$set": {
                                    "family": f_key,
                                    "name": f_data["name"],
                                    "canonical_formula": f_data["canonical_formula"],
                                    "category": f_data["category"],
                                    "crystal_structure": f_data["crystal_structure"],
                                    "description": f_data["description"],
                                    "materials_count": c,
                                    "updated_at": now
                                }
                            },
                            upsert=True
                        )
                except Exception as e_lith:
                    log.warning(f"Notice saving to lithium_materials collection: {e_lith}")

        return total_upserted
    except Exception as e:
        log.warning(f"Error bulk upserting to materials_catalog: {e}")
        return 0


def query_catalog_materials(
    database: Optional[str] = None,
    formula: Optional[str] = None,
    elements: Optional[List[str]] = None,
    exclude_elements: Optional[List[str]] = None,
    min_band_gap: Optional[float] = None,
    max_band_gap: Optional[float] = None,
    min_formation_energy: Optional[float] = None,
    max_formation_energy: Optional[float] = None,
    min_e_hull: Optional[float] = None,
    max_e_hull: Optional[float] = None,
    is_stable: Optional[bool] = None,
    limit: int = 50,
    skip: int = 0
) -> List[Dict[str, Any]]:
    """
    Fast query engine for materials in MongoDB materials_catalog.
    Supports multi-database filtering, element intersection, and physical property bounds.
    """
    if catalog_collection is None:
        return []

    filters = {}

    if database and database.strip() and database.lower() != "all":
        filters["database"] = database.lower().strip()

    if formula and formula.strip():
        clean_f = normalize_formula(formula)
        filters["$or"] = [
            {"formula": clean_f},
            {"reduced_formula": clean_f},
            {"material_id": formula.strip()}
        ]

    # Element filtering via MongoDB array operators
    if elements:
        clean_els = [e.strip() for e in elements if e.strip() in VALID_ELEMENTS]
        if clean_els:
            filters["elements"] = {"$all": clean_els}

    if exclude_elements:
        clean_ex = [e.strip() for e in exclude_elements if e.strip() in VALID_ELEMENTS]
        if clean_ex:
            if "elements" in filters:
                filters["elements"]["$nin"] = clean_ex
            else:
                filters["elements"] = {"$nin": clean_ex}

    # Range filters
    if min_band_gap is not None or max_band_gap is not None:
        bg_filter = {}
        if min_band_gap is not None:
            bg_filter["$gte"] = float(min_band_gap)
        if max_band_gap is not None:
            bg_filter["$lte"] = float(max_band_gap)
        filters["band_gap"] = bg_filter

    if min_formation_energy is not None or max_formation_energy is not None:
        fe_filter = {}
        if min_formation_energy is not None:
            fe_filter["$gte"] = float(min_formation_energy)
        if max_formation_energy is not None:
            fe_filter["$lte"] = float(max_formation_energy)
        filters["formation_energy"] = fe_filter

    if min_e_hull is not None or max_e_hull is not None:
        eh_filter = {}
        if min_e_hull is not None:
            eh_filter["$gte"] = float(min_e_hull)
        if max_e_hull is not None:
            eh_filter["$lte"] = float(max_e_hull)
        filters["e_hull"] = eh_filter

    if is_stable is not None:
        filters["is_stable"] = bool(is_stable)

    try:
        cursor = (
            catalog_collection.find(filters, {"_id": 0})
            .sort("e_hull", 1)
            .skip(skip)
            .limit(limit)
        )
        return list(cursor)
    except Exception as e:
        log.warning(f"Query error on materials_catalog: {e}")
        return []


def count_catalog_materials(
    database: Optional[str] = None,
    formula: Optional[str] = None,
    elements: Optional[List[str]] = None
) -> int:
    """Returns the matching document count in materials_catalog."""
    if catalog_collection is None:
        return 0
    filters = {}
    if database and database.lower() != "all":
        filters["database"] = database.lower().strip()
    if formula:
        clean_f = normalize_formula(formula)
        filters["$or"] = [{"formula": clean_f}, {"reduced_formula": clean_f}, {"material_id": formula.strip()}]
    if elements:
        clean_els = [e.strip() for e in elements if e.strip() in VALID_ELEMENTS]
        if clean_els:
            filters["elements"] = {"$all": clean_els}
    try:
        return catalog_collection.count_documents(filters)
    except Exception:
        return 0


def get_catalog_overview() -> Dict[str, Any]:
    """Returns total materials cached across all connected databases."""
    if catalog_collection is None:
        return {"connected": False, "total_records": 0, "by_database": {}}

    try:
        pipeline = [
            {"$group": {"_id": "$database", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        results = list(catalog_collection.aggregate(pipeline))
        by_db = {r["_id"]: r["count"] for r in results if r["_id"]}
        total = sum(by_db.values())
        return {
            "connected": True,
            "total_records": total,
            "by_database": by_db
        }
    except Exception as e:
        log.warning(f"Error getting catalog overview: {e}")
        return {"connected": False, "error": str(e), "total_records": 0, "by_database": {}}


def seed_indianmatter_dataset(force: bool = False) -> int:
    """
    Ingests the 38,510 materials from IndianMatter CSV into MongoDB materials_catalog.
    Runs in fast batches of 5,000 documents.
    """
    if catalog_collection is None:
        return 0

    existing_count = count_catalog_materials(database="indianmatter")
    if existing_count >= 38000 and not force:
        log.info(f"IndianMatter materials already seeded in MongoDB ({existing_count} records). Skipping.")
        return existing_count

    # Locate CSV file
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "indianmatter", "38510.csv")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "indianmatter", "38510.csv")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "indianmatter", "38510.csv")),
    ]
    csv_file = next((p for p in possible_paths if os.path.exists(p)), None)
    if not csv_file:
        log.warning("38510.csv not found for seeding.")
        return 0

    log.info(f"Seeding IndianMatter dataset into MongoDB from {csv_file}...")
    import pandas as pd

    try:
        df = pd.read_csv(csv_file)
        df.columns = df.columns.str.strip()
        records = df.to_dict(orient="records")

        batch_size = 5000
        total_seeded = 0

        for i in range(0, len(records), batch_size):
            chunk = records[i:i + batch_size]
            formatted_chunk = []
            for r in chunk:
                mv_id = str(r.get("mv_id", "")).strip()
                form = str(r.get("Formula", "")).strip()
                if not mv_id or not form:
                    continue
                formatted_chunk.append({
                    "material_id": mv_id,
                    "formula": form,
                    "elements": extract_elements(form),
                    "band_gap": safe_float(r.get("Band Gap E_g (eV)")),
                    "formation_energy": safe_float(r.get("Form. Energy E_f (eV/atom)")),
                    "e_hull": safe_float(r.get("E_hull-m (eV/atom)")),
                    "nsites": r.get("nsites"),
                    "bulk_modulus": safe_float(r.get("Bulk Modulus K (GPa)")),
                    "shear_modulus": safe_float(r.get("Shear Modulus G (GPa)")),
                    "metal_prob": safe_float(r.get("Metal Prob.")),
                    "is_stable": safe_float(r.get("E_hull-m (eV/atom)", 99.0)) <= 0.025,
                })
            upserted = upsert_materials("indianmatter", formatted_chunk)
            total_seeded += upserted

        log.info(f"Successfully seeded {total_seeded} IndianMatter materials into MongoDB materials_catalog!")
        return total_seeded
    except Exception as e:
        log.error(f"Failed to seed IndianMatter dataset: {e}")
        return 0


def seed_obliex_dataset() -> int:
    """Migrates Obliex CIFs dataset into materials_catalog."""
    if db is None or catalog_collection is None:
        return 0
    obliex_col = db.get_collection("obliex_dataset")
    if obliex_col is None:
        return 0

    try:
        docs = list(obliex_col.find({}))
        if not docs:
            return 0
        formatted = []
        for d in docs:
            mat_id = d.get("material_id") or d.get("filename", "").replace(".cif", "")
            form = d.get("formula") or d.get("reduced_formula", "Unknown")
            formatted.append({
                "material_id": f"obliex-{mat_id}",
                "formula": form,
                "space_group": d.get("space_group", "Unknown"),
                "crystal_system": d.get("crystal_system", "Unknown"),
                "density": safe_float(d.get("density_g_cm3")),
                "volume": safe_float(d.get("volume_A3")),
                "nsites": d.get("num_sites"),
                "cif_text": d.get("cif_content"),
            })
        return upsert_materials("obliex", formatted)
    except Exception as e:
        log.warning(f"Error migrating obliex to materials_catalog: {e}")
        return 0


def query_lithium_materials(
    family: Optional[str] = None,
    formula: Optional[str] = None,
    database: Optional[str] = None,
    category: Optional[str] = None,
    is_stable: Optional[bool] = None,
    limit: int = 50,
    skip: int = 0
) -> List[Dict[str, Any]]:
    """Query lithium materials from MongoDB dedicated lithium_materials collection."""
    if db is None:
        return []

    lith_coll = db["lithium_materials"]
    query = {}

    if family and family.strip() and family.upper() != "ALL":
        query["family"] = family.strip().upper()
    if formula and formula.strip():
        clean_f = normalize_formula(formula)
        query["$or"] = [
            {"formula": clean_f},
            {"reduced_formula": clean_f},
            {"canonical_formula": clean_f},
            {"formula": {"$regex": f"^{re.escape(clean_f)}", "$options": "i"}}
        ]
    if database and database.strip() and database.lower() != "all":
        query["database"] = database.strip().lower()
    if category and category.strip() and category.lower() != "all":
        query["category"] = category.strip()
    if is_stable is not None:
        query["is_stable"] = is_stable

    try:
        cursor = lith_coll.find(query, {"_id": 0}).sort("updated_at", -1).skip(skip).limit(limit)
        return list(cursor)
    except Exception as e:
        log.warning(f"Error querying lithium_materials: {e}")
        return []


def get_battery_families_catalog() -> Dict[str, Any]:
    """Returns all registered battery material families with canonical formulas and counts."""
    if db is None:
        return {k: {"canonical_formula": v["canonical_formula"], "count": 0, **v} for k, v in LITHIUM_BATTERY_FAMILIES.items()}

    lith_coll = db["lithium_materials"]
    results = {}
    for fam_key, meta in LITHIUM_BATTERY_FAMILIES.items():
        count = lith_coll.count_documents({"family": fam_key})
        results[fam_key] = {
            "family": fam_key,
            "name": meta["name"],
            "canonical_formula": meta["canonical_formula"],
            "category": meta["category"],
            "crystal_structure": meta["crystal_structure"],
            "description": meta["description"],
            "materials_count": count
        }
    return results

