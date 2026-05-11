#!/usr/bin/env python3
"""Debug v6_corrector_model output"""
import pickle
import numpy as np
from pathlib import Path

model_path = Path("pretrained_models/v6_corrector_model.pkl")

with open(model_path, 'rb') as f:
    model = pickle.load(f)

print(f"Model type: {type(model).__name__}")
print(f"Model: {model}")

# Try prediction with 81 features
features = np.random.randn(1, 81)
print(f"\nInput shape: {features.shape}")

try:
    pred = model.predict(features)
    print(f"Prediction output:")
    print(f"  Type: {type(pred)}")
    print(f"  Shape: {pred.shape if hasattr(pred, 'shape') else len(pred)}")
    print(f"  Value: {pred}")
    print(f"  First element: {pred[0]}")
    print(f"  First element type: {type(pred[0])}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

# Check if it has other methods
print(f"\nModel methods/attributes:")
for attr in dir(model):
    if not attr.startswith('_'):
        print(f"  - {attr}")
