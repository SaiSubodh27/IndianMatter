#!/usr/bin/env python3
"""
check_against_mp.py -- run on the HOST (not in the container), after predict_5_properties.py.

For CIFs whose names contain an MP id (mp-1234), pulls MP's own values and compares them with
predictions.csv. Most useful for deciding how the modulus outputs should be converted (log10 / ln / none).

    pip install mp-api pandas numpy
    export MP_API_KEY=...        (never paste the key into files you share)
    python check_against_mp.py outputs/predictions.csv
"""
import os, re, sys
import numpy as np
import pandas as pd


def mp_id(name):
    m = re.search(r"mp-\d+", str(name))
    return m.group(0) if m else None


def _vrh(x):
    if x is None:
        return np.nan
    if isinstance(x, dict):
        return x.get("vrh", np.nan)
    return getattr(x, "vrh", np.nan)


def fetch_mp(ids, api_key):
    from mp_api.client import MPRester
    fields = ["material_id", "formation_energy_per_atom", "band_gap", "energy_above_hull",
              "bulk_modulus", "shear_modulus"]
    rows = []
    with MPRester(api_key) as mpr:
        for i in range(0, len(ids), 200):
            for d in mpr.materials.summary.search(material_ids=ids[i:i + 200], fields=fields):
                rows.append(dict(mp_id=str(d.material_id), mp_formation_energy=d.formation_energy_per_atom,
                                 mp_band_gap=d.band_gap, mp_ehull_mp_hull=d.energy_above_hull,
                                 mp_bulk_GPa=_vrh(d.bulk_modulus), mp_shear_GPa=_vrh(d.shear_modulus)))
    return pd.DataFrame(rows)


def choose_transform(raw, ref_gpa):
    """Compare candidate raw->GPa conversions by median |log10 ratio| against MP. Returns (best, table)."""
    cands = {"log10": 10.0 ** raw, "ln": np.exp(raw), "none": raw}
    table = {}
    for name, v in cands.items():
        ok = (v > 0) & (ref_gpa > 0) & np.isfinite(v) & np.isfinite(ref_gpa)
        table[name] = float(np.median(np.abs(np.log10(v[ok] / ref_gpa[ok])))) if ok.sum() >= 3 else np.nan
    valid = {k: v for k, v in table.items() if not np.isnan(v)}
    return (min(valid, key=valid.get) if valid else None), table


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    key = os.environ.get("MP_API_KEY")
    if not key:
        raise SystemExit("set MP_API_KEY in your environment first")
    df = pd.read_csv(sys.argv[1])
    df["mp_id"] = df["material_id"].map(mp_id)
    ids = sorted(set(df["mp_id"].dropna()))
    if not ids:
        raise SystemExit("no file names contain an MP id (mp-1234), nothing to compare")
    m = df.merge(fetch_mp(ids, key), on="mp_id", how="inner")
    print(f"compared {len(m)} materials with MP ids\n")

    def report(label, a, b, unit):
        ok = a.notna() & b.notna()
        if ok.sum() < 2:
            print(f"{label:<22} not enough data"); return
        err = (a[ok] - b[ok])
        r = np.corrcoef(a[ok], b[ok])[0, 1] if ok.sum() > 2 else np.nan
        print(f"{label:<22} n={ok.sum():<4} MAE={err.abs().mean():.3f} {unit:<8} bias={err.mean():+.3f}  r={r:.3f}")

    report("formation energy", m["formation_energy_eV_atom"], m["mp_formation_energy"], "eV/atom")
    report("band gap", m["band_gap_eV"], m["mp_band_gap"], "eV")
    print("  (energy above hull is checked by ehull_from_mp.py, not here)\n")

    for label, raw_col, ref_col in [("bulk", "raw_bulk_modulus", "mp_bulk_GPa"),
                                    ("shear", "raw_shear_modulus", "mp_shear_GPa")]:
        ok = m[raw_col].notna() & m[ref_col].notna()
        best, table = choose_transform(m.loc[ok, raw_col].to_numpy(float), m.loc[ok, ref_col].to_numpy(float))
        print(f"{label} modulus, median |log10(pred/MP)| per conversion (0 = perfect, n={ok.sum()}): {table}")
        print(f"  -> best conversion: {best}\n")
    out = os.path.splitext(sys.argv[1])[0] + "_vs_mp.csv"
    m.to_csv(out, index=False); print("saved", out)


if __name__ == "__main__":
    main()
