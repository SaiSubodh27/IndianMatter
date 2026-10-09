import { useState } from "react";
import { FileJson, ArrowRight, Download, Sparkles, Copy, Check, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";

export default function CIFGenerationPage() {
  const navigate = useNavigate();
  const [formula, setFormula] = useState("Na3Zr2Si2PO12");
  const [prototype, setPrototype] = useState("NASICON");
  const [dopingElement, setDopingElement] = useState("Sc");
  const [dopingRatio, setDopingRatio] = useState("0.1");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cifString, setCifString] = useState("");
  const [spaceGroup, setSpaceGroup] = useState("");
  const [totalTime, setTotalTime] = useState<number | null>(null);

  const sampleCIF = cifString;

  const handleCopy = () => {
    if (!cifString) return;
    navigator.clipboard.writeText(cifString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!cifString) return;
    const blob = new Blob([cifString], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formula}_${prototype}.cif`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        formula: formula.trim(),
        space_group: undefined,
      };
      if (dopingElement.trim()) {
        payload.dopant_element = dopingElement.trim();
        payload.dopant_fraction = parseFloat(dopingRatio) || undefined;
        payload.host_formula = formula.trim();
      }
      const res = await fetch(`${API_BASE_URL}/cif/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || `Generation failed (HTTP ${res.status})`);
        setGenerated(false);
        return;
      }
      if (!data.success || !data.cif_string) {
        setError("Pipeline finished but returned no CIF. Try a different formula or check backend logs.");
        setGenerated(false);
        return;
      }
      setCifString(data.cif_string);
      setSpaceGroup(data.final_space_group || "");
      setTotalTime(data.total_elapsed_seconds ?? null);
      setGenerated(true);
    } catch (err) {
      setError(`Backend unreachable at ${API_BASE_URL}. Is the FastAPI server running?`);
      setGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <FileJson size={14} /> Structure Synthesis Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          CIF Generation & Doping
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Synthesize crystallographic structures from stoichiometric compositions or reference prototype families with automated Wyckoff site population.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5">
            <h3 className="font-headline font-bold text-lg text-[#1E2227]">Stoichiometric Synthesis</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#1E2227] mb-1.5">
                  Target Chemical Formula
                </label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="e.g. Na3Zr2Si2PO12, Li7La3Zr2O12"
                  className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2227] mb-1.5">
                  Reference Prototype Family
                </label>
                <select
                  value={prototype}
                  onChange={(e) => setPrototype(e.target.value)}
                  className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"
                >
                  <option value="NASICON">NASICON (Superionic Conductor)</option>
                  <option value="Garnet">Garnet (e.g. LLZO)</option>
                  <option value="Perovskite">Perovskite (ABX3)</option>
                  <option value="Spinel">Spinel (Fd-3m)</option>
                  <option value="Layered">Layered Oxide (R-3m)</option>
                </select>
              </div>

              {/* Doping Controls */}
              <div className="pt-2 border-t border-[#F2E7DC]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1E2227]">Site Substitution (Doping)</span>
                  <span className="text-[10px] text-[#F1641D] font-semibold">Optional</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#6C737E] mb-1">Dopant Element</label>
                    <input
                      type="text"
                      value={dopingElement}
                      onChange={(e) => setDopingElement(e.target.value)}
                      placeholder="e.g. Sc, Y, Al"
                      className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6C737E] mb-1">Fraction (x)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={dopingRatio}
                      onChange={(e) => setDopingRatio(e.target.value)}
                      className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98"
                >
                  Synthesize Crystallographic Unit Cell <Sparkles size={14} />
                  {loading ? "  (generating...)" : ""}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: 3D Visualization & CIF Text Output */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-xs">
              {error}
            </div>
          )}
          {generated && (
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5">
              <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4">
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1E2227]">
                    Generated CIF: {formula}
                  </h3>
                  <p className="text-xs text-[#8C929C]">
                    {spaceGroup ? `Space Group: ${spaceGroup}` : "Generated structure"}
                    {totalTime !== null ? ` • ${totalTime}s` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 border border-[#E9DFD4] rounded-xl text-xs text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5"
                  >
                    {copied ? <Check size={13} className="text-[#2E7D32]" /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy CIF"}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5 shadow-sm"
                  >
                    <Download size={13} /> Download .cif
                  </button>
                </div>
              </div>

              {/* Lattice Preview Banner */}
              <div className="bg-[#FAF4EE] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-40 h-40 flex items-center justify-center shrink-0">
                  <img
                    src="/assets/about_lattice.png"
                    alt="Lattice Preview"
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                </div>

                <div className="space-y-2 text-xs text-[#5F6771] flex-1">
                  <h4 className="font-bold text-[#1E2227] font-headline text-sm">Lattice Vectors & Volume</h4>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div>a: 8.804 Å</div>
                    <div>b: 8.804 Å</div>
                    <div>c: 22.758 Å</div>
                    <div>α: 90.0°</div>
                    <div>β: 90.0°</div>
                    <div>γ: 120.0°</div>
                  </div>
                  <p className="text-[11px] text-[#8C929C] pt-1">
                    Volume: 1528.2 Å³ • Cell Formula Units (Z): 6
                  </p>
                </div>
              </div>

              {/* CIF Code Block */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-[#1E2227] mb-2">
                  <span>Crystallographic Block Viewer</span>
                  <span className="text-[#8C929C] text-[11px] font-mono">CIF v1.1 Standard</span>
                </div>
                <pre className="bg-[#FAF4EE] border border-[#EFE5DC] rounded-xl p-4 text-[11px] font-mono text-[#1E2227] overflow-x-auto max-h-60 leading-relaxed">
                  {sampleCIF}
                </pre>
              </div>

              {/* Downstream Action Flow */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => navigate("/app/structures")}
                  className="px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5"
                >
                  <Eye size={14} /> Open in 3D Viewer
                </button>
                <button
                  onClick={() => navigate("/app/predict", { state: { cifString, formula } })}
                  disabled={!cifString}
                  className="px-5 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-medium hover:bg-black flex items-center gap-1.5 disabled:opacity-40"
                >
                  Predict Properties for Structure <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
