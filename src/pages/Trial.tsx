import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Trial() {
  const [temperature, setTemperature] = useState<number>(298);
  const [files, setFiles] = useState<File[]>([]);
  const [composition, setComposition] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<
    Array<{
      fileName: string;
      Ea: number;
      logA?: number;
      conductivity: number;
      composition?: string;
      materialClass?: string;
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
    }>
  >([]);

  const k = 8.617e-5; // Boltzmann constant in eV/K

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
      const validFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.endsWith(".cif"),
      );
      if (validFiles.length > 0) {
        setFiles(validFiles);
        setError(null);
      } else {
        setError("Only .cif files are supported.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((f) =>
        f.name.endsWith(".cif"),
      );
      if (validFiles.length > 0) {
        setFiles(validFiles);
        setError(null);
      } else {
        setError("Only .cif files are supported.");
      }
    }
  };

  const handlePredict = async () => {
    if (files.length === 0) {
      setError("Please upload at least one .cif file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const newResults = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("temperature", temperature.toString());
        if (composition.trim() !== "") {
          formData.append("material_name", composition);
        }

        const response = await fetch("http://localhost:8000/api/ml/predict", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || `Prediction failed for ${file.name}`,
          );
        }

        const data = await response.json();

        let eaVal,
          logAVal,
          condVal,
          compVal,
          classVal,
          details,
          structDetails,
          hesScore,
          hesRating;

        // Check if using the new nested structure or old flat structure
        if (data.predicted_properties) {
          eaVal = data.predicted_properties.activation_energy.value_ev;
          logAVal =
            data.predicted_properties.pre_exponential_factor.log10_value;
          condVal = data.predicted_properties.ionic_conductivity.value_s_cm;
          compVal = data.material_properties?.chemical_composition?.formula;
          classVal =
            data.material_properties?.material_classification?.detailed
              ?.ion_conductor_type ||
            data.material_properties?.material_classification?.crystal_system;
          details = data.material_properties?.material_classification?.detailed;
          structDetails = data.material_properties?.structural_details;
          hesScore = data.scoring?.hes_score;
          hesRating = data.scoring?.hes_rating;
        } else {
          eaVal = data.Ea;
          logAVal = data.logA;
          condVal = data.conductivity;
          compVal = data.composition;
          classVal = data.classification;
        }

        newResults.push({
          fileName: file.name,
          Ea: eaVal,
          logA: logAVal,
          conductivity: condVal,
          composition: compVal || composition || "Unknown",
          materialClass: classVal || "Unknown",
          materialDetails: details,
          structuralDetails: structDetails,
          hesScore: hesScore,
          hesRating: hesRating,
        });
      }
      setResults(newResults);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "An unexpected error occurred connecting to the prediction server.",
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
              className={`group relative border-2 border-dashed ${files.length > 0 ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary-container/50 hover:bg-surface-container-low/40"} rounded-lg p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer`}
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".cif"
                className="hidden"
              />
              <span
                className={`material-symbols-outlined text-5xl ${files.length > 0 ? "text-primary" : "text-outline group-hover:text-primary"} mb-4 transition-colors`}
              >
                {files.length > 0 ? "task" : "upload_file"}
              </span>
              <h3 className="font-headline text-xl font-medium mb-1">
                {files.length > 0
                  ? `${files.length} File(s) Selected`
                  : "Drag & Drop CIF Files"}
              </h3>
              <p className="text-on-surface-variant text-sm font-light">
                {files.length > 0
                  ? `${files.map((f) => f.name).join(", ")}`
                  : "Crystallographic Information Framework (.cif) only"}
              </p>
              <button className="mt-6 px-4 py-2 bg-surface-container-high rounded text-xs font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
                {files.length > 0 ? "Change Files" : "Select Files"}
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
              disabled={loading || files.length === 0}
              className={`w-full bg-gradient-to-br from-primary to-primary-container h-16 rounded-lg text-on-primary font-headline font-extrabold text-lg uppercase tracking-widest neon-glow transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(255,102,0,0.3)] ${files.length > 0 && !loading ? "hover:scale-[1.02] active:scale-95 cursor-pointer opacity-100" : "opacity-50 cursor-not-allowed grayscale"}`}
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
                {loading && results.length === 0 ? (
                  <div className="text-center py-20 text-outline-variant">
                    <span className="material-symbols-outlined text-5xl mb-4 animate-spin text-primary">
                      autorenew
                    </span>
                    <p>Processing structural data...</p>
                  </div>
                ) : results.length > 0 ? (
                  results.map((res, idx) => {
                    const displayCond =
                      res.logA !== undefined
                        ? Math.pow(10, res.logA) *
                          Math.exp(-res.Ea / (k * temperature))
                        : res.conductivity;
                    return (
                      <div
                        key={idx}
                        className="space-y-6 pb-10 border-b border-outline-variant/20 last:border-0 last:pb-0"
                      >
                        <h3 className="font-headline text-primary font-semibold border-b border-primary/20 pb-2 mb-4 break-all">
                          📄 {res.fileName}
                        </h3>
                        {/* Material Info Header */}
                        <div className="flex justify-between items-start bg-surface-container-lowest/50 p-4 rounded-lg border border-outline-variant/10 shadow-inner">
                          <div>
                            <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                              Chemical Composition
                            </p>
                            <h4 className="text-xl font-headline font-bold text-on-surface">
                              {res.composition || "-"}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {res.materialDetails?.material_type && (
                                <span className="bg-secondary-container/10 border border-secondary-container/20 px-2 py-0.5 rounded text-primary text-[9px] font-headline uppercase">
                                  {res.materialDetails.material_type}
                                </span>
                              )}
                              {res.materialDetails?.crystal_system &&
                                res.materialDetails.crystal_system !==
                                  "Unknown" && (
                                  <span className="bg-secondary-container/10 border border-secondary-container/20 px-2 py-0.5 rounded text-primary text-[9px] font-headline uppercase">
                                    {res.materialDetails.crystal_system} Phase
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
                                title={res.materialClass}
                              >
                                {res.materialClass}
                              </span>
                              {res.hesScore !== undefined && (
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                                    res.hesRating === "Excellent"
                                      ? "text-green-400 border-green-400/30 bg-green-400/10"
                                      : res.hesRating === "Good"
                                        ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                                        : res.hesRating === "Moderate"
                                          ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                                          : "text-red-400 border-red-400/30 bg-red-400/10"
                                  }`}
                                >
                                  HES: {res.hesScore.toFixed(0)} / 100 (
                                  {res.hesRating})
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
                                {res.Ea}
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

                        {/* Pre-Exponential Factor metric removed dynamically by user request */}

                        {/* Metric 3 */}
                        <div className="relative">
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <p className="text-[10px] font-headline uppercase tracking-widest text-outline-variant mb-1">
                                Ionic Conductivity (σ)
                              </p>
                              <h4 className="text-4xl font-headline font-bold text-primary">
                                {displayCond.toExponential(2)}
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
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-outline-variant">
                    <span className="material-symbols-outlined text-5xl mb-4">
                      science
                    </span>
                    <p>Upload files and run prediction to view results</p>
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
                    Trial mode uses a simplified Gaussian process model. For
                    precise DFT-backed results, upgrade to Professional tier.
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
