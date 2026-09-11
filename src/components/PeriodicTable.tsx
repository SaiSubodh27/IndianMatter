import { useState } from "react";
import { Search, X } from "lucide-react";

export type ElementSelection = "include" | "exclude" | "none";

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: string;
  oxidationStates?: string;
}

type ElementTuple = [number, string, string, number, number, string, string?];

const elementTuples: ElementTuple[] = [
  [1, "H", "Hydrogen", 1, 1, "nonmetal", "+1, -1"],
  [2, "He", "Helium", 18, 1, "noble", "0"],
  [3, "Li", "Lithium", 1, 2, "alkali", "+1"],
  [4, "Be", "Beryllium", 2, 2, "alkaline", "+2"],
  [5, "B", "Boron", 13, 2, "metalloid", "+3"],
  [6, "C", "Carbon", 14, 2, "nonmetal", "-4, +2, +4"],
  [7, "N", "Nitrogen", 15, 2, "nonmetal", "-3, +3, +5"],
  [8, "O", "Oxygen", 16, 2, "nonmetal", "-2"],
  [9, "F", "Fluorine", 17, 2, "halogen", "-1"],
  [10, "Ne", "Neon", 18, 2, "noble", "0"],
  [11, "Na", "Sodium", 1, 3, "alkali", "+1"],
  [12, "Mg", "Magnesium", 2, 3, "alkaline", "+2"],
  [13, "Al", "Aluminium", 13, 3, "post-transition", "+3"],
  [14, "Si", "Silicon", 14, 3, "metalloid", "-4, +4"],
  [15, "P", "Phosphorus", 15, 3, "nonmetal", "-3, +3, +5"],
  [16, "S", "Sulfur", 16, 3, "nonmetal", "-2, +4, +6"],
  [17, "Cl", "Chlorine", 17, 3, "halogen", "-1, +1, +5, +7"],
  [18, "Ar", "Argon", 18, 3, "noble", "0"],
  [19, "K", "Potassium", 1, 4, "alkali", "+1"],
  [20, "Ca", "Calcium", 2, 4, "alkaline", "+2"],
  [21, "Sc", "Scandium", 3, 4, "transition", "+3"],
  [22, "Ti", "Titanium", 4, 4, "transition", "+2, +3, +4"],
  [23, "V", "Vanadium", 5, 4, "transition", "+2, +3, +4, +5"],
  [24, "Cr", "Chromium", 6, 4, "transition", "+2, +3, +6"],
  [25, "Mn", "Manganese", 7, 4, "transition", "+2, +4, +7"],
  [26, "Fe", "Iron", 8, 4, "transition", "+2, +3"],
  [27, "Co", "Cobalt", 9, 4, "transition", "+2, +3"],
  [28, "Ni", "Nickel", 10, 4, "transition", "+2, +3"],
  [29, "Cu", "Copper", 11, 4, "transition", "+1, +2"],
  [30, "Zn", "Zinc", 12, 4, "transition", "+2"],
  [31, "Ga", "Gallium", 13, 4, "post-transition", "+3"],
  [32, "Ge", "Germanium", 14, 4, "metalloid", "+2, +4"],
  [33, "As", "Arsenic", 15, 4, "metalloid", "-3, +3, +5"],
  [34, "Se", "Selenium", 16, 4, "nonmetal", "-2, +4, +6"],
  [35, "Br", "Bromine", 17, 4, "halogen", "-1, +1, +5"],
  [36, "Kr", "Krypton", 18, 4, "noble", "0"],
  [37, "Rb", "Rubidium", 1, 5, "alkali", "+1"],
  [38, "Sr", "Strontium", 2, 5, "alkaline", "+2"],
  [39, "Y", "Yttrium", 3, 5, "transition", "+3"],
  [40, "Zr", "Zirconium", 4, 5, "transition", "+4"],
  [41, "Nb", "Niobium", 5, 5, "transition", "+3, +5"],
  [42, "Mo", "Molybdenum", 6, 5, "transition", "+4, +6"],
  [43, "Tc", "Technetium", 7, 5, "transition", "+4, +7"],
  [44, "Ru", "Ruthenium", 8, 5, "transition", "+3, +4"],
  [45, "Rh", "Rhodium", 9, 5, "transition", "+3"],
  [46, "Pd", "Palladium", 10, 5, "transition", "+2, +4"],
  [47, "Ag", "Silver", 11, 5, "transition", "+1"],
  [48, "Cd", "Cadmium", 12, 5, "transition", "+2"],
  [49, "In", "Indium", 13, 5, "post-transition", "+1, +3"],
  [50, "Sn", "Tin", 14, 5, "post-transition", "+2, +4"],
  [51, "Sb", "Antimony", 15, 5, "metalloid", "-3, +3, +5"],
  [52, "Te", "Tellurium", 16, 5, "metalloid", "-2, +4, +6"],
  [53, "I", "Iodine", 17, 5, "halogen", "-1, +1, +5, +7"],
  [54, "Xe", "Xenon", 18, 5, "noble", "0"],
  [55, "Cs", "Caesium", 1, 6, "alkali", "+1"],
  [56, "Ba", "Barium", 2, 6, "alkaline", "+2"],
  [57, "La", "Lanthanum", 3, 6, "lanthanide", "+3"],
  [72, "Hf", "Hafnium", 4, 6, "transition", "+4"],
  [73, "Ta", "Tantalum", 5, 6, "transition", "+5"],
  [74, "W", "Tungsten", 6, 6, "transition", "+4, +6"],
  [75, "Re", "Rhenium", 7, 6, "transition", "+4, +6, +7"],
  [76, "Os", "Osmium", 8, 6, "transition", "+4, +8"],
  [77, "Ir", "Iridium", 9, 6, "transition", "+3, +4"],
  [78, "Pt", "Platinum", 10, 6, "transition", "+2, +4"],
  [79, "Au", "Gold", 11, 6, "transition", "+1, +3"],
  [80, "Hg", "Mercury", 12, 6, "transition", "+1, +2"],
  [81, "Tl", "Thallium", 13, 6, "post-transition", "+1, +3"],
  [82, "Pb", "Lead", 14, 6, "post-transition", "+2, +4"],
  [83, "Bi", "Bismuth", 15, 6, "post-transition", "+3, +5"],
  [84, "Po", "Polonium", 16, 6, "post-transition", "+2, +4"],
  [85, "At", "Astatine", 17, 6, "halogen", "-1, +1, +5"],
  [86, "Rn", "Radon", 18, 6, "noble", "0"],
  [87, "Fr", "Francium", 1, 7, "alkali", "+1"],
  [88, "Ra", "Radium", 2, 7, "alkaline", "+2"],
  [89, "Ac", "Actinium", 3, 7, "actinide", "+3"],
  [104, "Rf", "Rutherfordium", 4, 7, "transition", "+4"],
  [105, "Db", "Dubnium", 5, 7, "transition", "+5"],
  [106, "Sg", "Seaborgium", 6, 7, "transition", "+6"],
  [107, "Bh", "Bohrium", 7, 7, "transition", "+7"],
  [108, "Hs", "Hassium", 8, 7, "transition", "+8"],
  [109, "Mt", "Meitnerium", 9, 7, "transition"],
  [110, "Ds", "Darmstadtium", 10, 7, "transition"],
  [111, "Rg", "Roentgenium", 11, 7, "transition"],
  [112, "Cn", "Copernicium", 12, 7, "transition", "+2"],
  [113, "Nh", "Nihonium", 13, 7, "post-transition", "+1, +3"],
  [114, "Fl", "Flerovium", 14, 7, "post-transition", "+2, +4"],
  [115, "Mc", "Moscovium", 15, 7, "post-transition", "+1, +3"],
  [116, "Lv", "Livermorium", 16, 7, "post-transition", "+2, +4"],
  [117, "Ts", "Tennessine", 17, 7, "halogen", "-1, +1, +3"],
  [118, "Og", "Oganesson", 18, 7, "noble", "0"],
  [58, "Ce", "Cerium", 4, 8, "lanthanide", "+3, +4"],
  [59, "Pr", "Praseodymium", 5, 8, "lanthanide", "+3, +4"],
  [60, "Nd", "Neodymium", 6, 8, "lanthanide", "+3"],
  [61, "Pm", "Promethium", 7, 8, "lanthanide", "+3"],
  [62, "Sm", "Samarium", 8, 8, "lanthanide", "+2, +3"],
  [63, "Eu", "Europium", 9, 8, "lanthanide", "+2, +3"],
  [64, "Gd", "Gadolinium", 10, 8, "lanthanide", "+3"],
  [65, "Tb", "Terbium", 11, 8, "lanthanide", "+3, +4"],
  [66, "Dy", "Dysprosium", 12, 8, "lanthanide", "+3"],
  [67, "Ho", "Holmium", 13, 8, "lanthanide", "+3"],
  [68, "Er", "Erbium", 14, 8, "lanthanide", "+3"],
  [69, "Tm", "Thulium", 15, 8, "lanthanide", "+2, +3"],
  [70, "Yb", "Ytterbium", 16, 8, "lanthanide", "+2, +3"],
  [71, "Lu", "Lutetium", 17, 8, "lanthanide", "+3"],
  [90, "Th", "Thorium", 4, 9, "actinide", "+4"],
  [91, "Pa", "Protactinium", 5, 9, "actinide", "+4, +5"],
  [92, "U", "Uranium", 6, 9, "actinide", "+3, +4, +5, +6"],
  [93, "Np", "Neptunium", 7, 9, "actinide", "+3, +4, +5, +6"],
  [94, "Pu", "Plutonium", 8, 9, "actinide", "+3, +4, +5, +6"],
  [95, "Am", "Americium", 9, 9, "actinide", "+3, +4, +5, +6"],
  [96, "Cm", "Curium", 10, 9, "actinide", "+3"],
  [97, "Bk", "Berkelium", 11, 9, "actinide", "+3, +4"],
  [98, "Cf", "Californium", 12, 9, "actinide", "+3"],
  [99, "Es", "Einsteinium", 13, 9, "actinide", "+3"],
  [100, "Fm", "Fermium", 14, 9, "actinide", "+3"],
  [101, "Md", "Mendelevium", 15, 9, "actinide", "+2, +3"],
  [102, "No", "Nobelium", 16, 9, "actinide", "+2, +3"],
  [103, "Lr", "Lawrencium", 17, 9, "actinide", "+3"],
];

