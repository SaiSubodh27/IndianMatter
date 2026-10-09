import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Menu,
  X,
  FileText,
  AlertCircle,
  Tag,
} from "lucide-react";
import { getPublishedPapers, Paper } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function ResearchPapersPage() {
  const { user, isAuthenticated } = useAuth();
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

  // Mobile menu for site header
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. SEO: Title and Meta Description
  useEffect(() => {
    document.title = "Research Papers | IndianMatter";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Newly published materials science papers relevant to ionic conductivity, ML for materials, and computational materials discovery."
    );
  }, []);

  // 2. Fetch papers via shared Supabase client
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

  // Extract all unique domain tags
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    papers.forEach((p) => {
      p.domain_tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [papers]);

  // Format domain tag labels
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

        // High relevance filter (score >= 4 or status === high_relevance)
        if (highRelevanceOnly) {
          const score = paper.relevance_score ?? 0;
          const isHigh = score >= 4 || paper.relevance_status === "high_relevance";
          if (!isHigh) return false;
        }

        // Search query filter (title, abstract, topics, journal)
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

  // Statistics
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
    setTimeout(() => setCopiedId(null), 2500);
  };

  const navLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#explore", label: "Explore" },
    { href: "/#about", label: "About" },
    { href: "/#resources", label: "Resources" },
    { href: "/research", label: "Research", active: true },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF1E8] text-[#1E2227] font-sans flex flex-col selection:bg-accent-soft selection:text-accent">
      {/* ── Fixed Main Site Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EDE8E2] h-16 transition-shadow duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none group"
            aria-label="IndianMatter Home"
          >
            <img
              src="/mi-icon-mark.png"
              alt=""
              aria-hidden="true"
              className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-headline font-bold text-[22px] text-[#1A1A1A] tracking-tight">
              Indian<span style={{ color: "#D47E30" }}>Matter</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navLinks.map(({ href, label, active }) => (
              <Link
                key={href}
                to={href}
                className={`text-[14px] font-medium transition-all duration-150 px-3.5 py-1.5 rounded-full ${
                  active
                    ? "text-[#D47E30] bg-[#FBF0E6] font-semibold"
                    : "text-[#6B6B6B] hover:text-[#D47E30] hover:bg-[#FDF5EE]/60"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#1E2227] text-white hover:bg-[#323842] transition-colors"
              >
                Workspace <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                to="/signin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#D47E30] text-white hover:bg-[#B8671E] transition-colors shadow-sm"
              >
                Sign In <ArrowRight size={13} />
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F2F2F0] transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#EBEBEB] px-6 py-4 space-y-1 shadow-lg animate-fade-in">
            {navLinks.map(({ href, label, active }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center py-2.5 px-3 rounded-lg text-[15px] font-medium transition-colors ${
                  active
                    ? "text-[#D47E30] bg-[#FBF0E6] font-semibold"
                    : "text-[#3D3D3D] hover:text-[#D47E30]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Main Content Area (Offset by 4rem for fixed header) ── */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#F7EFE6] to-[#FAF1E8] border-b border-[#E8DFD5] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF0E6] border border-[#F3DFC9] text-[#D47E30] text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={13} />
                <span>IndianMatter • Research Portal</span>
              </div>
              <h1 className="font-headline font-bold text-3xl sm:text-4xl md:text-5xl text-[#1E2227] tracking-tight leading-tight">
                Research Papers
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#5F6771] leading-relaxed">
                Newly published materials science papers relevant to ionic conductivity, ML for materials, and computational materials discovery.
              </p>
            </div>

            {/* Live Metrics Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-[#EBE1D7] rounded-2xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7C828D]">
                  Total Indexed
                </div>
                <div className="text-2xl font-bold font-headline text-[#1E2227] mt-1">
                  {stats.total}
                </div>
                <div className="text-[11px] text-[#8C929C] mt-0.5">Live OpenAlex sync</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#EBE1D7] rounded-2xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7C828D]">
                  Open Access
                </div>
                <div className="text-2xl font-bold font-headline text-[#15803D] mt-1 flex items-center gap-1.5">
                  <Unlock size={18} />
                  <span>{stats.oaCount}</span>
                </div>
                <div className="text-[11px] text-[#8C929C] mt-0.5">Free full-text available</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#EBE1D7] rounded-2xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7C828D]">
                  High Relevance
                </div>
                <div className="text-2xl font-bold font-headline text-[#D47E30] mt-1 flex items-center gap-1.5">
                  <Sparkles size={18} />
                  <span>{stats.highRelCount}</span>
                </div>
                <div className="text-[11px] text-[#8C929C] mt-0.5">Score &gt;= 4.0 / 5</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#EBE1D7] rounded-2xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7C828D]">
                  Latest Publication
                </div>
                <div className="text-lg font-bold font-headline text-[#1E2227] mt-1 truncate">
                  {stats.latestDate}
                </div>
                <div className="text-[11px] text-[#8C929C] mt-0.5">Automated ingestion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and List Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-[#EDE8E2] p-4 sm:p-5 shadow-sm space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, abstract, keyword, or DOI..."
                  className="w-full bg-[#FAF6F0]/70 border border-[#E2D9CF] rounded-xl py-2.5 pl-10 pr-10 text-sm text-[#1E2227] placeholder-[#8C929C] outline-none focus:border-[#D47E30] focus:ring-2 focus:ring-[#D47E30]/15 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C929C] hover:text-[#1E2227]"
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-[#7C828D]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "relevance" | "year")
                  }
                  className="bg-[#FAF6F0]/70 border border-[#E2D9CF] text-xs font-semibold rounded-xl px-3 py-2.5 text-[#1E2227] outline-none focus:border-[#D47E30] cursor-pointer"
                >
                  <option value="date">Newest Date</option>
                  <option value="relevance">Highest Relevance</option>
                  <option value="year">Publication Year</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={fetchPapers}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-[#E2D9CF] text-[#5F6771] hover:text-[#1E2227] hover:bg-[#FAF6F0] transition-colors disabled:opacity-50"
                  title="Refresh papers"
                >
                  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F2EDE6]">
              <span className="text-xs font-medium text-[#7C828D] flex items-center gap-1 mr-1">
                <Filter size={13} />
                Topics:
              </span>

              {/* All */}
              <button
                onClick={() => setSelectedDomain("all")}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedDomain === "all"
                    ? "bg-[#1E2227] text-white"
                    : "bg-[#FAF6F0] text-[#5F6771] hover:text-[#1E2227] hover:bg-[#F2ECE3]"
                }`}
              >
                All Topics
              </button>

              {/* Known and dynamic domains */}
              {availableDomains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    selectedDomain === domain
                      ? "bg-[#D47E30] text-white"
                      : "bg-[#FAF6F0] text-[#5F6771] hover:text-[#D47E30] hover:bg-[#F2ECE3]"
                  }`}
                >
                  {formatDomainLabel(domain)}
                </button>
              ))}

              <div className="h-4 w-px bg-[#E2D9CF] mx-1 hidden sm:block" />

              {/* Open Access Toggle */}
              <button
                onClick={() => setOpenAccessOnly(!openAccessOnly)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                  openAccessOnly
                    ? "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] font-semibold"
                    : "bg-[#FAF6F0] text-[#5F6771] border-transparent hover:bg-[#F2ECE3]"
                }`}
              >
                {openAccessOnly ? <Unlock size={12} /> : <Lock size={12} />}
                Open Access Only
              </button>

              {/* High Relevance Toggle */}
              <button
                onClick={() => setHighRelevanceOnly(!highRelevanceOnly)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                  highRelevanceOnly
                    ? "bg-[#FEF3C7] text-[#B45309] border-[#FCD34D] font-semibold"
                    : "bg-[#FAF6F0] text-[#5F6771] border-transparent hover:bg-[#F2ECE3]"
                }`}
              >
                <Sparkles size={12} />
                High Relevance Only
              </button>
            </div>
          </div>

          {/* Results Summary & Counter */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-xs sm:text-sm text-[#5F6771]">
              Showing <span className="font-semibold text-[#1E2227]">{filteredPapers.length}</span>{" "}
              {filteredPapers.length === 1 ? "paper" : "papers"}
              {selectedDomain !== "all" && (
                <span> in <span className="font-semibold text-[#D47E30]">{formatDomainLabel(selectedDomain)}</span></span>
              )}
            </div>

            {(searchQuery || selectedDomain !== "all" || openAccessOnly || highRelevanceOnly) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("all");
                  setOpenAccessOnly(false);
                  setHighRelevanceOnly(false);
                }}
                className="text-xs font-medium text-[#D47E30] hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-sm">Unable to load research papers</h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={fetchPapers}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#EDE8E2] shadow-sm animate-pulse space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-[#EDE8E2] rounded w-1/4" />
                    <div className="h-5 bg-[#EDE8E2] rounded-full w-20" />
                  </div>
                  <div className="h-6 bg-[#EDE8E2] rounded w-3/4" />
                  <div className="h-4 bg-[#EDE8E2] rounded w-1/2" />
                  <div className="h-16 bg-[#F8F5F0] rounded-xl w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPapers.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#EDE8E2] p-12 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C929C] mb-4">
                <BookOpen size={26} />
              </div>
              <h3 className="font-headline font-bold text-lg text-[#1E2227]">
                No research papers found
              </h3>
              <p className="text-xs sm:text-sm text-[#7C828D] max-w-md mx-auto mt-2 leading-relaxed">
                {searchQuery || selectedDomain !== "all" || openAccessOnly || highRelevanceOnly
                  ? "No papers match your active search and filter criteria. Try adjusting your search query or reset your filters."
                  : "No publications have been indexed yet in the database. New papers are synced daily."}
              </p>
              {(searchQuery || selectedDomain !== "all" || openAccessOnly || highRelevanceOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDomain("all");
                    setOpenAccessOnly(false);
                    setHighRelevanceOnly(false);
                  }}
                  className="mt-5 px-4 py-2 rounded-xl bg-[#D47E30] text-white text-xs font-semibold hover:bg-[#B8671E] transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Paper Cards Feed */}
          {!loading && !error && filteredPapers.length > 0 && (
            <div className="space-y-5">
              {filteredPapers.map((paper) => {
                const isExpanded = !!expandedAbstracts[paper.id];
                const hasAbstract = !!paper.abstract && paper.abstract.trim().length > 0;
                const articleUrl = paper.landing_page_url || (paper.doi ? `https://doi.org/${paper.doi}` : null);
                const pdfUrl = paper.pdf_url || paper.oa_url;

                return (
                  <article
                    key={paper.id}
                    className="bg-white rounded-2xl border border-[#EDE8E2] p-6 shadow-sm hover:shadow-md hover:border-[#DECFC1] transition-all flex flex-col gap-4 relative"
                  >
                    {/* Top Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Journal Name */}
                        {paper.journal_name && (
                          <span className="font-semibold text-[#1E2227] bg-[#FAF6F0] px-2.5 py-1 rounded-md border border-[#EDE8E2]">
                            {paper.journal_name}
                          </span>
                        )}

                        {/* Publication Date */}
                        {paper.publication_date && (
                          <span className="text-[#6C737E]">
                            Published {new Date(paper.publication_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}

                        {/* Publisher */}
                        {paper.publisher && (
                          <span className="text-[#8C929C] hidden sm:inline">
                            • {paper.publisher}
                          </span>
                        )}
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        {/* Relevance Score Pill */}
                        {paper.relevance_score !== null && paper.relevance_score !== undefined && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              paper.relevance_score >= 4
                                ? "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                                : "bg-[#F3F4F6] text-[#4B5563]"
                            }`}
                          >
                            <Sparkles size={11} />
                            Score: {paper.relevance_score}/5
                          </span>
                        )}

                        {/* Open Access Pill */}
                        {paper.open_access ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                            <Unlock size={11} />
                            Open Access
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-[#6B7280] bg-[#F3F4F6]">
                            <Lock size={10} />
                            Subscription
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Paper Title */}
                    <div>
                      <h2 className="font-headline font-bold text-lg sm:text-xl text-[#1E2227] leading-snug hover:text-[#D47E30] transition-colors">
                        {articleUrl ? (
                          <a
                            href={articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {paper.title}
                          </a>
                        ) : (
                          paper.title
                        )}
                      </h2>

                      {/* Authors */}
                      <p className="text-xs text-[#5F6771] mt-2 font-medium">
                        {formatAuthors(paper.authors)}
                      </p>
                    </div>

                    {/* Domain & Topic Tags */}
                    {((paper.domain_tags && paper.domain_tags.length > 0) ||
                      (paper.topics && paper.topics.length > 0)) && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {paper.domain_tags?.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#FBF0E6] text-[#D47E30] border border-[#F5E4D3]"
                          >
                            <Tag size={10} />
                            {formatDomainLabel(tag)}
                          </span>
                        ))}

                        {paper.topics?.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] text-[#5F6771] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#EDE8E2]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Abstract Section */}
                    {hasAbstract ? (
                      <div className="bg-[#FAF6F0]/60 rounded-xl p-4 border border-[#EFE8DF] text-xs sm:text-sm text-[#4A5059] leading-relaxed">
                        <p className={isExpanded ? "" : "line-clamp-3"}>
                          {paper.abstract}
                        </p>
                        <button
                          onClick={() => toggleAbstract(paper.id)}
                          className="mt-2 text-xs font-semibold text-[#D47E30] hover:text-[#B8671E] inline-flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              Hide Abstract <ChevronUp size={13} />
                            </>
                          ) : (
                            <>
                              Read Full Abstract <ChevronDown size={13} />
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-[#8C929C] italic bg-[#FAF6F0]/30 rounded-lg p-3 border border-dashed border-[#EAE3D9]">
                        Full abstract indexing in progress for this publication. Visit the publisher landing page or DOI below to view complete text.
                      </div>
                    )}

                    {/* Bottom Actions & Citation Footer */}
                    <div className="pt-3 border-t border-[#F2EDE6] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Direct DOI link */}
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#5F6771] hover:text-[#D47E30] font-mono hover:underline flex items-center gap-1 mr-2"
                          >
                            doi:{paper.doi} <ExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        {/* Copy Citation Button */}
                        <button
                          onClick={() => copyCitation(paper)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EDE8E2] bg-white text-[#5F6771] hover:text-[#1E2227] hover:bg-[#FAF6F0] text-xs font-medium transition-colors"
                          title="Copy citation to clipboard"
                        >
                          {copiedId === paper.id ? (
                            <>
                              <Check size={13} className="text-green-600" />
                              <span className="text-green-600 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              Cite
                            </>
                          )}
                        </button>

                        {/* PDF Link if available */}
                        {pdfUrl && (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#86EFAC] bg-[#DCFCE7]/60 text-[#15803D] hover:bg-[#DCFCE7] text-xs font-semibold transition-colors"
                          >
                            <FileText size={13} />
                            Full PDF <ExternalLink size={11} />
                          </a>
                        )}

                        {/* Article Landing Page */}
                        {articleUrl && (
                          <a
                            href={articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E2227] text-white hover:bg-[#323842] text-xs font-semibold transition-colors shadow-sm"
                          >
                            View Article <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-[#EDE8E2] py-8 text-center text-xs text-[#7C828D]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E2227]">IndianMatter</span>
            <span>• Computational Materials Discovery &amp; Literature Engine</span>
          </div>
          <div>
            Powered by OpenAlex &amp; IndianMatter Literature Pipeline
          </div>
        </div>
      </footer>
    </div>
  );
}
