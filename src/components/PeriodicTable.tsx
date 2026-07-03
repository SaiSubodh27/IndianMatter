import { useState } from "react";

export type ElementState = "neutral" | "include" | "exclude";

type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "reactive-nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

interface PeriodicTableProps {
  onSelectionChange?: (selection: {
    include: string[];
    exclude: string[];
  }) => void;
}

// 118 elements data, with standard chemical family classification
const elements: {
  symbol: string;
  num: number;
  group: number;
  period: number;
  category: ElementCategory;
}[] = [
  // Period 1
  { symbol: "H", num: 1, group: 1, period: 1, category: "reactive-nonmetal" },
  { symbol: "He", num: 2, group: 18, period: 1, category: "noble-gas" },
  // Period 2
  { symbol: "Li", num: 3, group: 1, period: 2, category: "alkali-metal" },
  {
    symbol: "Be",
    num: 4,
    group: 2,
    period: 2,
    category: "alkaline-earth-metal",
  },
  { symbol: "B", num: 5, group: 13, period: 2, category: "metalloid" },
  { symbol: "C", num: 6, group: 14, period: 2, category: "reactive-nonmetal" },
  { symbol: "N", num: 7, group: 15, period: 2, category: "reactive-nonmetal" },
  { symbol: "O", num: 8, group: 16, period: 2, category: "reactive-nonmetal" },
  { symbol: "F", num: 9, group: 17, period: 2, category: "halogen" },
  { symbol: "Ne", num: 10, group: 18, period: 2, category: "noble-gas" },
  // Period 3
  { symbol: "Na", num: 11, group: 1, period: 3, category: "alkali-metal" },
  {
    symbol: "Mg",
    num: 12,
    group: 2,
    period: 3,
    category: "alkaline-earth-metal",
  },
  {
    symbol: "Al",
    num: 13,
    group: 13,
    period: 3,
    category: "post-transition-metal",
  },
  { symbol: "Si", num: 14, group: 14, period: 3, category: "metalloid" },
  { symbol: "P", num: 15, group: 15, period: 3, category: "reactive-nonmetal" },
  { symbol: "S", num: 16, group: 16, period: 3, category: "reactive-nonmetal" },
  { symbol: "Cl", num: 17, group: 17, period: 3, category: "halogen" },
  { symbol: "Ar", num: 18, group: 18, period: 3, category: "noble-gas" },
  // Period 4
  { symbol: "K", num: 19, group: 1, period: 4, category: "alkali-metal" },
  {
    symbol: "Ca",
    num: 20,
    group: 2,
    period: 4,
    category: "alkaline-earth-metal",
  },
  { symbol: "Sc", num: 21, group: 3, period: 4, category: "transition-metal" },
  { symbol: "Ti", num: 22, group: 4, period: 4, category: "transition-metal" },
  { symbol: "V", num: 23, group: 5, period: 4, category: "transition-metal" },
  { symbol: "Cr", num: 24, group: 6, period: 4, category: "transition-metal" },
  { symbol: "Mn", num: 25, group: 7, period: 4, category: "transition-metal" },
  { symbol: "Fe", num: 26, group: 8, period: 4, category: "transition-metal" },
  { symbol: "Co", num: 27, group: 9, period: 4, category: "transition-metal" },
  { symbol: "Ni", num: 28, group: 10, period: 4, category: "transition-metal" },
  { symbol: "Cu", num: 29, group: 11, period: 4, category: "transition-metal" },
  { symbol: "Zn", num: 30, group: 12, period: 4, category: "transition-metal" },
  {
    symbol: "Ga",
    num: 31,
    group: 13,
    period: 4,
    category: "post-transition-metal",
  },
  { symbol: "Ge", num: 32, group: 14, period: 4, category: "metalloid" },
  { symbol: "As", num: 33, group: 15, period: 4, category: "metalloid" },
  {
    symbol: "Se",
    num: 34,
    group: 16,
    period: 4,
    category: "reactive-nonmetal",
  },
  { symbol: "Br", num: 35, group: 17, period: 4, category: "halogen" },
  { symbol: "Kr", num: 36, group: 18, period: 4, category: "noble-gas" },
  // Period 5
  { symbol: "Rb", num: 37, group: 1, period: 5, category: "alkali-metal" },
  {
    symbol: "Sr",
    num: 38,
    group: 2,
    period: 5,
    category: "alkaline-earth-metal",
  },
  { symbol: "Y", num: 39, group: 3, period: 5, category: "transition-metal" },
  { symbol: "Zr", num: 40, group: 4, period: 5, category: "transition-metal" },
  { symbol: "Nb", num: 41, group: 5, period: 5, category: "transition-metal" },
  { symbol: "Mo", num: 42, group: 6, period: 5, category: "transition-metal" },
  { symbol: "Tc", num: 43, group: 7, period: 5, category: "transition-metal" },
  { symbol: "Ru", num: 44, group: 8, period: 5, category: "transition-metal" },
  { symbol: "Rh", num: 45, group: 9, period: 5, category: "transition-metal" },
  { symbol: "Pd", num: 46, group: 10, period: 5, category: "transition-metal" },
  { symbol: "Ag", num: 47, group: 11, period: 5, category: "transition-metal" },
  { symbol: "Cd", num: 48, group: 12, period: 5, category: "transition-metal" },
  {
    symbol: "In",
    num: 49,
    group: 13,
    period: 5,
    category: "post-transition-metal",
  },
  {
    symbol: "Sn",
    num: 50,
    group: 14,
    period: 5,
    category: "post-transition-metal",
  },
  { symbol: "Sb", num: 51, group: 15, period: 5, category: "metalloid" },
  { symbol: "Te", num: 52, group: 16, period: 5, category: "metalloid" },
  { symbol: "I", num: 53, group: 17, period: 5, category: "halogen" },
  { symbol: "Xe", num: 54, group: 18, period: 5, category: "noble-gas" },
  // Period 6 (excluding lanthanides)
  { symbol: "Cs", num: 55, group: 1, period: 6, category: "alkali-metal" },
  {
    symbol: "Ba",
    num: 56,
    group: 2,
    period: 6,
    category: "alkaline-earth-metal",
  },
  { symbol: "Lu", num: 71, group: 3, period: 6, category: "transition-metal" },
  { symbol: "Hf", num: 72, group: 4, period: 6, category: "transition-metal" },
  { symbol: "Ta", num: 73, group: 5, period: 6, category: "transition-metal" },
  { symbol: "W", num: 74, group: 6, period: 6, category: "transition-metal" },
  { symbol: "Re", num: 75, group: 7, period: 6, category: "transition-metal" },
  { symbol: "Os", num: 76, group: 8, period: 6, category: "transition-metal" },
  { symbol: "Ir", num: 77, group: 9, period: 6, category: "transition-metal" },
  { symbol: "Pt", num: 78, group: 10, period: 6, category: "transition-metal" },
  { symbol: "Au", num: 79, group: 11, period: 6, category: "transition-metal" },
  { symbol: "Hg", num: 80, group: 12, period: 6, category: "transition-metal" },
  {
    symbol: "Tl",
    num: 81,
    group: 13,
    period: 6,
    category: "post-transition-metal",
  },
  {
    symbol: "Pb",
    num: 82,
    group: 14,
    period: 6,
    category: "post-transition-metal",
  },
  {
    symbol: "Bi",
    num: 83,
    group: 15,
    period: 6,
    category: "post-transition-metal",
  },
  {
    symbol: "Po",
    num: 84,
    group: 16,
    period: 6,
    category: "post-transition-metal",
  },
  { symbol: "At", num: 85, group: 17, period: 6, category: "metalloid" },
  { symbol: "Rn", num: 86, group: 18, period: 6, category: "noble-gas" },
  // Period 7 (excluding actinides)
  { symbol: "Fr", num: 87, group: 1, period: 7, category: "alkali-metal" },
  {
    symbol: "Ra",
    num: 88,
    group: 2,
    period: 7,
    category: "alkaline-earth-metal",
  },
  { symbol: "Lr", num: 103, group: 3, period: 7, category: "transition-metal" },
  { symbol: "Rf", num: 104, group: 4, period: 7, category: "transition-metal" },
  { symbol: "Db", num: 105, group: 5, period: 7, category: "transition-metal" },
  { symbol: "Sg", num: 106, group: 6, period: 7, category: "transition-metal" },
  { symbol: "Bh", num: 107, group: 7, period: 7, category: "transition-metal" },
  { symbol: "Hs", num: 108, group: 8, period: 7, category: "transition-metal" },
  { symbol: "Mt", num: 109, group: 9, period: 7, category: "transition-metal" },
  {
    symbol: "Ds",
    num: 110,
    group: 10,
    period: 7,
    category: "transition-metal",
  },
  {
    symbol: "Rg",
    num: 111,
    group: 11,
    period: 7,
    category: "transition-metal",
  },
  {
    symbol: "Cn",
    num: 112,
    group: 12,
    period: 7,
    category: "transition-metal",
  },
  {
    symbol: "Nh",
    num: 113,
    group: 13,
    period: 7,
    category: "post-transition-metal",
  },
  {
    symbol: "Fl",
    num: 114,
    group: 14,
    period: 7,
    category: "post-transition-metal",
  },
  {
    symbol: "Mc",
    num: 115,
    group: 15,
    period: 7,
    category: "post-transition-metal",
  },
  {
    symbol: "Lv",
    num: 116,
    group: 16,
    period: 7,
    category: "post-transition-metal",
  },
  { symbol: "Ts", num: 117, group: 17, period: 7, category: "halogen" },
  { symbol: "Og", num: 118, group: 18, period: 7, category: "noble-gas" },

  // Lanthanides (displayed in period 9 for layout purposes)
  { symbol: "La", num: 57, group: 4, period: 9, category: "lanthanide" },
  { symbol: "Ce", num: 58, group: 5, period: 9, category: "lanthanide" },
  { symbol: "Pr", num: 59, group: 6, period: 9, category: "lanthanide" },
  { symbol: "Nd", num: 60, group: 7, period: 9, category: "lanthanide" },
  { symbol: "Pm", num: 61, group: 8, period: 9, category: "lanthanide" },
  { symbol: "Sm", num: 62, group: 9, period: 9, category: "lanthanide" },
  { symbol: "Eu", num: 63, group: 10, period: 9, category: "lanthanide" },
  { symbol: "Gd", num: 64, group: 11, period: 9, category: "lanthanide" },
  { symbol: "Tb", num: 65, group: 12, period: 9, category: "lanthanide" },
  { symbol: "Dy", num: 66, group: 13, period: 9, category: "lanthanide" },
  { symbol: "Ho", num: 67, group: 14, period: 9, category: "lanthanide" },
  { symbol: "Er", num: 68, group: 15, period: 9, category: "lanthanide" },
  { symbol: "Tm", num: 69, group: 16, period: 9, category: "lanthanide" },
  { symbol: "Yb", num: 70, group: 17, period: 9, category: "lanthanide" },

  // Actinides (displayed in period 10 for layout purposes)
  { symbol: "Ac", num: 89, group: 4, period: 10, category: "actinide" },
  { symbol: "Th", num: 90, group: 5, period: 10, category: "actinide" },
  { symbol: "Pa", num: 91, group: 6, period: 10, category: "actinide" },
  { symbol: "U", num: 92, group: 7, period: 10, category: "actinide" },
  { symbol: "Np", num: 93, group: 8, period: 10, category: "actinide" },
  { symbol: "Pu", num: 94, group: 9, period: 10, category: "actinide" },
  { symbol: "Am", num: 95, group: 10, period: 10, category: "actinide" },
  { symbol: "Cm", num: 96, group: 11, period: 10, category: "actinide" },
  { symbol: "Bk", num: 97, group: 12, period: 10, category: "actinide" },
  { symbol: "Cf", num: 98, group: 13, period: 10, category: "actinide" },
  { symbol: "Es", num: 99, group: 14, period: 10, category: "actinide" },
  { symbol: "Fm", num: 100, group: 15, period: 10, category: "actinide" },
  { symbol: "Md", num: 101, group: 16, period: 10, category: "actinide" },
  { symbol: "No", num: 102, group: 17, period: 10, category: "actinide" },
];

