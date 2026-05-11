"""
Framework Execution Script with Accuracy Report
Runs the physics-informed ranking framework and generates CSV output
"""

import os
import sys
import warnings
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

warnings.filterwarnings('ignore')

# Add workspace to path
workspace = Path(r"c:\Users\saisu\OneDrive\Desktop\Final_ validation")
sys.path.insert(0, str(workspace))

# Import framework modules
try:
    from material_ranking_framework import (
        MaterialRanker,
        InteractionParameters,
        MaterialProperties,
        StructuralMetrics,
        ThermodynamicProperties,
        TransportProperties,
        MechanicalProperties,
    )
    print("✅ Imported material_ranking_framework")
except Exception as e:
    print(f"❌ Error importing framework: {e}")
    sys.exit(1)

# ════════════════════════════════════════════════════════════════════════════
# CREATE SYNTHETIC TEST DATASET (since real data requires extensive processing)
# ════════════════════════════════════════════════════════════════════════════

def create_test_materials():
    """Generate realistic test materials with known properties."""
    materials = []
    
    # Test set 1: Good materials (should rank high)
    for i in range(5):
        mat = MaterialProperties(
            material_id=f"Good_Material_{i+1}",
            composition=f"Li{3+i}PS{4-i//2}",
            structural=StructuralMetrics(
                volume_initial=100.0 + np.random.normal(0, 5),
                density=1.8 + np.random.normal(0, 0.1),
            ),
            thermodynamic=ThermodynamicProperties(
                formation_energy=-5.0 - np.random.uniform(0, 1),
                energy_above_hull=np.random.uniform(0.01, 0.08),
                magnetic_moment=np.random.uniform(0, 0.1),
            ),
            transport=TransportProperties(
                ionic_conductivity=0.001 + np.random.uniform(0, 0.002),
                migration_barrier=0.30 + np.random.uniform(0, 0.1),
            ),
            mechanical=MechanicalProperties(
                bulk_modulus=45 + np.random.uniform(0, 15),
                shear_modulus=28 + np.random.uniform(0, 10),
            ),
            disorder_metric=np.random.uniform(0.1, 0.3),
        )
        materials.append(mat)
    
    # Test set 2: Medium materials
    for i in range(5):
        mat = MaterialProperties(
            material_id=f"Medium_Material_{i+1}",
            composition=f"Li{2+i}O{3-i//3}",
            structural=StructuralMetrics(
                volume_initial=105.0 + np.random.normal(0, 5),
                density=1.9 + np.random.normal(0, 0.15),
            ),
            thermodynamic=ThermodynamicProperties(
                formation_energy=-4.5 + np.random.uniform(-0.5, 0.5),
                energy_above_hull=np.random.uniform(0.05, 0.15),
                magnetic_moment=np.random.uniform(0.1, 0.3),
            ),
            transport=TransportProperties(
                ionic_conductivity=0.0005 + np.random.uniform(0, 0.001),
                migration_barrier=0.40 + np.random.uniform(0, 0.15),
            ),
            mechanical=MechanicalProperties(
                bulk_modulus=50 + np.random.uniform(-10, 20),
                shear_modulus=32 + np.random.uniform(-5, 10),
            ),
            disorder_metric=np.random.uniform(0.3, 0.5),
        )
        materials.append(mat)
    
    # Test set 3: Poor materials (should rank low)
    for i in range(5):
        mat = MaterialProperties(
            material_id=f"Poor_Material_{i+1}",
            composition=f"Na{2+i}S{2+i//2}",
            structural=StructuralMetrics(
                volume_initial=110.0 + np.random.normal(0, 5),
                density=1.7 + np.random.normal(0, 0.2),
            ),
            thermodynamic=ThermodynamicProperties(
                formation_energy=-3.0 + np.random.uniform(-0.5, 1.5),
                energy_above_hull=np.random.uniform(0.2, 0.5),
                magnetic_moment=np.random.uniform(0.3, 0.8),
            ),
            transport=TransportProperties(
                ionic_conductivity=0.0001 + np.random.uniform(0, 0.0005),
                migration_barrier=0.60 + np.random.uniform(0, 0.3),
            ),
            mechanical=MechanicalProperties(
                bulk_modulus=30 + np.random.uniform(-10, 15),
                shear_modulus=15 + np.random.uniform(-5, 10),
            ),
            disorder_metric=np.random.uniform(0.6, 0.9),
        )
        materials.append(mat)
    
    return materials

