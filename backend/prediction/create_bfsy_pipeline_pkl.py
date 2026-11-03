"""Builds the BFSY pipeline pickle (offline).

Role in the system
------------------
Offline script that trains/saves the BFSYPipeline artefacts. Run manually.
"""

import os  # paths
import sys
import joblib
sys.path.insert(0, os.path.dirname(__file__))
from BFSY_pipeline import BFSYPipeline

def main():
    # The pretrained models are located in IndianMatter/pretrained_models
    # __file__ is in IndianMatter/backend/prediction/
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'pretrained_models'))
    pipeline = BFSYPipeline(models_dir=models_dir)
    
    # Save the pipeline in the current directory (backend/prediction)
    output_path = os.path.join(os.path.dirname(__file__), 'bfsy_pipeline.pkl')
    joblib.dump(pipeline, output_path)
    print(f"BFSYPipeline has been successfully saved to {output_path}")

if __name__ == "__main__":
    main()
