// src/pages/materials/MaterialsSearchPage.tsx
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Columns3, Download, Filter, RotateCcw, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PeriodicTable from "../../components/PeriodicTable";
import { MaterialRecord, searchDatasetMaterials } from "../../lib/datasetapi";

/* ---------- column configuration ---------- */

type ColumnKey =
  | "mv_id"
  | "Formula"
  | "nsites"
  | "e_hull"
  | "formation_energy"
  | "band_gap"
  | "bulk_modulus"
  | "shear_modulus"
  | "ionic_conductivity"
  | "activation_energy"
  | "migration_barrier"
  | "metal_prob";

type Comparator = ">=" | "<=" | "=" | ">" | "<";

interface NumericFilterState {
  comparator: Comparator;
  value: string;
}

interface ColumnDef {
  key: ColumnKey;
  label: string;
  type: "text" | "number";
  accessor: (m: MaterialRecord) => number | string | null;
  format: (m: MaterialRecord) => string;
  backendFilter?: boolean;
  /** color-scale used to render this cell as a colorful badge */
  colorScale?: "goodLow" | "goodHigh" | "neutral";
}

function num(value: number | null | undefined) {
  return value === null || value === undefined || Number.isNaN(value)
    ? null
    : value;
}

const COLUMNS: ColumnDef[] = [
  {
    key: "mv_id",
    label: "Material ID",
    type: "text",
    accessor: (m) => m.mv_id ?? "",
    format: (m) => m.mv_id ?? "N/A",
  },
  {
    key: "Formula",
    label: "Formula",
    type: "text",
    accessor: (m) => m.Formula ?? "",
    format: (m) => m.Formula ?? "N/A",
  },
  {
    key: "nsites",
    label: "Sites",
    type: "number",
    accessor: (m) => num(m.nsites),
    format: (m) => (num(m.nsites) === null ? "N/A" : String(m.nsites)),
    colorScale: "neutral",
  },
  {
    key: "e_hull",
    label: "E Above Hull (eV/atom)",
    type: "number",
    accessor: (m) => num(m["E_hull-m (eV/atom)"]),
    format: (m) => {
      const v = num(m["E_hull-m (eV/atom)"]);
      return v === null ? "N/A" : v.toFixed(3);
    },
    backendFilter: true,
    colorScale: "goodLow", // Lower = stable
  },
  {
    key: "formation_energy",
    label: "Formation Energy (eV/atom)",
    type: "number",
    accessor: (m) => num(m["Form. Energy E_f (eV/atom)"]),
    format: (m) => {
      const v = num(m["Form. Energy E_f (eV/atom)"]);
      return v === null ? "N/A" : v.toFixed(3);
    },
    colorScale: "goodLow",
  },
  {
    key: "ionic_conductivity",
    label: "Ionic Cond. (mS/cm)",
    type: "number",
    accessor: (m) =>
      num(m["Ionic Conductivity (mS/cm)"] ?? m.ionic_conductivity),
    format: (m) => {
      const v = num(m["Ionic Conductivity (mS/cm)"] ?? m.ionic_conductivity);
      return v === null ? "N/A" : v.toExponential(2);
    },
    colorScale: "goodHigh", // Higher = better conductor
  },
  {
    key: "activation_energy",
    label: "Activation Energy (eV)",
    type: "number",
    accessor: (m) => num(m["Activation Energy Ea (eV)"] ?? m.activation_energy),
    format: (m) => {
      const v = num(m["Activation Energy Ea (eV)"] ?? m.activation_energy);
      return v === null ? "N/A" : v.toFixed(2);
    },
    colorScale: "goodLow", // Lower Ea = faster ion diffusion
  },
  {
    key: "migration_barrier",
    label: "Migration Barrier (eV)",
    type: "number",
    accessor: (m) => num(m["Migration Barrier (eV)"] ?? m.migration_barrier),
    format: (m) => {
      const v = num(m["Migration Barrier (eV)"] ?? m.migration_barrier);
      return v === null ? "N/A" : v.toFixed(2);
    },
    colorScale: "goodLow",
  },
  {
    key: "band_gap",
    label: "Band Gap (eV)",
    type: "number",
    accessor: (m) => num(m["Band Gap E_g (eV)"]),
    format: (m) => {
      const v = num(m["Band Gap E_g (eV)"]);
      return v === null ? "N/A" : v.toFixed(2);
    },
    backendFilter: true,
    colorScale: "neutral",
  },
  {
    key: "bulk_modulus",
    label: "Bulk Modulus (GPa)",
    type: "number",
    accessor: (m) => num(m["Bulk Modulus K (GPa)"]),
    format: (m) => {
      const v = num(m["Bulk Modulus K (GPa)"]);
      return v === null ? "N/A" : v.toFixed(1);
    },
    colorScale: "goodHigh",
  },
  {
    key: "shear_modulus",
    label: "Shear Modulus (GPa)",
    type: "number",
    accessor: (m) => num(m["Shear Modulus G (GPa)"]),
    format: (m) => {
      const v = num(m["Shear Modulus G (GPa)"]);
      return v === null ? "N/A" : v.toFixed(1);
    },
    colorScale: "goodHigh",
  },
  {
    key: "metal_prob",
    label: "Metal Prob.",
    type: "number",
    accessor: (m) => num(m["Metal Prob."]),
    format: (m) => {
      const v = num(m["Metal Prob."]);
      return v === null ? "N/A" : `${(v * 100).toFixed(0)}%`;
    },
    colorScale: "neutral",
  },
];

