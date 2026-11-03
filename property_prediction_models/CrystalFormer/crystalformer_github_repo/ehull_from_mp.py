#!/usr/bin/env python3
"""
ehull_from_mp.py -- runs INSIDE the container:   run.ps1 ehull
Estimates the energy above hull of each predicted material.

How: it reads outputs/predictions.csv (formula + predicted formation energy), downloads the known competing
phases of that chemical system (their formation energies) from the Materials Project API, builds the convex hull
of those phases, and measures how far the predicted formation energy sits above it.

  * If a file's name is an MP id (mp-1234) that material is left OUT of the hull, so it is treated as unknown.
  * For MP ids it also reports MP's own energy above hull, and a "method check" that repeats the calculation
    with MP's TRUE formation energy. The method check should be close to MP's value: if it is not, the hull
    step (not the model) is the problem.

Needs: internet + a free Materials Project API key in the environment (MP_API_KEY) or in a file named
mp_api_key.txt next to this script.   `ehull_from_mp.py --selftest` checks the hull math offline.

Accuracy: the estimate inherits the formation-energy error (about 0.03-0.05 eV/atom), plus differences between
the Materials Project version the model was trained on and the current database. Treat it as +-0.05-0.1 eV/atom.
"""
import argparse, csv, itertools, math, os, re, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
API = "https://api.materialsproject.org/materials/summary/"
FIELDS = "material_id,composition_reduced,formation_energy_per_atom,energy_above_hull"
MAX_ELEMENTS = 6


def get_key():
    k = os.environ.get("MP_API_KEY", "").strip()
    if k:
        return k
    for path in (os.path.join(HERE, "mp_api_key.txt"), "mp_api_key.txt"):
        if os.path.exists(path):
            return open(path).read().strip()
    raise SystemExit("No Materials Project API key. Put it in mp_api_key.txt next to run.ps1 (one line), "
                     "or set MP_API_KEY. Free key: https://next-gen.materialsproject.org/api")


def fetch_phases(elements, key):
    """All MP materials whose chemical system is a subset of `elements` (incl. the elements themselves)."""
    import requests
    systems = ["-".join(c) for k in range(1, len(elements) + 1) for c in itertools.combinations(elements, k)]
    out, skip = [], 0
    while True:
        r = requests.get(API, headers={"X-API-KEY": key, "accept": "application/json"},
                         params={"chemsys": ",".join(systems), "_fields": FIELDS, "_limit": 1000, "_skip": skip},
                         timeout=90)
        if r.status_code != 200:
            raise RuntimeError(f"MP API HTTP {r.status_code}: {r.text[:200]}")
        j = r.json()
        data = j.get("data", [])
        out += data
        skip += len(data)
        total = (j.get("meta") or {}).get("total_doc", len(out))
        if not data or skip >= total:
            return out


def fetch_one(mid, key):
    """Look one material up directly (used when it was not among the chemical-system results)."""
    import requests
    r = requests.get(API, headers={"X-API-KEY": key, "accept": "application/json"},
                     params={"material_ids": mid, "_fields": FIELDS}, timeout=60)
    if r.status_code != 200:
        return None
    data = r.json().get("data", [])
    return data[0] if data else None


def ehull_from_phases(formula, ef_per_atom, phases, exclude_id=None):
    """Energy above the hull of the KNOWN phases (formation-energy space); negative = below the known hull."""
    from pymatgen.core import Composition
    from pymatgen.analysis.phase_diagram import PDEntry, PhaseDiagram
    comp = Composition(formula)
    best = {}
    for d in phases:
        if exclude_id and d.get("material_id") == exclude_id:
            continue
        e = d.get("formation_energy_per_atom")
        if e is None or d.get("composition_reduced") is None:
            continue
        c = Composition(d["composition_reduced"])
        key = c.reduced_formula
        if key not in best or e < best[key][0]:
            best[key] = (e, c)
    entries = [PDEntry(Composition(str(el)), 0.0) for el in comp.elements]       # elemental references = 0
    entries += [PDEntry(c, e * c.num_atoms) for e, c in best.values()]
    pdiag = PhaseDiagram(entries)
    return ef_per_atom - pdiag.get_hull_energy_per_atom(comp)


