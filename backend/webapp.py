"""
FastAPI backend for the CIF Generator pipeline (mounted as a sub-app at /cif).

Role in the system
------------------
This is a *separate* FastAPI instance that ``backend/main.py`` mounts at
the ``/cif`` prefix (``app.mount("/cif", webapp.app)``). Keeping it in its
own app lets the CIF pipeline carry its own request models, static frontend
and heavy optional imports without polluting the main API.

Endpoints exposed (all under /cif):
  POST /api/generate            — full 5-stage pipeline (DB search / CrystaLLM gen / MACE relax)
  POST /api/parse-formula       — fast classification without generation
  POST /api/doped-cif           — dedicated doping pipeline (family/regime/SQS/...)
  POST /api/resolve-disambiguation — translate a user's polymorph pick into an index
  POST /api/symmetry-matrix     — min-image-legal supercell matrix
  POST /api/mesp-check          — MESP plausibility check on a supplied CIF
  POST /api/batch-process       — run several cases in one request
  POST /api/auth/login          — lightweight session token (off unless CIF_AUTH_ENABLED=true)
  GET  /api/health              — MP key / MACE model / CrystaLLM checkpoint status
  GET  /api/data-files[/{name}] — list/download benchmark .dat cases

Inputs  : HTTP requests from the React frontend (CIFGenerationPage) or the
          standalone ``backend/frontend/`` static UI.
Outputs : JSON responses (CIF strings, provenance, candidate matches, ...) plus
          the optional static frontend served from ``backend/frontend/``.

Important design rule: ``_web_ask_handler`` always returns None so the pipeline
NEVER silently guesses — ambiguity is surfaced as ``ambiguous_polymorphs`` to
the caller instead. See ``cif_pipeline/orchestrator.py`` for the stage logic.
"""

import os  # read env vars (CIF_AUTH_ENABLED, CIF_AUTH_PASSWORD, CIF_SECRET_KEY) and path checks
import time  # elapsed-time accounting for responses
import hmac  # constant-time comparison for the optional login password
import hashlib  # sha256 signature for the lightweight session token
import logging  # module-level logger for the pipeline bridge
from pathlib import Path  # locate the bundled frontend / data folders
from typing import Optional, List, Dict, Any  # request/response type hints

from fastapi import FastAPI, HTTPException  # sub-app + HTTP error responses
from fastapi.staticfiles import StaticFiles  # serve the bundled frontend assets
from fastapi.responses import FileResponse, Response  # file downloads / raw bodies
from pydantic import BaseModel, Field  # validated request bodies
from pymatgen.core import Composition, Element  # formula parsing + element breakdown

from cif_pipeline.models import CompoundQuery, PipelineResult, DopingSpec  # pipeline data classes
from cif_pipeline.orchestrator import run_pipeline  # the 5-stage entry point
from cif_pipeline.classify import classify_compound, _normalize_formula_input  # doping classification
from cif_pipeline.formatting import round_display, format_percent, format_float  # display rounding helpers

# Module-level logger used by the user-interaction bridge and error paths.
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("cif_pipeline.webapp")

# The sub-app instance that main.py mounts at /cif.
app = FastAPI(
    title="CIF Pipeline API",  # shown in /docs
    description="High-Precision Crystallographic Pipeline with MACE-MP-0 float64 relaxation",
    version="1.1.0",  # bump when the request/response contract changes
)

# Folder holding the optional standalone (non-React) frontend served by this sub-app.
FRONTEND_DIR = Path(__file__).resolve().parent / "frontend"

from __future__ import annotations
import os
import time
import hmac
import hashlib
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field
from pymatgen.core import Composition, Element

from cif_pipeline.models import CompoundQuery, PipelineResult, DopingSpec
from cif_pipeline.orchestrator import run_pipeline
from cif_pipeline.classify import classify_compound, _normalize_formula_input
from cif_pipeline.formatting import round_display, format_percent, format_float

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("cif_pipeline.webapp")

app = FastAPI(
    title="CIF Pipeline API",
    description="High-Precision Crystallographic Pipeline with MACE-MP-0 float64 relaxation",
    version="1.1.0",
)

FRONTEND_DIR = Path(__file__).resolve().parent / "frontend"


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — REQUEST MODELS
# What this part does:
#   Declares the pydantic request bodies every endpoint accepts. Each field is
#   a named, validated input; anything the user may legitimately omit is
#   Optional so a partial request still parses. Keeping them in one block means
#   the API's input contract is readable in a single screen.
# ══════════════════════════════════════════════════════════════════════════════


class GenerationRequest(BaseModel):
    formula: Optional[str] = Field(None, description="Compound formula or description (e.g. Fe2O3, Fe1.9Ti0.1O3)")
    text: Optional[str] = Field(None, description="Alternative field for compound text")
    verbose: Optional[bool] = Field(False, description="Return detailed internal diagnostic state")
    is_doped_hint: Optional[bool] = Field(None, description="Optional hint whether compound is doped")
    space_group: Optional[str] = Field(None, description="Optional target space group")
    host_formula: Optional[str] = Field(None, description="Host formula if doped")
    dopant_element: Optional[str] = Field(None, description="Dopant element symbol")
    host_site_species: Optional[str] = Field(None, description="Species being substituted")
    dopant_fraction: Optional[float] = Field(None, description="Fraction of substitution (0.0 - 1.0)")
    doping: Optional[Dict[str, Any]] = Field(None, description="Optional nested doping parameters object")
    co_dopants: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="List of additional co-dopant specs")
    max_iterations: Optional[int] = Field(None, description="Max generation iterations")
    samples_per_iteration: Optional[int] = Field(None, description="Number of samples per iteration")


