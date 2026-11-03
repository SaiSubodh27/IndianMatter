# IndianMatter — MODELS CODE Flow Chart (Artifact)

> Scope: root-level model download/feature scripts, `final_models/`, `pretrained_models/`, `Obliex_cifs/`, `configs/`, training notebooks, backend model loaders.
> Model artifacts on disk (actual inventory):

## 0. Model Artifact Inventory (verified on disk)

| Path | Size | What it is |
|---|---|---|
| `final_models\chgnet_weights\chgnet_model.pt` | 1.74 MB | full torch-pickled CHGNet universal Interatomic Potential |
| `final_models\m3gnet_weights\model.json` | 5.5 KB | matgl architecture JSON |
| `final_models\m3gnet_weights\model.pt` | 3.8 KB | matgl small tensor/file |
| `final_models\m3gnet_weights\state.pt` | 1.2 MB | matgl weight state |
| `final_models\mace_weights\20231203mace128L1_epoch199model` | 44.4 MB | MACE-MP medium raw checkpoint |
| `pretrained_models\v5_base_models.pkl` | 266 MB | v5 stackfold ensemble (XGB/LGBM/ET) |
| `pretrained_models\v5_meta_model.pkl` | 674 B | stacking meta-model |
| `pretrained_models\v5_mlp_models.pkl` | 13.7 MB | MLP member models |
| `pretrained_models\v5_model2_A.pkl` | 2.5 MB | "Model A" variant |
| `pretrained_models\v5_quantile_transformer.pkl` | 1.4 MB | QuantileTransformer scaler |
| `pretrained_models\v6_corrector_model.pkl` | 64 KB | v6 residual corrector |
| `pretrained_models\chgnet_logK_model.pkl` / `logG` | ~448 KB | mechanical surrogates |
| `pretrained_models\chgnet_bandgap_model.pkl` | 436 KB | electrical surrogate |
| `pretrained_models\chgnet_thermal_model.pkl` / `chgnet_Ef_model.pkl` | ~413 KB / 1.1 KB | thermal / formation-energy surrogates |
| `Obliex_cifs\all_randomized_cifs\` | 321 CIFs | research dataset (input to feature scripts) |
| `src\data\indianmatter\` | 38510.csv 2.68MB, chgnet_128_embeddings.csv 52.7MB, m3gnet_embeddings.csv 101.1MB, pymatgen_matminer.csv 59.8MB | embedded/training CSVs |

> ⚠️ Note: `final_models/` weights are effectively "cold storage" — the backend loads MLIPs by matgl/MACE cache names (e.g. `matgl.load_model(...)`), surrogates via `backend/model_paths.py` which resolves the root `pretrained_models/` first.

---

## 1. Model Acquisition Flow — Download Scripts

```mermaid
flowchart TD
    subgraph SCRIPTS["Root download scripts"]
        A1["download_all_models.py"]
        A2["download_m3gnet.py"]
        A3["download_m3gnet_hf.py"]
        A4["download_m3gnet_manual.py"]
        A5["redownload_m3gnet.py"]
    end

    A1 --> MKD["mkdir final_models/<br/>chgnet_weights, m3gnet_weights, mace_weights"]
    MKD --> CHG["CHGNet: chgnet.model.CHGNet.load()<br/>→ torch.save → chgnet_model.pt"]
    MKD --> MG1["M3GNet: matgl.set_backend('DGL')<br/>load 'M3GNet-MP-2021.2.8-PES'<br/>→ model.save(m3gnet_weights)"]
    MKD --> MAC["MACE: mace_mp('medium', cpu, float32)<br/>→ MACE's own ~/.cache/mace"]

    A2 --> MG1
    A2 --> MACCOPY["copies ~/.cache/mace → final_models/mace_weights"]

    A3 --> HFTXT["⚠️ old name no longer on HF"]
    HFTXT --> HFTRY["try matgl.load_model(<br/>'materialyze/M3GNet-PES-MatPES-PBE-2025.2').save"]
    HFTRY -- fail --> HFST["huggingface_hub.snapshot_download<br/>→ load from snapshot → re-save"]

    A4 --> GIT["raw GitHub urllib.urlretrieve ×3 files<br/>(model.pt, model.json, scaler.json)<br/>from matgl pretrained_models/<br/>M3GNet-MP-2021.2.8-PES/"]

    A5 --> NEW["matgl.load_model(<br/>'materialyze/M3GNet-PES-MatPES-PBE-2025.2')<br/>(PyG / matgl ≥3.0.0) → .save"]

    subgraph OUT["outputs verified on disk"]
        O1["m3gnet_weights/{model.json, model.pt, state.pt}"]
        O2["chgnet_model.pt"]
        O3["mace_weights/20231203mace128L1_epoch199model"]
    end
