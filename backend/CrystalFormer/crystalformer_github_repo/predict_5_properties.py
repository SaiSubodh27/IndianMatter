#!/usr/bin/env python3
"""
predict_5_properties.py  --  run INSIDE the crystalframer Docker container (see run.sh).

Predicts, with the released Crystalformer checkpoints:
  formation energy, band gap, bulk modulus, shear modulus   (energy above hull: see ehull_from_mp.py)

All CIFs are written into ONE temporary dataset in the authors' own raw_data.pkl format, so
featurization goes through their dataset class. Every output row records what happened to it.
"""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from derived_properties import derive_properties   # Young's modulus, fracture toughness, electronic conductivity
import argparse, csv, glob, math, os, shutil, sys, tempfile, time, warnings, zipfile

REPO_DIR = os.environ.get("CF_REPO_DIR", "/workspace/crystalframer")
WEIGHTS_DIR = os.environ.get("CF_WEIGHTS_DIR", "/workspace/weights")
TMP_DATASET = "_predict_tmp"      # created under <repo>/data/ and removed afterwards
MAX_ATOMS = 320                   # MAX_SYSTEM_SIZE printed by the CUDA kernels in earlier runs

# Settings that train_mp.sh passes on the command line but default_mp.json does NOT contain.
MP_OVERRIDES = {"value_pe_angle_real": 64, "value_pe_angle_wscale": 4.0}
# jarvis_ehull.ckpt is deliberately NOT used: its stored target statistics (mean 1.77, std 1.39) show it was not
# trained on a plain energy above hull, and its outputs did not match Materials Project values.
# For stability use `run.ps1 ehull` (hull built from the predicted formation energy).
MODELS = {   # output name -> checkpoint / config / target name
    "formation_energy": dict(ckpt="mp_e_form.ckpt",       params="latticeformer/default_mp.json",     target="e_form",       overrides=MP_OVERRIDES),
    "band_gap":         dict(ckpt="mp_bandgap.ckpt",      params="latticeformer/default_mp.json",     target="bandgap",      overrides=MP_OVERRIDES),
    "bulk_modulus":     dict(ckpt="mp_bulk_modulus.ckpt", params="latticeformer/default_mp.json",     target="bulk_modulus", overrides=MP_OVERRIDES),
    "shear_modulus":    dict(ckpt="mp_shear_modulus.ckpt",params="latticeformer/default_mp.json",     target="shear_modulus",overrides=MP_OVERRIDES),
}
NAN = float("nan")


def to_GPa(raw, mode):
    """Moduli checkpoints output log-scale values. UNVERIFIED which log: confirm with check_against_mp.py."""
    if mode == "log10":
        return 10.0 ** raw
    if mode == "ln":
        return math.exp(raw)
    return raw


def collect_cifs(inp, workdir):
    inp = os.path.abspath(inp)
    if os.path.isdir(inp):
        paths = glob.glob(os.path.join(inp, "**", "*.cif"), recursive=True)
    elif inp.lower().endswith(".zip"):
        with zipfile.ZipFile(inp) as z:
            z.extractall(workdir)
        paths = glob.glob(os.path.join(workdir, "**", "*.cif"), recursive=True)
    elif inp.lower().endswith(".cif"):
        paths = [inp]
    else:
        raise SystemExit(f"--input must be a folder, a .cif or a .zip: {inp}")
    # drop macOS zip junk (__MACOSX/, ._file.cif)
    return sorted(p for p in paths if "__MACOSX" not in p and not os.path.basename(p).startswith("._"))


def load_structures(paths):
    """Returns (ids, structures, skipped_rows). Nothing is dropped silently."""
    from pymatgen.core import Structure
    warnings.filterwarnings("ignore")
    ids, structs, skipped, seen = [], [], [], {}
    for p in paths:
        stem = os.path.splitext(os.path.basename(p))[0]
        k = seen.get(stem, 0); seen[stem] = k + 1
        mid = stem if k == 0 else f"{stem}__{k + 1}"
        try:
            s = Structure.from_file(p)
        except Exception as e:
            skipped.append(dict(material_id=mid, formula="", n_atoms=0,
                                notes=f"SKIPPED parse error: {type(e).__name__}: {str(e)[:120]}"))
            continue
        formula = s.composition.reduced_formula
        if not s.is_ordered:
            skipped.append(dict(material_id=mid, formula=formula, n_atoms=len(s),
                                notes="SKIPPED disordered / partial occupancy (unsupported)"))
        elif len(s) > MAX_ATOMS:
            skipped.append(dict(material_id=mid, formula=formula, n_atoms=len(s),
                                notes=f"SKIPPED {len(s)} atoms > {MAX_ATOMS} kernel limit"))
        else:
            ids.append(mid); structs.append(s)
    return ids, structs, skipped