// Category -> background/border/text classes, used only in the neutral state.
// Selected states (include/exclude) always override these.
const categoryStyles: Record<ElementCategory, string> = {
  "alkali-metal":
    "border-orange-200 bg-orange-50 text-orange-900 hover:border-orange-400 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300",
  "alkaline-earth-metal":
    "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
  "transition-metal":
    "border-sky-200 bg-sky-50 text-sky-900 hover:border-sky-400 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300",
  "post-transition-metal":
    "border-teal-200 bg-teal-50 text-teal-900 hover:border-teal-400 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300",
  metalloid:
    "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-400 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  "reactive-nonmetal":
    "border-lime-200 bg-lime-50 text-lime-900 hover:border-lime-400 dark:border-lime-900/50 dark:bg-lime-950/40 dark:text-lime-300",
  halogen:
    "border-yellow-200 bg-yellow-50 text-yellow-900 hover:border-yellow-400 dark:border-yellow-900/50 dark:bg-yellow-950/40 dark:text-yellow-300",
  "noble-gas":
    "border-violet-200 bg-violet-50 text-violet-900 hover:border-violet-400 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300",
  lanthanide:
    "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900 hover:border-fuchsia-400 dark:border-fuchsia-900/50 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
  actinide:
    "border-purple-200 bg-purple-50 text-purple-900 hover:border-purple-400 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300",
};

