import { useState } from "react";
import { Activity, Play, Upload, AlertCircle } from "lucide-react";
import { predictFromCIF, TrialPredictionResponse } from "../../lib/api";

export default function PropertyPredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [temperature, setTemperature] = useState("300");
  const [result, setResult] = useState<TrialPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Upload a CIF file before running a prediction.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(
        await predictFromCIF({ file, temperature: Number(temperature) }),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Prediction failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <Activity size={14} /> Model-backed property inference
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Property Prediction Engine
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Submit a real CIF to the configured IndianMatter prediction service.
          Results are shown only when returned by the backend.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form
            onSubmit={handlePredict}
            className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5"
          >
            <h2 className="font-headline font-bold text-lg text-[#1E2227]">
              Prediction Input
            </h2>
            <label className="block text-xs font-semibold text-[#1E2227]">
              CIF structure
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer hover:border-[#F1641D]">
                <Upload size={15} className="text-[#F1641D]" />
                <span className="truncate">
                  {file?.name ?? "Choose a .cif file"}
                </span>
                <input
                  type="file"
                  accept=".cif"
                  className="sr-only"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </span>
            </label>
            <label className="block text-xs font-semibold text-[#1E2227]">
              Temperature (K)
              <input
                type="number"
                min="1"
                value={temperature}
                onChange={(event) => setTemperature(event.target.value)}
                className="mt-1.5 w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#F1641D]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading
                ? "Running backend prediction..."
                : "Run Property Prediction"}
              <Play size={14} />
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
        </div>
        <div className="lg:col-span-7">
          {!result && !loading && (
            <div className="bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E]">
              Awaiting a real CIF prediction response.
            </div>
          )}
          {loading && (
            <div className="bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E]">
              Prediction running. Waiting for the model service...
            </div>
          )}
          {result && <PredictionResult result={result} />}
        </div>
      </div>
    </div>
  );
}

function PredictionResult({ result }: { result: TrialPredictionResponse }) {
  const value = (candidate: number | string | undefined, suffix = "") =>
    candidate === undefined || candidate === null
      ? "Not available"
      : `${candidate}${suffix}`;
  return (
    <section
      className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6"
      aria-label="Prediction result"
    >
      <div className="border-b border-[#F2E7DC] pb-4">
        <h2 className="font-headline font-bold text-xl text-[#1E2227]">
          {result.composition || "Predicted structure"}
        </h2>
        <p className="text-xs text-[#8C929C]">
          Model: {result.model_version || "Not available"} · Classification:{" "}
          {result.classification || "Not available"}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard label="Activation energy" value={value(result.Ea, " eV")} />
        <ResultCard label="Log prefactor" value={value(result.logA)} />
        <ResultCard
          label="Conductivity"
          value={value(result.conductivity, " S/cm")}
        />
        <ResultCard
          label="Temperature"
          value={value(result.temperature_k, " K")}
        />
        <ResultCard
          label="Confidence"
          value={result.confidence || "Not available"}
        />
        <ResultCard
          label="Validation status"
          value={result.validation_status || "Not available"}
        />
      </div>
      {result.warnings?.length ? (
        <div className="rounded-xl bg-[#FAF4EE] px-4 py-3 text-xs text-[#6C737E]">
          {result.warnings.join(" ")}
        </div>
      ) : null}
      {result.feature_coverage && (
        <p className="text-xs text-[#8C929C]">
          Feature coverage: {result.feature_coverage.coverage_pct}% (
          {result.feature_coverage.coverage_level})
        </p>
      )}
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC]">
      <span className="block text-xs font-bold text-[#8C929C] uppercase">
        {label}
      </span>
      <span className="block mt-2 text-2xl font-headline font-bold text-[#1E2227] break-words">
        {value}
      </span>
    </div>
  );
}