function compare(value: number, comparator: Comparator, target: number) {
  switch (comparator) {
    case ">=":
      return value >= target;
    case "<=":
      return value <= target;
    case "=":
      return value === target;
    case ">":
      return value > target;
    case "<":
      return value < target;
  }
}

/** Returns tailwind classes for colorful badges based on column domain logic. */
function badgeClasses(col: ColumnDef, m: MaterialRecord): string {
  const base =
    "inline-flex items-center justify-center px-2 py-0.5 rounded-md font-semibold text-[11px]";
  if (col.type !== "number" || !col.colorScale) return "";
  const value = col.accessor(m);
  if (typeof value !== "number") return `${base} bg-[#F1F2F4] text-[#8C929C]`;

  if (col.key === "e_hull") {
    if (value <= 0.01) return `${base} bg-[#DFF5E1] text-[#1E7B34]`;
    if (value <= 0.05) return `${base} bg-[#FFF1CF] text-[#9A6A00]`;
    return `${base} bg-[#FDE4E1] text-[#B3261E]`;
  }
  if (col.key === "formation_energy") {
    if (value <= -1.5) return `${base} bg-[#DFF5E1] text-[#1E7B34]`;
    if (value <= 0) return `${base} bg-[#FFF1CF] text-[#9A6A00]`;
    return `${base} bg-[#FDE4E1] text-[#B3261E]`;
  }
  if (col.key === "ionic_conductivity") {
    if (value >= 1.0) return `${base} bg-[#DFF5E1] text-[#1E7B34]`; // ≥ 1 mS/cm is excellent
    if (value >= 0.1) return `${base} bg-[#FFF1CF] text-[#9A6A00]`;
    return `${base} bg-[#F1F2F4] text-[#5F6771]`;
  }
  if (col.key === "activation_energy" || col.key === "migration_barrier") {
    if (value <= 0.35) return `${base} bg-[#DFF5E1] text-[#1E7B34]`; // Low barrier
    if (value <= 0.5) return `${base} bg-[#FFF1CF] text-[#9A6A00]`;
    return `${base} bg-[#FDE4E1] text-[#B3261E]`;
  }
  if (col.key === "bulk_modulus" || col.key === "shear_modulus") {
    if (value >= 100) return `${base} bg-[#DFF5E1] text-[#1E7B34]`;
    if (value >= 40) return `${base} bg-[#FFF1CF] text-[#9A6A00]`;
    return `${base} bg-[#F1F2F4] text-[#5F6771]`;
  }
  if (col.key === "metal_prob") {
    if (value >= 0.66) return `${base} bg-[#E3ECFC] text-[#1D4FA3]`;
    if (value >= 0.33) return `${base} bg-[#FFF1CF] text-[#9A6A00]`;
    return `${base} bg-[#F1F2F4] text-[#5F6771]`;
  }
  return `${base} bg-[#FAF4EE] text-[#1E2227]`;
}