```

---

## 2. Runtime Model-Load Flow (who loads what, actual API behavior)

```mermaid
flowchart LR
    subgraph BACKEND_LOADS["Backend runtime loaders"]
        MS["backend/model_service.py<br/>load_models() @ startup"]
        PC["backend/api/calculator_router.py<br/>(module-level load)"]
        TR["backend/routes/transport_router.py"]
        IC["backend/predict_ionic_conductivity.py"]
        AD["prediction_models/*_adapter.py"]
        CF["cif_pipeline (relax.py / generate.py)"]
        CHGF["utils/chgnet_features.py<br/>+ calculations/m3gnet_properties.py"]
    end

    subgraph VIA["Loading mechanism"]
        MP["model_paths.resolve_pretrained_models_dir<br/>(search order: root pretrained_models →<br/>backend/pretrained_models →<br/>final_models/pretrained_models →<br/>IonCastBackup/...)"]
        JOB["joblib.load of .pkl"]
        MATGL["matgl.load_model(NAME)<br/>(cache-based, not final_models/)"]
        MACE["mace_mp(model='medium'|'small')<br/>(cache-based)"]
        CHGL["chgnet.model.CHGNet.load()"]
    end

    MS --> MP --> JOB
    PC --> MP
    TR --> MP
    IC --> MATGL
    AD --> MATGL & MACE & CHGL
    CF --> MACE
    CHGF --> CHGL

    subgraph SURS["Surrogates loaded"]
        S1["v5_base_models.pkl"]
        S2["v5_mlp_models.pkl"]
        S3["v5_meta_model.pkl"]
        S4["v5_quantile_transformer.pkl"]
        S5["v5_model2_A.pkl"]
        S6["v6_corrector_model.pkl"]
        S7["chgnet_logK / logG / Ef / thermal / bandgap .pkl"]
    end
    JOB --> SURS
```

---

## 3. Surrogate-Stack Inference Flow (v5 + v6, property prediction)

```mermaid
flowchart TD
    CIF["CIF input"] --> FE["Feature extraction"]
    subgraph FEOUT["OBLiEx-style feature set"]
        F1["MAGPIE / valence / ion features"]
        F2["Density + symmetry features"]
        F3["CrystalNN bonds + Li-site geometry"]
        F4["Wyckoff + percolation dims"]
        F5["optional MP DFT fields"]
    end
    FE --> FEOUT --> ALIGN["schema-safe align_features<br/>+ default-fraction diagnostics"]
    ALIGN --> QT["QuantileTransformer<br/>(v5_quantile_transformer.pkl)"]
    QT --> MODA["Model A (v5_model2_A.pkl)<br/>→ log10 prefactor"]
    QT --> BASE["base ensembles (v5_base_models.pkl)<br/>+ MLPs (v5_mlp_models.pkl)"]
    BASE --> META["stack meta-model (v5_meta_model.pkl)"]
    META --> CPF["log(σ+1) IonCast target"]
    CPF --> EA["Ea = expm1(log_pred)/10 →<br/>clip(0.005−5.0eV)"]
    EA --> ARR["Arrhenius σ=A·exp(−Ea/kT)"]
    ARR --> V6{"apply v6 corrector?"}
    V6 -- yes --> RESCMP["add residual (v6_corrector_model.pkl),<br/>anchored −3.585 @298.15 + T-shift"]
    RESCMP --> REL["reliability flags:<br/>PROVISIONAL if imputation fraction high"]
    V6 -- no --> REL
    REL --> HES["model_service: HES = cond*0.6 + Ea*0.4"]
    HES --> RESP["predict response<br/>(σ, Ea, logA, reliability)"]
```

Placeholder — actual code lives in `backend/model_service.py` and `predict_ionic_conductivity.py`; see backend artifact for endpoint wiring.

---

## 4. Bulk Property Surrogate Stack (BFSY + thermal + bandgap)

```mermaid
flowchart LR
    CVF["CHGNetVectorizer (utils/chgnet_features.py)<br/>21-dim feature vector per structure"] --> VK["chgnet_logK_model.pkl"]
    CVF --> VG["chgnet_logG_model.pkl"]
    CVF --> VF["chgnet_Ef_model.pkl"]
    CVF --> VT["chgnet_thermal_model.pkl"]
    CVF --> VBG["chgnet_bandgap_model.pkl"]

    VK --> K10["K = 10^log10(KVRH)"]
    VG --> G10["G = 10^log10(GVRH)"]
    K10 & G10 --> DER["E_young = 9KG/(3K+G)<br/>ν = (3K−2G)/(6K+2G)<br/>Pugh = K/G<br/>compressibility = 1/K"]
    VF --> EF["formation energy (or MP-style with<br/>reference potentials table)"]
    VT --> THM["thermal proxies"]
    VBG --> BG["band gap"]

    ALL["all outputs assembled in<br/>calculator_router.py responses"]
    DER & EF & THM & BG --> ALL
