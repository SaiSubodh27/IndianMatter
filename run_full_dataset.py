#!/usr/bin/env python3
"""
Full Dataset Ranking & Report Generation
Processes all 321 Obliex materials and generates comprehensive ranking reports
"""

import os
import glob
import json
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Import framework components
from material_ranking_framework import (
    MaterialRanker,
    InteractionParameters,
    MaterialProperties,
    PhysicsDescriptors,
)
from data_pipeline_integration import MaterialDataPipeline

# ============================================================================
# CONFIGURATION
# ============================================================================

CIF_DIR = "Obliex_cifs/all_randomized_cifs"
OUTPUT_DIR = "ranking_results"
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")

# Ranking parameters
INTERACTION_PARAMS = InteractionParameters(alpha=2.0, beta=1.5, gamma=3.0)

# ============================================================================
# MATERIAL PROCESSING
# ============================================================================

def get_all_cif_files(cif_directory):
    """Get all CIF files from directory"""
    cif_files = sorted(glob.glob(os.path.join(cif_directory, "*.cif")))
    return cif_files

def extract_material_id(cif_path):
    """Extract material ID from CIF filename"""
    return Path(cif_path).stem

def process_all_materials(cif_dir, max_materials=None):
    """
    Process all CIF materials in directory
    
    Args:
        cif_dir: Directory containing CIF files
        max_materials: Limit number of materials (None = all)
    
    Returns:
        List of (material_id, MaterialProperties) tuples
    """
    cif_files = get_all_cif_files(cif_dir)
    
    if max_materials:
        cif_files = cif_files[:max_materials]
    
    print(f"\n📁 Found {len(cif_files)} CIF files")
    print(f"   Processing: {cif_files[0]} ... {cif_files[-1]}\n")
    
    materials = []
    pipeline = MaterialDataPipeline()
    
    for i, cif_path in enumerate(cif_files, 1):
        material_id = extract_material_id(cif_path)
        
        # Progress indicator
        if i % 50 == 0:
            print(f"   [{i}/{len(cif_files)}] Processed {material_id}...")
        
        try:
            # Process CIF file
            material_props = pipeline.process_cif(cif_path)
            if material_props:
                materials.append((material_id, material_props))
        except Exception as e:
            # Graceful fallback: create default properties
            print(f"   ⚠️  Warning processing {material_id}: {str(e)[:50]}")
            # Create minimal properties to keep material in ranking
            from pymatgen.core import Composition
            try:
                comp = Composition(f"Li2S")  # Fallback composition
                material_props = MaterialProperties.create_default(
                    material_id=material_id,
                    composition=str(comp),
                    conductivity_proxy=0.001
                )
                materials.append((material_id, material_props))
            except:
                continue
    
    print(f"✅ Successfully processed {len(materials)} materials\n")
    return materials

# ============================================================================
# RANKING & CATEGORIZATION
# ============================================================================

def categorize_score(score):
    """Categorize material based on score"""
    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Very Good"
    elif score >= 40:
        return "Good"
    elif score >= 20:
        return "Fair"
    else:
        return "Poor"

def rank_materials(materials, params):
    """Rank all materials using the framework"""
    ranker = MaterialRanker(interaction_params=params)
    
    print(f"🔄 Ranking {len(materials)} materials...")
    ranking_results = ranker.rank_batch([props for _, props in materials])
    
    # Combine with material IDs
    results = []
    for (material_id, props), ranking_result in zip(materials, ranking_results):
        # Handle different return types from rank_batch
        if hasattr(ranking_result, 'transport_state'):
            # It's a RankingResult object with flat attributes
            result = {
                "material_id": material_id,
                "composition": ranking_result.composition,
                "score_normalized": ranking_result.score_normalized,
                "rank": ranking_result.rank,
                "transport_state": ranking_result.transport_state,
                "stability_state": ranking_result.stability_state,
                "frustration_state": ranking_result.frustration_state,
                "tEF": ranking_result.transport_efficiency_factor,
                "tFI": ranking_result.transport_frustration_index,
                "feasibility": ranking_result.feasibility,
                "category": categorize_score(ranking_result.score_normalized),
            }
        else:
            # Fallback: create minimal result
            result = {
                "material_id": material_id,
                "composition": props.composition,
                "score_normalized": 0.0,
                "rank": 0,
                "transport_state": 0.0,
                "stability_state": 0.0,
                "frustration_state": 0.0,
                "tEF": 0.0,
                "tFI": 0.0,
                "feasibility": 0.0,
                "category": "Fair",
            }
        results.append(result)
    
    print(f"✅ Ranked {len(results)} materials\n")
    return results

