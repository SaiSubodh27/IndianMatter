import os
import sys
from pathlib import Path

# ==============================================================================
# 1) PASTE YOUR FILE OR FOLDER PATH HERE:
# ==============================================================================
USER_INPUT_PATH = r"mp-1960.cif"

# ==============================================================================
# 2) PASTE YOUR MP API KEY HERE:
# ==============================================================================
USER_API_KEY = "UVRcjuj5VZrKy46PcpCVh6bVrl9UVs3f"

# ==============================================================================


# Import the core logic from the ehull_tool
from ehull_tool import collect_cifs, EhullCalculator

def predict(input_path, api_key, out_csv="predictions.csv"):
    """
    Predicts the stability (energy above hull) of a given CIF file, folder, or zip
    using CHGNet and Materials Project convex hulls.
    """
    if not api_key or api_key == "YOUR_API_KEY_HERE":
        print("ERROR: Please set your API key in the USER_API_KEY variable at the top of the file.")
        return None
        
    # Find all CIFs in the given path
    cifs, temp_dir = collect_cifs(input_path)
    if not cifs:
        print(f"No CIF files found at: {input_path}")
        return None
        
    print(f"Starting prediction on {len(cifs)} CIF file(s)...")
    
    # Initialize the calculator (relax=True enables structure optimization via CHGNet)
    calc = EhullCalculator(api_key, relax=True)
    
    # Process the batch!
    df = calc.process_batch(cifs, validate=False)
    
    # Save the output
    df.to_csv(out_csv, index=False)
    print(f"\nDone! Predictions saved to {out_csv}")
    
    # Clean up temp extracted zip folder if one was created
    if temp_dir:
        import shutil
        shutil.rmtree(temp_dir)
        
    return df

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Easy wrapper to predict stability of CIF files")
    parser.add_argument("input_path", nargs="?", help="Path to a single CIF file, a folder of CIFs, or a .zip file")
    parser.add_argument("--out", default="predictions.csv", help="Output CSV filename (default: predictions.csv)")
    
    args = parser.parse_args()
    
    if args.input_path:
        # Run using CLI arguments if provided
        predict(args.input_path, USER_API_KEY, out_csv=args.out)
    else:
        # Fallback for easy hardcoding!
        if Path(USER_INPUT_PATH).exists():
            print(f"Running on default target: {USER_INPUT_PATH}")
            predict(USER_INPUT_PATH, USER_API_KEY)
        else:
            print(f"File or folder not found: {USER_INPUT_PATH}")
            print("Please paste a valid path into the USER_INPUT_PATH variable at the top of predict.py.")
