"""
cif_pipeline/provenance.py
==========================
Structured run provenance logger (Phase 0 requirement).

Every pipeline run writes a `run.json` containing:
  - input string and parsed spec
  - all decisions made and their sources
  - random seeds used
  - package versions and model checkpoint hashes
  - timestamps (start, end, elapsed)
  - output files produced

Usage
-----
    from cif_pipeline.provenance import RunLog

    log = RunLog(input_str="NiFe2O4", basis="per_formula_unit")
    log.decision("site_Ni", value="B", source="literature:neutron", ref="Bhowmik2008")
    log.seed("placement", 42)
    log.output_file("nife2o4_ordered.cif")
    log.finish()
    log.save("run_001.json")
"""

from __future__ import annotations

import json
import os
import platform
import hashlib
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _collect_versions() -> Dict[str, str]:
    versions: Dict[str, str] = {"python": platform.python_version()}
    _pkgs = [
        ("pymatgen", "pymatgen.core"),
        ("ase", "ase"),
        ("numpy", "numpy"),
        ("scipy", "scipy"),
        ("spglib", "spglib"),
        ("chgnet", "chgnet"),
        ("torch", "torch"),
        ("mace", "mace"),
    ]
    for name, mod_path in _pkgs:
        try:
            import importlib
            mod = importlib.import_module(mod_path)
            versions[name] = getattr(mod, "__version__", "unknown")
        except ImportError:
            versions[name] = "not_installed"
    return versions


def _hash_file_md5(path: str) -> str:
    if not os.path.isfile(path):
        return "not_found"
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _collect_mace_checkpoints() -> Dict[str, str]:
    cache_dir = os.path.expanduser("~/.cache/mace")
    result: Dict[str, str] = {}
    if os.path.isdir(cache_dir):
        for fn in os.listdir(cache_dir):
            fp = os.path.join(cache_dir, fn)
            if os.path.isfile(fp):
                result[fn] = _hash_file_md5(fp)
    return result


class RunLog:
    """
    Accumulates structured provenance for one pipeline invocation.

    Parameters
    ----------
    input_str : str
        Raw formula or request string as received (e.g. "Zn0.05Ni0.95Fe2O4").
    basis : str
        Interpretation basis: "per_formula_unit" | "site_fraction" | "mass_fraction".
    run_id : str, optional
        Human-readable run identifier. Defaults to a timestamp string.
    """

    def __init__(
        self,
        input_str: str,
        basis: str = "per_formula_unit",
        run_id: Optional[str] = None,
    ) -> None:
        self._start_ts = time.monotonic()
        self._start_wall = datetime.now(timezone.utc).isoformat()

        self.run_id = run_id or datetime.now(timezone.utc).strftime("run_%Y%m%dT%H%M%SZ")
        self._data: Dict[str, Any] = {
            "run_id": self.run_id,
            "start_utc": self._start_wall,
            "end_utc": None,
            "elapsed_s": None,
            "input": {
                "formula_str": input_str,
                "basis": basis,
            },
            "interpreted_spec": None,
            "decisions": [],
            "seeds": {},
            "flags": [],
            "scenarios": [],
            "output_files": [],
            "errors": [],
            "env": {
                "versions": _collect_versions(),
                "mace_checkpoints": _collect_mace_checkpoints(),
                "hostname": platform.node(),
                "platform": platform.platform(),
            },
        }

    def set_spec(self, spec: Dict[str, Any]) -> None:
        """Record the interpreted sublattice specification."""
        self._data["interpreted_spec"] = spec

    def decision(
        self,
        key: str,
        value: Any,
        source: str,
        ref: str = "",
        confidence: str = "high",
        note: str = "",
    ) -> None:
        """
        Record a site/chemistry decision.

        source: "user" | "literature:<technique>" | "heuristic:<rule>" | "model:<name>"
        confidence: "high" | "medium" | "low" | "undecided"
        """
        self._data["decisions"].append(
            {
                "key": key,
                "value": value,
                "source": source,
                "ref": ref,
                "confidence": confidence,
                "note": note,
            }
        )

    def seed(self, purpose: str, value: int) -> None:
        """Record a random seed used in this run (for reproducibility)."""
        self._data["seeds"][purpose] = value

    def flag(self, code: str, message: str, severity: str = "warning") -> None:
        """Attach a chemistry/geometry flag. severity: 'info'|'warning'|'error'"""
        self._data["flags"].append(
            {"code": code, "message": message, "severity": severity}
        )

    def scenario(self, label: str, spec: Dict[str, Any]) -> None:
        """Record one scenario (e.g. one inversion parameter value)."""
        self._data["scenarios"].append({"label": label, "spec": spec})

    def output_file(self, path: str, description: str = "") -> None:
        """Record an output file path with optional MD5 hash if file exists."""
        entry: Dict[str, Any] = {
            "path": os.path.abspath(path) if path else path,
            "description": description,
        }
        if os.path.isfile(path):
            entry["md5"] = _hash_file_md5(path)
            entry["size_bytes"] = os.path.getsize(path)
        self._data["output_files"].append(entry)

    def error(self, exc: Exception, context: str = "") -> None:
        """Record a non-fatal error/exception."""
        self._data["errors"].append(
            {"context": context, "type": type(exc).__name__, "message": str(exc)}
        )

    def finish(self) -> None:
        """Stamp the end time and elapsed seconds."""
        elapsed = time.monotonic() - self._start_ts
        self._data["end_utc"] = datetime.now(timezone.utc).isoformat()
        self._data["elapsed_s"] = round(elapsed, 3)

    def save(self, path: str) -> str:
        """Serialise the log to JSON at `path`. Returns the absolute path written."""
        if self._data["end_utc"] is None:
            self.finish()
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        abs_path = os.path.abspath(path)
        with open(abs_path, "w", encoding="utf-8") as f:
            json.dump(self._data, f, indent=2, default=str)
        return abs_path

    def as_dict(self) -> Dict[str, Any]:
        """Return the current log data as a plain dict."""
        return dict(self._data)

    def __repr__(self) -> str:  # pragma: no cover
        n_dec = len(self._data["decisions"])
        n_flag = len(self._data["flags"])
        return (
            f"<RunLog id={self.run_id!r} "
            f"input={self._data['input']['formula_str']!r} "
            f"decisions={n_dec} flags={n_flag}>"
        )
