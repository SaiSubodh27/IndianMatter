import { useState, useEffect, useRef } from "react";
import {
  FileJson,
  ArrowRight,
  Download,
  Sparkles,
  Copy,
  Check,
  Eye,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  RefreshCw,
  Sliders,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";

// ── Preset 10-Material Test Bench (From Git CIF Generator) ──
interface PresetItem {
  id: string;
  label: string;
  formula: string;
  doped: boolean;
  title: string;
  host?: string;
  dopant?: string;
  site?: string;
  fraction?: number;
  codopants?: Array<{ dopant: string; site: string; fraction: number }>;
}

const PRESET_BENCH: PresetItem[] = [
  { id: "fe2o3", label: "Fe₂O₃", formula: "Fe2O3", doped: false, title: "Trigonal Oxide (Hematite)" },
  {
    id: "fe_ti_o3",
    label: "Fe₁.₉Ti₀.₁O₃",
    formula: "Fe1.9Ti0.1O3",
    doped: true,
    title: "Doped Oxide (Ti in Fe site)",
    host: "Fe2O3",
    dopant: "Ti",
    site: "Fe",
    fraction: 0.05,
  },
  {
    id: "fe_ti_cr_o3",
    label: "Fe₁.₈₅Ti₀.₁Cr₀.₀₅O₃",
    formula: "Fe1.85Ti0.1Cr0.05O3",
    doped: true,
    title: "Co-Doped Oxide (Ti & Cr in Fe site)",
    host: "Fe2O3",
    dopant: "Ti",
    site: "Fe",
    fraction: 0.05,
    codopants: [{ dopant: "Cr", site: "Fe", fraction: 0.025 }],
  },
  { id: "tio2", label: "TiO₂", formula: "TiO2", doped: false, title: "Polymorphic Oxide (Rutile/Anatase)" },
  { id: "nacl", label: "NaCl", formula: "NaCl", doped: false, title: "Rock-salt Halide" },
  { id: "si", label: "Si", formula: "Si", doped: false, title: "Diamond Cubic Semiconductor" },
  { id: "cu", label: "Cu", formula: "Cu", doped: false, title: "FCC Transition Metal" },
  { id: "al2o3", label: "Al₂O₃", formula: "Al2O3", doped: false, title: "Corundum Rhombohedral" },
  { id: "mos2", label: "MoS₂", formula: "MoS2", doped: false, title: "Layered 2D Dichalcogenide" },
  { id: "zno", label: "ZnO", formula: "ZnO", doped: false, title: "II-VI Wurtzite Semiconductor" },
  { id: "caf2", label: "CaF₂", formula: "CaF2", doped: false, title: "Alkaline-Earth Halide (Fluorite)" },
];

interface ElementData {
  symbol: string;
  name?: string;
  amount: number;
  weight_percent: number;
  atomic_mass?: number;
  atomic_number?: number;
}

interface CandidateSite {
  dopant?: string;
  replaced_species?: string;
  site?: string;
  strength?: string;
  reason?: string;
  questions?: string[];
}

interface ClassificationData {
  family?: string;
  structure_type?: string;
  material_class?: string;
  sites?: CandidateSite[];
  sublattice_spec?: {
    A?: Record<string, any>;
    B?: Record<string, any>;
  };
}

interface CoDopantEntry {
  dopant_element: string;
  host_site_species: string;
  dopant_fraction: string;
}

export default function CIFGenerationPage() {
  const navigate = useNavigate();

  // Core inputs
  const [formula, setFormula] = useState("Fe2O3");
  const [spaceGroup, setSpaceGroup] = useState("");
  const [activePreset, setActivePreset] = useState("Fe2O3");

  // Doping inputs
  const [dopingDrawerOpen, setDopingDrawerOpen] = useState(false);
  const [hostFormula, setHostFormula] = useState("");
  const [dopantElement, setDopantElement] = useState("");
  const [hostSiteSpecies, setHostSiteSpecies] = useState("");
  const [dopantFraction, setDopantFraction] = useState("");
  const [coDopants, setCoDopants] = useState<CoDopantEntry[]>([]);

  // Parse state (from /cif/api/parse-formula)
  const [parsing, setParsing] = useState(false);
  const [parseValid, setParseValid] = useState<boolean | null>(null);
  const [parsedElements, setParsedElements] = useState<ElementData[]>([]);
  const [chargeBalance, setChargeBalance] = useState<{
    state?: string;
    message?: string;
    detail?: string;
  } | null>(null);
  const [classification, setClassification] = useState<ClassificationData | null>(null);
  const [compoundClass, setCompoundClass] = useState<string | null>(null);
  const [isDopedDetected, setIsDopedDetected] = useState(false);
  const [detectedDopingText, setDetectedDopingText] = useState("");
  const [caseCorrection, setCaseCorrection] = useState<{
    corrected: boolean;
    suggestion?: string;
  } | null>(null);

  // Generation execution state
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [liveSeconds, setLiveSeconds] = useState("0.00");
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Results state
  const [cifString, setCifString] = useState("");
  const [resultSpaceGroup, setResultSpaceGroup] = useState("");
  const [resultSource, setResultSource] = useState("");
  const [resultRetrievedFrom, setResultRetrievedFrom] = useState("");
  const [copied, setCopied] = useState(false);

  // Lattice metrics parsed from generated CIF
  const [latticeMetrics, setLatticeMetrics] = useState<{
    a?: string;
    b?: string;
    c?: string;
    alpha?: string;
    beta?: string;
    gamma?: string;
    volume?: string;
  } | null>(null);

  // Debounced formula parser
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formula.trim()) {
        parseFormula(formula.trim());
      } else {
        setParseValid(null);
        setParsedElements([]);
        setChargeBalance(null);
        setClassification(null);
        setIsDopedDetected(false);
        setCaseCorrection(null);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [formula]);

  const parseFormula = async (targetFormula: string) => {
    setParsing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cif/api/parse-formula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula: targetFormula }),
      });

      if (!res.ok) {
        setParseValid(false);
        return;
      }

      const data = await res.json();
      setParseValid(data.valid);

      if (data.valid) {
        setParsedElements(data.elements || []);
        setChargeBalance(data.charge_balance || null);
        setClassification(data.classification || null);
        setCompoundClass(data.compound_class || null);

        // Doping detection
        if (data.is_doped && data.doping_spec) {
          setIsDopedDetected(true);
          const ds = data.doping_spec;
          const fracDisplay = ds.dopant_fraction_pct
            ? `${ds.dopant_fraction} (${ds.dopant_fraction_pct})`
            : ds.dopant_fraction || "?";
          setDetectedDopingText(
            `Doping detected: ${ds.dopant_species || "?"} → ${ds.host_site_species || "?"} site (${fracDisplay}) in host ${ds.host_formula || "matrix"}`
          );

          // Auto-fill doping fields if user hasn't explicitly customized
          if (!hostFormula && ds.host_formula) setHostFormula(ds.host_formula);
          if (!dopantElement && ds.dopant_species) setDopantElement(ds.dopant_species);
          if (!hostSiteSpecies && ds.host_site_species) setHostSiteSpecies(ds.host_site_species);
          if (!dopantFraction && ds.dopant_fraction !== undefined) setDopantFraction(String(ds.dopant_fraction));
        } else {
          setIsDopedDetected(false);
          setDetectedDopingText("");
        }

        // Case correction
        if (data.case_corrected && data.normalized_formula) {
          setCaseCorrection({ corrected: true, suggestion: data.normalized_formula });
        } else if (!data.valid && data.suggestion) {
          setCaseCorrection({ corrected: false, suggestion: data.suggestion });
        } else {
          setCaseCorrection(null);
        }
      } else {
        setParsedElements([]);
        setChargeBalance(data.charge_balance || null);
        setClassification(null);
        setIsDopedDetected(false);
        if (data.suggestion) {
          setCaseCorrection({ corrected: false, suggestion: data.suggestion });
        } else {
          setCaseCorrection(null);
        }
      }
    } catch {
      // Degrade gracefully
      setParseValid(false);
    } finally {
      setParsing(false);
    }
  };

  // Preset Selection
  const selectPreset = (preset: PresetItem) => {
    setActivePreset(preset.formula);
    setFormula(preset.formula);
    setSpaceGroup("");

    if (preset.doped) {
      setDopingDrawerOpen(true);
      setHostFormula(preset.host || "");
      setDopantElement(preset.dopant || "");
      setHostSiteSpecies(preset.site || "");
      setDopantFraction(preset.fraction !== undefined ? String(preset.fraction) : "");

      if (preset.codopants && preset.codopants.length > 0) {
        setCoDopants(
          preset.codopants.map((c) => ({
            dopant_element: c.dopant,
            host_site_species: c.site,
            dopant_fraction: String(c.fraction),
          }))
        );
      } else {
        setCoDopants([]);
      }
    } else {
      setDopingDrawerOpen(false);
      setHostFormula("");
      setDopantElement("");
      setHostSiteSpecies("");
      setDopantFraction("");
      setCoDopants([]);
    }
  };

  // Co-Dopant management
  const addCoDopant = () => {
    setCoDopants((prev) => [
      ...prev,
      { dopant_element: "", host_site_species: "", dopant_fraction: "" },
    ]);
  };

  const removeCoDopant = (index: number) => {
    setCoDopants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCoDopant = (index: number, field: keyof CoDopantEntry, value: string) => {
    setCoDopants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Reset / Clear
  const handleClear = () => {
    setFormula("");
    setActivePreset("");
    setSpaceGroup("");
    setHostFormula("");
    setDopantElement("");
    setHostSiteSpecies("");
    setDopantFraction("");
    setCoDopants([]);
    setParsedElements([]);
    setChargeBalance(null);
    setClassification(null);
    setIsDopedDetected(false);
    setCaseCorrection(null);
    setCifString("");
    setGenerated(false);
    setError(null);
  };

  // Extract lattice parameters from CIF text
  const parseLatticeFromCIF = (cif: string) => {
    const extract = (regex: RegExp) => {
      const match = cif.match(regex);
      return match ? match[1].trim() : undefined;
    };
    return {
      a: extract(/_cell_length_a\s+([0-9.]+)/),
      b: extract(/_cell_length_b\s+([0-9.]+)/),
      c: extract(/_cell_length_c\s+([0-9.]+)/),
      alpha: extract(/_cell_angle_alpha\s+([0-9.]+)/),
      beta: extract(/_cell_angle_beta\s+([0-9.]+)/),
      gamma: extract(/_cell_angle_gamma\s+([0-9.]+)/),
      volume: extract(/_cell_volume\s+([0-9.]+)/),
    };
  };

  // Generate CIF execution
  const handleGenerate = async () => {
    if (!formula.trim()) return;

    setGenerating(true);
    setError(null);
    setGenerated(false);
    startTimeRef.current = performance.now();
    setLiveSeconds("0.00");

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = ((performance.now() - startTimeRef.current) / 1000).toFixed(2);
      setLiveSeconds(elapsed);
    }, 60);

    try {
      const payloadCoDopants = coDopants
        .filter((c) => c.dopant_element.trim() && c.dopant_fraction.trim())
        .map((c) => ({
          dopant_element: c.dopant_element.trim(),
          host_site_species: c.host_site_species.trim() || undefined,
          dopant_fraction: parseFloat(c.dopant_fraction) || 0,
        }));

      const isDopedExplicit = Boolean(
        dopantElement.trim() ||
        hostFormula.trim() ||
        payloadCoDopants.length > 0 ||
        isDopedDetected
      );

      const payload: Record<string, any> = {
        formula: formula.trim(),
        space_group: spaceGroup.trim() || null,
        is_doped_hint: isDopedExplicit ? true : null,
        host_formula: hostFormula.trim() || null,
        dopant_element: dopantElement.trim() || null,
        host_site_species: hostSiteSpecies.trim() || null,
        dopant_fraction: dopantFraction ? parseFloat(dopantFraction) : null,
        co_dopants: payloadCoDopants,
      };

      const res = await fetch(`${API_BASE_URL}/cif/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(timerRef.current);
      const totalSec = ((performance.now() - startTimeRef.current) / 1000).toFixed(2);
      setLiveSeconds(totalSec);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Pipeline server error (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (!data.success || !data.cif_string) {
        throw new Error(
          data.notes || "Pipeline was unable to generate a valid CIF structure for this composition."
        );
      }

      setCifString(data.cif_string);
      setResultSpaceGroup(data.final_space_group || "");
      setResultSource(data.source || "Generated");
      setResultRetrievedFrom(data.retrieved_from || "CrystaLLM & Relaxation Pipeline");
      setElapsedTime(data.total_elapsed_seconds ?? parseFloat(totalSec));
      setLatticeMetrics(parseLatticeFromCIF(data.cif_string));
      setGenerated(true);
    } catch (err: any) {
      clearInterval(timerRef.current);
      setError(err.message || `Backend unreachable at ${API_BASE_URL}. Ensure FastAPI is running.`);
      setGenerated(false);
    } finally {
      setGenerating(false);
    }
  };

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
    a.download = `${formula.trim() || "crystal"}.cif`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent font-headline mb-1">
            <FileJson size={14} /> CIF Architect // Crystallographic Synthesis
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
            Crystallographic Structure Pipeline
          </h1>
          <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
            Multi-database search (MP, OQMD, COD, JARVIS), site-selective doping substitution, CrystaLLM generation, symmetry analysis & MACE-MP-0 float64 relaxation.
          </p>
        </div>

        {/* Live execution timer badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E9DFD4] rounded-xl text-xs font-mono font-medium text-[#1E2227] shadow-sm">
            <Clock size={13} className="text-accent" />
            <span>EXEC:</span>
            <span className="font-bold">{generating ? `${liveSeconds}s` : elapsedTime ? `${elapsedTime.toFixed(2)}s` : "0.00s"}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#FAF4EE] border border-[#EFE5DC] rounded-xl text-[11px] font-mono text-[#5F6771] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>float64 precision</span>
          </div>
        </div>
      </div>

      {/* ── Central Query Hero (Direct from Git CIF Generator) ── */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6C737E]">
          What would you like to build?
        </label>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="Fe2O3   ·   La0.7Sr0.3MnO3   ·   Zn0.05Fe1.95O4   ·   or describe in words"
              className="w-full bg-[#FAF4EE]/60 border border-[#E9DFD4] rounded-2xl py-3.5 px-5 text-sm sm:text-base font-mono text-[#1E2227] outline-none focus:border-accent transition-colors"
            />
            {formula && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8C929C] hover:text-[#1E2227]"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !formula.trim()}
            className="px-6 py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft transition-all shrink-0 active:scale-98"
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating CIF...</span>
              </>
            ) : (
              <>
                <span>Generate CIF</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Case correction / suggestion notice */}
        {caseCorrection && caseCorrection.suggestion && (
          <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              <span>
                {caseCorrection.corrected ? "Auto-capitalized to " : "Did you mean "}
                <strong>{caseCorrection.suggestion}</strong>?
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormula(caseCorrection.suggestion!);
                setCaseCorrection(null);
              }}
              className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg font-semibold text-xs text-amber-900"
            >
              Use Formula
            </button>
          </div>
        )}

        {/* Live Intent Bar (Plain-language interpretation from engine) */}
        <div className="p-3.5 bg-[#FAF4EE]/70 rounded-xl border border-[#EFE5DC] flex flex-wrap items-center gap-2 text-xs text-[#5F6771]">
          <span className="font-semibold text-[#1E2227]">Intent & Reading:</span>
          {parsing ? (
            <span className="text-[#8C929C] italic">Interpreting formula...</span>
          ) : parseValid ? (
            <>
              {classification?.family && classification.family !== "unknown" && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
                  {classification.family}
                </span>
              )}
              {compoundClass && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
                  {compoundClass}
                </span>
              )}
              {isDopedDetected ? (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-accent font-medium border border-orange-200">
                  Doped solid solution
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                  Undoped stoichiometric
                </span>
              )}
              {chargeBalance && (
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium border ${
                    chargeBalance.state === "balanced"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : chargeBalance.state === "unbalanced"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {chargeBalance.state === "balanced"
                    ? "Charge balanced"
                    : chargeBalance.state === "unbalanced"
                    ? "Charge unbalanced"
                    : "Oxidation states uncertain"}
                </span>
              )}
              {spaceGroup && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200 font-mono">
                  SG: {spaceGroup}
                </span>
              )}
            </>
          ) : formula.trim() ? (
            <span className="text-red-600">Formula not recognised or unparseable.</span>
          ) : (
            <span className="text-[#8C929C]">Start typing a chemical formula to see interpretation...</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Test Bench Presets & Parameter Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* 10-Material Test Bench */}
          <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E2227]">
                10-Material Test Bench
              </span>
              <span className="text-[10px] font-semibold text-[#8C929C] bg-[#FAF4EE] px-2 py-0.5 rounded-full border border-[#EFE5DC]">
                10 Structural Classes
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_BENCH.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPreset(p)}
                  title={p.title}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    activePreset === p.formula
                      ? "bg-[#1E2227] text-white shadow-sm"
                      : "bg-[#FAF4EE] text-[#5F6771] hover:bg-[#F2E7DC] hover:text-[#1E2227]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Search Space Elements Breakdown */}
          <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E2227]">
                Active Search Space Elements
              </span>
              <span className="text-[10px] font-semibold text-accent bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 font-mono">
                {parsedElements.length} Elements
              </span>
            </div>

            {/* Element Chips */}
            <div className="flex flex-wrap gap-2">
              {parsedElements.length > 0 ? (
                parsedElements.map((el) => (
                  <div
                    key={el.symbol}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl text-xs font-mono"
                  >
                    <span className="font-bold text-[#1E2227]">{el.symbol}</span>
                    <span className="text-[#8C929C]">×{el.amount}</span>
                    <span className="text-[10px] text-accent font-semibold">{el.weight_percent}% wt</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#8C929C] italic">No active elements parsed</div>
              )}
            </div>

            {/* DB Matrix Label */}
            <div className="text-xs text-[#5F6771] font-mono flex items-center justify-between pt-2 border-t border-[#F2E7DC]">
              <span>DB Matrix:</span>
              <strong className="text-[#1E2227]">
                [{parsedElements.map((e) => e.symbol).join(", ") || " "}]
              </strong>
            </div>

            {/* Balance Indicator Row */}
            {chargeBalance && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                  chargeBalance.state === "balanced"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : chargeBalance.state === "unbalanced"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {chargeBalance.state === "balanced" ? (
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  )}
                  <span>{chargeBalance.message || "Charge check completed"}</span>
                </div>
              </div>
            )}

            {/* Doping Detected Alert */}
            {isDopedDetected && detectedDopingText && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-accent flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{detectedDopingText}</span>
              </div>
            )}
          </div>

          {/* Compound Classification Panel (Family, Candidate Sites) */}
          {classification && classification.family && classification.family !== "unknown" && (
            <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E2227]">
                Compound Classification & Sites
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#FAF4EE] rounded-xl">
                  <span className="text-[10px] text-[#8C929C] block">Family</span>
                  <strong className="text-[#1E2227] font-semibold">{classification.family}</strong>
                </div>
                <div className="p-2.5 bg-[#FAF4EE] rounded-xl">
                  <span className="text-[10px] text-[#8C929C] block">Structure Type</span>
                  <strong className="text-[#1E2227] font-semibold">
                    {classification.structure_type || "Standard"}
                  </strong>
                </div>
              </div>

              {classification.sites && classification.sites.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#8C929C]">Candidate Sites:</span>
                  {classification.sites.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-[#FAF4EE] rounded-xl border border-[#EFE5DC] text-xs flex items-center justify-between"
                    >
                      <span className="font-mono">
                        {s.dopant || "?"} → {s.replaced_species || "?"} site
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-[#E9DFD4]">
                        {s.site || "?"} ({s.strength || "preference"})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Target Space Group (Optional) */}
          <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2227]">
              Target Space Group (Optional)
            </label>
            <input
              type="text"
              value={spaceGroup}
              onChange={(e) => setSpaceGroup(e.target.value)}
              placeholder="e.g. R-3c, Fd-3m, Pnma, or 167"
              className="w-full bg-[#FAF4EE]/60 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs font-mono text-[#1E2227] outline-none focus:border-accent"
            />
          </div>

          {/* Site-Specific Doping Specification Drawer */}
          <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4">
            <div
              onClick={() => setDopingDrawerOpen(!dopingDrawerOpen)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E2227]">
                  Site-Specific Doping Specification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-accent bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  {isDopedDetected || dopantElement ? "Doped" : "Undoped"}
                </span>
                {dopingDrawerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {dopingDrawerOpen && (
              <div className="space-y-4 pt-2 border-t border-[#F2E7DC]">
                <p className="text-[11px] text-[#6C737E]">
                  Auto-inferred from formula, or provide explicit host/dopant values:
                </p>

                <div>
                  <label className="block text-[11px] font-medium text-[#1E2227] mb-1">
                    Host Formula (Parent Lattice)
                  </label>
                  <input
                    type="text"
                    value={hostFormula}
                    onChange={(e) => setHostFormula(e.target.value)}
                    placeholder="e.g. Fe2O3"
                    className="w-full bg-[#FAF4EE]/60 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs font-mono text-[#1E2227] outline-none focus:border-accent"
                  />
                </div>

                {/* Primary Dopant */}
                <div className="p-3 bg-[#FAF4EE]/70 rounded-xl border border-[#EFE5DC] space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C929C]">
                    Dopant #1 (Primary)
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#5F6771] mb-1">Dopant Element</label>
                      <input
                        type="text"
                        value={dopantElement}
                        onChange={(e) => setDopantElement(e.target.value)}
                        placeholder="e.g. Ti"
                        className="w-full bg-white border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#1E2227] outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5F6771] mb-1">Substituted Site</label>
                      <input
                        type="text"
                        value={hostSiteSpecies}
                        onChange={(e) => setHostSiteSpecies(e.target.value)}
                        placeholder="e.g. Fe"
                        className="w-full bg-white border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#1E2227] outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#5F6771] mb-1">Fraction (0–1.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={dopantFraction}
                      onChange={(e) => setDopantFraction(e.target.value)}
                      placeholder="e.g. 0.05"
                      className="w-full bg-white border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#1E2227] outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Co-Dopants List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1E2227]">
                      Co-Dopants ({coDopants.length})
                    </span>
                    <button
                      type="button"
                      onClick={addCoDopant}
                      className="px-2.5 py-1 bg-white border border-[#E9DFD4] hover:bg-[#FAF4EE] rounded-lg text-xs font-semibold text-accent flex items-center gap-1 shadow-sm"
                    >
                      <Plus size={12} /> Add Co-Dopant
                    </button>
                  </div>

                  {coDopants.map((cd, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FAF4EE]/70 rounded-xl border border-[#EFE5DC] space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8C929C]">
                          CO-DOPANT #{idx + 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCoDopant(idx)}
                          className="text-[#8C929C] hover:text-red-600 p-0.5"
                          title="Remove co-dopant"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] text-[#8C929C] mb-0.5">Element</label>
                          <input
                            type="text"
                            value={cd.dopant_element}
                            onChange={(e) => updateCoDopant(idx, "dopant_element", e.target.value)}
                            placeholder="Cr"
                            className="w-full bg-white border border-[#E9DFD4] rounded-lg p-1.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-[#8C929C] mb-0.5">Site</label>
                          <input
                            type="text"
                            value={cd.host_site_species}
                            onChange={(e) => updateCoDopant(idx, "host_site_species", e.target.value)}
                            placeholder="Fe"
                            className="w-full bg-white border border-[#E9DFD4] rounded-lg p-1.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-[#8C929C] mb-0.5">Fraction</label>
                          <input
                            type="number"
                            step="0.01"
                            value={cd.dopant_fraction}
                            onChange={(e) => updateCoDopant(idx, "dopant_fraction", e.target.value)}
                            placeholder="0.02"
                            className="w-full bg-white border border-[#E9DFD4] rounded-lg p-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Connected Engines Telemetry Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E2227] flex items-center gap-2">
              <Cpu size={14} className="text-accent" /> Connected Engines & Telemetry
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#FAF4EE] rounded-xl flex justify-between items-center">
                <span className="text-[#8C929C]">MACE-MP-0:</span>
                <span className="font-semibold text-[#1E2227]">float64 (medium)</span>
              </div>
              <div className="p-2.5 bg-[#FAF4EE] rounded-xl flex justify-between items-center">
                <span className="text-[#8C929C]">COD Database:</span>
                <span className="font-semibold text-emerald-600">ONLINE</span>
              </div>
              <div className="p-2.5 bg-[#FAF4EE] rounded-xl flex justify-between items-center">
                <span className="text-[#8C929C]">CrystaLLM:</span>
                <span className="font-semibold text-emerald-600">Ready</span>
              </div>
              <div className="p-2.5 bg-[#FAF4EE] rounded-xl flex justify-between items-center">
                <span className="text-[#8C929C]">spglib / pymatgen:</span>
                <span className="font-semibold text-[#1E2227]">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Status, CIF Viewer & Property Prediction Handoff */}
        <div className="lg:col-span-7 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 text-xs flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Generation Failed</p>
                <p className="mt-0.5 text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* In-Flight Generation Progress Card */}
          {generating && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-[#EFE5DC] text-center space-y-4">
              <RefreshCw size={36} className="animate-spin text-accent mx-auto" />
              <h3 className="font-headline font-bold text-xl text-[#1E2227]">
                Executing Crystallographic Pipeline: {formula}
              </h3>
              <p className="text-xs text-[#8C929C] max-w-md mx-auto">
                Querying multi-database indexes, generating symmetry tensor, and performing double-precision MACE-MP-0 lattice relaxation...
              </p>
              <div className="font-mono text-sm font-bold text-accent">
                Elapsed: {liveSeconds}s
              </div>
            </div>
          )}

          {/* Generated Result Card */}
          {generated && cifString && (
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6">
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2E7DC]">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <h3 className="font-headline font-bold text-xl text-[#1E2227]">
                      Structure Synthesized: {formula}
                    </h3>
                  </div>
                  <p className="text-xs text-[#8C929C] mt-1">
                    {resultSpaceGroup ? `Space Group: ${resultSpaceGroup} • ` : ""}
                    {resultRetrievedFrom}
                    {elapsedTime ? ` • ${elapsedTime.toFixed(2)}s` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy CIF"}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download size={13} /> Download .cif
                  </button>
                </div>
              </div>

              {/* Lattice Parameters Matrix */}
              {latticeMetrics && (
                <div className="bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E2227] font-headline">
                      Lattice Vectors & Unit Cell Geometry
                    </span>
                    {latticeMetrics.volume && (
                      <span className="text-xs font-mono text-accent font-semibold">
                        Volume: {latticeMetrics.volume} Å³
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-xs text-[#1E2227]">
                    <div className="p-2 bg-white rounded-xl border border-[#E9DFD4] text-center">
                      <span className="text-[10px] text-[#8C929C] block">a</span>
                      <strong>{latticeMetrics.a || "—"} Å</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-[#E9DFD4] text-center">
                      <span className="text-[10px] text-[#8C929C] block">b</span>
                      <strong>{latticeMetrics.b || "—"} Å</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-[#E9DFD4] text-center">
                      <span className="text-[10px] text-[#8C929C] block">c</span>
                      <strong>{latticeMetrics.c || "—"} Å</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-[#E9DFD4] text-center">
                      <span className="text-[10px] text-[#8C929C] block">α</span>
                      <strong>{latticeMetrics.alpha || "—"}°</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-[#E9DFD4] text-center">
                      <span className="text-[10px] text-[#8C929C] block">β</span>
                      <strong>{latticeMetrics.beta || "—"}°</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-[#E9DFD4] text-center">
                      <span className="text-[10px] text-[#8C929C] block">γ</span>
                      <strong>{latticeMetrics.gamma || "—"}°</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* CIF Source Text Viewer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-[#1E2227]">
                  <span>Crystallographic Information File (CIF Source)</span>
                  <span className="text-[#8C929C] text-[11px] font-mono">CIF v1.1 Standard</span>
                </div>
                <pre className="bg-[#FAF4EE]/70 border border-[#EFE5DC] rounded-2xl p-4 text-[11px] font-mono text-[#1E2227] overflow-x-auto max-h-72 leading-relaxed selection:bg-orange-200">
                  {cifString}
                </pre>
              </div>

              {/* Downstream Actions Handoff */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F2E7DC]">
                <button
                  type="button"
                  onClick={() => navigate("/app/structures")}
                  className="w-full sm:w-auto px-4 py-2.5 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> Open in 3D Viewer
                </button>

                {/* Direct CTA: Predict Properties for Structure */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/app/predict", { state: { cifString, formula: formula.trim() } })
                  }
                  className="w-full sm:w-auto px-6 py-3 bg-[#1E2227] text-white hover:bg-black rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-soft transition-all active:scale-98"
                >
                  <span>Predict Properties for Structure</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Initial Welcome & Educational Hero (When not generated) */}
          {!generated && !generating && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-[#EFE5DC] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-200 text-accent">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1E2227]">
                    Integrated Multi-Stage Architecture
                  </h3>
                  <p className="text-xs text-[#8C929C]">
                    Automated resolution from formula to relaxed crystallographic tensor
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E2227]">
                    <Database size={14} className="text-accent" /> Multi-DB Search
                  </div>
                  <p className="text-[11px] text-[#5F6771]">
                    Searches Materials Project, OQMD, JARVIS, and COD databases in priority order.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E2227]">
                    <Sparkles size={14} className="text-accent" /> CrystaLLM Engine
                  </div>
                  <p className="text-[11px] text-[#5F6771]">
                    Autoregressive GPT generative model synthesizes novel structures when no match exists.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E2227]">
                    <Cpu size={14} className="text-accent" /> MACE-MP-0 Relaxation
                  </div>
                  <p className="text-[11px] text-[#5F6771]">
                    Machine learning potential performs float64 geometry optimization with FIRE.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E2227]">
                    <FileJson size={14} className="text-accent" /> Direct Property Prediction
                  </div>
                  <p className="text-[11px] text-[#5F6771]">
                    1-click seamless handoff of synthesized CIF directly into the GNN prediction pipeline.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
