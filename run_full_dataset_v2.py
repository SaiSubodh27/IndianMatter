#!/usr/bin/env python3
"""
Full Dataset Ranking - Diagnostic Version
"""

import os
import glob
import json
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

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

def process_and_rank_materials(cif_dir):
    """
    Process CIF materials and rank them as a single cohort so final scores use
    the intended dataset-level 0-100 normalization.
    """
    cif_files = get_all_cif_files(cif_dir)
    print(f"\n📁 Found {len(cif_files)} CIF files")
    
    pipeline = MaterialDataPipeline()
    ranker = MaterialRanker(interaction_params=INTERACTION_PARAMS)
    
    materials = []
    failed = []
    
    for i, cif_path in enumerate(cif_files, 1):
        material_id = extract_material_id(cif_path)
        
        # Progress indicator
        if i % 50 == 0:
            print(f"   [{i}/{len(cif_files)}] Processing {material_id}...")
        
        try:
            # Process CIF file
            material_props = pipeline.process_cif(cif_path)
            if not material_props:
                failed.append((material_id, "No properties returned"))
                continue
            
            materials.append(material_props)
                
        except Exception as e:
            error_msg = str(e)
            if len(error_msg) > 80:
                error_msg = error_msg[:80]
            failed.append((material_id, error_msg))
    
    results_df = ranker.rank_batch(materials)
    results = []
    if not results_df.empty:
        for _, row in results_df.iterrows():
            results.append({
                "rank": int(row["rank"]),
                "material_id": row["material_id"],
                "composition": row["composition"],
                "score_normalized": row["score_normalized"],
                "score_raw": row["score_raw"],
                "transport_state": row["transport_state"],
                "stability_state": row["stability_state"],
                "frustration_state": row["frustration_state"],
                "tEF": row["transport_efficiency_factor"],
                "tFI": row["transport_frustration_index"],
                "feasibility": row["feasibility"],
            })
    
    print(f"\n✅ Successfully processed {len(results)} materials")
    print(f"⚠️  Failed: {len(failed)} materials")
    
    return results, failed

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

def compute_statistics(results):
    """Compute comprehensive statistics"""
    if not results:
        return {}
    
    results_df = pd.DataFrame(results)
    scores = results_df['score_normalized'].values
    
    stats = {
        "total_materials": len(results_df),
        "avg_score": float(np.mean(scores)),
        "median_score": float(np.median(scores)),
        "std_score": float(np.std(scores)),
        "min_score": float(np.min(scores)),
        "max_score": float(np.max(scores)),
        "score_range": float(np.max(scores) - np.min(scores)) if len(scores) > 1 else 0,
    }
    
    return stats, results_df

def print_report(results_df, stats):
    """Print formatted report"""
    if results_df.empty:
        print("\n⚠️  No results to report")
        return
    
    # Add categories
    results_df['category'] = results_df['score_normalized'].apply(categorize_score)
    
    print("\n" + "="*80)
    print("COMPREHENSIVE RANKING REPORT - 321 OBLIEX MATERIALS")
    print("="*80)
    
    print(f"\n📊 DATASET OVERVIEW:")
    print(f"   Total Materials: {stats['total_materials']}")
    print(f"   Score Range: {stats['min_score']:.1f} - {stats['max_score']:.1f}")
    print(f"   Average Score: {stats['avg_score']:.1f} ± {stats['std_score']:.1f}")
    print(f"   Median Score: {stats['median_score']:.1f}")
    
    # Category distribution
    category_dist = results_df['category'].value_counts().to_dict()
    category_avg = results_df.groupby('category')['score_normalized'].mean().to_dict()
    
    print(f"\n📈 CATEGORY DISTRIBUTION:")
    for category in ["Excellent", "Very Good", "Good", "Fair", "Poor"]:
        count = category_dist.get(category, 0)
        avg = category_avg.get(category, 0)
        pct = (count / stats['total_materials']) * 100 if stats['total_materials'] > 0 else 0
        print(f"   {category:12s}: {count:4d} materials ({pct:5.1f}%) - avg: {avg:6.1f}")
    
    print(f"\n🔬 PHYSICS STATE AVERAGES:")
    print(f"   Transport State (T):    {results_df['transport_state'].mean():.3f}")
    print(f"   Stability State (S):    {results_df['stability_state'].mean():.3f}")
    print(f"   Frustration State (F):  {results_df['frustration_state'].mean():.3f}")
    
    print(f"\n🏆 TOP 10 MATERIALS:")
    top_10 = results_df.nlargest(10, 'score_normalized')
    for idx, row in top_10.iterrows():
        print(f"   #{row['rank']:3d}: {row['material_id']:8s} ({row['composition']:30s}) → {row['score_normalized']:6.1f} [{row['category']}]")
    
    print(f"\n⚠️  BOTTOM 10 MATERIALS:")
    bottom_10 = results_df.nsmallest(10, 'score_normalized')
    for idx, row in bottom_10.iterrows():
        print(f"   #{row['rank']:3d}: {row['material_id']:8s} ({row['composition']:30s}) → {row['score_normalized']:6.1f} [{row['category']}]")
    
    print(f"\n" + "="*80)

