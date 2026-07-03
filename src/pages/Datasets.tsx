import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Database,
  CheckCircle2,
  Circle,
  ChevronRight,
  Download,
  Layers,
  Loader2,
  X,
  FileArchive,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface FeatureOption {
  id: string;
  name: string;
  description: string;
  category: string;
}

const FEATURE_OPTIONS: FeatureOption[] = [
  {
    id: "band_gap",
    name: "Band Gap",
    description: "Electronic band gap energy (eV)",
    category: "Electronic",
  },
  {
    id: "formation_energy",
    name: "Formation Energy",
    description: "Energy per atom (eV/atom)",
    category: "Thermodynamic",
  },
  {
    id: "elasticity",
    name: "Elastic Moduli",
    description: "Bulk & shear modulus (GPa)",
    category: "Mechanical",
  },
  {
    id: "density",
    name: "Density",
    description: "Mass density (g/cm³)",
    category: "Structural",
  },
  {
    id: "ionic_conductivity",
    name: "Ionic Conductivity",
    description: "Diffusion pathway analysis (S/cm)",
    category: "Transport",
  },
  {
    id: "thermal_expansion",
    name: "Thermal Expansion",
    description: "Coefficient across temperature range",
    category: "Thermodynamic",
  },
  {
    id: "symmetry",
    name: "Space Group / Symmetry",
    description: "Crystallographic symmetry classification",
    category: "Structural",
  },
  {
    id: "dos",
    name: "Density of States",
    description: "Electronic DOS profile",
    category: "Electronic",
  },
];

interface BatchInfo {
  id: number;
  rangeStart: number;
  rangeEnd: number;
  rowCount: number;
  status: "pending" | "processing" | "done";
}

