/**
 * BatchPredictionPage — batch CIF prediction.
 * Route: /app/batch. On mount fetches the property catalog (fetchBatchProperties).
 * Accepts drag&drop .cif/.zip files, applies presets to reduce the input set,
 * then startBatchCifPrediction -> 1s polling of getBatchJobStatus -> on completion
 * getBatchJobResults -> summary metrics + CSV download via getBatchCsvDownloadUrl.
 */
import { useEffect, useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Upload,
  Download,
  FileArchive,
  CheckSquare,
  Square,
  Zap,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Play,
  Search,
  Sliders,
  Layers,
  Sparkles,
  X,
  RefreshCw,
  Atom,
  Cpu,
  Flame,
  Activity,
} from "lucide-react";
import {
  fetchBatchProperties,
  fetchBatchSampleCifs,
  startBatchCifPrediction,
  getBatchJobStatus,
  getBatchJobResults,
  getBatchCsvDownloadUrl,
  BatchPropertyOption,
} from "../../lib/materialsPredictionApi";

// Formatting helper for numbers
function formatValue(key: string, value: any): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    if (key.includes("conductivity_S_cm")) {
      if (value === 0) return "0.0 S/cm";
      const [base, exponent] = value.toExponential(3).split("e");
      const expNum = parseInt(exponent, 10).toString();
      const superscripts: Record<string, string> = {
        "-": "⁻", "+": "", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
      };
      let formattedExp = "";
      for (const char of expNum) {
        if (char === "+") continue;
        formattedExp += superscripts[char] || char;
      }
      return `${base} × 10${formattedExp} S/cm`;
    }
    if (key.includes("bulk_modulus") || key.includes("shear_modulus") || key.includes("youngs_modulus")) {
      return `${value.toFixed(2)} GPa`;
    }
    if (key.includes("formation_energy") || key.includes("energy_per_atom")) {
      return `${value.toFixed(4)} eV/atom`;
    }
    if (key.includes("band_gap")) {
      return `${value.toFixed(3)} eV`;
    }
    if (key.includes("density")) {
      return `${value.toFixed(2)} g/cm³`;
    }
    if (key.includes("volume")) {
      return `${value.toFixed(1)} Å³`;
    }
    if (key.includes("activation_energy")) {
      return `${value.toFixed(3)} eV`;
    }
    if (key.includes("compressibility")) {
      return `${value.toExponential(2)} GPa⁻¹`;
    }
    if (key.includes("pughs_ratio") || key.includes("poisson_ratio")) {
      return value.toFixed(3);
    }
    return String(Number.isInteger(value) ? value : value.toFixed(3));
  }
  return String(value);
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION — BATCH PREDICTION PAGE
// Drag&drop .cif/.zip -> startBatchCifPrediction -> 1s polling -> results + CSV.
// ══════════════════════════════════════════════════════════════════════════════

