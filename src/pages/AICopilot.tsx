import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Bot,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Save,
  Check,
  Search,
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  Library,
  ArrowLeft,
  Link as LinkIcon,
} from "lucide-react";

const DAILY_PAPERS_FEED_URL =
  "https://raw.githubusercontent.com/SaiSubodh27/ResearchPaper_automation/main/data/daily_material_papers.json";
const SAVED_PAPERS_STORAGE_KEY = "indianmatter.savedPapers";

// --- Types ---
export interface JournalInfo {
  journal_name: string;
  is_peer_reviewed?: boolean;
  citation_score?: number;
  h_index?: number;
  quartile: "Q1" | "Q2" | "Q3" | "Q4" | "Preprint (Unranked)" | string;
  quality_tier?: string;
  publisher?: string;
}

export interface MetricResult {
  metric: string;
  value: string;
  comparison?: string;
  unit?: string;
  note?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  publishedAt: string;
  year?: number;
  journal?: JournalInfo;
  journal_name?: string;
  quartile?: string;
  abstract?: string;
  aim?: string;
  whyItMatters?: string;
  simpleConclusion?: string;
  results?: MetricResult[];
  citation_count?: number;
  citation?: string;
  savedAt?: string;
  doi?: string;
  pdf_url?: string;
  sourceUrl?: string;
  keywords?: string[];
  topics?: string[];
  subfield?: string;
  ai_summary?: string;
}

const QUARTILE_STYLES: Record<
  string,
  { badge: string; border: string; bg: string }
> = {
  Q1: {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    border: "border-emerald-500",
    bg: "bg-emerald-500",
  },
  Q2: {
    badge:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    border: "border-blue-500",
    bg: "bg-blue-500",
  },
  Q3: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    border: "border-amber-500",
    bg: "bg-amber-500",
  },
  Q4: {
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800",
    border: "border-orange-500",
    bg: "bg-orange-500",
  },
};

function getQuartileStyle(quartile = "Q2") {
  return QUARTILE_STYLES[quartile] || QUARTILE_STYLES["Q2"];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "2026";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function findStringByKeys(value: unknown, keys: string[], depth = 0): string {
  if (depth > 3 || !value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const candidate = asString(record[key]);
    if (candidate) return candidate;
  }

  for (const nested of Object.values(record)) {
    const candidate = findStringByKeys(nested, keys, depth + 1);
    if (candidate) return candidate;
  }

  return "";
}

function findNumberByKeys(
  value: unknown,
  keys: string[],
  fallback = 0,
  depth = 0,
): number {
  if (depth > 3 || !value || typeof value !== "object") return fallback;
  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const candidate = asNumber(record[key], Number.NaN);
    if (Number.isFinite(candidate)) return candidate;
  }

  for (const nested of Object.values(record)) {
    const candidate = findNumberByKeys(nested, keys, Number.NaN, depth + 1);
    if (Number.isFinite(candidate)) return candidate;
  }

  return fallback;
}

function normalizeAuthors(value: unknown): string[] {
  if (Array.isArray(value)) {
    const authors = value.map((author) => asString(author)).filter(Boolean);
    return authors.length ? authors : ["Unknown Author"];
  }
  const author = asString(value);
  return author ? [author] : ["Unknown Author"];
}

function normalizeSourceUrl(doi: string, pdfUrl: string, fallbackUrl: string) {
  if (fallbackUrl) return fallbackUrl;
  if (pdfUrl) return pdfUrl;
  if (!doi) return "";
  return doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
}

function buildCitation(paper: ResearchPaper, journalName: string) {
  if (paper.citation) return paper.citation;

  const authorText =
    paper.authors.length > 0 && paper.authors[0] !== "Unknown Author"
      ? paper.authors.join(", ")
      : "Unknown author";
  const year =
    paper.year ||
    new Date(paper.publishedAt).getFullYear() ||
    paper.publishedAt;
  const doiText = paper.doi
    ? ` https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, "")}`
    : "";

  return `${authorText}. (${year}). ${paper.title}. ${journalName}.${doiText}`;
}

function normalizePapersPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  return Array.isArray(record.papers) ? record.papers : [];
}

