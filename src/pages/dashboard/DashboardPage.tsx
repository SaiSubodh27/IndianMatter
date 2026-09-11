import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  BarChart2,
  Layers,
  ShieldCheck,
  FileText,
  Atom,
  Settings,
  Database,
  Activity,
  Cpu,
  Check,
  FlaskConical,
  Zap,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   LayeredPanel — the core design primitive for each feature
   Back frame + Front panel = depth composition
───────────────────────────────────────────────────────────── */
function LayeredPanel({
  children,
  backColor = "linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",
  backBorder = "1px solid #EDE8E2",
  backRotation = 1.5,
}: {
  children: React.ReactNode;
  backColor?: string;
  backBorder?: string;
  backRotation?: number;
}) {
  return (
    <div className="relative">
      {/* Back frame */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: backColor,
          border: backBorder,
          borderRadius: "2.5rem",
          transform: `rotate(${backRotation}deg) scale(1.025) translateY(10px)`,
          transformOrigin: "center bottom",
          zIndex: 0,
        }}
      />
      {/* Front panel */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: "2.5rem",
          border: "1px solid #EBEBEB",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature chip
───────────────────────────────────────────────────────────── */
function FeatureChip({
  icon: Icon,
  label,
  accent = "#D47E30",
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  accent?: string;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#1A1A1A]"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#EBEBEB" }}
    >
      <Icon size={14} strokeWidth={1.8} style={{ color: accent }} />
      <span>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();

  // CIF panel state
  const [cifFormula, setCifFormula] = useState("Li3PS4");
  const [cifType, setCifType] = useState("Electrolyte");
  const [cifTab, setCifTab] = useState<"formula" | "existing">("formula");

  // Prediction model selection
  const [selectedModels, setSelectedModels] = useState<string[]>(["GNN"]);
  const toggleModel = (m: string) => {
    setSelectedModels((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-6 px-6 sm:px-8 py-8">

      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A9A9A] font-headline">
            Welcome Back 👋
          </p>
          <h1 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
            Let's Explore <span style={{ color: "#D47E30" }}>Materials</span>
          </h1>
          <p className="text-sm text-[#6B6B6B]">
            Powerful tools for a sustainable and innovative future.
          </p>
        </div>
        <div className="shrink-0 pointer-events-none select-none opacity-80">
          <img
            src="/assets/dash_mountains.png"
            alt=""
            aria-hidden="true"
            className="w-44 sm:w-52 h-auto object-contain"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PANEL 01 — DFT VALIDATION
          Button: RIGHT
      ══════════════════════════════════════════════ */}
      <LayeredPanel
        backColor="linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)"
        backBorder="1px solid #EDE8E2"
        backRotation={1.5}
      >
        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left: Info + chips */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1" style={{ color: "#D47E30" }}>
                01 / 05 — Prediction & Validation
              </p>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
                DFT<br />Validation
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm">
                Compare ML-predicted properties with high-accuracy DFT calculations for reliable material insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FeatureChip icon={Box} label="Structure Optimization" />
              <FeatureChip icon={BarChart2} label="Energy Calculation" />
              <FeatureChip icon={Layers} label="Electronic Properties" />
              <FeatureChip icon={ShieldCheck} label="Stability Analysis" />
            </div>
          </div>

          {/* Center: Crystal visual */}
          <div className="lg:col-span-3 flex items-center justify-center pointer-events-none select-none">
            <div className="w-48 sm:w-56">
              <img
                src="/assets/dash_c1_crystal.png"
                alt="DFT crystal specimen"
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 12px 28px rgba(141,90,43,0.20))" }}
              />
            </div>
          </div>

          {/* Right: Energy chart + properties + CTA */}
          <div className="lg:col-span-4 space-y-4">
            {/* Energy comparison chart */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#1A1A1A]">Energy Comparison</span>
                <ArrowUpRight size={13} className="text-[#9A9A9A]" />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#6B6B6B] mb-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D47E30" }} />
                  DFT Ground Truth
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  ML Prediction
                </span>
              </div>
              <svg viewBox="0 0 240 72" className="w-full h-16">
                <line x1="0" y1="18" x2="240" y2="18" stroke="#F2F2F0" strokeDasharray="3,3" />
                <line x1="0" y1="36" x2="240" y2="36" stroke="#F2F2F0" strokeDasharray="3,3" />
                <line x1="0" y1="54" x2="240" y2="54" stroke="#F2F2F0" strokeDasharray="3,3" />
                <path d="M 0 18 Q 60 44 120 54 T 240 60" fill="none" stroke="#D47E30" strokeWidth="2" strokeLinecap="round" />
                {[0,60,120,180,240].map((x,i) => {
                  const ys = [18,44,54,58,60];
                  return <circle key={i} cx={x} cy={ys[i]} r="3" fill="#D47E30" />;
                })}
                <path d="M 0 28 Q 60 48 120 56 T 240 59" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                {[0,60,120,180,240].map((x,i) => {
                  const ys = [28,48,56,58,59];
                  return <circle key={i} cx={x} cy={ys[i]} r="3" fill="#3B82F6" />;
                })}
              </svg>
            </div>

            {/* Key properties table */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-2">
              <span className="text-xs font-bold text-[#1A1A1A] block mb-2">Key Properties</span>
              {[
                ["Band Gap", "2.1 eV"],
                ["Formation Energy", "−1.25 eV/atom"],
                ["Ionic Conductivity", "1.2 × 10⁻⁵ S/cm"],
                ["Space Group", "P2₁/c"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-[#6B6B6B]">{k}</span>
                  <span className="font-medium text-[#1A1A1A] font-mono">{v}</span>
                </div>
              ))}
              <p className="text-[10px] text-[#9A9A9A] pt-1 italic">Demo values — use tool for real predictions</p>
            </div>

            {/* CTA — RIGHT aligned */}
            <div className="flex justify-end items-center gap-4">
              <button
                onClick={() => navigate("/app/dft")}
                className="text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors"
              >
                Learn More
              </button>
              <button
                onClick={() => navigate("/app/dft")}
                className="flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95"
                style={{ backgroundColor: "#D47E30", boxShadow: "0 6px 20px rgba(212,126,48,0.28)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#B8671E")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#D47E30")}
              >
                Launch Tool <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </LayeredPanel>

      {/* ══════════════════════════════════════════════
          PANEL 02 — CIF GENERATION
          Button: LEFT
      ══════════════════════════════════════════════ */}
      <LayeredPanel
        backColor="linear-gradient(135deg, #EEF4FE 0%, #E6EFFD 100%)"
        backBorder="1px solid #D5E5FA"
        backRotation={-1.5}
      >
        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Right floats first in DOM but appears right visually */}
          <div className="lg:col-span-4 space-y-4 lg:order-3">
            {/* CIF Input card */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-3">
              <span className="text-xs font-bold text-[#1A1A1A] block">Input / Generate</span>
              {/* Tabs */}
              <div className="flex border-b border-[#EBEBEB] text-xs gap-1">
                {(["formula", "existing"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCifTab(tab)}
                    className="pb-1.5 font-semibold text-xs border-b-2 mr-3 transition-all capitalize"
                    style={{
                      borderColor: cifTab === tab ? "#2563EB" : "transparent",
                      color: cifTab === tab ? "#2563EB" : "#9A9A9A",
                    }}
                  >
                    {tab === "formula" ? "From Formula" : "From CIF"}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={cifFormula}
                onChange={(e) => setCifFormula(e.target.value)}
                placeholder="e.g. Li3PS4"
                aria-label="Chemical formula"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors"
              />
              <div>
                <label className="block text-[11px] text-[#6B6B6B] mb-1">Material Type</label>
                <select
                  value={cifType}
                  onChange={(e) => setCifType(e.target.value)}
                  aria-label="Material type"
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors"
                >
                  <option>Electrolyte</option>
                  <option>Cathode</option>
                  <option>Anode</option>
                  <option>Solid-State Conductor</option>
                </select>
              </div>
              <button
                onClick={() => navigate("/app/cif-gen")}
                className="w-full bg-[#2563EB] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5"
              >
                Generate CIF <ArrowRight size={13} />
              </button>
            </div>

            {/* CIF preview */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]">
              <span className="text-xs font-bold text-[#1A1A1A] block mb-2">CIF Preview</span>
              <pre className="text-[10px] font-mono text-[#6B6B6B] leading-relaxed overflow-x-auto">
{`data_${cifFormula}
_symmetry_space_group_name_H-M  "P2_1/c"
_cell_length_a  8.693
_cell_length_b  10.222
_cell_length_c  6.345
_cell_angle_beta  90.000
...`}
              </pre>
            </div>
          </div>

          {/* Center: Crystal visual — lg:order-2 */}
          <div className="lg:col-span-3 flex items-center justify-center pointer-events-none select-none lg:order-2">
            <div className="w-48 sm:w-52">
              <img
                src="/assets/dash_c2_crystal.png"
                alt="CIF crystal specimen"
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 12px 28px rgba(37,99,235,0.15))" }}
              />
            </div>
          </div>

          {/* Left info — lg:order-1 */}
          <div className="lg:col-span-5 space-y-6 lg:order-1">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#2563EB]">
                02 / 05 — Structure & File Generation
              </p>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
                CIF<br />Generation
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm">
                Generate CIF files from chemical formulas or existing structures. Supports doped structures and material families.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FeatureChip icon={FileText} label="Formula to CIF" accent="#2563EB" />
              <FeatureChip icon={Atom} label="Doped Structures" accent="#2563EB" />
              <FeatureChip icon={Settings} label="Structure Optimization" accent="#2563EB" />
              <FeatureChip icon={Database} label="Multiple Formats" accent="#2563EB" />
            </div>

            {/* CTA — LEFT */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/app/cif-gen")}
                className="flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95"
                style={{ backgroundColor: "#2563EB", boxShadow: "0 6px 20px rgba(37,99,235,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2563EB")}
              >
                Launch Tool <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate("/app/cif-gen")}
                className="text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </LayeredPanel>

      {/* ══════════════════════════════════════════════
          PANEL 03 — PROPERTY PREDICTION
          Button: RIGHT
      ══════════════════════════════════════════════ */}
      <LayeredPanel
        backColor="linear-gradient(135deg, #EEFAF4 0%, #E6F8EF 100%)"
        backBorder="1px solid #C6F0D6"
        backRotation={1.5}
      >
        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#059669]">
                03 / 05 — Property Prediction
              </p>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
                Property<br />Prediction
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm">
                Predict key material properties using state-of-the-art graph neural network models.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FeatureChip icon={Activity} label="Ionic Conductivity" accent="#059669" />
              <FeatureChip icon={BarChart2} label="Band Gap" accent="#059669" />
              <FeatureChip icon={ShieldCheck} label="Formation Energy" accent="#059669" />
              <FeatureChip icon={Cpu} label="Multiple Models" accent="#059669" />
            </div>
          </div>

          {/* Center visual */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center pointer-events-none select-none gap-3">
            <p className="font-handwriting text-[#059669] text-2xl leading-tight -rotate-6 text-center">
              Predict<br />Accelerate<br />Innovate
            </p>
            <div className="w-44">
              <img
                src="/assets/hero_molecule_clean.png"
                alt="Property prediction molecules"
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 8px 20px rgba(5,150,105,0.14))" }}
              />
            </div>
          </div>

          {/* Right: Charts + model selection */}
          <div className="lg:col-span-4 space-y-4">
            {/* Scatter plot */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1A1A1A]">Ionic Conductivity</span>
                <ArrowUpRight size={13} className="text-[#9A9A9A]" />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#6B6B6B] mb-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D47E30" }} />True</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#059669]" />Predicted</span>
              </div>
              <svg viewBox="0 0 240 72" className="w-full h-16">
                {[[30,38],[60,48],[90,36],[120,52],[150,44],[180,40],[210,46]].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3.5" fill="#D47E30" opacity="0.75" />
                    <circle cx={x + 5} cy={y + (i % 2 === 0 ? -3 : 3)} r="3.5" fill="#059669" opacity="0.75" />
                  </g>
                ))}
              </svg>
            </div>

            {/* Model selection */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-2.5">
              <span className="text-xs font-bold text-[#1A1A1A] block">Model Selection</span>
              {["GNN (Graph Neural Network)", "M3GNet", "CHGNet", "ALIGNN"].map((modelName) => {
                const key = modelName.split(" ")[0];
                const checked = selectedModels.includes(key);
                return (
                  <label
                    key={modelName}
                    className="flex items-center gap-2.5 cursor-pointer py-0.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors select-none"
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                      onClick={() => toggleModel(key)}
                      style={{
                        backgroundColor: checked ? "#059669" : "white",
                        borderColor: checked ? "#059669" : "#DDDBD8",
                        color: "white",
                      }}
                    >
                      {checked && <Check size={10} strokeWidth={3} />}
                    </div>
                    {modelName}
                  </label>
                );
              })}
            </div>

            {/* CTA — RIGHT */}
            <div className="flex justify-end items-center gap-4">
              <button
                onClick={() => navigate("/app/predict")}
                className="text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors"
              >
                Learn More
              </button>
              <button
                onClick={() => navigate("/app/predict")}
                className="flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95"
                style={{ backgroundColor: "#059669", boxShadow: "0 6px 20px rgba(5,150,105,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#047857")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#059669")}
              >
                Launch Tool <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </LayeredPanel>

      {/* ══════════════════════════════════════════════
          PANEL 04 — STRUCTURE VISUALIZATION
          Button: LEFT
      ══════════════════════════════════════════════ */}
      <LayeredPanel
        backColor="linear-gradient(135deg, #F5F0FF 0%, #EEE6FF 100%)"
        backBorder="1px solid #DDD6FE"
        backRotation={-1.5}
      >
        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Right info */}
          <div className="lg:col-span-4 space-y-4 lg:order-3">
            <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#EBEBEB] space-y-3">
              <span className="text-xs font-bold text-[#1A1A1A] block">Active Lattice: LiCoO₂</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[["a", "2.816 Å"], ["b", "2.816 Å"], ["c", "14.054 Å"], ["Vol", "96.5 Å³"]].map(([k, v]) => (
                  <div key={k} className="bg-[#F2F2F0] rounded-xl px-3 py-2">
                    <span className="text-[#9A9A9A] text-[10px]">{k}</span>
                    <span className="block text-[#1A1A1A] font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <div className="pt-1 border-t border-[#EBEBEB]">
                <span className="text-[10px] text-[#9A9A9A]">Space Group: R -3 m</span>
              </div>
            </div>

            {/* Viewer controls mock */}
            <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]">
              <span className="text-xs font-bold text-[#1A1A1A] block mb-3">Viewer Controls</span>
              <div className="flex flex-wrap gap-1.5">
                {["Rotate", "Zoom", "Bonds", "Unit Cell", "Reset"].map((ctrl) => (
                  <span
                    key={ctrl}
                    className="text-[10px] px-2.5 py-1 rounded-lg border text-[#6B6B6B]"
                    style={{ borderColor: "#DDDBD8", backgroundColor: "white" }}
                  >
                    {ctrl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center visual */}
          <div className="lg:col-span-3 flex items-center justify-center pointer-events-none select-none lg:order-2">
            <div className="w-52 sm:w-56">
              <img
                src="/assets/about_lattice.png"
                alt="3D unit cell visualization"
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 12px 28px rgba(124,58,237,0.15))" }}
              />
            </div>
          </div>

          {/* Left info */}
          <div className="lg:col-span-5 space-y-6 lg:order-1">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#7C3AED]">
                04 / 05 — Structure Visualization
              </p>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
                Structure<br />Visualization
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm">
                Real-time 3D crystallographic lattice viewer with rotate, zoom, bond, and unit-cell controls.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FeatureChip icon={Box} label="3D WebGL Canvas" accent="#7C3AED" />
              <FeatureChip icon={Atom} label="Coordination Polyhedra" accent="#7C3AED" />
              <FeatureChip icon={Settings} label="Unit Cell Vectors" accent="#7C3AED" />
              <FeatureChip icon={Activity} label="Bond Measurements" accent="#7C3AED" />
            </div>

            {/* CTA — LEFT */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/app/structures")}
                className="flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95"
                style={{ backgroundColor: "#7C3AED", boxShadow: "0 6px 20px rgba(124,58,237,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#6D28D9")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#7C3AED")}
              >
                Launch Tool <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate("/app/structures")}
                className="text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </LayeredPanel>

      {/* ══════════════════════════════════════════════
          PANEL 05 — BATCH PREDICTION
          Button: RIGHT
      ══════════════════════════════════════════════ */}
      <LayeredPanel
        backColor="linear-gradient(135deg, #FFFBEB 0%, #FFF8E1 100%)"
        backBorder="1px solid #FDE68A"
        backRotation={1.5}
      >
        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#D97706]">
                05 / 05 — High-Throughput Screening
              </p>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
                Batch<br />Prediction
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm">
                Upload up to 500 CIF files for parallel automated property screening, syntax verification, and consolidated CSV/ZIP export.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FeatureChip icon={Layers} label="Multi-CIF Upload" accent="#D97706" />
              <FeatureChip icon={ShieldCheck} label="Syntax Pre-Flight" accent="#D97706" />
              <FeatureChip icon={Cpu} label="Parallel Evaluation" accent="#D97706" />
              <FeatureChip icon={Database} label="Bulk ZIP Export" accent="#D97706" />
            </div>
          </div>

          {/* Right: Batch execution visualization */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#EBEBEB] space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#1A1A1A]">Batch Execution Queue</span>
                <span className="font-mono font-bold text-[#D97706]">100% (248/248)</span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 bg-[#FEF3C7] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: "#D97706" }} />
              </div>

              {/* File status list */}
              <div className="space-y-1.5">
                {[
                  { file: "LLZO_cubic.cif", status: "Complete", ok: true },
                  { file: "NMC811_doped.cif", status: "Complete", ok: true },
                  { file: "LFP_orthorhombic.cif", status: "Complete", ok: true },
                  { file: "Na3Zr2Si2PO12.cif", status: "Complete", ok: true },
                ].map(({ file, status, ok }) => (
                  <div key={file} className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#6B6B6B]">{file}</span>
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: ok ? "#059669" : "#DC2626" }}>
                      <FlaskConical size={11} />
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[11px] pt-1 border-t border-[#EBEBEB]">
                <span className="text-[#6B6B6B]">Processed: 248 structures</span>
                <span className="font-semibold text-[#059669]">0 Errors</span>
              </div>
            </div>

            {/* CTA — RIGHT */}
            <div className="flex justify-end items-center gap-4">
              <button
                onClick={() => navigate("/app/batch")}
                className="text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors"
              >
                Learn More
              </button>
              <button
                onClick={() => navigate("/app/batch")}
                className="flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95"
                style={{ backgroundColor: "#D97706", boxShadow: "0 6px 20px rgba(217,119,6,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#B45309")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#D97706")}
              >
                Launch Tool <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </LayeredPanel>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