```

---

## 5. Feature Engineering Flow — `m3gnet_finite_displacement_features.py`

```mermaid
flowchart TD
    CLI["CLI args:<br/>--cif-dir (default Obliex_cifs/all_randomized_cifs)<br/>--materials-csv, --limit,<br/>--max-li-sites(6), --displacement-a(0.01 Å),<br/>--output-dir(ranking_results)"]

    CLI --> SHIM["dgl.graphbolt stub shim<br/>matgl.set_backend('DGL')<br/>load M3GNet-MP-2021.2.8-PES<br/>+ M3GNetCalculator"]

    SHIM --> LOOP{"next CIF?"}
    LOOP --> LOADS["pymatgen Structure.from_file"]
    LOADS --> DIS{"disordered?"}
    DIS -- yes --> SKIP
    DIS -- no --> ASE["AseAtomsAdaptor + attach M3GNetCalculator"]
    ASE --> BASE["base energy/forces computation"]
    BASE --> LISITES["pick ≤6 Li sites"]
    LISITES --> FD["for each Li × 3 axes:<br/>+displace 0.01 Å<br/>k = −ΔF/displacement (eV/Å²)"]
    FD --> CONV["force constants → THz frequencies<br/>(16.0218 eV/Å²→N/m, Li 6.94 amu)"]
    CONV --> FEATS["features:<br/>m3gnet_energy_ev,<br/>force_norm_mean/max,<br/>li_fd_k_mean/std/min/max,<br/>li_fd_k_positive_fraction,<br/>li_fd_freq_*, li_fd_log10_attempt_frequency_hz"]
    FEATS --> WRITE["CSV + JSON summary in ranking_results/<br/>m3gnet_li_finite_displacement_features_<ts>"]
    SKIP["skip (recorded error,<br/>NO imputation — strict non-proxy)"] --> LOOP
    WRITE --> LOOP
```

---

## 6. Unified Approach Flow — `unified_m3gnet_approach.py`

```mermaid
flowchart TD
    IN["load integrated_HES_DRF_ionic_20260503_075519.csv<br/>(321 Obliex materials)"]

    IN --> CHK{experimental σ<br/>available?}
    CHK -- yes --> EXP["use directly"]
    CHK -- no --> PRED["predict σ from 343 features<br/>(m3gnet embeddings + MAGPIE)<br/>via v5 surrogate stack at pretrained_models/<br/>(presence-check only, logic stated approach)"]

    EXP & PRED --> A["A = σ / exp(−Ea/(kB·T))<br/>Ea = hes_ea_ev @300K"]

    A --> SCORE["composite score =<br/>100 × (0.40·HES + 0.35·DRF<br/>+ 0.25·tanh(σ/0.001))"]
    SCORE --> RANK["rank + save ranking_results/<br/>unified_m3gnet_343features_ranking_<ts>.csv<br/>print Top-20"]

    subgraph EXPCT["expects on disk (config/paths references)"]
        E1["pretrained_models/v5_base_models.pkl"]
        E2["pretrained_models/v5_meta_model.pkl"]
        E3["pretrained_models/v5_quantile_transformer.pkl"]
        E4["datasets/v5_merged_training_dataset.csv"]
        E5["datasets/v5_300plus_features_cache.csv"]
    end
```

---

## 7. Training Flow — Surrogate Models

```mermaid
flowchart TD
    NB["surrogate_model_v5_fixed.ipynb<br/>(SSE Surrogate Model v5, diagnosis-driven)"]
    NB --> FIX1["target: log1p(10x)<br/>(replaces log(x+0.001))"]
    NB --> FIX2["add CatBoost + MLP<br/>(was all-tree ensemble)"]
    NB --> FIX3["QuantileTransformer / PowerTransformer<br/>scaling of ~277 MAGPIE features"]
    NB --> OPT["Optuna tuning → expect R² 0.88–0.93"]
    OPT --> DUMP["produces pretrained_models/v5_*.pkl stack"]

    BT["backend train_mechanical.py /<br/>train_electrical.py / train_thermal.py"]
    BT --> LGB["offline LGBM training on CHGNet 21-vec"]
    LGB --> OUTB["→ chgnet_logK / logG / bandgap /<br/>thermal .pkl into pretrained_models/<br/>(train_thermal uses thermal_features.npz)"]

    TR["backend models/ + prediction_models/ mlip adapters"]
    TR --> ADVALID["model_registry get_capabilities<br/>(m3gnet, chgnet, mace)"]

    FEATCHK["scripts/check_models.py<br/>probes core.device_manager +<br/>prediction_models.model_registry<br/>availability of all models"]
    FEATCHK --> ADVALID
