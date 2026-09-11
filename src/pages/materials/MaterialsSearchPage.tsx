import { useEffect, useState } from "react";
import { Filter, LayoutGrid, List, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MaterialCard, { MaterialCardProps } from "../../components/MaterialCard";
import PeriodicTable from "../../components/PeriodicTable";
import { MaterialRecord, searchDatasetMaterials } from "../../lib/datasetapi";

function valueOrUnavailable(value: unknown, suffix = "") {
  return value === "" || value === null || value === undefined
    ? "Not available"
    : `${String(value)}${suffix}`;
}

function toCard(material: MaterialRecord): MaterialCardProps {
  return {
    id: material.mv_id,
    formula: material.Formula,
    name: "Dataset material",
    system: "Not available",
    spaceGroup: "Not available",
    bandGap: valueOrUnavailable(material["Band Gap E_g (eV)"], " eV"),
    formationEnergy: valueOrUnavailable(
      material["Form. Energy E_f (eV/atom)"],
      " eV/atom",
    ),
    conductivity: "Not available",
    density: "Not available",
    database: "IndianMatter dataset",
    tags: material.nsites === undefined ? [] : [`${material.nsites} sites`],
  };
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
  const [submitted, setSubmitted] = useState(false);
  const [materials, setMaterials] = useState<MaterialCardProps[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

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
      page: 1,
      limit: 24,
    })
      .then((response) => {
        if (!controller.signal.aborted) {
          setMaterials(response.results.map(toCard));
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
  ]);

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

  const runSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    includeElements.forEach((element) => next.append("elements", element));
    excludeElements.forEach((element) =>
      next.append("exclude_elements", element),
    );
    setParams(next);
    setSubmitted(true);
  };

  const clearRefinementFilters = () => {
    setMinBandGap("");
    setMaxBandGap("");
    setMinHull("");
    setMaxHull("");
  };

  const selected = [
    ...includeElements.map((element) => ({ element, prefix: "+" })),
    ...excludeElements.map((element) => ({ element, prefix: "-" })),
  ];

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-7 px-4 sm:px-8 py-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D]">
          Material discovery
        </p>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Materials Explorer
        </h1>
        <p className="text-sm text-[#6C737E] mt-1">
          Search real IndianMatter records, then refine the returned materials.
        </p>
      </header>

      <section className="bg-white rounded-[2rem] p-5 sm:p-7 shadow-card border border-[#EFE5DC] space-y-5">
        <form onSubmit={runSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]"
              size={17}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search formula or material ID"
              aria-label="Search materials"
              className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#F1641D]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F]"
            >
              Search Materials
            </button>
          </div>
        </form>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#1E2227]">Element mode:</span>
          <button
            type="button"
            onClick={() => setSelectionMode("include")}
            className={`px-3 py-1.5 rounded-lg ${selectionMode === "include" ? "bg-[#FBE8D8] text-[#F1641D]" : "bg-[#FAF4EE] text-[#6C737E]"}`}
          >
            Include
          </button>
          <button
            type="button"
            onClick={() => setSelectionMode("exclude")}
            className={`px-3 py-1.5 rounded-lg ${selectionMode === "exclude" ? "bg-[#713600] text-white" : "bg-[#FAF4EE] text-[#6C737E]"}`}
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
        <div
          className="flex flex-wrap gap-2 text-xs"
          aria-label="Selected elements"
        >
          <span className="font-semibold text-[#1E2227]">
            Selected elements:
          </span>
          {selected.map(({ element, prefix }) => (
            <button
              type="button"
              key={`${prefix}${element}`}
              onClick={() => handleElementClick(element)}
              className={`px-2.5 py-1 rounded-lg font-semibold ${prefix === "+" ? "bg-[#F3D9AE] text-[#C05800]" : "bg-[#713600] text-white"}`}
            >
              {prefix}
              {element} <X size={11} className="inline" />
            </button>
          ))}
          {!selected.length && <span className="text-[#8C929C]">None</span>}
        </div>
      </section>

      {!submitted && (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#EFE5DC] text-sm text-[#6C737E]">
          <Filter className="mx-auto mb-3 text-[#F1641D]" size={22} />
          Start with a formula, material ID, or element selection.
        </div>
      )}
      {submitted && (
        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-6 items-start">
          <aside className="bg-white rounded-2xl p-5 border border-[#EFE5DC] space-y-4 lg:sticky lg:top-20">
            <div className="flex justify-between items-center">
              <h2 className="font-headline font-bold text-sm">
                Refine results
              </h2>
              <button
                type="button"
                onClick={clearRefinementFilters}
                className="text-[11px] text-[#F1641D]"
              >
                Clear filters
              </button>
            </div>
            <p className="text-[11px] text-[#8C929C]">
              Backend-supported numeric filters
            </p>
            <label className="block text-xs text-[#6C737E]">
              Band gap min (eV)
              <input
                type="number"
                step="any"
                value={minBandGap}
                onChange={(event) => setMinBandGap(event.target.value)}
                className="mt-1 w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-2"
              />
            </label>
            <label className="block text-xs text-[#6C737E]">
              Band gap max (eV)
              <input
                type="number"
                step="any"
                value={maxBandGap}
                onChange={(event) => setMaxBandGap(event.target.value)}
                className="mt-1 w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-2"
              />
            </label>
            <label className="block text-xs text-[#6C737E]">
              Energy hull min
              <input
                type="number"
                step="any"
                value={minHull}
                onChange={(event) => setMinHull(event.target.value)}
                className="mt-1 w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-2"
              />
            </label>
            <label className="block text-xs text-[#6C737E]">
              Energy hull max
              <input
                type="number"
                step="any"
                value={maxHull}
                onChange={(event) => setMaxHull(event.target.value)}
                className="mt-1 w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-2"
              />
            </label>
          </aside>
          <section className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#6C737E]">
              <span>
                {loading
                  ? "Searching materials..."
                  : `${total} materials found`}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className="p-2"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className="p-2"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
            {error && (
              <div
                role="alert"
                className="bg-white rounded-xl p-5 text-sm text-red-700 border border-red-100"
              >
                {error}
              </div>
            )}
            {!loading && !error && !materials.length && (
              <div className="bg-white rounded-xl p-8 text-center text-sm text-[#6C737E]">
                No materials found. Try removing an element or widening a range.
              </div>
            )}
            {loading && (
              <div className="bg-white rounded-xl p-8 text-center text-sm text-[#6C737E]">
                Searching materials...
              </div>
            )}
            {!loading && !error && materials.length > 0 && (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                {materials.map((material) => (
                  <MaterialCard key={material.id} {...material} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
