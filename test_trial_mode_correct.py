#!/usr/bin/env python3
"""
Test Trial Mode - Shows SOURCE of each prediction
"""

import requests
import json
from pathlib import Path

API_URL = "http://localhost:5000"
CIF_DIR = Path("Obliex_cifs/all_randomized_cifs")

cif_files = list(CIF_DIR.glob("*.cif"))
if not cif_files:
    print("❌ No CIF files found")
    exit(1)

cif_file = cif_files[0]
print(f"\n{'='*90}")
print(f"TESTING CORRECTED TRIAL MODE (REAL vs FAKE)")
print(f"{'='*90}")
print(f"\nCIF: {cif_file.name}")

try:
    with open(cif_file, 'rb') as f:
        files = {'file': (cif_file.name, f)}
        data = {'material_id': cif_file.stem}
        response = requests.post(f"{API_URL}/analyze-cif", files=files, data=data, timeout=120)
    
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        exit(1)
    
    result = response.json()
    results = result.get('results', {})
    
    print(f"\n{'='*90}")
    print("✅ ANALYSIS RESULTS")
    print(f"{'='*90}")
    
    # Features
    if 'features' in results:
        f = results['features']
        print(f"\n📊 FEATURES:")
        print(f"   Count: {f.get('count')}")
        print(f"   Source: {f.get('source')} ← These are REAL training data features!")
    
    # EA
    if 'ea' in results:
        ea = results['ea']
        print(f"\n⚡ ACTIVATION ENERGY:")
        print(f"   Value: {ea.get('value_ev')} eV")
        print(f"   Source: {ea.get('source')} ← {ea.get('confidence'):.0%} confidence")
        if ea.get('status') == 'success':
            print(f"   ✅ THIS IS A REAL PREDICTION (from trained model)")
        else:
            print(f"   ❌ PREDICTION FAILED: {ea.get('errors', ['Unknown error'])[0]}")
    
    # Pre-exponential
    if 'pre_exponential' in results:
        pre_exp = results['pre_exponential']
        print(f"\n📈 PRE-EXPONENTIAL FACTOR:")
        print(f"   Value: 10^{pre_exp.get('log10_value')} S/cm")
        print(f"   Decimal: {pre_exp.get('value_s_cm'):.3e} S/cm")
        print(f"   Source: {pre_exp.get('source')} ← {pre_exp.get('confidence'):.0%} confidence")
        if pre_exp.get('status') == 'success':
            print(f"   ✅ THIS IS A REAL PREDICTION (from trained model)")
        else:
            print(f"   ❌ PREDICTION FAILED: {pre_exp.get('errors', ['Unknown error'])[0]}")
    
    # Conductivity
    if 'conductivity' in results:
        cond = results['conductivity']
        print(f"\n📡 IONIC CONDUCTIVITY:")
        print(f"   Value: {cond.get('value_s_cm'):.4e} S/cm")
        print(f"   log₁₀: {cond.get('log10_value'):.2f}")
        print(f"   Source: {cond.get('source')} ← Calculated from EA × A")
        if cond.get('source') == 'CALCULATED':
            print(f"   ℹ️  {cond.get('formula')}")
            print(f"   ✅ THIS IS CALCULATED (not fake, uses real model predictions)")
        else:
            print(f"   ❌ SKIPPED: {cond.get('reason')}")
    
    # Crystal type
    if 'crystal_type' in results:
        ct = results['crystal_type']
        print(f"\n🔮 CRYSTAL TYPE:")
        print(f"   Type: {ct.get('crystal_type')}")
        print(f"   Confidence: {ct.get('confidence'):.0%}")
        print(f"   Source: {ct.get('source')} ← Estimated from lattice params")
    
    # HES
    if 'hes_score' in results:
        hes = results['hes_score']
        print(f"\n🏆 HES SCORE:")
        print(f"   Score: {hes.get('score'):.1f}/100")
        print(f"   Rating: {hes.get('rating')}")
        print(f"   Source: {hes.get('source')} ← Calculated from EA")
    
    # Errors
    if result.get('errors'):
        print(f"\n❌ ERRORS ({len(result['errors'])}):")
        for err in result['errors']:
            print(f"   - {err}")
    
    # Warnings
    if result.get('warnings'):
        print(f"\n⚠️  WARNINGS ({len(result['warnings'])}):")
        for warn in result['warnings']:
            print(f"   - {warn}")
    
    # Summary
    print(f"\n{'='*90}")
    print("LEGEND:")
    print("  ✅ MODEL_PREDICTION = From trained model (REAL, can submit)")
    print("  ✅ CALCULATED = Math result using model outputs (REAL, can submit)")
    print("  ⚠️  ESTIMATED = From structure analysis only (ESTIMATE, be careful)")
    print("  ❌ SKIPPED = Not available due to errors")
    print(f"{'='*90}\n")
    
    # Save
    result_file = Path("trial_results") / f"{cif_file.stem}_correct_test.json"
    result_file.parent.mkdir(exist_ok=True)
    with open(result_file, 'w') as f:
        json.dump(result, f, indent=2, default=str)
    print(f"Full result saved to: {result_file}\n")

except requests.exceptions.ConnectionError:
    print(f"❌ Connection failed!")
    print(f"   Is backend running? Run: python trial_mode_backend_correct.py")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
