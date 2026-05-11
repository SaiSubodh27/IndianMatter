#!/usr/bin/env python3
"""
Compute Li-site finite-displacement vibrational features with the cached
MatGL/M3GNet potential.

This is a strict non-proxy feature generator:
- It uses M3GNet forces from actual CIF structures.
- It skips disordered structures that ASE cannot represent as ordered atoms.
- It records per-material errors instead of filling fake values.

The output is intended as an input feature table for pre-exponential-factor
modeling or for audit columns in the integrated HES/DRF/conductivity table.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
import types
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
from pymatgen.core import Structure
from pymatgen.io.ase import AseAtomsAdaptor


EV_PER_A2_TO_N_PER_M = 16.02176634
AMU_TO_KG = 1.66053906660e-27
LI_MASS_AMU = 6.94


def load_m3gnet_model_and_calculator_class():
    """Load cached M3GNet and return the model plus ASE calculator class."""
    sys.modules.setdefault("dgl.graphbolt", types.ModuleType("dgl.graphbolt"))

    import matgl

    matgl.set_backend("DGL")
    from matgl.ext.ase import M3GNetCalculator

    model = matgl.load_model("M3GNet-MP-2021.2.8-PES")
    return model, M3GNetCalculator


def force_constant_to_frequency_thz(k_ev_a2: float, mass_amu: float = LI_MASS_AMU) -> float:
    """Convert scalar force constant to harmonic frequency in THz."""
    if not np.isfinite(k_ev_a2) or k_ev_a2 <= 0:
        return np.nan
    k_n_m = k_ev_a2 * EV_PER_A2_TO_N_PER_M
    mass_kg = mass_amu * AMU_TO_KG
    omega_rad_s = math.sqrt(k_n_m / mass_kg)
    return omega_rad_s / (2.0 * math.pi) / 1e12


def compute_li_displacement_features(
    cif_path: Path,
    model,
    calculator_cls,
    displacement_a: float = 0.01,
    max_li_sites: int = 6,
) -> dict[str, object]:
    """Compute finite-displacement force constants for Li sites."""
    structure = Structure.from_file(str(cif_path))
    if not structure.is_ordered:
        raise ValueError("structure is disordered/partially occupied; ASE requires ordered sites")

    atoms = AseAtomsAdaptor.get_atoms(structure)
    atoms.calc = calculator_cls(model)

    base_energy = float(atoms.get_potential_energy())
    base_forces = np.asarray(atoms.get_forces(), dtype=float)
    base_force_norms = np.linalg.norm(base_forces, axis=1)

    li_indices = [i for i, atom in enumerate(atoms) if atom.symbol == "Li"]
    if not li_indices:
        raise ValueError("no Li sites found")
    selected_li = li_indices[:max_li_sites]

    constants = []
    for site_idx in selected_li:
        for axis in range(3):
            displaced = atoms.copy()
            displaced.calc = calculator_cls(model)
            displaced.positions[site_idx, axis] += displacement_a
            displaced_forces = np.asarray(displaced.get_forces(), dtype=float)
            delta_force = displaced_forces[site_idx, axis] - base_forces[site_idx, axis]
            k_axis = -delta_force / displacement_a
            constants.append(float(k_axis))

    constants_arr = np.asarray(constants, dtype=float)
    positive_constants = constants_arr[constants_arr > 0]
    freq_thz = np.asarray(
        [force_constant_to_frequency_thz(k) for k in positive_constants],
        dtype=float,
    )

    return {
        "material_id": cif_path.stem,
        "m3gnet_energy_ev": base_energy,
        "m3gnet_energy_per_atom_ev": base_energy / max(len(atoms), 1),
        "m3gnet_force_norm_mean_ev_a": float(np.mean(base_force_norms)),
        "m3gnet_force_norm_max_ev_a": float(np.max(base_force_norms)),
        "m3gnet_n_li_sites": int(len(li_indices)),
        "m3gnet_n_li_sites_sampled": int(len(selected_li)),
        "li_fd_k_mean_ev_a2": float(np.mean(constants_arr)),
        "li_fd_k_std_ev_a2": float(np.std(constants_arr)),
        "li_fd_k_min_ev_a2": float(np.min(constants_arr)),
        "li_fd_k_max_ev_a2": float(np.max(constants_arr)),
        "li_fd_k_positive_fraction": float(len(positive_constants) / len(constants_arr)),
        "li_fd_freq_mean_thz": float(np.nanmean(freq_thz)) if len(freq_thz) else np.nan,
        "li_fd_freq_std_thz": float(np.nanstd(freq_thz)) if len(freq_thz) else np.nan,
        "li_fd_freq_min_thz": float(np.nanmin(freq_thz)) if len(freq_thz) else np.nan,
        "li_fd_freq_max_thz": float(np.nanmax(freq_thz)) if len(freq_thz) else np.nan,
        "li_fd_log10_attempt_frequency_hz": (
            float(np.log10(np.nanmean(freq_thz) * 1e12)) if len(freq_thz) else np.nan
        ),
        "m3gnet_feature_status": "ok",
    }


def load_material_ids(path: Path | None) -> list[str] | None:
    if path is None:
        return None
    df = pd.read_csv(path)
    if "material_id" in df.columns:
        return df["material_id"].astype(str).tolist()
    if "Material" in df.columns:
        return df["Material"].astype(str).tolist()
    raise ValueError(f"{path} must contain material_id or Material")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cif-dir", default="Obliex_cifs/all_randomized_cifs")
    parser.add_argument(
        "--materials-csv",
        default=None,
        help="Optional CSV containing material_id or Material to restrict calculation.",
    )
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--max-li-sites", type=int, default=6)
    parser.add_argument("--displacement-a", type=float, default=0.01)
    parser.add_argument("--output-dir", default="ranking_results")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    cif_dir = Path(args.cif_dir)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    selected_ids = load_material_ids(Path(args.materials_csv)) if args.materials_csv else None
    if selected_ids is None:
        cif_paths = sorted(cif_dir.glob("*.cif"))
    else:
        cif_paths = [cif_dir / f"{mid}.cif" for mid in selected_ids]
    if args.limit:
        cif_paths = cif_paths[: args.limit]

    model, calculator_cls = load_m3gnet_model_and_calculator_class()

    rows = []
    for i, cif_path in enumerate(cif_paths, start=1):
        row: dict[str, object] = {"material_id": cif_path.stem}
        try:
            if not cif_path.exists():
                raise FileNotFoundError(str(cif_path))
            row.update(
                compute_li_displacement_features(
                    cif_path,
                    model=model,
                    calculator_cls=calculator_cls,
                    displacement_a=args.displacement_a,
                    max_li_sites=args.max_li_sites,
                )
            )
            print(f"[{i}/{len(cif_paths)}] {cif_path.stem}: ok")
        except Exception as exc:
            row.update(
                {
                    "m3gnet_feature_status": "failed",
                    "m3gnet_feature_error": repr(exc),
                }
            )
            print(f"[{i}/{len(cif_paths)}] {cif_path.stem}: failed: {exc}")
        rows.append(row)

    out = pd.DataFrame(rows)
    output_csv = output_dir / f"m3gnet_li_finite_displacement_features_{timestamp}.csv"
    output_json = output_dir / f"m3gnet_li_finite_displacement_features_{timestamp}.json"
    out.to_csv(output_csv, index=False)
    output_json.write_text(
        json.dumps(
            {
                "timestamp": timestamp,
                "n_rows": len(out),
                "n_ok": int((out["m3gnet_feature_status"] == "ok").sum()),
                "n_failed": int((out["m3gnet_feature_status"] == "failed").sum()),
                "displacement_a": args.displacement_a,
                "max_li_sites": args.max_li_sites,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Saved {output_csv}")
    print(f"Saved {output_json}")


if __name__ == "__main__":
    main()
