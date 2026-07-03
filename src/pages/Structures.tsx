import { useEffect, useRef, useState } from "react";
import StructureViewer, {
  type ElementLegendEntry,
  type ViewerControls,
} from "../components/StructureViewer";
import { parseCIF } from "../lib/parseCIF";

// Full names for the common legend symbols this page is likely to render.
// Falls back to the raw symbol if an element isn't in this shortlist.
const ELEMENT_NAMES: Record<string, string> = {
  H: "Hydrogen",
  O: "Oxygen",
  N: "Nitrogen",
  C: "Carbon",
  S: "Sulfur",
  P: "Phosphorus",
  Sr: "Strontium",
  Ti: "Titanium",
  Mo: "Molybdenum",
  Ga: "Gallium",
  Li: "Lithium",
  La: "Lanthanum",
  Zr: "Zirconium",
  Cs: "Cesium",
  Pb: "Lead",
  I: "Iodine",
};

// Demo CIF blocks for the three seed structures (P1, atoms listed
// explicitly so no symmetry expansion is needed). Coordinates are
// illustrative approximations — real uploaded CIFs replace these entirely.
const SEED_CIFS: Record<string, string> = {
  SrTiO3: `data_SrTiO3
_cell_length_a 3.905
_cell_length_b 3.905
_cell_length_c 3.905
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'P 1'
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Sr1 Sr 0.0 0.0 0.0
Ti1 Ti 0.5 0.5 0.5
O1 O 0.5 0.5 0.0
O2 O 0.5 0.0 0.5
O3 O 0.0 0.5 0.5
`,
  MoS2: `data_MoS2
_cell_length_a 3.16
_cell_length_b 3.16
_cell_length_c 12.29
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 120
_symmetry_space_group_name_H-M 'P 1'
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Mo1 Mo 0.3333 0.6667 0.25
Mo2 Mo 0.6667 0.3333 0.75
S1 S 0.3333 0.6667 0.621
S2 S 0.3333 0.6667 0.879
S3 S 0.6667 0.3333 0.121
S4 S 0.6667 0.3333 0.379
`,
  GaN: `data_GaN
_cell_length_a 3.189
_cell_length_b 3.189
_cell_length_c 5.185
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 120
_symmetry_space_group_name_H-M 'P 1'
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Ga1 Ga 0.3333 0.6667 0.0
Ga2 Ga 0.6667 0.3333 0.5
N1 N 0.3333 0.6667 0.377
N2 N 0.6667 0.3333 0.877
`,
};

interface StructureRow {
  id: string;
  name: string;
  system: string; // crystal shape, e.g. "Cubic"
  atoms: number;
  volume: number; // Å³
  date: string;
  status: "Analyzed" | "Pending" | "Failed";
  cif: string;
}

function seedRow(
  id: string,
  name: keyof typeof SEED_CIFS,
  date: string,
  status: StructureRow["status"],
): StructureRow {
  const parsed = parseCIF(SEED_CIFS[name], name);
  return {
    id,
    name,
    system: parsed.system,
    atoms: parsed.atomCount,
    volume: parsed.volume,
    date,
    status,
    cif: SEED_CIFS[name],
  };
}

const initialStructures: StructureRow[] = [
  seedRow("1", "SrTiO3", "2026-07-01", "Analyzed"),
  seedRow("2", "MoS2", "2026-07-02", "Pending"),
  seedRow("3", "GaN", "2026-06-28", "Failed"),
];

