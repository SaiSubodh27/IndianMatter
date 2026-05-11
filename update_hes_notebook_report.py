import copy
import json
from datetime import datetime
from pathlib import Path

import pandas as pd


NOTEBOOK_PATH = Path("HES_Framework_v2_fixed.ipynb")
FINAL_NOTEBOOK_PATH = Path("HES_Framework_v2_final.ipynb")
RESULTS_PATH = Path("ranking_results/ranking_results_full_20260503_075519.csv")
SUMMARY_PATH = Path("ranking_results/ranking_summary_20260503_075519.csv")
STATS_PATH = Path("ranking_results/statistics_20260503_075519.csv")


def new_markdown_cell(source: str) -> dict:
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": source.splitlines(keepends=True),
    }


def new_code_cell(source: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": source.splitlines(keepends=True),
    }


def main() -> None:
    df = pd.read_csv(RESULTS_PATH)
    stats = pd.read_csv(STATS_PATH)
    category_counts = df["category"].value_counts().to_dict()
    top10 = df.head(10)[["rank", "material_id", "composition", "score_normalized", "category"]]

    summary_md = f"""## Final 321-Material HES Ranking Report

Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

This notebook has been updated with the latest full-dataset screening run using the corrected physics-informed ranking framework.

Run details:
- CIF files processed: {len(df)}
- Failed materials: 0
- Full CSV report: `{RESULTS_PATH.as_posix()}`
- Summary CSV: `{SUMMARY_PATH.as_posix()}`
- Statistics CSV: `{STATS_PATH.as_posix()}`

Important runtime note:
- CHGNet could not be installed in this Python 3.13 Windows environment because the package attempted to build a compiled extension and required Microsoft C++ Build Tools.
- The run therefore used the framework's CIF/pymatgen processing path with CHGNet fallback behavior, plus the nonlinear state-based scoring updates.

Score summary:
- Minimum score: {df["score_normalized"].min():.2f}
- Maximum score: {df["score_normalized"].max():.2f}
- Mean score: {df["score_normalized"].mean():.2f}
- Median score: {df["score_normalized"].median():.2f}
- Standard deviation: {df["score_normalized"].std():.2f}

Category counts:
- Excellent: {category_counts.get("Excellent", 0)}
- Very Good: {category_counts.get("Very Good", 0)}
- Good: {category_counts.get("Good", 0)}
- Fair: {category_counts.get("Fair", 0)}
- Poor: {category_counts.get("Poor", 0)}

Top ranked candidates from this run:

{top10.to_markdown(index=False)}
"""

    report_code = """from pathlib import Path
import pandas as pd

results_path = Path("ranking_results/ranking_results_full_20260503_075519.csv")
summary_path = Path("ranking_results/ranking_summary_20260503_075519.csv")
stats_path = Path("ranking_results/statistics_20260503_075519.csv")

results_df = pd.read_csv(results_path)
stats_df = pd.read_csv(stats_path)

display(stats_df)
display(results_df.head(20))
"""

    with NOTEBOOK_PATH.open("r", encoding="utf-8") as f:
        notebook = json.load(f)

    marker = "## Final 321-Material HES Ranking Report"
    notebook["cells"] = [
        cell for cell in notebook.get("cells", [])
        if marker not in "".join(cell.get("source", []))
    ]
    notebook["cells"].append(new_markdown_cell(summary_md))
    notebook["cells"].append(new_code_cell(report_code))

    with NOTEBOOK_PATH.open("w", encoding="utf-8") as f:
        json.dump(notebook, f, indent=1, ensure_ascii=False)

    final_notebook = copy.deepcopy(notebook)
    with FINAL_NOTEBOOK_PATH.open("w", encoding="utf-8") as f:
        json.dump(final_notebook, f, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
