"""
ehull_service.py
================
Unified thermodynamic stability (Energy Above Hull, E_hull) service.
Integrates Materials Project Convex Hull API with CHGNet / local Phase Diagram calculations.
Supports both single-structure and batch CIF predictions.
"""

import os
import sys
import logging
from pathlib import Path
from typing import Union, List, Dict, Any, Optional

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

# Load core Ehull Calculator
try:
    from ehull_tool import EhullCalculator
    EHULL_TOOL_AVAILABLE = True
except Exception as e:
    logging.warning(f"[EHullService] Could not import EhullCalculator: {e}")
    EHULL_TOOL_AVAILABLE = False

from mp_api.client import MPRester
from pymatgen.core import Structure

log = logging.getLogger("ehull_service")
DEFAULT_MP_API_KEY = os.environ.get("MP_API_KEY", "UVRcjuj5VZrKy46PcpCVh6bVrl9UVs3f").strip()
CACHE_DIR = HERE / "mp_cache"
CACHE_DIR.mkdir(exist_ok=True)


class EhullService:
    """
    Singleton service for predicting Energy Above Hull (E_hull) and thermodynamic stability.
    """
    _instance: Optional["EhullService"] = None

    def __init__(self, api_key: Optional[str] = None, cache_dir: Optional[Path] = None):
        self.api_key = (api_key or DEFAULT_MP_API_KEY).strip()
        self.cache_dir = cache_dir or CACHE_DIR
        self.calculator: Optional[Any] = None
        self._init_calculator()

    @classmethod
    def get_instance(cls) -> "EhullService":
        if cls._instance is None:
            cls._instance = EhullService()
        return cls._instance

    def _init_calculator(self):
        if not EHULL_TOOL_AVAILABLE:
            log.warning("[EHullService] EhullCalculator is unavailable.")
            return

        try:
            self.calculator = EhullCalculator(
                api_key=self.api_key,
                relax=False,  # Relax is handled by upstream or CHGNet if needed
                stable_threshold=0.025
            )
            self.calculator.cache_dir = self.cache_dir
            log.info(f"[EHullService] Initialized EhullCalculator with cache at {self.cache_dir}")
        except Exception as e:
            log.warning(f"[EHullService] Failed to initialize EhullCalculator: {e}")
            self.calculator = None

    def _parse_input(self, structure_or_cif: Union[Structure, str, Path, tuple, list]) -> tuple[Structure, str]:
        """Normalize structure or CIF input into (Structure, filename)."""
        if isinstance(structure_or_cif, (tuple, list)) and len(structure_or_cif) == 2:
            fname = str(structure_or_cif[0])
            content = structure_or_cif[1]
            if isinstance(content, Structure):
                return content, fname
            if isinstance(content, (str, Path)) and os.path.exists(str(content)):
                return Structure.from_file(str(content)), fname
            return Structure.from_str(str(content), fmt="cif"), fname

        if isinstance(structure_or_cif, Structure):
            return structure_or_cif, getattr(structure_or_cif, "name", "structure.cif")

        if isinstance(structure_or_cif, (str, Path)) and os.path.exists(str(structure_or_cif)):
            p = Path(structure_or_cif)
            return Structure.from_file(str(p)), p.name

        if isinstance(structure_or_cif, str):
            return Structure.from_str(structure_or_cif, fmt="cif"), "uploaded.cif"

        raise ValueError(f"Unsupported structure input format: {type(structure_or_cif)}")

    def calculate_ehull(
        self,
        structure_or_cif: Union[Structure, str, Path, tuple, list],
        mpr: Optional[MPRester] = None
    ) -> Dict[str, Any]:
        """
        Calculates thermodynamic stability (E_hull) for a single crystal structure.
        Never raises uncaught exceptions.
        """
        try:
            structure, fname = self._parse_input(structure_or_cif)
        except Exception as parse_err:
            return {
                "status": "error",
                "filename": "unknown",
                "ehull_eV_per_atom": None,
                "ehull_meV_per_atom": None,
                "is_stable": None,
                "stability_status": "Parse Error",
                "source": "None",
                "notes": f"Structure parse error: {str(parse_err)}"
            }

        formula = structure.composition.reduced_formula
        if not structure.is_ordered:
            return {
                "status": "warning",
                "filename": fname,
                "formula": formula,
                "ehull_eV_per_atom": None,
                "ehull_meV_per_atom": None,
                "is_stable": None,
                "stability_status": "Disordered / Partial Occupancy",
                "source": "None",
                "notes": "Disordered structures are unsupported for convex hull phase diagrams."
            }

        if not self.calculator or not self.api_key:
            return {
                "status": "error",
                "filename": fname,
                "formula": formula,
                "ehull_eV_per_atom": None,
                "ehull_meV_per_atom": None,
                "is_stable": None,
                "stability_status": "API Unavailable",
                "source": "None",
                "notes": "Materials Project API key or EhullCalculator not configured."
            }

        def _run_calc(active_mpr: MPRester) -> Dict[str, Any]:
            clean_fname = fname.replace('/', '_').replace('\\', '_')
            temp_cif = HERE / f"_tmp_{os.getpid()}_{clean_fname}"
            try:
                structure.to(filename=str(temp_cif), fmt="cif")
                res = self.calculator.process_single(active_mpr, str(temp_cif))
                res["filename"] = fname
                return res
            finally:
                if temp_cif.exists():
                    try:
                        temp_cif.unlink()
                    except Exception:
                        pass

        try:
            if mpr is not None:
                raw_res = _run_calc(mpr)
            else:
                with MPRester(self.api_key) as new_mpr:
                    raw_res = _run_calc(new_mpr)

            ehull_ev = raw_res.get("ehull_eV_per_atom")
            ehull_mev = raw_res.get("ehull_meV_per_atom")
            is_stable = raw_res.get("stable")

            # Determine stability category
            if ehull_ev is not None:
                ehull_ev = round(float(ehull_ev), 4)
                ehull_mev = round(float(ehull_ev * 1000.0), 1)
                if ehull_ev <= 0.001:
                    stability_status = "Stable (On Convex Hull)"
                elif ehull_ev <= 0.025:
                    stability_status = "Metastable (Synthesizable)"
                elif ehull_ev <= 0.100:
                    stability_status = "Marginally Stable"
                else:
                    stability_status = "Thermodynamically Unstable"
            else:
                stability_status = "Unknown"

            return {
                "status": "success" if ehull_ev is not None else "warning",
                "filename": fname,
                "formula": formula,
                "mp_id": raw_res.get("mp_id"),
                "ehull_eV_per_atom": ehull_ev,
                "ehull_meV_per_atom": ehull_mev,
                "is_stable": is_stable,
                "stability_status": stability_status,
                "source": raw_res.get("source", "MP_HULL"),
                "notes": raw_res.get("notes", "")
            }

        except Exception as calc_err:
            log.warning(f"[EHullService] Failed computing ehull for {formula}: {calc_err}")
            return {
                "status": "error",
                "filename": fname,
                "formula": formula,
                "ehull_eV_per_atom": None,
                "ehull_meV_per_atom": None,
                "is_stable": None,
                "stability_status": "Calculation Failed",
                "source": "None",
                "notes": f"Ehull error: {str(calc_err)}"
            }

    def calculate_batch(
        self,
        cif_items: List[Union[Structure, str, Path, tuple, list]]
    ) -> List[Dict[str, Any]]:
        """
        Batch evaluation reusing a single MPRester session.
        """
        results = []
        if not self.calculator or not self.api_key:
            return [self.calculate_ehull(item) for item in cif_items]

        try:
            with MPRester(self.api_key) as mpr:
                for item in cif_items:
                    res = self.calculate_ehull(item, mpr=mpr)
                    results.append(res)
        except Exception as batch_err:
            log.warning(f"[EHullService] Batch MPRester error: {batch_err}")
            for item in cif_items:
                results.append(self.calculate_ehull(item))

        return results


def get_ehull_service() -> EhullService:
    return EhullService.get_instance()
