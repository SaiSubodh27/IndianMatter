import { useEffect, useState } from "react";

type MaterialPaper = {
  title: string;
  journal?: {
    journal_name?: string;
    quartile?: string;
  };
  citation_count?: number;
  ai_summary?: string;
  abstract?: string;
  doi?: string;
  pdf_url?: string;
};

const DAILY_PAPERS_FEED_URL =
  "https://raw.githubusercontent.com/SaiSubodh27/ResearchPaper_automation/main/data/daily_material_papers.json";

export default function MaterialPapersWidget() {
  const [papers, setPapers] = useState<MaterialPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feedUrl = new URL(DAILY_PAPERS_FEED_URL);
    feedUrl.searchParams.set("updated", new Date().toISOString().slice(0, 10));

    fetch(feedUrl.toString(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data: unknown) => {
        const record =
          data && typeof data === "object" ? (data as Record<string, unknown>) : {};
        setPapers(Array.isArray(record.papers) ? record.papers as MaterialPaper[] : []);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching papers:", err));
  }, []);

  if (loading) return <div>Loading daily Material Science papers...</div>;

  return (
    <div className="space-y-4">
      {papers.map((p, idx) => (
        <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
            <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800">
              {p.journal?.quartile}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {p.journal?.journal_name} • Citations: {p.citation_count}
          </p>
          <p className="text-gray-700 text-sm mt-2">
            {p.ai_summary || p.abstract?.substring(0, 250)}...
          </p>
          <div className="mt-3 flex gap-3 text-sm font-semibold">
            {p.doi && (
              <a
                href={p.doi}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                🔗 DOI
              </a>
            )}
            {p.pdf_url && (
              <a
                href={p.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600"
              >
                📥 PDF
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
