import json
from datetime import datetime
from pathlib import Path

import pandas as pd


NOTEBOOKS = [
    Path("HES_Framework_v2_fixed.ipynb"),
    Path("HES_Framework_v2_final.ipynb"),
]
TIMESTAMP = "20260503_075519"
MERGED_PATH = Path(f"ranking_results/ranking_results_full_{TIMESTAMP}_with_DRF.csv")
DRF_RANKED_PATH = Path(f"ranking_results/DRF_results_ranked_{TIMESTAMP}.csv")
DRF_STATS_PATH = Path(f"ranking_results/DRF_statistics_{TIMESTAMP}.csv")
DRF_ACCEPTED_PATH = Path(f"ranking_results/DRF_accepted_materials_{TIMESTAMP}.csv")


def markdown_cell(source: str) -> dict:
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": source.splitlines(keepends=True),
    }


def code_cell(source: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": source.splitlines(keepends=True),
    }


def main() -> None:
    merged = pd.read_csv(MERGED_PATH)
    drf_ranked = pd.read_csv(DRF_RANKED_PATH)
    drf_stats = pd.read_csv(DRF_STATS_PATH)

    top_drf = drf_ranked.head(10)[
        [
            "drf_rank",
            "material_id",
            "composition",
            "rank",
            "score_normalized",
            "drf_dopant",
            "drf",
            "drf_verdict_clean",
            "drf_accepted",
        ]
    ]
    top_accepted = drf_ranked[drf_ranked["drf_accepted"] == True].head(10)[
        [
            "drf_rank",
            "material_id",
            "composition",
            "rank",
            "score_normalized",
            "drf",
            "drf_verdict_clean",
        ]
    ]

    stat = dict(zip(drf_stats["Metric"], drf_stats["Value"]))
    section = f"""## DRF Results Integrated With Final Ranking

Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

The existing DRF result table was merged with the final 321-material ranking output.

Files:
- Full ranking plus DRF: `{MERGED_PATH.as_posix()}`
- DRF-ranked table: `{DRF_RANKED_PATH.as_posix()}`
- DRF statistics: `{DRF_STATS_PATH.as_posix()}`
- Accepted DRF candidates: `{DRF_ACCEPTED_PATH.as_posix()}`

DRF run details:
- Materials with DRF values: {len(drf_ranked)}
- Dopant screened in available DRF data: Al
- Accepted materials: {int(stat.get("Accepted materials", 0))}
- DRF mean: {float(stat.get("DRF mean", 0)):.4f}
- DRF median: {float(stat.get("DRF median", 0)):.4f}
- DRF min: {float(stat.get("DRF min", 0)):.4f}
- DRF max: {float(stat.get("DRF max", 0)):.4f}

Verdict counts:
- Excellent: {int(stat.get("Verdict count - Excellent", 0))}
- Good: {int(stat.get("Verdict count - Good", 0))}
- Moderate: {int(stat.get("Verdict count - Moderate", 0))}
- Negligible: {int(stat.get("Verdict count - Negligible", 0))}
- Reject: {int(stat.get("Verdict count - Reject", 0))}

Top 10 by DRF:

{top_drf.to_markdown(index=False)}

Top accepted DRF candidates:

{top_accepted.to_markdown(index=False)}
"""

    code = f"""from pathlib import Path
import pandas as pd

merged_drf_path = Path("{MERGED_PATH.as_posix()}")
drf_ranked_path = Path("{DRF_RANKED_PATH.as_posix()}")
drf_stats_path = Path("{DRF_STATS_PATH.as_posix()}")
drf_accepted_path = Path("{DRF_ACCEPTED_PATH.as_posix()}")

ranking_with_drf = pd.read_csv(merged_drf_path)
drf_ranked = pd.read_csv(drf_ranked_path)
drf_stats = pd.read_csv(drf_stats_path)
drf_accepted = pd.read_csv(drf_accepted_path)

display(drf_stats)
display(drf_ranked.head(20))
display(drf_accepted.head(20))
"""

    marker = "## DRF Results Integrated With Final Ranking"
    for notebook_path in NOTEBOOKS:
        with notebook_path.open("r", encoding="utf-8") as f:
            notebook = json.load(f)
        notebook["cells"] = [
            cell for cell in notebook.get("cells", [])
            if marker not in "".join(cell.get("source", []))
        ]
        notebook["cells"].append(markdown_cell(section))
        notebook["cells"].append(code_cell(code))
        with notebook_path.open("w", encoding="utf-8") as f:
            json.dump(notebook, f, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
