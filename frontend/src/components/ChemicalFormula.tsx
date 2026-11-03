import React from "react";

export interface ChemicalFormulaProps {
  formula: string;
  className?: string;
}

/**
 * Renders chemical formulas with proper subscripts for stoichiometric integers/decimals.
 * E.g., "LiFePO4" -> LiFePO₄, "Na3Zr2Si2PO12" -> Na₃Zr₂Si₂PO₁₂
 */
export default function ChemicalFormula({
  formula,
  className = "",
}: ChemicalFormulaProps) {
  if (!formula) return null;

  // Split stoichiometric digits/decimals following chemical symbols
  const parts = formula.split(/(\d+(?:\.\d+)?)/g);

  return (
    <span className={`font-mono tracking-tight ${className}`}>
      {parts.map((part, index) => {
        if (/^\d+(?:\.\d+)?$/.test(part)) {
          return (
            <sub key={index} className="text-[0.72em] bottom-[-0.18em] relative font-medium">
              {part}
            </sub>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
