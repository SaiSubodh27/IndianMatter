import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
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
  FlaskConical,
} from "lucide-react";

const featuresData = [
  {
    id: "dft",
    indicator: "01 / 05",
    category: "Prediction & Validation",
    title: (
      <>
        DFT<br />Validation
      </>
    ),
    description: "Compare ML-predicted properties with high-accuracy DFT calculations for reliable material insights.",
    chips: [
      { icon: Box, label: "Structure Optimization" },
      { icon: BarChart2, label: "Energy Calculation" },
      { icon: Layers, label: "Electronic Properties" },
      { icon: ShieldCheck, label: "Stability Analysis" }
    ],
    accent: "#D47E30",
    hoverAccent: "#B8671E",
    link: "/app/dft",
  },
  {
    id: "cif",
    indicator: "02 / 05",
    category: "Structure & File Generation",
    title: (
      <>
        CIF<br />Generation
      </>
    ),
    description: "Generate CIF files from chemical formulas or existing structures. Supports doped structures and material families.",
    chips: [
      { icon: FileText, label: "Formula to CIF" },
      { icon: Atom, label: "Doped Structures" },
      { icon: Settings, label: "Structure Optimization" },
      { icon: Database, label: "Multiple Formats" }
    ],
    accent: "#2563EB",
    hoverAccent: "#1D4ED8",
    link: "/app/cif-gen",
  },
  {
    id: "predict",
    indicator: "03 / 05",
    category: "Property Prediction",
    title: (
      <>
        Property<br />Prediction
      </>
    ),
    description: "Predict key material properties using state-of-the-art graph neural network models.",
    chips: [
      { icon: Activity, label: "Ionic Conductivity" },
      { icon: BarChart2, label: "Band Gap" },
      { icon: ShieldCheck, label: "Formation Energy" },
      { icon: Cpu, label: "Multiple Models" }
    ],
    accent: "#059669",
    hoverAccent: "#047857",
    link: "/app/predict",
  },
  {
    id: "structures",
    indicator: "04 / 05",
    category: "Structure Visualization",
    title: (
      <>
        Structure<br />Visualization
      </>
    ),
    description: "Real-time 3D crystallographic lattice viewer with rotate, zoom, bond, and unit-cell controls.",
    chips: [
      { icon: Box, label: "3D WebGL Canvas" },
      { icon: Atom, label: "Coordination Polyhedra" },
      { icon: Settings, label: "Unit Cell Vectors" },
      { icon: Activity, label: "Bond Measurements" }
    ],
    accent: "#7C3AED",
    hoverAccent: "#6D28D9",
    link: "/app/structures",
  },
  {
    id: "batch",
    indicator: "05 / 05",
    category: "High-Throughput Screening",
    title: (
      <>
        Batch<br />Prediction
      </>
    ),
    description: "Upload up to 500 CIF files for parallel automated property screening, syntax verification, and consolidated CSV/ZIP export.",
    chips: [
      { icon: Layers, label: "Multi-CIF Upload" },
      { icon: ShieldCheck, label: "Syntax Pre-Flight" },
      { icon: Cpu, label: "Parallel Evaluation" },
      { icon: Database, label: "Bulk ZIP Export" }
    ],
    accent: "#D97706",
    hoverAccent: "#B45309",
    link: "/app/batch",
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// SECTION — DASHBOARD PAGE
// Cinematic scroll carousel + 5 feature cards -> navigate to feature routes.
// ══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // For CIF Generation section state
  const [cifTab, setCifTab] = useState<"formula" | "existing">("formula");
  const [cifFormula, setCifFormula] = useState("Li3PS4");
  const [cifType, setCifType] = useState("Electrolyte");

  // Prevent default scroll on body to ensure cinematic scroll works perfectly
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle Wheel Scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling) return;
    
    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % featuresData.length);
    } else if (e.deltaY < 0) {
      setActiveIndex((prev) => (prev - 1 + featuresData.length) % featuresData.length);
    }
    
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1200); // 1.2s debounce to ensure "hard one scroll = one thing"
  };

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isScrolling) {
        setActiveIndex((prev) => (prev + 1) % featuresData.length);
      }
    }, 2000); // 2 second interval
    return () => clearInterval(interval);
  }, [isScrolling]);

  const current = featuresData[activeIndex] || featuresData[0];

  return (
    <div 
      className="w-full h-[calc(100vh-64px)] overflow-hidden max-w-[1200px] mx-auto px-6 sm:px-8 py-6 flex flex-col"
      onWheel={handleWheel}
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6 flex-shrink-0">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A9A9A] font-headline">
            Welcome Back
          </p>
          <h1 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight">
            Materials <span style={{ color: "#D47E30" }}>Discovery Platform</span>
          </h1>
          <p className="text-sm text-[#6B6B6B]">
            Computational screening, crystal structure synthesis, and property prediction.
          </p>
        </div>
      </div>

      {/* Cinematic Slide Section */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center relative h-full w-full">
        
        {/* LEFT: Fixed Info Section (Animated text transitions) */}
        <div className="lg:w-5/12 w-full h-full flex flex-col justify-center relative z-20">
          <div className="space-y-8 absolute w-full" key={current.id}>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p 
                className="text-[11px] font-bold tracking-[0.22em] uppercase font-headline transition-colors duration-500" 
                style={{ color: current.accent }}
              >
                {current.indicator} • {current.category}
              </p>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight leading-[1.1]">
                {current.title}
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-sm">
                {current.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
              {current.chips.map((chip, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#1A1A1A] bg-white border-[#EBEBEB]"
                >
                  <chip.icon size={14} strokeWidth={1.8} style={{ color: current.accent }} />
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <button
                onClick={() => navigate(current.link)}
                className="flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: current.accent }}
              >
                Launch Tool <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Cinematic Cards Stack */}
        <div className="lg:w-7/12 w-full h-full relative flex items-center justify-center pointer-events-none">
          
          {featuresData.map((feature, index) => {
            const offset = (index - activeIndex + featuresData.length) % featuresData.length;
            
            let transform = "";
            let opacity = 0;
            let filter = "";
            let zIndex = 0;

            if (offset === 0) {
              // Active
              transform = "translateY(0px) scale(1)";
              opacity = 1;
              filter = "blur(0px)";
              zIndex = 10;
            } else if (offset === 1 || offset === 2) {
              // Future (Coming from below/scaled up)
              transform = "translateY(80px) scale(1.05)";
              opacity = 0;
              filter = "blur(12px)";
              zIndex = 5;
            } else {
              // Past (Leaving above/scaled down)
              transform = "translateY(-80px) scale(0.95)";
              opacity = 0;
              filter = "blur(12px)";
              zIndex = 5;
            }

            const style = {
              transform,
              opacity,
              filter,
              zIndex,
              transition: "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
              pointerEvents: (offset === 0 ? "auto" : "none") as "auto" | "none"
            };

            return (
              <div key={feature.id} className="absolute inset-0 flex flex-col justify-center" style={style}>
                {renderCardContent(feature.id, cifTab, setCifTab, cifFormula, setCifFormula, cifType, setCifType)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderCardContent(
  id: string, 
  cifTab: string, setCifTab: any, 
  cifFormula: string, setCifFormula: any, 
  cifType: string, setCifType: any
) {
  if (id === "dft") {
    return (
      <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-8 border border-[#EBEBEB] shadow-sm space-y-6 mx-auto w-full max-w-lg">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#EBEBEB]">
          <span className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: "#D47E30" }} />
            Validation Metrics
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9A9A9A]">Status</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Band Gap", "Formation Energy", "Ionic Conductivity", "Space Group"].map((prop) => (
            <div key={prop} className="bg-white rounded-2xl p-4 border border-[#EBEBEB] flex flex-col gap-1.5 shadow-sm">
              <span className="text-xs font-medium text-[#6B6B6B]">{prop}</span>
              <span className="text-xs font-mono text-[#9A9A9A] italic">Awaiting CIF...</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-[#EBEBEB] flex items-center justify-center bg-white rounded-xl py-3 border border-dashed border-[#DDDBD8]">
           <div className="flex items-center gap-2 text-xs text-[#9A9A9A] font-medium">
              <FlaskConical size={14} />
              <span>Upload a structure to run DFT comparisons</span>
           </div>
        </div>
      </div>
    );
  }

  if (id === "cif") {
    return (
      <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-8 border border-[#EBEBEB] space-y-6 shadow-sm mx-auto w-full max-w-lg">
        <div className="space-y-4">
          <span className="text-sm font-bold text-[#1A1A1A] block">Input / Generate</span>
          <div className="flex border-b border-[#EBEBEB] text-xs gap-1">
            {("formula existing".split(" ")).map((tab) => (
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
          <div className="space-y-4 pt-2">
             <input
              type="text"
              value={cifFormula}
              onChange={(e) => setCifFormula(e.target.value)}
              placeholder="e.g. Li3PS4"
              className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors"
            />
            <select
              value={cifType}
              onChange={(e) => setCifType(e.target.value)}
              className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors appearance-none"
            >
              <option>Electrolyte</option>
              <option>Cathode</option>
              <option>Anode</option>
              <option>Solid-State Conductor</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm">
          <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider block mb-2 opacity-70">CIF Preview</span>
          <pre className="text-xs font-mono text-[#9A9A9A] leading-relaxed opacity-50 overflow-x-auto whitespace-pre">
{`data_${cifFormula}
_symmetry_space_group_name_H-M  "..."
_cell_length_a  ...
_cell_length_b  ...`}
          </pre>
        </div>
      </div>
    );
  }

  if (id === "predict") {
    return (
      <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-8 border border-[#EBEBEB] space-y-6 shadow-sm mx-auto w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-[#1A1A1A]">Available Prediction Models</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["GNN (Graph Neural Network)", "M3GNet", "CHGNet", "ALIGNN"].map((modelName) => (
            <div key={modelName} className="bg-white rounded-xl p-4 border border-[#EBEBEB] flex items-center justify-between shadow-sm">
               <span className="text-xs font-medium text-[#1A1A1A]">{modelName}</span>
               <div className="w-2 h-2 rounded-full bg-[#059669]" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-dashed border-[#C6F0D6] mt-6 flex flex-col items-center justify-center min-h-[180px] text-center gap-3">
           <div className="w-12 h-12 rounded-full bg-[#E6F8EF] flex items-center justify-center mb-1">
             <Activity size={20} style={{ color: "#059669" }} />
           </div>
           <p className="text-xs font-medium text-[#1A1A1A]">Ready for Prediction</p>
           <p className="text-xs text-[#6B6B6B] max-w-[200px]">Select a model and input to generate real-time property predictions.</p>
        </div>
      </div>
    );
  }

  if (id === "structures") {
    return (
      <div className="bg-[#FAFAF8] rounded-3xl p-2 border border-[#EBEBEB] shadow-sm h-[450px] flex flex-col relative overflow-hidden mx-auto w-full max-w-lg">
        <div className="absolute inset-0 bg-white border border-[#EBEBEB] rounded-[22px] m-4 flex flex-col items-center justify-center">
           <Box size={40} style={{ color: "#7C3AED" }} className="opacity-20 mb-4" />
           <span className="text-sm font-medium text-[#1A1A1A]">3D Crystallographic Viewer</span>
           <span className="text-xs text-[#9A9A9A] mt-2">Awaiting structure data...</span>
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
           <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#EBEBEB] shadow-sm pointer-events-auto">
              <span className="text-[10px] font-bold text-[#1A1A1A] block mb-2 uppercase tracking-wide">Controls</span>
              <div className="flex gap-2">
                {["Rotate", "Zoom", "Bonds"].map((c) => (
                   <div key={c} className="px-2.5 py-1.5 bg-[#F5F0FF] text-[#7C3AED] text-[10px] font-medium rounded-lg border border-[#DDD6FE]">{c}</div>
                ))}
              </div>
           </div>
           <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#EBEBEB] shadow-sm pointer-events-auto text-right">
              <span className="text-xs font-mono font-medium text-[#1A1A1A] block mb-0.5">Vol: -- Å³</span>
              <div className="text-[10px] text-[#6B6B6B]">Space Group: --</div>
           </div>
        </div>
      </div>
    );
  }

  if (id === "batch") {
    return (
      <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-8 border border-[#EBEBEB] space-y-6 shadow-sm mx-auto w-full max-w-lg">
        <div className="flex justify-between items-center text-sm mb-4">
          <span className="font-bold text-[#1A1A1A]">Batch Execution Queue</span>
          <span className="font-mono text-xs font-bold text-[#D97706] bg-[#FFFBEB] px-3 py-1 rounded-full">Ready</span>
        </div>
        <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-[#FDE68A] flex flex-col items-center justify-center text-center gap-4 min-h-[220px] transition-colors hover:bg-[#FFFBEB]/30 cursor-pointer">
           <div className="w-14 h-14 rounded-full bg-[#FFFBEB] flex items-center justify-center shadow-sm">
             <Database size={24} style={{ color: "#D97706" }} />
           </div>
           <div>
             <p className="text-sm font-semibold text-[#1A1A1A]">Drop up to 500 CIF files here</p>
             <p className="text-xs text-[#6B6B6B] mt-1.5">or click to browse from your computer</p>
           </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#EBEBEB] shadow-sm">
           <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
              <span className="font-medium text-[#6B6B6B]">Recent batches</span>
              <span>No recent activity</span>
           </div>
        </div>
      </div>
    );
  }
  
  return null;
}
