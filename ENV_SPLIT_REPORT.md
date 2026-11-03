# Environment split report

- **A** = `C:\Users\saisu\OneDrive\Desktop\Final_ validation\backend\venv\Scripts\python.exe` (Python 3.11.9, bytecode tag `cpython-311`)
- **B** = `C:\Users\saisu\OneDrive\Desktop\Final_ validation\.venv\Scripts\python.exe` (Python 3.13.14, bytecode tag `cpython-313`)
- Files analysed: 239 | mode: normal (only import-time imports count)
- Labels: **A-only** = runs in py311 but not py313; **B-only** = the reverse; **both** = runs in either; **neither** = missing something in both.

## Summary

| class | files |
|---|---|
| A-only | 9 |
| B-only | 6 |
| both | 205 |
| neither | 19 |
| unknown | 0 |

## What forces the split
Packages (or stdlib modules) the project imports that exist in only one environment.

| package | only in | files that need it |
|---|---|---|
| jarvis | py313 | 6 |
| distutils | py311 | 4 |
| authlib | py311 | 3 |
| tenacity | py311 | 2 |

## By folder

| folder | A-only | B-only | both | neither |
|---|---|---|---|---|
| . | 0 | 0 | 2 | 0 |
| backend | 1 | 0 | 13 | 0 |
| backend/CrystalFormer | 4 | 6 | 60 | 18 |
| backend/Surrogative_models | 0 | 0 | 3 | 0 |
| backend/api | 0 | 0 | 1 | 0 |
| backend/calculations | 0 | 0 | 5 | 0 |
| backend/cif_analyzer | 0 | 0 | 1 | 0 |
| backend/cif_pipeline | 0 | 0 | 39 | 0 |
| backend/core | 0 | 0 | 5 | 0 |
| backend/models | 0 | 0 | 7 | 0 |
| backend/parsing | 0 | 0 | 3 | 0 |
| backend/prediction | 2 | 0 | 4 | 0 |
| backend/prediction_models | 0 | 0 | 5 | 0 |
| backend/properties | 0 | 0 | 7 | 0 |
| backend/routes | 1 | 0 | 9 | 0 |
| backend/services | 0 | 0 | 9 | 0 |
| backend/tests | 1 | 0 | 2 | 0 |
| backend/utils | 0 | 0 | 3 | 0 |
| backend/workers | 0 | 0 | 1 | 0 |
| datasets/upload | 0 | 0 | 1 | 0 |
| ml/legacy_scripts | 0 | 0 | 6 | 0 |
| scripts | 0 | 0 | 8 | 1 |
| tools | 0 | 0 | 11 | 0 |

## Runs in A only (py311) (9)
These need something that py313 does not have.

- `backend/main.py` - missing in py313: authlib
- `backend/CrystalFormer/CrystalFormer/crystalframer/demo.py` - missing in py313: distutils
- `backend/CrystalFormer/CrystalFormer/crystalframer/train.py` - missing in py313: distutils
- `backend/CrystalFormer/crystalframer/demo.py` - missing in py313: distutils
- `backend/CrystalFormer/crystalframer/train.py` - missing in py313: distutils
- `backend/prediction/EHull_Prediction_Tool/ehull_tool.py` - missing in py313: tenacity
- `backend/prediction/EHull_Prediction_Tool/predict.py` - missing in py313: tenacity
- `backend/routes/auth_routes.py` - missing in py313: authlib
- `backend/tests/test_api_routes.py` - missing in py313: authlib

## Runs in B only (py313) (6)
These need something that py311 does not have.

- `backend/CrystalFormer/CrystalFormer/crystalframer/data/download_jarvis.py` - missing in py311: jarvis
- `backend/CrystalFormer/CrystalFormer/crystalframer/data/download_megnet_elastic.py` - missing in py311: jarvis
- `backend/CrystalFormer/CrystalFormer/crystalframer/data/download_oqmd.py` - missing in py311: jarvis
- `backend/CrystalFormer/crystalframer/data/download_jarvis.py` - missing in py311: jarvis
- `backend/CrystalFormer/crystalframer/data/download_megnet_elastic.py` - missing in py311: jarvis
- `backend/CrystalFormer/crystalframer/data/download_oqmd.py` - missing in py311: jarvis

