import { useState } from "react";
import { BookOpen, Search, ExternalLink, Sparkles } from "lucide-react";

export default function LiteraturePage() {
  const [query, setQuery] = useState("");

  const papers = [
    {
      title: "Machine Learning Interatomic Potentials for Next-Generation Solid Electrolytes",
      authors: "Chen, L., Srinivasan, V., et al.",
      journal: "Nature Materials",
      year: 2024,
      citations: 142,
      doi: "10.1038/s41563-024-01822-x",
      tags: ["MLIP", "Solid-State", "NASICON"],
    },
    {
      title: "Direct Synthesis and High-Throughput DFT Validation of Halide Perovskite Solar Materials",
      authors: "Sharma, R., Patel, K., et al.",
      journal: "Advanced Energy Materials",
      year: 2023,
      citations: 89,
      doi: "10.1002/aenm.202301992",
      tags: ["Perovskite", "DFT", "Photovoltaics"],
    },
    {
      title: "Crystal Graph Neural Networks for Ultra-Fast Band Gap Prediction in Battery Cathodes",
      authors: "Gupta, A., Wang, Y., et al.",
      journal: "Physical Review Materials",
      year: 2024,
      citations: 67,
      doi: "10.1103/PhysRevMaterials.8.043801",
      tags: ["GNN", "Cathodes", "Band Gap"],
    },
  ];

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <BookOpen size={14} /> Knowledge Exploration
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Literature & Diversity Analysis
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Explore published literature correlations, chemical space diversity projections, and crystal structure citations.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search publications by keyword, crystal system, author, or DOI..."
            className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-[#1E2227] outline-none focus:border-[#F1641D]"
          />
        </div>
      </div>

      {/* Chemical Diversity Map Projection Banner */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-[#EFE5DC] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs font-bold text-[#F1641D] uppercase tracking-wider font-headline">
            Chemical Diversity Projection
          </span>
          <h3 className="text-2xl font-headline font-bold text-[#1E2227]">
            Explored vs. Unexplored Chemical Space
          </h3>
          <p className="text-xs text-[#5F6771] leading-relaxed">
            t-SNE dimensional reduction mapping 140,000+ Materials Project structures against published synthesis papers. Dense clusters represent established oxide chemistries; sparse regions highlight novel exploration targets.
          </p>
          <div className="flex gap-4 text-xs font-semibold pt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#F1641D] rounded-full" /> Explored Syntheses</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#2E7D32] rounded-full" /> High-Confidence Predicted</span>
          </div>
        </div>

        <div className="w-56 h-44 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] flex items-center justify-center p-4">
          <div className="text-center">
            <Sparkles size={32} className="text-[#F1641D] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1E2227]">Latent Space Map</p>
            <p className="text-[10px] text-[#8C929C]">UMAP 2D Projection</p>
          </div>
        </div>
      </div>

      {/* Papers List */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-xl text-[#1E2227]">Correlated Research Publications</h3>
        <div className="space-y-3">
          {papers.map((paper, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1.5">
                <h4 className="font-headline font-bold text-base text-[#1E2227]">{paper.title}</h4>
                <p className="text-xs text-[#5F6771]">
                  {paper.authors} • <span className="font-medium text-[#1E2227]">{paper.journal}</span> ({paper.year})
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {paper.tags.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 bg-[#FAF4EE] rounded-md text-[10px] font-medium text-[#5B636E]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#8C929C] font-mono">{paper.citations} citations</span>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#FAF4EE] text-[#F1641D] rounded-xl text-xs font-semibold hover:bg-[#FBE8D8] transition-colors flex items-center gap-1"
                >
                  DOI <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
