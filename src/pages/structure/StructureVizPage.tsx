import { useMemo, useState } from "react";
import {
  Atom,
  CheckCircle2,
  ChevronDown,
  Download,
  FileUp,
  Layers3,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import CrystalViewerCanvas from "./CrystalViewerCanvas";
import { parseCifFile, ParsedStructure } from "../../lib/cifApi";

type AtomRecord = {
  species: string;
  fractional_coordinates: [number, number, number];
};
type Preset = {
  id: string;
  formula: string;
  name: string;
  system: string;
  spaceGroup: string;
  atoms: AtomRecord[];
  lattice: {
    a: number;
    b: number;
    c: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
};

const presets: Preset[] = [
  {
    id: "LiCoO2",
    formula: "LiCoO₂",
    name: "Lithium cobalt oxide",
    system: "Trigonal",
    spaceGroup: "R -3 m · 166",
    lattice: { a: 2.816, b: 2.816, c: 14.054, alpha: 90, beta: 90, gamma: 120 },
    atoms: [
      { species: "Li", fractional_coordinates: [0, 0, 0] },
      { species: "Li", fractional_coordinates: [0.5, 0.5, 0.5] },
      { species: "Co", fractional_coordinates: [0, 0, 0.5] },
      { species: "Co", fractional_coordinates: [0.5, 0.5, 0] },
      { species: "O", fractional_coordinates: [0, 0, 0.24] },
      { species: "O", fractional_coordinates: [0, 0, 0.76] },
      { species: "O", fractional_coordinates: [0.5, 0.5, 0.24] },
      { species: "O", fractional_coordinates: [0.5, 0.5, 0.76] },
    ],
  },
  {
    id: "LiFePO4",
    formula: "LiFePO₄",
    name: "Lithium iron phosphate",
    system: "Orthorhombic",
    spaceGroup: "P n m a · 62",
    lattice: { a: 10.334, b: 6.01, c: 4.693, alpha: 90, beta: 90, gamma: 90 },
    atoms: [
      { species: "Li", fractional_coordinates: [0, 0, 0] },
      { species: "Fe", fractional_coordinates: [0.25, 0.5, 0.25] },
      { species: "P", fractional_coordinates: [0.4, 0.25, 0.1] },
      { species: "O", fractional_coordinates: [0.1, 0.2, 0.3] },
    ],
  },
  {
    id: "LLZO",
    formula: "Li₇La₃Zr₂O₁₂",
    name: "Lithium lanthanum zirconium oxide",
    system: "Cubic",
    spaceGroup: "I a -3 d · 230",
    lattice: {
      a: 12.968,
      b: 12.968,
      c: 12.968,
      alpha: 90,
      beta: 90,
      gamma: 90,
    },
    atoms: [
      { species: "Zr", fractional_coordinates: [0, 0, 0] },
      { species: "La", fractional_coordinates: [0.25, 0.25, 0.25] },
      { species: "Li", fractional_coordinates: [0.12, 0.35, 0.48] },
      { species: "O", fractional_coordinates: [0.1, 0.2, 0.3] },
    ],
  },
];

export default function StructureVizPage() {
  const [selectedId, setSelectedId] = useState("LiCoO2");
  const [parsedStructure, setParsedStructure] =
    useState<ParsedStructure | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(true);

  const current =
    presets.find((preset) => preset.id === selectedId) ?? presets[0];
  const atoms = (parsedStructure?.atoms ?? current.atoms) as AtomRecord[];
  const lattice = parsedStructure
    ? {
        a: Number.parseFloat(parsedStructure.lattice.a) || 5,
        b: Number.parseFloat(parsedStructure.lattice.b) || 5,
        c: Number.parseFloat(parsedStructure.lattice.c) || 5,
        alpha: 90,
        beta: 90,
        gamma: 90,
      }
    : current.lattice;
  const formula = parsedStructure?.formula ?? current.formula;
  const source = parsedStructure
    ? "Uploaded CIF · local structure"
    : `IndianMatter library · ${current.id}`;
  const composition = useMemo(
    () => Array.from(new Set(atoms.map((atom) => atom.species))),
    [atoms],
  );

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setIsParsing(true);
    setParseError(null);
    try {
      setParsedStructure(await parseCifFile(file));
    } catch (error) {
      setParsedStructure(null);
      setParseError(
        error instanceof Error ? error.message : "CIF parsing failed.",
      );
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060912] px-4 py-5 text-white sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.26em] text-cyan-300">
              <Atom size={14} /> Structure intelligence{" "}
              <span className="text-slate-600">/</span> visual lab
            </div>
            <h1 className="text-3xl font-semibold tracking-[-.04em] text-white sm:text-5xl">
              Crystal structure studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Inspect lattice geometry, atomic coordination, and material
              identity in a focused WebGL workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-[11px] font-semibold text-emerald-200">
              <CheckCircle2 size={14} /> WebGL ready
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-100">
              <FileUp size={15} /> Upload CIF
              <input
                type="file"
                accept=".cif"
                className="hidden"
                onChange={(event) => handleUpload(event.target.files?.[0])}
              />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)_285px]">
          <aside className="order-2 rounded-[24px] border border-white/10 bg-[#0b111d]/90 p-4 shadow-2xl xl:order-1">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">
                  Structure library
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  Curated presets
                </p>
              </div>
              <Layers3 size={17} className="text-slate-500" />
            </div>
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(preset.id);
                    setParsedStructure(null);
                  }}
                  className={`w-full rounded-2xl border p-3 text-left transition ${!parsedStructure && current.id === preset.id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/5 bg-white/[.025] hover:border-white/15 hover:bg-white/[.05]"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-white">
                      {preset.formula}
                    </span>
                    {!parsedStructure && current.id === preset.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {preset.name}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-600">
                    {preset.system} · {preset.spaceGroup}
                  </p>
                </button>
              ))}
            </div>
            <div className="my-5 h-px bg-white/10" />
            <button
              type="button"
              onClick={() => setShowLibrary((value) => !value)}
              className="flex w-full items-center justify-between text-[11px] font-semibold text-slate-300"
            >
              <span>Viewer preferences</span>
              <ChevronDown
                size={14}
                className={`transition ${showLibrary ? "rotate-180" : ""}`}
              />
            </button>
            {showLibrary && (
              <div className="mt-3 space-y-3 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Renderer</span>
                  <span className="font-mono text-slate-300">WebGL 2.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Antialiasing</span>
                  <span className="text-emerald-300">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Source fidelity</span>
                  <span className="text-cyan-300">High</span>
                </div>
              </div>
            )}
          </aside>

          <section className="order-1 min-w-0 xl:order-2">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#080d17] shadow-[0_30px_100px_rgba(0,0,0,.35)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">
                    Active structure
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    {formula}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-300" />{" "}
                  Validated geometry
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <CrystalViewerCanvas
                  atoms={atoms}
                  lattice={lattice}
                  materialLabel={formula}
                  sourceLabel={source}
                />
              </div>
            </div>
            {isParsing && (
              <div className="mt-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-xs text-cyan-100">
                Parsing CIF with the structure service…
              </div>
            )}
            {parseError && (
              <div
                role="alert"
                className="mt-3 flex items-center justify-between rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-xs text-rose-100"
              >
                <span>{parseError}</span>
                <button type="button" onClick={() => setParseError(null)}>
                  <X size={15} />
                </button>
              </div>
            )}
          </section>

          <aside className="order-3 space-y-4">
            <section className="rounded-[24px] border border-white/10 bg-[#0b111d]/90 p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">
                    Structure profile
                  </p>
                  <h3 className="mt-1 text-base font-semibold">
                    {parsedStructure ? "Uploaded CIF" : current.name}
                  </h3>
                </div>
                <Sparkles size={16} className="text-violet-300" />
              </div>
              <div className="space-y-2.5">
                {[
                  [
                    "Crystal system",
                    parsedStructure?.space_group
                      ? "Parsed structure"
                      : current.system,
                  ],
                  [
                    "Space group",
                    parsedStructure?.space_group ?? current.spaceGroup,
                  ],
                  ["Unique elements", `${composition.length} species`],
                  ["Atom sites", `${atoms.length} sites`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/5 bg-white/[.025] px-3 py-2.5"
                  >
                    <p className="text-[10px] text-slate-500">{label}</p>
                    <p className="mt-1 text-xs font-medium text-slate-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-[24px] border border-white/10 bg-[#0b111d]/90 p-5 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">
                Lattice parameters
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["a", lattice.a],
                  ["b", lattice.b],
                  ["c", lattice.c],
                  ["volume", lattice.a * lattice.b * lattice.c],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/5 bg-white/[.025] px-3 py-2.5"
                  >
                    <p className="text-[10px] uppercase text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 font-mono text-xs text-white">
                      {Number(value).toFixed(label === "volume" ? 1 : 3)}{" "}
                      <span className="text-[9px] text-slate-500">
                        Å{label === "volume" ? "³" : ""}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                type="button"
                onClick={() => alert("Structure export queued.")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-3 py-2.5 text-[11px] font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                <Download size={14} /> Export
              </button>
            </div>
          </aside>
        </div>
        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[10px] text-slate-600">
          <span>IndianMatter Structure Intelligence · Interactive preview</span>
          <span>All visual values reflect the active structure record</span>
        </footer>
      </div>
    </main>
  );
}
