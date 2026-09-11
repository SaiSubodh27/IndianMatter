import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function DashboardFeaturePanels() {
  const navigate = useNavigate();

  const features = [
    {
      id: "01",
      category: "DFT VALIDATION",
      title: "DFT Validation",
      subtitle: "Ab Initio Accuracy Benchmarking",
      desc: "Compare machine learning predicted properties with high-accuracy Density Functional Theory calculations. Analyze electronic energy discrepancies, self-consistent field (SCF) convergence, and ionic relaxation stability across custom exchange-correlation functionals.",
      features: [
        "PBE, PBEsol & SCAN Functionals",
        "SCF Convergence Benchmarking",
        "Mean Absolute Error (MAE) Analysis",
        "Ground-Truth Energy & Forces",
      ],
      path: "/app/dft",
      buttonLeft: false, // Right
      rotation: "rotate-1",
      badge: "High Precision",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-sm bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] shadow-sm">
            <div className="flex justify-between items-center text-xs font-semibold text-[#1E2227] mb-3">
              <span>ML vs. DFT Convergence</span>
              <span className="text-[#F1641D] font-mono">ΔE = 0.018 eV/atom</span>
            </div>
            {/* Visual Bar Comparison */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-[#6C737E] mb-1">
                  <span>GNN Predicted Energy</span>
                  <span className="font-mono font-medium">-4.842 eV</span>
                </div>
                <div className="w-full h-2.5 bg-[#E8DFD4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F1641D] rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-[#6C737E] mb-1">
                  <span>DFT Ground Truth (PBE)</span>
                  <span className="font-mono font-medium">-4.860 eV</span>
                </div>
                <div className="w-full h-2.5 bg-[#E8DFD4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1E2227] rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8C929C]">
            <ShieldCheck size={14} className="text-[#2E7D32]" />
            <span>SCF Convergence: 10⁻⁶ eV tolerance achieved</span>
          </div>
        </div>
      ),
    },
    {
      id: "02",
      category: "CRYSTAL SYNTHESIS",
      title: "CIF Generation",
      subtitle: "Automated Structure Synthesis",
      desc: "Generate Crystallographic Information Files (CIF) from chemical formulas, space group symmetry constraints, or reference prototype families. Supports fractional site substitution, cation doping, and real-time unit cell parameter optimization.",
      features: [
        "Chemical Formula to 3D Lattice",
        "Space Group Symmetry Mapping",
        "Wyckoff Position Optimizer",
        "Standard CIF3 / CIF5 Export",
      ],
      path: "/app/cif-gen",
      buttonLeft: true, // Left
      rotation: "-rotate-1",
      badge: "Structure Engine",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-6">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <img
              src="/assets/about_lattice.png"
              alt="Generated Unit Cell"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
            <div className="absolute -bottom-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-[#E9DFD4] shadow-sm text-[11px] font-mono text-[#1E2227]">
              LiCoO₂ (R-3m)
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "03",
      category: "NEURAL INFERENCE",
      title: "Property Prediction",
      subtitle: "Multi-Property Graph Neural Networks",
      desc: "Leverage state-of-the-art graph neural networks and machine learning interatomic potentials to evaluate fundamental material descriptors with sub-second latency. Predict band gaps, formation energies, and ionic conductivities with calibrated 95% confidence intervals.",
      features: [
        "GNN & MLIP Inference Pipeline",
        "Ionic Conductivity & Band Gap",
        "Formation Energy & Stability",
        "Calibrated Uncertainty Bounds",
      ],
      path: "/app/predict",
      buttonLeft: false, // Right
      rotation: "rotate-1",
      badge: "Core Platform",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="bg-[#FAF4EE] p-3.5 rounded-xl border border-[#EFE5DC] text-center">
              <span className="text-[10px] text-[#8C929C] uppercase font-bold tracking-wider">Band Gap</span>
              <p className="text-xl font-bold font-headline text-[#1E2227] mt-1">2.45 eV</p>
              <span className="text-[10px] text-[#2E7D32]">± 0.04 eV</span>
            </div>
            <div className="bg-[#FAF4EE] p-3.5 rounded-xl border border-[#EFE5DC] text-center">
              <span className="text-[10px] text-[#8C929C] uppercase font-bold tracking-wider">Formation E</span>
              <p className="text-xl font-bold font-headline text-[#1E2227] mt-1">-2.18 eV</p>
              <span className="text-[10px] text-[#2E7D32]">Stable</span>
            </div>
          </div>
          <div className="w-full max-w-xs bg-white rounded-xl p-3 border border-[#EFE5DC] flex items-center justify-between text-xs">
            <span className="text-[#6C737E]">Model Architecture</span>
            <span className="font-semibold text-[#F1641D] font-mono">M3GNet / ALIGNN</span>
          </div>
        </div>
      ),
    },
    {
      id: "04",
      category: "3D CRYSTALLOGRAPHY",
      title: "Structure Visualization",
      subtitle: "Interactive WebGL Unit Cell Explorer",
      desc: "Examine complete atomic coordinates, coordination polyhedra, and crystallographic unit cells in real-time. Measure interatomic bond lengths and angles, toggle periodic boundary representations, and inspect Wyckoff sites dynamically.",
      features: [
        "Full WebGL 3D Lattice Canvas",
        "Ball-and-Stick & Polyhedral Modes",
        "Interatomic Bond Measurement",
        "Lattice Vector & Volume Inspector",
      ],
      path: "/app/structures",
      buttonLeft: true, // Left
      rotation: "-rotate-1",
      badge: "Real-time 3D",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <img
              src="/assets/hero_molecule_clean.png"
              alt="Interactive Structure"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-mono text-[#F1641D] border border-white">
              3D Interactive
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "05",
      category: "HIGH-THROUGHPUT SCREENING",
      title: "Batch Prediction",
      subtitle: "Parallel Candidate Evaluation",
      desc: "Perform parallel screening on libraries of hundreds of crystallographic structures simultaneously. Upload multi-structure archives (CIF3/CIF5), configure automated property filters, and export consolidated candidate reports in seconds.",
      features: [
        "Upload Up to 500 CIF Structures",
        "Automated Pre-flight Syntax Check",
        "Parallel Multi-Model Execution",
        "Bulk CSV, JSON & ZIP Export",
      ],
      path: "/app/batch",
      buttonLeft: false, // Right
      rotation: "rotate-1",
      badge: "High Throughput",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-3">
          <div className="w-full max-w-xs bg-white rounded-2xl p-4 border border-[#EFE5DC] shadow-sm space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1E2227]">Batch Execution Queue</span>
              <span className="text-[#F1641D] font-mono text-[11px]">100% (248/248)</span>
            </div>
            <div className="w-full h-2 bg-[#E8DFD4] rounded-full overflow-hidden">
              <div className="h-full bg-[#F1641D] rounded-full w-full" />
            </div>
            <div className="pt-2 border-t border-[#F2E7DC] flex justify-between text-[11px] text-[#6C737E]">
              <span>Processed Candidates: 248</span>
              <span className="text-[#2E7D32] font-semibold">0 Errors</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-32 py-4">
      {features.map((tool) => (
        <div
          key={tool.id}
          className="relative w-full min-h-[560px] lg:min-h-[640px] flex items-center justify-center"
        >
          {/* Back Frame (Translucent Layer for Depth) */}
          <div className="relative w-full max-w-5xl h-full min-h-[540px] lg:min-h-[600px] bg-white/50 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center overflow-hidden">
            
            {/* Ambient Background Corner Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FBE8D8]/40 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Front Content Card (Layered & Subtly Rotated) */}
            <div
              className={`absolute inset-y-6 sm:inset-y-8 w-[92%] sm:w-3/5 bg-white rounded-[2rem] shadow-[0_16px_45px_rgba(0,0,0,0.06)] p-8 sm:p-12 flex flex-col justify-between transition-transform transform hover:-translate-y-1.5 duration-300 z-10 border border-[#FAF1E8] ${
                tool.buttonLeft ? "right-6 sm:right-10 " + tool.rotation : "left-6 sm:left-10 " + tool.rotation
              }`}
            >
              <div>
                {/* Header Meta */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#F1641D] uppercase font-headline">
                    {tool.category} • {tool.id}
                  </span>
                  <span className="px-3 py-0.5 bg-[#FBE8D8] text-[#F1641D] text-[10px] font-bold rounded-full font-headline">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227] mb-1.5 tracking-tight">
                  {tool.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#8C929C] mb-4">
                  {tool.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-[#5F6771] leading-relaxed mb-6">
                  {tool.desc}
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feat) => (
                    <span
                      key={feat}
                      className="px-3 py-1 bg-[#FAF4EE] rounded-lg text-xs font-medium text-[#5B636E] border border-[#EFE5DC]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alternating Action Button Rhythm */}
              <div className={`mt-8 flex ${tool.buttonLeft ? "justify-start" : "justify-end"}`}>
                <button
                  onClick={() => navigate(tool.path)}
                  className="flex items-center gap-2.5 bg-[#F1641D] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#D9520F] transition-all shadow-[0_10px_25px_rgba(241,100,29,0.3)] hover:shadow-[0_14px_30px_rgba(241,100,29,0.4)] active:scale-95"
                >
                  Launch Tool <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Scientific Visual in Decorative Side Space */}
            <div
              className={`hidden sm:flex absolute w-2/5 h-full items-center justify-center p-8 ${
                tool.buttonLeft ? "left-0" : "right-0"
              }`}
            >
              {tool.renderVisual()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
