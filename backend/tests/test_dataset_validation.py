import os
import tempfile
import unittest
import pandas as pd
from parsing.csv_parser import parse_csv_dataset
from core.exceptions import DatasetValidationError

class TestDatasetValidation(unittest.TestCase):
    def test_100_row_limit_pass(self):
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            df = pd.DataFrame({"formula": [f"Li{i}O" for i in range(1, 101)]})
            df.to_csv(tmp.name, index=False)
            tmp_path = tmp.name

        try:
            parsed_df, summary = parse_csv_dataset(tmp_path, max_rows=100)
            self.assertEqual(len(parsed_df), 100)
            self.assertEqual(summary["total_rows"], 100)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    def test_101_row_limit_reject(self):
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            df = pd.DataFrame({"formula": [f"Li{i}O" for i in range(1, 102)]})
            df.to_csv(tmp.name, index=False)
            tmp_path = tmp.name

        try:
            with self.assertRaises(DatasetValidationError):
                parse_csv_dataset(tmp_path, max_rows=100)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

if __name__ == "__main__":
    unittest.main()