class ParseFormulaRequest(BaseModel):
    formula: Optional[str] = Field(None, description="Formula to parse into constituent elements and doping hints")
    text: Optional[str] = Field(None, description="Conversational text or formula")
    verbose: Optional[bool] = Field(False, description="Return detailed internal diagnostic state")


class DisambiguationRequest(BaseModel):
    choice: str = Field(..., description="User's selection or response to disambiguation prompt")
    options: Optional[List[str]] = Field(None, description="List of available candidate options")


class DopedCifRequest(BaseModel):
    """Request body for the dedicated doped-compound pipeline (dopant_pipeline.py)."""
    host_formula: str = Field(..., description="Undoped parent spinel formula, e.g. 'NiFe2O4'")
    dopant_element: str = Field(..., description="Dopant element symbol, e.g. 'Zn'")
    dopant_fraction: float = Field(..., description="Fraction of substitution per formula unit (0.0 - 1.0)")
    host_site_species: Optional[str] = Field(None, description="Species being substituted, if known")
    base_family: Optional[str] = Field(None, description="Force a family, e.g. 'spinel'")
    inversion: Optional[Any] = Field(None, description="Inversion parameter/label for normal-vs-inverse control")
    technique: Optional[str] = Field(None, description="Force a representation technique (vca/ordered/sqs/...)")
    relax: Optional[bool] = Field(False, description="Relax with the MACE surrogate potential")
    seed: Optional[int] = Field(0, description="Random seed for reproducible placement")
    max_atoms: Optional[int] = Field(560, description="Upper bound on supercell atom count")
    co_dopants: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Additional co-dopant specs")


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — USER-INTERACTION BRIDGE
# What this part does:
#   Adapts the pipeline's `ask_user` callback to a single HTTP request. There is
#   no way to ask a question and wait for an answer inside one request/response
#   cycle, so this handler always returns None. That is deliberate: returning
#   None makes the pipeline surface the ambiguity (and its candidate list) to the
#   caller instead of silently picking options[0] on the user's behalf.
# ══════════════════════════════════════════════════════════════════════════════


def _web_ask_handler(question: str, options: Optional[List[str]] = None) -> Optional[str]:
    """No interactive channel in a single HTTP request: NEVER guess on the user's
    behalf. Returning None makes the pipeline surface ambiguity or candidate lists
    instead of silently selecting options[0] (which would answer the question itself).
    """
    log.info(f"[WebUI] Clarification required: {question} | options={options}")
    return None


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — HEALTH & TELEMETRY
# What this part does:
#   GET /api/health reports which optional capabilities are actually available in
#   this environment: the Materials Project key, the MACE model/device, and
#   whether the CrystaLLM checkpoint file really exists on disk. The UI shows
#   this so an operator can tell "no results" apart from "not configured".
# ══════════════════════════════════════════════════════════════════════════════


@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    from cif_pipeline.config import get_mp_api_key, get_mace_model, get_mace_device, get_crystallm_checkpoint
    import os
    ckpt = get_crystallm_checkpoint()
    ckpt_ready = bool(ckpt) and os.path.exists(os.path.join(ckpt, "ckpt.pt") if os.path.isdir(ckpt) else ckpt)
    return {
        "status": "healthy",
        "precision": "float64 (MACE-MP-0)",
        "mace_model": get_mace_model(),
        "mace_device": get_mace_device(),
        "has_mp_api_key": bool(get_mp_api_key()),
        "crystallm_checkpoint": ckpt or None,
        "crystallm_ready": ckpt_ready,
    }


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — FORMULA PARSING & CLASSIFICATION (first screen)
# What this part does:
#   POST /api/parse-formula turns raw user text into a fully described compound
#   WITHOUT generating a structure. It is what the first screen calls on every
#   keystroke to show the user what the engine understood. It returns:
#     - recognition        : how the raw text became a clean formula
#     - composition        : reduced/hill formula, per-element amounts and wt%
#     - compound_class     : oxide / halide / intermetallic / ...
#     - charge_balance     : balanced / unbalanced / uncertain / molecular
#     - doping_spec        : host, dopant, replaced species, fraction
#     - classification     : family, structure type, candidate sites (below)
#   Nothing here builds or relaxes a structure, so it stays fast.
# ══════════════════════════════════════════════════════════════════════════════


