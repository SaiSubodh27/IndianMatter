# data/ — Benchmark data files

Column-delimited `.dat` files (gnuplot / matplotlib compatible) recording
pipeline behaviour across compound sets.

| File | Contains |
|---|---|
| `batch_test_cases.dat` | Results for the benchmark materials: success/fail, source, space group, timing. |
| `compound_classes.dat` | Coverage by material class (ionic / metallic / covalent / special). |
| `mesp_cases.dat` | MESP plausibility-check results. |
| `polymorph_cases.dat` | Polymorph disambiguation results for known multi-polymorph compounds. |
| `symmetry_groups.dat` | Space-group distribution of generated/retrieved structures. |

These are static reference snapshots, not live output. To regenerate them, run
`python scripts/run_pipeline_audit.py`, which writes its machine-readable
results to `../outputs/audit/pipeline_audit.json`.
