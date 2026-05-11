#!/usr/bin/env python3
"""
QUICK START: Run Trial Mode Backend
===================================

Usage:
    python run_trial_mode.py

The backend will start on http://localhost:5000

Available endpoints:
    POST   /analyze-cif              - Upload CIF file and get full analysis
    GET    /health                   - Health check
    GET    /last-result              - Get last analysis result
    GET    /error-log                - Get error log
    POST   /clear-uploads            - Clear upload folder
"""

import sys
import subprocess
from pathlib import Path

def main():
    # Check if virtual environment is activated
    if sys.prefix == sys.base_prefix:
        print("⚠ WARNING: Virtual environment not activated!")
        print("  Run this first:")
        print("    .venv\\Scripts\\activate  (Windows)")
        print("    source .venv/bin/activate  (Unix)")
    
    # Check dependencies
    print("\nChecking dependencies...")
    try:
        import flask
        import numpy
        import pandas
        import pymatgen
        print("✓ All dependencies installed")
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print(f"\nInstall with:")
        print(f"  pip install -r trial_mode_requirements.txt")
        return 1
    
    # Run backend
    print("\nStarting Trial Mode Backend...")
    print("=" * 80)
    
    try:
        from trial_mode_backend import app
        print("✓ Backend module loaded successfully\n")
        
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
    except Exception as e:
        print(f"✗ Failed to start backend: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
