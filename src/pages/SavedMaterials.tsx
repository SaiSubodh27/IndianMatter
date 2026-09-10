import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SavedTab = "materials" | "papers";

type SavedPaper = {
  id: string;
  title: string;
  authors?: string[];
  publishedAt?: string;
  journal_name?: string;
  quartile?: string;
  abstract?: string;
  citation_count?: number;
  citation?: string;
  doi?: string;
  pdf_url?: string;
  sourceUrl?: string;
  savedAt?: string;
};

const SAVED_PAPERS_STORAGE_KEY = "indianmatter.savedPapers";

function formatDate(dateStr?: string) {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function loadSavedPapers(): SavedPaper[] {
  try {
    const raw = localStorage.getItem(SAVED_PAPERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedPaper[]) : [];
  } catch {
    return [];
  }
}

export default function SavedMaterials() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "papers" ? "papers" : "materials";
  const [activeTab, setActiveTab] = useState<SavedTab>(initialTab);
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>(loadSavedPapers);
  const [query, setQuery] = useState("");

  const tableData = [
    {
      formula: "LiFePO4",
      id: "mat-8821a",
      element: "Li",
      date: "Oct 24, 2023",
      conductivity: "1.2 x 10^-4",
      status: "Simulation Complete",
    },
    {
      formula: "Na3V2(PO4)3",
      id: "mat-9104b",
      element: "Na",
      date: "Oct 22, 2023",
      conductivity: "8.4 x 10^-5",
      status: "Pending DFT",
    },
    {
      formula: "SiO2",
      id: "mat-104c",
      element: "Si",
      date: "Oct 18, 2023",
      conductivity: "--",
      status: "Calculation Failed",
    },
    {
      formula: "BaTiO3",
      id: "mat-442x",
      element: "Ti",
      date: "Oct 15, 2023",
      conductivity: "3.5 x 10^-6",
      status: "Simulation Complete",
    },
  ];

  const filteredPapers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return savedPapers;
    return savedPapers.filter((paper) => {
      const haystack = [
        paper.title,
        paper.journal_name,
        paper.quartile,
        paper.abstract,
        paper.authors?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, savedPapers]);

  function removeSavedPaper(id: string) {
    const next = savedPapers.filter((paper) => paper.id !== id);
    setSavedPapers(next);
    localStorage.setItem(SAVED_PAPERS_STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="enterprise-page">
      <div className="enterprise-shell flex h-full min-h-screen flex-col">
        <header className="mb-8 flex flex-col gap-6 border-b border-gray-200 pb-6 dark:border-neutral-800 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 dark:text-neutral-300">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                folder_special
              </span>
              <span className="font-label text-xs uppercase tracking-wider">
                Library
              </span>
            </div>
            <h2 className="mb-3 font-headline text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-neutral-100 md:text-4xl lg:text-[3.5rem]">
              Saved
            </h2>
            <p className="max-w-2xl text-sm tracking-wide text-gray-600 dark:text-neutral-400 md:text-base">
              Keep your saved materials and research papers in one place.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button className="enterprise-button-secondary h-10 px-4 py-0">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Export CSV
            </button>
            <button className="enterprise-button-primary h-10 px-4 py-0 font-label text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">
                play_circle
              </span>
              Batch Predict
            </button>
          </div>
        </header>

        <section className="enterprise-panel mb-8 flex shrink-0 flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="flex rounded-md border border-gray-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-950">
            {(["materials", "papers"] as SavedTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }`}
              >
                Saved {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500">
              search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="enterprise-input h-10 pl-10"
              placeholder={
                activeTab === "papers"
                  ? "Search saved papers..."
                  : "Search by formula, ID, or property..."
              }
              type="text"
            />
          </div>
        </section>

        {activeTab === "materials" ? (
          <section className="enterprise-panel flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
                    <th className="py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Material Formula
                    </th>
                    <th className="py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Date Saved
                    </th>
                    <th className="py-4 px-6 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Pred. Conductivity (S/cm)
                    </th>
                    <th className="py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Status
                    </th>
                    <th className="py-4 px-6 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm dark:divide-neutral-800">
                  {tableData.map((row) => (
                    <tr
                      key={row.id}
                      className="group transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-gray-100 text-xs font-medium text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                            {row.element}
                          </div>
                          <div>
                            <div className="font-headline font-medium tracking-wide text-gray-900 dark:text-neutral-100">
                              {row.formula}
                            </div>
                            <div className="mt-0.5 font-mono text-xs text-gray-500 dark:text-neutral-400">
                              ID: {row.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-neutral-400">
                        {row.date}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-gray-900 dark:text-neutral-100">
                        {row.conductivity}
                      </td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {row.status}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                          <span className="material-symbols-outlined text-[20px]">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="enterprise-panel flex flex-1 flex-col overflow-hidden">
            {filteredPapers.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                <span className="material-symbols-outlined mb-3 text-4xl text-gray-300 dark:text-neutral-700">
                  article
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
                  No saved papers yet
                </h3>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-neutral-400">
                  Open Research Papers, click a paper, then use Save Paper.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-neutral-800">
                {filteredPapers.map((paper) => (
                  <article
                    key={paper.id}
                    className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_180px_120px]"
                  >
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">
                        {paper.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                        {(paper.authors || ["Unknown Author"]).join(", ")} -{" "}
                        {paper.journal_name || "Academic Journal"}{" "}
                        {paper.quartile ? `(${paper.quartile})` : ""}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-neutral-400">
                        {paper.abstract || "No abstract available for this paper."}
                      </p>
                      {paper.citation && (
                        <p className="mt-3 rounded-md bg-gray-50 p-3 text-xs leading-5 text-gray-700 dark:bg-neutral-950 dark:text-neutral-300">
                          {paper.citation}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">
                      <span className="block text-xs font-bold uppercase text-gray-400">
                        Citations
                      </span>
                      {paper.citation_count ?? 0}
                      <span className="mt-4 block text-xs font-bold uppercase text-gray-400">
                        Saved
                      </span>
                      {formatDate(paper.savedAt)}
                    </div>
                    <div className="flex items-start justify-end gap-2">
                      {(paper.sourceUrl || paper.doi || paper.pdf_url) && (
                        <a
                          href={paper.sourceUrl || paper.doi || paper.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="enterprise-button-secondary h-9 px-3 py-0 text-xs"
                        >
                          Open
                        </a>
                      )}
                      <button
                        onClick={() => removeSavedPaper(paper.id)}
                        className="enterprise-button-secondary h-9 px-3 py-0 text-xs text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