```

---

## 8. Model Dependency Matrix (file → file)

```
download_all_models.py ──→ final_models/{chgnet,m3gnet,mace}_weights/
download_m3gnet.py      ──→ final_models/{m3gnet_weights, mace_weights}
download_m3gnet_hf.py   ──→ final_models/m3gnet_weights (HF route)
download_m3gnet_manual.py ─→ final_models/m3gnet_weights (raw GitHub)
redownload_m3gnet.py    ──→ final_models/m3gnet_weights (PyG route)

backend/model_paths.py ── resolves → pretrained_models/*.pkl
backend/model_service.py ──→ v5_* + v6_corrector .pkl (via model_paths)
backend/api/calculator_router.py ──→ v5_*; keys off chgnet_logK_model.pkl
backend/routes/transport_router.py ──→ v5_base_models.pkl (+v6)
backend/predict_ionic_conductivity.py ──→ v5_* + v6 ; also matgl
backend/prediction_models/*_adapter.py ──→ matgl / mace / chgnet caches
backend/train_*.py ──produce→ pretrained_models/chgnet_*.pkl
backend/cif_pipeline/relax.py ──→ MACE-MP-0 (cache)
backend/cif_pipeline/generate.py ──→ CrystaLLM ckpt (CRYSTALLM_CHECKPOINT_PATH)

configs/config.json ──→ "Synthetic Observer" config, FINAL_MODELS paths (STALE)
configs/paths.json   ──→ models_dir=final_models/pretrained_models (STALE — real path is root pretrained_models/)
configs/temp_required_cols.json ──→ 200–600K temp-dep schema
surrogate_model_v5_fixed.ipynb ──produce→ pretrained_models/v5_*.pkl
Obliex_cifs/all_randomized_cifs ──input→ m3gnet_finite_displacement_features.py
integrated_HES_DRF_*.csv ──input→ unified_m3gnet_approach.py
ranking_results/ ──output→ FD features CSV/JSON + unified ranking CSV

src/data/indianmatter/*
  38510.csv          ← periodic-table search + explore API
  chgnet_128_embeddings.csv ← similarity/embedding model
  m3gnet_embeddings.csv    ← similarity/embedding model
  pymatgen_matminer.csv    ← descriptor joins
```

---

## 9. Full End-to-End Execution View

```mermaid
flowchart LR
    subgraph TRAIN["Training (offline)"]
        T1["M3GNet/CHGNet/MACE download scripts"]
        T2["surrogate notebook + train_*.py<br/>(LGBM/CatBoost/MLP/Optuna)"]
    end
    subgraph ARTIFACTS["Artifacts"]
        A1["final_models/ → torch/matgl/MACE weights"]
        A2["pretrained_models/ → v5/v6 + chgnet_*.pkl"]
        A3["small datasets: 38510.csv + embeddings"]
    end
    subgraph RUNTIME["Runtime (FastAPI)"]
        R1["startup: load_models()"]
        R2["predict-properties<br/>(BFSY+thermal+bandgap+ionic)"]
        R3["ionic-conductivity<br/>(IonCast + v6 corrector)"]
        R4["CIF pipeline<br/>(CrystaLLM + MACE relax)"]
        R5["explore/search<br/>(MP/OQMD/AFLOW/JARVIS/local CSV)"]
    end
    subgraph RESULT["Results"]
        RS1["σ / Ea / logA + reliability flag"]
        RS2["K, G, E, ν, Pugh, Ef, thermal, bandgap"]
        RS3["final CIF files"]
        RS4["ranked CSVs in ranking_results/"]
    end
    TRAIN --> ARTIFACTS
    ARTIFACTS --> RUNTIME --> RESULT
```

---

## 10. Stale/Gap Notes

| # | Note |
|---|---|
| 1 | `configs/config.json` + `configs/paths.json` point to `final_models/pretrained_models/…` — STALE; real path is root `pretrained_models/` |
| 2 | `download_m3gnet_manual.py` writes `scaler.json` but matgl `.save()` route doesn't — on-disk dir missing that file |
| 3 | Old HF model name `M3GNet-MP-2021.2.8-PES` no longer available; HF fallback uses `materialyze/M3GNet-PES-MatPES-PBE-2025.2` |
| 4 | Model A importance relies heavily on simulation-only columns (e.g. `diffusion_coefficient_300K` ~82%) — honesty warning hardcoded |
| 5 | MACE weight is copied only in `download_m3gnet.py`; `download_all_models.py` relies on MACE's own cache instead |
| 6 | `final_models/alignn_weights` referenced by `download_alignn_local.py` but absent on disk (ALIGNN returns placeholder) |

> Placeholder note: `RESULT` — σ outputs flow from `predict_ionic_conductivity.py` through members described in backend artifact §6.
