import { useState } from "react";
import { ArrowRight, Bookmark, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChemicalFormula from "./ChemicalFormula";
import CrystalSystemSketch from "./CrystalSystemSketch";

export interface MaterialCardProps {
  id: string;
  formula: string;
  name: string;
  system: string;
  spaceGroup: string;
  bandGap: string;
  formationEnergy: string;
  conductivity: string;
  density: string;
  database: string;
  tags: string[];
}

export default function MaterialCard({
  id,
  formula,
  name,
  system,
  spaceGroup,
  bandGap,
  formationEnergy,
  conductivity,
  density,
  database,
  tags,
}: MaterialCardProps) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div
      onClick={() => navigate(`/app/materials/${id}`)}
      className="relative group bg-white rounded-xl p-5 shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between cursor-pointer min-h-[350px]"
    >
      <div>
        {/* Top Header: Database & Identifier + Bookmark */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-500">
              <Database size={12} className="text-slate-400" />
              <span>{database}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-semibold">{id}</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-slate-900 tracking-tight mt-1 flex items-baseline gap-2">
              <ChemicalFormula formula={formula} />
            </h3>
            {name && <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{name}</p>}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            aria-label="Save Material"
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Bookmark size={15} className={isSaved ? "fill-amber-600" : ""} />
          </button>
        </div>

        {/* Crystallographic Schema Box */}
        <div className="my-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded border border-slate-200/60 shadow-xs">
              <CrystalSystemSketch crystalSystem={system} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Crystal System
              </span>
              <span className="text-xs font-medium text-slate-800 capitalize">
                {system || "Unspecified"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Space Group
            </span>
            <span className="text-xs font-mono font-medium text-slate-700 px-1.5 py-0.5 bg-white rounded border border-slate-200">
              {spaceGroup || "P1"}
            </span>
          </div>
        </div>

        {/* Essential Properties Grid (Visible directly, not hidden on hover) */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs">
          <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Band Gap</span>
            <span className="font-mono font-semibold text-slate-800 tabular-nums">{bandGap || "—"}</span>
          </div>
          <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Form. Energy</span>
            <span className="font-mono font-semibold text-emerald-700 tabular-nums">
              {formationEnergy || "—"}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Ionic Cond.</span>
            <span className="font-mono font-semibold text-sky-700 tabular-nums">
              {conductivity || "—"}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-medium">Density</span>
            <span className="font-mono font-semibold text-slate-700 tabular-nums">{density || "—"}</span>
          </div>
        </div>

        {/* Feature Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600 border border-slate-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-1">
        <span className="text-[11px] text-slate-400 font-mono">
          Ref: {database}:{id}
        </span>
        <span className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Inspect Structure <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}
