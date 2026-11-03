#!/usr/bin/env python3
"""env_split.py - for each .py file in the project, work out which of two Python
environments it can run in, by following its imports (through your own local
modules too) and comparing them with what each environment really has installed.

Run from the project root with any Python 3.8+ (the newest one parses best):

  python env_split.py --env-a <python.exe of the 3.11 env> --env-b <python.exe of the 3.13 env>

It only READS files. It never imports your code and never installs anything.
Writes ENV_SPLIT_REPORT.md and env_split.csv into --out (default: current folder).
"""
import argparse
import ast
import csv
import json
import os
import re
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path

# Runs INSIDE each environment: lists what it has, and checks every file compiles there.
PROBE = r'''
import sys, json, pkgutil
import importlib.metadata as md
files = json.load(sys.stdin)
have = {m.name for m in pkgutil.iter_modules()}
try:
    have |= set(md.packages_distributions())
except Exception:
    pass
bad = {}
for f in files:
    try:
        with open(f, "rb") as fh:
            compile(fh.read(), f, "exec", dont_inherit=True)
    except (SyntaxError, ValueError, RecursionError) as e:
        bad[f] = (type(e).__name__ + ": " + str(e))[:100]
print(json.dumps({"version": ".".join(map(str, sys.version_info[:3])),
                  "tag": sys.implementation.cache_tag, "exe": sys.executable,
                  "stdlib": sorted(sys.stdlib_module_names),
                  "installed": sorted(have), "bad": bad}))
'''

DEFAULT_SKIP = {"node_modules", ".git", "dist", "build", "__pycache__",
                "site-packages", "__MACOSX", "skill-creator"}


def python_cmd(arg):
    p = Path(arg)
    if p.is_dir():  # allow the venv folder itself
        for cand in (p / "Scripts" / "python.exe", p / "bin" / "python"):
            if cand.exists():
                return [str(cand)]
    if p.exists():
        return [str(p)]
    return arg.split()  # e.g. "py -3.11"


def run_probe(arg, files):
    try:
        r = subprocess.run(python_cmd(arg) + ["-I", "-c", PROBE], input=json.dumps(files),
                           text=True, capture_output=True)
    except OSError as e:
        sys.exit("Cannot start Python from '%s' (%s).\nGive the full path to python.exe inside the "
                 "environment, e.g. C:\\path\\to\\venv311\\Scripts\\python.exe, or the venv folder." % (arg, e))
    if r.returncode != 0 or not r.stdout.strip():
        sys.exit("Could not run %s\n%s" % (arg, r.stderr[-600:]))
    d = json.loads(r.stdout.strip().splitlines()[-1])
    d["stdlib"], d["installed"] = set(d["stdlib"]), set(d["installed"])
    return d


def collect(root, skip):
    out = []
    for dp, dns, fns in os.walk(root):
        dns[:] = sorted(d for d in dns if d not in skip and not d.startswith(".")
                        and not (Path(dp) / d / "pyvenv.cfg").exists())  # skips any venv
        out += [Path(dp) / f for f in sorted(fns) if f.endswith(".py")]
    return out


class ImportScan(ast.NodeVisitor):
    """kind: hard = needed at import time, soft = inside try/except ImportError,
    lazy = inside a function (only needed when it is called)."""

    def __init__(self):
        self.items, self.func, self.soft = [], 0, 0

    def kind(self):
        return "soft" if self.soft else ("lazy" if self.func else "hard")

    def visit_FunctionDef(self, n):
        self.func += 1
        self.generic_visit(n)
        self.func -= 1

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_Try(self, n):
        catches = any(h.type is None or any(x in ast.dump(h.type) for x in
                      ("ImportError", "ModuleNotFoundError", "Exception")) for h in n.handlers)
        if catches:
            self.soft += 1
            for s in list(n.body) + list(n.handlers):
                self.visit(s)
            self.soft -= 1
            for s in list(n.orelse) + list(n.finalbody):
                self.visit(s)
        else:
            self.generic_visit(n)

    visit_TryStar = visit_Try

    def visit_If(self, n):
        t = n.test
        if (isinstance(t, ast.Name) and t.id == "TYPE_CHECKING") or \
           (isinstance(t, ast.Attribute) and t.attr == "TYPE_CHECKING"):
            for s in n.orelse:
                self.visit(s)
            return
        self.generic_visit(n)

    def visit_Import(self, n):
        for a in n.names:
            self.items.append((self.kind(), 0, a.name, ()))

    def visit_ImportFrom(self, n):
        self.items.append((self.kind(), n.level, n.module or "", tuple(a.name for a in n.names)))