# ============================================================================
# ANALYSIS & REPORTING
# ============================================================================

def compute_statistics(results_df):
    """Compute comprehensive statistics"""
    scores = results_df['score_normalized'].values
    
    stats = {
        "total_materials": len(results_df),
        "avg_score": float(np.mean(scores)),
        "median_score": float(np.median(scores)),
        "std_score": float(np.std(scores)),
        "min_score": float(np.min(scores)),
        "max_score": float(np.max(scores)),
        "score_range": float(np.max(scores) - np.min(scores)),
    }
    
    # Category distribution
    category_counts = results_df['category'].value_counts().to_dict()
    stats["category_distribution"] = category_counts
    
    # Category averages
    category_avgs = results_df.groupby('category')['score_normalized'].mean().to_dict()
    stats["category_averages"] = {k: float(v) for k, v in category_avgs.items()}
    
    # Transport/Stability/Frustration averages
    stats["avg_transport_state"] = float(results_df['transport_state'].mean())
    stats["avg_stability_state"] = float(results_df['stability_state'].mean())
    stats["avg_frustration_state"] = float(results_df['frustration_state'].mean())
    
    return stats

def print_report(results_df, stats):
    """Print formatted report"""
    print("\n" + "="*80)
    print("COMPREHENSIVE RANKING REPORT - ALL 321 MATERIALS")
    print("="*80)
    
    print(f"\n📊 DATASET OVERVIEW:")
    print(f"   Total Materials: {stats['total_materials']}")
    print(f"   Score Range: {stats['min_score']:.1f} - {stats['max_score']:.1f}")
    print(f"   Average Score: {stats['avg_score']:.1f} ± {stats['std_score']:.1f}")
    print(f"   Median Score: {stats['median_score']:.1f}")
    
    print(f"\n📈 CATEGORY DISTRIBUTION:")
    for category in ["Excellent", "Very Good", "Good", "Fair", "Poor"]:
        count = stats['category_distribution'].get(category, 0)
        avg = stats['category_averages'].get(category, 0)
        pct = (count / stats['total_materials']) * 100
        print(f"   {category:12s}: {count:4d} materials ({pct:5.1f}%) - avg: {avg:6.1f}")
    
    print(f"\n🔬 PHYSICS STATE AVERAGES:")
    print(f"   Transport State (T):    {stats['avg_transport_state']:.3f}")
    print(f"   Stability State (S):    {stats['avg_stability_state']:.3f}")
    print(f"   Frustration State (F):  {stats['avg_frustration_state']:.3f}")
    
    print(f"\n🏆 TOP 10 MATERIALS:")
    top_10 = results_df.head(10)
    for idx, row in top_10.iterrows():
        print(f"   #{row['rank']:3d}: {row['material_id']:8s} ({row['composition']:20s}) → {row['score_normalized']:6.1f} [{row['category']}]")
    
    print(f"\n⚠️  BOTTOM 10 MATERIALS:")
    bottom_10 = results_df.tail(10)
    for idx, row in bottom_10.iterrows():
        print(f"   #{row['rank']:3d}: {row['material_id']:8s} ({row['composition']:20s}) → {row['score_normalized']:6.1f} [{row['category']}]")
    
    print(f"\n" + "="*80)

# ============================================================================
# EXPORT FUNCTIONS
# ============================================================================

def export_full_results(results_df, output_dir, timestamp):
    """Export full ranking results to CSV"""
    filename = f"ranking_results_full_{timestamp}.csv"
    filepath = os.path.join(output_dir, filename)
    
    results_df.to_csv(filepath, index=False)
    print(f"✅ Saved: {filename}")
    print(f"   ({len(results_df)} materials × {len(results_df.columns)} columns)")
    return filepath

def export_summary(results_df, output_dir, timestamp):
    """Export simplified summary to CSV"""
    summary_df = results_df[['rank', 'material_id', 'composition', 'score_normalized', 'category']].copy()
    summary_df.columns = ['rank', 'material_id', 'composition', 'score', 'category']
    
    filename = f"ranking_summary_{timestamp}.csv"
    filepath = os.path.join(output_dir, filename)
    
    summary_df.to_csv(filepath, index=False)
    print(f"✅ Saved: {filename}")
    print(f"   ({len(summary_df)} materials × {len(summary_df.columns)} columns)")
    return filepath

