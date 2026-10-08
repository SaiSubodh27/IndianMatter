"""
cif_pipeline/batch_processor.py

Batch testing and processing engine for the CIF pipeline.
Executes test matrices across compounds, evaluates polymorphs,
exports formatted .dat scientific data files for analysis and plotting.

FULL DESCRIPTION:
-----------------
This module is the 'stress-tester' for the entire CIF pipeline.
It defines a list of 11 benchmark crystalline materials covering a wide variety
of material classes (oxides, halides, metals, semiconductors, 2D materials, etc.)
and runs each one through the full CIF generation pipeline in sequence.

After all test cases finish, it writes a machine-readable .dat file to the
data/ directory, formatted like a scientific data table (columns with header)
so the results can be read by plotting tools (gnuplot, matplotlib, etc.) or
pasted into a spreadsheet.

Key functions:
  - run_batch_pipeline()  -> runs all cases, collects results, writes .dat
  - write_dat_file()      -> formats and saves the .dat output file
  - _batch_ask_handler()  -> silently auto-answers any interactive questions
                             that come up during pipeline execution (batch mode)
"""

# ── Python future import so that type hints like 'List[str]' work the same
# ── in Python 3.7+ (forward-reference annotations are strings by default).
from __future__ import annotations

# ── Standard library: os gives file/directory utilities (makedirs, path ops).
import os

# ── Standard library: time gives time.time() for measuring elapsed seconds,
#    and time.strftime() for formatting human-readable timestamps.
import time

# ── Standard library: logging gives a proper log object so we can emit
#    INFO/DEBUG messages without using bare print() statements.
import logging

# ── Standard library: pathlib.Path is an object-oriented file path helper.
#    Path('/some/dir') / 'file.txt' constructs paths safely across OS platforms.
from pathlib import Path

# ── Standard library typing: List, Dict, Any, Optional are type hints used
#    in function signatures so editors/IDEs can show type errors early.
from typing import List, Dict, Any, Optional

# ── Local import: CompoundQuery is the Pydantic data model that represents
#    one user request for a CIF (formula, space group, doping info, etc.).
from cif_pipeline.models import CompoundQuery

# ── Local import: run_pipeline is the main CIF generation entry point.
#    It takes a CompoundQuery, queries the MP database or generates locally,
#    applies doping if needed, and returns a PipelineResult with the CIF string.
from cif_pipeline.orchestrator import run_pipeline

# ── Create a named logger for this module. Log messages will appear as:
#    "cif_pipeline.batch  INFO  [Batch] Auto-selected ..."
#    The root logger controls where these actually go (console, file, etc.).
log = logging.getLogger("cif_pipeline.batch")