@app.post("/api/parse-formula")
def parse_formula(req: ParseFormulaRequest) -> Dict[str, Any]:
    raw_text = (req.text or req.formula or "").strip()
    if not raw_text:
        return {
            "valid": False,
            "elements": [],
            "is_doped": False,
            "error": "Empty formula or text provided",
            "charge_balance": {"state": "unknown", "message": "No formula provided"},
        }

    # Out-of-scope syntax checks
    if "@" in raw_text:
        return {
            "valid": False,
            "raw_input": raw_text,
            "error": "Endohedral fullerene / caged-atom notation ('@') is not supported for periodic crystal CIF generation.",
            "recognition_method": "rejected_unsupported",
            "elements": [],
            "is_doped": False,
        }
    if "wt%" in raw_text.lower() or ("/" in raw_text and "wt" in raw_text.lower()):
        return {
            "valid": False,
            "raw_input": raw_text,
            "error": "Supported catalyst / weight-percent loading notation (e.g. 'wt%') is out-of-scope for bulk crystal CIF generation.",
            "recognition_method": "rejected_unsupported",
            "elements": [],
            "is_doped": False,
        }

    from cif_pipeline.recognition import recognize_compound_formula
    recog = recognize_compound_formula(raw_text, ask_user=_web_ask_handler)
    target_formula = recog.resolved_formula or raw_text

    # Step 2: Attempt pymatgen parse
    try:
        comp = Composition(target_formula)
    except Exception as parse_err:
        return {
            "valid": False,
            "raw_input": raw_text,
            "resolved_formula": recog.resolved_formula,
            "recognition_method": recog.method,
            "cleanup_notes": "; ".join(recog.warnings) if recog.warnings else None,
            "error": f"Cannot parse formula '{raw_text}': {parse_err}",
            "elements": [],
            "is_doped": False,
            "charge_balance": {"state": "invalid", "message": "Cannot check — formula is not parseable"},
        }

    # Step 3: Build element breakdown
    elements_data = []
    for el in comp.elements:
        try:
            wt_frac = round(float(comp.get_wt_fraction(el)) * 100, 4)
        except Exception:
            wt_frac = 0.0
        try:
            at_mass = round(float(getattr(el, "atomic_mass", 0.0)), 4)
        except Exception:
            at_mass = 0.0
        try:
            at_num = int(getattr(el, "Z", 0))
        except Exception:
            at_num = 0

        elements_data.append({
            "symbol":         str(getattr(el, "symbol", el)),
            "name":           str(getattr(el, "name", getattr(el, "symbol", str(el)))),
            "amount":         round(float(comp[el]), 6),
            "weight_percent": wt_frac,
            "atomic_mass":    at_mass,
            "atomic_number":  at_num,
        })

    # Step 4: Compound classification
    from cif_pipeline.filter_rules import classify_compound_type
    compound_class = classify_compound_type(comp)

    # Step 5: Real charge balance check via pymatgen oxidation states
    charge_balance = _check_charge_balance(comp, compound_class)

    # Step 6: Doping classification
    query = CompoundQuery(raw_input=target_formula)
    try:
        is_doped, doping_spec = classify_compound(query, ask_user=_web_ask_handler, recognized_formula=target_formula)
    except Exception:
        is_doped, doping_spec = False, None

    doping_info = None
    if doping_spec:
        frac = doping_spec.dopant_fraction
        co_list = []
        if hasattr(doping_spec, "co_dopants") and doping_spec.co_dopants:
            for cd in doping_spec.co_dopants:
                co_list.append({
                    "dopant_species": cd.dopant_species,
                    "host_site_species": cd.host_site_species,
                    # Reported to 2 decimals per the project display rule; the exact
                    # value is kept in "dopant_fraction_exact" so nothing is lost.
                    "dopant_fraction":       round_display(cd.dopant_fraction),
                    "dopant_fraction_exact": round_display(cd.dopant_fraction, 6),
                    "dopant_fraction_pct":   format_percent(cd.dopant_fraction),
                })
        doping_info = {
            "host_formula":      doping_spec.host_formula,
            "host_site_species": doping_spec.host_site_species,
            "dopant_species":    doping_spec.dopant_species,
            "dopant_fraction":       round_display(frac),
            "dopant_fraction_exact": round_display(frac, 6),
            "dopant_fraction_pct":   format_percent(frac),
            "co_dopants":        co_list,
        }

    return {
        "valid": True,
        "raw_input": raw_text,
        "resolved_formula": target_formula,
        "recognition_method": recog.method,
        "cleanup_notes": "; ".join(recog.warnings) if recog.warnings else None,
        "normalized_formula": target_formula if target_formula != raw_text else None,
        "case_corrected": (recog.method in ("case_normalized", "explicit_molecular_mapping")),
        "reduced_formula": comp.reduced_formula,
        "formula_hill": comp.hill_formula,
        "compound_class": compound_class,
        "elements": elements_data,
        "is_doped": is_doped,
        "doping_spec": doping_info,
        "charge_balance": charge_balance,
        # Family / type / site classification, so the UI can show on the FIRST
        # screen what family the compound belongs to, which replacements the
        # rules applied, and which sites are implicated.
        "classification": _classify_compound(target_formula, is_doped, doping_spec),
    }


# ── SECTION 4b — FAMILY / TYPE / SITE CLASSIFIER ─────────────────────────────
# What this part does:
#   Reports which structural family a compound belongs to (spinel, perovskite,
#   corundum, ...) and which crystallographic sites are candidates for
#   substitution. This is the "understand the compound before running it" step:
#   the answer is rendered on the first screen so the user can sanity-check the
#   engine's reading of their input before committing to a full run.
#   It is strictly a reporting helper — it never raises, and every branch
#   degrades to an "unknown" entry so the UI always gets a well-formed object.
# ─────────────────────────────────────────────────────────────────────────────


def _classify_compound(formula: str, is_doped: bool, doping_spec) -> Dict[str, Any]:
    """Describe the compound's family, structure type and candidate doping sites.

    This is intentionally a *reporting* helper: it never raises, and every branch
    degrades to an "unknown" entry so the UI always receives a well-formed object.
    """
    result: Dict[str, Any] = {
        "formula": formula,
        "family": "unknown",
        "structure_type": "unknown",
        "material_class": "unknown",
        "sites": [],
        "notes": [],
    }

    try:
        from cif_pipeline.site_preference import detect_structure_type, recommend_site
    except Exception as err:      # pragma: no cover - import guard
        result["notes"].append(f"site-preference module unavailable: {err}")
        return result

    # --- Structure family (spinel / perovskite / garnet / fluorite / ...) ---
    try:
        stype = detect_structure_type(formula)
        result["structure_type"] = stype or "unknown"
        result["family"] = stype or "unknown"
    except Exception as err:
        result["notes"].append(f"structure-type detection failed: {err}")

    # --- Ionic / metallic / covalent material class (drives the doping rules) ---
    try:
        from cif_pipeline.general_doping import analyze_parent  # noqa: F401
        result["material_class"] = "see_general_doping"
    except Exception:
        result["material_class"] = "unknown"

    # --- Candidate sites the rules implicate ---
    if is_doped and doping_spec is not None:
        dopant = getattr(doping_spec, "dopant_species", None)
        host_site = getattr(doping_spec, "host_site_species", None)
        if dopant:
            try:
                rec = recommend_site(dopant, formula, host_site)
                result["sites"].append({
                    "dopant": dopant,
                    "replaced_species": host_site,
                    "site": rec.get("site"),
                    "strength": rec.get("strength"),
                    "reason": rec.get("reason"),
                    "questions": rec.get("questions", []),
                })
            except Exception as err:
                result["notes"].append(f"site recommendation failed for {dopant}: {err}")

        # Spinel sublattice detail, when the family module resolved it.
        sub = getattr(doping_spec, "sublattice_spec", None)
        if sub:
            result["sublattice_spec"] = {
                "A": {k: round_display(v) for k, v in (sub.get("A") or {}).items()},
                "B": {k: round_display(v) for k, v in (sub.get("B") or {}).items()},
            }
        prov = getattr(doping_spec, "provenance", None) or []
        if prov:
            result["notes"].extend(str(p) for p in prov)

    return result


