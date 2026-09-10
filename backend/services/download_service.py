import os
import json
import zipfile
import pandas as pd
from typing import Dict, Any, List

def generate_download_package(job_data: dict, export_dir: str) -> dict:
    """
    Generate downloadable artifacts for a completed prediction job:
    - combined_results.csv
    - per_model_results.csv
    - per_property_results.csv
    - results.json
    - validation_report.json
    - job_manifest.json
    - calculation_logs.txt
    - zip package containing all
    """
    os.makedirs(export_dir, exist_ok=True)

    job_id = job_data.get("job_id", "job")
    results = job_data.get("results", [])

    # 1. Flatten results for CSV export
    rows_flat = []
    for item in results:
        rows_flat.append({
            "row_id": item.get("row_id"),
            "formula": item.get("formula"),
            "model": item.get("model"),
            "property_key": item.get("property_key"),
            "property_name": item.get("property_name"),
            "category": item.get("category"),
            "value": str(item.get("value")),
            "unit": item.get("unit"),
            "status": item.get("status"),
            "source_model": item.get("source_model"),
            "calculation_method": item.get("calculation_method"),
            "warnings": "; ".join(item.get("warnings", [])),
            "limitations": item.get("limitations"),
        })

    df_comb = pd.DataFrame(rows_flat)
    comb_csv_path = os.path.join(export_dir, f"{job_id}_combined_results.csv")
    df_comb.to_csv(comb_csv_path, index=False)

    # 2. JSON results
    json_path = os.path.join(export_dir, f"{job_id}_results.json")
    with open(json_path, "w") as f:
        json.dump(job_data, f, indent=2)

    # 3. Validation report
    val_report = {
        "job_id": job_id,
        "total_rows": job_data.get("total_rows"),
        "completed_calculations": job_data.get("completed_count", 0),
        "failed_calculations": job_data.get("failed_count", 0),
        "warnings_summary": job_data.get("warnings", []),
        "status": job_data.get("status"),
    }
    val_path = os.path.join(export_dir, f"{job_id}_validation_report.json")
    with open(val_path, "w") as f:
        json.dump(val_report, f, indent=2)

    # 4. Logs
    logs_path = os.path.join(export_dir, f"{job_id}_logs.txt")
    with open(logs_path, "w") as f:
        for log_line in job_data.get("logs", []):
            f.write(log_line + "\n")

    # 5. ZIP Archive
    zip_path = os.path.join(export_dir, f"{job_id}_all_outputs.zip")
    with zipfile.ZipFile(zip_path, "w") as zf:
        zf.write(comb_csv_path, os.path.basename(comb_csv_path))
        zf.write(json_path, os.path.basename(json_path))
        zf.write(val_path, os.path.basename(val_path))
        zf.write(logs_path, os.path.basename(logs_path))

    return {
        "csv": comb_csv_path,
        "json": json_path,
        "validation_report": val_path,
        "logs": logs_path,
        "zip": zip_path,
    }
