#!/usr/bin/env python3
"""
predict_ehull_only.py -- runs INSIDE the container:   run.ps1 ehullmodel
Runs ONLY CrystalFormer's jarvis_ehull.ckpt on the CIFs in inputs/ and writes a small CSV.
No Materials Project access and no API key needed.

WARNING (from earlier tests on 50 lithium materials): these outputs did NOT match Materials Project energy above
hull (model gave 0 to 3.9 eV/atom, Materials Project values were all below 0.1 eV/atom, correlation ~0.05).
The checkpoint stores a training-target mean of 1.77 and std of 1.39, so the number may not be a plain energy
above hull. Treat the output as unverified.
"""
import argparse, csv, os, shutil, sys, tempfile, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import predict_5_properties as P

# settings from train_jarvis.sh (--targets ehull) and the checkpoint's own hyper_parameters (param_file)
EHULL = dict(ckpt="jarvis_ehull.ckpt", params="crystalframer/default_jarvis.json", target="ehull",
             overrides=dict(value_pe_dist_coef=1.0, value_pe_angle_coef=1.0, value_pe_angle_wscale=4.0,
                            value_pe_angle_real=64, num_layers=4, domain="real", frame_method="max"))


def run(cfg, ds, bs):
    import torch
    while True:
        try:
            return P.run_one_model("ehull", cfg, ds, bs, "cuda")
        except torch.cuda.OutOfMemoryError:
            torch.cuda.empty_cache()
            if bs == 1:
                raise
            bs //= 2
            print(f"  CUDA out of memory -> retrying with batch size {bs}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="folder / zip / single .cif")
    ap.add_argument("--output", required=True)
    ap.add_argument("--batch-size", type=int, default=4)
    ap.add_argument("--cell-format", default="raw", choices=["raw", "primitive", "conventional"])
    args = ap.parse_args()

    ckpt = os.path.join(P.WEIGHTS_DIR, EHULL["ckpt"])
    if not os.path.exists(ckpt):
        found = sorted(f for f in os.listdir(P.WEIGHTS_DIR) if f.endswith(".ckpt")) if os.path.isdir(P.WEIGHTS_DIR) else "folder not found"
        raise SystemExit(f"{EHULL['ckpt']} not found in {P.WEIGHTS_DIR}\n.ckpt files found: {found}")

    t0 = time.time()
    ids, structs, skipped = P.load_structures(P.collect_cifs(os.path.abspath(args.input), tempfile.mkdtemp()))
    print(f"CIFs: {len(ids)} usable, {len(skipped)} skipped")
    if not ids:
        raise SystemExit("no usable structures")

    os.chdir(P.REPO_DIR)
    sys.path.insert(0, P.REPO_DIR)
    import torch
    if not torch.cuda.is_available():
        raise SystemExit("no GPU visible in the container")
    print(f"GPU: {torch.cuda.get_device_properties(0).name}")

    try:
        ds = P.build_dataset(structs, ids, args.cell_format)
        vals = run(EHULL, ds, args.batch_size)
    finally:
        shutil.rmtree(os.path.join(P.REPO_DIR, "data", P.TMP_DATASET), ignore_errors=True)

    rows = [dict(material_id=i, formula=s.composition.reduced_formula, n_atoms=len(s),
                 ehull_model_output=round(float(v), 4), notes="ok") for i, s, v in zip(ids, structs, vals)]
    rows += [dict(r, ehull_model_output="") for r in skipped]
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["material_id", "formula", "n_atoms", "ehull_model_output", "notes"])
        w.writeheader()
        w.writerows(rows)

    v = sorted(float(x) for x in vals)
    print(f"\nwrote {args.output}  ({len(rows)} rows, {time.time() - t0:.0f}s)")
    print(f"output range: min {v[0]:.3f}  median {v[len(v) // 2]:.3f}  max {v[-1]:.3f}")
    print("Reminder: in earlier tests this model's output did not match Materials Project energy above hull.")


if __name__ == "__main__":
    main()
