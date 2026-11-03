import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  ExternalLink,
  Sparkles,
  Unlock,
  Lock,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Tag,
  Flame,
  Layers,
  Database,
} from "lucide-react";
import { getPublishedPapers, Paper } from "../../lib/supabase";

export default function LiteraturePage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [highRelevanceOnly, setHighRelevanceOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "relevance" | "year">("date");
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showDiversityMap, setShowDiversityMap] = useState(true);

  // Fetch papers from Supabase
  const fetchPapers = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await getPublishedPapers();
    if (fetchErr) {
      setError(fetchErr.message);
    } else {
      setPapers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // Format author names safely
  const formatAuthors = (authors: Paper["authors"]) => {
    if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return "Materials Research Consortium";
    }
    return authors
      .map((a) => {
        if (typeof a === "string") return a;
        return a.display_name || a.name || "Unknown Author";
      })
      .join(", ");
  };

  // Domain tags with count
  const availableDomains = useMemo(() => {
    const counts: Record<string, number> = {};
    papers.forEach((p) => {
      p.domain_tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [papers]);

  const formatDomainLabel = (tag: string) => {
    const map: Record<string, string> = {
      all: "All Fields",
      ionic_transport: "Ionic Transport",
      mlips: "ML Potentials (MLIPs)",
      doping_defects: "Doping & Defects",
      solid_electrolytes: "Solid Electrolytes",
      perovskites: "Perovskites",
      battery: "Battery Materials",
    };
    return map[tag] || tag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Filter & sort logic
  const filteredPapers = useMemo(() => {
    return papers
      .filter((paper) => {
        // Domain filter
        if (selectedDomain !== "all") {
          const tags = paper.domain_tags || [];
          if (!tags.includes(selectedDomain)) return false;
        }

        // Open access filter
        if (openAccessOnly && !paper.open_access) {
          return false;
        }

        // High relevance filter
        if (highRelevanceOnly) {
          const score = paper.relevance_score ?? 0;
          const isHigh = score >= 4 || paper.relevance_status === "high_relevance";
          if (!isHigh) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = paper.title.toLowerCase().includes(q);
          const matchAbstract = paper.abstract?.toLowerCase().includes(q) ?? false;
          const matchJournal = paper.journal_name?.toLowerCase().includes(q) ?? false;
          const matchTopics = paper.topics?.some((t) => t.toLowerCase().includes(q)) ?? false;
          const matchPublisher = paper.publisher?.toLowerCase().includes(q) ?? false;
          const matchDoi = paper.doi?.toLowerCase().includes(q) ?? false;
          return matchTitle || matchAbstract || matchJournal || matchTopics || matchPublisher || matchDoi;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = a.publication_date ? new Date(a.publication_date).getTime() : 0;
          const dateB = b.publication_date ? new Date(b.publication_date).getTime() : 0;
          return dateB - dateA;
        }
        if (sortBy === "relevance") {
          return (b.relevance_score ?? 0) - (a.relevance_score ?? 0);
        }
        if (sortBy === "year") {
          return (b.publication_year ?? 0) - (a.publication_year ?? 0);
        }
        return 0;
      });
  }, [papers, selectedDomain, openAccessOnly, highRelevanceOnly, searchQuery, sortBy]);

  // Key stats
  const stats = useMemo(() => {
    const total = papers.length;
    const oaCount = papers.filter((p) => p.open_access).length;
    const highRelCount = papers.filter((p) => (p.relevance_score ?? 0) >= 4).length;
    const latestDate = papers[0]?.publication_date || "Recent";
    return { total, oaCount, highRelCount, latestDate };
  }, [papers]);

  const toggleAbstract = (id: number) => {
    setExpandedAbstracts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCitation = (paper: Paper) => {
    const citation = `${formatAuthors(paper.authors)}. "${paper.title}." ${paper.journal_name || "Preprint"} (${paper.publication_year || "2026"}). ${paper.doi ? `DOI: ${paper.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
            <BookOpen size={14} /> Knowledge Exploration & Research Papers
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
            Materials Literature Explorer
          </h1>
          <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
            Explore live research publications synced daily from OpenAlex & arXiv, correlated with ionic transport mechanisms, MLIP potentials, and crystal structure discovery.
          </p>
        </div>

        <button
          onClick={fetchPapers}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2.5 bg-white border border-[#E9DFD4] hover:bg-[#FAF4EE] rounded-xl text-xs font-semibold text-[#1E2227] flex items-center gap-2 shadow-sm transition-colors"
          title="Refresh papers database"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#F1641D]" : "text-[#8C929C]"} />
          {loading ? "Syncing..." : "Sync Latest Papers"}
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#EFE5DC] shadow-card">
          <div className="flex items-center justify-between text-[#8C929C] text-xs font-medium mb-1">
            <span>Indexed Papers</span>
            <Database size={16} className="text-[#F1641D]" />
          </div>
          <div className="text-2xl font-bold font-headline text-[#1E2227]">
            {loading ? "..." : stats.total}
          </div>
          <p className="text-[11px] text-[#8C929C] mt-1">Curated materials papers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EFE5DC] shadow-card">
          <div className="flex items-center justify-between text-[#8C929C] text-xs font-medium mb-1">
            <span>Open Access</span>
            <Unlock size={16} className="text-[#2E7D32]" />
          </div>
          <div className="text-2xl font-bold font-headline text-[#1E2227]">
            {loading ? "..." : stats.oaCount}
          </div>
          <p className="text-[11px] text-[#8C929C] mt-1">Directly accessible full-texts</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EFE5DC] shadow-card">
          <div className="flex items-center justify-between text-[#8C929C] text-xs font-medium mb-1">
            <span>High Relevance</span>
            <Flame size={16} className="text-[#F1641D]" />
          </div>
          <div className="text-2xl font-bold font-headline text-[#1E2227]">
            {loading ? "..." : stats.highRelCount}
          </div>
          <p className="text-[11px] text-[#8C929C] mt-1">Score ≥ 4 / 5 in battery & solid electrolyte</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EFE5DC] shadow-card">
          <div className="flex items-center justify-between text-[#8C929C] text-xs font-medium mb-1">
            <span>Latest Publication</span>
            <Sparkles size={16} className="text-[#1976D2]" />
          </div>
          <div className="text-lg font-bold font-headline text-[#1E2227] truncate">
            {loading ? "..." : stats.latestDate}
          </div>
          <p className="text-[11px] text-[#8C929C] mt-1">Active sync feed</p>
        </div>
      </div>

      {/* Chemical Diversity Map Projection Banner (Collapsible) */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC]">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2E7DC]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#F1641D]" />
            <h3 className="font-headline font-bold text-base text-[#1E2227]">
              Chemical Diversity Space Projection
            </h3>
          </div>
          <button
            onClick={() => setShowDiversityMap(!showDiversityMap)}
            className="text-xs font-semibold text-[#F1641D] hover:underline flex items-center gap-1"
          >
            {showDiversityMap ? "Hide Projection" : "Show Projection"}
          </button>
        </div>

        {showDiversityMap && (
          <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-[11px] font-bold text-[#F1641D] uppercase tracking-wider font-headline">
                Latent Space Embedding (t-SNE / UMAP)
              </span>
              <h4 className="text-xl font-headline font-bold text-[#1E2227]">
                Explored vs. Unexplored Chemical Space
              </h4>
              <p className="text-xs text-[#5F6771] leading-relaxed">
                2D latent projection mapping 140,000+ Materials Project compositions against published literature syntheses. Clusters represent established transition metal oxides; sparse regions highlight under-explored ionic conductors.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1">
                <span className="flex items-center gap-1.5 text-[#1E2227]">
                  <span className="w-2.5 h-2.5 bg-[#F1641D] rounded-full" /> Explored Syntheses
                </span>
                <span className="flex items-center gap-1.5 text-[#1E2227]">
                  <span className="w-2.5 h-2.5 bg-[#2E7D32] rounded-full" /> High-Conductivity Predicted Candidates
                </span>
              </div>
            </div>

            <div className="w-52 h-36 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] flex flex-col items-center justify-center p-4 text-center shrink-0">
              <Layers size={28} className="text-[#F1641D] mb-1.5" />
              <p className="text-xs font-bold text-[#1E2227]">UMAP 2D Projection</p>
              <p className="text-[10px] text-[#8C929C]">140k Structures Mapped</p>
            </div>
          </div>
        )}
      </div>

      {/* Search Toolbar & Filters */}
      <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search publications by title, keyword, author, journal, topic, or DOI..."
            className="w-full bg-[#FAF4EE]/60 border border-[#E9DFD4] rounded-2xl py-3.5 pl-12 pr-10 text-xs sm:text-sm text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8C929C] hover:text-[#1E2227]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Domain Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-[#8C929C] mr-1">Domains:</span>
          <button
            onClick={() => setSelectedDomain("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedDomain === "all"
                ? "bg-[#1E2227] text-white shadow-sm"
                : "bg-[#FAF4EE] text-[#5F6771] hover:bg-[#F2E7DC]"
            }`}
          >
            All Fields ({papers.length})
          </button>
          {Object.entries(availableDomains).map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setSelectedDomain(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedDomain === tag
                  ? "bg-[#F1641D] text-white shadow-sm"
                  : "bg-[#FAF4EE] text-[#5F6771] hover:bg-[#F2E7DC]"
              }`}
            >
              {formatDomainLabel(tag)} ({count})
            </button>
          ))}
        </div>

        {/* Control Toggles & Sorter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F2E7DC]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#1E2227]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#F1641D] focus:ring-[#F1641D] accent-[#F1641D]"
              />
              <span className="flex items-center gap-1">
                <Unlock size={12} className="text-[#2E7D32]" /> Open Access Only
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highRelevanceOnly}
                onChange={(e) => setHighRelevanceOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#F1641D] focus:ring-[#F1641D] accent-[#F1641D]"
              />
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-[#F1641D]" /> High Relevance (Score ≥ 4)
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8C929C] font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-1.5 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"
            >
              <option value="date">Publication Date (Newest)</option>
              <option value="relevance">Relevance Score</option>
              <option value="year">Publication Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Papers Listing Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-bold text-xl text-[#1E2227]">
          Research Publications ({filteredPapers.length})
        </h3>
        {filteredPapers.length > 0 && (
          <p className="text-xs text-[#8C929C]">
            Showing curated computational and experimental literature
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <div>
              <p className="font-bold">Unable to load research papers</p>
              <p className="text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchPapers}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-[#EFE5DC] text-center space-y-3">
          <RefreshCw size={28} className="animate-spin text-[#F1641D] mx-auto" />
          <p className="text-sm font-semibold text-[#1E2227]">Retrieving research papers from database...</p>
          <p className="text-xs text-[#8C929C]">Fetching indexed literature and citation metadata</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPapers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-[#EFE5DC] text-center space-y-3">
          <BookOpen size={36} className="text-[#8C929C] mx-auto opacity-50" />
          <h4 className="font-headline font-bold text-base text-[#1E2227]">
            No research papers match your criteria
          </h4>
          <p className="text-xs text-[#8C929C] max-w-md mx-auto">
            Try adjusting your search terms, clearing the domain filters, or toggling off the Open Access / High Relevance filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("all");
              setOpenAccessOnly(false);
              setHighRelevanceOnly(false);
            }}
            className="px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Papers List */}
      {!loading && (
        <div className="space-y-4">
          {filteredPapers.map((paper) => {
            const isExpanded = !!expandedAbstracts[paper.id];
            const isCopied = copiedId === paper.id;
            const score = paper.relevance_score ?? 0;

            return (
              <div
                key={paper.id}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#EFE5DC] hover:shadow-md transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {paper.open_access ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Unlock size={10} /> Open Access
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                          <Lock size={10} /> Closed Access
                        </span>
                      )}

                      {score >= 4 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-[#F1641D] border border-orange-200">
                          <Sparkles size={10} /> High Relevance
                        </span>
                      )}

                      {paper.relevance_score !== null && paper.relevance_score !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#FAF4EE] text-[#5F6771] border border-[#EFE5DC]">
                          Relevance: {paper.relevance_score}/5
                        </span>
                      )}

                      {paper.publication_date && (
                        <span className="text-[11px] text-[#8C929C] font-mono">
                          {paper.publication_date}
                        </span>
                      )}
                    </div>

                    <h4 className="font-headline font-bold text-base sm:text-lg text-[#1E2227] leading-snug">
                      {paper.title}
                    </h4>

                    <p className="text-xs text-[#5F6771]">
                      {formatAuthors(paper.authors)}
                    </p>

                    <p className="text-xs text-[#8C929C]">
                      <span className="font-semibold text-[#1E2227]">
                        {paper.journal_name || "Journal / Preprint"}
                      </span>
                      {paper.publication_year ? ` (${paper.publication_year})` : ""}
                      {paper.publisher ? ` • ${paper.publisher}` : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <button
                      onClick={() => copyCitation(paper)}
                      className="p-2 border border-[#E9DFD4] rounded-xl text-xs text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1 transition-colors"
                      title="Copy APA Citation"
                    >
                      {isCopied ? <Check size={13} className="text-[#2E7D32]" /> : <Copy size={13} />}
                      <span className="text-[11px]">{isCopied ? "Copied" : "Cite"}</span>
                    </button>

                    {paper.doi ? (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-[#FAF4EE] text-[#F1641D] rounded-xl text-xs font-semibold hover:bg-[#FBE8D8] transition-colors flex items-center gap-1.5"
                      >
                        DOI <ExternalLink size={12} />
                      </a>
                    ) : paper.landing_page_url ? (
                      <a
                        href={paper.landing_page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-[#FAF4EE] text-[#F1641D] rounded-xl text-xs font-semibold hover:bg-[#FBE8D8] transition-colors flex items-center gap-1.5"
                      >
                        View <ExternalLink size={12} />
                      </a>
                    ) : null}

                    {paper.pdf_url && (
                      <a
                        href={paper.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1"
                        title="Download Open Access PDF"
                      >
                        <FileText size={12} /> PDF
                      </a>
                    )}
                  </div>
                </div>

                {/* Abstract snippet */}
                {paper.abstract && (
                  <div className="bg-[#FAF4EE]/70 rounded-xl p-4 border border-[#EFE5DC] text-xs text-[#5F6771] leading-relaxed">
                    <p className={isExpanded ? "" : "line-clamp-2"}>
                      {paper.abstract}
                    </p>
                    <button
                      onClick={() => toggleAbstract(paper.id)}
                      className="text-[11px] font-semibold text-[#F1641D] mt-1.5 flex items-center gap-1 hover:underline"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp size={12} /></>
                      ) : (
                        <>Read Full Abstract <ChevronDown size={12} /></>
                      )}
                    </button>
                  </div>
                )}

                {/* Tags and topics */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {paper.domain_tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-[#FAF4EE] text-[#5B636E] border border-[#EFE5DC]"
                    >
                      {formatDomainLabel(tag)}
                    </span>
                  ))}
                  {paper.topics?.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-normal bg-gray-50 text-gray-600 border border-gray-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
