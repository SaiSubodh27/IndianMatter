#!/usr/bin/env python3
"""
Test Trial Mode Backend - Upload & Analyze Sample CIF
"""

import requests
import json
from pathlib import Path

API_URL = "http://localhost:5000"
CIF_DIR = Path("Obliex_cifs/all_randomized_cifs")

# Find first CIF file
cif_files = list(CIF_DIR.glob("*.cif"))
if not cif_files:
    print("❌ No CIF files found in", CIF_DIR)
    exit(1)

cif_file = cif_files[0]
print(f"\n{'='*80}")
print(f"TESTING TRIAL MODE BACKEND")
print(f"{'='*80}")
print(f"\nUsing CIF file: {cif_file.name}")
print(f"File size: {cif_file.stat().st_size} bytes")

# Upload to backend
print(f"\nUploading to {API_URL}/analyze-cif...")
try:
    with open(cif_file, 'rb') as f:
        files = {'file': (cif_file.name, f)}
        data = {'material_id': cif_file.stem}
        response = requests.post(
            f"{API_URL}/analyze-cif",
            files=files,
            data=data,
            timeout=120
        )
    
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        
        print(f"\n{'='*80}")
        print("✅ ANALYSIS SUCCESSFUL")
        print(f"{'='*80}")
        
        print(f"\nMaterial ID: {result['material_id']}")
        print(f"Status: {result['status']}")
        
        results = result.get('results', {})
        
        # Features
        if 'features' in results:
            f = results['features']
            print(f"\n📊 FEATURES:")
            print(f"  ✓ Count: {f.get('count')}/343")
            print(f"  Status: {f.get('status')}")
            time_val = f.get('extraction_time')
            if time_val is not None:
                print(f"  Time: {time_val:.2f}s")
            else:
                print(f"  Time: N/A")
        
        # EA
        if 'ea' in results and results['ea'].get('status') == 'success':
            ea = results['ea']
            print(f"\n⚡ ACTIVATION ENERGY (EA):")
            print(f"  ✓ EA = {ea['ea_ev']:.4f} eV")
            print(f"  = {ea['ea_kcal_mol']:.2f} kcal/mol")
        
        # Pre-exponential
        if 'pre_exponential' in results:
            pre_exp = results['pre_exponential']
            print(f"\n📈 PRE-EXPONENTIAL FACTOR (A):")
            print(f"  ✓ A = {pre_exp['value']:.3e} S/cm")
            print(f"  log₁₀(A) = {pre_exp['log10_value']:.2f}")
        
        # Conductivity
        if 'conductivity' in results and results['conductivity'].get('status') == 'success':
            cond = results['conductivity']
            print(f"\n📡 IONIC CONDUCTIVITY:")
            print(f"  ✓ σ = {cond['sigma_s_cm']:.4e} S/cm")
            print(f"  log₁₀(σ) = {cond['sigma_log10']:.2f}")
        
        # Crystal type
        if 'crystal_type' in results:
            ct = results['crystal_type']
            print(f"\n🔮 CRYSTAL TYPE:")
            print(f"  ✓ Type: {ct['crystal_type'].upper()}")
            print(f"  Space group: {ct.get('space_group', 'N/A')}")
            print(f"  Confidence: {ct.get('confidence', 0):.2%}")
        
        # HES Score
        if 'hes_score' in results and results['hes_score'].get('hes_score') is not None:
            hes = results['hes_score']
            print(f"\n🏆 HES SCORE:")
            print(f"  ✓ Score: {hes['hes_score']:.1f}/100")
            print(f"  Rating: {hes.get('stability_rating', 'N/A')}")
            print(f"  Normalized: {hes.get('hes_normalized', 0):.3f}")
        
        # Errors & Warnings
        if result.get('errors'):
            print(f"\n⚠️  ERRORS ({len(result['errors'])}):")
            for err in result['errors']:
                print(f"  ❌ {err}")
        
        if result.get('warnings'):
            print(f"\n⚡ WARNINGS ({len(result['warnings'])}):")
            for warn in result['warnings']:
                print(f"  ⚠️  {warn}")
        
        # Save result
        result_file = Path("trial_results") / f"{cif_file.stem}_test_result.json"
        result_file.parent.mkdir(exist_ok=True)
        with open(result_file, 'w') as f:
            json.dump(result, f, indent=2, default=str)
        
        print(f"\n✅ Full result saved to: {result_file}")
        
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

except requests.exceptions.ConnectionError:
    print(f"\n❌ Connection failed!")
    print(f"   Is backend running on {API_URL}?")
    print(f"   Run: python trial_mode_backend.py")
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
