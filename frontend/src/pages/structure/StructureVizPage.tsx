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
import StructureViewer from "../../components/StructureViewer";
import { parseCifFile, ParsedStructure } from "../../lib/cifApi";

function presetToCif(preset: Preset): string {
  const { a, b, c, alpha, beta, gamma } = preset.lattice;
  let cif = `data_${preset.id}\n`;
  cif += `_cell_length_a ${a}\n_cell_length_b ${b}\n_cell_length_c ${c}\n`;
  cif += `_cell_angle_alpha ${alpha}\n_cell_angle_beta ${beta}\n_cell_angle_gamma ${gamma}\n`;
  cif += `_symmetry_space_group_name_H-M 'P 1'\n`;
  cif += `loop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n`;
  preset.atoms.forEach((atom, idx) => {
    cif += `${atom.species}${idx + 1} ${atom.species} ${atom.fractional_coordinates.join(" ")}\n`;
  });
  return cif;
}

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
  const [uploadedCifText, setUploadedCifText] = useState<string | null>(null);
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

  const activeCifText = parsedStructure && uploadedCifText
    ? uploadedCifText
    : presetToCif(current);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setIsParsing(true);
    setParseError(null);
    try {
      const text = await file.text();
      setUploadedCifText(text);
      setParsedStructure(await parseCifFile(file));
    } catch (error) {
      setParsedStructure(null);
      setUploadedCifText(null);
      setParseError(
        error instanceof Error ? error.message : "CIF parsing failed.",
      );
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-6 px-4 sm:px-8 py-6 text-im-text">
      <div>
        <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D47E30] font-headline">
              <Atom size={14} /> Structure Intelligence Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227] tracking-tight">
              Crystal Structure Studio
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#6C737E]">
              Inspect crystallographic lattice geometry, atomic coordination, and material identity in an interactive 3D WebGL workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} /> WebGL ready
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#D47E30] hover:bg-[#B8671E] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all">
              <FileUp size={15} /> Upload CIF
              <input
                type="file"
                accept=".cif"
                className="hidden"
                onClick={(e) => { e.currentTarget.value = ""; }}
                onChange={(event) => handleUpload(event.target.files?.[0])}
              />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          {/* Left Column: Preset Library */}
          <aside className="order-2 rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card xl:order-1">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]">
                  Structure library
                </p>
                <p className="mt-0.5 text-base font-headline font-bold text-[#1E2227]">
                  Curated Presets
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#FDF5EE] flex items-center justify-center text-[#D47E30]">
                <Layers3 size={17} />
              </div>
            </div>
            <div className="space-y-2">
              {presets.map((preset) => {
                const isSelected = !parsedStructure && current.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(preset.id);
                      setParsedStructure(null);
                    }}
                    className={`w-full rounded-2xl border p-3.5 text-left transition-all ${isSelected
                        ? "border-[#D47E30] bg-[#FDF5EE] shadow-sm"
                        : "border-[#EDE8E2] bg-white hover:border-[#D47E30]/40 hover:bg-[#FAF4EE]/40"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#1E2227]">
                        {preset.formula}
                      </span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-[#D47E30] shadow-[0_0_8px_rgba(212,126,48,0.5)]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#6C737E]">
                      {preset.name}
                    </p>
                    <p className="mt-2 text-[10px] font-medium text-[#8C929C]">
                      {preset.system} · {preset.spaceGroup}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="my-5 h-px bg-[#EDE8E2]" />
            <button
              type="button"
              onClick={() => setShowLibrary((value) => !value)}
              className="flex w-full items-center justify-between text-xs font-semibold text-[#1E2227] hover:text-[#D47E30] transition-colors"
            >
              <span>Viewer preferences</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showLibrary ? "rotate-180" : ""}`}
              />
            </button>
            {showLibrary && (
              <div className="mt-3 space-y-2.5 text-xs text-[#6C737E]">
                <div className="flex items-center justify-between">
                  <span>Renderer</span>
                  <span className="font-mono text-[#1E2227] font-medium">WebGL 2.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Antialiasing</span>
                  <span className="text-emerald-700 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Source fidelity</span>
                  <span className="text-[#D47E30] font-medium">High</span>
                </div>
              </div>
            )}
          </aside>

          {/* Center Column: 3D Crystal Visualizer */}
          <section className="order-1 min-w-0 xl:order-2">
            <div className="overflow-hidden rounded-[2rem] border border-[#EDE8E2] bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE8E2] bg-[#FAF4EE]/30 px-6 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D47E30]">
                    Active structure
                  </p>
                  <h2 className="mt-0.5 text-xl font-headline font-bold text-[#1E2227] tracking-tight">
                    {formula}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> Validated geometry
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-white h-[500px] xl:h-[600px] rounded-b-[2rem]">
                <StructureViewer cifText={activeCifText} />
              </div>
            </div>
            {isParsing && (
              <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 font-medium flex items-center gap-2">
                Parsing CIF with the structure service…
              </div>
            )}
            {parseError && (
              <div
                role="alert"
                className="mt-3 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900 font-medium"
              >
                <span>{parseError}</span>
                <button type="button" onClick={() => setParseError(null)}>
                  <X size={15} />
                </button>
              </div>
            )}
          </section>

          {/* Right Column: Profile & Lattice Parameters */}
          <aside className="order-3 space-y-5">
            <section className="rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]">
                    Structure profile
                  </p>
                  <h3 className="mt-0.5 text-base font-headline font-bold text-[#1E2227]">
                    {parsedStructure ? "Uploaded CIF" : current.name}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#FDF5EE] flex items-center justify-center text-[#D47E30]">
                  <Sparkles size={16} />
                </div>
              </div>
              <div className="space-y-2">
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
                    className="rounded-xl border border-[#EDE8E2] bg-[#FAF4EE]/40 px-3.5 py-2.5"
                  >
                    <p className="text-[10px] uppercase font-semibold text-[#8C929C]">{label}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#1E2227]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]">
                Lattice parameters
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["a", lattice.a],
                  ["b", lattice.b],
                  ["c", lattice.c],
                  ["volume", lattice.a * lattice.b * lattice.c],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#EDE8E2] bg-[#FAF4EE]/40 px-3 py-2"
                  >
                    <p className="text-[10px] uppercase font-bold text-[#8C929C]">
                      {label}
                    </p>
                    <p className="mt-0.5 font-mono text-xs font-bold text-[#1E2227]">
                      {Number(value).toFixed(label === "volume" ? 1 : 3)}{" "}
                      <span className="text-[9px] text-[#8C929C]">
                        Å{label === "volume" ? "³" : ""}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#EDE8E2] bg-white hover:bg-im-surfaceAlt px-3 py-2.5 text-xs font-semibold text-[#1E2227] shadow-sm transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                type="button"
                onClick={() => alert("Structure export queued.")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D47E30] hover:bg-[#B8671E] px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
              >
                <Download size={14} /> Export
              </button>
            </div>
          </aside>
        </div>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDE8E2] pt-4 text-[11px] text-[#8C929C]">
          <span>IndianMatter Structure Intelligence · Interactive WebGL preview</span>
          <span>All visual coordinates reflect the active crystal lattice record</span>
        </footer>
      </div>
    </div>
  );
}
