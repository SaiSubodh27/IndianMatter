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
import { ApiError } from "../lib/api";
import {
  createPredictionJob,
  getPredictionCapabilities,
  getPredictionJob,
  getPredictionResults,
  inspectPredictionDataset,
  predictionDownloadUrl,
  uploadPredictionDataset,
} from "../lib/materialsPredictionApi";

type Step = 1 | 2 | 3 | 4;

interface FeatureOption {
  id: string;
  name: string;
  description: string;
  category: string;
}

const FEATURE_OPTIONS: FeatureOption[] = [
  {
    id: "total_energy",
    name: "Total Energy",
    description: "Direct atomistic model energy (eV)",
    category: "Direct Output",
  },
  {
    id: "energy_per_atom",
    name: "Energy Per Atom",
    description: "Direct model energy normalized by atom count (eV/atom)",
    category: "Direct Output",
  },
  {
    id: "composition_descriptors",
    name: "Composition Descriptors",
    description: "Pymatgen and matminer composition features",
    category: "Composition",
  },
  {
    id: "structural_descriptors",
    name: "Structural Descriptors",
    description: "Structure-derived geometry and symmetry features",
    category: "Structural",
  },
  {
    id: "bulk_modulus",
    name: "Bulk Modulus",
    description: "Strain-response mechanical calculation (GPa)",
    category: "Mechanical",
  },
  {
    id: "debye_temperature",
    name: "Debye Temperature",
    description: "Only when the selected model provides required elastic data",
    category: "Thermal",
  },
  {
    id: "electronic_state",
    name: "Electronic State",
    description: "Explicitly labeled heuristic classification",
    category: "Electrical",
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
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [inspection, setInspection] = useState<Awaited<
    ReturnType<typeof inspectPredictionDataset>
  > | null>(null);
  const [selectedModel, setSelectedModel] = useState("chgnet");
  const [modelAvailability, setModelAvailability] = useState<
    Record<string, boolean>
  >({});
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const structureInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — batching + features
  const [batchSize, setBatchSize] = useState<number>(100);
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
    setError(null);
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

  const goToStep3 = async () => {
    if (!csvFile || totalRows > 100) return;
    setError(null);
    try {
      const uploaded = await uploadPredictionDataset(csvFile, structureFiles);
      const [details, capabilities] = await Promise.all([
        inspectPredictionDataset(uploaded.dataset_id),
        getPredictionCapabilities(),
      ]);
      setDatasetId(uploaded.dataset_id);
      setInspection(details);
      setTotalRows(details.total_rows);
      setModelAvailability(
        Object.fromEntries(
          Object.entries(capabilities.models).map(([key, model]) => [
            key,
            model.available,
          ]),
        ),
      );
      setBatches(buildBatches(details.total_rows, Math.min(batchSize, 100)));
      setStep(2);
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Dataset upload failed.",
      );
    }
  };

  const runProcessing = async () => {
    if (!datasetId || selectedFeatures.size === 0) return;
    setError(null);
    setProcessing(true);
    setProcessedCount(0);
    try {
      const job = await createPredictionJob({
        dataset_id: datasetId,
        selected_models: [selectedModel],
        selected_properties: Array.from(selectedFeatures),
        calculation_settings: { batch_size: Math.min(batchSize, 100) },
      });
      setJobId(job.job_id);
      setJobStatus(job.status);
      setStep(3);

      let current = job;
      while (!["completed", "failed", "canceled"].includes(current.status)) {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        current = await getPredictionJob(job.job_id);
        setJobStatus(current.status);
        const completed = Math.round(
          ((current.progress_percent ?? 0) / 100) * batches.length,
        );
        setProcessedCount(Math.min(completed, batches.length));
      }
      if (current.status !== "completed")
        throw new Error(`Prediction job ${current.status}.`);
      const result = await getPredictionResults(job.job_id);
      setProcessedCount(batches.length);
      setJobStatus(`${result.results.length} results ready`);
      setStep(4);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : String(caught));
      setJobStatus("failed");
    } finally {
      setProcessing(false);
    }
  };

  const resetAll = () => {
    setCsvFile(null);
    setStructureFiles([]);
    setTotalRows(0);
    setBatchSize(100);
    setSelectedFeatures(new Set());
    setBatches([]);
    setProcessedCount(0);
    setStep(1);
    setDatasetId(null);
    setInspection(null);
    setJobId(null);
    setJobStatus("");
    setError(null);
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

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

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
                      Maximum 100 rows per prediction job
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

              {/* Structure uploads */}
              <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileArchive className="w-5 h-5 text-orange-500" />
                  <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                    Structure Files
                  </h3>
                </div>
                <input
                  ref={structureInputRef}
                  type="file"
                  accept=".cif,.poscar,.contcar,.vasp,.xyz,.json"
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
                    Drop CIF, POSCAR, XYZ, or JSON files here
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Each file is parsed and validated by the backend before
                    prediction
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
                disabled={!csvFile || totalRows === 0 || totalRows > 100}
                onClick={goToStep3}
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
            {inspection && (
              <div className="bg-white dark:bg-neutral-900/60 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
                <h3 className="font-headline font-semibold text-neutral-900 dark:text-white mb-3">
                  Dataset Inspection
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {inspection.valid_rows} valid rows,{" "}
                  {inspection.columns.length} columns.
                  {inspection.detected_structure_col
                    ? ` Structure column: ${inspection.detected_structure_col}.`
                    : " No structure column detected; structure files are required for model outputs."}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-neutral-900/60 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-semibold text-neutral-900 dark:text-white">
                  Prediction Model
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Availability is checked by the backend
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {["m3gnet", "chgnet", "mace"].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => setSelectedModel(model)}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      selectedModel === model
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <span className="block text-sm font-semibold uppercase text-neutral-900 dark:text-white">
                      {model}
                    </span>
                    <span
                      className={`text-xs ${modelAvailability[model] === false ? "text-red-500" : "text-neutral-500 dark:text-neutral-400"}`}
                    >
                      {modelAvailability[model] === undefined
                        ? "Checking..."
                        : modelAvailability[model]
                          ? "Available"
                          : "Unavailable"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
                disabled={
                  selectedFeatures.size === 0 ||
                  !modelAvailability[selectedModel]
                }
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
                  {processedCount}/{batches.length} batches{" "}
                  {jobStatus ? `· ${jobStatus}` : ""}
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
                {jobId && (
                  <a
                    href={predictionDownloadUrl(jobId, "zip")}
                    download
                    className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    <FileArchive className="w-4 h-4" /> Download Results
                  </a>
                )}
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
