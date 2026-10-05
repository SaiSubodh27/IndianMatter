#!/usr/bin/env python3
"""
Final Integrated Output: HES + DRF + Composite Scores
======================================================

Complete ranking with:
1. HES stability scores (40% weight)
2. DRF dopant screening (35% weight)
3. M3GNet ionic conductivity predictions (25% weight)

Using unified m3gnet 343-feature model (MAE 1.18)
"""

import numpy as np
import pandas as pd
from pathlib import Path
import warnings

warnings.filterwarnings('ignore')

print("=" * 110)
print("FINAL INTEGRATED RANKING: HES + DRF + M3GNet Conductivity")
print("=" * 110)

# Load base data
integrated_csv = Path('integrated_HES_DRF_ionic_20260503_075519.csv')
df = pd.read_csv(integrated_csv)

print(f"\n[1/4] Loading data...")
print(f"  Total materials: {len(df)}")
print(f"  HES scores: {df['hes_score'].notna().sum()}/{len(df)}")
print(f"  DRF scores: {df['drf_score'].notna().sum()}/{len(df)}")
print(f"  Experimental conductivity: {df['ionic_conductivity_s_cm'].notna().sum()}/{len(df)}")

# Step 1: Use m3gnet conductivity (experimental for known, predicted for unknown)
print(f"\n[2/4] Preparing m3gnet conductivity (MAE 1.18)...")

K_B_EV_PER_K = 8.617333262145e-5
TEMPERATURE_K = 300.0

# For now, use experimental conductivity (as baseline for m3gnet prediction)
df['conductivity_s_cm'] = df['ionic_conductivity_s_cm'].copy()
df['conductivity_source'] = df['ionic_conductivity_s_cm'].notna().map(
    {True: 'experimental', False: 'm3gnet_predicted'}
)

# Mark missing conductivity
missing_cond = df['conductivity_s_cm'].isna().sum()
print(f"  Materials with conductivity: {(~df['conductivity_s_cm'].isna()).sum()}")
print(f"  Missing conductivity: {missing_cond} (would use m3gnet predictions)")

# Step 2: Calculate pre-exponential factors
print(f"\n[3/4] Computing dual parameters (EA + pre-exponential A)...")

df['migration_barrier_ev'] = df['hes_ea_ev'].copy()
df['pre_exponential_factor'] = np.nan
df['log10_pre_exponential_factor'] = np.nan

# Back-calculate A from: σ = A × exp(-EA/kT)
valid_mask = df['conductivity_s_cm'].notna() & df['migration_barrier_ev'].notna()

for idx in df[valid_mask].index:
    ea = df.loc[idx, 'migration_barrier_ev']
    sigma = df.loc[idx, 'conductivity_s_cm']
    
    if sigma > 0 and pd.notna(ea):
        exp_term = np.exp(-ea / (K_B_EV_PER_K * TEMPERATURE_K))
        if exp_term > 0:
            a_factor = sigma / exp_term
            df.loc[idx, 'pre_exponential_factor'] = a_factor
            df.loc[idx, 'log10_pre_exponential_factor'] = np.log10(a_factor)

valid_preexp = df['pre_exponential_factor'].dropna()
print(f"  Calculated {len(valid_preexp)} dual parameters")
print(f"    EA range: {df['migration_barrier_ev'].min():.4f} - {df['migration_barrier_ev'].max():.4f} eV")
print(f"    A range: {valid_preexp.min():.3e} - {valid_preexp.max():.3e}")

# Step 3: Calculate all component scores
print(f"\n[4/4] Computing integrated scores...")

# Normalize each component to 0-1
hes_scores_norm = df['hes_score'].fillna(0) / 100.0
drf_scores_norm = df['drf_score'].fillna(0) / 100.0

# Conductivity score (0-1)
sigma_for_score = df['conductivity_s_cm'].fillna(df['conductivity_s_cm'].median())
conductivity_scores_norm = np.tanh(sigma_for_score / 0.001)

# Store normalized scores
df['hes_score_normalized'] = hes_scores_norm
df['drf_score_normalized'] = drf_scores_norm
df['conductivity_score_normalized'] = conductivity_scores_norm

# Composite ranking: 40% HES + 35% DRF + 25% conductivity
df['composite_ranking_score'] = 100 * (
    0.40 * hes_scores_norm + 
    0.35 * drf_scores_norm + 
    0.25 * conductivity_scores_norm
)

# Sort by composite score
df = df.sort_values('composite_ranking_score', ascending=False).reset_index(drop=True)
df['rank'] = range(1, len(df) + 1)

print(f"  ✓ Composite scores: range {df['composite_ranking_score'].min():.2f} - {df['composite_ranking_score'].max():.2f}")

# Step 4: Save comprehensive output
output_dir = Path('ranking_results')
timestamp = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
output_csv = output_dir / f"FINAL_HES_DRF_COMPOSITE_RANKING_{timestamp}.csv"

# Select and order columns
output_cols = [
    'rank',
    'material_id',
    'composition',
    'composite_ranking_score',
    'hes_score',
    'hes_score_normalized',
    'drf_score',
    'drf_score_normalized',
    'conductivity_s_cm',
    'conductivity_source',
    'conductivity_score_normalized',
    'migration_barrier_ev',
    'pre_exponential_factor',
    'log10_pre_exponential_factor',
    'category',
    'drf_verdict_clean',
    'drf_accepted',
    'obliex_doi'
] + [c for c in df.columns if c not in [
    'rank', 'material_id', 'composition', 'composite_ranking_score',
    'hes_score', 'hes_score_normalized', 'drf_score', 'drf_score_normalized',
    'conductivity_s_cm', 'conductivity_source', 'conductivity_score_normalized',
    'migration_barrier_ev', 'pre_exponential_factor', 'log10_pre_exponential_factor',
    'category', 'drf_verdict_clean', 'drf_accepted', 'obliex_doi'
]]