## Runs in neither (19)
Check these first. Often a path hack (sys.path.insert), a module outside the import roots, or a package nobody installed yet.

- `backend/CrystalFormer/CrystalFormer/crystalframer/models/indexed_lattice_multi_head_attention_cuda.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/indexed_latticeformer_encoder.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/latticeformer.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/pooling.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/__init__.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/calc_lattice_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/calc_maximum_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/calc_maximum_static_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/calc_pca_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/indexed_lattice_multi_head_attention_cuda.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/indexed_latticeformer_encoder.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/latticeformer.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/pooling.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/__init__.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/calc_lattice_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/calc_maximum_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/calc_maximum_static_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/calc_pca_frame.py` - missing in py311: torch_scatter | in py313: torch_scatter
- `scripts/build_v5_dataset.py` - missing in py311: src | in py313: src

## Runs in both (205)

- `env_split.py`
- `m3gnet_finite_displacement_features.py`
- `backend/auth.py`
- `backend/cif_descriptors.py`
- `backend/database.py`
- `backend/db_models.py`
- `backend/megnet_patch.py`
- `backend/model_paths.py`
- `backend/model_service.py`
- `backend/predict_ionic_conductivity.py`
- `backend/test_trial_pipeline.py`
- `backend/train_electrical.py`
- `backend/train_mechanical.py`
- `backend/train_thermal.py`
- `backend/webapp.py`
- `backend/CrystalFormer/__init__.py`
- `backend/CrystalFormer/cif_generator_bridge.py`
- `backend/CrystalFormer/crystalformer_service.py`
- `backend/CrystalFormer/derived_properties.py`
- `backend/CrystalFormer/CrystalFormer/check_crystalformer.py`
- `backend/CrystalFormer/CrystalFormer/test_load_all.py`
- `backend/CrystalFormer/CrystalFormer/test_predict.py`
- `backend/CrystalFormer/CrystalFormer/update_notebook.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/init_datasets.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/utils.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/data/check_datasets.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/data/make_id_list.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/dataloaders/common.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/dataloaders/dataset_latticeformer.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/losses/regression_loss.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/global_config.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/indexed_lattice_multi_head_attention.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/latticeformer_params.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/regression.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/cupy_utils.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/fused_dpa.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/fused_dpa_sigmamat.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/irregular_mean.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/kernel_manager.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/minimum_distance.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/real_space_enc.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/real_space_enc_proj.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/real_space_framed_proj.py`
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/cuda_funcs/reci_space_enc.py`
- `backend/CrystalFormer/crystalformer_github_repo/check_against_mp.py`
- `backend/CrystalFormer/crystalformer_github_repo/check_env.py`
- `backend/CrystalFormer/crystalformer_github_repo/derived_properties.py`
- `backend/CrystalFormer/crystalformer_github_repo/diag_env.py`
- `backend/CrystalFormer/crystalformer_github_repo/ehull_from_mp.py`
- `backend/CrystalFormer/crystalformer_github_repo/inspect_ckpt.py`
- `backend/CrystalFormer/crystalformer_github_repo/predict_5_properties.py`
- `backend/CrystalFormer/crystalformer_github_repo/predict_ehull_only.py`
- `backend/CrystalFormer/crystalformer_github_repo/smoke_test.py`
- `backend/CrystalFormer/crystalformer_github_repo/tune_check.py`
- `backend/CrystalFormer/crystalframer/init_datasets.py`
- `backend/CrystalFormer/crystalframer/utils.py`
- `backend/CrystalFormer/crystalframer/data/check_datasets.py`
- `backend/CrystalFormer/crystalframer/data/make_id_list.py`
- `backend/CrystalFormer/crystalframer/dataloaders/common.py`
- `backend/CrystalFormer/crystalframer/dataloaders/dataset_latticeformer.py`
- `backend/CrystalFormer/crystalframer/losses/regression_loss.py`
- `backend/CrystalFormer/crystalframer/models/global_config.py`
- `backend/CrystalFormer/crystalframer/models/indexed_lattice_multi_head_attention.py`
- `backend/CrystalFormer/crystalframer/models/latticeformer_params.py`
- `backend/CrystalFormer/crystalframer/models/regression.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/cupy_utils.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/fused_dpa.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/fused_dpa_sigmamat.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/irregular_mean.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/kernel_manager.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/minimum_distance.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/real_space_enc.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/real_space_enc_proj.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/real_space_framed_proj.py`
- `backend/CrystalFormer/crystalframer/models/cuda_funcs/reci_space_enc.py`
- `backend/Surrogative_models/feature_extractor.py`
- `backend/Surrogative_models/final_validation/__init__.py`
- `backend/Surrogative_models/final_validation/validators.py`
- `backend/api/calculator_router.py`
- `backend/calculations/alignn_properties.py`
- `backend/calculations/descriptor_pipeline.py`
- `backend/calculations/download_alignn_local.py`
- `backend/calculations/eos.py`
- `backend/calculations/m3gnet_properties.py`
- `backend/cif_analyzer/cif_analyzer/backend.py`
- `backend/cif_pipeline/__init__.py`
- `backend/cif_pipeline/batch_processor.py`
- `backend/cif_pipeline/classify.py`
- `backend/cif_pipeline/config.py`
- `backend/cif_pipeline/dopant_pipeline.py`
- `backend/cif_pipeline/doping.py`
- `backend/cif_pipeline/family.py`
- `backend/cif_pipeline/filter_rules.py`
- `backend/cif_pipeline/formatting.py`
- `backend/cif_pipeline/fractions.py`
- `backend/cif_pipeline/general_doping.py`
- `backend/cif_pipeline/generate.py`
- `backend/cif_pipeline/geometry.py`
- `backend/cif_pipeline/intent.py`
- `backend/cif_pipeline/main.py`
- `backend/cif_pipeline/matching.py`
- `backend/cif_pipeline/mesp_check.py`
- `backend/cif_pipeline/mlip.py`
- `backend/cif_pipeline/models.py`
- `backend/cif_pipeline/orchestrator.py`
- `backend/cif_pipeline/ordering.py`
- `backend/cif_pipeline/parents.py`
- `backend/cif_pipeline/provenance.py`
- `backend/cif_pipeline/recognition.py`
- `backend/cif_pipeline/reference_fetch.py`
- `backend/cif_pipeline/regime.py`
- `backend/cif_pipeline/relax.py`
- `backend/cif_pipeline/representation.py`
- `backend/cif_pipeline/search_external.py`
- `backend/cif_pipeline/search_internal.py`
- `backend/cif_pipeline/site_analysis.py`
- `backend/cif_pipeline/site_preference.py`
- `backend/cif_pipeline/spinel_build.py`
- `backend/cif_pipeline/spinel_cif.py`
- `backend/cif_pipeline/supercell.py`
- `backend/cif_pipeline/symmetry_matrix.py`
- `backend/cif_pipeline/symmetry_paths.py`
- `backend/cif_pipeline/user_interaction.py`
- `backend/cif_pipeline/validation.py`
- `backend/core/config.py`
- `backend/core/device_manager.py`
- `backend/core/exceptions.py`
- `backend/core/job_manager.py`
- `backend/core/property_registry.py`
- `backend/models/__init__.py`
- `backend/models/base_adapter.py`
- `backend/models/chgnet_adapter.py`
- `backend/models/m3gnet_adapter.py`
- `backend/models/mace_adapter.py`
- `backend/models/model_registry.py`
- `backend/models/transformer_adapter.py`
- `backend/parsing/csv_parser.py`
- `backend/parsing/feature_validator.py`
- `backend/parsing/structure_parser.py`
- `backend/prediction/BFSY_pipeline.py`
- `backend/prediction/create_bfsy_pipeline_pkl.py`
- `backend/prediction/create_ef_model.py`
- `backend/prediction/EHull_Prediction_Tool/ehull_service.py`
- `backend/prediction_models/base_adapter.py`
- `backend/prediction_models/chgnet_adapter.py`
- `backend/prediction_models/m3gnet_adapter.py`
- `backend/prediction_models/mace_adapter.py`
- `backend/prediction_models/model_registry.py`
- `backend/properties/base_property.py`
- `backend/properties/composition_properties.py`
- `backend/properties/direct_outputs.py`
- `backend/properties/electrical_properties.py`
- `backend/properties/ionic_conductivity.py`
- `backend/properties/structural_properties.py`
- `backend/properties/thermal_properties.py`
- `backend/routes/aflow.py`
- `backend/routes/cif_routes.py`
- `backend/routes/database_routes.py`
- `backend/routes/indianmatter.py`
- `backend/routes/jarvis.py`
- `backend/routes/materials_routes.py`
- `backend/routes/oqmd.py`
- `backend/routes/transport_router.py`
- `backend/routes/user_routes.py`
- `backend/services/cif_electrical_features.py`
- `backend/services/cif_m3gnet_embeddings.py`
- `backend/services/download_service.py`
- `backend/services/m3gnet_structure_service.py`
- `backend/services/material_filter_service.py`
- `backend/services/materials_db_service.py`
- `backend/services/prediction_orchestrator.py`
- `backend/services/prediction_service.py`
- `backend/services/visualization_service.py`
- `backend/tests/test_dataset_validation.py`
- `backend/tests/test_property_calculators.py`
- `backend/utils/chgnet_features.py`
- `backend/utils/feature_extractor.py`
- `backend/utils/structural_analyzer.py`
- `backend/workers/prediction_worker.py`
- `datasets/upload/prediction_pipeline_routes.py`
- `ml/legacy_scripts/download_all_models.py`
- `ml/legacy_scripts/download_m3gnet.py`
- `ml/legacy_scripts/download_m3gnet_hf.py`
- `ml/legacy_scripts/download_m3gnet_manual.py`
- `ml/legacy_scripts/redownload_m3gnet.py`
- `ml/legacy_scripts/unified_m3gnet_approach.py`
- `scripts/check_dependencies.py`
- `scripts/check_deps_init.py`
- `scripts/check_gpu.py`
- `scripts/check_models.py`
- `scripts/link_material_ids.py`
- `scripts/run_backend_tests.py`
- `scripts/run_inference_cif.py`
- `scripts/run_prediction_example.py`
- `tools/build_registry.py`
- `tools/check_mentions.py`
- `tools/find_refs.py`
- `tools/make_manifest.py`
- `tools/make_manifest_v2.py`
- `tools/make_manifest_v3.py`
- `tools/phase1f.py`
- `tools/reorg.py`
- `tools/test_undo.py`
- `tools/undo_moves.py`
- `tools/verify_manifest.py`

## FastAPI app files

- `backend/main.py` -> A-only
- `backend/webapp.py` -> both
- `backend/cif_analyzer/cif_analyzer/backend.py` -> both

## Bytecode (.pyc) evidence that disagrees with the result (2)
A .pyc is written when a file is compiled, before it runs, so this does not prove it ran fine there. It does show the file was loaded under that version at some point.

- `backend/main.py` classed A-only but a py313 .pyc exists
- `backend/routes/auth_routes.py` classed A-only but a py313 .pyc exists

## Local imports that point at files that do not exist (18 files)

- `backend/CrystalFormer/crystalformer_service.py`: models.latticeformer
- `backend/CrystalFormer/CrystalFormer/test_load_all.py`: models.latticeformer
- `backend/CrystalFormer/CrystalFormer/test_predict.py`: models.latticeformer
- `backend/CrystalFormer/CrystalFormer/crystalframer/models/regression.py`: models.latticeformer
- `backend/CrystalFormer/crystalformer_github_repo/predict_5_properties.py`: models.latticeformer
- `backend/CrystalFormer/crystalframer/models/regression.py`: models.latticeformer
- `backend/models/chgnet_adapter.py`: calculations.strain_response
- `backend/models/m3gnet_adapter.py`: calculations.strain_response
- `backend/models/mace_adapter.py`: calculations.strain_response
- `backend/prediction_models/chgnet_adapter.py`: calculations.strain_response
- `backend/prediction_models/m3gnet_adapter.py`: calculations.strain_response
- `backend/prediction_models/mace_adapter.py`: calculations.strain_response
- `backend/services/cif_electrical_features.py`: properties.property_registry
- `backend/services/prediction_service.py`: calculations.strain_response, properties.property_registry
- `backend/tests/test_property_calculators.py`: properties.property_registry
- `backend/workers/prediction_worker.py`: backend.calculations.strain_response, properties.property_registry
- `datasets/upload/prediction_pipeline_routes.py`: properties.property_registry
- `scripts/run_prediction_example.py`: calculations.strain_response, properties.property_registry
