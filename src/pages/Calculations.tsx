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
    unit: "S·K/cm",
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
    <div className="flex-1 flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-background">
      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Input Panel (Left) */}
        <section className="w-full lg:w-80 flex flex-col gap-6 custom-scrollbar overflow-y-auto pr-2">
          {/* Input Configuration Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-headline font-semibold text-primary mb-1">
                Input Configuration
              </h2>
              <p className="text-xs text-neutral-500">
                Define your crystalline system
              </p>
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                Structure Data (CIF)
              </label>
              <div className="border-2 border-dashed border-outline-variant/20 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/20 cursor-pointer transition-all">
                <input
                  type="file"
                  id="cif-upload"
                  className="hidden"
                  accept=".cif"
                  onChange={handleFileUpload}
                />
                <label htmlFor="cif-upload" className="cursor-pointer w-full text-center">
                  <span className="material-symbols-outlined text-primary-container flex justify-center text-3xl">
                    upload_file
                  </span>
                  <span className="text-[10px] text-neutral-400 block text-center mt-2 break-words">
                    {uploadedFile
                      ? uploadedFile.name
                      : "Drag CIF file or click to upload"}
                  </span>
                </label>
              </div>
            </div>

            {/* Composition Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                Chemical Composition
              </label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/10 rounded-md px-4 py-3 text-sm font-mono text-primary-container focus:outline-none focus:border-primary/40 w-full"
              />
            </div>

            {/* Temperature Slider */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Temperature (T)
                </label>
                <span className="text-sm font-headline text-primary">
                  {temperature} K
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1 bg-surface-container-low rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600">
                <span>100K</span>
                <span>1000K</span>
              </div>
            </div>

            {/* Run Inference Button */}
            <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-md neon-glow flex items-center justify-center gap-3 mt-4 hover:scale-[1.02] active:scale-95 transition-all">
              <span className="material-symbols-outlined">bolt</span>
              <span>RUN INFERENCE</span>
            </button>
          </div>

          {/* Prediction History Card */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-4">
              Prediction History
            </h3>
            <div className="space-y-3">
              {predictionHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer border border-outline-variant/5"
                >
                  <span className="text-xs text-neutral-200">{item.material}</span>
                  <span className="text-[10px] text-orange-500 font-mono">{item.energy}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Output (Main) */}
        <section className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          {/* Primary KPIs Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Activation Energy */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10 hover:border-primary/30 transition-colors">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "128px" }}
                >
                  energy_savings_leaf
                </span>
              </div>
              <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Activation Energy (Ea)
              </h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-headline font-bold text-primary">
                  {activationEnergy.value}
                </span>
                <span className="text-lg text-neutral-500 pb-1">
                  {activationEnergy.unit}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-[25%] bg-gradient-to-r from-primary to-primary-container"></div>
                </div>
                <span className="text-[10px] text-primary whitespace-nowrap font-bold">
                  {activationEnergy.percentile}
                </span>
              </div>
            </div>

            {/* Pre-exponential factor */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
              <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Pre-exponential log(A)
              </h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-headline font-bold text-on-surface">
                  {preExponential.value}
                </span>
                <span className="text-sm text-neutral-500 pb-1">
                  {preExponential.unit}
                </span>
              </div>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < preExponential.bars
                        ? "bg-primary-container"
                        : "bg-surface-container-highest"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Ionic Conductivity */}
            <div className="glass-card rounded-xl p-6 relative border-l-4 border-orange-500 border-t border-b border-r border-outline-variant/10 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Ionic Conductivity
                </h3>
                {ionicConductivity.isLive && (
                  <div className="flex items-center gap-1 text-[10px] text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-bold">LIVE</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="text-4xl font-headline font-bold text-primary">
                  {ionicConductivity.value}
                </span>
                <span className="text-lg text-neutral-500 pb-1">
                  {ionicConductivity.unit}
                </span>
              </div>
              <p className="mt-4 text-[10px] text-neutral-400 italic">
                "Highly competitive with LGPS standards"
              </p>
            </div>
          </div>

          {/* Main Visualization Block */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[400px]">
            {/* Arrhenius Plot */}
            <div className="glass-card rounded-xl p-6 h-full flex flex-col border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Arrhenius Plot: ln(sT) vs 1000/T
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-[10px] text-neutral-500 uppercase">Predicted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-700"></span>
                    <span className="text-[10px] text-neutral-500 uppercase">Reference</span>
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
                    stroke="#ff6600"
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
                    <span className="text-[10px] text-primary font-bold">94%</span>
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
                    -14.2 <span className="text-xs text-neutral-500 font-normal">kJ/mol</span>
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
  );
}
