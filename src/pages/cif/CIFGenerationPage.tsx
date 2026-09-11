import { useState } from "react";
import { FileJson, ArrowRight, Download, Sparkles, Copy, Check, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CIFGenerationPage() {
  const navigate = useNavigate();
  const [formula, setFormula] = useState("Na3Zr2Si2PO12");
  const [prototype, setPrototype] = useState("NASICON");
  const [dopingElement, setDopingElement] = useState("Sc");
  const [dopingRatio, setDopingRatio] = useState("0.1");
  const [generated, setGenerated] = useState(true);
  const [copied, setCopied] = useState(false);

  const sampleCIF = `data_Na3Zr2Si2PO12_NASICON
_audit_creation_method 'IndianMatter Algorithmic Synthesis'
_cell_length_a 8.8043
_cell_length_b 8.8043
_cell_length_c 22.7585
_cell_angle_alpha 90.0000
_cell_angle_beta 90.0000
_cell_angle_gamma 120.0000
_symmetry_space_group_name_H-M 'R -3 c'
_symmetry_Int_Tables_number 167

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
Na1 Na 0.00000 0.00000 0.00000 1.0000
Na2 Na 0.63810 0.00000 0.25000 0.6667
Zr1 Zr 0.00000 0.00000 0.14720 0.9000
Sc1 Sc 0.00000 0.00000 0.14720 0.1000
Si1 Si 0.29410 0.00000 0.25000 0.6667
P1  P  0.29410 0.00000 0.25000 0.3333
O1  O  0.18340 0.16890 0.08640 1.0000
O2  O  0.18820 0.01630 0.19320 1.0000`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCIF);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sampleCIF], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formula}_${prototype}.cif`;
    a.click();
    URL.revokeObjectURL(url);
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
                setGenerated(true);
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
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: 3D Visualization & CIF Text Output */}
        <div className="lg:col-span-7 space-y-6">
          {generated && (
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5">
              <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4">
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1E2227]">
                    Generated CIF: {formula}
                  </h3>
                  <p className="text-xs text-[#8C929C]">Space Group: R -3 c (No. 167) • Trigonal</p>
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
                  onClick={() => navigate("/app/predict")}
                  className="px-5 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-medium hover:bg-black flex items-center gap-1.5"
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