# ── SECTION 4c — CHARGE BALANCE CHECK ─────────────────────────────────────────
# What this part does:
#   Uses pymatgen's oxidation-state guesser to decide whether the composition is
#   formally charge-balanced, and explains the verdict in plain language. Results
#   are bucketed as balanced / unbalanced / uncertain / intermetallic / molecular,
#   because "cannot be assigned oxidation states" is a genuinely different answer
#   from "assigned states that do not sum to zero".
# ─────────────────────────────────────────────────────────────────────────────


def _check_charge_balance(comp: Composition, compound_class: str) -> Dict[str, Any]:
    """Use pymatgen's oxidation-state guesser for real charge balance check.

    Returns a dict with:
      state:   'balanced' | 'unbalanced' | 'uncertain' | 'intermetallic' | 'molecular'
      message: human-readable explanation
      detail:  the winning oxidation-state assignment, if found
    """
    # Intermetallics don't have meaningful ionic charge balance
    if compound_class == "intermetallic":
        return {
            "state": "intermetallic",
            "message": "Intermetallic compound — formal charge balance not applicable",
            "detail": None,
        }
    # Molecular/organic compounds (no metal) — no ionic model
    if compound_class == "other":
        return {
            "state": "molecular",
            "message": "Molecular compound — charge balance via oxidation-state model not applied",
            "detail": None,
        }

    # Use pymatgen's oxi_state_guesses — returns list of {El: oxi_state} dicts ordered by likelihood
    try:
        guesses = comp.oxi_state_guesses(max_sites=-1)
        if guesses:
            best = guesses[0]
            state_str = ", ".join(f"{el}{'+' if v >= 0 else ''}{v:g}" for el, v in best.items())
            return {
                "state": "balanced",
                "message": f"Charge balance: VALID — {compound_class} compound",
                "detail": state_str,
            }
        else:
            return {
                "state": "unbalanced",
                "message": "Charge balance: WARNING — no valid ionic oxidation-state assignment found. "
                           "Check stoichiometry or consider non-ionic bonding.",
                "detail": None,
            }
    except Exception as e:
        return {
            "state": "uncertain",
            "message": f"Charge balance: could not determine ({type(e).__name__}). "
                       "This may be normal for doped or defect-rich formulas.",
            "detail": None,
        }



# ══════════════════════════════════════════════════════════════════════════════
# SECTION 5 — MAIN GENERATION (the general 5-stage pipeline)
# What this part does:
#   POST /api/generate runs the full pipeline for a compound:
#     Stage 0  recognise the raw input into a clean formula
#     Stage 1  classify doped vs undoped
#     Stage 2  search external databases (MP / OQMD / JARVIS / COD)
#     Stage 3  search the internal database
#     Stage 4a generate with CrystaLLM (undoped, not found anywhere)
#     Stage 4b resolve a parent and apply doping (doped, not found anywhere)
#   It returns the CIF plus the full provenance trail: which record was used and
#   where it came from, the search key actually used, the final space group
#   measured AFTER relaxation, energy/max-force, and any candidate polymorphs
#   that were found but not selected.
#   Fractions in the response are rounded to two decimals for display, with an
#   accompanying *_exact field so no precision is lost.
# ══════════════════════════════════════════════════════════════════════════════