def export_results(results, failed, stats, results_df, output_dir, timestamp):
    """Export all results to CSV files"""
    os.makedirs(output_dir, exist_ok=True)
    
    # Full results
    results_df['category'] = results_df['score_normalized'].apply(categorize_score)
    results_df = results_df.sort_values('score_normalized', ascending=False).reset_index(drop=True)
    
    full_file = f"ranking_results_full_{timestamp}.csv"
    results_df.to_csv(os.path.join(output_dir, full_file), index=False)
    print(f"✅ Saved: {full_file} ({len(results_df)} materials)")
    
    # Summary
    summary_df = results_df[['rank', 'material_id', 'composition', 'score_normalized', 'category']].copy()
    summary_df.columns = ['rank', 'material_id', 'composition', 'score', 'category']
    summary_file = f"ranking_summary_{timestamp}.csv"
    summary_df.to_csv(os.path.join(output_dir, summary_file), index=False)
    print(f"✅ Saved: {summary_file}")
    
    # Statistics
    stats_dict = {
        "Metric": [
            "Total Materials",
            "Average Score",
            "Median Score",
            "Score Std Dev",
            "Min Score",
            "Max Score",
            "Score Range",
            "Failed Materials",
        ],
        "Value": [
            stats['total_materials'],
            f"{stats['avg_score']:.2f}",
            f"{stats['median_score']:.2f}",
            f"{stats['std_score']:.2f}",
            f"{stats['min_score']:.2f}",
            f"{stats['max_score']:.2f}",
            f"{stats['score_range']:.2f}",
            len(failed),
        ]
    }
    stats_df = pd.DataFrame(stats_dict)
    stats_file = f"statistics_{timestamp}.csv"
    stats_df.to_csv(os.path.join(output_dir, stats_file), index=False)
    print(f"✅ Saved: {stats_file}")
    
    # Failed materials log
    if failed:
        failed_df = pd.DataFrame(failed, columns=['material_id', 'error_reason'])
        failed_file = f"failed_materials_{timestamp}.csv"
        failed_df.to_csv(os.path.join(output_dir, failed_file), index=False)
        print(f"⚠️  Saved: {failed_file} ({len(failed)} materials)")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print("\n" + "="*80)
    print("FULL DATASET RANKING - 321 OBLIEX MATERIALS (Diagnostic)")
    print("="*80)
    print(f"Timestamp: {TIMESTAMP}")
    print(f"Parameters: α={INTERACTION_PARAMS.alpha}, β={INTERACTION_PARAMS.beta}, γ={INTERACTION_PARAMS.gamma}")
    
    # [1] Process and rank materials
    print(f"\n[1/4] Loading, processing, and ranking all CIF files...")
    results, failed = process_and_rank_materials(CIF_DIR)
    
    if not results:
        print("❌ No materials successfully ranked")
        return
    
    # [2] Compute statistics
    print(f"[2/4] Computing statistical analysis...")
    stats, results_df = compute_statistics(results)
    
    # [3] Print report
    print(f"[3/4] Generating report...")
    print_report(results_df, stats)
    
    # [4] Export results
    print(f"[4/4] Exporting results to CSV...\n")
    print(f"📁 Output Directory: {os.path.abspath(OUTPUT_DIR)}\n")
    export_results(results, failed, stats, results_df, OUTPUT_DIR, TIMESTAMP)
    
    print("\n" + "="*80)
    print("✨ Report generation complete!")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