export const PERIODIC_ELEMENTS: PeriodicElement[] = elementTuples.map(
  ([number, symbol, name, group, period, category, oxidationStates]) => ({
    number,
    symbol,
    name,
    group,
    period,
    category,
    oxidationStates,
  }),
);

interface PeriodicTableProps {
  includeElements: string[];
  excludeElements: string[];
  onElementClick: (symbol: string) => void;
}

export default function PeriodicTable({
  includeElements,
  excludeElements,
  onElementClick,
}: PeriodicTableProps) {
  const [focusedElement, setFocusedElement] = useState<PeriodicElement | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const mainElements = PERIODIC_ELEMENTS.filter(
    (element) => element.period <= 7,
  );
  const fBlock = PERIODIC_ELEMENTS.filter((element) => element.period >= 8);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesSearch = (element: PeriodicElement) =>
    !normalizedSearch ||
    element.name.toLowerCase().includes(normalizedSearch) ||
    element.symbol.toLowerCase().includes(normalizedSearch) ||
    String(element.number) === normalizedSearch;

  return (
    <div className="space-y-3">
      <div className="periodic-search-toolbar">
        <Search size={16} aria-hidden="true" />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search element, symbol, or atomic number"
          aria-label="Search periodic table"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label="Clear periodic table search"
          >
            <X size={15} />
          </button>
        )}
      </div>
      <div
        className="periodic-table-legend"
        aria-label="Periodic table categories"
      >
        {[
          ["alkali", "Alkali"],
          ["transition", "Transition"],
          ["nonmetal", "Nonmetal"],
          ["halogen", "Halogen"],
          ["noble", "Noble gas"],
          ["lanthanide", "Lanthanide"],
          ["actinide", "Actinide"],
        ].map(([category, label]) => (
          <span key={category}>
            <i
              className={`periodic-legend-swatch periodic-category-${category}`}
            />
            {label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto pb-2">
        <div
          className="periodic-table-grid"
          role="grid"
          aria-label="Periodic table of chemical elements"
        >
          {mainElements.map((element) => {
            const selected = includeElements.includes(element.symbol)
              ? "include"
              : excludeElements.includes(element.symbol)
                ? "exclude"
                : "none";
            return (
              <ElementButton
                key={element.number}
                element={element}
                selected={selected}
                onClick={() => {
                  setFocusedElement(element);
                  onElementClick(element.symbol);
                }}
                dimmed={!matchesSearch(element)}
              />
            );
          })}
          <div
            className="periodic-table-f-label"
            style={{ gridColumn: 1, gridRow: 8 }}
          >
            Lanthanides
          </div>
          <div
            className="periodic-table-f-label"
            style={{ gridColumn: 1, gridRow: 9 }}
          >
            Actinides
          </div>
          {fBlock.map((element) => {
            const selected = includeElements.includes(element.symbol)
              ? "include"
              : excludeElements.includes(element.symbol)
                ? "exclude"
                : "none";
            return (
              <ElementButton
                key={element.number}
                element={element}
                selected={selected}
                onClick={() => {
                  setFocusedElement(element);
                  onElementClick(element.symbol);
                }}
                dimmed={!matchesSearch(element)}
              />
            );
          })}
        </div>
      </div>
      <div
        className="min-h-12 rounded-xl bg-[#FDFBD4] px-4 py-3 text-xs text-[#38240D]"
        aria-live="polite"
      >
        {focusedElement ? (
          <>
            <strong>{focusedElement.name}</strong> ({focusedElement.symbol}) ·
            Atomic number {focusedElement.number}
            {focusedElement.oxidationStates
              ? ` · Oxidation states ${focusedElement.oxidationStates}`
              : ""}
          </>
        ) : (
          "Select an element to inspect its identity and add it to the query."
        )}
      </div>
    </div>
  );
}

function ElementButton({
  element,
  selected,
  onClick,
  dimmed,
}: {
  element: PeriodicElement;
  selected: ElementSelection;
  onClick: () => void;
  dimmed: boolean;
}) {
  return (
    <button
      type="button"
      role="gridcell"
      aria-label={`${element.name}, ${element.symbol}, atomic number ${element.number}`}
      title={`${element.name} · ${element.symbol} · Atomic number ${element.number}`}
      onClick={onClick}
      style={{ gridColumn: element.group, gridRow: element.period }}
      className={`periodic-element periodic-category-${element.category} periodic-element-${selected} ${dimmed ? "periodic-element-dimmed" : ""}`}
    >
      <span className="periodic-element-number">{element.number}</span>
      <span className="periodic-element-symbol">{element.symbol}</span>
    </button>
  );
}
