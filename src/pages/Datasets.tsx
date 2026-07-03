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
  FlaskConical,
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
  const [cifFiles, setCifFiles] = useState<File[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const cifInputRef = useRef<HTMLInputElement>(null);

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
      // subtract header row
      const rows = Math.max(lines.length - 1, 0);
      setTotalRows(rows);
    };
    reader.readAsText(file);
  };

  const handleCifUpload = (files: FileList) => {
    setCifFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeCifFile = (name: string) => {
    setCifFiles((prev) => prev.filter((f) => f.name !== name));
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
      // simulated processing delay per batch
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
    setCifFiles([]);
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
    <div className="min-h-full bg-background text-on-surface font-body px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-on-surface mb-2">
            Datasets
          </h1>
          <p className="text-on-surface-variant">
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
                        ? "bg-orange-500/20 text-orange-500 border border-orange-500"
                        : "bg-surface-container-low dark:bg-neutral-900 text-on-surface-variant border border-outline-variant/30 dark:border-neutral-800"
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block whitespace-nowrap ${
                    step === s.n ? "text-on-surface" : "text-on-surface-variant"
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
                      : "bg-outline-variant/20 dark:bg-neutral-800"
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
              <div className="glass-card rounded-xl p-6 border border-outline-variant/20 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-on-surface">
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
                    className="border-2 border-dashed border-outline-variant/30 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-colors"
                  >
                    <Upload className="w-9 h-9 text-orange-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-on-surface">
                      Drop CSV here or click to upload
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Rows will be split into processing batches
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-surface-container-low dark:bg-neutral-900 rounded-lg px-4 py-3 border border-outline-variant/20 dark:border-neutral-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-orange-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">
                          {csvFile.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {totalRows.toLocaleString()} rows detected
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCsvFile(null);
                        setTotalRows(0);
                      }}
                      className="text-on-surface-variant hover:text-red-500 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* CIF upload */}
              <div className="glass-card rounded-xl p-6 border border-outline-variant/20 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-4">
                  <FlaskConical className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-on-surface">
                    Structure Files (CIF)
                  </h3>
                </div>
                <input
                  ref={cifInputRef}
                  type="file"
                  accept=".cif"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleCifUpload(e.target.files)
                  }
                />
                <div
                  onClick={() => cifInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant/30 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-colors mb-3"
                >
                  <Upload className="w-9 h-9 text-orange-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-on-surface">
                    Drop CIF file(s) here or click to upload
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Crystal structure data — multiple files allowed
                  </p>
                </div>
                {cifFiles.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cifFiles.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between bg-surface-container-low dark:bg-neutral-900 rounded-md px-3 py-2 border border-outline-variant/20 dark:border-neutral-800"
                      >
                        <span className="text-xs text-on-surface truncate">
                          {f.name}
                        </span>
                        <button
                          onClick={() => removeCifFile(f.name)}
                          className="text-on-surface-variant hover:text-red-500 transition-colors shrink-0 ml-2"
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
            <div className="glass-card rounded-xl p-6 border border-outline-variant/20 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-orange-500" />
                <h3 className="font-headline font-semibold text-on-surface">
                  Batch Size
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
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
                  className="w-32 bg-surface-container-low dark:bg-neutral-900 border border-outline-variant/30 dark:border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <span className="text-sm text-on-surface-variant">
                  rows per batch →{" "}
                  <span className="text-orange-500 font-semibold">
                    {Math.ceil(totalRows / Math.max(batchSize, 1))} batches
                  </span>
                </span>
              </div>
            </div>

            {/* Feature selection */}
            <div className="glass-card rounded-xl p-6 border border-outline-variant/20 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-on-surface">
                    Select Features to Extract
                  </h3>
                </div>
                <span className="text-xs text-on-surface-variant">
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
                          ? "border-orange-500 bg-orange-500/5"
                          : "border-outline-variant/20 dark:border-neutral-800 hover:border-orange-500/40"
                      }`}
                    >
                      {active ? (
                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-on-surface-variant shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-on-surface">
                          {f.name}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {f.description}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider text-orange-500/80">
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
                className="px-6 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
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
            <div className="glass-card rounded-xl p-6 border border-outline-variant/20 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline font-semibold text-on-surface">
                  Processing Queue
                </h3>
                <span className="text-sm text-on-surface-variant">
                  {processedCount}/{batches.length} batches
                </span>
              </div>
              <div className="w-full bg-surface-container-low dark:bg-neutral-900 rounded-full h-2.5 mb-6 overflow-hidden">
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
                    className="flex items-center justify-between bg-surface-container-low dark:bg-neutral-900 rounded-lg px-4 py-3 border border-outline-variant/10 dark:border-neutral-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        Batch #{b.id}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Rows {b.rangeStart}–{b.rangeEnd} ({b.rowCount} rows)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === "pending" && (
                        <span className="text-xs text-on-surface-variant">
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
                          <span className="text-xs text-green-500">Done</span>
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
                className="px-6 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-40"
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
            <div className="glass-card rounded-xl p-8 border border-outline-variant/20 dark:border-neutral-800 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
                Processing Complete
              </h3>
              <p className="text-on-surface-variant mb-6">
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
                  className="px-6 py-3 rounded-lg text-sm font-medium border border-outline-variant/30 dark:border-neutral-800 text-on-surface hover:bg-surface-container-low dark:hover:bg-neutral-900 transition-colors"
                >
                  Start New Job
                </button>
              </div>
            </div>

            {/* Results summary table */}
            <div className="glass-card rounded-xl border border-outline-variant/20 dark:border-neutral-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 dark:border-neutral-800">
                <h4 className="font-headline font-semibold text-on-surface">
                  Extracted Features
                </h4>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-neutral-900">
                    <th className="px-6 py-3 text-xs font-medium text-on-surface-variant uppercase">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-on-surface-variant uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-on-surface-variant uppercase">
                      Rows Covered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 dark:divide-neutral-800">
                  {FEATURE_OPTIONS.filter((f) =>
                    selectedFeatures.has(f.id),
                  ).map((f) => (
                    <tr key={f.id}>
                      <td className="px-6 py-3 text-sm text-on-surface font-medium">
                        {f.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-on-surface-variant">
                        {f.category}
                      </td>
                      <td className="px-6 py-3 text-sm text-on-surface-variant">
                        {totalRows.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