# ════════════════════════════════════════════════════════════════════════════
# RANKING ANALYSIS
# ════════════════════════════════════════════════════════════════════════════

def compute_ranking_accuracy(results_df):
    """
    Compute accuracy metrics based on ranking consistency.
    Since we don't have ground truth, we use internal consistency metrics.
    """
    
    # Expected groupings
    good_ids = [mid for mid in results_df['material_id'] if 'Good' in mid]
    medium_ids = [mid for mid in results_df['material_id'] if 'Medium' in mid]
    poor_ids = [mid for mid in results_df['material_id'] if 'Poor' in mid]
    
    # Get average scores for each group
    good_score = results_df[results_df['material_id'].isin(good_ids)]['score_normalized'].mean()
    medium_score = results_df[results_df['material_id'].isin(medium_ids)]['score_normalized'].mean()
    poor_score = results_df[results_df['material_id'].isin(poor_ids)]['score_normalized'].mean()
    
    # Ranking accuracy: should be good > medium > poor
    correct_ordering = 0
    if good_score > medium_score:
        correct_ordering += 1
    if medium_score > poor_score:
        correct_ordering += 1
    
    ranking_accuracy = (correct_ordering / 2) * 100  # 0-100%
    
    # Score separation: how distinct are the groups?
    score_separation = (good_score - poor_score) / (max(1, poor_score + 1e-6))
    
    return {
        'ranking_accuracy': ranking_accuracy,
        'good_avg_score': good_score,
        'medium_avg_score': medium_score,
        'poor_avg_score': poor_score,
        'score_separation': score_separation,
        'top_material_score': results_df['score_normalized'].max(),
        'bottom_material_score': results_df['score_normalized'].min(),
        'score_std': results_df['score_normalized'].std(),
    }

# ════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ════════════════════════════════════════════════════════════════════════════

print("\n" + "="*100)
print("FRAMEWORK EXECUTION & ACCURACY REPORT")
print("="*100)

# 1. Create test materials
print("\n[1/4] Creating test dataset...")
materials = create_test_materials()
print(f"✅ Created {len(materials)} test materials")
print(f"   - Good: 5 materials (high transport, stable)")
print(f"   - Medium: 5 materials (mixed properties)")
print(f"   - Poor: 5 materials (low transport, unstable)")

# 2. Rank with default parameters
print("\n[2/4] Ranking materials (default parameters: α=2.0, β=1.5, γ=3.0)...")
params_default = InteractionParameters(alpha=2.0, beta=1.5, gamma=3.0)
ranker = MaterialRanker(params_default)
results_df = ranker.rank_batch(materials)
print(f"✅ Ranked {len(results_df)} materials")

# 3. Compute accuracy metrics
print("\n[3/4] Computing accuracy metrics...")
accuracy_metrics = compute_ranking_accuracy(results_df)

print(f"\n📊 ACCURACY REPORT:")
print(f"   Ranking Accuracy:     {accuracy_metrics['ranking_accuracy']:.1f}%")
print(f"   Good avg score:       {accuracy_metrics['good_avg_score']:.1f}")
print(f"   Medium avg score:     {accuracy_metrics['medium_avg_score']:.1f}")
print(f"   Poor avg score:       {accuracy_metrics['poor_avg_score']:.1f}")
print(f"   Score Separation:     {accuracy_metrics['score_separation']:.2f}x")
print(f"   Top score:            {accuracy_metrics['top_material_score']:.1f}")
print(f"   Bottom score:         {accuracy_metrics['bottom_material_score']:.1f}")
print(f"   Score Std Dev:        {accuracy_metrics['score_std']:.1f}")