export default function Datasets() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — uploads
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [structureFiles, setStructureFiles] = useState<File[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const structureInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — batching + features
  const [batchSize, setBatchSize] = useState<number>(200);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(),
  );

  // Step 3 — processing
  const [batches, setBatches] = useState<BatchInfo[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const buildBatches = useCallback((rows: number, size: number) => {
    const list: BatchInfo[] = [];
    let start = 1;
    let id = 1;
    while (start <= rows) {
      const end = Math.min(start + size - 1, rows);
      list.push({
        id,
        rangeStart: start,
        rangeEnd: end,
        rowCount: end - start + 1,
        status: "pending",
      });
      start = end + 1;
      id++;
    }
    return list;
  }, []);

  const handleCsvUpload = (file: File) => {
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
      const rows = Math.max(lines.length - 1, 0);
      setTotalRows(rows);
    };
    reader.readAsText(file);
  };

  const handleStructureUpload = (files: FileList) => {
    setStructureFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeStructureFile = (name: string) => {
    setStructureFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goToStep3 = () => {
    const built = buildBatches(totalRows, batchSize);
    setBatches(built);
    setStep(3);
  };

  const runProcessing = async () => {
    setProcessing(true);
    setProcessedCount(0);
    for (let i = 0; i < batches.length; i++) {
      setBatches((prev) =>
        prev.map((b, idx) => (idx === i ? { ...b, status: "processing" } : b)),
      );
      await new Promise((res) => setTimeout(res, 600));
      setBatches((prev) =>
        prev.map((b, idx) => (idx === i ? { ...b, status: "done" } : b)),
      );
      setProcessedCount(i + 1);
    }
    setProcessing(false);
    setStep(4);
  };

  const resetAll = () => {
    setCsvFile(null);
    setStructureFiles([]);
    setTotalRows(0);
    setBatchSize(200);
    setSelectedFeatures(new Set());
    setBatches([]);
    setProcessedCount(0);
    setStep(1);
  };

  const stepMeta = [
    { n: 1, label: "Upload Data" },
    { n: 2, label: "Configure" },
    { n: 3, label: "Process" },
    { n: 4, label: "Results" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 font-body px-6 md:px-10 py-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-neutral-900 dark:text-white mb-2">
            Datasets
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Upload materials data, select the features you need, and run batch
            processing on your dataset.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-12">
          {stepMeta.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold transition-colors duration-300 ${
                    step === s.n
                      ? "bg-orange-500 text-white shadow-[0_0_12px_rgba(255,102,0,0.5)]"
                      : step > s.n
                        ? "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500"
                        : "bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block whitespace-nowrap ${
                    step === s.n
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < stepMeta.length - 1 && (
                <div
                  className={`h-px flex-1 mx-4 transition-colors duration-300 ${
                    step > s.n
                      ? "bg-orange-500"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CSV upload */}
              <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                    Dataset (CSV)
                  </h3>
                </div>
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleCsvUpload(e.target.files[0])
                  }
                />
                {!csvFile ? (
                  <div
                    onClick={() => csvInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 dark:hover:bg-orange-500/5 transition-colors"
                  >
                    <Upload className="w-9 h-9 text-orange-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      Drop CSV here or click to upload
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Rows will be split into processing batches
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 rounded-lg px-4 py-3 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-orange-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {csvFile.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {totalRows.toLocaleString()} rows detected
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCsvFile(null);
                        setTotalRows(0);
                      }}
                      className="text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Structures upload (ZIP/Parquet) */}
              <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileArchive className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                    Structures Archive
                  </h3>
                </div>
                <input
                  ref={structureInputRef}
                  type="file"
                  accept=".zip,.parquet"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleStructureUpload(e.target.files)
                  }
                />
                <div
                  onClick={() => structureInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 dark:hover:bg-orange-500/5 transition-colors mb-3"
                >
                  <Upload className="w-9 h-9 text-orange-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Drop ZIP or Parquet here or click to upload
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Accepts structure files packaged in .zip or consolidated
                    .parquet formats
                  </p>
                </div>
                {structureFiles.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {structureFiles.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 rounded-md px-3 py-2 border border-neutral-200 dark:border-neutral-800"
                      >
                        <span className="text-xs text-neutral-800 dark:text-neutral-200 truncate">
                          {f.name}
                        </span>
                        <button
                          onClick={() => removeStructureFile(f.name)}
                          className="text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-colors shrink-0 ml-2"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                disabled={!csvFile || totalRows === 0}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-headline font-semibold px-6 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(255,102,0,0.25)]"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Configure batches + features */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Batch size */}
            <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-orange-500" />
                <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                  Batch Size
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {totalRows.toLocaleString()} total rows will be split into
                batches for processing.
              </p>
              <div className="flex items-center gap-4 max-w-xs">
                <input
                  type="number"
                  min={1}
                  max={totalRows || 1}
                  value={batchSize}
                  onChange={(e) =>
                    setBatchSize(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-32 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  rows per batch →{" "}
                  <span className="text-orange-500 font-semibold">
                    {Math.ceil(totalRows / Math.max(batchSize, 1))} batches
                  </span>
                </span>
              </div>
            </div>

            {/* Feature selection */}
            <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                    Select Features to Extract
                  </h3>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {selectedFeatures.size} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEATURE_OPTIONS.map((f) => {
                  const active = selectedFeatures.has(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFeature(f.id)}
                      className={`flex items-start gap-3 text-left p-4 rounded-lg border transition-all ${
                        active
                          ? "border-orange-500 bg-orange-500/5 dark:bg-orange-500/10"
                          : "border-neutral-200 dark:border-neutral-800/60 bg-transparent hover:border-orange-500/40"
                      }`}
                    >
                      {active ? (
                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {f.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {f.description}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400 font-semibold">
                          {f.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-lg text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                disabled={selectedFeatures.size === 0}
                onClick={goToStep3}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-headline font-semibold px-6 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(255,102,0,0.25)]"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Process */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                  Processing Queue
                </h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {processedCount}/{batches.length} batches
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-950 rounded-full h-2.5 mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,102,0,0.5)]"
                  style={{
                    width: `${batches.length ? (processedCount / batches.length) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 rounded-lg px-4 py-3 border border-neutral-100 dark:border-neutral-800/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Batch #{b.id}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Rows {b.rangeStart}–{b.rangeEnd} ({b.rowCount} rows)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === "pending" && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                          Queued
                        </span>
                      )}
                      {b.status === "processing" && (
                        <>
                          <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                          <span className="text-xs text-orange-500">
                            Processing
                          </span>
                        </>
                      )}
                      {b.status === "done" && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500 dark:text-green-400">
                            Done
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                disabled={processing}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-lg text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-40"
              >
                ← Back
              </button>
              <button
                disabled={processing}
                onClick={runProcessing}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-headline font-semibold px-6 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-[0_0_16px_rgba(255,102,0,0.25)]"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Run Batch Processing <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Results */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-8 border border-neutral-200 dark:border-neutral-800/60 text-center shadow-sm">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-headline font-bold text-neutral-900 dark:text-white mb-2">
                Processing Complete
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {totalRows.toLocaleString()} rows across {batches.length}{" "}
                batches processed with {selectedFeatures.size} selected
                features.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-headline font-semibold px-6 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(255,102,0,0.25)]">
                  <Download className="w-4 h-4" /> Download Report
                </button>
                <button
                  onClick={resetAll}
                  className="px-6 py-3 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  Start New Job
                </button>
              </div>
            </div>

            {/* Results summary table */}
            <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-800/60 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/40">
                <h4 className="font-headline font-semibold text-neutral-900 dark:text-white">
                  Extracted Features
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-950">
                      <th className="px-6 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                        Feature
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                        Rows Covered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
                    {FEATURE_OPTIONS.filter((f) =>
                      selectedFeatures.has(f.id),
                    ).map((f) => (
                      <tr key={f.id}>
                        <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white font-medium">
                          {f.name}
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                          {f.category}
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                          {totalRows.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