# ── Define DATA_DIR: the absolute path to the data/ folder at the project root.
#    __file__ -> this file's path (e.g. E:\CIF-generator\cif_pipeline\batch_processor.py)
#    .resolve() -> converts to absolute path resolving any symlinks
#    .parent    -> cif_pipeline/  folder
#    .parent    -> project root (E:\CIF-generator\)
#    / "data"   -> E:\CIF-generator\data\   where .dat files will be saved
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# ── BENCHMARK_10_MATERIALS is the built-in test suite for the pipeline.
#    Each dict represents one compound to process. Keys:
#      "formula"     -> chemical formula string sent to the pipeline
#      "category"    -> human-readable material class label (for the .dat report)
#      "space_group" -> optional space-group hint to pass to the pipeline
#      "host"        -> (doped cases) the undoped parent formula
#      "dopant"      -> (doped cases) the substituting element symbol
#      "site"        -> (doped cases) which host-site element gets replaced
#      "fraction"    -> (doped cases) fraction of host sites that are replaced
#      "co_dopants"  -> (co-doped cases) list of additional dopant dicts
BENCHMARK_10_MATERIALS = [
    # Case 1 - Fe2O3 (Hematite): trigonal iron(III) oxide, classic ionic oxide.
    {"formula": "Fe2O3", "category": "Trigonal Oxide (Hematite)", "space_group": "R-3c"},

    # Case 2 - Ti-doped Fe2O3: 5% of Fe sites replaced by Ti (common photocatalyst modification).
    {"formula": "Fe1.9Ti0.1O3", "category": "Doped Oxide (Ti in Fe)", "host": "Fe2O3", "dopant": "Ti", "site": "Fe", "fraction": 0.05},

    # Case 3 - Ti+Cr co-doped Fe2O3: two simultaneous dopants to test co-doping logic.
    {"formula": "Fe1.85Ti0.1Cr0.05O3", "category": "Co-Doped Oxide", "host": "Fe2O3", "dopant": "Ti", "site": "Fe", "fraction": 0.05, "co_dopants": [{"dopant": "Cr", "site": "Fe", "fraction": 0.025}]},

    # Case 4 - TiO2 (Rutile): polymorphic oxide; tests that the pipeline picks the right polymorph.
    {"formula": "TiO2", "category": "Polymorphic Oxide (Rutile/Anatase)", "space_group": "P4_2/mnm"},

    # Case 5 - NaCl (Rock-salt): simple binary ionic halide; sanity-check for charge balance.
    {"formula": "NaCl", "category": "Rock-salt Halide", "space_group": "Fm-3m"},

    # Case 6 - Si (Diamond cubic): pure covalent semiconductor; no ions, no charge compensation.
    {"formula": "Si", "category": "Diamond Semiconductor", "space_group": "Fd-3m"},

    # Case 7 - Cu (FCC metal): pure metal; tests metallic material-class path.
    {"formula": "Cu", "category": "FCC Transition Metal", "space_group": "Fm-3m"},

    # Case 8 - Al2O3 (Corundum/Sapphire): rhombohedral oxide; tests R-3c space group handling.
    {"formula": "Al2O3", "category": "Corundum Rhombohedral", "space_group": "R-3c"},

    # Case 9 - MoS2: layered 2D dichalcogenide; tests hexagonal and layered structure support.
    {"formula": "MoS2", "category": "Layered 2D Dichalcogenide", "space_group": "P6_3/mmc"},

    # Case 10 - ZnO (Wurtzite): II-VI semiconductor; tests wurtzite hexagonal structure.
    {"formula": "ZnO", "category": "Wurtzite II-VI Semiconductor", "space_group": "P6_3mc"},

    # Case 11 - CaF2 (Fluorite): alkaline-earth fluoride; tests cubic fluorite structure.
    {"formula": "CaF2", "category": "Fluorite Alkaline-Earth Halide", "space_group": "Fm-3m"},
]


def _batch_ask_handler(question: str, options: Optional[List[str]] = None) -> Optional[str]:
    """
    Auto-answer handler used during batch runs to avoid the pipeline blocking
    on stdin waiting for a human response.

    In interactive mode the pipeline might pause and ask the user:
      'Ti has ambiguous oxidation state [3,4]. Which one?'
    In batch mode we never want a human prompt, so this function is passed
    as the ask_user callback and it always picks the FIRST available option
    automatically, then logs what it chose so the run is still traceable.

    Args:
        question: The question string the pipeline wants to ask.
        options:  List of valid option strings (e.g. ['vacancy_cation:Fe', 'redox:Fe']).

    Returns:
        The first option string, or None if no options list was given.
    """
    # If the pipeline gave us a list of choices, pick the first one automatically.
    if options:
        # Log which option was auto-selected so the batch run is auditable.
        # [:80] truncates the question to 80 chars so log lines do not overflow.
        log.info(f"[Batch] Auto-selected '{options[0]}' for: {question[:80]}")
        # Return the first option to the pipeline so it continues without pausing.
        return options[0]
    # If no options list was provided (open-ended question), return None.
    # The pipeline should use its own default or skip the clarification step.
    return None