export default function Structures() {
  const [structures, setStructures] =
    useState<StructureRow[]>(initialStructures);
  const [selectedId, setSelectedId] = useState(initialStructures[0].id);
  const [viewerStyle, setViewerStyle] = useState<"sphere" | "stick" | "line">(
    "sphere",
  );
  const [unitCellOn, setUnitCellOn] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [legend, setLegend] = useState<ElementLegendEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<ViewerControls | null>(null);

  const selected = structures.find((s) => s.id === selectedId) ?? structures[0];

  useEffect(() => {
    setLegend([]);
  }, [selectedId]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-uploading the same filename later
    if (!file) return;

    setUploadError(null);

    try {
      const text = await file.text();
      const fallbackName = file.name.replace(/\.cif$/i, "");
      const parsed = parseCIF(text, fallbackName);

      const newRow: StructureRow = {
        id: crypto.randomUUID(),
        name: parsed.name,
        system: parsed.system,
        atoms: parsed.atomCount,
        volume: parsed.volume,
        date: new Date().toISOString().slice(0, 10),
        status: "Analyzed",
        cif: text,
      };

      setStructures((prev) => [newRow, ...prev]);
      setSelectedId(newRow.id);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Couldn't parse that CIF file.",
      );
    }
  };

  return (
    <div className="enterprise-page">
      <div className="enterprise-shell flex h-full min-h-screen flex-col gap-8">
        <div className="flex items-end justify-between gap-6 border-b border-gray-200 pb-6 dark:border-neutral-800">
          <div>
            <h2 className="mb-2 font-headline text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              Crystal Structures
            </h2>
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              View, manage, and explore 3D atomic structures.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleUploadClick}
              className="enterprise-button-primary px-6 py-3 text-xs font-bold uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">upload</span>
              Upload CIF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".cif"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadError && (
              <p className="max-w-xs text-right text-xs text-rose-600 dark:text-rose-400">
                {uploadError}
              </p>
            )}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: List of structures */}
          <div className="enterprise-panel flex h-[600px] flex-col overflow-hidden lg:col-span-1">
            <div className="border-b border-gray-200 bg-gray-50 p-4 font-headline font-bold text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
              My Structures
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {structures.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`group cursor-pointer rounded-lg border p-4 transition-all hover:-translate-y-0.5 ${
                    s.id === selectedId
                      ? "border-gray-900 bg-gray-50 dark:border-neutral-100 dark:bg-neutral-800/60"
                      : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-headline font-bold text-gray-900 dark:text-neutral-100">
                      {s.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        s.status === "Analyzed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : s.status === "Pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-gray-500 dark:text-neutral-400">
                    {s.system} &bull; {s.atoms} atoms &bull;{" "}
                    {s.volume.toFixed(2)} Å³
                  </p>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(s.id);
                      }}
                      className="enterprise-button-secondary flex-1 py-1.5 text-xs"
                    >
                      View
                    </button>
                    <button className="enterprise-button-secondary flex-1 py-1.5 text-xs">
                      Calculate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Viewer */}
          <div className="enterprise-panel relative flex h-[600px] flex-col overflow-hidden lg:col-span-2">
            <div className="z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 font-headline font-bold text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
              <span>3D Viewer: {selected.name}</span>
              <div className="flex items-center gap-2">
                <select
                  value={viewerStyle}
                  onChange={(e) => {
                    const style = e.target.value as "sphere" | "stick" | "line";
                    setViewerStyle(style);
                    controlsRef.current?.setStyle(style);
                  }}
                  className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  <option value="sphere">Ball & Stick</option>
                  <option value="stick">Stick</option>
                  <option value="line">Wireframe</option>
                </select>
                <button
                  onClick={() => controlsRef.current?.resetView()}
                  className="rounded bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  title="Reset View"
                >
                  <span className="material-symbols-outlined text-sm">
                    center_focus_strong
                  </span>
                </button>
                <button
                  onClick={() => {
                    setUnitCellOn((v) => !v);
                    controlsRef.current?.toggleUnitCell();
                  }}
                  className={`rounded p-1.5 transition-colors ${
                    unitCellOn
                      ? "bg-gray-900 text-white dark:bg-neutral-100 dark:text-gray-900"
                      : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  }`}
                  title="Toggle Unit Cell"
                >
                  <span className="material-symbols-outlined text-sm">
                    grid_4x4
                  </span>
                </button>
              </div>
            </div>

            {/* Name / shape / volume summary */}
            <div className="z-10 flex items-center gap-6 border-b border-gray-200 bg-white px-4 py-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <span className="text-gray-400 dark:text-neutral-500">
                  Name:{" "}
                </span>
                <span className="font-mono font-bold text-gray-900 dark:text-neutral-100">
                  {selected.name}
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-500">
                  Shape:{" "}
                </span>
                <span className="font-mono font-bold text-gray-900 dark:text-neutral-100">
                  {selected.system}
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-500">
                  Volume:{" "}
                </span>
                <span className="font-mono font-bold text-gray-900 dark:text-neutral-100">
                  {selected.volume.toFixed(2)} Å³
                </span>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-gray-100 dark:bg-neutral-950">
              <StructureViewer
                key={selected.id}
                cifData={selected.cif}
                backgroundColor="#f4f4f5"
                initialStyle="sphere"
                showUnitCell={unitCellOn}
                onViewerReady={(controls) => {
                  controlsRef.current = controls;
                }}
                onElementsResolved={(elements) => {
                  setLegend(elements);
                }}
              />

              {legend.length > 0 && (
                <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white/90 p-2.5 text-xs shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
                  {legend.map((entry) => (
                    <div
                      key={entry.symbol}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border border-black/10 dark:border-white/20"
                        style={{ backgroundColor: entry.color }}
                      ></span>
                      <span className="font-medium text-gray-700 dark:text-neutral-300">
                        {ELEMENT_NAMES[entry.symbol] ?? entry.symbol} (
                        {entry.symbol})
                      </span>
                      <span className="text-gray-400 dark:text-neutral-500">
                        &times;{entry.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
