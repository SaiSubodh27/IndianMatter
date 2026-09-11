import { useState } from "react";
import { ArrowRight, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer min-h-[360px]"
    >
      <div>
        {/* Top Meta & Bookmark */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#8C929C] uppercase font-headline">
              {database} • {system}
            </span>
            <h3 className="text-2xl font-headline font-bold text-[#1E2227] tracking-tight mt-0.5">
              {formula}
            </h3>
            <p className="text-xs text-[#5F6771]">{name}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            aria-label="Save Material"
            className={`p-2 rounded-xl transition-colors ${
              isSaved ? "bg-[#FBE8D8] text-[#F1641D]" : "text-[#8C929C] hover:bg-[#FAF4EE] hover:text-[#1E2227]"
            }`}
          >
            <Bookmark size={16} className={isSaved ? "fill-[#F1641D]" : ""} />
          </button>
        </div>

        {/* Mineral Specimen / Lattice Artwork */}
        <div className="my-3 h-28 bg-[#FAF4EE]/70 rounded-2xl flex items-center justify-center p-3 border border-[#EFE5DC] relative overflow-hidden">
          <img
            src="/assets/about_lattice.png"
            alt={formula}
            className="max-h-full max-w-full object-contain drop-shadow-md select-none transform transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-mono text-[#5B636E]">
            {spaceGroup}
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-[#FAF4EE] rounded-lg text-[10px] font-medium text-[#6C737E] border border-[#EFE5DC]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-[#F2E7DC] flex items-center justify-between">
        <div className="text-xs">
          <span className="text-[#8C929C] text-[10px] block">Band Gap</span>
          <span className="font-bold text-[#1E2227]">{bandGap}</span>
        </div>

        <button
          onClick={() => navigate(`/app/materials/${id}`)}
          className="text-xs font-semibold text-[#F1641D] hover:text-[#D9520F] flex items-center gap-1 group-hover:translate-x-1 transition-all"
        >
          View Details <ArrowRight size={13} />
        </button>
      </div>

      {/* Desktop Hover Floating Material Properties Popover */}
      {isHovered && (
        <div className="hidden lg:block absolute left-full top-0 ml-3 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#EFE5DC] p-5 z-40 animate-in fade-in duration-200 pointer-events-none">
          <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-2 mb-3">
            <span className="font-headline font-bold text-xs text-[#F1641D] uppercase tracking-wider">
              Material Properties
            </span>
            <span className="text-[10px] text-[#8C929C] font-mono">{id}</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#6C737E]">Formula:</span>
              <span className="font-bold text-[#1E2227]">{formula}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C737E]">Space Group:</span>
              <span className="text-[#1E2227]">{spaceGroup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C737E]">Band Gap:</span>
              <span className="font-semibold text-[#1E2227]">{bandGap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C737E]">Formation Energy:</span>
              <span className="text-[#2E7D32]">{formationEnergy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C737E]">Ionic Conductivity:</span>
              <span className="text-[#F1641D]">{conductivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C737E]">Density:</span>
              <span className="text-[#1E2227]">{density}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