def load_model(name, cfg, device):
    """Mirrors the checkpoint loading in the authors' demo.py (incl. baking mean/std into the last layer)."""
    import torch
    from utils import Params
    from models.latticeformer import Latticeformer
    ckpt_path = os.path.join(WEIGHTS_DIR, cfg["ckpt"])
    params = Params(os.path.join(REPO_DIR, "params", cfg["params"]))
    for k, v in cfg["overrides"].items():
        setattr(params, k, v)
    params.pretrained_model = ckpt_path
    params.targets = [cfg["target"]]
    model = Latticeformer(params)
    with open(ckpt_path, "rb") as f:
        state = torch.load(f, map_location="cpu", weights_only=False)["state_dict"]
    std, mean = state["target_std"], state["target_mean"]
    prefix = "swa_model.module."
    model.load_state_dict({k.replace(prefix, ""): v for k, v in state.items() if k.startswith(prefix)})
    model.mlp[-1].load_state_dict({"weight": model.mlp[-1].weight * std[:, None],
                                   "bias": model.mlp[-1].bias * std + mean})
    return model.to(device).eval()


def build_dataset(structs, ids, cell_format):
    import pickle
    from dataloaders.dataset_latticeformer import RegressionDatasetMP_Latticeformer as Dataset
    from dataloaders.common import CellFormat
    fmt = {"raw": CellFormat.RAW, "primitive": CellFormat.PRIMITIVE,
           "conventional": CellFormat.CONVENTIONAL}[cell_format]
    root = os.path.join(REPO_DIR, "data", TMP_DATASET)
    shutil.rmtree(root, ignore_errors=True)           # also clears any stale processed/ cache
    os.makedirs(os.path.join(root, "test", "raw"))
    rows = [{"id": i, "structure": s, "e_form": 0.0, "bandgap": 0.0,
             "bulk_modulus": 0.0, "shear_modulus": 0.0, "ehull": 0.0} for i, s in zip(ids, structs)]
    with open(os.path.join(root, "test", "raw", "raw_data.pkl"), "wb") as f:
        pickle.dump(rows, f)
    return Dataset(target_split="test", target_set=TMP_DATASET, cell_format=fmt)


def run_one_model(name, cfg, ds, batch_size, device):
    """Load ONE model, run the whole dataset, free the GPU again (keeps VRAM use low)."""
    import torch
    from torch_geometric.loader import DataLoader
    model = load_model(name, cfg, device)
    vals = []
    try:
        with torch.no_grad():
            for batch in DataLoader(ds, batch_size=batch_size, shuffle=False, num_workers=0):
                batch = batch.to(device)
                vals.extend(model(batch)[:, 0].detach().cpu().tolist())
    finally:
        del model
        torch.cuda.empty_cache()
    return vals


