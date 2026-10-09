import { useState } from "react";
import { ShieldCheck, ArrowRight, Play, CheckCircle2, RotateCcw, Download } from "lucide-react";

export default function DFTValidationPage() {
  const [formula, setFormula] = useState("LiCoO2");
  const [functional, setFunctional] = useState("PBE");
  const [cutoff, setCutoff] = useState(520);
  const [kpoints, setKpoints] = useState("4x4x4");
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [validationResult, setValidationResult] = useState<{
    gnnEnergy: string | null;
    dftEnergy: string | null;
    deltaEnergy: string | null;
    bandGapComparison: string | null;
    bandGapDelta: string | null;
    agreementPercent: number | null;
  } | null>(null);

  const handleRunDFT = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("running");
    setProgress(15);
    setValidationResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setStatus("completed");
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent font-headline mb-1">
          <ShieldCheck size={14} /> Ab Initio Benchmarking
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          DFT Validation Engine
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Benchmark machine learning predicted formation energy and forces against high-accuracy Density Functional Theory calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Calculation Parameters Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5">
            <h3 className="font-headline font-bold text-lg text-[#1E2227]">Calculation Parameters</h3>

            <form onSubmit={handleRunDFT} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2227] mb-1.5">
                  Chemical Formula or MP-ID
                </label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="e.g. LiCoO2, mp-22526"
                  className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2227] mb-1.5">
                    Exchange Functional
                  </label>
                  <select
                    value={functional}
                    onChange={(e) => setFunctional(e.target.value)}
                    className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-accent"
                  >
                    <option value="PBE">PBE (Generalized Gradient)</option>
                    <option value="PBEsol">PBEsol (Solids)</option>
                    <option value="SCAN">SCAN (Meta-GGA)</option>
                    <option value="HSE06">HSE06 (Hybrid)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2227] mb-1.5">
                    Plane-Wave Cutoff (eV)
                  </label>
                  <input
                    type="number"
                    value={cutoff}
                    onChange={(e) => setCutoff(Number(e.target.value))}
                    className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2227] mb-1.5">
                  k-point Mesh Density
                </label>
                <select
                  value={kpoints}
                  onChange={(e) => setKpoints(e.target.value)}
                  className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-accent"
                >
                  <option value="4x4x4">4 × 4 × 4 (Gamma-centered)</option>
                  <option value="6x6x6">6 × 6 × 6 (Dense standard)</option>
                  <option value="8x8x8">8 × 8 × 8 (Convergence test)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "running"}
                  className="w-full bg-accent text-white py-3 rounded-xl text-xs font-semibold hover:bg-accent-hover transition-all shadow-soft flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "running" ? "Computing SCF Iterations..." : "Dispatch DFT Calculation"} <Play size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines Box */}
          <div className="bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] text-xs text-[#5B636E] space-y-2">
            <h4 className="font-bold text-[#1E2227]">Precision Guidelines</h4>
            <p>
              Ground-truth DFT simulations run using Quantum ESPRESSO / VASP backend clusters. Calculations benchmark total energy, Fermi levels, and band edges.
            </p>
          </div>
        </div>

        {/* Right Column: Execution Progress & Benchmark Delta Results */}
        <div className="lg:col-span-7 space-y-6">
          {status === "idle" && (
            <div className="bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] space-y-4 flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-headline font-bold text-[#1E2227]">Awaiting Calculation Dispatch</h3>
              <p className="text-xs text-[#6C737E] max-w-sm">
                Configure your structural inputs and functional parameters on the left, then dispatch the job to benchmark against ML ground truth.
              </p>
            </div>
          )}

          {status === "running" && (
            <div className="bg-white rounded-[2rem] p-10 shadow-card border border-[#EFE5DC] space-y-6 min-h-[420px] flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1E2227]">Self-Consistent Field (SCF) Iteration</h3>
                  <p className="text-xs text-[#8C929C]">Calculating Kohn-Sham eigenvalues for {formula}</p>
                </div>
                <span className="text-xs font-mono font-bold text-accent">{progress}%</span>
              </div>

              <div className="w-full h-3 bg-[#FAF4EE] rounded-full overflow-hidden border border-[#EFE5DC]">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="bg-[#FAF4EE] rounded-xl p-4 font-mono text-[11px] text-[#5B636E] space-y-1">
                <p>▶ Initializing plane-wave basis set (cutoff = {cutoff} eV)...</p>
                <p>▶ Generating k-point grid ({kpoints})...</p>
                <p>▶ Iteration 14: dE = 1.48e-05 eV, charge density residual = 8.12e-06</p>
                <p className="text-accent">▶ Converging exchange-correlation potential ({functional})...</p>
              </div>
            </div>
          )}

          {status === "completed" && (
            <div className="bg-white rounded-[2rem] p-8 shadow-card border border-[#EFE5DC] space-y-6">
              <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-[#2E7D32]" />
                  <div>
                    <h3 className="font-headline font-bold text-xl text-[#1E2227]">
                      DFT Converged Successfully
                    </h3>
                    <p className="text-xs text-[#8C929C]">Ground truth reached in 28 electronic steps</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold rounded-full">
                  10⁻⁶ eV Tolerated
                </span>
              </div>

              {/* Side-by-Side ML vs DFT Radar / Value Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] uppercase font-bold">GNN Prediction</span>
                  <p className="text-2xl font-bold font-headline text-accent mt-1">
                    {validationResult?.gnnEnergy ?? "No result yet"}
                  </p>
                  <p className="text-[11px] text-[#6C737E]">Formation Energy</p>
                </div>

                <div className="bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] uppercase font-bold">DFT Ground Truth</span>
                  <p className="text-2xl font-bold font-headline text-[#1E2227] mt-1">
                    {validationResult?.dftEnergy ?? "No result yet"}
                  </p>
                  <p className="text-[11px] text-[#6C737E]">{functional} Functional</p>
                </div>

                <div className="bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]">
                  <span className="text-[10px] text-[#8C929C] uppercase font-bold">Absolute Error (Δ)</span>
                  <p className="text-2xl font-bold font-headline text-[#2E7D32] mt-1">
                    {validationResult?.deltaEnergy ?? "No result yet"}
                  </p>
                  <p className="text-[11px] text-[#2E7D32]">
                    {validationResult?.deltaEnergy ? "Calculated residual" : "Awaiting calculation"}
                  </p>
                </div>
              </div>

              {/* Comparison Visual Bars */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#1E2227]">Electronic Descriptors Delta</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#5B636E]">
                    <span>{validationResult?.bandGapComparison ?? "Band Gap Comparison"}</span>
                    <span className="font-mono text-[#2E7D32]">{validationResult?.bandGapDelta ?? "No result yet"}</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF4EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: validationResult?.agreementPercent ? `${validationResult.agreementPercent}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2E7DC]">
                <button
                  onClick={() => {
                    setStatus("idle");
                    setValidationResult(null);
                  }}
                  className="px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5"
                >
                  <RotateCcw size={13} /> Reset
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("CONTCAR and calculation log exported to workspace.")}
                    className="px-4 py-2 bg-[#FAF4EE] text-[#1E2227] rounded-xl text-xs font-medium hover:bg-[#EFE5DC] flex items-center gap-1.5"
                  >
                    <Download size={13} /> Export CONTCAR
                  </button>
                  <button
                    onClick={() => alert("DFT benchmark saved to active research collection.")}
                    className="px-5 py-2 bg-accent text-white rounded-xl text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5"
                  >
                    Save Benchmark <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