function loadSavedPapers(): ResearchPaper[] {
  try {
    const raw = localStorage.getItem(SAVED_PAPERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ResearchPaper[]) : [];
  } catch {
    return [];
  }
}

function savePaperToLibrary(paper: ResearchPaper) {
  const saved = loadSavedPapers();
  const nextPaper = { ...paper, savedAt: new Date().toISOString() };
  const existingIndex = saved.findIndex((item) => item.id === paper.id);

  if (existingIndex >= 0) {
    saved[existingIndex] = nextPaper;
  } else {
    saved.unshift(nextPaper);
  }

  localStorage.setItem(SAVED_PAPERS_STORAGE_KEY, JSON.stringify(saved));
}

function mapFeedPaper(item: unknown, idx: number): ResearchPaper {
  const p = asRecord(item);
  const journalRecord = asRecord(p.journal);
  const quartile = asString(p.quartile, asString(journalRecord.quartile, "Q2"));
  const journal: JournalInfo = {
    journal_name: asString(
      p.journal_name,
      asString(journalRecord.journal_name, "Academic Journal"),
    ),
    quartile,
    quality_tier: asString(
      journalRecord.quality_tier,
      quartile ? `${quartile} Journal` : "Peer-Reviewed",
    ),
    publisher: asString(journalRecord.publisher),
    citation_score: asNumber(journalRecord.citation_score),
    h_index: asNumber(journalRecord.h_index),
    is_peer_reviewed:
      typeof journalRecord.is_peer_reviewed === "boolean"
        ? journalRecord.is_peer_reviewed
        : undefined,
  };
  const doi = asString(p.doi);
  const pdfUrl = asString(p.pdf_url, asString(p.pdfUrl));
  const sourceUrl = normalizeSourceUrl(
    doi,
    pdfUrl,
    asString(p.sourceUrl, asString(p.url)),
  );
  const publishedAt = asString(
    p.publishedAt,
    asString(
      p.date_published,
      asString(p.date, p.year ? String(p.year) : "2026"),
    ),
  );
  const subfield = asString(p.subfield, "Material Science");
  const abstract = findStringByKeys(
    p,
    [
      "abstract",
      "abstract_text",
      "abstractText",
      "paper_abstract",
      "summary",
      "ai_summary",
      "tldr",
      "tl_dr",
      "description",
    ],
    0,
  );
  const summary = findStringByKeys(p, [
    "ai_summary",
    "summary",
    "tldr",
    "tl_dr",
    "plain_language_summary",
  ]);

  return {
    id: asString(p.id, asString(p.key, `paper-${idx}`)),
    title: asString(p.title, "Untitled Research Paper"),
    authors: normalizeAuthors(p.authors),
    publishedAt,
    year: asNumber(p.year, new Date(publishedAt).getFullYear() || 2026),
    journal,
    journal_name: journal.journal_name,
    quartile: journal.quartile,
    abstract: abstract || "No abstract available for this paper.",
    aim: asString(p.aim, abstract || summary),
    whyItMatters: asString(p.whyItMatters, asString(p.why_it_matters)),
    simpleConclusion: asString(
      p.simpleConclusion,
      asString(p.simple_conclusion),
    ),
    ai_summary: summary,
    citation_count: findNumberByKeys(p, [
      "citation_count",
      "citations",
      "citationCount",
      "citations_count",
      "num_citations",
      "cited_by_count",
      "influentialCitationCount",
    ]),
    citation: asString(
      p.citation,
      asString(p.formatted_citation, asString(p.reference, asString(p.bibtex))),
    ),
    doi,
    pdf_url: pdfUrl,
    sourceUrl,
    keywords: [subfield, journal.quartile].filter(Boolean),
    topics: [subfield, "All Topics"],
    subfield,
  };
}

