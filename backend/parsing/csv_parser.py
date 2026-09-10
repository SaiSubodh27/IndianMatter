import os
import pandas as pd
from typing import Tuple, Dict, List, Optional
from core.exceptions import DatasetValidationError
from core.config import settings

def parse_csv_dataset(file_path: str, max_rows: int = 100) -> Tuple[pd.DataFrame, dict]:
    """
    Parse uploaded CSV dataset and enforce strict max_rows limit (default 100).
    """
    if not os.path.exists(file_path):
        raise DatasetValidationError(f"CSV file not found: {file_path}")

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        raise DatasetValidationError(f"Could not parse CSV file: {str(e)}")

    total_rows = len(df)
    if total_rows > max_rows:
        raise DatasetValidationError(
            f"Dataset exceeds the maximum limit of {max_rows} rows. Uploaded file contains {total_rows} rows."
        )

    # Detect potential structure and formula columns
    cols_lower = {str(c).lower().strip(): str(c) for c in df.columns}
    
    structure_col = None
    for candidate in ["cif", "poscar", "structure", "xyz", "cif_file", "cif_str", "structure_file"]:
        if candidate in cols_lower:
            structure_col = cols_lower[candidate]
            break

    formula_col = None
    for candidate in ["formula", "composition", "material", "reduced_formula", "chemical_formula", "material_id"]:
        if candidate in cols_lower:
            formula_col = cols_lower[candidate]
            break

    summary = {
        "total_rows": total_rows,
        "valid_rows": total_rows,
        "columns": list(df.columns),
        "detected_structure_col": structure_col,
        "detected_formula_col": formula_col,
    }

    return df, summary
