import React from "react";

export interface CrystalSystemSketchProps {
  crystalSystem?: string | null;
  className?: string;
}

/**
 * Returns a schematic wireframe SVG based on the crystallographic system.
 * Maps Cubic, Tetragonal, Hexagonal, Trigonal, Orthorhombic, Monoclinic.
 * For Triclinic or unknown values, renders a neutral placeholder labeled "Crystal system unknown".
 */
export default function CrystalSystemSketch({
  crystalSystem,
  className = "w-10 h-10 stroke-slate-500 fill-none stroke-[1.5]",
}: CrystalSystemSketchProps) {
  const s = (crystalSystem || "").toLowerCase().trim();

  if (s.includes("cubic")) {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-label="Cubic crystal system">
        <rect x="14" y="14" width="22" height="22" rx="1" />
        <rect x="8" y="8" width="22" height="22" rx="1" className="stroke-slate-400 stroke-dashed" />
        <line x1="8" y1="8" x2="14" y2="14" />
        <line x1="30" y1="8" x2="36" y2="14" />
        <line x1="8" y1="30" x2="14" y2="36" />
        <line x1="30" y1="30" x2="36" y2="36" />
      </svg>
    );
  }

  if (s.includes("hex") || s.includes("trig")) {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-label="Hexagonal or Trigonal crystal system">
        <polygon points="24,6 38,14 38,30 24,38 10,30 10,14" />
        <line x1="24" y1="6" x2="24" y2="38" className="stroke-slate-300 stroke-dashed" />
        <line x1="10" y1="14" x2="38" y2="30" className="stroke-slate-300 stroke-dashed" />
      </svg>
    );
  }

  if (s.includes("tetra")) {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-label="Tetragonal crystal system">
        <rect x="14" y="8" width="20" height="28" rx="1" />
        <rect x="9" y="4" width="20" height="28" rx="1" className="stroke-slate-400 stroke-dashed" />
        <line x1="9" y1="4" x2="14" y2="8" />
        <line x1="29" y1="4" x2="34" y2="8" />
        <line x1="9" y1="32" x2="14" y2="36" />
        <line x1="29" y1="32" x2="34" y2="36" />
      </svg>
    );
  }

  if (s.includes("ortho") || s.includes("mono")) {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-label="Orthorhombic or Monoclinic crystal system">
        <polygon points="12,12 36,12 32,34 8,34" />
        <polygon points="16,6 40,6 36,28 12,28" className="stroke-slate-400 stroke-dashed" />
        <line x1="12" y1="12" x2="16" y2="6" />
        <line x1="36" y1="12" x2="40" y2="6" />
        <line x1="8" y1="34" x2="12" y2="28" />
        <line x1="32" y1="34" x2="36" y2="28" />
      </svg>
    );
  }

  // Triclinic or unknown values: render neutral placeholder labeled "Crystal system unknown"
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <svg viewBox="0 0 48 48" className={className} aria-label="Crystal system unknown">
        <polygon points="10,16 34,10 38,32 14,38" className="stroke-slate-300 stroke-dashed" />
        <line x1="10" y1="16" x2="38" y2="32" className="stroke-slate-300 stroke-dotted" />
      </svg>
      <span className="text-[9px] text-slate-400 font-mono mt-0.5">Crystal system unknown</span>
    </div>
  );
}