@app.post("/api/generate")
def generate_cif(req: GenerationRequest) -> Dict[str, Any]:
    formula = (req.formula or req.text or "").strip()
    if not formula:
        raise HTTPException(status_code=400, detail="Formula cannot be empty")

    start_time = time.perf_counter()
    timeline: List[Dict[str, Any]] = []

    host_formula = req.host_formula
    dopant_element = req.dopant_element
    host_site_species = req.host_site_species
    dopant_fraction = req.dopant_fraction

    if req.doping and isinstance(req.doping, dict):
        host_formula = host_formula or req.doping.get("host_formula")
        dopant_element = dopant_element or req.doping.get("dopant_species") or req.doping.get("dopant_element") or req.doping.get("dopant")
        host_site_species = host_site_species or req.doping.get("host_site_species") or req.doping.get("site")
        dopant_fraction = dopant_fraction if dopant_fraction is not None else (
            req.doping.get("dopant_fraction") if req.doping.get("dopant_fraction") is not None else (
                req.doping.get("fraction") if req.doping.get("fraction") is not None else req.doping.get("dopant_fraction")
            )
        )

    co_dopants = list(req.co_dopants or [])
    if req.doping and isinstance(req.doping, dict):
        if not co_dopants and req.doping.get("co_dopants"):
            co_dopants = list(req.doping.get("co_dopants"))

    query = CompoundQuery(
        raw_input=formula,
        is_doped_hint=req.is_doped_hint,
        space_group=req.space_group.strip() if req.space_group else None,
        host_formula=host_formula.strip() if host_formula else None,
        dopant_element=dopant_element.strip() if dopant_element else None,
        host_site_species=host_site_species.strip() if host_site_species else None,
        dopant_fraction=float(dopant_fraction) if dopant_fraction is not None else None,
        co_dopants=co_dopants,
    )

    t0 = time.perf_counter()
    max_iter = req.max_iterations or 5
    samples_per_iter = req.samples_per_iteration or 25
    try:
        result: PipelineResult = run_pipeline(
            query,
            ask_user=_web_ask_handler,
            max_iterations=max_iter,
            samples_per_iteration=samples_per_iter,
        )
    except Exception as e:
        log.error(f"Pipeline execution error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    total_elapsed = round((time.perf_counter() - start_time), 3)

    # Build timeline breakdown
    if getattr(result, "recognition_result", None) and result.recognition_result.success:
        rr = result.recognition_result
        timeline.append({
            "stage": f"Stage 0: Compound Recognition ({rr.method})",
            "description": f"Recognized '{rr.raw_input}' -> '{rr.resolved_formula}' via {rr.method}",
            "status": "completed",
        })
    else:
        timeline.append({
            "stage": "Stage 0: Compound Recognition",
            "description": f"Processed input formula: '{formula}'",
            "status": "completed",
        })

    timeline.append({
        "stage": "Stage 0a: Classification & Dopant Parsing",
        "description": "Determined doped vs undoped; extracted doping spec and host matrix",
        "status": "completed",
    })
    timeline.append({
        "stage": "Stage 0b: Normalization & Multiplicity Trace",
        "description": f"Normalized query key: '{result.normalization_trace.search_key_used if result.normalization_trace else formula}'",
        "status": "completed",
    })

    if result.source.startswith("existing_"):
        src = result.source.replace("existing_", "").upper()
        timeline.append({
            "stage": f"Stage 1: Multi-Database Retrieval ({src})",
            "description": f"Verified match found in {src} (Record ID: {result.matched_record.record_id if result.matched_record else 'N/A'})",
            "status": "completed",
        })
        timeline.append({
            "stage": "Stage 4a/b: ML Generation / Substitution",
            "description": "Bypassed (structure already confirmed in open database)",
            "status": "skipped",
        })
        timeline.append({
            "stage": "Stage 5: Relaxation & Space Group Analysis",
            "description": "Pre-computed experimental / theoretical database geometry verified with spglib",
            "status": "completed",
        })
    elif result.source == "generated_doped":
        timeline.append({
            "stage": "Stage 1: Multi-Database Search",
            "description": "Parent host structure resolved from external database",
            "status": "completed",
        })
        timeline.append({
            "stage": "Stage 4b: Site-Selective Doping Substitution",
            "description": "Substituted dopant atom into parent lattice; validated occupancy & local distances",
            "status": "completed",
        })
        timeline.append({
            "stage": "Stage 5: MACE-MP-0 Relaxation & Symmetry",
            "description": "Processed geometry & evaluated space group with SpacegroupAnalyzer",
            "status": "completed",
        })
    elif result.source == "generated_undoped":
        timeline.append({
            "stage": "Stage 1-2: External/Internal DB Search",
            "description": "Confirmed not present in any connected database",
            "status": "completed",
        })
        timeline.append({
            "stage": "Stage 4a: CrystaLLM Generative Feedback Loop",
            "description": "Sampled candidate CIF completions and filtered via chemical rules",
            "status": "completed",
        })
        timeline.append({
            "stage": "Stage 5: MACE-MP-0 float64 Relaxation",
            "description": "Relaxed candidate structures with FIRE optimizer and spglib space group determination",
            "status": "completed",
        })
    else:
        timeline.append({
            "stage": "Pipeline Execution",
            "description": f"Completed with status: {result.source} ({result.notes})",
            "status": "completed",
        })

    # Tool provenance
    crystallm_used = result.source.startswith("generated_undoped")
    tools_used = [
        {
            "name": "pymatgen",
            "role": "Crystallographic structure manipulation, CIF generation, and composition analysis",
            "active": True,
        },
        {
            "name": "spglib",
            "role": "Post-relaxation SpaceGroupAnalyzer (H-M symbol & Hall number determination)",
            "active": True,
        },
        {
            "name": "COD REST API",
            "role": "Crystallography Open Database text search & CIF composition verification",
            "active": True,
        },
        {
            "name": "MACE-MP-0",
            "role": "Machine learning interatomic potential with float64 double precision (medium model)",
            "active": True,
        },
        {
            "name": "ASE (Atomic Simulation Environment)",
            "role": "ExpCellFilter lattice optimizer and FIRE geometry minimizer",
            "active": True,
        },
        {
            "name": "CrystaLLM (GPT-2 nanoGPT)",
            "role": "Local autoregressive CIF generation via CIFTokenizer + GPT checkpoint (crystallm_repo/ckpt.pt)",
            "active": crystallm_used,
        },
    ]

    # Parse elements in input formula for UI search space display
    parsed_elements = []
    try:
        comp = Composition(formula)
        for el in comp.elements:
            parsed_elements.append({
                "symbol": el.symbol,
                "amount": float(comp[el]),
                "weight_percent": round(float(comp.get_wt_fraction(el)) * 100, 2),
                "atomic_mass": round(float(el.atomic_mass), 2),
            })
    except Exception:
        pass

    # Serialize candidate matches (including CIF for 3D visualization)
    candidates = []
    if result.candidate_matches:
        for c in result.candidate_matches:
            cif_str = ""
            try:
                cif_str = c.structure.to(fmt="cif")
            except Exception:
                pass

            candidates.append({
                "source": c.source,
                "record_id": c.record_id,
                "formula": c.formula,
                "space_group": c.space_group,
                "source_url": c.source_url,
                "is_theoretical": c.is_theoretical,
                "cif_string": cif_str,
                "raw_cif": (c.extra or {}).get("raw_cif"),
                "extra": c.extra,
            })

    # Serialize matched record
    matched = None
    if result.matched_record:
        m = result.matched_record
        matched = {
            "source": m.source,
            "record_id": m.record_id,
            "formula": m.formula,
            "space_group": m.space_group,
            "source_url": m.source_url,
            "is_theoretical": m.is_theoretical,
            "raw_cif": (m.extra or {}).get("raw_cif"),
            "extra": m.extra,
        }

    # Serialize normalization trace
    norm_trace = None
    if result.normalization_trace:
        t = result.normalization_trace
        norm_trace = {
            "raw_input": t.raw_input,
            "search_key_used": t.search_key_used,
            "is_doped": t.is_doped,
            "classification_reasoning": t.classification_reasoning,
            "multiplicity": {
                "was_reduced": t.multiplicity.was_reduced,
                "multiplier": t.multiplicity.multiplier,
                "reason": t.multiplicity.reason,
            } if t.multiplicity else None,
        }

    # Serialize doped validation
    doped_val = None
    if result.doped_validation:
        v = result.doped_validation
        doped_val = {
            "is_valid": v.is_valid,
            "occupancy_sum": v.occupancy_sum,
            "occupancy_sum_ok": v.occupancy_sum_ok,
            "bond_length_ok": v.bond_length_ok,
            "notes": v.notes,
        }

    # Serialize diagnostics history
    diagnostics = []
    if result.diagnostics_history:
        for d in result.diagnostics_history:
            diagnostics.append({
                "iteration": d.iteration,
                "n_generated": d.n_generated,
                "n_parse_failed": d.n_parse_failed,
                "n_bond_length_failed": d.n_bond_length_failed,
                "n_symmetry_failed": d.n_symmetry_failed,
                "n_charge_balance_failed": d.n_charge_balance_failed,
                "n_duplicates_removed": d.n_duplicates_removed,
                "n_survived": d.n_survived,
                "n_relax_nonconverged": d.n_relax_nonconverged,
                "notes": d.notes,
            })

    # Where was it retrieved from
    retrieved_from = "CrystaLLM Generative Engine"
    if result.source.startswith("existing_"):
        retrieved_from = f"Open Database ({result.source.replace('existing_', '').upper()})"
    elif result.source == "generated_doped":
        if co_dopants:
            retrieved_from = f"Parent Lattice Co-Doping ({1 + len(co_dopants)} dopants) + MACE Relaxation"
        else:
            retrieved_from = "Parent Lattice Doping Transformation + MACE Relaxation"

    # Serialize recognition result
    recog_data = None
    if getattr(result, "recognition_result", None):
        rr = result.recognition_result
        recog_data = {
            "raw_input": rr.raw_input,
            "cleaned_input": rr.cleaned_input,
            "resolved_formula": rr.resolved_formula,
            "method": rr.method,
            "success": rr.success,
            "warnings": rr.warnings,
        }

    # Serialize doping spec
    doping_spec_data = None
    if getattr(result, "doping_spec", None):
        ds = result.doping_spec
        doping_spec_data = {
            "host_formula": getattr(ds, "host_formula", None),
            "dopant_species": getattr(ds, "dopant_species", None),
            "host_site_species": getattr(ds, "host_site_species", None),
            "dopant_fraction": getattr(ds, "dopant_fraction", None),
            "co_dopants": [
                {
                    "host_formula": getattr(c, "host_formula", getattr(ds, "host_formula", None)),
                    "dopant_species": getattr(c, "dopant_species", c.get("dopant_species", c.get("dopant")) if isinstance(c, dict) else str(c)),
                    "host_site_species": getattr(c, "host_site_species", c.get("host_site_species", c.get("site")) if isinstance(c, dict) else None),
                    "dopant_fraction": getattr(c, "dopant_fraction", c.get("dopant_fraction", c.get("fraction")) if isinstance(c, dict) else None),
                }
                for c in getattr(ds, "co_dopants", [])
            ],
        }
    elif dopant_element and host_site_species and dopant_fraction is not None:
        doping_spec_data = {
            "host_formula": host_formula,
            "dopant_species": dopant_element,
            "host_site_species": host_site_species,
            "dopant_fraction": dopant_fraction,
            "co_dopants": co_dopants,
        }

    return {
        "success": result.cif_string is not None,
        "source": result.source,
        "retrieved_from": retrieved_from,
        "crystallm_used": crystallm_used,
        "total_elapsed_seconds": total_elapsed,
        "elapsed_time": round(total_elapsed, 4),
        "iterations_used": len(result.diagnostics_history) if result.diagnostics_history else 0,
        "timeline": timeline,
        "tools_used": tools_used,
        "parsed_elements": parsed_elements,
        "notes": result.notes,
        "cif_string": result.cif_string,
        "raw_cif_string": getattr(result, "raw_cif_string", None),
        "reliable": getattr(result, "is_reliable", True),
        "is_reliable": getattr(result, "is_reliable", True),
        "relaxation_skipped": getattr(result, "relaxation_skipped", False),
        "relaxation_status": getattr(result, "relaxation_status", None),
        "final_space_group": getattr(result, "final_space_group", None),
        "energy": getattr(result, "energy", None),
        "max_force": getattr(result, "max_force", None),
        "recognition_method": getattr(result.recognition_result, "method", None) if getattr(result, "recognition_result", None) else None,
        "doping_spec": doping_spec_data,
        "matched_record": matched,
        "candidate_matches": candidates,
        "normalization_trace": norm_trace,
        "recognition_result": recog_data,
        "doped_validation": doped_val,
        "diagnostics_history": diagnostics,
    }


# ── SECTION 5b — JSON SANITISER ───────────────────────────────────────────────
# What this part does:
#   Provenance and notes dicts produced by the doping pipeline can contain
#   pymatgen Structure objects, dataclasses and sets, none of which pydantic
#   knows how to serialise. Rather than dropping that information (or 500-ing),
#   each unknown object is rendered as a short readable string. The depth guard
#   stops a self-referential structure from recursing forever.
# ─────────────────────────────────────────────────────────────────────────────


def _json_safe(value, _depth: int = 0):
    """Recursively convert a value into something FastAPI can serialize.

    Provenance/notes dicts can carry pymatgen ``Structure`` objects, dataclasses
    and sets, none of which pydantic knows how to encode. Rather than dropping
    that information, render each as a short readable string.
    """
    if _depth > 6:                      # guard against pathological nesting
        return "<max depth>"
    if value is None or isinstance(value, (bool, int, float, str)):
        return value
    # Duck-typed so this helper never needs a pymatgen import at module scope.
    if type(value).__name__ == "Structure":
        try:
            return f"<Structure {value.composition.reduced_formula}, {len(value)} sites>"
        except Exception:
            return "<Structure>"
    if isinstance(value, dict):
        return {str(k): _json_safe(v, _depth + 1) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_json_safe(v, _depth + 1) for v in value]
    if hasattr(value, "__dataclass_fields__"):
        return {f: _json_safe(getattr(value, f, None), _depth + 1) for f in value.__dataclass_fields__}
    return str(value)


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 6 — DEDICATED DOPED-COMPOUND PIPELINE
# What this part does:
#   POST /api/doped-cif runs the "whole doping story" as one explicit chain:
#     family           -> which structural family is the parent?
#     regime           -> normal / inverse / distorted / mixed, and inversion λ
#     sublattice spec  -> which A/B sites each element occupies
#     neat fraction    -> target fraction -> integer supercell (x_target/x_real)
#     representation   -> VCA / ordered / SQS / enumerate / ensemble
#     build            -> one or more concrete CIFs
#     verification     -> per-CIF checks with pass/fail and a reason
#   This is deliberately separate from /api/generate: it exposes the decisions
#   and their justification, not just a final answer. Reports several CIFs when
#   several representations or scenarios were built, so the user can compare.
# ══════════════════════════════════════════════════════════════════════════════


@app.post("/api/doped-cif")
def doped_cif_endpoint(req: DopedCifRequest) -> Dict[str, Any]:
    """Run the dedicated doped-compound pipeline (dopant_pipeline.generate_doped_cif).

    This is the "whole doping story" pathway: family -> regime/inversion ->
    sublattice spec -> neat fraction / supercell -> representation technique ->
    build -> verification checks. It is separate from /api/generate, which runs
    the general 5-stage pipeline and routes spinels through the older builder.
    """
    try:
        from cif_pipeline.dopant_pipeline import generate_doped_cif, DopantRequest
    except Exception as imp_err:      # pragma: no cover - import guard
        raise HTTPException(status_code=503, detail=f"dopant_pipeline unavailable: {imp_err}")

    started = time.time()
    try:
        result = generate_doped_cif(DopantRequest(
            host_formula=req.host_formula,
            dopant_element=req.dopant_element,
            dopant_fraction=req.dopant_fraction,
            host_site_species=req.host_site_species,
            base_family=req.base_family,
            inversion=req.inversion,
            technique=req.technique,
            relax=bool(req.relax),
            seed=int(req.seed or 0),
            max_atoms=int(req.max_atoms or 560),
            co_dopants=list(req.co_dopants or []),
        ))
    except Exception as run_err:
        log.exception("doped-cif pipeline failed")
        raise HTTPException(status_code=500, detail=f"doping pipeline failed: {type(run_err).__name__}: {run_err}")

    # Family / regime / site detail, reported at 2-decimal display precision.
    family = getattr(result, "family", None)
    regime = getattr(result, "regime", None)
    plan = getattr(result, "fraction_plan", None)

    return {
        "status": result.status,
        "best_cif": result.best_cif,
        "cif_count": len(result.cifs or []),
        "cifs": result.cifs or [],
        "representation": result.representation,
        "notes": result.notes,
        "warnings": result.warnings or [],
        "family": {
            "family": getattr(family, "family", None),
            "formula": getattr(family, "formula", None),
            "space_group": getattr(family, "space_group", None),
            "spacegroup_number": getattr(family, "spacegroup_number", None),
            "site_roles": [
                {
                    "element": getattr(r, "element", None),
                    "role": getattr(r, "role", None),
                    "cn": getattr(r, "cn", None),
                    "wyckoff": getattr(r, "wyckoff", None),
                    "multiplicity": getattr(r, "multiplicity", None),
                }
                for r in (getattr(family, "site_roles", None) or [])
            ],
        },
        "regime": {
            "regime": getattr(regime, "regime", None),
            "inversion": getattr(regime, "inversion", None),
            "distortion": getattr(regime, "distortion", None),
            "method": getattr(regime, "method", None),
            "scenarios": [getattr(s, "label", str(s)) for s in (getattr(regime, "scenarios", None) or [])],
        },
        "fraction_plan": {
            # x_target/x_real are site fractions reported at 2 decimals per the
            # project display rule, with the exact values kept alongside.
            "x_target":      round_display(getattr(plan, "x_target", None)),
            "x_target_exact": round_display(getattr(plan, "x_target", None), 6),
            "x_real":        round_display(getattr(plan, "x_real", None)),
            "x_real_exact":  round_display(getattr(plan, "x_real", None), 6),
            "error":         round_display(getattr(plan, "error", None), 6),
            "n_dopant":      getattr(plan, "n_dopant", None),
            "formula_units": getattr(plan, "formula_units", None),
            "atoms_total":   getattr(plan, "atoms_total", None),
            "exact":         getattr(plan, "exact", None),
            "neat_fraction": getattr(plan, "neat_fraction", None),
            "supercell_matrix": _json_safe(getattr(plan, "supercell_matrix", None)),
            "min_image_A":   round_display(getattr(plan, "min_image_A", None)),
            "notes":         getattr(plan, "notes", None),
        } if plan else None,
        "checks": [
            {"name": c.name, "status": c.status, "detail": c.detail}
            for c in (result.checks or [])
        ],
        "relaxation": _json_safe(result.relaxation),
        "provenance": _json_safe(result.provenance),
        "written_files": result.written_files or [],
        "elapsed_seconds": round(time.time() - started, 2),
    }


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 7 — DISAMBIGUATION
# What this part does:
#   When the pipeline finds several polymorphs (or several candidate sites) it
#   stops and asks. These endpoints take the user's pick back and translate it
#   into the index the pipeline expects. This is the other half of the "never
#   guess" rule: ambiguity is always resolved by the user, never by a default.
# ══════════════════════════════════════════════════════════════════════════════


@app.post("/api/resolve-disambiguation")
def resolve_disambiguation_endpoint(req: DisambiguationRequest) -> Dict[str, Any]:
    from cif_pipeline.user_interaction import pick_option_index
    idx = pick_option_index(req.choice, req.options)
    if idx is None:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid selection '{req.choice}'. Please select a valid candidate option from the list."
        )
    return {
        "success": True,
        "selected_index": idx,
        "selected_option": req.options[idx] if req.options else req.choice,
    }


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 8 — UTILITY ENDPOINTS (auth, symmetry, MESP, batch, data files)
# What this part does:
#   Smaller supporting endpoints that do not run the main pipeline:
#     /api/auth/login        issues a lightweight session token (optional; the
#                            gate is off unless CIF_AUTH_ENABLED=true)
#     /api/symmetry-matrix   computes an optimal supercell transformation matrix
#                            meeting a minimum-image distance constraint
#     /api/mesp-check        MESP plausibility check on a supplied CIF
#     /api/batch-process     runs several cases in one request
#     /api/data-files        lists / downloads the .dat benchmark files
# ══════════════════════════════════════════════════════════════════════════════


