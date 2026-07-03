import React, { useState } from "react";

export default function Calculations() {
  // State for inputs
  const [composition, setComposition] = useState("Li10GeP2S12");
  const [temperature, setTemperature] = useState(300);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Prediction history data
  const predictionHistory = [
    { material: "Li7La3Zr2O12", energy: "0.42 eV" },
    { material: "Na3PS4", energy: "0.28 eV" },
  ];

  // KPI data
  const activationEnergy = { value: "0.245", unit: "eV", percentile: "Top 5%" };
  const preExponential = {
    value: "5.82",
    unit: "S�K/cm",
    bars: 4,
  };
  const ionicConductivity = {
    value: "1.4 x 10^-2",
    unit: "S/cm",
    isLive: true,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="enterprise-page">
      <div className="enterprise-shell flex min-h-screen flex-col gap-6">
        <header className="flex flex-col gap-3 border-b border-gray-200 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-neutral-400">
              Inference workspace
            </p>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-gray-900 dark:text-neutral-100 md:text-4xl">
              Calculations
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-neutral-400">
              Run material inference, inspect prediction history, and compare
              model outputs in a controlled dashboard layout.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="enterprise-button-secondary">
              Download Report
            </button>
            <button className="enterprise-button-primary">Run Batch</button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 overflow-hidden lg:flex-row">
          <section className="flex w-full flex-col gap-6 overflow-y-auto pr-1 lg:w-80">
            <div className="enterprise-panel flex flex-col gap-6 p-6">
              <div>
                <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-neutral-100 font-headline">
                  Input Configuration
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Define your crystalline system
                </p>
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                  Structure Data (CIF)
                </label>
                <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800/60">
                  <input
                    type="file"
                    id="cif-upload"
                    className="hidden"
                    accept=".cif"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="cif-upload"
                    className="w-full cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined flex justify-center text-3xl text-gray-700 dark:text-neutral-200">
                      upload_file
                    </span>
                    <span className="mt-2 block break-words text-center text-[10px] text-gray-500 dark:text-neutral-400">
                      {uploadedFile
                        ? uploadedFile.name
                        : "Drag CIF file or click to upload"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Composition Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                  Chemical Composition
                </label>
                <input
                  type="text"
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="enterprise-input font-mono"
                />
              </div>

              {/* Temperature Slider */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    Temperature (T)
                  </label>
                  <span className="font-headline text-sm text-gray-900 dark:text-neutral-100">
                    {temperature} K
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-lg bg-gray-200 h-1 dark:bg-neutral-800"
                />
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-neutral-500">
                  <span>100K</span>
                  <span>1000K</span>
                </div>
              </div>

              {/* Run Inference Button */}
              <button className="enterprise-button-primary mt-4 w-full py-4 font-semibold">
                <span className="material-symbols-outlined">bolt</span>
                <span>RUN INFERENCE</span>
              </button>
            </div>

            {/* Prediction History Card */}
            <div className="enterprise-panel p-6">
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                Prediction History
              </h3>
              <div className="space-y-3">
                {predictionHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                  >
                    <span className="text-xs text-gray-700 dark:text-neutral-200">
                      {item.material}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500 dark:text-neutral-400">
                      {item.energy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
            {/* Primary KPIs Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Activation Energy */}
              <div className="enterprise-panel relative overflow-hidden p-6 transition-colors hover:border-gray-300 dark:hover:border-neutral-700">
                <div className="absolute -right-4 -top-4 opacity-5 transition-opacity group-hover:opacity-10">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "128px" }}
                  >
                    energy_savings_leaf
                  </span>
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                  Activation Energy (Ea)
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-headline text-4xl font-bold text-gray-900 dark:text-neutral-100">
                    {activationEnergy.value}
                  </span>
                  <span className="pb-1 text-lg text-gray-500 dark:text-neutral-400">
                    {activationEnergy.unit}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
                    <div className="h-full w-[25%] bg-gray-900 dark:bg-neutral-100"></div>
                  </div>
                  <span className="whitespace-nowrap text-[10px] font-bold text-gray-700 dark:text-neutral-200">
                    {activationEnergy.percentile}
                  </span>
                </div>
              </div>

              {/* Pre-exponential factor */}
              <div className="enterprise-panel relative overflow-hidden p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                  Pre-exponential log(A)
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-headline text-4xl font-bold text-gray-900 dark:text-neutral-100">
                    {preExponential.value}
                  </span>
                  <span className="pb-1 text-sm text-gray-500 dark:text-neutral-400">
                    {preExponential.unit}
                  </span>
                </div>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < preExponential.bars
                          ? "bg-gray-900 dark:bg-neutral-100"
                          : "bg-gray-200 dark:bg-neutral-800"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Ionic Conductivity */}
              <div className="enterprise-panel relative overflow-hidden border-l-4 border-l-gray-900 p-6 dark:border-l-neutral-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    Ionic Conductivity
                  </h3>
                  {ionicConductivity.isLive && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-700 dark:text-neutral-200">
                      <div className="h-2 w-2 rounded-full bg-gray-900 animate-pulse dark:bg-neutral-100"></div>
                      <span className="font-bold">LIVE</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-2">
                  <span className="font-headline text-4xl font-bold text-gray-900 dark:text-neutral-100">
                    {ionicConductivity.value}
                  </span>
                  <span className="pb-1 text-lg text-gray-500 dark:text-neutral-400">
                    {ionicConductivity.unit}
                  </span>
                </div>
                <p className="mt-4 text-[10px] italic text-gray-500 dark:text-neutral-500">
                  "Highly competitive with LGPS standards"
                </p>
              </div>
            </div>

            {/* Main Visualization Block */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[400px]">
              {/* Arrhenius Plot */}
              <div className="enterprise-panel flex h-full flex-col p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    Arrhenius Plot: ln(sT) vs 1000/T
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-900 dark:bg-neutral-100"></span>
                      <span className="text-[10px] uppercase text-gray-500 dark:text-neutral-400">
                        Predicted
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-neutral-600"></span>
                      <span className="text-[10px] uppercase text-gray-500 dark:text-neutral-400">
                        Reference
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative flex items-end gap-1 px-4 min-h-[200px]">
                  <div className="absolute inset-0 border-l border-b border-outline-variant/20 m-4 mb-8"></div>
                  <svg
                    className="absolute inset-0 w-full h-full p-4 pointer-events-none drop-shadow-md"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 50 180 L 350 40"
                      fill="none"
                      stroke="#111827"
                      strokeWidth="3"
                    />
                    <circle cx="50" cy="180" fill="#ffb596" r="5" />
                    <circle cx="150" cy="133" fill="#ffb596" r="5" />
                    <circle cx="250" cy="87" fill="#ffb596" r="5" />
                    <circle cx="350" cy="40" fill="#ffb596" r="5" />

                    <path
                      d="M 50 170 L 350 70"
                      fill="none"
                      stroke="#555"
                      strokeDasharray="6"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="w-full flex justify-between absolute bottom-0 left-0 right-0 px-4 text-[10px] text-neutral-500 font-mono">
                    <span>1.0</span>
                    <span>1.5</span>
                    <span>2.0</span>
                    <span>2.5</span>
                    <span>3.0</span>
                    <span className="mr-8">3.5</span>
                  </div>
                </div>
              </div>

              {/* Property Comparison Grid */}
              <div className="glass-card rounded-xl p-6 h-full flex flex-col border border-outline-variant/10">
                <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-6">
                  Property Comparison (Bento Scale)
                </h3>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Chemical Stability */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 flex flex-col justify-center border border-primary/20 items-center sm:items-start text-center sm:text-left shadow-lg">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      Chemical Stability
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-headline font-bold text-on-surface">
                        HIGH
                      </span>
                      <span className="material-symbols-outlined text-primary text-lg leading-none">
                        verified
                      </span>
                    </div>
                  </div>

                  {/* H2O Sensitivity */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 flex flex-col justify-center items-center sm:items-start text-center sm:text-left border border-outline-variant/10">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      H2O Sensitivity
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-headline font-bold text-on-surface">
                        LOW
                      </span>
                    </div>
                  </div>

                  {/* Structural Matching Score - Full Width */}
                  <div className="col-span-1 sm:col-span-2 bg-surface-container-lowest rounded-lg p-5 flex flex-col justify-center border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                        Structural Match
                      </span>
                      <span className="text-[10px] text-primary font-bold">
                        94%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-gradient-to-r from-primary to-primary-container rounded-full"></div>
                    </div>
                  </div>

                  {/* Lattice Energy */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 flex flex-col justify-center overflow-hidden relative border border-outline-variant/10 items-center sm:items-start text-center sm:text-left">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,102,0,0.1),transparent)] mix-blend-screen pointer-events-none"></div>
                    <span className="relative z-10 text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      Lattice Energy
                    </span>
                    <span className="relative z-10 text-xl font-headline font-bold text-on-surface mt-2 text-orange-200">
                      -14.2{" "}
                      <span className="text-xs text-neutral-500 font-normal">
                        kJ/mol
                      </span>
                    </span>
                  </div>

                  {/* Synthesis Ease */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 flex flex-col justify-center border border-outline-variant/10 items-center sm:items-start text-center sm:text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      Synthesis Ease
                    </span>
                    <div className="flex gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-sm ${
                            i < 3 ? "text-primary" : "text-neutral-700"
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
