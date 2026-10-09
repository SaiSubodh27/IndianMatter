# Compound -> CIF Pipeline

## Files

| File | Responsibility |
|---|---|
| `models.py` | Shared dataclasses: `CompoundQuery`, `DopingSpec`, `SearchMatch`, `GenerationDiagnostics`, `PipelineResult` |
| `user_interaction.py` | Swappable "ask the user a clarifying question" hook (CLI stub + web-form stub) |
| `classify.py` | Doped vs. undoped classification, multi-level with user fallback; builds `DopingSpec` |
| `matching.py` | Formula normalization rules (doped vs. undoped) + polymorph disambiguation, shared by both search stages |
| `search_external.py` | Stage 1 — Materials Project / OQMD / JARVIS / COD search |
| `search_internal.py` | Stage 2 — your internal database search (same matching rules as Stage 1) |
| `filter_rules.py` | Compound-type classification (oxide/halide/sulfide/.../intermetallic) + type-aware bond length, symmetry, charge-balance checks |
| `generate.py` | Stage 4a — CrystaLLM generation as a **feedback loop**: generate → filter → relax → diagnose failures → adjust params → retry |
| `relax.py` | MACE-MP-0 relaxation wrapper with convergence diagnostics |
| `doping.py` | Stage 4b — parent structure resolution + explicit site-level doping transformation |
| `orchestrator.py` | Ties every stage together into `run_pipeline()` |
| `main.py` | Example usage |

### Doped-CIF decision layer (new)

| File | Responsibility |
|---|---|
| `family.py` | `classify_family()` — base family + site roles (A/B/anion/mobile/framework) from a formula or Structure |
| `regime.py` | `decide_regime()`, `inversion_to_sublattices()`, `detect_jahn_teller()` — normal/inverse/distorted/mixed, inversion λ, scenario brackets |
| `fractions.py` | `resolve_neat_fraction()` — target fraction → integer supercell, reporting `x_target`/`x_real`/error |
| `representation.py` | `choose_technique()`, `build_representations()` (VCA/ordered/SQS/enumerate/ensemble/distorted/cluster-expansion), `rank_representations()` |
| `dopant_pipeline.py` | `DopantRequest` → `generate_doped_cif()` → `DopedCifResult` (the public entry point) |
| `supercell.py` | Hermite-normal-form supercell search maximising the smallest face width |
| `symmetry_paths.py` | Jahn-Teller tetragonal (I4_1/amd-like) strain for Cu²⁺/Mn³⁺ spinels |
| `ordering.py` | Cluster expansion + Monte-Carlo ground-state ordering (pair-Coulomb or a real MLIP `energy_fn`) |
| `mlip.py` | MACE-MP-0 single-point energy functions (`make_mace_energy_fn`, `try_make_energy_fn`) used by the cluster expansion and candidate ranking |
| `site_analysis.py` | Measure where a dopant actually sits: A/B distribution, inversion λ, dopant fraction per f.u., XRD peaks, XRD comparison |
| `geometry.py` | Composition-derived lattice `a` and oxygen parameter `u` (Vegard over end-members) |

### Chemistry knowledge base & builders

| File | Responsibility |
|---|---|
| `site_preference.py` | Shannon ionic radii (`SHANNON_RADII`), CFSE tables, Goldschmidt tolerance factor, Vegard lattice estimator, and the `SPINEL_SITE_TABLE` / `PEROVSKITE_SITE_TABLE` site-preference knowledge used by `recommend_site()`, `recommend_spinel_site()`, `recommend_perovskite_site()` |
| `intent.py` | Spinel family module: formula → A/B sublattice spec, normal vs. inverse vs. mixed, weak-preference questions |
| `spinel_build.py` | `build_spinel()` (vca/ordered), `verify()`, `classify_spinel_sites()`, `_build_parent_spinel()` |
| `spinel_cif.py` | VCA CIF writer + readback check |
| `general_doping.py` | Universal 11-stage doping engine (A2–A11) for non-spinel parents: Wyckoff orbit analysis, site ranking, charge bookkeeping, supercell search, dispersed placement, verification |
| `parents.py` | Library of known parent structures (perovskites, spinels, garnets, fluorites, rocksalts) |
| `validation.py` | Standalone structural validation helpers |
| `provenance.py` | Provenance record construction shared by the pipelines |
| `reference_fetch.py` | Fetch reference structures for comparison |
| `mesp_check.py` | MESP (molecular electrostatic potential) plausibility check |
| `symmetry_matrix.py` | Optimal supercell transformation matrices (minimum image distance ≥ 10 Å) |
| `batch_processor.py` | Benchmark batch runner over a list of materials |
| `formatting.py` | Display-only number formatting (`round_display`, `format_percent`) — the project's 2-decimal reporting rule |
| `config.py` | Single place that reads `.env` (MP key, MACE model/device, CrystaLLM checkpoint) |
| `main.py` | CLI entry point — `python -m cif_pipeline.main Fe2O3` |
| `__init__.py` | Public API re-exports |