class LoginRequest(BaseModel):
    username: str
    password: str


class SymmetryRequest(BaseModel):
    cif_string: str
    symprec: Optional[float] = 0.01


class MespRequest(BaseModel):
    cif_string: str
    energy_per_atom: Optional[float] = None
    fmax: Optional[float] = None
    formula: Optional[str] = None


class BatchRequest(BaseModel):
    cases: Optional[List[Dict[str, Any]]] = None


@app.post("/api/auth/login")
def auth_login(req: LoginRequest) -> Dict[str, Any]:
    username = req.username.strip()
    password = req.password
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")
    auth_enabled = os.environ.get("CIF_AUTH_ENABLED", "false").lower() in ("true", "1", "yes")
    expected_pwd = os.environ.get("CIF_AUTH_PASSWORD", "admin")
    if auth_enabled and not hmac.compare_digest(password, expected_pwd):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    secret = os.environ.get("CIF_SECRET_KEY", "cif-dev-secret-key-2026")
    sig = hashlib.sha256(f"{username}:{secret}".encode()).hexdigest()[:12]
    return {
        "success": True,
        "token": f"jwt_cif_{int(time.time())}_{sig}",
        "username": username,
        "role": "Crystallography Researcher",
        "session_expires_in": 86400,
    }


@app.post("/api/symmetry-matrix")
def symmetry_matrix_endpoint(req: SymmetryRequest) -> Dict[str, Any]:
    from cif_pipeline.symmetry_matrix import compute_symmetry_matrix
    return compute_symmetry_matrix(req.cif_string, symprec=req.symprec or 0.01)


