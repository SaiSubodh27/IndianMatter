import os
import sys
import glob
import json
import zipfile
import shutil
import tempfile
import argparse
import logging
from pathlib import Path
from tempfile import TemporaryDirectory
import traceback
import math
import numpy as np

# Apply monkey patches to fix outdated mp_api json schemas
import pymatgen.entries.computed_entries
import pymatgen.entries.compatibility
sys.modules['pymatgen.core.entries'] = pymatgen.entries.computed_entries
sys.modules['pymatgen.analysis.compatibility'] = pymatgen.entries.compatibility

import pandas as pd
from tqdm import tqdm
from tenacity import retry, wait_exponential, stop_after_attempt

import pymatgen.core
from pymatgen.core import Structure
from pymatgen.analysis.structure_matcher import StructureMatcher
from pymatgen.analysis.phase_diagram import PhaseDiagram, PDEntry
import emmet.core
import mp_api

from mp_api.client import MPRester

try:
    import torch
    import chgnet
    from chgnet.model import CHGNet, StructOptimizer
    CHGNET_AVAILABLE = True
except ImportError:
    CHGNET_AVAILABLE = False


logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def print_versions():
    print(f"--- Package Versions ---")
    print(f"pymatgen: {pymatgen.core.__version__}")
    print(f"mp-api: {mp_api.__version__}")
    print(f"emmet-core: {emmet.core.__version__}")
    if CHGNET_AVAILABLE:
        print(f"chgnet: {chgnet.__version__}")
        print(f"torch: {torch.__version__}")
    else:
        print("chgnet: NOT INSTALLED")
    print("------------------------\n")

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(5))
def get_mp_candidates(mpr, formula):
    # Fetch candidates with same reduced formula
    fields = ["material_id", "formula_pretty", "structure", "energy_above_hull", "formation_energy_per_atom", "is_stable"]
    docs = mpr.materials.summary.search(formula=formula, fields=fields)
    return docs

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(5))
def get_chemsys_entries(mpr, elements):
    return mpr.get_entries_in_chemsys(elements)