## Reporting rule: fractions are shown to 2 decimals

`formatting.py` centralises this. Any fraction or occupancy reported to a user
(API response, HTML report) is rounded to **two decimals** — e.g. `0.025` is
displayed as `0.03`. The unrounded value is **never discarded**: API responses
carry `*_exact` fields alongside the rounded ones.

Rounding is deliberately confined to the reporting layer. Internally the full
precision is kept, because rounding a value that drives charge bookkeeping or
supercell construction would silently change the chemistry — `0.025` and `0.03`
describe different numbers of atoms in a cell.

### What is deliberately NOT rounded to 2 decimals

Auditing every rounding site turned up three categories. Only the third was
changed; the first two are correct as they stand and must not be "tidied":

| Category | Examples | Why it stays |
|---|---|---|
| **CIF file precision** | `spinel_cif.py` writes cell parameters at `.6f`, coordinates at `.5f`, volume at `.4f` | These are IUCr format requirements. Truncating a lattice parameter to 2 decimals would visibly distort the structure. |
| **Physical quantities** | Energies and forces at `.3f`/`.4f` (`relax.py`, `generate.py`, `orchestrator.py`), charge sums at `.3f` (`dopant_pipeline.py`), ionic radii at `.3f` (`site_preference.py`) | A 0.001 eV energy difference or a 0.01 Å radius difference is scientifically meaningful. 2 decimals would hide real signal. |
| **Tolerance diagnostics** | Fraction error and occupancy sums at `.4f`/`.5f` (`fractions.py`, `filter_rules.py`) | These exist to show *how far off* a value is from a tolerance. Rounding the error would hide the very thing being reported. |
| **Site populations** → fixed | `intent.py` Li/Mn/cation totals, `site_preference.py` charge breakdown | These are fractions/occupancies, exactly the kind of quantity the 2-decimal rule targets. Now use `format_amount()`. |

### Half-up, not banker's rounding

`round_display()` uses `Decimal` with `ROUND_HALF_UP`, **not** Python's built-in
`round()`. Python rounds ties to the nearest *even* digit, so `round(0.015, 2)`
returns `0.01` and `round(0.125, 2)` returns `0.12`. Reporting a 1.5% dopant as
1.2% understates it, so ties round away from zero instead.

Going through `Decimal(str(x))` rather than `Decimal(x)` also avoids binary-float
artefacts (`Decimal(0.145)` is exactly `0.14499999…`; `Decimal(str(0.145))` is
the `0.145` the user actually wrote).


## Key design decisions (per your questions)

