import { useState, useEffect } from "react";
import {
  Database,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Copy,
  Check,
  X
} from "lucide-react";
import {
  fetchDatabaseOverview,
  fetchDatabaseRecords,
  fetchDatabaseRecordDetail,
  deleteDatabaseRecord,
  StoredDatabaseItem,
  DatabaseOverviewResponse
} from "../../lib/materialsPredictionApi";

export default function SavedResultsPage() {
  const [overview, setOverview] = useState<DatabaseOverviewResponse | null>(null);
  const [records, setRecords] = useState<StoredDatabaseItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stabilityFilter, setStabilityFilter] = useState<"all" | "stable" | "metastable">("all");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedRecordData, setSelectedRecordData] = useState<Record<string, any> | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Load Database stats and records
  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetchDatabaseOverview();
      setOverview(statsRes);

      const isStableParam = stabilityFilter === "stable" ? true : undefined;
      const recRes = await fetchDatabaseRecords(searchQuery, isStableParam, 1, 50);
      setRecords(recRes.items || []);
      setTotalRecords(recRes.total || 0);
    } catch (err) {
      console.error("Failed to load MongoDB materials database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [stabilityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleViewDetail = async (id: string) => {
    setSelectedRecordId(id);
    setDetailLoading(true);
    try {
      const detail = await fetchDatabaseRecordDetail(id);
      setSelectedRecordData(detail);
    } catch (err) {
      alert("Failed to load record details from database.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id: string, formula: string) => {
    if (!window.confirm(`Are you sure you want to delete '${formula}' from MongoDB?`)) {
      return;
    }
    try {
      await deleteDatabaseRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setTotalRecords((prev) => Math.max(0, prev - 1));
      if (selectedRecordId === id) {
        setSelectedRecordId(null);
        setSelectedRecordData(null);
      }
    } catch (err) {
      alert("Failed to delete record from MongoDB.");
    }
  };

  const handleDownloadCif = (item: StoredDatabaseItem) => {
    const cifContent = selectedRecordData?.cif_content;
    const formula = item.formula || "structure";
    const filename = item.filename || `${formula}.cif`;

    if (cifContent) {
      const blob = new Blob([cifContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Fetch details first to get the CIF
      fetchDatabaseRecordDetail(item.id).then((doc) => {
        if (doc && doc.cif_content) {
          const blob = new Blob([doc.cif_content], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          alert(`CIF content for '${formula}' was not saved in this record.`);
        }
      });
    }
  };

  const handleCopyJson = () => {
    if (!selectedRecordData) return;
    navigator.clipboard.writeText(JSON.stringify(selectedRecordData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Header & Database Status Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D47E30] font-headline mb-1">
            <Database size={15} /> Materials Persistence & Database
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1A1A1A] tracking-tight">
            MongoDB Materials Cache
          </h1>
          <p className="text-sm text-[#6B6B6B] max-w-2xl mt-1">
            Every material prediction is automatically indexed in MongoDB. Re-analyzing existing materials fetches instantly from the database without re-running heavy GNN inference.
          </p>
        </div>

        {/* Database Status Pill Card */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <span>MongoDB: IndianMaterialsAI</span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="text-[#9A9A9A] text-[11px]">
                Collection: <span className="font-mono text-[#6B6B6B]">material_predictions</span> • {totalRecords} total records
              </div>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-3 bg-[#FAFAF8] hover:bg-[#F2F2F0] text-[#1A1A1A] border border-[#EBEBEB] rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            title="Refresh from MongoDB"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#D47E30]" : ""} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#9A9A9A] font-bold">Total Cached</span>
          <div className="mt-2 text-2xl font-bold font-headline text-[#1A1A1A]">
            {overview?.total_records ?? totalRecords}
          </div>
          <span className="text-[11px] text-[#6B6B6B] mt-1">Stored in MongoDB</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={12} /> Stable Phases
          </span>
          <div className="mt-2 text-2xl font-bold font-headline text-emerald-600">
            {overview?.stable_records ?? 0}
          </div>
          <span className="text-[11px] text-[#6B6B6B] mt-1">E_hull ≤ 25 meV/atom</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-amber-600 font-bold flex items-center gap-1">
            <AlertTriangle size={12} /> Metastable
          </span>
          <div className="mt-2 text-2xl font-bold font-headline text-amber-600">
            {overview?.metastable_records ?? 0}
          </div>
          <span className="text-[11px] text-[#6B6B6B] mt-1">Synthesizable phases</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#9A9A9A] font-bold flex items-center gap-1">
            <Clock size={12} /> Last Updated
          </span>
          <div className="mt-2 text-xs font-mono font-bold text-[#1A1A1A] truncate">
            {overview?.latest_material || "None yet"}
          </div>
          <span className="text-[11px] text-[#9A9A9A] mt-1 truncate">
            {overview?.last_updated ? new Date(overview.last_updated).toLocaleTimeString() : "--:--"}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-3 border border-[#EBEBEB] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MongoDB by formula (e.g. Li3PS4, LiCoO2)..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAFAF8] border border-[#EBEBEB] rounded-xl text-xs font-mono text-[#1A1A1A] placeholder:text-[#9A9A9A] outline-none focus:border-[#D47E30] transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStabilityFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              stabilityFilter === "all"
                ? "bg-[#D47E30] text-white shadow-sm"
                : "bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#1A1A1A] border border-[#EBEBEB]"
            }`}
          >
            All Materials
          </button>
          <button
            onClick={() => setStabilityFilter("stable")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              stabilityFilter === "stable"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#1A1A1A] border border-[#EBEBEB]"
            }`}
          >
            Stable Only
          </button>
        </div>
      </div>

      {/* Main Database Records Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#EBEBEB] shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#D47E30]" />
            <p className="text-xs text-[#6B6B6B]">Querying MongoDB `material_predictions` collection...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF5F0] flex items-center justify-center">
              <Sparkles size={24} className="text-[#D47E30]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1A1A1A]">No Materials Stored Yet</h3>
              <p className="text-xs text-[#6B6B6B] max-w-md">
                As soon as you run any prediction (via Property Prediction, CrystalFormer, or Batch), the full result is automatically indexed here in MongoDB and fetched on repeated queries.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-[#9A9A9A] font-headline uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Formula</th>
                  <th className="py-3 px-4">Bulk (K)</th>
                  <th className="py-3 px-4">Shear (G)</th>
                  <th className="py-3 px-4">Young's (E)</th>
                  <th className="py-3 px-4">Band Gap</th>
                  <th className="py-3 px-4">Formation (Ef)</th>
                  <th className="py-3 px-4">E_hull Stability</th>
                  <th className="py-3 px-4">Source Model</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F0]">
                {records.map((item) => {
                  const m = item.metrics || {};
                  const isStable = m.is_stable;
                  const statusStr = m.stability_status || "Unknown";
                  const ehullVal = m.ehull_eV_per_atom;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1A1A1A] font-headline text-sm">
                          {item.formula}
                        </div>
                        <div className="text-[10px] text-[#9A9A9A] font-mono truncate max-w-[140px]">
                          {item.filename || item.id.slice(-8)}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-[#1A1A1A]">
                        {m.bulk_modulus_GPa !== undefined && m.bulk_modulus_GPa !== null
                          ? `${Number(m.bulk_modulus_GPa).toFixed(1)} GPa`
                          : "--"}
                      </td>

                      <td className="py-4 px-4 font-mono text-[#1A1A1A]">
                        {m.shear_modulus_GPa !== undefined && m.shear_modulus_GPa !== null
                          ? `${Number(m.shear_modulus_GPa).toFixed(1)} GPa`
                          : "--"}
                      </td>

                      <td className="py-4 px-4 font-mono text-[#1A1A1A]">
                        {m.youngs_modulus_GPa !== undefined && m.youngs_modulus_GPa !== null
                          ? `${Number(m.youngs_modulus_GPa).toFixed(1)} GPa`
                          : "--"}
                      </td>

                      <td className="py-4 px-4 font-mono text-[#1A1A1A]">
                        {m.band_gap_eV !== undefined && m.band_gap_eV !== null
                          ? `${Number(m.band_gap_eV).toFixed(2)} eV`
                          : "--"}
                      </td>

                      <td className="py-4 px-4 font-mono text-[#1A1A1A]">
                        {m.formation_energy_eV_atom !== undefined && m.formation_energy_eV_atom !== null
                          ? `${Number(m.formation_energy_eV_atom).toFixed(3)} eV`
                          : "--"}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            isStable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : statusStr.toLowerCase().includes("metastable")
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {ehullVal !== undefined && ehullVal !== null ? `${(Number(ehullVal) * 1000).toFixed(0)} meV` : "E_hull"} • {statusStr}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[11px] font-mono text-[#6B6B6B]">
                        {item.source_model || "CrystalFormer"}
                      </td>

                      <td className="py-4 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleViewDetail(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-[#6B6B6B] hover:text-[#D47E30] border border-transparent hover:border-[#EBEBEB] transition-all"
                          title="Inspect MongoDB Document (JSON)"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() => handleDownloadCif(item)}
                          className="p-1.5 hover:bg-white rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] border border-transparent hover:border-[#EBEBEB] transition-all"
                          title="Download CIF"
                        >
                          <Download size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.formula)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-[#9A9A9A] hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                          title="Delete from MongoDB"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Raw MongoDB Document Inspection Modal */}
      {selectedRecordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between bg-[#FAFAF8]">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-[#D47E30]" />
                <h3 className="text-sm font-bold text-[#1A1A1A] font-headline">
                  MongoDB Document: <span className="font-mono text-[#D47E30]">{selectedRecordData?.formula || selectedRecordId}</span>
                </h3>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#EBEBEB] text-[#9A9A9A]">
                  ID: {selectedRecordId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 bg-white border border-[#EBEBEB] hover:bg-[#F2F2F0] rounded-xl text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedRecordId(null);
                    setSelectedRecordData(null);
                  }}
                  className="p-1.5 hover:bg-white rounded-xl text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-[#1E1E1E] text-[#D4D4D4]">
              {detailLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
                  <RefreshCw size={20} className="animate-spin text-[#D47E30]" />
                  <span className="text-[#9A9A9A]">Fetching document from MongoDB...</span>
                </div>
              ) : selectedRecordData ? (
                <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {JSON.stringify(selectedRecordData, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-10 text-red-400">Failed to load record content.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#EBEBEB] bg-[#FAFAF8] flex items-center justify-between text-xs text-[#6B6B6B]">
              <span>Stored in collection: <code className="font-mono">material_predictions</code></span>
              <button
                onClick={() => {
                  setSelectedRecordId(null);
                  setSelectedRecordData(null);
                }}
                className="px-4 py-2 bg-white border border-[#EBEBEB] rounded-xl font-medium text-[#1A1A1A] hover:bg-[#F2F2F0]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