// --- Detail View Component ---
function DetailPanel({
  paper,
  onAsk,
  onBack,
  onSave,
  isSaved,
}: {
  paper: ResearchPaper;
  onAsk: () => void;
  onBack: () => void;
  onSave: () => void;
  isSaved: boolean;
}) {
  const journal = paper.journal || {
    journal_name: paper.journal_name || "Academic Journal",
    quartile: paper.quartile || "Q2",
  };
  const style = getQuartileStyle(journal.quartile);
  const citation = buildCitation(paper, journal.journal_name);
  const abstractText =
    paper.abstract ||
    paper.ai_summary ||
    paper.aim ||
    "No abstract available for this paper.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-orange-600 dark:text-gray-400"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Library
          </button>
        </div>

        {/* Paper Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium ${style.badge}`}
                >
                  <Award size={13} />
                  {journal.journal_name}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${style.badge}`}
                >
                  {journal.quartile}
                </span>
                {paper.citation_count !== undefined && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-gray-300">
                    <TrendingUp size={13} />
                    {paper.citation_count.toLocaleString()}
                  </span>
                )}
              </div>

              <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-gray-900 dark:text-white lg:text-4xl">
                {paper.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span className="line-clamp-1">
                    {paper.authors.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{formatDate(paper.publishedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onSave}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  isSaved
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300"
                }`}
              >
                {isSaved ? <Check size={16} /> : <Save size={16} />}
              </button>
              {paper.pdf_url && (
                <a
                  href={paper.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:text-orange-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300"
                >
                  <Download size={16} />
                </a>
              )}
              <button
                onClick={onAsk}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
              >
                <Bot size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8">
            {/* Abstract */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-50 dark:bg-orange-950/30">
                  <FileText size={16} className="text-orange-600" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Abstract
                </h2>
              </div>
              <p className="text-base leading-7 text-gray-700 dark:text-gray-300">
                {abstractText}
              </p>
            </section>

            {/* Key Insights */}
            {(paper.whyItMatters || paper.simpleConclusion) && (
              <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-50 dark:bg-orange-950/30">
                    <Sparkles size={16} className="text-orange-600" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Key Insights
                  </h2>
                </div>
                <div className="space-y-5">
                  {paper.whyItMatters && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Why It Matters
                      </h3>
                      <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                        {paper.whyItMatters}
                      </p>
                    </div>
                  )}
                  {paper.simpleConclusion && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Conclusion
                      </h3>
                      <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                        {paper.simpleConclusion}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4">
            {/* Citation Card */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-50 dark:bg-orange-950/30">
                  <BookOpen size={16} className="text-orange-600" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Citation
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Users size={13} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Authors
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {paper.authors.join(", ")}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Calendar size={13} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Published
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(paper.publishedAt)}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Library size={13} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Journal
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {journal.journal_name}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <TrendingUp size={13} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Citations
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {paper.citation_count?.toLocaleString() ?? 0}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-6 text-gray-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-gray-300">
                  {citation}
                </div>

                <div className="space-y-2 pt-2">
                  {paper.sourceUrl && (
                    <a
                      href={paper.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:text-orange-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300"
                    >
                      <span className="flex items-center gap-2">
                        <LinkIcon size={14} className="text-gray-400" />
                        Open Paper
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-gray-400 transition-transform group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
                  {paper.doi && (
                    <a
                      href={
                        paper.doi.startsWith("http")
                          ? paper.doi
                          : `https://doi.org/${paper.doi}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:text-orange-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink size={14} className="text-gray-400" />
                        DOI
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-gray-400 transition-transform group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function AICopilot() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All Topics");
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [savedPaperIds, setSavedPaperIds] = useState<Set<string>>(() => {
    return new Set(loadSavedPapers().map((item) => item.id));
  });

  function savePaper(paperToSave: ResearchPaper) {
    savePaperToLibrary(paperToSave);
    setSavedPaperIds((prev) => new Set(prev).add(paperToSave.id));
  }

  async function loadDailyAutomationFeed() {
    setLoading(true);
    setFeedError(null);
    try {
      const feedUrl = new URL(DAILY_PAPERS_FEED_URL);
      feedUrl.searchParams.set(
        "updated",
        new Date().toISOString().slice(0, 10),
      );
      const res = await fetch(feedUrl.toString(), { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Feed request failed with status ${res.status}`);
      }
      const data = await res.json();
      const dailyPapers = normalizePapersPayload(data);

      if (!dailyPapers.length) {
        throw new Error("Feed did not contain any papers.");
      }
      setPapers(dailyPapers.map(mapFeedPaper));
      setLastSyncedAt(new Date().toLocaleString());
    } catch (err) {
      console.error("Could not fetch daily paper feed:", err);
      setFeedError(
        err instanceof Error
          ? err.message
          : "Could not fetch daily paper feed.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDailyAutomationFeed();
  }, []);

  const paper = papers.find((item) => item.id === selectedId) ?? null;

  const filteredPapers = useMemo(() => {
    return papers.filter((item) => {
      const titleText = (
        item.title +
        " " +
        item.authors.join(" ") +
        " " +
        (item.journal?.journal_name || "")
      ).toLowerCase();
      const matchesQuery = titleText.includes(query.toLowerCase());
      const matchesTopic =
        topic === "All Topics" ||
        (item.keywords && item.keywords.includes(topic)) ||
        item.quartile === topic;
      return matchesQuery && matchesTopic;
    });
  }, [papers, query, topic]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      {!paper ? (
        <main className="mx-auto max-w-7xl px-8 py-10">
          {/* Header */}
          <div className="mb-10 border-b border-gray-200 pb-8 dark:border-neutral-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                  <Sparkles size={14} />
                  Daily Feed
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Research Papers
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Latest peer-reviewed research in Material Science
                </p>
              </div>
              <button
                onClick={loadDailyAutomationFeed}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Syncing..." : "Sync"}
              </button>
            </div>
            {lastSyncedAt && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Last synced: {lastSyncedAt}
              </div>
            )}
          </div>

          {/* Search & Filters */}
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search papers..."
                className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-orange-950"
              />
            </div>
            <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-3 dark:sm:border-neutral-800">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border-0 bg-transparent py-2.5 pr-7 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:text-gray-300 sm:w-auto dark:focus:ring-orange-950"
              >
                <option value="All Topics">All Topics</option>
                <option value="Material Science">Material Science</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">
              {filteredPapers.length}
            </span>{" "}
            {filteredPapers.length === 1 ? "paper" : "papers"} found
          </div>

          {/* Papers List */}
          {/* Papers Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(0,1fr)_160px_140px_48px] items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Paper
              </div>

              <div className="text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Quality
              </div>

              <div className="text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Published
              </div>

              <div />
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                  <Loader2 size={20} className="animate-spin text-orange-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading papers...
                  </p>
                </div>
              ) : filteredPapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                  <Search
                    size={28}
                    className="text-gray-300 dark:text-neutral-700"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feedError || "No papers found"}
                  </p>
                </div>
              ) : (
                filteredPapers.map((item) => {
                  const j = item.journal || {
                    journal_name: item.journal_name || "Academic Journal",
                    quartile: item.quartile || "Q2",
                  };

                  const style = getQuartileStyle(j.quartile);

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className="grid w-full grid-cols-[minmax(0,1fr)_160px_140px_48px] items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                    >
                      {/* Paper Column */}
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-gray-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                          {item.title}
                        </h3>

                        <div className="mt-1.5 flex min-w-0 items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="shrink-0 font-medium text-gray-700 dark:text-gray-300">
                            {j.journal_name}
                          </span>

                          <span className="shrink-0 text-gray-300 dark:text-neutral-600">
                            •
                          </span>

                          <span className="min-w-0 truncate">
                            {item.authors.slice(0, 2).join(", ")}
                            {item.authors.length > 2 && " et al."}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                          {item.abstract}
                        </p>
                      </div>

                      {/* Quality Column */}
                      <div className="flex h-full items-center justify-start">
                        <span
                          className={`inline-flex h-8 min-w-[78px] items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium ${style.badge}`}
                        >
                          <Award size={12} />
                          {j.quartile}
                        </span>
                      </div>

                      {/* Published Column */}
                      <div className="flex h-full items-center justify-start">
                        <time className="whitespace-nowrap text-xs font-mono text-gray-500 dark:text-gray-400">
                          {formatDate(item.publishedAt)}
                        </time>
                      </div>

                      {/* Arrow Column */}
                      <div className="flex h-full items-center justify-end">
                        <ChevronRight
                          size={16}
                          className="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-orange-600"
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </main>
      ) : (
        <DetailPanel
          paper={paper}
          onBack={() => setSelectedId(null)}
          onAsk={() => {}}
          onSave={() => savePaper(paper)}
          isSaved={savedPaperIds.has(paper.id)}
        />
      )}
    </div>
  );
}