def scan(path):
    raw = path.read_bytes()
    text = raw.decode("utf-8", "ignore")
    is_app = bool(re.search(r"\bFastAPI\s*\(", text))
    try:
        tree = ast.parse(raw, filename=str(path))
    except (SyntaxError, ValueError, RecursionError) as e:
        return None, "%s: %s" % (type(e).__name__, str(e)[:80]), is_app
    v = ImportScan()
    v.visit(tree)
    return v.items, "", is_app


def resolve(root, parts):
    """Walk dotted parts below root. Returns (files_touched, ok, package_dir_or_None)."""
    files, p = [], root
    for i, part in enumerate(parts):
        d = p / part
        if (d / "__init__.py").is_file():
            files.append(d / "__init__.py")
            p = d
        elif d.is_dir() and any(d.glob("*.py")):  # namespace-style folder
            p = d
        elif (p / (part + ".py")).is_file():
            files.append(p / (part + ".py"))
            return files, i == len(parts) - 1, None
        else:
            return files, False, None
    return files, True, p


def local_root(roots, top):
    for r in roots:
        d = r / top
        if (d / "__init__.py").is_file() or (r / (top + ".py")).is_file() or \
           (d.is_dir() and any(d.glob("*.py"))):
            return r
    return None


def analyse(path, items, global_roots, common_stdlib):
    local, third, unresolved = defaultdict(set), defaultdict(set), set()
    roots = [path.parent] + global_roots

    def add_names(pkg, names, kind):
        if pkg is None:
            return
        for n in names:
            fs, ok, _ = resolve(pkg, [n])
            if ok:
                local[kind].update(fs)

    for kind, level, module, names in items:
        if level:
            base = path.parent
            for _ in range(level - 1):
                base = base.parent
            parts = module.split(".") if module else []
            if parts:
                fs, ok, pkg = resolve(base, parts)
            else:
                fs, ok, pkg = ([base / "__init__.py"] if (base / "__init__.py").is_file() else []), True, base
            if not ok:
                unresolved.add("." * level + module)
            local[kind].update(fs)
            add_names(pkg, names, kind)
            continue
        parts = module.split(".")
        top = parts[0]
        r = local_root(roots, top)
        if r is None:
            if top not in common_stdlib:
                third[kind].add(top)
            continue
        fs, ok, pkg = resolve(r, parts)
        if not ok:
            unresolved.add(module)
        local[kind].update(fs)
        add_names(pkg, names, kind)
    return local, third, unresolved


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--env-a", required=True, help="python.exe (or venv folder) of environment A")
    ap.add_argument("--env-b", required=True, help="python.exe (or venv folder) of environment B")
    ap.add_argument("--root", default=".", help="project root (default: current folder)")
    ap.add_argument("--roots", nargs="*", default=["backend"],
                    help="extra import roots, relative to --root (default: backend)")
    ap.add_argument("--skip", nargs="*", default=[], help="extra folder names to ignore")
    ap.add_argument("--strict", action="store_true",
                    help="also count imports inside functions / try-except as required")
    ap.add_argument("--list-both", action="store_true", help="list every 'both' file in the report")
    ap.add_argument("--out", default=".", help="where to write the report and CSV")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    files = collect(root, DEFAULT_SKIP | set(args.skip))
    rel = lambda p: p.relative_to(root).as_posix()
    if not files:
        sys.exit("No .py files found under %s" % root)

    A = run_probe(args.env_a, [str(f) for f in files])
    B = run_probe(args.env_b, [str(f) for f in files])
    la, lb = "py" + A["version"].replace(".", "")[:3], "py" + B["version"].replace(".", "")[:3]
    if la == lb:
        la, lb = la + "-A", lb + "-B"
    common = A["stdlib"] & B["stdlib"]
    glob_roots = [root / r for r in args.roots if (root / r).is_dir()] + [root]

    info, parse_err, is_app = {}, {}, {}
    for f in files:
        items, err, app = scan(f)
        is_app[f] = app
        if items is None:
            parse_err[f] = err
            items = []
        info[f] = analyse(f, items, glob_roots, common)

    hard_edges, req, opt, unres = {}, {}, {}, {}
    for f, (local, third, un) in info.items():
        if args.strict:
            hard_edges[f] = set().union(*local.values()) if local else set()
            req[f] = set().union(*third.values()) if third else set()
            opt[f] = set()
        else:
            hard_edges[f] = set(local.get("hard", set()))
            req[f] = set(third.get("hard", set()))
            opt[f] = set(third.get("soft", set())) | set(third.get("lazy", set()))
        unres[f] = un

    def reach_of(f):
        seen, stack = {f}, [f]
        while stack:
            for y in hard_edges.get(stack.pop(), ()):
                if y not in seen:
                    seen.add(y)
                    stack.append(y)
        return seen

    def miss_in(env, names, reach):
        m = {n for n in names if n not in env["stdlib"] and n not in env["installed"]}
        m |= {"SYNTAX(%s)" % rel(x) for x in reach if str(x) in env["bad"]}
        return m

    rows, needed_by = [], defaultdict(set)
    for f in files:
        reach = reach_of(f)
        rq = set().union(*(req.get(x, set()) for x in reach))
        ro = set().union(*(opt.get(x, set()) for x in reach)) - rq
        ma, mb = miss_in(A, rq, reach), miss_in(B, rq, reach)
        oa, ob = miss_in(A, ro, set()), miss_in(B, ro, set())
        if f in parse_err and not ma and not mb:
            cls = "unknown"
        else:
            cls = "both" if not ma and not mb else ("A-only" if not ma else ("B-only" if not mb else "neither"))
        for n in rq:
            needed_by[n].add(f)
        pyc = [t for t, tag in (("A", A["tag"]), ("B", B["tag"]))
               if (f.parent / "__pycache__" / ("%s.%s.pyc" % (f.stem, tag))).exists()]
        rows.append(dict(file=rel(f), cls=cls, miss_a=sorted(ma), miss_b=sorted(mb),
                         opt_a=sorted(oa), opt_b=sorted(ob), pyc="+".join(pyc),
                         unresolved=sorted(unres[f]), parse=parse_err.get(f, ""), app=is_app[f]))

    counts = Counter(r["cls"] for r in rows)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    with open(out / "env_split.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["file", "class", "missing_in_" + la, "missing_in_" + lb,
                    "optional_missing_in_" + la, "optional_missing_in_" + lb,
                    "pyc_seen_under", "unresolved_local_imports", "parse_error_under_runner"])
        for r in rows:
            w.writerow([r["file"], r["cls"], " ".join(r["miss_a"]), " ".join(r["miss_b"]),
                        " ".join(r["opt_a"]), " ".join(r["opt_b"]), r["pyc"],
                        " ".join(r["unresolved"]), r["parse"]])

    drivers = []
    for n, fs in needed_by.items():
        ina = n in A["stdlib"] or n in A["installed"]
        inb = n in B["stdlib"] or n in B["installed"]
        if ina != inb:
            drivers.append((len(fs), n, la if ina else lb))
    drivers.sort(reverse=True)

    L = ["# Environment split report", "",
         "- **A** = `%s` (Python %s, bytecode tag `%s`)" % (A["exe"], A["version"], A["tag"]),
         "- **B** = `%s` (Python %s, bytecode tag `%s`)" % (B["exe"], B["version"], B["tag"]),
         "- Files analysed: %d | mode: %s" % (len(rows), "strict (lazy and optional imports count)" if args.strict
                                              else "normal (only import-time imports count)"),
         "- Labels: **A-only** = runs in %s but not %s; **B-only** = the reverse; **both** = runs in either; "
         "**neither** = missing something in both." % (la, lb), "",
         "## Summary", "", "| class | files |", "|---|---|"]
    L += ["| %s | %d |" % (k, counts.get(k, 0)) for k in ("A-only", "B-only", "both", "neither", "unknown")]

    L += ["", "## What forces the split",
          "Packages (or stdlib modules) the project imports that exist in only one environment.", ""]
    if drivers:
        L += ["| package | only in | files that need it |", "|---|---|---|"]
        L += ["| %s | %s | %d |" % (n, where, c) for c, n, where in drivers]
    else:
        L += ["None found. Every imported package exists in both environments, so one environment may be enough."]

    by_folder = defaultdict(Counter)
    for r in rows:
        key = "/".join(Path(r["file"]).parent.parts[:2]) or "."
        by_folder[key][r["cls"]] += 1
    L += ["", "## By folder", "", "| folder | A-only | B-only | both | neither |", "|---|---|---|---|---|"]
    for k in sorted(by_folder):
        c = by_folder[k]
        L.append("| %s | %d | %d | %d | %d |" % (k, c["A-only"], c["B-only"], c["both"], c["neither"]))

    def section(title, cls, note):
        sel = [r for r in rows if r["cls"] == cls]
        L.extend(["", "## %s (%d)" % (title, len(sel)), note, ""])
        for r in sel:
            why = ""
            if cls == "A-only":
                why = " - missing in %s: %s" % (lb, ", ".join(r["miss_b"]))
            elif cls == "B-only":
                why = " - missing in %s: %s" % (la, ", ".join(r["miss_a"]))
            elif cls == "neither":
                why = " - missing in %s: %s | in %s: %s" % (la, ", ".join(r["miss_a"]), lb, ", ".join(r["miss_b"]))
            L.append("- `%s`%s" % (r["file"], why))

    section("Runs in A only (%s)" % la, "A-only", "These need something that %s does not have." % lb)
    section("Runs in B only (%s)" % lb, "B-only", "These need something that %s does not have." % la)
    section("Runs in neither", "neither",
            "Check these first. Often a path hack (sys.path.insert), a module outside the import roots, "
            "or a package nobody installed yet.")
    sel = [r for r in rows if r["cls"] == "both"]
    L += ["", "## Runs in both (%d)" % len(sel), ""]
    if args.list_both:
        L += ["- `%s`" % r["file"] for r in sel]
    else:
        L += ["(Counts per folder are in the table above. Re-run with --list-both to list every file.)"]
    sel = [r for r in rows if r["cls"] == "unknown"]
    if sel:
        L += ["", "## Could not read imports (%d)" % len(sel),
              "The Python running this script could not parse them. Re-run using the newest Python.", ""]
        L += ["- `%s` - %s" % (r["file"], r["parse"]) for r in sel]

    apps = [r for r in rows if r["app"]]
    if apps:
        L += ["", "## FastAPI app files", ""] + ["- `%s` -> %s" % (r["file"], r["cls"]) for r in apps]

    clash = [r for r in rows if (r["cls"] == "A-only" and "B" in r["pyc"]) or (r["cls"] == "B-only" and "A" in r["pyc"])]
    L += ["", "## Bytecode (.pyc) evidence that disagrees with the result (%d)" % len(clash),
          "A .pyc is written when a file is compiled, before it runs, so this does not prove it ran fine "
          "there. It does show the file was loaded under that version at some point.", ""]
    L += ["- `%s` classed %s but a %s .pyc exists" % (r["file"], r["cls"], lb if r["cls"] == "A-only" else la)
          for r in clash] or ["None."]

    ur = [r for r in rows if r["unresolved"]]
    if ur:
        L += ["", "## Local imports that point at files that do not exist (%d files)" % len(ur), ""]
        L += ["- `%s`: %s" % (r["file"], ", ".join(r["unresolved"])) for r in ur[:60]]

    (out / "ENV_SPLIT_REPORT.md").write_text("\n".join(L) + "\n", encoding="utf-8")

    print("A = %s (%s)   B = %s (%s)" % (la, A["version"], lb, B["version"]))
    print("files: %d   A-only: %d   B-only: %d   both: %d   neither: %d   unknown: %d" % (
        len(rows), counts["A-only"], counts["B-only"], counts["both"], counts["neither"], counts["unknown"]))
    for c, n, where in drivers[:8]:
        print("  %-22s only in %-8s needed by %d files" % (n, where, c))
    print("wrote %s and %s" % (out / "ENV_SPLIT_REPORT.md", out / "env_split.csv"))


if __name__ == "__main__":
    main()

