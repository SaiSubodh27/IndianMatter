"""Runs INSIDE the container (run.ps1 ckpt): shows what each checkpoint file says it was trained on."""
import glob, os, torch

W = os.environ.get("CF_WEIGHTS_DIR", "/workspace/weights")
print("weights folder:", W)
for f in sorted(glob.glob(os.path.join(W, "*.ckpt"))):
    print("\n==", os.path.basename(f), f"({os.path.getsize(f) / 1e6:.1f} MB)")
    try:
        ck = torch.load(f, map_location="cpu", weights_only=False)
    except Exception as e:
        print("   load failed:", type(e).__name__, e)
        continue
    if not isinstance(ck, dict):
        print("   not a dict:", type(ck))
        continue
    print("   top-level keys:", list(ck.keys()))
    st = ck.get("state_dict", {})
    print("   tensors in state_dict:", len(st))
    for k in ("target_mean", "target_std"):
        if k in st:
            print(f"   {k}:", [round(x, 4) for x in st[k].flatten().tolist()])
    for k, v in ck.items():
        if k != "state_dict":
            print(f"   {k}: {str(v)[:300]}")
