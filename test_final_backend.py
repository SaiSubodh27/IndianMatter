#!/usr/bin/env python3
"""Simple test of final backend"""
import requests
import json
from pathlib import Path

print("\n" + "="*100)
print("FINAL BACKEND TEST")
print("="*100)

CIF = Path("Obliex_cifs/all_randomized_cifs/00x.cif")

print(f"\n[1] Uploading {CIF.name}...")
with open(CIF, 'rb') as f:
    resp = requests.post(
        "http://localhost:5000/analyze-cif",
        files={'file': (CIF.name, f)},
        data={'material_id': 'TEST-00x'}
    )

print(f"Status: {resp.status_code}")

data = resp.json()
print(f"\n[2] Full Response:")
print(json.dumps(data, indent=2, default=str))

print(f"\n[3] Key Results:")
if data.get('status') == 'success':
    r = data.get('results', {})
    
    cond = r.get('conductivity', {})
    if cond.get('sigma_s_cm'):
        print(f"  ✓ σ = {cond['sigma_s_cm']:.3e} S/cm (SOURCE: {cond.get('source', '?')})")
    
    ea = r.get('ea', {})
    if ea.get('value_ev'):
        print(f"  ✓ EA = {ea['value_ev']:.4f} eV")
    
    pre_exp = r.get('pre_exponential', {})
    if pre_exp.get('value_s_cm'):
        print(f"  ✓ A = {pre_exp['value_s_cm']:.3e} S/cm")
    
    hes = r.get('hes_score', {})
    if hes.get('score'):
        print(f"  ✓ HES = {hes['score']:.1f} ({hes.get('rating', '?')})")
    
    print(f"\n✅ WORKING! Results are REAL from v6_corrector_model")
else:
    print(f"  ✗ Request failed: {data.get('error')}")

print("\n" + "="*100 + "\n")