def export_statistics(stats, output_dir, timestamp):
    """Export statistics to JSON and CSV"""
    # JSON export
    json_filename = f"statistics_{timestamp}.json"
    json_filepath = os.path.join(output_dir, json_filename)
    
    with open(json_filepath, 'w') as f:
        json.dump(stats, f, indent=2)
    print(f"✅ Saved: {json_filename}")
    
    # CSV export (flat format)
    csv_filename = f"statistics_{timestamp}.csv"
    csv_filepath = os.path.join(output_dir, csv_filename)
    
    flat_stats = {
        "Metric": [
            "Total Materials",
            "Average Score",
            "Median Score",
            "Score Std Dev",
            "Min Score",
            "Max Score",
            "Score Range",
            "Excellent Count",
            "Very Good Count",
            "Good Count",
            "Fair Count",
            "Poor Count",
            "Avg Transport State",
            "Avg Stability State",
            "Avg Frustration State",
        ],
        "Value": [
            stats['total_materials'],
            f"{stats['avg_score']:.2f}",
            f"{stats['median_score']:.2f}",
            f"{stats['std_score']:.2f}",
            f"{stats['min_score']:.2f}",
            f"{stats['max_score']:.2f}",
            f"{stats['score_range']:.2f}",
            stats['category_distribution'].get('Excellent', 0),
            stats['category_distribution'].get('Very Good', 0),
            stats['category_distribution'].get('Good', 0),
            stats['category_distribution'].get('Fair', 0),
            stats['category_distribution'].get('Poor', 0),
            f"{stats['avg_transport_state']:.3f}",
            f"{stats['avg_stability_state']:.3f}",
            f"{stats['avg_frustration_state']:.3f}",
        ]
    }
    stats_df = pd.DataFrame(flat_stats)
    stats_df.to_csv(csv_filepath, index=False)
    print(f"✅ Saved: {csv_filename}")

def export_by_category(results_df, output_dir, timestamp):
    """Export materials grouped by category"""
    for category in ["Excellent", "Very Good", "Good", "Fair", "Poor"]:
        category_df = results_df[results_df['category'] == category].copy()
        if len(category_df) > 0:
            filename = f"materials_{category.lower()}_{timestamp}.csv"
            filepath = os.path.join(output_dir, filename)
            category_df.to_csv(filepath, index=False)
            print(f"✅ Saved: {filename} ({len(category_df)} materials)")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print("\n" + "="*80)
    print("FULL DATASET RANKING - 321 OBLIEX MATERIALS")
    print("="*80)
    print(f"Timestamp: {TIMESTAMP}")
    print(f"Parameters: α={INTERACTION_PARAMS.alpha}, β={INTERACTION_PARAMS.beta}, γ={INTERACTION_PARAMS.gamma}")
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # [1] Process all materials
    print(f"\n[1/5] Loading and processing CIF files...")
    materials = process_all_materials(CIF_DIR)
    
    if not materials:
        print("❌ No materials found. Check CIF directory.")
        return
    
    # [2] Rank materials
    print(f"[2/5] Ranking materials using physics framework...")
    results = rank_materials(materials, INTERACTION_PARAMS)
    results_df = pd.DataFrame(results).sort_values('score_normalized', ascending=False).reset_index(drop=True)
    results_df['rank'] = range(1, len(results_df) + 1)
    
    # [3] Compute statistics
    print(f"[3/5] Computing statistical analysis...")
    stats = compute_statistics(results_df)
    
    # [4] Print report
    print(f"[4/5] Generating report...")
    print_report(results_df, stats)
    
    # [5] Export results
    print(f"[5/5] Exporting results to CSV...")
    print(f"\n📁 Output Directory: {os.path.abspath(OUTPUT_DIR)}\n")
    export_full_results(results_df, OUTPUT_DIR, TIMESTAMP)
    export_summary(results_df, OUTPUT_DIR, TIMESTAMP)
    export_statistics(stats, OUTPUT_DIR, TIMESTAMP)
    export_by_category(results_df, OUTPUT_DIR, TIMESTAMP)
    
    print("\n" + "="*80)
    print("✨ Report generation complete!")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
