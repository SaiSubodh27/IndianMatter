import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

type TrialResult = {
  id?: string;
  fileName: string;
  Ea: number;
  logA?: number;
  conductivity: number;
  composition?: string;
  materialClass?: string;
  confidence?: string;
  validationStatus?: string;
  predictionQuality?: string;
  normalizedHes?: number;
  warnings?: string[];
  temperatureSeries?: Array<{
    temperature_k: number;
    conductivity_s_cm: number;
  }>;
  materialDetails?: {
    crystal_system?: string;
    material_type?: string;
    ion_conductor_type?: string;
  };
  structuralDetails?: {
    space_group?: string;
    density?: number;
    volume?: number;
    elements?: string[];
    lattice?: {
      a: number;
      b: number;
      c: number;
      alpha: number;
      beta: number;
      gamma: number;
    };
  };
  hesScore?: number;
  hesRating?: string;
};

export default function Trial() {
  const [temperature, setTemperature] = useState<number>(298);
  const [file, setFile] = useState<File | null>(null);
  const [composition, setComposition] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrialResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      if (selected?.name.toLowerCase().endsWith(".cif")) {
        setFile(selected);
        setError(null);
      } else {
        setError("Only a single .cif file is supported.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected?.name.toLowerCase().endsWith(".cif")) {
        setFile(selected);
        setError(null);
      } else {
        setError("Only a single .cif file is supported.");
      }
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please upload a .cif file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("temperature", temperature.toString());
      if (composition.trim() !== "") {
        formData.append("material_name", composition);
      }

      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/trial/predict`, {
          method: "POST",
          body: formData,
        });
      } catch {
        // Fallback to Flask backend on port 5000
        response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(
          data.detail || data.error || `Prediction failed for ${file.name}`,
        );
      }

      const details =
        data.material_properties?.material_classification?.detailed ||
        data.classification_detailed;

      const rawEa =
        data.Ea ??
        data.ea ??
        data.predicted_properties?.activation_energy?.value_ev ??
        0;
      const rawLogA =
        data.logA ??
        data.log10_A ??
        data.predicted_properties?.pre_exponential_factor?.log10_value ??
        0;
      const rawCond =
        data.conductivity ??
        data.conductivity_prediction?.value_s_cm ??
        data.predicted_properties?.ionic_conductivity?.value_s_cm ??
        0;

      setResult({
        id: data.id || data.prediction_id,
        fileName: data.cif_name || file.name,
        Ea: Number(rawEa),
        logA: Number(rawLogA),
        conductivity: Number(rawCond),
        composition:
          data.composition ||
          data.formula ||
          data.material_properties?.chemical_composition?.formula ||
          composition ||
          "Unknown",
        materialClass:
          data.classification ||
          details?.ion_conductor_type ||
          data.material_properties?.material_classification?.crystal_system ||
          "Unknown",
        materialDetails: details,
        structuralDetails:
          data.detailed_structure ||
          data.material_properties?.structural_details,
        hesScore: data.hes_score ?? data.hes?.score ?? data.scoring?.hes_score,
        normalizedHes:
          data.normalized_hes ??
          data.hes?.normalized ??
          data.scoring?.normalized_hes,
        hesRating:
          data.hes_rating ?? data.hes?.rating ?? data.scoring?.hes_rating,
        confidence:
          data.confidence ?? data.hes?.confidence ?? data.scoring?.confidence,
        validationStatus:
          data.validation_status ??
          data.hes?.validation_status ??
          data.scoring?.validation_status,
        predictionQuality:
          data.prediction_quality ?? data.hes?.prediction_quality,
        warnings: data.warnings || [],
        temperatureSeries:
          data.temperature_series ||
          data.arrhenius_parameters?.temperature_series ||
          [],
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while predicting.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 h-20">
        <div className="text-2xl font-bold tracking-tighter text-orange-500 font-headline">
          <Link to="/">IndianMatter</Link>
        </div>
        <div className="hidden md:flex items-center gap-8 font-headline tracking-tight">
          <Link
            to="/"
            className="text-neutral-400 hover:text-neutral-200 transition-all duration-300"
          >
            Discover
          </Link>
          <a
            className="text-neutral-400 hover:text-neutral-200 transition-all duration-300"
            href="#"
          >
            Datasets
          </a>
          <a
            className="text-neutral-400 hover:text-neutral-200 transition-all duration-300"
            href="#"
          >
            API
          </a>
          <a
            className="text-neutral-400 hover:text-neutral-200 transition-all duration-300"
            href="#"
          >
            Documentation
          </a>
        </div>
        <Link
          to="/signin"
          className="bg-neutral-800/50 px-6 py-2 rounded-lg text-orange-400 font-headline font-semibold scale-98 hover:scale-105 active:scale-95 transition-transform hover:bg-neutral-800/70"
        >
          Sign In
        </Link>
      </nav>

      <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
        {/* Trial Mode Header */}
        <div className="w-full max-w-5xl mb-12 text-center md:text-left">
          <span className="font-headline text-primary text-xs uppercase tracking-[0.3em] mb-2 block">
            Experimental Protocol
          </span>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4 text-on-surface">
            Predictive Analysis{" "}
            <span className="text-primary-container">Trial Mode</span>
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-lg font-light leading-relaxed">
            Instantly calculate ionic conductivity and activation energy for
            solid-state electrolytes using our neural network pre-trained on
            45,000+ crystal structures.
          </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Inputs & Upload */}
          <div className="lg:col-span-7 glass-card p-8 rounded-xl space-y-8">
            {/* Error Banner */}
            {error && (
              <div className="bg-error/10 border border-error text-error px-4 py-3 rounded text-sm font-bold uppercase tracking-wider relative">
                <span className="material-symbols-outlined align-middle mr-2">
                  error
                </span>
                {error}
                <button
                  onClick={() => setError(null)}
                  className="absolute right-2 top-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>
            )}

            {/* CIF Upload Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative border-2 border-dashed ${file ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary-container/50 hover:bg-surface-container-low/40"} rounded-lg p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".cif"
                className="hidden"
              />
              <span
                className={`material-symbols-outlined text-5xl ${file ? "text-primary" : "text-outline group-hover:text-primary"} mb-4 transition-colors`}
              >
                {file ? "task" : "upload_file"}
              </span>
              <h3 className="font-headline text-xl font-medium mb-1">
                {file ? "1 CIF Selected" : "Drag & Drop a CIF File"}
              </h3>
              <p className="text-on-surface-variant text-sm font-light">
                {file
                  ? file.name
                  : "Crystallographic Information Framework (.cif) only"}
              </p>
              <button className="mt-6 px-4 py-2 bg-surface-container-high rounded text-xs font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
                {file ? "Change File" : "Select File"}
              </button>
            </div>

            {/* Chemical Composition Input */}
            <div className="space-y-4">
              <label className="font-headline text-sm font-semibold tracking-wide text-primary flex items-center justify-between">
                <span className="uppercase">Chemical Composition</span>
                <span className="text-xs text-on-surface-variant font-light lowercase tracking-normal">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline-variant/50 focus:ring-2 focus:ring-primary-container transition-all focus:outline-none"
                  placeholder="e.g. Li7La3Zr2O12"
                  type="text"
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-[20px]">
                  science
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-secondary-container/10 border border-secondary-container/20 px-3 py-1 rounded-full text-primary text-[10px] font-headline uppercase">
                  Li-Ion
                </span>
                <span className="bg-secondary-container/10 border border-secondary-container/20 px-3 py-1 rounded-full text-primary text-[10px] font-headline uppercase">
                  Garnet-type
                </span>
                <span className="bg-secondary-container/10 border border-secondary-container/20 px-3 py-1 rounded-full text-primary text-[10px] font-headline uppercase">
                  Cubic Phase
                </span>
              </div>
            </div>

            {/* Temperature Selection */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="font-headline text-sm font-semibold tracking-wide text-primary uppercase">
                  Temperature (K)
                </label>
                <div className="flex items-end gap-2">
                  <input
                    type="number"
                    min="200"
                    max="1000"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-24 bg-surface-container-lowest border border-outline-variant/30 rounded-md p-2 text-2xl font-headline font-bold text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm font-light text-on-surface-variant tracking-normal mb-2">
                    K
                  </span>
                </div>
              </div>
              <input
                className="w-full accent-primary bg-transparent cursor-pointer h-2 bg-surface-container-highest rounded-lg appearance-none"
                max="1000"
                min="200"
                type="range"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-headline text-outline tracking-widest uppercase">
                <span>200 K</span>
                <span>400 K</span>
                <span>600 K</span>
                <span>800 K</span>
                <span>1000 K</span>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              onClick={handlePredict}
              disabled={loading || !file}
              className={`w-full bg-gradient-to-br from-primary to-primary-container h-16 rounded-lg text-on-primary font-headline font-extrabold text-lg uppercase tracking-widest neon-glow transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(255,102,0,0.3)] ${file && !loading ? "hover:scale-[1.02] active:scale-95 cursor-pointer opacity-100" : "opacity-50 cursor-not-allowed grayscale"}`}
            >
              {loading ? (
                <span className="material-symbols-outlined text-[24px] animate-spin">
                  autorenew
                </span>
              ) : (
                <span className="material-symbols-outlined text-[24px]">
                  bolt
                </span>
              )}
              {loading ? "Processing..." : "Predict Properties"}
            </button>
          </div>

          {/* Right: Results Visualization */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20 relative min-h-[400px]">
              <div className="p-6 bg-surface-container-highest/40 border-b border-outline-variant/10">
                <h2 className="font-headline text-lg font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    analytics
                  </span>
                  Simulation Output
                </h2>
              </div>
              <div className="p-8 space-y-10 max-h-[800px] overflow-y-auto">
                {loading && !result ? (
                  <div className="text-center py-20 text-outline-variant">
                    <span className="material-symbols-outlined text-5xl mb-4 animate-spin text-primary">
                      autorenew
                    </span>
                    <p>Processing structural data...</p>
                  </div>
                ) : result ? (
                  <div className="space-y-6 pb-10 border-b border-outline-variant/20 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-green-400/20 bg-green-400/10 px-4 py-3 text-green-300">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">
                          check_circle
                        </span>
                        <span className="font-headline text-xs font-bold uppercase tracking-widest">
                          Prediction completed
                        </span>
                      </div>
                      {result.id && (
                        <button
                          onClick={() => {
                            const blob = new Blob(
                              [JSON.stringify(result, null, 2)],
                              { type: "application/json" },
                            );
                            const url = URL.createObjectURL(blob);
                            const anchor = document.createElement("a");
                            anchor.href = url;
                            anchor.download = `${result.fileName.replace(/\.cif$/i, "")}_ioncast_report.json`;
                            anchor.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="rounded bg-green-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-200 hover:bg-green-400/20"
                        >
                          Download Report
                        </button>
                      )}
                    </div>
                    <h3 className="font-headline text-primary font-semibold border-b border-primary/20 pb-2 mb-4 break-all">
                      {result.fileName}
                    </h3>
                    {/* Material Info Header */}
                    <div className="flex justify-between items-start bg-surface-container-lowest/50 p-4 rounded-lg border border-outline-variant/10 shadow-inner">
                      <div>
                        <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                          Chemical Composition
                        </p>
                        <h4 className="text-xl font-headline font-bold text-on-surface">
                          {result.composition || "-"}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.materialDetails?.material_type && (
                            <span className="bg-secondary-container/10 border border-secondary-container/20 px-2 py-0.5 rounded text-primary text-[9px] font-headline uppercase">
                              {result.materialDetails.material_type}
                            </span>
                          )}
                          {result.materialDetails?.crystal_system &&
                            result.materialDetails.crystal_system !==
                              "Unknown" && (
                              <span className="bg-secondary-container/10 border border-secondary-container/20 px-2 py-0.5 rounded text-primary text-[9px] font-headline uppercase">
                                {result.materialDetails.crystal_system} Phase
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                          Predicted Class & Score
                        </p>
                        <div className="flex flex-col items-end mt-1 gap-2">
                          <span
                            className="bg-secondary-container/20 border border-secondary-container/30 px-3 py-1 rounded-full text-primary text-[10px] font-headline uppercase inline-block text-center max-w-[200px] truncate"
                            title={result.materialClass}
                          >
                            {result.materialClass}
                          </span>
                          {result.hesScore !== undefined && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                                result.hesRating === "Excellent"
                                  ? "text-green-400 border-green-400/30 bg-green-400/10"
                                  : result.hesRating === "Good"
                                    ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                                    : result.hesRating === "Moderate"
                                      ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                                      : "text-red-400 border-red-400/30 bg-red-400/10"
                              }`}
                            >
                              HES: {result.hesScore.toFixed(0)} / 100 (
                              {result.hesRating})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Structural Information hidden by request */}

                    {/* Metric 1 */}
                    <div className="relative">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                            Activation Energy
                          </p>
                          <h4 className="text-4xl font-headline font-bold text-on-surface">
                            {result.Ea}
                            <span className="text-sm text-outline-variant font-normal ml-1">
                              eV
                            </span>
                          </h4>
                        </div>
                        <div className="h-10 w-10 rounded bg-secondary-container/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            energy_savings_leaf
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full shadow-[0_0_8px_#ff6600] transition-all duration-1000 w-[32%]"></div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                            Arrhenius log(A)
                          </p>
                          <h4 className="text-4xl font-headline font-bold text-on-surface">
                            {result.logA?.toFixed(4)}
                            <span className="text-sm text-outline-variant font-normal ml-1">
                              log10
                            </span>
                          </h4>
                        </div>
                        <div className="h-10 w-10 rounded bg-secondary-container/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            functions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="relative">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                            Ionic Conductivity (σ)
                          </p>
                          <h4 className="text-4xl font-headline font-bold text-primary">
                            {result.conductivity.toExponential(2)}
                            <span className="text-sm text-outline-variant font-normal ml-2 text-on-surface">
                              S/cm
                            </span>
                          </h4>
                        </div>
                        <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            battery_charging_full
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-lg bg-surface-container-lowest/60 p-3 border border-outline-variant/10">
                        <p className="text-[9px] font-headline uppercase tracking-widest text-outline-variant">
                          Confidence
                        </p>
                        <p className="text-lg font-headline font-bold text-on-surface">
                          {result.confidence || "Unknown"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface-container-lowest/60 p-3 border border-outline-variant/10">
                        <p className="text-[9px] font-headline uppercase tracking-widest text-outline-variant">
                          Validation
                        </p>
                        <p className="text-lg font-headline font-bold text-on-surface capitalize">
                          {(result.validationStatus || "unknown").replace(
                            "_",
                            " ",
                          )}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface-container-lowest/60 p-3 border border-outline-variant/10">
                        <p className="text-[9px] font-headline uppercase tracking-widest text-outline-variant">
                          Quality
                        </p>
                        <p className="text-lg font-headline font-bold text-on-surface">
                          {result.predictionQuality || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {result.temperatureSeries &&
                      result.temperatureSeries.length > 0 && (
                        <div className="rounded-lg bg-surface-container-lowest/60 p-4 border border-outline-variant/10">
                          <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-4">
                            Temperature Graph
                          </p>
                          <div className="flex h-28 items-end gap-1">
                            {result.temperatureSeries.map((point) => {
                              const maxValue = Math.max(
                                ...result.temperatureSeries!.map(
                                  (p) => p.conductivity_s_cm,
                                ),
                              );
                              const height =
                                maxValue > 0
                                  ? Math.max(
                                      6,
                                      (point.conductivity_s_cm / maxValue) *
                                        100,
                                    )
                                  : 6;
                              return (
                                <div
                                  key={point.temperature_k}
                                  className="flex-1 rounded-t bg-primary/80"
                                  style={{ height: `${height}%` }}
                                  title={`${point.temperature_k} K: ${point.conductivity_s_cm.toExponential(2)} S/cm`}
                                />
                              );
                            })}
                          </div>
                          <div className="mt-2 flex justify-between text-[9px] text-outline-variant">
                            <span>
                              {result.temperatureSeries[0].temperature_k} K
                            </span>
                            <span>
                              {
                                result.temperatureSeries[
                                  result.temperatureSeries.length - 1
                                ].temperature_k
                              }{" "}
                              K
                            </span>
                          </div>
                        </div>
                      )}

                    {result.warnings && result.warnings.length > 0 && (
                      <div className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-4 text-yellow-200">
                        <p className="text-[10px] font-headline uppercase tracking-widest mb-2">
                          Warnings
                        </p>
                        {result.warnings.map((warning) => (
                          <p key={warning} className="text-xs">
                            {warning}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 text-outline-variant">
                    <span className="material-symbols-outlined text-5xl mb-4">
                      science
                    </span>
                    <p>Upload a CIF file and run prediction to view results</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help Tip */}
            <div className="bg-surface-container-highest/30 rounded-lg p-6 border-l-4 border-primary mt-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary">
                  info
                </span>
                <div>
                  <p className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface mb-1">
                    Researcher Tip
                  </p>
                  <p className="text-sm text-on-surface-variant font-light">
                    Trial mode sends one CIF through the trained backend
                    inference pipeline and HES validation before showing a
                    result.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-on-surface-variant font-light">
            Login to unlock full features, batch processing, and high-fidelity
            DFT simulations.
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 font-headline text-primary font-bold uppercase tracking-widest text-xs hover:text-primary-container transition-colors group"
          >
            Create Researcher Account
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="bg-neutral-950 w-full py-12 border-t border-outline-variant/10 flex flex-col items-center gap-4 px-8 mt-12">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <a
            className="text-neutral-600 hover:text-primary transition-colors font-body text-xs uppercase tracking-widest font-semibold"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-neutral-600 hover:text-primary transition-colors font-body text-xs uppercase tracking-widest font-semibold"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-neutral-600 hover:text-primary transition-colors font-body text-xs uppercase tracking-widest font-semibold"
            href="#"
          >
            Research Ethics
          </a>
          <a
            className="text-neutral-600 hover:text-primary transition-colors font-body text-xs uppercase tracking-widest font-semibold"
            href="#"
          >
            Contact
          </a>
        </div>
        <p className="text-neutral-600/70 font-body text-[10px] uppercase tracking-widest">
          © 2026 IndianMatter. Engineered for Scientific Discovery.
        </p>
      </footer>
    </div>
  );
}