class EhullCalculator:
    def __init__(self, api_key, relax=True, stable_threshold=0.025):
        self.api_key = api_key
        self.relax = relax
        self.stable_threshold = stable_threshold
        self.chgnet_model = None
        self.chgnet_opt = None
        
        self.sm = StructureMatcher(ltol=0.2, stol=0.3, angle_tol=5, primitive_cell=True, scale=True)
        self.hull_cache = {}
        self.cache_dir = Path("mp_cache")
        self.cache_dir.mkdir(exist_ok=True)
        
    def _load_chgnet(self):
        if not CHGNET_AVAILABLE:
            raise RuntimeError("CHGNet is not installed.")
        if self.chgnet_model is None:
            self.chgnet_model = CHGNet.load()
            self.chgnet_opt = StructOptimizer()
            
    def get_hull_entries(self, mpr, elements):
        elements = sorted(list(set([el.symbol for el in elements])))
        chemsys = "-".join(elements)
        if chemsys in self.hull_cache:
            return self.hull_cache[chemsys]
            
        cache_file = self.cache_dir / f"{chemsys}.json"
        if cache_file.exists():
            try:
                import monty.serialization
                entries = monty.serialization.loadfn(str(cache_file))
                self.hull_cache[chemsys] = entries
                return entries
            except Exception as e:
                logging.warning(f"Failed to load cache {cache_file}: {e}")
                
        entries = get_chemsys_entries(mpr, elements)
        
        # Save cache
        try:
            import monty.serialization
            monty.serialization.dumpfn(entries, str(cache_file))
        except Exception:
            pass
            
        self.hull_cache[chemsys] = entries
        return entries
        
    def process_batch(self, cif_paths, validate=False):
        results = []
        with MPRester(self.api_key) as mpr:
            for path in tqdm(cif_paths, desc="Processing CIFs"):
                res = self.process_single(mpr, path, validate=validate)
                results.append(res)
        return pd.DataFrame(results)
        
    def process_single(self, mpr, cif_path, validate=False):
        fname = Path(cif_path).name
        res = {
            "filename": fname,
            "formula": None,
            "n_atoms": None,
            "source": "ERROR",
            "mp_id": None,
            "ehull_eV_per_atom": None,
            "ehull_meV_per_atom": None,
            "ehull_raw_signed": None,
            "stable": None,
            "confidence": "",
            "notes": "",
            "near_threshold": False,
            "chgnet_ehull": None, # for validation
        }
        
        try:
            structure = Structure.from_file(cif_path)
            res["formula"] = structure.composition.reduced_formula
            res["n_atoms"] = len(structure)
            
            if not structure.is_ordered:
                res["notes"] = "unsupported: disordered"
                return res
        except Exception as e:
            res["notes"] = f"Parse failed: {str(e)}"
            return res
            
        # Step 2: Check MP
        candidates = get_mp_candidates(mpr, res["formula"])
        matched_doc = None
        
        matches = []
        if hasattr(mpr, "find_structure"):
            try:
                # Some versions of mp-api have find_structure
                # This returns material_ids
                mp_id = mpr.find_structure(structure)
                if mp_id:
                    matched_doc = next((d for d in candidates if d.material_id == mp_id), None)
            except Exception:
                pass
                
        if matched_doc is None:
            # Fallback to local StructureMatcher
            for doc in candidates:
                if self.sm.fit(structure, doc.structure):
                    rms_dist = self.sm.get_rms_dist(structure, doc.structure)
                    if rms_dist is not None:
                        matches.append((doc, rms_dist[0]))
            
            if matches:
                matches.sort(key=lambda x: x[1])
                matched_doc = matches[0][0]
                matched_ids = [m[0].material_id for m in matches]
                res["notes"] = f"Matches: {', '.join(str(m) for m in matched_ids)}"
                
        if matched_doc:
            res["mp_id"] = str(matched_doc.material_id)
            looks_like_mp = any(p in fname.lower() for p in ("mp-", "mvc-"))
            if looks_like_mp and str(matched_doc.material_id) not in fname:
                res["notes"] += f" | WARNING: Filename looks like MP ID but differs from match {matched_doc.material_id}."
                
            res["source"] = "MP_API"
            ehull = matched_doc.energy_above_hull
            res["ehull_eV_per_atom"] = ehull
            res["ehull_meV_per_atom"] = ehull * 1000 if ehull is not None else None
            res["ehull_raw_signed"] = ehull
            res["stable"] = matched_doc.is_stable
            
        if not matched_doc or validate:
            try:
                self._load_chgnet()
                # 3b. Use CHGNet
                s_chgnet = structure.copy()
                if self.relax:
                    opt_res = self.chgnet_opt.optimize(s_chgnet, verbose=False)
                    s_chgnet = opt_res["trajectory"].atoms[-1]
                    s_chgnet = Structure.from_ase(s_chgnet) # Ensure it's pymatgen structure
                    vol_change = (s_chgnet.volume - structure.volume) / structure.volume * 100
                    res["notes"] += f" | Relaxed (vol change: {vol_change:.2f}%)"
                    
                prediction = self.chgnet_model.predict_structure(s_chgnet)
                e_per_atom = prediction["e"]
                total_energy = e_per_atom * len(s_chgnet)
                
                # Fetch hull entries
                entries = self.get_hull_entries(mpr, s_chgnet.composition.elements)
                
                # Confidence check
                elements_in_hull = set()
                for e in entries:
                    elements_in_hull.update(e.composition.elements)
                
                missing_els = set(s_chgnet.composition.elements) - elements_in_hull
                if missing_els or len(entries) < len(s_chgnet.composition.elements):
                    res["confidence"] = "hull incomplete"
                    
                pd = PhaseDiagram(entries)
                pd_entry = PDEntry(s_chgnet.composition, total_energy)
                
                ehull_chgnet = pd.get_e_above_hull(pd_entry, allow_negative=True)
                
                if validate and matched_doc:
                    res["chgnet_ehull"] = ehull_chgnet
                else:
                    res["source"] = "CHGNET+MP_HULL"
                    res["ehull_raw_signed"] = ehull_chgnet
                    ehull_capped = max(0, ehull_chgnet)
                    res["ehull_eV_per_atom"] = ehull_capped
                    res["ehull_meV_per_atom"] = ehull_capped * 1000
                    res["stable"] = ehull_capped <= self.stable_threshold
                    
                    diff_to_thresh = abs(ehull_capped - self.stable_threshold)
                    if diff_to_thresh <= 0.030:
                        res["near_threshold"] = True
            except Exception as e:
                traceback.print_exc()
                res["notes"] += f" | CHGNet Error: {str(e)}"
                if not matched_doc:
                    res["source"] = "ERROR"
                    
        return res