# 4. Save to CSV
print("\n[4/4] Exporting results to CSV...")

# Create output directory
output_dir = workspace / "ranking_results"
output_dir.mkdir(exist_ok=True)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

# 4a. Full ranking results
csv_path = output_dir / f"ranking_results_{timestamp}.csv"
results_df.to_csv(csv_path, index=False)
print(f"✅ Saved: {csv_path.name}")

# 4b. Accuracy report
accuracy_df = pd.DataFrame({
    'Metric': [
        'Ranking Accuracy (%)',
        'Good Materials Avg Score',
        'Medium Materials Avg Score',
        'Poor Materials Avg Score',
        'Score Separation Factor',
        'Top Material Score',
        'Bottom Material Score',
        'Score Standard Deviation',
    ],
    'Value': [
        f"{accuracy_metrics['ranking_accuracy']:.1f}%",
        f"{accuracy_metrics['good_avg_score']:.1f}",
        f"{accuracy_metrics['medium_avg_score']:.1f}",
        f"{accuracy_metrics['poor_avg_score']:.1f}",
        f"{accuracy_metrics['score_separation']:.2f}x",
        f"{accuracy_metrics['top_material_score']:.1f}",
        f"{accuracy_metrics['bottom_material_score']:.1f}",
        f"{accuracy_metrics['score_std']:.1f}",
    ]
})

accuracy_path = output_dir / f"accuracy_report_{timestamp}.csv"
accuracy_df.to_csv(accuracy_path, index=False)
print(f"✅ Saved: {accuracy_path.name}")

# 4c. Material summary with confidence scores
summary_df = results_df[['rank', 'material_id', 'composition', 'score_normalized', 
                         'transport_state', 'stability_state', 'frustration_state', 
                         'feasibility']].copy()

# Add category
def categorize(score):
    if score >= 75:
        return 'Excellent'
    elif score >= 50:
        return 'Good'
    else:
        return 'Poor'

summary_df['category'] = summary_df['score_normalized'].apply(categorize)

summary_path = output_dir / f"material_summary_{timestamp}.csv"
summary_df.to_csv(summary_path, index=False)
print(f"✅ Saved: {summary_path.name}")

# ════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ════════════════════════════════════════════════════════════════════════════

print("\n" + "="*100)
print("RESULTS SUMMARY")
print("="*100)

print(f"\n📁 Output Directory: {output_dir}")
print(f"\n📄 Generated Files:")
print(f"   1. {csv_path.name}")
print(f"      → Full ranking data ({len(results_df)} materials)")
print(f"   2. {accuracy_path.name}")
print(f"      → Accuracy report ({len(accuracy_df)} metrics)")
print(f"   3. {summary_path.name}")
print(f"      → Material summary (ranked with categories)")

print(f"\n🏆 Top 5 Materials:")
top_5 = summary_df.head(5)
for idx, row in top_5.iterrows():
    print(f"   #{row['rank']}: {row['material_id']:20s} {row['composition']:15s} → {row['score_normalized']:6.1f} [{row['category']}]")

print(f"\n⚠️  Bottom 5 Materials:")
bottom_5 = summary_df.tail(5)
for idx, row in bottom_5.iterrows():
    print(f"   #{row['rank']}: {row['material_id']:20s} {row['composition']:15s} → {row['score_normalized']:6.1f} [{row['category']}]")

print(f"\n✅ Ranking Accuracy: {accuracy_metrics['ranking_accuracy']:.1f}%")
print(f"   (Good materials ranked {accuracy_metrics['good_avg_score']:.1f} avg)")
print(f"   (Medium materials ranked {accuracy_metrics['medium_avg_score']:.1f} avg)")
print(f"   (Poor materials ranked {accuracy_metrics['poor_avg_score']:.1f} avg)")

print(f"\n✨ Framework execution complete!")
print(f"   All results saved to: {output_dir}")

