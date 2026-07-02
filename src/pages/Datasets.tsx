import { useState } from "react";
import { ArrowRight, Database, Zap, Upload } from "lucide-react";

type DatasetView = "hub" | "extraction" | "batch" | "import";

export default function Datasets() {
  const [currentView, setCurrentView] = useState<DatasetView>("hub");

  const TabNavigation = () => (
    <div className="flex gap-0 mb-8 border-b border-[#2A2A2A]">
      <button
        onClick={() => setCurrentView("extraction")}
        className={`px-6 py-3 font-semibold transition-all border-b-2 ${
          currentView === "extraction"
            ? "text-[#FF6600] border-[#FF6600] shadow-lg shadow-[#FF6600]/20"
            : "text-[#E3BFB1] hover:text-[#FFB596] border-transparent"
        }`}
      >
        Feature Extraction
      </button>
      <button
        onClick={() => setCurrentView("batch")}
        className={`px-6 py-3 font-semibold transition-all border-b-2 ${
          currentView === "batch"
            ? "text-[#FF6600] border-[#FF6600] shadow-lg shadow-[#FF6600]/20"
            : "text-[#E3BFB1] hover:text-[#FFB596] border-transparent"
        }`}
      >
        Batch Processing
      </button>
      <button
        onClick={() => setCurrentView("import")}
        className={`px-6 py-3 font-semibold transition-all border-b-2 ${
          currentView === "import"
            ? "text-[#FF6600] border-[#FF6600] shadow-lg shadow-[#FF6600]/20"
            : "text-[#E3BFB1] hover:text-[#FFB596] border-transparent"
        }`}
      >
        Import & Manage
      </button>
    </div>
  );

  const Hub = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#E2E2E2] mb-2">
          Datasets & Data Management
        </h1>
        <p className="text-[#E3BFB1] text-lg">
          Manage, process, and extract features from your materials datasets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature Extraction Card */}
        <div className="bg-[#1B1B1B] rounded-lg p-6 hover:bg-[#2A2A2A] transition-all border border-[#353535] group">
          <div className="flex items-start justify-between mb-4">
            <Database className="text-[#FF6600] w-8 h-8" />
            <span className="text-sm bg-[#0E0E0E] text-[#FFB596] px-3 py-1 rounded">
              Ready
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[#E2E2E2] mb-2">
            Feature Extraction
          </h3>
          <p className="text-[#E3BFB1] text-sm mb-4">
            Extract and analyze 312 features from crystal structures and
            compositions
          </p>
          <button
            onClick={() => setCurrentView("extraction")}
            className="w-full bg-gradient-to-r from-[#FFB596] to-[#FF6600] text-[#581e00] font-semibold py-2 rounded hover:shadow-lg hover:shadow-[#FF6600]/30 transition-all flex items-center justify-center gap-2 group-hover:translate-x-1"
          >
            Go to Extraction <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Batch Processing Card */}
        <div className="bg-[#1B1B1B] rounded-lg p-6 hover:bg-[#2A2A2A] transition-all border border-[#353535] group">
          <div className="flex items-start justify-between mb-4">
            <Zap className="text-[#FF6600] w-8 h-8" />
            <span className="text-sm bg-[#0E0E0E] text-[#FFB596] px-3 py-1 rounded">
              3/10 Active
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[#E2E2E2] mb-2">
            Batch Processing
          </h3>
          <p className="text-[#E3BFB1] text-sm mb-4">
            Process multiple datasets in queue, monitor progress and status in
            real-time
          </p>
          <button
            onClick={() => setCurrentView("batch")}
            className="w-full bg-gradient-to-r from-[#FFB596] to-[#FF6600] text-[#581e00] font-semibold py-2 rounded hover:shadow-lg hover:shadow-[#FF6600]/30 transition-all flex items-center justify-center gap-2 group-hover:translate-x-1"
          >
            Go to Batch <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Import & Management Card */}
        <div className="bg-[#1B1B1B] rounded-lg p-6 hover:bg-[#2A2A2A] transition-all border border-[#353535] group">
          <div className="flex items-start justify-between mb-4">
            <Upload className="text-[#FF6600] w-8 h-8" />
            <span className="text-sm bg-[#0E0E0E] text-[#FFB596] px-3 py-1 rounded">
              48 Datasets
            </span>
          </div>
          <h3 className="text-xl font-semibold text-[#E2E2E2] mb-2">
            Import & Management
          </h3>
          <p className="text-[#E3BFB1] text-sm mb-4">
            Upload, organize, and manage your material datasets efficiently
          </p>
          <button
            onClick={() => setCurrentView("import")}
            className="w-full bg-gradient-to-r from-[#FFB596] to-[#FF6600] text-[#581e00] font-semibold py-2 rounded hover:shadow-lg hover:shadow-[#FF6600]/30 transition-all flex items-center justify-center gap-2 group-hover:translate-x-1"
          >
            Go to Import <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-[#2A2A2A]">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#FF6600]">312</div>
          <div className="text-[#E3BFB1] text-sm">Features Available</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#FF6600]">48</div>
          <div className="text-[#E3BFB1] text-sm">Total Datasets</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#FF6600]">98.4%</div>
          <div className="text-[#E3BFB1] text-sm">Model Accuracy</div>
        </div>
      </div>
    </div>
  );

  const FeatureExtraction = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#E2E2E2]">Feature Extraction</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1B1B1B] rounded-lg p-6 border border-[#353535]">
          <h3 className="text-lg font-semibold text-[#FFB596] mb-4">
            Input Options
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-[#2A2A2A] hover:bg-[#353535] text-[#E2E2E2] py-2 rounded transition-all">
              Upload CIF File
            </button>
            <button className="w-full bg-[#2A2A2A] hover:bg-[#353535] text-[#E2E2E2] py-2 rounded transition-all">
              Enter Composition
            </button>
          </div>
        </div>
        <div className="bg-[#1B1B1B] rounded-lg p-6 border border-[#353535]">
          <h3 className="text-lg font-semibold text-[#FFB596] mb-4">Results</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#E3BFB1]">Features Extracted:</span>
              <span className="text-[#FF6600] font-bold">312</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E3BFB1]">Status:</span>
              <span className="text-[#FFB596]">Ready to Process</span>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full bg-gradient-to-r from-[#FFB596] to-[#FF6600] text-[#581e00] font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FF6600]/30 transition-all">
        Extract Features
      </button>
    </div>
  );

  const BatchProcessing = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#E2E2E2]">Batch Processing</h2>
      <div className="bg-[#1B1B1B] rounded-lg p-6 border border-[#353535]">
        <h3 className="text-lg font-semibold text-[#FFB596] mb-4">
          Processing Status: 3/10 Jobs Completed
        </h3>
        <div className="w-full bg-[#0E0E0E] rounded-full h-3 mb-4">
          <div className="bg-gradient-to-r from-[#FFB596] to-[#FF6600] h-3 rounded-full w-3/10 shadow-lg shadow-[#FF6600]/50"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((job) => (
            <div key={job} className="bg-[#0E0E0E] p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="text-[#E2E2E2]">Job #{job}</span>
                <span className="text-[#FFB596]">
                  {job === 1
                    ? "Processing"
                    : job === 2
                      ? "Queued"
                      : "Completed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex-1 bg-[#FF6600] hover:bg-[#FF7722] text-[#581e00] font-bold py-2 rounded-lg transition-all">
          Start Processing
        </button>
        <button className="flex-1 bg-[#2A2A2A] hover:bg-[#353535] text-[#FFB596] font-bold py-2 rounded-lg transition-all">
          Pause
        </button>
      </div>
    </div>
  );

  const ImportManagement = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#E2E2E2]">Import & Management</h2>
      <div className="bg-[#1B1B1B] rounded-lg p-8 border-2 border-dashed border-[#FF6600] text-center hover:bg-[#2A2A2A] transition-all cursor-pointer">
        <Upload className="w-12 h-12 text-[#FF6600] mx-auto mb-3" />
        <p className="text-[#E2E2E2] font-semibold">
          Drop files here or click to upload
        </p>
        <p className="text-[#E3BFB1] text-sm">Supported: CIF, POSCAR, JSON</p>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#FFB596]">
          Recent Datasets (48 Total)
        </h3>
        {[
          "SrTiO3 (Perovskite)",
          "MoS2 (2D Monolayer)",
          "GaN (Semiconductor)",
        ].map((dataset, i) => (
          <div
            key={i}
            className="bg-[#1B1B1B] p-4 rounded border border-[#353535] flex justify-between items-center"
          >
            <span className="text-[#E2E2E2]">{dataset}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#2A2A2A] hover:bg-[#353535] text-[#E3BFB1] rounded text-sm transition-all">
                View
              </button>
              <button className="px-3 py-1 bg-[#2A2A2A] hover:bg-[#353535] text-[#E3BFB1] rounded text-sm transition-all">
                Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#131313]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {currentView !== "hub" && (
          <div className="mb-8">
            <button
              onClick={() => setCurrentView("hub")}
              className="text-[#FF6600] hover:text-[#FFB596] font-semibold mb-4"
            >
              ← Back to Hub
            </button>
            <TabNavigation />
          </div>
        )}

        {currentView === "hub" && <Hub />}
        {currentView === "extraction" && (
          <>
            <TabNavigation />
            <FeatureExtraction />
          </>
        )}
        {currentView === "batch" && (
          <>
            <TabNavigation />
            <BatchProcessing />
          </>
        )}
        {currentView === "import" && (
          <>
            <TabNavigation />
            <ImportManagement />
          </>
        )}
      </div>
    </div>
  );
}