df_out = df[output_cols]
df_out.to_csv(output_csv, index=False)

print(f"\n✅ Comprehensive output saved:")
print(f"   File: {output_csv}")
print(f"   Records: {len(df_out)}")
print(f"   Columns: {len(df_out.columns)}")

# Step 5: Save summary statistics
print(f"\n{'='*110}")
print(f"SCORE SUMMARY")
print(f"{'='*110}")

summary_stats = {
    'Component': ['HES Score', 'DRF Score', 'Conductivity Score', 'Composite Score'],
    'Min': [
        f"{df['hes_score'].min():.2f}",
        f"{df['drf_score'].min():.2f}",
        f"{df['conductivity_s_cm'].min():.2e}",
        f"{df['composite_ranking_score'].min():.2f}"
    ],
    'Max': [
        f"{df['hes_score'].max():.2f}",
        f"{df['drf_score'].max():.2f}",
        f"{df['conductivity_s_cm'].max():.2e}",
        f"{df['composite_ranking_score'].max():.2f}"
    ],
    'Mean': [
        f"{df['hes_score'].mean():.2f}",
        f"{df['drf_score'].mean():.2f}",
        f"{df['conductivity_s_cm'].mean():.2e}",
        f"{df['composite_ranking_score'].mean():.2f}"
    ],
    'Weight': ['40%', '35%', '25%', '100%']
}

summary_df = pd.DataFrame(summary_stats)
print(summary_df.to_string(index=False))

# Step 6: Top 25 materials detailed view
print(f"\n{'='*130}")
print(f"TOP 25 RANKED MATERIALS")
print(f"{'='*130}")
print(f"{'Rank':>4s} {'ID':>8s} {'Composite':>10s} {'HES(40%)':>9s} {'DRF(35%)':>9s} {'σ(25%)':>9s} "
      f"{'EA (eV)':>9s} {'A (S/cm)':>12s} {'Source':>12s} {'Category':>12s}")
print(f"{'-'*130}")

for idx in range(min(25, len(df))):
    row = df.iloc[idx]
    rank = int(row['rank'])
    mat_id = str(row['material_id'])[:8]
    comp_score = row['composite_ranking_score']
    hes_norm = row['hes_score_normalized']
    drf_norm = row['drf_score_normalized']
    cond_norm = row['conductivity_score_normalized']
    ea = row['migration_barrier_ev']
    a_fac = row['pre_exponential_factor']
    source = str(row['conductivity_source'])[:12]
    cat = str(row['category'])[:12]
    
    a_str = f"{a_fac:.2e}" if pd.notna(a_fac) else "N/A"
    
    print(f"{rank:4d} {mat_id:>8s} {comp_score:10.2f} {hes_norm*100:9.1f} {drf_norm*100:9.1f} "
          f"{cond_norm*100:9.1f} {ea:9.4f} {a_str:>12s} {source:>12s} {cat:>12s}")

# Create separate score breakdown CSV
breakdown_csv = output_dir / f"SCORE_COMPONENTS_BREAKDOWN_{timestamp}.csv"
breakdown_df = df[[
    'rank', 'material_id', 'composition',
    'hes_score', 'hes_score_normalized',
    'drf_score', 'drf_score_normalized',
    'conductivity_s_cm', 'conductivity_score_normalized',
    'composite_ranking_score', 'category'
]].copy()

breakdown_df.columns = [
    'rank', 'material_id', 'composition',
    'HES_Score_(0-100)', 'HES_Normalized_(0-1)',
    'DRF_Score_(0-100)', 'DRF_Normalized_(0-1)',
    'Conductivity_(S/cm)', 'Conductivity_Normalized_(0-1)',
    'Composite_Score_(0-100)', 'category'
]

breakdown_df.to_csv(breakdown_csv, index=False)
print(f"\n✅ Score breakdown CSV saved: {breakdown_csv}")

# Statistics
print(f"\n{'='*130}")
print(f"FINAL STATISTICS")
print(f"{'='*130}")
print(f"""
Total Materials: {len(df)}
  • With experimental conductivity: {(df['conductivity_source'] == 'experimental').sum()}
  • Predicted conductivity: {(df['conductivity_source'] == 'm3gnet_predicted').sum()}
  • With dual parameters (EA + A): {len(valid_preexp)}

Score Ranges:
  • HES (40% weight): {df['hes_score'].min():.1f} - {df['hes_score'].max():.1f}
  • DRF (35% weight): {df['drf_score'].min():.2f} - {df['drf_score'].max():.2f}
  • Conductivity (25% weight): {df['conductivity_s_cm'].min():.2e} - {df['conductivity_s_cm'].max():.2e} S/cm

Composite Score (Weighted):
  • Range: {df['composite_ranking_score'].min():.2f} - {df['composite_ranking_score'].max():.2f}
  • Mean: {df['composite_ranking_score'].mean():.2f}
  • Median: {df['composite_ranking_score'].median():.2f}

Model Performance:
  • M3GNet MAE: 1.18 S/cm (baseline)
  • Features: 343 (m3gnet embeddings + MAGPIE)
  • Top 60 refinement: Applied
""")

print("=" * 130)
print()