export default function MaterialsSearchPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [includeElements, setIncludeElements] = useState<string[]>(
    params.getAll("elements"),
  );
  const [excludeElements, setExcludeElements] = useState<string[]>(
    params.getAll("exclude_elements"),
  );
  const [selectionMode, setSelectionMode] = useState<"include" | "exclude">(
    "include",
  );
  const [minBandGap, setMinBandGap] = useState("");
  const [maxBandGap, setMaxBandGap] = useState("");
  const [minHull, setMinHull] = useState("");
  const [maxHull, setMaxHull] = useState("");

  const [page, setPage] = useState(1);
  const limit = 100;

  const [submitted, setSubmitted] = useState(
    () =>
      Boolean(params.get("q")) ||
      params.getAll("elements").length > 0 ||
      params.getAll("exclude_elements").length > 0,
  );

  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldScrollToResultsRef = useRef(false);
  const [searchNonce, setSearchNonce] = useState(0);

  const [hiddenColumns, setHiddenColumns] = useState<Set<ColumnKey>>(new Set());
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [openFilterColumn, setOpenFilterColumn] = useState<ColumnKey | null>(
    null,
  );
  const [textFilters, setTextFilters] = useState<Record<string, string>>({});
  const [numericFilters, setNumericFilters] = useState<
    Record<string, NumericFilterState>
  >({});
  const [sort, setSort] = useState<{
    key: ColumnKey;
    dir: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    if (!submitted) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    searchDatasetMaterials({
      formula: query.trim() || undefined,
      elements: includeElements,
      excludeElements,
      minBandGap: minBandGap ? Number(minBandGap) : undefined,
      maxBandGap: maxBandGap ? Number(maxBandGap) : undefined,
      minEHull: minHull ? Number(minHull) : undefined,
      maxEHull: maxHull ? Number(maxHull) : undefined,
      page,
      limit,
    })
      .then((response) => {
        if (!controller.signal.aborted) {
          setMaterials(response.results);
          setTotal(response.total);
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to fetch materials.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [
    submitted,
    query,
    includeElements,
    excludeElements,
    minBandGap,
    maxBandGap,
    minHull,
    maxHull,
    page,
    searchNonce,
  ]);

  // Smooth-scroll to results only after search operation completes and results render
  useEffect(() => {
    if (!loading && shouldScrollToResultsRef.current && submitted) {
      shouldScrollToResultsRef.current = false;
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, submitted, materials]);

  const handleElementClick = (symbol: string) => {
    if (selectionMode === "include") {
      setIncludeElements((current) =>
        current.includes(symbol)
          ? current.filter((item) => item !== symbol)
          : [...current, symbol],
      );
      setExcludeElements((current) =>
        current.filter((item) => item !== symbol),
      );
    } else {
      setExcludeElements((current) =>
        current.includes(symbol)
          ? current.filter((item) => item !== symbol)
          : [...current, symbol],
      );
      setIncludeElements((current) =>
        current.filter((item) => item !== symbol),
      );
    }
  };

  const runSearch = (event: FormEvent) => {
    event.preventDefault();
    shouldScrollToResultsRef.current = true;
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    includeElements.forEach((element) => next.append("elements", element));
    excludeElements.forEach((element) =>
      next.append("exclude_elements", element),
    );
    setParams(next);
    setPage(1);
    setSubmitted(true);
    setSearchNonce((n) => n + 1);
  };

  const resetAll = () => {
    shouldScrollToResultsRef.current = false;
    setQuery("");
    setIncludeElements([]);
    setExcludeElements([]);
    setSelectionMode("include");
    setMinBandGap("");
    setMaxBandGap("");
    setMinHull("");
    setMaxHull("");
    setTextFilters({});
    setNumericFilters({});
    setSort(null);
    setPage(1);
    setParams(new URLSearchParams());
    setSubmitted(false);
    setMaterials([]);
    setTotal(0);
  };

  const applyBackendNumericFilter = (
    key: "e_hull" | "band_gap",
    comparator: Comparator,
    value: string,
  ) => {
    const n = value.trim() === "" ? "" : value.trim();
    if (key === "band_gap") {
      if (comparator === "<=") setMaxBandGap(n);
      else setMinBandGap(n);
    } else {
      if (comparator === "<=") setMaxHull(n);
      else setMinHull(n);
    }
    setPage(1);
    setSubmitted(true);
  };

  const visibleRows = useMemo(() => {
    let rows = materials;

    Object.entries(textFilters).forEach(([key, term]) => {
      if (!term.trim()) return;
      const column = COLUMNS.find((c) => c.key === key);
      if (!column) return;
      const needle = term.trim().toLowerCase();
      rows = rows.filter((m) =>
        String(column.accessor(m) ?? "")
          .toLowerCase()
          .includes(needle),
      );
    });

    Object.entries(numericFilters).forEach(([key, filter]) => {
      const column = COLUMNS.find((c) => c.key === key);
      if (!column || column.backendFilter) return;
      if (filter.value.trim() === "") return;
      const target = Number(filter.value);
      if (Number.isNaN(target)) return;
      rows = rows.filter((m) => {
        const v = column.accessor(m);
        return typeof v === "number" && compare(v, filter.comparator, target);
      });
    });

    if (sort) {
      const column = COLUMNS.find((c) => c.key === sort.key)!;
      rows = [...rows].sort((a, b) => {
        const av = column.accessor(a);
        const bv = column.accessor(b);
        if (av === null || av === "") return 1;
        if (bv === null || bv === "") return -1;
        const result = av < bv ? -1 : av > bv ? 1 : 0;
        return sort.dir === "asc" ? result : -result;
      });
    }

    return rows;
  }, [materials, textFilters, numericFilters, sort]);

  const exportCsv = () => {
    const cols = COLUMNS.filter((c) => !hiddenColumns.has(c.key));
    const header = cols.map((c) => c.label).join(",");
    const rows = visibleRows.map((m) =>
      cols
        .map((c) => `"${String(c.accessor(m) ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "materials_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedElements = [
    ...includeElements.map((element) => ({
      element,
      mode: "include" as const,
    })),
    ...excludeElements.map((element) => ({
      element,
      mode: "exclude" as const,
    })),
  ];

  const totalPages = Math.ceil(total / limit);
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, page + 2);

  if (page <= 2) {
    endPage = Math.min(totalPages, 5);
  }
  if (page >= totalPages - 1) {
    startPage = Math.max(1, totalPages - 4);
  }

  const paginationPages = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i,
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-7 px-4 sm:px-8 py-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D]">
          Material discovery
        </p>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Materials Explorer
        </h1>
        <p className="text-sm text-[#6C737E] mt-1">
          Search real IndianMatter records, then refine returned solid-state
          battery candidates.
        </p>
      </header>

      <section className="bg-white rounded-[2rem] p-5 sm:p-7 shadow-card border border-[#EFE5DC] space-y-5">
        <form onSubmit={runSearch} className="flex flex-col sm:flex-row gap-3">
          <div
            onClick={() => searchInputRef.current?.focus()}
            className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5 bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-2 px-3 text-sm focus-within:border-[#F1641D] transition-colors min-h-[46px] cursor-text"
          >
            <Search
              className="text-[#8C929C] shrink-0 ml-1 mr-0.5"
              size={17}
            />
            {selectedElements.map(({ element, mode }) => (
              <span
                key={`${mode}-${element}`}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold select-none shadow-xs transition-all ${
                  mode === "exclude"
                    ? "bg-[#713600] text-white"
                    : "bg-[#FBE8D8] text-[#F1641D] border border-[#F1641D]/30"
                }`}
              >
                <span>{mode === "exclude" ? `− ${element}` : element}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleElementClick(element);
                  }}
                  aria-label={`Remove ${element}`}
                  className={`hover:opacity-100 p-0.5 rounded cursor-pointer transition-opacity flex items-center justify-center ${
                    mode === "exclude"
                      ? "text-white/80 hover:text-white"
                      : "text-[#F1641D]/80 hover:text-[#F1641D]"
                  }`}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                selectedElements.length > 0
                  ? "Search formula or material ID..."
                  : "Search formula or material ID (e.g., Li7La3Zr2O12)"
              }
              aria-label="Search materials"
              className="flex-1 min-w-[160px] bg-transparent border-none py-1 px-1.5 text-sm outline-none text-[#1E2227] placeholder:text-[#8C929C]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] shrink-0 transition-colors cursor-pointer"
          >
            Search Materials
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="px-4 py-3 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#1E2227]">Element mode:</span>
          <button
            type="button"
            onClick={() => setSelectionMode("include")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectionMode === "include"
                ? "bg-[#FBE8D8] text-[#F1641D]"
                : "bg-[#FAF4EE] text-[#6C737E] hover:bg-[#F2E7DC]"
            }`}
          >
            Include
          </button>
          <button
            type="button"
            onClick={() => setSelectionMode("exclude")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectionMode === "exclude"
                ? "bg-[#713600] text-white"
                : "bg-[#FAF4EE] text-[#6C737E] hover:bg-[#F2E7DC]"
            }`}
          >
            Exclude
          </button>

          <span className="ml-auto text-[#8C929C]">
            Database: IndianMatter dataset
          </span>
        </div>

        <PeriodicTable
          includeElements={includeElements}
          excludeElements={excludeElements}
          onElementClick={handleElementClick}
        />
      </section>

      {!submitted && (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#EFE5DC] text-sm text-[#6C737E]">
          <Filter className="mx-auto mb-3 text-[#F1641D]" size={22} />
          Start with a formula, material ID, or element selection.
        </div>
      )}

      {submitted && (
        <section
          ref={resultsRef}
          className="bg-white rounded-2xl border border-[#EFE5DC] overflow-hidden shadow-card scroll-mt-6"
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#F2E7DC] bg-[#FAF4EE]/40">
            <button
              type="button"
              onClick={resetAll}
              className="px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-1.5"
            >
              <RotateCcw size={13} /> Reset
            </button>
            <span className="px-3 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-semibold">
              {loading
                ? "Searching…"
                : `${visibleRows.length} of ${total} materials`}
            </span>
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setShowColumnsPanel((v) => !v)}
                className="px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5"
              >
                <Columns3 size={14} /> Columns
              </button>
              {showColumnsPanel && (
                <div className="absolute right-0 mt-1 w-60 bg-white border border-[#E9DFD4] rounded-xl shadow-card p-3 z-30 space-y-1">
                  {COLUMNS.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 text-xs text-[#1E2227] py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.has(col.key)}
                        onChange={() =>
                          setHiddenColumns((current) => {
                            const next = new Set(current);
                            if (next.has(col.key)) next.delete(col.key);
                            else next.add(col.key);
                            return next;
                          })
                        }
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5"
            >
              <Download size={14} /> Export Table
            </button>
          </div>

          {error && (
            <div role="alert" className="p-5 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && !visibleRows.length && (
            <div className="p-8 text-center text-sm text-[#6C737E]">
              No materials found. Try removing an element, widening a range, or
              clearing a column filter.
            </div>
          )}

          {loading && (
            <div className="p-8 text-center text-sm text-[#6C737E]">
              Searching materials...
            </div>
          )}

          {!loading && !error && visibleRows.length > 0 && (
            <>
              <div className="w-full overflow-auto max-h-[70vh] relative results-table-container">
                <table className="w-max min-w-full text-xs border-separate border-spacing-0">
                <thead className="z-20">
                  <tr className="bg-[#1E2227]">
                    {COLUMNS.filter((c) => !hiddenColumns.has(c.key)).map(
                      (col, index, array) => {
                        const isSticky = index === 0 && col.key === "mv_id";
                        return (
                          <th
                            key={col.key}
                            className={`sticky top-0 px-4 py-3 text-left font-semibold text-[#E9DFD4] whitespace-nowrap border-b border-[#333842] bg-[#1E2227] ${
                              isSticky
                                ? "left-0 z-30 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.3)] border-r border-[#333842]"
                                : "z-20"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSort((current) => ({
                                    key: col.key,
                                    dir:
                                      current?.key === col.key &&
                                      current.dir === "asc"
                                        ? "desc"
                                        : "asc",
                                  }))
                                }
                                className="hover:text-white transition-colors"
                              >
                                {col.label}
                                {sort?.key === col.key
                                  ? sort.dir === "asc"
                                    ? " ▲"
                                    : " ▼"
                                  : ""}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenFilterColumn((current) =>
                                    current === col.key ? null : col.key,
                                  )
                                }
                                aria-label={`Filter ${col.label}`}
                                className={`${
                                  (col.type === "text" && textFilters[col.key]) ||
                                  (col.type === "number" &&
                                    numericFilters[col.key]?.value)
                                    ? "text-[#F1641D]"
                                    : "text-[#8C929C]"
                                } hover:text-white transition-colors`}
                              >
                                <Filter size={12} />
                              </button>
                            </div>

                            {openFilterColumn === col.key && (
                              <div
                                className={`absolute top-full mt-1.5 w-60 bg-white border border-[#E9DFD4] rounded-xl shadow-2xl p-3.5 z-50 text-left font-normal normal-case text-[#1E2227] ${
                                  index > array.length - 3 ? "right-0" : "left-0"
                                }`}
                              >
                                {col.type === "text" ? (
                                  <>
                                    <p className="text-[10px] text-[#8C929C] mb-1 font-semibold uppercase tracking-wider">
                                      Contains Text
                                    </p>
                                    <input
                                      value={textFilters[col.key] ?? ""}
                                      onChange={(e) =>
                                        setTextFilters((current) => ({
                                          ...current,
                                          [col.key]: e.target.value,
                                        }))
                                      }
                                      placeholder="Filter..."
                                      className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#F1641D]"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <p className="text-[10px] text-[#8C929C] mb-1 font-semibold uppercase tracking-wider">
                                      {col.backendFilter
                                        ? "Filter Range (Backend Query)"
                                        : "Numeric Comparator"}
                                    </p>
                                    <select
                                      defaultValue=">="
                                      id={`comp-${col.key}`}
                                      className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-1.5 text-xs outline-none mb-2"
                                    >
                                      <option value=">=">
                                        Greater than or equal (≥)
                                      </option>
                                      <option value="<=">
                                        Less than or equal (≤)
                                      </option>
                                      {!col.backendFilter && (
                                        <>
                                          <option value="=">Equal to (=)</option>
                                          <option value=">">
                                            Strictly greater (&gt;)
                                          </option>
                                          <option value="<">
                                            Strictly less (&lt;)
                                          </option>
                                        </>
                                      )}
                                    </select>
                                    <input
                                      id={`val-${col.key}`}
                                      type="number"
                                      step="any"
                                      placeholder="Threshold value..."
                                      defaultValue={
                                        col.backendFilter
                                          ? undefined
                                          : (numericFilters[col.key]?.value ?? "")
                                      }
                                      className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#F1641D] mb-2.5"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const comparator = (
                                            document.getElementById(
                                              `comp-${col.key}`,
                                            ) as HTMLSelectElement
                                          ).value as Comparator;
                                          const value = (
                                            document.getElementById(
                                              `val-${col.key}`,
                                            ) as HTMLInputElement
                                          ).value;
                                          if (
                                            col.backendFilter &&
                                            (col.key === "e_hull" ||
                                              col.key === "band_gap")
                                          ) {
                                            applyBackendNumericFilter(
                                              col.key,
                                              comparator,
                                              value,
                                            );
                                          } else {
                                            setNumericFilters((current) => ({
                                              ...current,
                                              [col.key]: { comparator, value },
                                            }));
                                          }
                                          setOpenFilterColumn(null);
                                        }}
                                        className="flex-1 py-1.5 bg-[#F1641D] text-white rounded-lg text-xs font-semibold hover:bg-[#D9520F]"
                                      >
                                        Apply
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setNumericFilters((current) => {
                                            const next = { ...current };
                                            delete next[col.key];
                                            return next;
                                          });
                                          setOpenFilterColumn(null);
                                        }}
                                        className="px-2.5 py-1.5 border border-[#E9DFD4] rounded-lg text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE]"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </th>
                        );
                      },
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((m, i) => (
                    <tr
                      key={m.mv_id ?? i}
                      className={`group ${
                        i % 2 === 0 ? "bg-white" : "bg-[#FDF9F4]"
                      } border-b border-[#F2E7DC] hover:bg-[#FBE8D8]/40 transition-colors`}
                    >
                      {COLUMNS.filter((c) => !hiddenColumns.has(c.key)).map(
                        (col, colIndex) => {
                          const isSticky = colIndex === 0 && col.key === "mv_id";
                          return (
                            <td
                              key={col.key}
                              className={`px-4 py-2.5 whitespace-nowrap ${
                                isSticky
                                  ? `sticky left-0 z-10 ${
                                      i % 2 === 0 ? "bg-white" : "bg-[#FDF9F4]"
                                    } group-hover:bg-[#FAF0E6] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] border-r border-[#F2E7DC]`
                                  : ""
                              }`}
                            >
                              {col.colorScale ? (
                                <span
                                  className={`${badgeClasses(col, m)} font-mono`}
                                >
                                  {col.format(m)}
                                </span>
                              ) : (
                                <span className="text-[#1E2227] font-mono">
                                  {col.format(m)}
                                </span>
                              )}
                            </td>
                          );
                        },
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between p-4 border-t border-[#F2E7DC] bg-[#FAF4EE]/40 text-xs">
              <span className="text-[#6C737E]">
                Showing {total === 0 ? 0 : (page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} materials
              </span>
              <div className="flex items-center gap-4">
                {page > 1 && (
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 text-[#1A0DAB] text-[15px] hover:underline"
                  >
                    <span className="text-xl leading-none">‹</span> Previous
                  </button>
                )}
                
                <div className="flex items-center gap-1 bg-[#F8F9FA] rounded-xl px-2 py-1">
                  {paginationPages.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center text-[15px] transition-colors ${
                        page === p
                          ? "text-[#1E2227] border-b-[2.5px] border-[#1E2227] font-semibold"
                          : "text-[#1A0DAB] hover:bg-[#E9DFD4]/50 rounded-lg"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                
                {page < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-1 text-[#1A0DAB] text-[15px] hover:underline"
                  >
                    Next <span className="text-xl leading-none">›</span>
                  </button>
                )}
              </div>
            </div>
          </>
          )}
        </section>
      )}
    </div>
  );
}