def collect_cifs(input_path):
    p = Path(input_path)
    if p.is_file():
        if p.suffix.lower() == ".zip":
            # Extract to temp
            temp_dir = tempfile.mkdtemp()
            with zipfile.ZipFile(p, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
            cifs = list(Path(temp_dir).rglob("*.cif"))
            return cifs, temp_dir
        elif p.suffix.lower() == ".cif":
            return [p], None
        else:
            # Assume it's a list of paths
            with open(p, 'r') as f:
                paths = [Path(line.strip()) for line in f if line.strip()]
            return [path for path in paths if path.exists() and path.suffix.lower() == ".cif"], None
    elif p.is_dir():
        return list(p.rglob("*.cif")), None
    return [], None

def main():
    parser = argparse.ArgumentParser(description="Compute Energy above Hull using MP API and CHGNet.")
    parser.add_argument("input", help="Path to CIF file, folder of CIFs, ZIP file, or text file with CIF paths.")
    parser.add_argument("--out", default="results.csv", help="Output CSV filename.")
    parser.add_argument("--no-relax", action="store_true", help="Disable CHGNet structure relaxation.")
    parser.add_argument("--stable-threshold", type=float, default=0.025, help="Threshold for stability (eV/atom).")
    parser.add_argument("--validate", action="store_true", help="Run CHGNet for MP structures too and compute validation metrics.")
    args = parser.parse_args()
    
    api_key = os.environ.get("MP_API_KEY")
    if not api_key:
        print("ERROR: Environment variable MP_API_KEY is not set.")
        sys.exit(1)
        
    print_versions()
    
    cifs, temp_dir = collect_cifs(args.input)
    if not cifs:
        print("No CIF files found.")
        sys.exit(1)
        
    print(f"Found {len(cifs)} CIF files.")
    
    calc = EhullCalculator(api_key, relax=not args.no_relax, stable_threshold=args.stable_threshold)
    df = calc.process_batch(cifs, validate=args.validate)
    
    df.to_csv(args.out, index=False)
    json_out = Path(args.out).with_suffix(".json")
    df.to_json(json_out, orient="records", indent=2)
    
    if args.validate:
        # Compute validation metrics
        val_df = df.dropna(subset=["ehull_eV_per_atom", "chgnet_ehull"])
        if len(val_df) > 0:
            mp_ehulls = val_df["ehull_eV_per_atom"]
            chg_ehulls = np.maximum(0, val_df["chgnet_ehull"])
            
            mae = np.mean(np.abs(mp_ehulls - chg_ehulls))
            rmse = np.sqrt(np.mean((mp_ehulls - chg_ehulls)**2))
            
            from scipy.stats import pearsonr
            if len(val_df) > 1:
                try:
                    pearson, _ = pearsonr(mp_ehulls, chg_ehulls)
                except:
                    pearson = float('nan')
            else:
                pearson = float('nan')
                
            mp_stable = mp_ehulls <= args.stable_threshold
            chg_stable = chg_ehulls <= args.stable_threshold
            agreement = np.mean(mp_stable == chg_stable) * 100
            
            print("\n--- Validation Metrics ---")
            print(f"Count: {len(val_df)}")
            print(f"MAE: {mae:.3f} eV/atom")
            print(f"RMSE: {rmse:.3f} eV/atom")
            print(f"Pearson r: {pearson:.3f}")
            print(f"Stable/Unstable Agreement: {agreement:.1f}%")
        else:
            print("No valid data for validation.")
            
    print(f"\nResults saved to {args.out} and {json_out}.")
    
    if temp_dir:
        shutil.rmtree(temp_dir)

if __name__ == "__main__":
    main()
