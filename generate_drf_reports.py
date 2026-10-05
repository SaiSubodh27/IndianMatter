from pathlib import Path

import pandas as pd


TIMESTAMP = "20260503_075519"
RANKING_PATH = Path(f"ranking_results/ranking_results_full_{TIMESTAMP}.csv")
SUMMARY_PATH = Path(f"ranking_results/ranking_summary_{TIMESTAMP}.csv")
DRF_PATH = Path("DRF_results.csv")
OUT_DIR = Path("ranking_results")

MERGED_PATH = OUT_DIR / f"ranking_results_full_{TIMESTAMP}_with_DRF.csv"
DRF_RANKED_PATH = OUT_DIR / f"DRF_results_ranked_{TIMESTAMP}.csv"
DRF_STATS_PATH = OUT_DIR / f"DRF_statistics_{TIMESTAMP}.csv"
DRF_ACCEPTED_PATH = OUT_DIR / f"DRF_accepted_materials_{TIMESTAMP}.csv"
COMBINED_SUMMARY_PATH = OUT_DIR / f"ranking_summary_{TIMESTAMP}_with_DRF.csv"


def clean_verdict(value: str) -> str:
    value = str(value).strip()
    return value.replace("★", "").strip()


def main() -> None:
    ranking = pd.read_csv(RANKING_PATH)
    summary = pd.read_csv(SUMMARY_PATH)
    drf = pd.read_csv(DRF_PATH)

    drf = drf.rename(
        columns={
            "Material": "material_id",
            "Dopant": "drf_dopant",
            "HES_base": "drf_hes_base",
            "HES_doped": "drf_hes_doped",
            "DRF": "drf",
            "Verdict": "drf_verdict",
            "Accepted": "drf_accepted",
            "S_stable": "drf_s_stable",
            "P_perc_ok": "drf_p_perc_ok",
            "R_inst_ok": "drf_r_inst_ok",
        }
    )
    drf["drf_verdict_clean"] = drf["drf_verdict"].map(clean_verdict)

    merged = ranking.merge(drf, on="material_id", how="left", validate="one_to_one")
    merged = merged.sort_values(["score_normalized", "drf"], ascending=[False, False])
    merged.to_csv(MERGED_PATH, index=False)

    combined_summary = summary.merge(
        drf[
            [
                "material_id",
                "drf_dopant",
                "drf",
                "drf_verdict_clean",
                "drf_accepted",
                "drf_s_stable",
                "drf_p_perc_ok",
                "drf_r_inst_ok",
            ]
        ],
        on="material_id",
        how="left",
        validate="one_to_one",
    )
    combined_summary.to_csv(COMBINED_SUMMARY_PATH, index=False)

    drf_ranked = merged[
        [
            "material_id",
            "composition",
            "rank",
            "score_normalized",
            "category",
            "drf_dopant",
            "drf",
            "drf_verdict_clean",
            "drf_accepted",
            "drf_hes_base",
            "drf_hes_doped",
            "drf_s_stable",
            "drf_p_perc_ok",
            "drf_r_inst_ok",
        ]
    ].sort_values("drf", ascending=False)
    drf_ranked.insert(0, "drf_rank", range(1, len(drf_ranked) + 1))
    drf_ranked.to_csv(DRF_RANKED_PATH, index=False)

    accepted = drf_ranked[drf_ranked["drf_accepted"] == True].copy()
    accepted.to_csv(DRF_ACCEPTED_PATH, index=False)

    stats_rows = [
        ("Total DRF materials", len(drf_ranked)),
        ("Unique dopants", drf_ranked["drf_dopant"].nunique()),
        ("Accepted materials", int(drf_ranked["drf_accepted"].sum())),
        ("DRF mean", drf_ranked["drf"].mean()),
        ("DRF median", drf_ranked["drf"].median()),
        ("DRF std", drf_ranked["drf"].std()),
        ("DRF min", drf_ranked["drf"].min()),
        ("DRF max", drf_ranked["drf"].max()),
        ("S stable pass", int(drf_ranked["drf_s_stable"].sum())),
        ("P_perc pass", int(drf_ranked["drf_p_perc_ok"].sum())),
        ("R_inst pass", int(drf_ranked["drf_r_inst_ok"].sum())),
    ]
    verdict_counts = drf_ranked["drf_verdict_clean"].value_counts()
    for verdict, count in verdict_counts.items():
        stats_rows.append((f"Verdict count - {verdict}", int(count)))

    pd.DataFrame(stats_rows, columns=["Metric", "Value"]).to_csv(
        DRF_STATS_PATH, index=False
    )

    print(f"Saved {MERGED_PATH}")
    print(f"Saved {COMBINED_SUMMARY_PATH}")
    print(f"Saved {DRF_RANKED_PATH}")
    print(f"Saved {DRF_STATS_PATH}")
    print(f"Saved {DRF_ACCEPTED_PATH}")
    print()
    print("Top 10 by DRF:")
    print(drf_ranked.head(10).to_string(index=False))
    print()
    print("DRF statistics:")
    print(pd.DataFrame(stats_rows, columns=["Metric", "Value"]).to_string(index=False))


if __name__ == "__main__":
    main()
