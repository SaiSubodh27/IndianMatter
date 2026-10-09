import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Activity, Layers, Cpu, Box, Database } from "lucide-react";

export default function DashboardFeaturePanels() {
  const navigate = useNavigate();

  const features = [
    {
      id: "01",
      category: "DFT BENCHMARKING",
      icon: Cpu,
      title: "DFT Validation",
      subtitle: "Ab Initio Accuracy & Energy Discrepancy",
      desc: "Compare machine-learning surrogate predictions with Density Functional Theory ground truth. Quantify electronic energy residuals, SCF convergence limits, and structural relaxation trajectories across PBE, PBEsol, and SCAN functionals.",
      features: [
        "PBE, PBEsol & SCAN Functionals",
        "SCF Convergence (10⁻⁶ eV tolerance)",
        "Residual Energy Distribution",
        "Direct Ground-Truth Verification",
      ],
      path: "/app/dft",
      badge: "High Precision",
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-sm bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-800 mb-3">
              <span>ML vs. DFT Convergence</span>
              <span className="text-slate-500 text-[11px] font-normal">Formation energy and e_hull screening against DFT references.</span>
            </div>
            {/* Visual Bar Comparison */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>GNN Predicted Energy</span>
                  <span className="font-mono font-medium text-slate-800">-4.842 eV</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
                  <div className="h-full bg-amber-600 rounded" style={{ width: "88%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>DFT Ground Truth (PBE)</span>
                  <span className="font-mono font-medium text-slate-800">-4.860 eV</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
                  <div className="h-full bg-slate-800 rounded" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>SCF Convergence: 10⁻⁶ eV tolerance achieved</span>
          </div>
        </div>
      ),
    },
    {
      id: "02",
      category: "CRYSTAL SYNTHESIS",
      icon: Box,
      title: "CIF Generation",
      subtitle: "Automated Structure Synthesis & Wyckoff Mapping",
      desc: "Generate Crystallographic Information Files (CIF) from chemical composition, space group constraints, or prototype templates. Supports fractional site substitution, cation doping, and unit cell parameter refinement.",
      features: [
        "Composition to 3D Lattice",
        "Space Group Symmetry Mapping",
        "Wyckoff Position Optimizer",
        "Standard CIF Export",
      ],
      path: "/app/cif-gen",
      badge: "Structure Engine",
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-sm bg-slate-50 rounded-lg p-5 border border-slate-200 text-center">
            <div className="inline-block p-3 bg-white rounded-lg border border-slate-200 mb-3 shadow-xs">
              <svg viewBox="0 0 48 48" className="w-16 h-16 stroke-slate-700 fill-none stroke-[1.5]">
                <polygon points="24,6 38,14 38,30 24,38 10,30 10,14" />
                <line x1="24" y1="6" x2="24" y2="38" className="stroke-slate-300 stroke-dashed" />
                <line x1="10" y1="14" x2="38" y2="30" className="stroke-slate-300 stroke-dashed" />
              </svg>
            </div>
            <div className="font-mono text-xs font-semibold text-slate-800">
              LiCoO₂ • R-3m (No. 166)
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              a = 2.816 Å, c = 14.052 Å, α = 90°, γ = 120°
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "03",
      category: "NEURAL INFERENCE",
      icon: Activity,
      title: "Property Prediction",
      subtitle: "Multi-Property Graph Neural Networks",
      desc: "Evaluate fundamental physical and electrochemical descriptors with sub-second surrogate models. Predict band gaps, formation energies, and ionic conductivities with calibrated 95% uncertainty intervals.",
      features: [
        "GNN & MLIP Inference Pipeline",
        "Ionic Conductivity & Band Gap",
        "Formation Energy & Stability",
        "Calibrated Uncertainty Bounds",
      ],
      path: "/app/predict",
      badge: "Surrogate Model",
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center items-center p-6 space-y-3">
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Band Gap</span>
              <p className="text-lg font-mono font-bold text-slate-900 mt-0.5">2.45 eV</p>
              <span className="text-[10px] text-emerald-700 font-mono">± 0.04 eV</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Formation E</span>
              <p className="text-lg font-mono font-bold text-slate-900 mt-0.5">-2.18 eV</p>
              <span className="text-[10px] text-emerald-700 font-medium">Convex Hull Stable</span>
            </div>
          </div>
          <div className="w-full max-w-xs bg-white rounded-lg p-2.5 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Backbone Model</span>
            <span className="font-semibold text-slate-800 font-mono text-[11px]">M3GNet / ALIGNN</span>
          </div>
        </div>
      ),
    },
    {
      id: "04",
      category: "CRYSTALLOGRAPHY",
      icon: Layers,
      title: "Structure Exploration",
      subtitle: "3D Unit Cell & Coordination Geometry",
      desc: "Examine complete atomic coordinates, coordination polyhedra, and crystallographic unit cells in real-time WebGL. Inspect bond lengths, toggle periodic boundary repetitions, and verify Wyckoff occupancy.",
      features: [
        "WebGL 3D Lattice Canvas",
        "Ball-and-Stick & Polyhedral Modes",
        "Interatomic Bond Measurement",
        "Lattice Vector & Volume Inspector",
      ],
      path: "/app/materials",
      badge: "3D Visualizer",
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-sm bg-slate-50 rounded-lg p-5 border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-lg border border-slate-200 mb-2">
              <Layers size={36} className="text-slate-700" />
            </div>
            <div className="font-mono text-xs font-semibold text-slate-800">
              Interactive Coordinate Inspector
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Real-time P1 / standard Wyckoff cell rotations
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "05",
      category: "HIGH-THROUGHPUT SCREENING",
      icon: Database,
      title: "Batch Prediction",
      subtitle: "Parallel Candidate Evaluation Pipeline",
      desc: "Run multi-structure screening across candidate libraries. Upload multi-structure CIF archives, configure threshold filters for stability and conductivity, and export consolidated reports.",
      features: [
        "Upload Up to 500 CIF Structures",
        "Automated Crystallographic Validation",
        "Parallel Multi-Model Execution",
        "Bulk CSV, JSON & ZIP Export",
      ],
      path: "/app/batch",
      badge: "High Throughput",
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center items-center p-6 space-y-3">
          <div className="w-full max-w-xs bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Batch Screening Queue</span>
              <span className="text-amber-800 font-mono text-[11px]">248 / 248 Processed</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
              <div className="h-full bg-amber-600 rounded w-full" />
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
              <span>Candidates: 248 structures</span>
              <span className="text-emerald-700 font-semibold">100% Parsed</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 py-2">
      {features.map((tool) => {
        const Icon = tool.icon;
        return (
          <div
            key={tool.id}
            className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 hover:border-slate-300 transition-colors"
          >
            {/* Left Content Area */}
            <div className="w-full lg:w-3/5 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-slate-100 rounded text-slate-700">
                  <Icon size={16} />
                </span>
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase">
                  {tool.category} • {tool.id}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded border border-slate-200 font-mono">
                  {tool.badge}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 tracking-tight">
                  {tool.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  {tool.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tool.desc}
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {tool.features.map((feat) => (
                  <span
                    key={feat}
                    className="px-2.5 py-1 bg-slate-50 rounded text-xs font-medium text-slate-700 border border-slate-200"
                  >
                    {feat}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(tool.path)}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Open {tool.title} <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right Visual Area */}
            <div className="w-full lg:w-2/5 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
              {tool.renderVisual()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