def selftest():
    toy = [dict(material_id="a", composition_reduced={"Li": 2, "O": 1}, formation_energy_per_atom=-2.07, energy_above_hull=0.0),
           dict(material_id="b", composition_reduced={"Li": 2, "O": 2}, formation_energy_per_atom=-1.90, energy_above_hull=0.0)]
    t1 = ehull_from_phases("Li2O", -1.97, toy)                    # 0.10 above the known Li2O point
    t2 = ehull_from_phases("Li2O", -2.07, toy, exclude_id="a")    # own entry removed -> sits below the remaining hull
    t3 = ehull_from_phases("Li2O", -2.07, toy)                    # exactly on the hull
    print(f"test1 expect +0.100  got {t1:+.3f}\ntest2 expect -0.803  got {t2:+.3f}\ntest3 expect +0.000  got {t3:+.3f}")
    ok = abs(t1 - 0.10) < 1e-6 and abs(t3) < 1e-6 and abs(t2 + 0.80333) < 1e-3
    print("SELFTEST", "PASSED" if ok else "FAILED")
    sys.exit(0 if ok else 1)


def hint(x):
    if x is None or (isinstance(x, float) and math.isnan(x)):
        return ""
    return "on/near hull" if x <= 0.05 else ("metastable?" if x <= 0.2 else "likely unstable")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default="/workspace/outputs/predictions.csv")
    ap.add_argument("--output", default="/workspace/outputs/predictions_with_ehull.csv")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()
    if args.selftest:
        selftest()

    from pymatgen.core import Composition
    key = get_key()
    rows = list(csv.DictReader(open(args.input)))
    cache = {}
    cmp_est, cmp_chk = [], []
    t0 = time.time()
    for i, r in enumerate(rows):
        r.update(ehull_est_eV_atom="", ehull_mp_database_eV_atom="", ehull_method_check_eV_atom="",
                 stability_hint="", ehull_note="")
        try:
            ef = float(r["formation_energy_eV_atom"])
            if math.isnan(ef):
                r["ehull_note"] = "no prediction for this row"
                continue
            els = tuple(sorted(str(e) for e in Composition(r["formula"]).elements))
            if len(els) > MAX_ELEMENTS:
                r["ehull_note"] = f"skipped: more than {MAX_ELEMENTS} elements"
                continue
            if els not in cache:
                cache[els] = fetch_phases(els, key)
                print(f"  {'-'.join(els):<24} {len(cache[els]):5d} known phases", flush=True)
            phases = cache[els]
            mid = r["material_id"] if re.fullmatch(r"mp-\d+", r["material_id"]) else None
            est = ehull_from_phases(r["formula"], ef, phases, exclude_id=mid)
            r["ehull_est_eV_atom"] = f"{est:.4f}"
            r["stability_hint"] = hint(est)
            if mid:
                own = next((d for d in phases if d.get("material_id") == mid), None)
                if own is None:
                    own = fetch_one(mid, key)          # maybe just missing from the chemsys listing
                    r["ehull_note"] = "own MP id fetched separately" if own else "MP id not in the current MP database (removed/renumbered?)"
                if own and own.get("energy_above_hull") is not None and own.get("formation_energy_per_atom") is not None:
                    chk = ehull_from_phases(r["formula"], own["formation_energy_per_atom"], phases, exclude_id=mid)
                    r["ehull_mp_database_eV_atom"] = f"{own['energy_above_hull']:.4f}"
                    r["ehull_method_check_eV_atom"] = f"{chk:.4f}"
                    cmp_est.append(abs(max(est, 0) - own["energy_above_hull"]))   # stable phases: hull-without-self is negative, MP says 0
                    cmp_chk.append(abs(max(chk, 0) - own["energy_above_hull"]))
        except Exception as e:
            r["ehull_note"] = f"FAILED {type(e).__name__}: {str(e)[:120]}"

    cols = list(rows[0].keys())
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
    print(f"\nwrote {args.output}  ({len(rows)} rows, {time.time() - t0:.0f}s)")
    if cmp_est:
        print(f"MP-id rows: n={len(cmp_est)}  mean |est - MP hull| = {sum(cmp_est) / len(cmp_est):.3f} eV/atom   "
              f"(method check using MP's true formation energy: {sum(cmp_chk) / len(cmp_chk):.3f})")
        print("If the method check is NOT small (<~0.03), the hull step is off, not the model.")
    fails = [r for r in rows if r["ehull_note"].startswith("FAILED")]
    if fails:
        print(f"{len(fails)} rows failed, first: {fails[0]['ehull_note']}")


if __name__ == "__main__":
    main()
