#!/usr/bin/env python3
"""Test loading all pretrained models"""
import pickle
import numpy as np
from pathlib import Path

models_dir = Path("pretrained_models")

# Test each model
for model_file in sorted(models_dir.glob("*.pkl")):
    print(f"\n{'='*60}")
    print(f"Testing: {model_file.name}")
    print(f"Size: {model_file.stat().st_size / 1024 / 1024:.2f} MB")
    print(f"{'='*60}")
    
    try:
        with open(model_file, 'rb') as f:
            model = pickle.load(f)
        
        print(f"✓ Loaded successfully")
        print(f"Type: {type(model).__name__}")
        
        # Try to get info
        if hasattr(model, 'n_features_in_'):
            print(f"Expected features: {model.n_features_in_}")
        
        # Try a dummy prediction
        try:
            dummy_input = np.random.randn(1, 178)  # 178 features
            pred = model.predict(dummy_input)
            print(f"✓ Dummy prediction works: {pred[0] if isinstance(pred, np.ndarray) else pred}")
        except Exception as e:
            print(f"✗ Dummy prediction failed: {str(e)[:100]}")
    
    except Exception as e:
        print(f"✗ Load failed: {str(e)[:200]}")