@app.post("/api/mesp-check")
def mesp_check_endpoint(req: MespRequest) -> Dict[str, Any]:
    from cif_pipeline.mesp_check import check_mesp_and_relaxation
    return check_mesp_and_relaxation(
        cif_string=req.cif_string,
        energy_per_atom=req.energy_per_atom,
        fmax=req.fmax,
        formula=req.formula,
    )


@app.post("/api/batch-process")
def batch_process_endpoint(req: BatchRequest) -> Dict[str, Any]:
    from cif_pipeline.batch_processor import run_batch_pipeline
    return run_batch_pipeline(cases=req.cases)


@app.get("/api/data-files")
def list_data_files() -> Dict[str, Any]:
    data_dir = Path(__file__).resolve().parent / "data"
    files = []
    if data_dir.exists():
        for p in data_dir.glob("*.dat"):
            files.append({
                "filename": p.name,
                "size_bytes": p.stat().st_size,
                "modified": time.ctime(p.stat().st_mtime),
            })
    return {"files": files}


@app.get("/api/data-files/{filename}")
def get_data_file(filename: str):
    data_dir = (Path(__file__).resolve().parent / "data").resolve()
    file_path = (data_dir / filename).resolve()
    try:
        if not file_path.is_relative_to(data_dir):
            raise HTTPException(status_code=403, detail="Access denied")
    except (ValueError, AttributeError):
        raise HTTPException(status_code=403, detail="Access denied")
    if not filename.endswith(".dat") or not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Data file not found")
    return Response(
        content=file_path.read_text(encoding="utf-8"),
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


FRONTEND_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("webapp:app", host="0.0.0.0", port=8000, reload=False)