export default function BatchPredictionPage() {
  const [availableProps, setAvailableProps] = useState<BatchPropertyOption[]>([]);
  const [selectedProps, setSelectedProps] = useState<string[]>([
    "formula", "crystal_system", "density", "bulk_modulus", "shear_modulus", "youngs_modulus", "formation_energy", "band_gap", "ionic_conductivity", "activation_energy"
  ]);
  const [temperature, setTemperature] = useState<number>(298.15);

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const [results, setResults] = useState<Array<Record<string, any>>>([]);
  const [summary, setSummary] = useState<{ total?: number; successful?: number; warnings?: number; failed?: number }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollTimerRef = useRef<number | null>(null);

  // Load properties metadata on mount
  useEffect(() => {
    fetchBatchProperties()
      .then((props) => {
        setAvailableProps(props);
      })
      .catch((err) => {
        console.warn("Could not load backend batch properties dynamically, using defaults:", err);
      });
  }, []);

  // Polling effect when job is active
  useEffect(() => {
    if (!jobId || jobStatus !== "processing") return;

    pollTimerRef.current = window.setInterval(async () => {
      try {
        const statusData = await getBatchJobStatus(jobId);
        setProgress(statusData.progress);
        setCurrentFile(statusData.current_file || "");
        setCompletedCount(statusData.completed);
        setTotalFiles(statusData.total);

        if (statusData.status === "completed") {
          setJobStatus("completed");
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          const fullResults = await getBatchJobResults(jobId);
          setResults(fullResults.results || []);
          setSummary(fullResults.summary || {});
        } else if (statusData.status === "failed") {
          setJobStatus("failed");
          setError(statusData.error || "Batch prediction process failed on backend.");
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        }
      } catch (pollErr: any) {
        console.error("Polling error:", pollErr);
      }
    }, 1000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [jobId, jobStatus]);

  // Handle Drag & Drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const incoming = Array.from(e.dataTransfer.files).filter(
        (f) => f.name.toLowerCase().endsWith(".cif") || f.name.toLowerCase().endsWith(".zip")
      );
      if (incoming.length === 0) {
        setError("Please drop .cif files or a .zip archive containing .cif files.");
        return;
      }
      setError(null);
      setFiles((prev) => [...prev, ...incoming]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files);
      setError(null);
      setFiles((prev) => [...prev, ...incoming]);
    }
  };

  // Load sample CIFs
  const handleLoadSamples = async () => {
    try {
      setSampleLoading(true);
      setError(null);
      const data = await fetchBatchSampleCifs();
      if (!data || data.length === 0) {
        setError("No sample CIFs available on server.");
        return;
      }
      const sampleFiles = data.map(
        (item) => new File([item.content], item.filename, { type: "chemical/x-cif" })
      );
      setFiles(sampleFiles);
    } catch (err: any) {
      setError(err?.message || "Failed to load sample CIFs.");
    } finally {
      setSampleLoading(false);
    }
  };

  const toggleProperty = (key: string) => {
    setSelectedProps((curr) =>
      curr.includes(key) ? curr.filter((k) => k !== key) : [...curr, key]
    );
  };

  const setPreset = (preset: "battery" | "mechanical" | "bfsy" | "all" | "clear") => {
    if (preset === "all") {
      setSelectedProps(availableProps.map((p) => p.key));
    } else if (preset === "clear") {
      setSelectedProps([]);
    } else if (preset === "bfsy") {
      setSelectedProps([
        "formula", "crystal_system", "density",
        "bulk_modulus", "shear_modulus", "youngs_modulus", "formation_energy",
        "poisson_ratio", "compressibility", "pughs_ratio"
      ]);
    } else if (preset === "battery") {
      setSelectedProps([
        "formula", "crystal_system", "density", "volume",
        "bulk_modulus", "shear_modulus", "youngs_modulus", "formation_energy",
        "band_gap", "ionic_conductivity", "activation_energy"
      ]);
    } else if (preset === "mechanical") {
      setSelectedProps([
        "formula", "crystal_system", "density",
        "bulk_modulus", "shear_modulus", "youngs_modulus", "formation_energy",
        "poisson_ratio", "compressibility", "pughs_ratio"
      ]);
    }
  };

  // Submit and launch batch job
  const handleRunBatch = async () => {
    if (files.length === 0) {
      setError("Please upload at least one .zip archive or .cif file.");
      return;
    }
    if (selectedProps.length === 0) {
      setError("Please select at least one property to predict.");
      return;
    }

    setError(null);
    setJobStatus("processing");
    setProgress(0);
    setCompletedCount(0);
    setResults([]);
    setSummary({});

    try {
      const response = await startBatchCifPrediction(files, selectedProps, temperature);
      setJobId(response.job_id);
      setTotalFiles(response.total);
      setCurrentFile("Initializing batch...");
    } catch (err: any) {
      setJobStatus("failed");
      setError(err?.message || "Failed to start batch prediction.");
    }
  };

  // Direct CSV trigger
  const handleDownloadCsv = () => {
    if (jobId) {
      const downloadUrl = getBatchCsvDownloadUrl(jobId);
      window.open(downloadUrl, "_blank");
    } else if (results.length > 0) {
      // Fallback in-browser CSV generation if needed
      const headers = Object.keys(results[0]).join(",");
      const rows = results.map((r) => Object.values(r).map((v) => `"${String(v ?? "")}"`).join(",")).join("\n");
      const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "batch_prediction_results.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setJobId(null);
    setJobStatus("idle");
    setProgress(0);
    setResults([]);
    setError(null);
    setSearchTerm("");
  };

  // Filtered results for interactive table
  const filteredResults = results.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(r.formula || "").toLowerCase().includes(term) ||
      String(r.filename || "").toLowerCase().includes(term) ||
      String(r.material_id || "").toLowerCase().includes(term) ||
      String(r.crystal_system || "").toLowerCase().includes(term)
    );
  });

  // Calculate quick summary metrics
  const avgConductivity = results
    .map((r) => r.ionic_conductivity_S_cm)
    .filter((v): v is number => typeof v === "number" && !isNaN(v));
  const meanCond = avgConductivity.length > 0
    ? avgConductivity.reduce((a, b) => a + b, 0) / avgConductivity.length
    : null;

  const avgBulk = results
    .map((r) => r.bulk_modulus_GPa)
    .filter((v): v is number => typeof v === "number" && !isNaN(v));
  const meanBulk = avgBulk.length > 0
    ? avgBulk.reduce((a, b) => a + b, 0) / avgBulk.length
    : null;

  const avgYoung = results
    .map((r) => r.youngs_modulus_GPa)
    .filter((v): v is number => typeof v === "number" && !isNaN(v));
  const meanYoung = avgYoung.length > 0
    ? avgYoung.reduce((a, b) => a + b, 0) / avgYoung.length
    : null;

  const avgEf = results
    .map((r) => r.formation_energy_eV_atom)
    .filter((v): v is number => typeof v === "number" && !isNaN(v));
  const meanEf = avgEf.length > 0
    ? avgEf.reduce((a, b) => a + b, 0) / avgEf.length
    : null;

  const categories = ["Structural", "Mechanical", "Thermodynamics", "Electronic", "Thermal", "Ionic Transport"];

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-7 px-4 sm:px-8 py-6">
      {/* Page Header */}
      <header>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <Zap size={14} /> High-Throughput Inference
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Batch Property Prediction
        </h1>
        <p className="text-sm text-[#6C737E] max-w-3xl mt-1">
          Upload crystal structures as a <strong>.ZIP archive</strong> or individual <strong>.CIF files</strong>.
          Configure the property calculation routing for mechanical, electronic, thermal, and fast-ion transport models, and export comprehensive predictions in CSV format.
        </p>
      </header>

      {/* Main Grid: Upload & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Upload & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Box */}
          <section className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-3">
              <h2 className="font-headline font-bold text-base text-[#1E2227] flex items-center gap-2">
                <FileArchive size={17} className="text-[#F1641D]" /> 1. Upload CIF Files or ZIP
              </h2>
              <button
                type="button"
                onClick={handleLoadSamples}
                disabled={sampleLoading || jobStatus === "processing"}
                className="text-[11px] font-semibold text-[#F1641D] hover:text-[#D9520F] flex items-center gap-1 bg-[#FBE8D8] px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={12} /> {sampleLoading ? "Loading..." : "Load Samples"}
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#F1641D] bg-[#FBE8D8]/30 scale-[1.01]"
                  : "border-[#E9DFD4] bg-[#FAF4EE]/40 hover:bg-[#FAF4EE] hover:border-[#D5C7B8]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".cif,.zip"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FBE8D8] text-[#F1641D] flex items-center justify-center shadow-xs">
                <Upload size={22} />
              </div>
              <p className="text-xs font-semibold text-[#1E2227]">
                Click or drag & drop .ZIP archive or .CIF files here
              </p>
              <p className="text-[11px] text-[#8C929C] mt-1">
                Supports archives with multiple nested CIFs or multi-file selection
              </p>
            </div>

            {/* Selected Files Count & List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E2227] flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#1E7B34]" />
                    {files.length} {files.length === 1 ? "file" : "files"} queued
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    disabled={jobStatus === "processing"}
                    className="text-[11px] text-[#B3261E] hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Clear all
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between bg-[#FAF4EE] px-3 py-1.5 rounded-lg text-xs border border-[#E9DFD4]"
                    >
                      <span className="truncate max-w-[260px] text-[#1E2227] font-medium">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-[#8C929C] shrink-0">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Calculation Settings */}
          <section className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] space-y-4">
            <h2 className="font-headline font-bold text-base text-[#1E2227] flex items-center gap-2 border-b border-[#F2E7DC] pb-3">
              <Sliders size={17} className="text-[#F1641D]" /> 2. Environmental Settings
            </h2>
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-[#1E2227]">Target Temperature</label>
                <span className="font-mono font-bold text-[#F1641D]">
                  {temperature} K ({(temperature - 273.15).toFixed(1)} °C)
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="5"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#F1641D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C929C] mt-1">
                <span>200 K (-73°C)</span>
                <span>298.15 K (Room temp)</span>
                <span>800 K (527°C)</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Properties Routing & Trigger (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E7DC] pb-3">
              <div>
                <h2 className="font-headline font-bold text-base text-[#1E2227] flex items-center gap-2">
                  <Layers size={17} className="text-[#F1641D]" /> 3. Select Properties to Route & Predict
                </h2>
                <p className="text-xs text-[#8C929C] mt-0.5">
                  Only selected models and descriptors will be executed for fast throughput.
                </p>
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreset("bfsy")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#E3ECFC] text-[#1D4FA3] hover:bg-[#D0E0FA] transition-colors cursor-pointer"
                >
                  BFSY Suite
                </button>
                <button
                  type="button"
                  onClick={() => setPreset("battery")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FBE8D8] text-[#F1641D] hover:bg-[#F2D7C2] transition-colors cursor-pointer"
                >
                  Battery Suite
                </button>
                <button
                  type="button"
                  onClick={() => setPreset("mechanical")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FAF4EE] text-[#5F6771] hover:bg-[#EFE5DC] transition-colors cursor-pointer"
                >
                  Mechanical
                </button>
                <button
                  type="button"
                  onClick={() => setPreset("all")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FAF4EE] text-[#5F6771] hover:bg-[#EFE5DC] transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setPreset("clear")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FAF4EE] text-[#B3261E] hover:bg-[#FDE4E1] transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Categorized Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[430px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const propsInCat = availableProps.filter((p) => p.category === cat);
                if (propsInCat.length === 0) return null;

                const getIcon = () => {
                  switch (cat) {
                    case "Ionic Transport": return <Activity size={14} className="text-[#F1641D]" />;
                    case "Mechanical": return <Cpu size={14} className="text-[#1D4FA3]" />;
                    case "Thermodynamics": return <Sparkles size={14} className="text-[#E05638]" />;
                    case "Electronic": return <Zap size={14} className="text-[#9A6A00]" />;
                    case "Thermal": return <Flame size={14} className="text-[#B3261E]" />;
                    default: return <Atom size={14} className="text-[#1E7B34]" />;
                  }
                };

                return (
                  <div key={cat} className="p-3.5 rounded-xl border border-[#E9DFD4] bg-[#FAF4EE]/30 space-y-2">
                    <h3 className="font-semibold text-xs text-[#1E2227] flex items-center gap-1.5 uppercase tracking-wide">
                      {getIcon()} {cat}
                    </h3>
                    <div className="space-y-1.5">
                      {propsInCat.map((prop) => {
                        const isChecked = selectedProps.includes(prop.key);
                        return (
                          <label
                            key={prop.key}
                            onClick={() => toggleProperty(prop.key)}
                            className={`flex items-start gap-2 p-2 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                              isChecked
                                ? "bg-white border border-[#F1641D]/30 shadow-xs"
                                : "hover:bg-white/60 border border-transparent"
                            }`}
                          >
                            <span className="mt-0.5 text-[#F1641D]">
                              {isChecked ? <CheckSquare size={14} /> : <Square size={14} className="text-[#8C929C]" />}
                            </span>
                            <div className="min-w-0">
                              <span className="font-semibold text-[#1E2227] block truncate">
                                {prop.name} {prop.unit && <span className="font-normal text-[#8C929C]">({prop.unit})</span>}
                              </span>
                              <span className="text-[10px] text-[#6C737E] line-clamp-1">
                                {prop.description}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="p-3 bg-[#FDE4E1] border border-[#F5C2BE] text-[#B3261E] rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Run Button & Progress Bar */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleRunBatch}
                disabled={jobStatus === "processing" || files.length === 0}
                className="w-full py-3.5 bg-[#F1641D] hover:bg-[#D9520F] text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {jobStatus === "processing" ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Executing Batch Property Routing ({progress}%)
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    Start Batch Prediction ({files.length} {files.length === 1 ? "structure" : "structures"})
                  </>
                )}
              </button>

              {/* Progress Bar when running */}
              {jobStatus === "processing" && (
                <div className="space-y-1.5 p-3.5 rounded-xl border border-[#FBE8D8] bg-[#FAF4EE]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#1E2227] truncate max-w-[320px]">
                      Processing: <span className="text-[#F1641D]">{currentFile || "Preparing..."}</span>
                    </span>
                    <span className="font-mono text-[#F1641D] font-bold">
                      {completedCount} / {totalFiles} ({progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E9DFD4] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#F1641D] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.max(5, progress)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6">
          {/* Header & Export Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2E7DC] pb-5">
            <div>
              <h2 className="font-headline font-bold text-xl text-[#1E2227] flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[#1E7B34]" /> Batch Prediction Results
              </h2>
              <p className="text-xs text-[#6C737E] mt-0.5">
                Successfully processed {results.length} crystal structures. All predicted values are verified via surrogate ML models.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-5 py-2.5 bg-[#1E7B34] hover:bg-[#166527] text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download size={15} /> Download Results as CSV
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 border border-[#E9DFD4] hover:bg-[#FAF4EE] text-[#5F6771] rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-3.5 rounded-xl border border-[#E9DFD4] bg-[#FAF4EE]/40">
              <span className="text-[10px] font-semibold text-[#8C929C] uppercase block">Total Processed</span>
              <span className="text-xl font-headline font-bold text-[#1E2227] mt-1 block">
                {results.length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-[#DFF5E1] bg-[#DFF5E1]/30">
              <span className="text-[10px] font-semibold text-[#1E7B34] uppercase block">Successful</span>
              <span className="text-xl font-headline font-bold text-[#1E7B34] mt-1 block">
                {summary.successful ?? results.filter((r) => r.status === "success").length}
              </span>
            </div>
            {meanBulk !== null && (
              <div className="p-3.5 rounded-xl border border-[#E3ECFC] bg-[#E3ECFC]/30">
                <span className="text-[10px] font-semibold text-[#1D4FA3] uppercase block">Avg Bulk Mod. (K)</span>
                <span className="text-xl font-headline font-bold text-[#1D4FA3] mt-1 block">
                  {meanBulk.toFixed(1)} GPa
                </span>
              </div>
            )}
            {meanYoung !== null && (
              <div className="p-3.5 rounded-xl border border-[#E3ECFC] bg-[#E3ECFC]/30">
                <span className="text-[10px] font-semibold text-[#1D4FA3] uppercase block">Avg Young's Mod. (E)</span>
                <span className="text-xl font-headline font-bold text-[#1D4FA3] mt-1 block">
                  {meanYoung.toFixed(1)} GPa
                </span>
              </div>
            )}
            {meanEf !== null && (
              <div className="p-3.5 rounded-xl border border-[#FDE4E1] bg-[#FDE4E1]/30">
                <span className="text-[10px] font-semibold text-[#E05638] uppercase block">Avg Formation En. (Ef)</span>
                <span className="text-xl font-headline font-bold text-[#E05638] mt-1 block">
                  {meanEf.toFixed(3)} eV
                </span>
              </div>
            )}
            {meanCond !== null && (
              <div className="p-3.5 rounded-xl border border-[#FBE8D8] bg-[#FBE8D8]/30">
                <span className="text-[10px] font-semibold text-[#F1641D] uppercase block">Avg Ionic Cond. (σ)</span>
                <span className="text-sm font-headline font-bold text-[#F1641D] mt-1 block">
                  {formatValue("ionic_conductivity_S_cm", meanCond)}
                </span>
              </div>
            )}
          </div>

          {/* Search Table Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C929C]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by formula or filename..."
                className="w-full pl-9 pr-3 py-2 bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"
              />
            </div>
            <span className="text-xs text-[#8C929C]">
              Showing {filteredResults.length} of {results.length} records
            </span>
          </div>

          {/* Interactive Data Table */}
          <div className="border border-[#EFE5DC] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF4EE] border-b border-[#E9DFD4] sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-[#1E2227]">Material / File</th>
                    <th className="py-3 px-4 font-semibold text-[#1E2227]">Formula</th>
                    <th className="py-3 px-4 font-semibold text-[#1E2227]">Symmetry</th>
                    <th className="py-3 px-4 font-semibold text-[#1E2227]">Density</th>
                    {selectedProps.includes("bulk_modulus") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Bulk Mod. (K)</th>
                    )}
                    {selectedProps.includes("shear_modulus") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Shear Mod. (G)</th>
                    )}
                    {selectedProps.includes("youngs_modulus") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Young's Mod. (E)</th>
                    )}
                    {selectedProps.includes("formation_energy") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Formation En. (Ef)</th>
                    )}
                    {selectedProps.includes("poisson_ratio") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Poisson (ν)</th>
                    )}
                    {selectedProps.includes("pughs_ratio") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Pugh (K/G)</th>
                    )}
                    {selectedProps.includes("band_gap") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Band Gap</th>
                    )}
                    {selectedProps.includes("ionic_conductivity") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Ionic Cond. (σ)</th>
                    )}
                    {selectedProps.includes("activation_energy") && (
                      <th className="py-3 px-4 font-semibold text-[#1E2227]">Act. Energy (Ea)</th>
                    )}
                    <th className="py-3 px-4 font-semibold text-[#1E2227]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2E7DC]">
                  {filteredResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF4EE]/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[#1E2227]">
                        {row.filename}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#F1641D]">
                        {row.formula || "—"}
                      </td>
                      <td className="py-3 px-4 text-[#5F6771]">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#FAF4EE] border border-[#E9DFD4] text-[11px] capitalize">
                          {row.crystal_system || "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#1E2227]">
                        {formatValue("density", row.density_g_cm3)}
                      </td>
                      {selectedProps.includes("bulk_modulus") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("bulk_modulus", row.bulk_modulus_GPa)}
                        </td>
                      )}
                      {selectedProps.includes("shear_modulus") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("shear_modulus", row.shear_modulus_GPa)}
                        </td>
                      )}
                      {selectedProps.includes("youngs_modulus") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("youngs_modulus", row.youngs_modulus_GPa)}
                        </td>
                      )}
                      {selectedProps.includes("formation_energy") && (
                        <td className="py-3 px-4 font-medium text-[#E05638]">
                          {formatValue("formation_energy", row.formation_energy_eV_atom)}
                        </td>
                      )}
                      {selectedProps.includes("poisson_ratio") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("poisson_ratio", row.poisson_ratio)}
                        </td>
                      )}
                      {selectedProps.includes("pughs_ratio") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("pughs_ratio", row.pughs_ratio)}
                        </td>
                      )}
                      {selectedProps.includes("band_gap") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("band_gap", row.band_gap_eV)}
                        </td>
                      )}
                      {selectedProps.includes("ionic_conductivity") && (
                        <td className="py-3 px-4 font-mono font-semibold text-[#1E7B34]">
                          {formatValue("ionic_conductivity_S_cm", row.ionic_conductivity_S_cm)}
                        </td>
                      )}
                      {selectedProps.includes("activation_energy") && (
                        <td className="py-3 px-4 text-[#1E2227]">
                          {formatValue("activation_energy", row.activation_energy_eV)}
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            row.status === "success"
                              ? "bg-[#DFF5E1] text-[#1E7B34]"
                              : row.status === "warning"
                              ? "bg-[#FFF1CF] text-[#9A6A00]"
                              : "bg-[#FDE4E1] text-[#B3261E]"
                          }`}
                        >
                          {row.status === "success" ? "Success" : row.status === "warning" ? "Warning" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