def predict_with_models(structs, ids, cell_format, batch_size, device):
    """Models run one after another (laptop GPUs have 4-6 GB). On CUDA out-of-memory the batch size is halved."""
    import torch
    ds = build_dataset(structs, ids, cell_format)
    if len(ds) != len(structs):
        raise RuntimeError(f"dataset kept {len(ds)} of {len(structs)} structures")
    out = {}
    for name, cfg in MODELS.items():
        bs = batch_size
        while True:
            try:
                print(f"  {name} (batch size {bs}) ...")
                out[name] = run_one_model(name, cfg, ds, bs, device)
                break
            except torch.cuda.OutOfMemoryError:
                torch.cuda.empty_cache()
                if bs == 1:
                    raise
                bs = max(1, bs // 2)
                print(f"  CUDA out of memory -> retrying with batch size {bs}")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--input", default="/workspace/inputs", help="folder of .cif files, one .cif, or one .zip")
    ap.add_argument("--output", default="/workspace/outputs/predictions.csv")
    ap.add_argument("--batch-size", type=int, default=4, help="start value; halves automatically on GPU out-of-memory")
    ap.add_argument("--modulus-transform", choices=["log10", "ln", "none"], default="log10",
                    help="how raw moduli outputs become GPa (default log10; verify with check_against_mp.py)")
    ap.add_argument("--cell-format", choices=["raw", "primitive", "conventional"], default="raw",
                    help="structure cell passed to the dataset class (raw = the class default)")
    ap.add_argument("--keep-tmp", action="store_true", help="keep <repo>/data/_predict_tmp for debugging")
    args = ap.parse_args()
    inp, out_csv = os.path.abspath(args.input), os.path.abspath(args.output)   # resolve BEFORE chdir

    if not os.path.isdir(REPO_DIR):
        raise SystemExit(f"repo not found: {REPO_DIR}")
    missing = [c["ckpt"] for c in MODELS.values() if not os.path.exists(os.path.join(WEIGHTS_DIR, c["ckpt"]))]
    if missing:
        found = sorted(f for f in os.listdir(WEIGHTS_DIR) if f.endswith(".ckpt")) if os.path.isdir(WEIGHTS_DIR) else "folder not found"
        raise SystemExit(f"missing checkpoints in {WEIGHTS_DIR}: {missing}\n.ckpt files found there: {found}\n"
                         f"Rename them to the expected names or edit MODELS at the top of this script.")

    workdir = tempfile.mkdtemp()
    t0 = time.time()
    ids, structs, skipped = load_structures(collect_cifs(inp, workdir))
    print(f"CIFs: {len(ids)} usable, {len(skipped)} skipped")
    if not ids:
        raise SystemExit("no usable structures")

    os.chdir(REPO_DIR)                    # the authors' dataset class resolves data/... relative to the repo root
    sys.path.insert(0, REPO_DIR)
    import torch
    if not torch.cuda.is_available():
        raise SystemExit("No CUDA GPU visible. Their attention kernels are GPU-only. "
                         "Run via run.sh (--gpus=all) and check ./run.sh test-gpu")
    device = "cuda"
    props = torch.cuda.get_device_properties(0)
    print(f"GPU: {props.name}, {props.total_memory / 2**30:.1f} GB")

    n = len(ids)
    pred = {name: [NAN] * n for name in MODELS}
    notes = [""] * n
    try:
        print("predicting ...")
        res = predict_with_models(structs, ids, args.cell_format, args.batch_size, device)
        for name in MODELS:
            pred[name] = res[name]
    except Exception as e:
        print(f"batch run failed ({type(e).__name__}: {e}); retrying one structure at a time")
        for i in range(n):
            try:
                r = predict_with_models([structs[i]], [ids[i]], args.cell_format, 1, device)
                for name in MODELS:
                    pred[name][i] = r[name][0]
            except Exception as e2:
                notes[i] = f"FAILED {type(e2).__name__}: {str(e2)[:120]}"

    rows = []
    for i in range(n):
        p = {k: pred[k][i] for k in MODELS}
        ok = not any(math.isnan(v) for v in p.values())
        rows.append(dict(
            material_id=ids[i], formula=structs[i].composition.reduced_formula, n_atoms=len(structs[i]),
            formation_energy_eV_atom=p["formation_energy"],
            band_gap_eV=max(0.0, p["band_gap"]) if ok else NAN,
            bulk_modulus_GPa=to_GPa(p["bulk_modulus"], args.modulus_transform) if ok else NAN,
            shear_modulus_GPa=to_GPa(p["shear_modulus"], args.modulus_transform) if ok else NAN,
            **(derive_properties(
                bulk_GPa=to_GPa(p["bulk_modulus"], args.modulus_transform) if ok else NAN,
                shear_GPa=to_GPa(p["shear_modulus"], args.modulus_transform) if ok else NAN,
                gap_eV=max(0.0, p["band_gap"]) if ok else NAN,
                volume_per_atom_A3=structs[i].volume / len(structs[i]))),
            raw_formation_energy=p["formation_energy"], raw_band_gap=p["band_gap"],
            raw_bulk_modulus=p["bulk_modulus"], raw_shear_modulus=p["shear_modulus"],
            moduli_note="rough estimate (can be off by ~2x on unusual compounds)",
            modulus_transform=args.modulus_transform, cell_format=args.cell_format,
            notes=notes[i] or "ok"))
    rows += [dict(r, **{k: NAN for k in ("formation_energy_eV_atom", "band_gap_eV", "bulk_modulus_GPa",
                                         "shear_modulus_GPa", "youngs_modulus_GPa",
                                         "fracture_toughness_MPa_m05", "electronic_conductivity_S_cm")}) for r in skipped]

    os.makedirs(os.path.dirname(out_csv), exist_ok=True)
    cols = list(rows[0].keys())
    for r in rows:
        for c in cols:
            r.setdefault(c, "")
    with open(out_csv, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(rows)

    if not args.keep_tmp:
        shutil.rmtree(os.path.join(REPO_DIR, "data", TMP_DATASET), ignore_errors=True)
    shutil.rmtree(workdir, ignore_errors=True)
    print(f"\nwrote {out_csv}  ({len(rows)} rows, {time.time() - t0:.0f}s)")
    print(f"{'material_id':<22}{'Ef':>9}{'gap':>8}{'K GPa':>9}{'G GPa':>9}{'E GPa':>9}{'KIC':>7}{'sigma S/cm':>12}")
    for r in rows[:15]:
        print(f"{r['material_id'][:21]:<22}{r['formation_energy_eV_atom']:>9.3f}{r['band_gap_eV']:>8.2f}"
              f"{r['bulk_modulus_GPa']:>9.1f}{r['shear_modulus_GPa']:>9.1f}{r['youngs_modulus_GPa']:>9.1f}"
              f"{r['fracture_toughness_MPa_m05']:>7.2f}{r['electronic_conductivity_S_cm']:>12.1e}")
    print("Formation energy and band gap are the reliable columns. K and G are rough estimates.")
    print("E, KIC and sigma are calculated from the predicted K, G and gap (formulas in derived_properties.py).")
    print("For energy above hull run:  .\\run.ps1 ehull   (needs a Materials Project API key, see README_WINDOWS.md)")


if __name__ == "__main__":
    main()