**Normalization:** undoped formulas are reduced to a canonical form before
searching (`Fe2O3` == `Fe4O6`). Doped formulas are **never** reduced — the
fractional site occupancy (`La0.7Sr0.3`) is the chemically meaningful part of
the query, so doped-formula matching instead compares (host species, dopant
species, dopant fraction) with a tolerance, in `matching.doped_formulas_match`.
Every normalization decision is captured in a `NormalizationTrace` object
(`models.py`) attached to `PipelineResult.normalization_trace` — this is what
the UI should render so the user can see exactly what search key was used and
why, including the formula-unit multiplicity relationship for undoped
compounds (`FormulaMultiplicityInfo` — e.g. "you entered Fe4O6, that's 2x the
reduced formula Fe2O3").

**Polymorphs:** all four external sources (MP, OQMD, JARVIS, COD) plus the
internal DB return **every** structural hit for a formula, never just the
first. When no space group is specified and multiple distinct polymorphs
exist, the policy is: **surface all of them, never silently narrow to
"some"** — `matching.disambiguate_polymorphs` returns the complete candidate
list alongside whatever was chosen, and `PipelineResult.candidate_matches`
carries that full list to the UI even when a pick was made, so a picker can
always be rendered with the true total count (with a `MAX_POLYMORPHS_SHOWN_AT_ONCE`
cap purely for single-screen readability — the underlying list is never
truncated). A requested space group is honored strictly: if none of the hits
match it, that's surfaced as a mismatch requiring a decision, not silently
substituted.

**Provenance for the UI:** every `SearchMatch` now carries a `source_url`
(direct link to the record) and `is_theoretical` flag (COD marks some entries
as theoretical/predicted rather than measured) — `PipelineResult.matched_record`
tells the UI exactly which record was used and where it came from.

**Classification is multi-level** (`classify.py`): explicit UI hint → explicit
"X doped with Y" phrasing → formula-shape heuristic (co-occupying fractional
sites) → if still ambiguous, ask the user, with a "not sure" default to undoped.

**Filtering is compound-type-aware AND split by pipeline stage**
(`filter_rules.py`): `filter_candidates()` is used only for raw, freshly-generated
undoped candidates in Stage 4a (batch: bond-length + symmetry + charge-balance +
duplicate checks). `validate_doped_structure()` is a deliberately separate,
smaller function for Stage 4b: no deduplication (there's one structure, not a
batch), no full symmetry re-check (the parent was already validated; a
disordered doped site makes a full space-group re-check a different and less
meaningful question), a new occupancy-sum check (host_fraction + dopant_fraction
should sum to ~1.0), and bond-length checking scoped to just the doped site's
neighbors, since that's the only part of the structure that changed.

**Generation is a real loop, not one shot** (`generate.py`): each iteration's
filter + relax failures are inspected, and the dominant failure mode (bad
bonds vs. duplicates vs. non-convergence) drives a parameter adjustment
(mainly temperature right now — extend `_decide_next_adjustment` as you learn
more about your CrystaLLM build's behavior) before the next batch of samples.

**Doping requires an explicit `DopingSpec`** (`doping.py`): host formula, host
site species, dopant species, dopant fraction, and (once the parent structure
is known) which symmetry-distinct site. Nothing here is inferred from a bare
formula string — `classify.py` asks the user for anything missing, and
`doping.apply_doping` asks again if the parent turns out to have multiple
candidate sites. `apply_doping_with_validation` then runs the result through
`validate_doped_structure` before relaxation.

## Databases queried in Stage 1

Materials Project, OQMD, JARVIS, and **COD (Crystallography Open Database)**.
COD's officially documented REST endpoint only supports `id`/`smarts`/`text`/`format`
params (no direct `formula=` param) — see the detailed docstring in
`search_external.py::_query_cod` for the verified two-step approach (metadata
text search, then mandatory formula verification against the actual fetched
CIF) plus a link to COD's full-dump option for heavier use.

## Implementation status

All of the previously-listed TODOs are now implemented and covered by tests:

- `search_external.py` — live `mp-api`, OQMD, JARVIS and COD queries are wired
  and exercised by the test suite and by `scripts/run_pipeline_audit.py`.
- `generate.py` — the CrystaLLM generate → filter → relax → adjust feedback loop
  is implemented. It is skipped only when `CRYSTALLM_CHECKPOINT_PATH` is unset or
  the checkpoint file is absent, which is reported rather than hidden.
- `relax.py` — MACE-MP-0 + ASE relaxation is wired, with the calculator loaded
  lazily and cached.
- `search_internal.py` — the internal database hook is in place and shares its
  matching rules with the external search.
- `user_interaction.py` — the web form handler is wired through `webapp.py`
  (`_web_ask_handler`), which returns `None` rather than guessing so ambiguity is
  surfaced to the caller instead of being silently resolved.

## Known limitations

- The doped pipeline currently covers the **spinel family**. Other families return
  `needs_input` from `generate_cif_from_formula` and require an explicit parent
  `Structure`, which is then handled by `general_doping.py`.
- Mixed-valence `M3O4` parents (magnetite and relatives) use a *nominal* A=M/B=M2
  model. This is reported explicitly in the result warnings — the mixed valence
  is real, the model is an approximation.
- Ordered supercells are capped at `max_atoms` (default 560). When the minimum
  image distance target cannot be met inside that budget, the pipeline emits a
  warning rather than silently returning an undersized cell.

## Notable design decisions

**Host-element inference in `spinel_build.py`.** A caller may specify only part of
a sublattice (e.g. `{"A": {"Zn": 0.05}, "B": {"Ni": 0.95}}`). The engine decides
what fills the remainder via `_resolve_host_element()`, in priority order:
explicit `spec["host_element"]` → Fe already present → the single unplaced cation
from `host_formula` → charge-balance inference (whichever candidate lands the
total cation charge closest to the spinel target of +8.0/f.u.). This handles
ferrites (Fe fills the gap) and aluminates/chromites (Mg, Al, Zn…) without
hard-coding any single compound.

**Cu is deliberately a weak B-site preference** (`site_preference.py`). CuFe₂O₄
inversion spans roughly 0.70–1.00 depending on quench/anneal history, so the
engine asks the user rather than silently assigning a site. See
`tests/test_site_preference.py::test_cu_strong_B`, which asserts the *weak*
behaviour on purpose.


## Install (once you wire the TODOs)

```bash
pip install pymatgen mace-torch mp-api ase
# + jarvis-tools if you use it
# + CrystaLLM per its own repo instructions
```

## Run the example

```bash
python -m cif_pipeline.main
```
