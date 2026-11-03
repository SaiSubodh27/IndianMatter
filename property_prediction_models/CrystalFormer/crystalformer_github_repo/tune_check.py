#!/usr/bin/env python3
"""
tune_check.py -- runs INSIDE the container:  run.ps1 tune
Tries several settings for each checkpoint and scores them against the reference CSV
(selected_50_materials.csv), so we can see which settings the checkpoints expect.
The reference file is OPTIONAL. Without it the script only prints the range of each model's outputs
for every setting (enough to spot a broken Ehull model, not enough to rank the moduli settings).
"""
import argparse, os, sys, tempfile, traceback
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np
import pandas as pd
import predict_5_properties as P

# what the authors' training commands pass on the command line (train_mp.sh / train_jarvis.sh)
TRAIN = dict(value_pe_dist_coef=1.0, value_pe_angle_coef=1.0, value_pe_angle_wscale=4.0,
             value_pe_angle_real=64, num_layers=4, domain="real", frame_method="max")
FORMATS = ["raw", "primitive", "conventional"]
KEYS = ["frame_method", "num_layers", "domain", "value_pe_dist_coef", "value_pe_angle_coef",
        "value_pe_angle_real", "value_pe_angle_wscale"]
# model name -> (reference column, scale to model units, compare in log10?)
REF = {"formation_energy": ("P2_formation_energy_eV_atom", 1.0, False),
       "band_gap":         ("P11_band_gap_eV", 1.0, False),
       "bulk_modulus":     ("aux_bulk_modulus_GPa", 1.0, True),
       "shear_modulus":    ("P15_shear_modulus_GPa", 1.0, True),
       "ehull":            ("P3_energy_above_hull_meV_atom", 1e-3, False)}


def score(pred, ref, log10):
    pred, ref = np.asarray(pred, float), np.asarray(ref, float)
    if log10:
        ref = np.log10(np.maximum(ref, 1e-9))
    ok = ~(np.isnan(pred) | np.isnan(ref))
    pred, ref = pred[ok], ref[ok]
    return dict(MAE=float(np.mean(abs(pred - ref))), bias=float(np.mean(pred - ref)),
                r=float(np.corrcoef(pred, ref)[0, 1]) if len(pred) > 2 else float("nan"))


def plain_stats(pred, name):
    p = np.asarray(pred, float)
    d = dict(min=float(np.nanmin(p)), median=float(np.nanmedian(p)), max=float(np.nanmax(p)),
             gt_half=float(np.mean(p > 0.5)))
    return d


def run(cfg, ds, bs):
    import torch
    while True:
        try:
            return P.run_one_model("tune", cfg, ds, bs, "cuda")
        except torch.cuda.OutOfMemoryError:
            torch.cuda.empty_cache()
            if bs == 1:
                raise
            bs //= 2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--ref", default="", help="optional CSV with known values (selected_50_materials.csv)")
    ap.add_argument("--batch-size", type=int, default=2)
    args = ap.parse_args()
    inp = os.path.abspath(args.input)
    ref_csv = os.path.abspath(args.ref) if args.ref else ""

    ref = pd.read_csv(ref_csv).set_index("material_id") if ref_csv and os.path.exists(ref_csv) else None
    ids, structs, skipped = P.load_structures(P.collect_cifs(inp, tempfile.mkdtemp()))
    if ref is not None:
        keep = [i for i, mid in enumerate(ids) if mid in ref.index]
        ids, structs = [ids[i] for i in keep], [structs[i] for i in keep]
        print(f"{len(ids)} structures matched the reference file ({len(skipped)} skipped on load)")
    else:
        print(f"No reference file: running WITHOUT scoring on all {len(ids)} CIFs in the input folder ({len(skipped)} skipped on load)")
    if len(ids) < 3:
        raise SystemExit("need at least 3 usable CIFs")

    os.chdir(P.REPO_DIR)
    sys.path.insert(0, P.REPO_DIR)
    import torch
    from utils import Params

    pdir = os.path.join(P.REPO_DIR, "params")
    print("\n== params folder ==")
    for root, _, files in os.walk(pdir):
        for f in sorted(files):
            print("  ", os.path.relpath(os.path.join(root, f), pdir))
    print("\n== defaults inside each config file (compare with TRAIN:", TRAIN, ") ==")
    for f in ["latticeformer/default_mp.json", "latticeformer/default_jarvis.json",
              "crystalframer/default_mp.json", "crystalframer/default_jarvis.json"]:
        path = os.path.join(pdir, f)
        if os.path.exists(path):
            p = Params(path)
            print(f"  {f}: " + ", ".join(f"{k}={getattr(p, k, '<none>')}" for k in KEYS))
        else:
            print(f"  {f}: (file not found)")

    # variants per model: (label, params file, overrides, cell formats to try)
    variants = {}
    for name, cfg in P.MODELS.items():
        v = [("current script", cfg["params"], dict(cfg["overrides"]), ["raw"])]
        if name in ("bulk_modulus", "shear_modulus", "ehull"):
            v.append(("train-script overrides", cfg["params"], dict(TRAIN), FORMATS))
        if name == "ehull":
            v.append(("crystalframer/default_jarvis.json + train overrides",
                      "crystalframer/default_jarvis.json", dict(TRAIN), FORMATS))
        variants[name] = [x for x in v if os.path.exists(os.path.join(pdir, x[1]))]

    rows = []
    for fmt in FORMATS:
        ds = P.build_dataset(structs, ids, fmt)
        for name, cfg0 in P.MODELS.items():
            if ref is not None:
                col, scale, lg = REF[name]
                refv = ref.loc[ids, col].values * scale
            for label, pfile, ov, fmts in variants[name]:
                if fmt not in fmts:
                    continue
                cfg = dict(cfg0, params=pfile, overrides=ov)
                try:
                    pred = run(cfg, ds, args.batch_size)
                    if ref is not None:
                        s_ = score(pred, refv, lg)
                        txt = f"MAE={s_['MAE']:.3f} bias={s_['bias']:+.3f} r={s_['r']:+.3f}" + (" (log10 GPa)" if lg else "")
                    else:
                        s_ = plain_stats(pred, name)
                        txt = f"raw output min={s_['min']:.2f} median={s_['median']:.2f} max={s_['max']:.2f}  share>0.5={s_['gt_half']:.0%}"
                    rows.append((name, label, fmt, s_, txt))
                    print(f"{name:16s} {fmt:12s} {label:50s} {txt}", flush=True)
                except Exception as e:
                    print(f"{name:16s} {fmt:12s} {label:50s} FAILED {type(e).__name__}: {str(e)[:150]}", flush=True)
                    traceback.print_exc(limit=2)

    print("\n================ SUMMARY ================")
    if ref is not None:
        print("(lower MAE and higher r are better)")
    else:
        print("(no reference: for ehull a healthy model gives mostly values below ~0.3 eV/atom for known stable-ish materials)")
    for name in P.MODELS:
        print(f"\n{name}")
        sel = [r for r in rows if r[0] == name]
        if ref is not None:
            sel = sorted(sel, key=lambda r: r[3]["MAE"])
        for _, label, fmt, _, txt in sel:
            print(f"   {fmt:12s} {label:50s} {txt}")
    shutil_target = os.path.join(P.REPO_DIR, "data", P.TMP_DATASET)
    import shutil
    shutil.rmtree(shutil_target, ignore_errors=True)


if __name__ == "__main__":
    main()
