import { useState } from "react";
import { SlidersHorizontal, Search, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import PeriodicTable from "../../components/PeriodicTable";

// Periodic Table Element Definition
interface ElementItem {
  number: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: string;
  oxidationStates?: string;
}

const periodicElements: ElementItem[] = [
  {
    number: 1,
    symbol: "H",
    name: "Hydrogen",
    group: 1,
    period: 1,
    category: "nonmetal",
    oxidationStates: "+1, -1",
  },
  {
    number: 2,
    symbol: "He",
    name: "Helium",
    group: 18,
    period: 1,
    category: "noble",
  },
  {
    number: 3,
    symbol: "Li",
    name: "Lithium",
    group: 1,
    period: 2,
    category: "alkali",
  },
  {
    number: 4,
    symbol: "Be",
    name: "Beryllium",
    group: 2,
    period: 2,
    category: "alkaline",
  },
  {
    number: 5,
    symbol: "B",
    name: "Boron",
    group: 13,
    period: 2,
    category: "metalloid",
  },
  {
    number: 6,
    symbol: "C",
    name: "Carbon",
    group: 14,
    period: 2,
    category: "nonmetal",
  },
  {
    number: 7,
    symbol: "N",
    name: "Nitrogen",
    group: 15,
    period: 2,
    category: "nonmetal",
  },
  {
    number: 8,
    symbol: "O",
    name: "Oxygen",
    group: 16,
    period: 2,
    category: "nonmetal",
  },
  {
    number: 9,
    symbol: "F",
    name: "Fluorine",
    group: 17,
    period: 2,
    category: "halogen",
  },
  {
    number: 10,
    symbol: "Ne",
    name: "Neon",
    group: 18,
    period: 2,
    category: "noble",
  },
  {
    number: 11,
    symbol: "Na",
    name: "Sodium",
    group: 1,
    period: 3,
    category: "alkali",
  },
  {
    number: 12,
    symbol: "Mg",
    name: "Magnesium",
    group: 2,
    period: 3,
    category: "alkaline",
  },
  {
    number: 13,
    symbol: "Al",
    name: "Aluminium",
    group: 13,
    period: 3,
    category: "post-transition",
  },
  {
    number: 14,
    symbol: "Si",
    name: "Silicon",
    group: 14,
    period: 3,
    category: "metalloid",
  },
  {
    number: 15,
    symbol: "P",
    name: "Phosphorus",
    group: 15,
    period: 3,
    category: "nonmetal",
  },
  {
    number: 16,
    symbol: "S",
    name: "Sulfur",
    group: 16,
    period: 3,
    category: "nonmetal",
  },
  {
    number: 17,
    symbol: "Cl",
    name: "Chlorine",
    group: 17,
    period: 3,
    category: "halogen",
  },
  {
    number: 18,
    symbol: "Ar",
    name: "Argon",
    group: 18,
    period: 3,
    category: "noble",
  },
  {
    number: 19,
    symbol: "K",
    name: "Potassium",
    group: 1,
    period: 4,
    category: "alkali",
  },
  {
    number: 20,
    symbol: "Ca",
    name: "Calcium",
    group: 2,
    period: 4,
    category: "alkaline",
  },
  {
    number: 21,
    symbol: "Sc",
    name: "Scandium",
    group: 3,
    period: 4,
    category: "transition",
  },
  {
    number: 22,
    symbol: "Ti",
    name: "Titanium",
    group: 4,
    period: 4,
    category: "transition",
  },
  {
    number: 23,
    symbol: "V",
    name: "Vanadium",
    group: 5,
    period: 4,
    category: "transition",
  },
  {
    number: 24,
    symbol: "Cr",
    name: "Chromium",
    group: 6,
    period: 4,
    category: "transition",
  },
  {
    number: 25,
    symbol: "Mn",
    name: "Manganese",
    group: 7,
    period: 4,
    category: "transition",
  },
  {
    number: 26,
    symbol: "Fe",
    name: "Iron",
    group: 8,
    period: 4,
    category: "transition",
  },
  {
    number: 27,
    symbol: "Co",
    name: "Cobalt",
    group: 9,
    period: 4,
    category: "transition",
  },
  {
    number: 28,
    symbol: "Ni",
    name: "Nickel",
    group: 10,
    period: 4,
    category: "transition",
  },
  {
    number: 29,
    symbol: "Cu",
    name: "Copper",
    group: 11,
    period: 4,
    category: "transition",
  },
  {
    number: 30,
    symbol: "Zn",
    name: "Zinc",
    group: 12,
    period: 4,
    category: "transition",
  },
  {
    number: 31,
    symbol: "Ga",
    name: "Gallium",
    group: 13,
    period: 4,
    category: "post-transition",
  },
  {
    number: 32,
    symbol: "Ge",
    name: "Germanium",
    group: 14,
    period: 4,
    category: "metalloid",
  },
  {
    number: 33,
    symbol: "As",
    name: "Arsenic",
    group: 15,
    period: 4,
    category: "metalloid",
  },
  {
    number: 34,
    symbol: "Se",
    name: "Selenium",
    group: 16,
    period: 4,
    category: "nonmetal",
  },
  {
    number: 35,
    symbol: "Br",
    name: "Bromine",
    group: 17,
    period: 4,
    category: "halogen",
  },
  {
    number: 36,
    symbol: "Kr",
    name: "Krypton",
    group: 18,
    period: 4,
    category: "noble",
  },
  {
    number: 37,
    symbol: "Rb",
    name: "Rubidium",
    group: 1,
    period: 5,
    category: "alkali",
  },
  {
    number: 38,
    symbol: "Sr",
    name: "Strontium",
    group: 2,
    period: 5,
    category: "alkaline",
  },
  {
    number: 39,
    symbol: "Y",
    name: "Yttrium",
    group: 3,
    period: 5,
    category: "transition",
  },
  {
    number: 40,
    symbol: "Zr",
    name: "Zirconium",
    group: 4,
    period: 5,
    category: "transition",
  },
  {
    number: 41,
    symbol: "Nb",
    name: "Niobium",
    group: 5,
    period: 5,
    category: "transition",
  },
  {
    number: 42,
    symbol: "Mo",
    name: "Molybdenum",
    group: 6,
    period: 5,
    category: "transition",
  },
  {
    number: 43,
    symbol: "Tc",
    name: "Technetium",
    group: 7,
    period: 5,
    category: "transition",
  },
  {
    number: 44,
    symbol: "Ru",
    name: "Ruthenium",
    group: 8,
    period: 5,
    category: "transition",
  },
  {
    number: 45,
    symbol: "Rh",
    name: "Rhodium",
    group: 9,
    period: 5,
    category: "transition",
  },
  {
    number: 46,
    symbol: "Pd",
    name: "Palladium",
    group: 10,
    period: 5,
    category: "transition",
  },
  {
    number: 47,
    symbol: "Ag",
    name: "Silver",
    group: 11,
    period: 5,
    category: "transition",
  },
  {
    number: 48,
    symbol: "Cd",
    name: "Cadmium",
    group: 12,
    period: 5,
    category: "transition",
  },
  {
    number: 49,
    symbol: "In",
    name: "Indium",
    group: 13,
    period: 5,
    category: "post-transition",
  },
  {
    number: 50,
    symbol: "Sn",
    name: "Tin",
    group: 14,
    period: 5,
    category: "post-transition",
  },
  {
    number: 51,
    symbol: "Sb",
    name: "Antimony",
    group: 15,
    period: 5,
    category: "metalloid",
  },
  {
    number: 52,
    symbol: "Te",
    name: "Tellurium",
    group: 16,
    period: 5,
    category: "metalloid",
  },
  {
    number: 53,
    symbol: "I",
    name: "Iodine",
    group: 17,
    period: 5,
    category: "halogen",
  },
  {
    number: 54,
    symbol: "Xe",
    name: "Xenon",
    group: 18,
    period: 5,
    category: "noble",
  },
  {
    number: 55,
    symbol: "Cs",
    name: "Caesium",
    group: 1,
    period: 6,
    category: "alkali",
  },
  {
    number: 56,
    symbol: "Ba",
    name: "Barium",
    group: 2,
    period: 6,
    category: "alkaline",
  },
  {
    number: 57,
    symbol: "La",
    name: "Lanthanum",
    group: 3,
    period: 6,
    category: "lanthanide",
  },
  {
    number: 72,
    symbol: "Hf",
    name: "Hafnium",
    group: 4,
    period: 6,
    category: "transition",
  },
  {
    number: 73,
    symbol: "Ta",
    name: "Tantalum",
    group: 5,
    period: 6,
    category: "transition",
  },
  {
    number: 74,
    symbol: "W",
    name: "Tungsten",
    group: 6,
    period: 6,
    category: "transition",
  },
  {
    number: 75,
    symbol: "Re",
    name: "Rhenium",
    group: 7,
    period: 6,
    category: "transition",
  },
  {
    number: 76,
    symbol: "Os",
    name: "Osmium",
    group: 8,
    period: 6,
    category: "transition",
  },
  {
    number: 77,
    symbol: "Ir",
    name: "Iridium",
    group: 9,
    period: 6,
    category: "transition",
  },
  {
    number: 78,
    symbol: "Pt",
    name: "Platinum",
    group: 10,
    period: 6,
    category: "transition",
  },
  {
    number: 79,
    symbol: "Au",
    name: "Gold",
    group: 11,
    period: 6,
    category: "transition",
  },
  {
    number: 80,
    symbol: "Hg",
    name: "Mercury",
    group: 12,
    period: 6,
    category: "transition",
  },
  {
    number: 81,
    symbol: "Tl",
    name: "Thallium",
    group: 13,
    period: 6,
    category: "post-transition",
  },
  {
    number: 82,
    symbol: "Pb",
    name: "Lead",
    group: 14,
    period: 6,
    category: "post-transition",
  },
  {
    number: 83,
    symbol: "Bi",
    name: "Bismuth",
    group: 15,
    period: 6,
    category: "post-transition",
  },
];

const remainingElements: ElementItem[] = [
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
].map(([number, symbol, name, group, period, category, oxidationStates]) => ({
  number: number as number,
  symbol: symbol as string,
  name: name as string,
  group: group as number,
  period: period as number,
  category: category as string,
  oxidationStates: oxidationStates as string,
}));

const allElements = [...periodicElements, ...remainingElements];

export default function AdvancedSearchPage() {
  const [includeElements, setIncludeElements] = useState<string[]>([]);
  const [excludeElements, setExcludeElements] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<
    "include" | "exclude" | "both"
  >("include");
  const [crystalSystem, setCrystalSystem] = useState("All");
  const [materialType, setMaterialType] = useState("Cathode");
  const [minBandGap, setMinBandGap] = useState("1.0");
  const [maxBandGap, setMaxBandGap] = useState("3.5");

  const handleElementClick = (symbol: string) => {
    if (selectionMode === "both") {
      if (includeElements.includes(symbol)) {
        setIncludeElements(
          includeElements.filter((element) => element !== symbol),
        );
        setExcludeElements([...excludeElements, symbol]);
      } else if (excludeElements.includes(symbol)) {
        setExcludeElements(
          excludeElements.filter((element) => element !== symbol),
        );
      } else {
        setIncludeElements([...includeElements, symbol]);
      }
      return;
    }
    if (selectionMode === "include") {
      if (includeElements.includes(symbol)) {
        setIncludeElements(includeElements.filter((e) => e !== symbol));
      } else {
        setExcludeElements(excludeElements.filter((e) => e !== symbol));
        setIncludeElements([...includeElements, symbol]);
      }
    } else {
      if (excludeElements.includes(symbol)) {
        setExcludeElements(excludeElements.filter((e) => e !== symbol));
      } else {
        setIncludeElements(includeElements.filter((e) => e !== symbol));
        setExcludeElements([...excludeElements, symbol]);
      }
    }
  };

  const removeChip = (symbol: string, type: "include" | "exclude") => {
    if (type === "include") {
      setIncludeElements(includeElements.filter((e) => e !== symbol));
    } else {
      setExcludeElements(excludeElements.filter((e) => e !== symbol));
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent font-headline mb-1">
          <SlidersHorizontal size={14} /> Multi-Criteria Search Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Advanced Periodic Search
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Filter crystallographic databases by stoichiometric composition, IUPAC
          element constraints, space group symmetries, and property thresholds.
        </p>
      </div>

      {/* Selected Elements Active Chips Row */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFE5DC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#1E2227]">
            Active Filter Constraints:
          </span>

          {includeElements.map((el) => (
            <span
              key={el}
              className="px-2.5 py-1 bg-accent-soft text-accent rounded-lg font-bold flex items-center gap-1 text-xs"
            >
              +{el}
              <X
                size={12}
                className="cursor-pointer hover:opacity-75"
                onClick={() => removeChip(el, "include")}
              />
            </span>
          ))}

          {excludeElements.map((el) => (
            <span
              key={el}
              className="px-2.5 py-1 bg-[#ECEFF1] text-[#374151] rounded-lg font-bold flex items-center gap-1 text-xs"
            >
              -{el}
              <X
                size={12}
                className="cursor-pointer hover:opacity-75"
                onClick={() => removeChip(el, "exclude")}
              />
            </span>
          ))}

          {includeElements.length === 0 && excludeElements.length === 0 && (
            <span className="text-xs text-[#8C929C] italic">
              No elements selected
            </span>
          )}
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8C929C]">Mode:</span>
          <button
            onClick={() => setSelectionMode("include")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectionMode === "include"
                ? "bg-accent text-white shadow-sm"
                : "bg-[#FAF4EE] text-[#5F6771]"
            }`}
          >
            + Include Element
          </button>
          <button
            onClick={() => setSelectionMode("both")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${selectionMode === "both" ? "bg-[#5B636E] text-white shadow-sm" : "bg-[#FAF4EE] text-[#5F6771]"}`}
          >
            Both
          </button>
          <button
            onClick={() => setSelectionMode("exclude")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectionMode === "exclude"
                ? "bg-[#374151] text-white shadow-sm"
                : "bg-[#FAF4EE] text-[#5F6771]"
            }`}
          >
            − Exclude Element
          </button>
        </div>
      </div>

      {/* Interactive Periodic Table Container */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4">
        <div className="flex justify-between items-center text-xs text-[#8C929C]">
          <span>Click any element to add to active query filter</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-accent rounded-full" />{" "}
              Included
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#374151] rounded-full" />{" "}
              Excluded
            </span>
          </span>
        </div>

        <PeriodicTable
          includeElements={includeElements}
          excludeElements={excludeElements}
          onElementClick={handleElementClick}
        />
      </div>

      {/* Multi-Criteria Filters & Query Trigger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3">
          <label className="block text-xs font-bold text-[#1E2227]">
            Crystal System
          </label>
          <select
            value={crystalSystem}
            onChange={(e) => setCrystalSystem(e.target.value)}
            className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none"
          >
            <option value="All">All Crystal Systems</option>
            <option value="Cubic">Cubic</option>
            <option value="Tetragonal">Tetragonal</option>
            <option value="Orthorhombic">Orthorhombic</option>
            <option value="Trigonal">Trigonal / Rhombohedral</option>
            <option value="Hexagonal">Hexagonal</option>
            <option value="Monoclinic">Monoclinic</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3">
          <label className="block text-xs font-bold text-[#1E2227]">
            Material Application
          </label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none"
          >
            <option value="Cathode">Cathode Material</option>
            <option value="Anode">Anode Material</option>
            <option value="Electrolyte">Solid Electrolyte</option>
            <option value="Oxide">Oxide</option>
            <option value="Sulfide">Sulfide</option>
            <option value="Phosphate">Phosphate</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3">
          <label className="block text-xs font-bold text-[#1E2227]">
            Band Gap Range (eV)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minBandGap}
              onChange={(e) => setMinBandGap(e.target.value)}
              placeholder="Min"
              className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs outline-none"
            />
            <input
              type="number"
              value={maxBandGap}
              onChange={(e) => setMaxBandGap(e.target.value)}
              placeholder="Max"
              className="w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => {
            setIncludeElements([]);
            setExcludeElements([]);
          }}
          className="px-5 py-2.5 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5"
        >
          <RotateCcw size={13} /> Reset Constraints
        </button>
        <Link
          to={`/materials-search?${includeElements.map((element) => `elements=${encodeURIComponent(element)}`).join("&")}${excludeElements.length && includeElements.length ? "&" : ""}${excludeElements.map((element) => `exclude_elements=${encodeURIComponent(element)}`).join("&")}`}
          className="px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-hover flex items-center gap-2 shadow-soft"
        >
          Query Databases <Search size={14} />
        </Link>
      </div>
    </div>
  );
}