def run_batch_pipeline(cases: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """
    Main entry point for batch processing.

    Iterates over a list of compound test cases, runs each one through the
    full CIF pipeline, records timing and success metrics, then writes a
    .dat data file and returns a summary dictionary.

    Args:
        cases: List of compound dicts (same schema as BENCHMARK_10_MATERIALS).
               If None, the built-in 11-material benchmark suite is used.

    Returns:
        A dict with keys:
          total_cases          -> how many compounds were attempted
          success_count        -> how many produced a valid CIF string
          failed_count         -> how many had no CIF output (errors)
          success_rate_percent -> success_count / total * 100
          total_time_seconds   -> wall-clock time for the entire batch
          results              -> list of per-case result dicts
          dat_file             -> filename of the written .dat report
    """
    # If the caller did not supply custom test cases, use the built-in benchmark list.
    if cases is None:
        cases = BENCHMARK_10_MATERIALS  # fall back to the 11 benchmark materials

    # Ensure the data/ directory exists before we try to write .dat files into it.
    # parents=True  -> also create any missing parent directories automatically
    # exist_ok=True -> do not raise an error if the directory already exists
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # results will accumulate one dict per compound after its pipeline run finishes.
    results = []

    # Record the wall-clock time before the first case starts.
    # This is used later to compute the total elapsed time for the whole batch.
    start_all = time.time()

    # Iterate over each test case.
    # enumerate(start=1) gives a 1-based index so the output report numbers
    # compounds 1, 2, 3 ... instead of 0, 1, 2 ...
    for idx, item in enumerate(cases, start=1):

        # Extract the chemical formula string from the test case dict.
        # Default to empty string "" if the "formula" key is missing.
        f = item.get("formula", "")

        # Extract the human-readable category label (e.g. "Trigonal Oxide").
        # Default to "General" if the "category" key is not specified.
        cat = item.get("category", "General")

        # Determine whether this is a doped compound.
        # True if either "dopant" or "host" key is present and non-empty.
        # bool() converts any truthy value (non-empty string) to True.
        is_doped = bool(item.get("dopant") or item.get("host"))

        # Placeholder for doping_spec -- currently unused here but kept for
        # future extension where a DopingSpec object might be built manually.
        doping_spec = None

        # Build a CompoundQuery Pydantic model from the test case dict.
        # CompoundQuery is the standard input object consumed by run_pipeline().
        q = CompoundQuery(
            # raw_input -> the formula string sent into the pipeline as the query
            raw_input=f,
            # is_doped_hint -> tells the pipeline to activate doping logic
            is_doped_hint=is_doped,
            # host_formula -> undoped parent material formula (e.g. "Fe2O3")
            host_formula=item.get("host"),
            # dopant_element -> element symbol being substituted (e.g. "Ti")
            dopant_element=item.get("dopant"),
            # host_site_species -> which host element is being replaced (e.g. "Fe")
            host_site_species=item.get("site"),
            # dopant_fraction -> fraction of host sites substituted (e.g. 0.05 = 5%)
            # float() cast ensures the value is a float, not a string.
            # If "fraction" key is absent, pass None so the pipeline uses its default.
            dopant_fraction=float(item.get("fraction")) if item.get("fraction") else None,
            # space_group -> optional crystal symmetry hint (e.g. "R-3c")
            space_group=item.get("space_group"),
            # co_dopants -> list of extra dopant dicts for co-doping cases.
            # Default to empty list [] if the "co_dopants" key is not present.
            co_dopants=item.get("co_dopants", []),
        )

        # Record the wall-clock start time for this individual compound's pipeline run.
        t0 = time.time()

        # Run the full CIF pipeline for this compound.
        # _batch_ask_handler is passed as the callback so any interactive questions
        # are answered automatically without blocking on stdin.
        # res is a PipelineResult object containing cif_string, matched_record, source, etc.
        res = run_pipeline(q, ask_user=_batch_ask_handler)

        # Compute how many seconds this compound's pipeline run took.
        elapsed = time.time() - t0

        # Get the length (number of characters) of the generated CIF string.
        # If cif_string is None (pipeline failed), default to 0.
        cif_len = len(res.cif_string) if res.cif_string else 0

        # Get the space group that was actually found/used during the run.
        # Priority: matched_record.space_group -> item's hint -> default "P 1"
        # matched_record is the Materials Project record that was used; may be None.
        sg_found = res.matched_record.space_group if res.matched_record else (item.get("space_group") or "P 1")

        # Get the data source label (e.g. "mp-api", "crystallm", "unknown").
        # Use "unknown" if res.source is None or empty.
        source = res.source or "unknown"

        # Append this compound's results to the results list as a flat dict.
        results.append({
            "index": idx,                          # 1-based position in the batch
            "formula": f,                          # chemical formula string
            "category": cat,                       # material class label
            "success": bool(res.cif_string),       # True if a CIF was produced
            "source": source,                      # where the structure came from
            "space_group": sg_found,               # space group of the result
            "cif_chars": cif_len,                  # byte/char count of the CIF text
            "elapsed_seconds": round(elapsed, 3),  # time taken, rounded to 3 decimal places
            "cif_string": res.cif_string,          # the full raw CIF text (may be None)
        })

    # Compute total wall-clock time for the whole batch run.
    # round(..., 2) gives 2 decimal places (e.g. 47.53 seconds).
    total_time = round(time.time() - start_all, 2)

    # Count how many compounds succeeded (have a non-None/non-empty CIF string).
    # sum() counts True values; r["success"] is already a bool from bool() above.
    success_count = sum(1 for r in results if r["success"])

    # Build the file path for the output .dat report file.
    # DATA_DIR / "batch_test_cases.dat" resolves to e.g.:
    #   E:\CIF-generator\data\batch_test_cases.dat
    dat_path = DATA_DIR / "batch_test_cases.dat"

    # Write the formatted .dat file to disk using the helper function below.
    write_dat_file(dat_path, results, total_time)

    # Return the batch summary dictionary to the caller (e.g. the FastAPI endpoint).
    return {
        # Total number of test cases that were attempted in this batch run.
        "total_cases": len(results),

        # How many test cases produced a valid (non-empty) CIF string.
        "success_count": success_count,

        # How many test cases failed (no CIF was produced).
        "failed_count": len(results) - success_count,

        # Success rate as a percentage rounded to 1 decimal place.
        # Guard against division-by-zero if the results list is somehow empty.
        "success_rate_percent": round((success_count / len(results)) * 100, 1) if results else 0,

        # Total elapsed wall-clock time for all cases combined (in seconds).
        "total_time_seconds": total_time,

        # Full list of per-case result dicts -- one entry per compound processed.
        "results": results,

        # Just the filename (not the full path) of the written .dat file.
        "dat_file": str(dat_path.name),
    }


def write_dat_file(filepath: Path, results: List[Dict[str, Any]], total_time: float):
    """
    Writes a standardized scientific .dat column file to disk.

    The output format uses fixed-width columns with a comment-line header
    (lines starting with '#'), compatible with gnuplot, matplotlib, and
    most scientific data parsers. Lines without '#' are data rows.

    Args:
        filepath:   A pathlib.Path where the .dat file should be written.
        results:    List of per-case result dicts from run_batch_pipeline().
        total_time: Total elapsed seconds for the full batch run.
    """
    # Build the file content as a list of strings (one per line).
    # We will join them with '\n' at the very end using filepath.write_text().
    lines = [
        # Separator line: a row of '=' characters to visually frame the header block.
        "# ==========================================================================",

        # Title line: identifies the tool name and the type of data file.
        "# CIF ARCHITECT v2.0 -- Scientific Benchmark Batch Data (.dat)",

        # Timestamp line: UTC time the file was generated.
        # time.gmtime() gives the current UTC time as a struct_time object.
        # time.strftime(...) formats it as a human-readable "YYYY-MM-DD HH:MM:SS UTC" string.
        f"# Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}",

        # Summary line: shows total number of cases and total wall-clock time.
        f"# Total Cases: {len(results)} | Total Time: {total_time:.2f}s",

        # Column legend: describes what each data column in the file contains.
        "# Columns: Index  Formula  Category  Success  Source  SpaceGroup  CifBytes  TimeSec",

        # Closing separator line that ends the comment header block.
        "# ==========================================================================",

        # Column header row -- NOT prefixed with '#' so data parsers treat it as labels.
        # :<6 means left-align in a field of width 6 chars, :<20 means width 20, etc.
        f"{'Index':<6} {'Formula':<20} {'Success':<8} {'Source':<18} {'SpaceGroup':<14} {'CifBytes':<10} {'TimeSec':<8} Category",

        # Horizontal divider: 100 dash characters to visually separate header from data rows.
        "-" * 100,
    ]

    # Iterate over each compound's result dict to write one formatted data row per compound.
    for r in results:
        # Convert the boolean success value to "1" (success) or "0" (failure)
        # so downstream tools (gnuplot, numpy, etc.) can treat it as a numeric column.
        succ = "1" if r["success"] else "0"

        # Append one fixed-width formatted data line to the lines list.
        # Each f-string placeholder uses :<N to left-align within N characters:
        #   r['index']           -> 1-based case number,       6  chars wide
        #   r['formula']         -> chemical formula string,   20 chars wide
        #   succ                 -> "1" or "0" success flag,    8  chars wide
        #   r['source']          -> data source label,          18 chars wide
        #   r['space_group']     -> space group symbol,         14 chars wide
        #   r['cif_chars']       -> CIF file character count,   10 chars wide
        #   r['elapsed_seconds'] -> pipeline time in seconds,    8  chars wide (:.3f = 3 decimals)
        #   r['category']        -> material class label, no fixed width (last column, no padding)
        lines.append(
            f"{r['index']:<6} {r['formula']:<20} {succ:<8} {r['source']:<18} {str(r['space_group']):<14} {r['cif_chars']:<10} {r['elapsed_seconds']:<8.3f} {r['category']}"
        )

    # Append an end-of-file marker comment so tools can detect truncated/incomplete files.
    lines.append("# EOF\n")

    # Join all lines with newline characters to form the full file content string,
    # then write it to disk at the given filepath.
    # encoding="utf-8" ensures special characters (subscripts, unicode symbols) are handled.
    filepath.write_text("\n".join(lines), encoding="utf-8")

    # Emit an INFO log message so the operator knows the file was written and where.
    log.info(f"Wrote batch data file: {filepath}")
