import { useState } from "react";
import {
  Atom,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
} from "lucide-react";
import { parseCifFile, ParsedStructure } from "../../lib/cifApi";

export default function StructureVizPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("LiCoO2");
  const [renderMode, setRenderMode] = useState<
    "ball-stick" | "space-fill" | "polyhedral"
  >("ball-stick");
  const [unitCellVisible, setUnitCellVisible] = useState(true);
  const [bondsVisible, setBondsVisible] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(15);
  const [parsedStructure, setParsedStructure] =
    useState<ParsedStructure | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const materials = [
    {
      id: "LiCoO2",
      name: "Lithium Cobalt Oxide",
      system: "Trigonal",
      spaceGroup: "R -3 m (No. 166)",
      params: {
        a: "2.816 Å",
        b: "2.816 Å",
        c: "14.054 Å",
        alpha: "90°",
        beta: "90°",
        gamma: "120°",
        vol: "96.5 Å³",
      },
      image: "/assets/about_lattice.png",
    },
    {
      id: "LiFePO4",
      name: "Lithium Iron Phosphate (Olivine)",
      system: "Orthorhombic",
      spaceGroup: "P n m a (No. 62)",
      params: {
        a: "10.334 Å",
        b: "6.010 Å",
        c: "4.693 Å",
        alpha: "90°",
        beta: "90°",
        gamma: "90°",
        vol: "291.5 Å³",
      },
      image: "/assets/about_lattice.png",
    },
    {
      id: "BaTiO3",
      name: "Barium Titanate (Perovskite)",
      system: "Tetragonal",
      spaceGroup: "P 4 m m (No. 99)",
      params: {
        a: "3.992 Å",
        b: "3.992 Å",
        c: "4.036 Å",
        alpha: "90°",
        beta: "90°",
        gamma: "90°",
        vol: "64.3 Å³",
      },
      image: "/assets/about_lattice.png",
    },
    {
      id: "LLZO",
      name: "Li7La3Zr2O12 (Garnet)",
      system: "Cubic",
      spaceGroup: "I a -3 d (No. 230)",
      params: {
        a: "12.968 Å",
        b: "12.968 Å",
        c: "12.968 Å",
        alpha: "90°",
        beta: "90°",
        gamma: "90°",
        vol: "2180.8 Å³",
      },
      image: "/assets/about_lattice.png",
    },
  ];

  const current =
    materials.find((m) => m.id === selectedMaterial) || materials[0];

  const handleCifUpload = async (file: File | undefined) => {
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
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
            <Atom size={14} /> Crystallographic Visualization
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
            3D Structure Visualizer
          </h1>
          <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
            Explore crystal unit cells, atomic coordination polyhedra, and
            fractional site coordinates with real-time measurement tools.
          </p>
        </div>

        {/* Upload Custom CIF Button */}
        <label className="cursor-pointer bg-white border border-[#E9DFD4] text-[#1E2227] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#FAF4EE] transition-all flex items-center gap-2 shadow-sm shrink-0">
          <Upload size={14} className="text-[#F1641D]" />
          <span>Upload Custom CIF</span>
          <input
            type="file"
            accept=".cif"
            className="hidden"
            onChange={(event) => handleCifUpload(event.target.files?.[0])}
          />
        </label>
      </div>

      {isParsing && (
        <div className="bg-white rounded-2xl border border-[#EDE8E2] px-5 py-4 text-sm text-[#713600]">
          Parsing CIF with pymatgen...
        </div>
      )}
      {parseError && (
        <div
          role="alert"
          className="bg-white rounded-2xl border border-red-200 px-5 py-4 text-sm text-red-700"
        >
          {parseError}
        </div>
      )}
      {parsedStructure && (
        <section
          className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EDE8E2] space-y-5"
          aria-label="Parsed CIF structure"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C05800]">
                Parsed CIF metadata
              </p>
              <h2 className="font-headline font-bold text-xl text-[#38240D]">
                {parsedStructure.formula}
              </h2>
              <p className="text-xs text-[#713600]">
                {parsedStructure.data_block} · {parsedStructure.space_group}{" "}
                (No. {parsedStructure.space_group_number})
              </p>
            </div>
            <span className="text-xs text-[#713600]">
              {parsedStructure.atom_count} atom sites
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono">
            {Object.entries(parsedStructure.lattice).map(([key, value]) => (
              <div
                key={key}
                className="bg-[#FDFBD4] rounded-xl px-3 py-2 text-[#38240D]"
              >
                <span className="block text-[10px] opacity-60">{key}</span>
                {value}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#713600]">
                  <th className="py-2 pr-4">Species</th>
                  <th className="py-2 pr-4">Fractional coordinates</th>
                  <th className="py-2">Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {parsedStructure.atoms.slice(0, 24).map((atom, index) => (
                  <tr
                    key={`${atom.species}-${index}`}
                    className="border-t border-[#F4EED4]"
                  >
                    <td className="py-2 pr-4 font-semibold">{atom.species}</td>
                    <td className="py-2 pr-4 font-mono">
                      {atom.fractional_coordinates.join(", ")}
                    </td>
                    <td className="py-2">
                      {atom.occupancy ?? "Not available in CIF"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedStructure.atoms.length > 24 && (
              <p className="pt-2 text-[11px] text-[#713600]">
                Showing the first 24 of {parsedStructure.atoms.length} parsed
                atom sites.
              </p>
            )}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main 3D Canvas Viewport (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6">
          {/* Viewport Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2E7DC] pb-4">
            {/* Material Presets Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedMaterial === m.id
                      ? "bg-[#F1641D] text-white shadow-sm"
                      : "bg-[#FAF4EE] text-[#5F6771] hover:text-[#1E2227]"
                  }`}
                >
                  {m.id}
                </button>
              ))}
            </div>

            {/* Representation Modes */}
            <div className="flex items-center gap-1 bg-[#FAF4EE] p-1 rounded-xl border border-[#EFE5DC]">
              <button
                onClick={() => setRenderMode("ball-stick")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  renderMode === "ball-stick"
                    ? "bg-white text-[#F1641D] shadow-sm font-semibold"
                    : "text-[#5F6771]"
                }`}
              >
                Ball & Stick
              </button>
              <button
                onClick={() => setRenderMode("space-fill")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  renderMode === "space-fill"
                    ? "bg-white text-[#F1641D] shadow-sm font-semibold"
                    : "text-[#5F6771]"
                }`}
              >
                Space-Filling
              </button>
              <button
                onClick={() => setRenderMode("polyhedral")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  renderMode === "polyhedral"
                    ? "bg-white text-[#F1641D] shadow-sm font-semibold"
                    : "text-[#5F6771]"
                }`}
              >
                Polyhedral
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Area */}
          <div className="relative w-full h-[460px] bg-[#FAF4EE]/70 rounded-3xl border border-[#EFE5DC] flex items-center justify-center overflow-hidden group">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#EFE5DC_1px,transparent_1px),linear-gradient(to_bottom,#EFE5DC_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

            {/* 3D Crystal Graphic with rotation */}
            <div
              className="relative w-72 h-72 flex items-center justify-center transition-transform duration-500 cursor-grab active:cursor-grabbing"
              style={{
                transform: `rotateY(${rotationAngle}deg) rotateX(${rotationAngle * 0.4}deg)`,
              }}
              onMouseDown={() => setRotationAngle((prev) => prev + 45)}
            >
              <img
                src={current.image}
                alt={current.name}
                className="max-h-full max-w-full object-contain drop-shadow-2xl select-none"
              />
            </div>

            {/* Floating Camera Toolbar */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-1.5 shadow-card border border-[#EFE5DC] flex items-center gap-1 text-[#1E2227]">
              <button
                onClick={() => setRotationAngle((prev) => prev + 30)}
                aria-label="Rotate"
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#FAF4EE] transition-colors"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => alert("Zoom in applied.")}
                aria-label="Zoom in"
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#FAF4EE] transition-colors"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => alert("Zoom out applied.")}
                aria-label="Zoom out"
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#FAF4EE] transition-colors"
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={() => setRotationAngle(15)}
                aria-label="Reset Camera"
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#FAF4EE] transition-colors text-xs font-mono"
              >
                1:1
              </button>
            </div>

            {/* Visual Flags */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setUnitCellVisible(!unitCellVisible)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all ${
                  unitCellVisible
                    ? "bg-white/90 border-[#F1641D] text-[#F1641D]"
                    : "bg-white/60 border-[#E9DFD4] text-[#8C929C]"
                }`}
              >
                Unit Cell Bounding Box
              </button>
              <button
                onClick={() => setBondsVisible(!bondsVisible)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all ${
                  bondsVisible
                    ? "bg-white/90 border-[#F1641D] text-[#F1641D]"
                    : "bg-white/60 border-[#E9DFD4] text-[#8C929C]"
                }`}
              >
                Coordination Bonds
              </button>
            </div>
          </div>
        </div>

        {/* Structural Inspector Side Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#F1641D] uppercase tracking-wider">
                {current.system} System
              </span>
              <h3 className="font-headline font-bold text-2xl text-[#1E2227] mt-1">
                {current.id}
              </h3>
              <p className="text-xs text-[#6C737E]">{current.name}</p>
              <p className="text-xs font-mono text-[#8C929C] mt-1">
                Space Group: {current.spaceGroup}
              </p>
            </div>

            {/* Lattice Parameter Grid */}
            <div className="space-y-3 pt-3 border-t border-[#F2E7DC]">
              <h4 className="text-xs font-bold text-[#1E2227]">
                Lattice Parameters
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#FAF4EE] p-2.5 rounded-xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] block">a</span>
                  <span className="font-semibold text-[#1E2227]">
                    {current.params.a}
                  </span>
                </div>
                <div className="bg-[#FAF4EE] p-2.5 rounded-xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] block">b</span>
                  <span className="font-semibold text-[#1E2227]">
                    {current.params.b}
                  </span>
                </div>
                <div className="bg-[#FAF4EE] p-2.5 rounded-xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] block">c</span>
                  <span className="font-semibold text-[#1E2227]">
                    {current.params.c}
                  </span>
                </div>
                <div className="bg-[#FAF4EE] p-2.5 rounded-xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] block">
                    Volume
                  </span>
                  <span className="font-semibold text-[#1E2227]">
                    {current.params.vol}
                  </span>
                </div>
              </div>
            </div>

            {/* Angles */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-[#FAF4EE] p-2 rounded-xl border border-[#EFE5DC]">
                <span className="text-[10px] text-[#8C929C] block">α</span>
                <span>{current.params.alpha}</span>
              </div>
              <div className="bg-[#FAF4EE] p-2 rounded-xl border border-[#EFE5DC]">
                <span className="text-[10px] text-[#8C929C] block">β</span>
                <span>{current.params.beta}</span>
              </div>
              <div className="bg-[#FAF4EE] p-2 rounded-xl border border-[#EFE5DC]">
                <span className="text-[10px] text-[#8C929C] block">γ</span>
                <span>{current.params.gamma}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F2E7DC]">
              <button
                onClick={() =>
                  alert(`Exported crystallographic snapshot for ${current.id}`)
                }
                className="w-full py-2.5 bg-[#FAF4EE] text-[#1E2227] border border-[#E9DFD4] rounded-xl text-xs font-semibold hover:bg-[#EFE5DC] transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} /> Export High-Res Snapshot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
