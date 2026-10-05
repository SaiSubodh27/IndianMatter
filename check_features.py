#!/usr/bin/env python3
"""Check actual features in training data"""
import pandas as pd

df = pd.read_csv("datasets/v5_merged_training_dataset.csv", nrows=1)
print(f"Total columns: {len(df.columns)}")
print(f"\nAll columns:")
for i, col in enumerate(df.columns, 1):
    print(f"{i:3d}. {col}")
