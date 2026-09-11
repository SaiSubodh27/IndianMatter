import { useState } from "react";
import { Bookmark, Download, Trash2 } from "lucide-react";

export default function SavedResultsPage() {
  const [activeTab, setActiveTab] = useState<"materials" | "predictions" | "dft" | "cif">("materials");

  const savedMaterials = [
    { formula: "LiCoO2", name: "Lithium Cobalt Oxide", system: "Trigonal", date: "2026-09-08", id: "mp-22526" },
    { formula: "Na3Zr2Si2PO12", name: "NASICON Superionic", system: "Trigonal", date: "2026-09-09", id: "oqmd-1218" },
    { formula: "Li7La3Zr2O12", name: "Garnet LLZO", system: "Cubic", date: "2026-09-10", id: "mp-942732" },
  ];

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
            <Bookmark size={14} /> Research Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
            Saved Collections
          </h1>
          <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
            Access bookmarked crystal structures, completed DFT runs, GNN property inferences, and synthesized CIFs.
          </p>
        </div>

        <button
          onClick={() => alert("Consolidated research archive exported (ZIP).")}
          className="px-4 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-2 shadow-soft shrink-0"
        >
          <Download size={14} /> Export Workspace (ZIP)
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-[#EFE5DC] flex flex-wrap gap-2">
        {[
          { id: "materials", label: "Saved Materials (3)" },
          { id: "predictions", label: "GNN Predictions (8)" },
          { id: "dft", label: "DFT Runs (4)" },
          { id: "cif", label: "Synthesized CIFs (5)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "materials" | "predictions" | "dft" | "cif")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-[#FBE8D8] text-[#F1641D] shadow-sm"
                : "text-[#5F6771] hover:text-[#1E2227]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Saved Table / List */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F2E7DC] text-[#8C929C] font-headline uppercase text-[10px]">
                <th className="py-3 px-4">Formula</th>
                <th className="py-3 px-4">Identifier / ID</th>
                <th className="py-3 px-4">Crystal System</th>
                <th className="py-3 px-4">Saved Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EE]">
              {savedMaterials.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF4EE]/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#1E2227] font-headline text-sm">{item.formula}</td>
                  <td className="py-4 px-4 font-mono text-[#5F6771]">{item.id}</td>
                  <td className="py-4 px-4 text-[#5F6771]">{item.system}</td>
                  <td className="py-4 px-4 text-[#8C929C]">{item.date}</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => alert(`Downloaded ${item.formula} CIF`)}
                      className="p-1.5 hover:bg-[#FAF4EE] rounded-lg text-[#5F6771] hover:text-[#1E2227]"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => alert(`Removed ${item.formula} from saved collection.`)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-[#8C929C] hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