const categoryLabels: Record<ElementCategory, string> = {
  "alkali-metal": "Alkali metal",
  "alkaline-earth-metal": "Alkaline earth metal",
  "transition-metal": "Transition metal",
  "post-transition-metal": "Post-transition metal",
  metalloid: "Metalloid",
  "reactive-nonmetal": "Reactive nonmetal",
  halogen: "Halogen",
  "noble-gas": "Noble gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
};

const categorySwatch: Record<ElementCategory, string> = {
  "alkali-metal": "bg-orange-300 dark:bg-orange-800",
  "alkaline-earth-metal": "bg-amber-300 dark:bg-amber-800",
  "transition-metal": "bg-sky-300 dark:bg-sky-800",
  "post-transition-metal": "bg-teal-300 dark:bg-teal-800",
  metalloid: "bg-emerald-300 dark:bg-emerald-800",
  "reactive-nonmetal": "bg-lime-300 dark:bg-lime-800",
  halogen: "bg-yellow-300 dark:bg-yellow-800",
  "noble-gas": "bg-violet-300 dark:bg-violet-800",
  lanthanide: "bg-fuchsia-300 dark:bg-fuchsia-800",
  actinide: "bg-purple-300 dark:bg-purple-800",
};

export default function PeriodicTable({
  onSelectionChange,
}: PeriodicTableProps) {
  const [states, setStates] = useState<Record<string, ElementState>>({});
  // Preserves the order elements were included/excluded in, so the
  // composition string reflects click order rather than atomic number order.
  const [includeOrder, setIncludeOrder] = useState<string[]>([]);
  const [excludeOrder, setExcludeOrder] = useState<string[]>([]);

  const toggleElement = (symbol: string) => {
    setStates((prev) => {
      const current = prev[symbol] || "neutral";
      let next: ElementState = "neutral";
      if (current === "neutral") next = "include";
      else if (current === "include") next = "exclude";

      const newStates = { ...prev, [symbol]: next };

      let newIncludeOrder = includeOrder;
      let newExcludeOrder = excludeOrder;

      if (current === "neutral" && next === "include") {
        newIncludeOrder = [...includeOrder, symbol];
      } else if (current === "include" && next === "exclude") {
        newIncludeOrder = includeOrder.filter((s) => s !== symbol);
        newExcludeOrder = [...excludeOrder, symbol];
      } else if (current === "exclude" && next === "neutral") {
        newExcludeOrder = excludeOrder.filter((s) => s !== symbol);
      }

      setIncludeOrder(newIncludeOrder);
      setExcludeOrder(newExcludeOrder);

      if (onSelectionChange) {
        onSelectionChange({
          include: newIncludeOrder,
          exclude: newExcludeOrder,
        });
      }
      return newStates;
    });
  };

  const getElementStyle = (state: ElementState, category: ElementCategory) => {
    switch (state) {
      case "include":
        return "border-gray-900 bg-gray-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-gray-900";
      case "exclude":
        return "border-rose-300 bg-rose-50 text-rose-700 line-through decoration-2 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300";
      default:
        return categoryStyles[category];
    }
  };

  const compositionString = includeOrder.join("-");
  const usedCategories = Array.from(new Set(elements.map((el) => el.category)));

  return (
    <div className="relative w-full">
      <div className="enterprise-panel p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-neutral-100 font-headline">
              Chemical Composition
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Define elemental constraints for your material search
            </p>
          </div>
          <div className="flex items-center gap-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border border-gray-900 bg-gray-900 dark:border-neutral-100 dark:bg-neutral-100"></div>
              <span className="font-medium text-gray-600 dark:text-neutral-300">
                Include
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-neutral-700"></div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border border-rose-300 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40"></div>
              <span className="font-medium text-gray-600 dark:text-neutral-300">
                Exclude
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-neutral-700"></div>
            <span className="text-gray-500 dark:text-neutral-400">
              Click to cycle
            </span>
          </div>
        </div>

        {/* Composition display */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor="composition-output"
            className="text-xs font-medium text-gray-600 dark:text-neutral-300 sm:w-28 sm:shrink-0"
          >
            Composition
          </label>
          <input
            id="composition-output"
            type="text"
            readOnly
            value={compositionString}
            placeholder="Select elements below (e.g. He-Li)"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        {excludeOrder.length > 0 && (
          <p className="mb-4 text-xs text-rose-600 dark:text-rose-400">
            Excluding: {excludeOrder.join(", ")}
          </p>
        )}

        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            gridTemplateRows: "repeat(10, minmax(0, 1fr))",
          }}
        >
          {elements.map((el) => (
            <div
              key={el.symbol}
              onClick={() => toggleElement(el.symbol)}
              title={categoryLabels[el.category]}
              className={`
                relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border p-1 transition-colors
                ${getElementStyle(states[el.symbol] || "neutral", el.category)}
              `}
              style={{
                gridColumn: el.group,
                gridRow: el.period,
              }}
            >
              <span className="absolute top-0.5 left-1 text-[9px] opacity-50">
                {el.num}
              </span>
              <span className="text-base font-bold leading-none">
                {el.symbol}
              </span>
            </div>
          ))}

          {/* Labels for Lanthanides and Actinides */}
          <div
            className="flex items-center justify-end pr-2 text-xs text-gray-500 dark:text-neutral-500"
            style={{ gridColumn: "1 / span 3", gridRow: 9 }}
          >
            Lanthanides
          </div>
          <div
            className="flex items-center justify-end pr-2 text-xs text-gray-500 dark:text-neutral-500"
            style={{ gridColumn: "1 / span 3", gridRow: 10 }}
          >
            Actinides
          </div>
        </div>

        {/* Category legend */}
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-200 pt-4 text-[11px] text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
          {usedCategories.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className={`h-2.5 w-2.5 rounded-sm ${categorySwatch[cat]}`}
              ></div>
              <span>{categoryLabels[cat]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
