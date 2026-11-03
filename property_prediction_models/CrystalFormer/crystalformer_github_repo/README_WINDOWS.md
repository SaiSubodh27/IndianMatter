# Crystalformer on HP Victus (RTX 3050 4 GB, Windows 11): predictions from CIF files

(The main README.md describes the 7 output properties and the Linux/A100 route. This file is the Windows route.)

## Layout
```
Model\
  CrystalFormer\crystalframer\            (authors' clone)
  CrystalFormer\crystalframer_weights\    (checkpoints)
  cf_predict\                             <- these scripts, plus inputs\ and outputs\
```
The container mounts only `Model\`. The scripts find the clone and `mp_e_form.ckpt` by searching under `Model\`.

## Everyday use (from Ubuntu: prefix with `powershell.exe -ExecutionPolicy Bypass -File ./run.ps1 ...`)
1. Put `.cif` files in `cf_predict\inputs\`.
2. `.\run.ps1`  ->  `outputs\predictions.csv`
3. Optional, energy above hull: `.\run.ps1 ehull`  ->  `outputs\predictions_with_ehull.csv`

## What each output means
| Column | How far to trust it |
|---|---|
| formation_energy_eV_atom | Reliable. 0.034 eV/atom mean error vs Materials Project on a 50-material test |
| band_gap_eV | Good. ~0.3 eV mean error on the same test |
| bulk_modulus_GPa, shear_modulus_GPa | ROUGH. Underestimated on average in the test; can be off by ~2x for unusual compounds |
| youngs_modulus_GPa, fracture_toughness_MPa_m05, electronic_conductivity_S_cm | Calculated from the predicted K, G and band gap with the formulas in derived_properties.py; they inherit those errors |
| ehull_est_eV_atom (after `ehull`) | Estimate, roughly +-0.05 to 0.1 eV/atom. See below |

The old JARVIS "ehull" checkpoint is no longer used: its stored target statistics (mean 1.77, std 1.39) show it was
not trained on a plain energy above hull, and its outputs did not match Materials Project values.

## Energy above hull (`run.ps1 ehull`)
Uses the PREDICTED formation energy and the known competing phases from the Materials Project.
- Get a free API key at https://next-gen.materialsproject.org/api and save it as a single line in
  `cf_predict\mp_api_key.txt`. Do not share this file.
- Needs internet. Check the hull code offline first: `.\run.ps1 ehull --selftest` (should print SELFTEST PASSED).
- For files named `mp-XXXX.cif` the material is left out of its own hull, and the output also shows MP's database
  value (`ehull_mp_database_eV_atom`) plus a `ehull_method_check` column. The method check repeats the calculation
  with MP's TRUE formation energy: it should be close to MP's value. If it is not, the hull step has a problem.
- Negative values mean "below the known hull" (a possibly new stable phase, or just formation-energy error).
- `stability_hint` is only a rough label: on/near hull <= 0.05, metastable? <= 0.2, likely unstable above that.

## Setup (once)
Docker Desktop (WSL2), NVIDIA driver, then `setup.ps1`. If `import pandas` fails in the image: `.\run.ps1 patch`
(pins pandas 2.2.3 / numpy 1.26.4). If the clone contains a stand-in `torch_scatter.py`, rename it: the image has the
real package.

## Other commands
`.\run.ps1 test-gpu` GPU check | `.\run.ps1 diag` import check | `.\run.ps1 ckpt` show what each checkpoint contains |
`.\run.ps1 tune` settings comparison (optional) | `.\run.ps1 shell` shell in the container

## RTX 3050 notes
Models run one at a time; batch size starts at 4 and halves automatically on CUDA out-of-memory.

## Not verified
- Written without access to your GPU/Docker. The hull step has been tested only with stand-in data here, not against
  the live Materials Project API.
- The moduli accuracy figures come from one 50-material, lithium-heavy test set.
