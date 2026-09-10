#!/usr/bin/env python3
"""
Test runner using Python unittest framework for backend prediction pipeline.
"""
import unittest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

if __name__ == "__main__":
    test_dir = os.path.join(os.path.dirname(__file__), "..", "backend", "tests")
    loader = unittest.TestLoader()
    suite = loader.discover(test_dir, pattern="test_*.py")
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
