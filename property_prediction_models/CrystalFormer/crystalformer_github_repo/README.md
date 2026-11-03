# CrystalFormer property predictor (CIF files → 7 properties)

Runs the authors' pretrained **CrystalFramer / CrystalFormer** checkpoints on CIF files and writes a CSV.
Four properties come from the model; three more are calculated from them with published formulas.

| # | Column in `predictions.csv` | Unit | Source |
|---|---|---|---|
| 1 | `formation_energy_eV_atom` | eV/atom | model (`mp_e_form.ckpt`) |
| 2 | `band_gap_eV` | eV | model (`mp_bandgap.ckpt`) |
| 3 | `bulk_modulus_GPa` | GPa | model (`mp_bulk_modulus.ckpt`, log10 → GPa) |
| 4 | `shear_modulus_GPa` | GPa | model (`mp_shear_modulus.ckpt`, log10 → GPa) |
| 5 | `youngs_modulus_GPa` | GPa | `E = 9KG / (3K + G)` |
| 6 | `fracture_toughness_MPa_m05` | MPa·m^½ | `K_IC = 0.01 · V0^(1/6) · G · √(K/G)` (Niu–Oganov model for ionic/covalent crystals; V0 = Å³ per atom from the CIF; 0.01 converts GPa·Å^½ to MPa·m^½) |
| 7 | `electronic_conductivity_S_cm` | S/cm | `σ = 10⁴ · exp(−Eg / 2k_BT)`, T = 300 K, clipped to 1e-16 … 1e4 (rough intrinsic estimate) |

All formulas live in `derived_properties.py` (no GPU needed; `python derived_properties.py` runs a self-test).
Energy above hull is **not** produced by the model (see "Energy above hull" below).

## Reliability (read this before using the numbers)
Measured on two small sets of 50 lithium compounds against Materials Project values, so treat as indicative only:

* Formation energy: mean error 0.03–0.06 eV/atom (0.08 on non-metals). The paper reports 0.017 on its test set.
* Band gap: 0.13–0.28 eV on non-metals; larger for transition-metal compounds.
* Bulk / shear modulus: median error ≈ 5 % / 19 % on lithium compounds that have Materials Project elastic data;
  these materials are probably in the training data, so expect worse on new structures. Shear modulus has a long tail
  (about one in ten off by more than 50 %).
* Young's modulus, fracture toughness, conductivity inherit those errors. Fracture toughness is an empirical model
  meant for insulators, and conductivity is a crude indicator (it sits on the 1e-16 floor for gaps above about 2.4 eV).
  None of the three has been validated against measurements here.

## Layout
```
predict_5_properties.py   main script (CIF folder/zip/file → predictions.csv)
derived_properties.py     formulas for properties 5-7
check_env.py, smoke_test.py   environment checks
setup_linux.sh, run_linux.sh  Docker route (recommended on an A100 server)
setup_conda.sh                conda route (no Docker, untested)
setup.ps1, run.ps1, common.ps1, README_WINDOWS.md   Windows 11 + Docker Desktop route
patch/Dockerfile          pins pandas 2.2.3 / numpy 1.26.4 on top of the authors' image
ehull_from_mp.py          optional: energy above hull from predicted formation energy (needs a Materials Project API key)
check_against_mp.py, tune_check.py, diag_env.py, inspect_ckpt.py, predict_ehull_only.py   developer tools
requirements.txt
```
Not in this repository (see `.gitignore`): the authors' code (`crystalframer/`), the checkpoints (`weights/`),
your CIFs (`inputs/`), results (`outputs/`) and `mp_api_key.txt`.

## Setup on an A100 machine with Docker (recommended)
1. Needs: Linux, an NVIDIA driver supporting CUDA 12.1 (≥ 525), Docker, NVIDIA Container Toolkit, git.
   Check: `docker run --rm --gpus all nvidia/cuda:12.1.1-base-ubuntu22.04 nvidia-smi` shows the A100.
2. `git clone <this repo> && cd <this repo>`
3. Put the 4 checkpoints in `weights/`: `mp_e_form.ckpt  mp_bandgap.ckpt  mp_bulk_modulus.ckpt  mp_shear_modulus.ckpt`
   (WEIGHTS SOURCE: **fill in where these files are downloaded from**).
4. `bash setup_linux.sh` (clones the authors' code, builds the image, runs the environment check; about 15–20 GB, 20–60 min).
   The last lines must show `cupy kernel compile + run: OK` and `ENV OK`.
5. Put `.cif` files in `inputs/`, then `bash run_linux.sh`. Results: `outputs/predictions.csv`.
   The A100 has plenty of memory: `bash run_linux.sh predict --batch-size 64` (halves automatically on out-of-memory).

## No Docker (conda + pip, untested)
`bash setup_conda.sh`, then
```
conda activate crystalformer
export CF_REPO_DIR=$PWD/crystalframer CF_WEIGHTS_DIR=$PWD/weights
python predict_5_properties.py --input inputs --output outputs/predictions.csv --batch-size 32
```
The attention kernels are compiled at run time by cupy and need the CUDA 12.1 toolkit headers. On a cluster run
`module load cuda/12.1` first. If `check_env.py` reports a cupy compile error, that is the cause.

## Energy above hull (optional, needs internet)
The `jarvis_ehull.ckpt` checkpoint gave values that did not match Materials Project (not used).
Instead, `ehull_from_mp.py` builds the hull from the **predicted formation energy** plus known phases from the
Materials Project API. Save a free API key in `mp_api_key.txt` (never commit it), then `bash run_linux.sh ehull`.
Expect roughly ±0.05–0.1 eV/atom, which is too coarse for a 30 meV/atom cut; use it only as a pre-filter.
For materials that already have a Materials Project ID, use MP's own value.

## Licence / credits
Model, code and weights belong to the CrystalFramer authors (Ito et al., ICLR 2025): check their licence before
redistributing weights. Add your own LICENSE file for the scripts in this repository.
