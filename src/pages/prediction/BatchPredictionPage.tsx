import { useEffect, useState } from "react";
import {
  AlertCircle,
  Download,
  FileText,
  Play,
  Upload,
  Zap,
} from "lucide-react";
import {
  createPredictionJob,
  getPredictionCapabilities,
  getPredictionJob,
  getPredictionResults,
  listPredictionProperties,
  ModelCapability,
  predictionDownloadUrl,
  PropertyDefinition,
  uploadPredictionDataset,
} from "../../lib/materialsPredictionApi";

export default function BatchPredictionPage() {
  const [csv, setCsv] = useState<File | null>(null);
  const [structures, setStructures] = useState<File[]>([]);
  const [models, setModels] = useState<Record<string, ModelCapability>>({});
  const [properties, setProperties] = useState<PropertyDefinition[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPredictionCapabilities(), listPredictionProperties()])
      .then(([capabilityResponse, propertyResponse]) => {
        const usableModels = Object.fromEntries(
          Object.entries(capabilityResponse.models).filter(
            ([, capability]) => capability.available,
          ),
        );
        setModels(usableModels);
        setSelectedModel(Object.keys(usableModels)[0] ?? "");
        setProperties(
          propertyResponse.filter((property) => !property.unsupported),
        );
        setSelectedProperties(
          propertyResponse
            .filter((property) => !property.unsupported)
            .slice(0, 1)
            .map((property) => property.key),
        );
      })
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load prediction capabilities.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!jobId || !running) return;
    const timer = window.setInterval(async () => {
      try {
        const status = await getPredictionJob(jobId);
        setJobStatus(status.status);
        setProgress(status.progress_percent ?? 0);
        if (["completed", "failed", "canceled"].includes(status.status)) {
          window.clearInterval(timer);
          setRunning(false);
          if (status.status === "completed")
            setResults((await getPredictionResults(jobId)).results);
        }
      } catch (requestError) {
        window.clearInterval(timer);
        setRunning(false);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not read prediction job status.",
        );
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [jobId, running]);

  const toggleProperty = (key: string) =>
    setSelectedProperties((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );

  const handleRun = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!csv)
      return setError("Upload a CSV dataset before starting a batch job.");
    if (!selectedModel || selectedProperties.length === 0)
      return setError(
        "Select an available model and at least one supported property.",
      );
    setError(null);
    setResults([]);
    setRunning(true);
    setJobStatus("uploading");
    setProgress(0);
    try {
      const dataset = await uploadPredictionDataset(csv, structures);
      const job = await createPredictionJob({
        dataset_id: dataset.dataset_id,
        selected_models: [selectedModel],
        selected_properties: selectedProperties,
      });
      setJobId(job.job_id);
      setJobStatus(job.status);
      setProgress(job.progress_percent ?? 0);
    } catch (requestError) {
      setRunning(false);
      setJobStatus("failed");
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Batch prediction failed.",
      );
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <Zap size={14} /> Backend batch pipeline
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Batch Property Prediction
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Upload a supported CSV dataset and optional CIF structures, then
          monitor the real prediction job.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleRun}
          className="lg:col-span-4 bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5"
        >
          <h2 className="font-headline font-bold text-lg text-[#1E2227]">
            Dataset and configuration
          </h2>
          <label className="block text-xs font-semibold text-[#1E2227]">
            CSV dataset
            <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer">
              <Upload size={15} className="text-[#F1641D]" />
              <span className="truncate">
                {csv?.name ?? "Choose a .csv file"}
              </span>
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(event) => setCsv(event.target.files?.[0] ?? null)}
              />
            </span>
          </label>
          <label className="block text-xs font-semibold text-[#1E2227]">
            Optional CIF structures
            <input
              type="file"
              accept=".cif"
              multiple
              className="mt-1.5 block w-full text-xs text-[#6C737E]"
              onChange={(event) =>
                setStructures(Array.from(event.target.files ?? []))
              }
            />
          </label>
          <label className="block text-xs font-semibold text-[#1E2227]">
            Available model
            <select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              disabled={loading}
              className="mt-1.5 w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs"
            >
              <option value="">
                {loading ? "Loading capabilities..." : "No available models"}
              </option>
              {Object.entries(models).map(([key, model]) => (
                <option key={key} value={key}>
                  {model.name} ({model.device ?? "device unavailable"})
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="block text-xs font-semibold text-[#1E2227] mb-2">
              Supported properties
            </span>
            <div className="space-y-2">
              {properties.map((property) => (
                <label
                  key={property.key}
                  className="flex items-center gap-2 text-xs text-[#5F6771]"
                >
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.key)}
                    onChange={() => toggleProperty(property.key)}
                  />
                  {property.name} ({property.unit || "unit unavailable"})
                </label>
              ))}
            </div>
            {!loading && properties.length === 0 && (
              <p className="text-xs text-[#8C929C]">
                No supported properties returned by the backend.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={running || loading}
            className="w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play size={14} />
            {running ? "Running batch job..." : "Run backend batch prediction"}
          </button>
          {error && (
            <div
              role="alert"
              className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700"
            >
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}
        </form>
        <section
          className="lg:col-span-8 bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5"
          aria-label="Batch prediction results"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E7DC] pb-4">
            <div>
              <h2 className="font-headline font-bold text-lg text-[#1E2227]">
                Execution status
              </h2>
              <p className="text-xs text-[#8C929C]">
                {jobStatus === "idle"
                  ? "Awaiting a real backend job."
                  : jobStatus}
              </p>
            </div>
            {jobId && !running && (
              <div className="flex gap-2">
                <a
                  href={predictionDownloadUrl(jobId, "csv")}
                  className="px-3 py-1.5 bg-[#FAF4EE] rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Download size={13} /> CSV
                </a>
                <a
                  href={predictionDownloadUrl(jobId, "zip")}
                  className="px-3 py-1.5 bg-[#F1641D] text-white rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Download size={13} /> ZIP
                </a>
              </div>
            )}
          </div>
          {running && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Backend progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-[#FAF4EE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F1641D] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {!results.length && !running && (
            <div className="py-16 text-center text-sm text-[#6C737E]">
              Results will appear here after a completed backend job.
            </div>
          )}
          {!!results.length && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F2E7DC] text-[#8C929C]">
                    {Object.keys(results[0]).map((key) => (
                      <th key={key} className="py-2 px-3">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index} className="border-b border-[#FAF4EE]">
                      <>
                        {Object.entries(row).map(([key, value]) => (
                          <td key={key} className="py-3 px-3 font-mono">
                            {String(value ?? "Not available")}
                          </td>
                        ))}
                      </>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
