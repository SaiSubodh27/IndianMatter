import { useState } from "react";
import PeriodicTable from "../components/PeriodicTable";

interface Material {
  formula: string;
  crystalSystem: string;
  imageUrl: string;
  symmetryGroup: string;
  bandGap: string;
  formationEnergy: string;
}

const materials: Material[] = [
  {
    formula: "Li7La3Zr2O12",
    crystalSystem: "CUBIC",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmxsTzGYilufLvFdZuGfTyIHf4A52tLscUEJqMMC2aWZVks5pSUS5oOAGLGx7DCwtHPE7sykdgksyYSN1AvyMVpr_kyQwYHVEnwUh9f7O5-4FCip-Keo1ZxcHIRPYneE6tWDuGmHXuRr8aoH3j_4WLc8QZSf4d5rxgQcHcAk_ELL_2tfdTSGyqYx4pyEa8jr-SHjAoUfqvvUDiEivIifKp82dIviJD1Vk49IlzdGOlPt0jE5iInMl5rFczdxVBwIvkqNOIPXKvkcU",
    symmetryGroup: "Ia-3d",
    bandGap: "4.82 eV",
    formationEnergy: "-3.12 eV/atom",
  },
  {
    formula: "CsPbI3",
    crystalSystem: "ORTHO",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBELT8GpyWUgh6xr6_wyiC0jlyUzBOFH04wurT4QqQhC-wFZrLnMtfP1UfEHUrmCLvzraTlTxqP996ETFLLGm0yOGiVrTVcdpuSsjRUEIRzQm2pJ2q0NiiHFlhK7HnCm33DUsPDgauNyhYswbCte0AAEWLdYur9pYmwam5cuY76Sa3nFB6wqST5jJCEMeJWKZcxO1XTPnYC1FZrE1eS-_uXJWIhd9tuc0OCnH4GiaTS13FFBPeoG5NrDxezWuk8SRcGrtz-D1kUiA0",
    symmetryGroup: "Pnma",
    bandGap: "1.73 eV",
    formationEnergy: "-1.45 eV/atom",
  },
  {
    formula: "MoS2",
    crystalSystem: "HEX",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgAPfPh1LivdB_tWmf6kMFJIVV-pHDrCyEWndqtzRn3-xCCwcSX-tU8n80B_LjYWRcjK0OHxsHLz60G3lgaSN2EMQm0edcF0kdTwH31sDWiYzl38YdDEynccI4l432EYrko8cAFDMgzcvMDwQSBYJ_sJf4ZFgL8GL8UU31gzxE9j8o_7VlxM4FGCt4KBJKCXZmn1Am9yxZHOqbxudvyrmV5zTBEp1MODcNads4yhhxTDj7-O6ngMUBl2wW_CsCUYx6MuxUs6eh588",
    symmetryGroup: "P6_3/mmc",
    bandGap: "1.80 eV",
    formationEnergy: "-0.92 eV/atom",
  },
  {
    formula: "BaTiO3",
    crystalSystem: "TETRA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0vBS8M2NbNy8elvFWc94HqoSPJjRGI4z03mQsoxY1hVsCcEkLOaBihbE7wNSnC_iaFwU1RBFiCY3ZYfF27JJY9H89rJvdQXKJUE0bcaHfFZ8hDknfpaPBStbVwE9crSZ4_-l_r6WfVLBDUY1kPKAlan-O-En1Od6HKpID4viMtXxztmVle3raQni58YB_rGdqU032174yOCHi0ls22q--Gg1paMjs5qxT2FOIe9EiwyPiTFz6xq2m-bOj77fiU04xKShBOc-gByo",
    symmetryGroup: "P4mm",
    bandGap: "3.20 eV",
    formationEnergy: "-3.48 eV/atom",
  },
];

// ---------------------------------------------------------------------------
// Property schema: everything a category can expose. "range" properties get
// a dual min/max input + slider; "categorical" properties get chip toggles.
// Every checked property (either type) also gets a free-text notes area.
// ---------------------------------------------------------------------------

type RangeProperty = {
  id: string;
  label: string;
  type: "range";
  unit?: string;
  min: number;
  max: number;
  step: number;
};

type CategoricalProperty = {
  id: string;
  label: string;
  type: "categorical";
  options: string[];
};

type Property = RangeProperty | CategoricalProperty;

interface PropertyCategory {
  id: string;
  label: string;
  icon: string;
  properties: Property[];
}

const propertyCategories: PropertyCategory[] = [
  {
    id: "structural",
    label: "Structural",
    icon: "category",
    properties: [
      {
        id: "crystal-system",
        label: "Crystal System",
        type: "categorical",
        options: ["Cubic", "Hexagonal", "Tetragonal", "Orthorhombic"],
      },
      {
        id: "symmetry-group",
        label: "Symmetry Group",
        type: "categorical",
        options: ["Fm-3m", "Pm-3m", "Ia-3d", "P6_3/mmc", "Pnma"],
      },
      {
        id: "lattice-parameters",
        label: "Lattice Parameters",
        type: "categorical",
        options: ["a = b = c", "a = b ≠ c", "a ≠ b ≠ c", "α = β = γ = 90°"],
      },
    ],
  },
  {
    id: "electronic",
    label: "Electronic",
    icon: "electrical_services",
    properties: [
      {
        id: "band-gap",
        label: "Band Gap",
        type: "range",
        unit: "eV",
        min: 0,
        max: 5.2,
        step: 0.1,
      },
      {
        id: "dos",
        label: "Density of States",
        type: "range",
        unit: "DOS",
        min: 0,
        max: 10,
        step: 0.5,
      },
      {
        id: "conductor-type",
        label: "Conductor Type",
        type: "categorical",
        options: ["Metal", "Semiconductor", "Insulator"],
      },
    ],
  },
  {
    id: "thermal",
    label: "Thermal",
    icon: "local_fire_department",
    properties: [
      {
        id: "formation-energy",
        label: "Formation Energy",
        type: "range",
        unit: "eV/atom",
        min: -4.0,
        max: 0,
        step: 0.1,
      },
      {
        id: "phase-transition-temp",
        label: "Phase Transition Temp",
        type: "range",
        unit: "K",
        min: 0,
        max: 2000,
        step: 10,
      },
      {
        id: "thermal-expansion",
        label: "Thermal Expansion",
        type: "range",
        unit: "10^-6/K",
        min: 0,
        max: 50,
        step: 1,
      },
    ],
  },
  {
    id: "ionic",
    label: "Ionic / Electrochemical",
    icon: "battery_charging_full",
    properties: [
      {
        id: "ionic-conductivity",
        label: "Ionic Conductivity",
        type: "range",
        unit: "S/cm",
        min: 0.0001,
        max: 0.1,
        step: 0.0001,
      },
      {
        id: "activation-energy",
        label: "Activation Energy",
        type: "range",
        unit: "eV",
        min: 0,
        max: 1.0,
        step: 0.01,
      },
      {
        id: "hes-score",
        label: "HES Score",
        type: "range",
        min: 0.5,
        max: 1.0,
        step: 0.05,
      },
    ],
  },
  {
    id: "mechanical",
    label: "Mechanical",
    icon: "build",
    properties: [
      {
        id: "bulk-modulus",
        label: "Bulk Modulus",
        type: "range",
        unit: "GPa",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        id: "shear-modulus",
        label: "Shear Modulus",
        type: "range",
        unit: "GPa",
        min: 0,
        max: 100,
        step: 1,
      },
      {
        id: "elastic-anisotropy",
        label: "Elastic Tensor Anisotropy",
        type: "range",
        min: 0,
        max: 10,
        step: 0.1,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Range dual-input + slider, used inside an expanded, checked property row.
// ---------------------------------------------------------------------------

const RangeInput = ({ prop }: { prop: RangeProperty }) => {
  const [lo, setLo] = useState(prop.min);
  const [hi, setHi] = useState(prop.max);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="number"
          value={lo}
          step={prop.step}
          onChange={(e) => setLo(Number(e.target.value))}
          className="w-full rounded-sm border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs text-orange-600 focus:border-orange-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-orange-400"
        />
        <span className="text-xs text-gray-400 dark:text-neutral-500">to</span>
        <input
          type="number"
          value={hi}
          step={prop.step}
          onChange={(e) => setHi(Number(e.target.value))}
          className="w-full rounded-sm border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs text-orange-600 focus:border-orange-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-orange-400"
        />
      </div>
      <input
        type="range"
        min={prop.min}
        max={prop.max}
        step={prop.step}
        value={hi}
        onChange={(e) => setHi(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-sm bg-gray-200 accent-orange-500 dark:bg-neutral-800"
      />
      <div className="mt-1 flex justify-between text-[10px] text-gray-400 dark:text-neutral-500">
        <span>
          {prop.min}
          {prop.unit ? ` ${prop.unit}` : ""}
        </span>
        <span>
          {prop.max}
          {prop.unit ? ` ${prop.unit}` : ""}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// A single property row: checkbox to enable, expands into notes + control.
// ---------------------------------------------------------------------------

const PropertyRow = ({ prop }: { prop: Property }) => {
  const [checked, setChecked] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 transition-colors ${
        checked
          ? "border-gray-300 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900"
          : "border-transparent"
      }`}
    >
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative h-4 w-4 shrink-0">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <div className="h-4 w-4 rounded-sm border border-gray-300 bg-white transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 dark:border-neutral-700 dark:bg-neutral-950 dark:peer-checked:border-neutral-100 dark:peer-checked:bg-neutral-100"></div>
          <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-[12px] font-bold text-white opacity-0 peer-checked:opacity-100 dark:text-gray-900">
            check
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
          {prop.label}
        </span>
        {prop.type === "range" && prop.unit && (
          <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-neutral-600">
            {prop.unit}
          </span>
        )}
      </label>

      {checked && (
        <div className="mt-3 space-y-3 pl-7">
          {prop.type === "range" ? (
            <RangeInput prop={prop} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {prop.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleOption(opt)}
                  className={`rounded-sm border px-2 py-1 text-xs font-medium transition-colors ${
                    selectedOptions.includes(opt)
                      ? "border-gray-900 bg-gray-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-gray-900"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note or target value for this property (optional)"
            rows={2}
            className="w-full resize-none rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:placeholder:text-neutral-600"
          />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Accordion category: header with icon, label, selected count, and a chevron
// that expands/collapses the property list.
// ---------------------------------------------------------------------------

const PropertyAccordion = ({ category }: { category: PropertyCategory }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-700 dark:text-neutral-300">
            {category.icon}
          </span>
          <div>
            <h3 className="font-headline text-base font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              {category.label}
            </h3>
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              {category.properties.length} propert
              {category.properties.length === 1 ? "y" : "ies"} available
            </p>
          </div>
        </div>
        <span
          className={`material-symbols-outlined text-gray-500 transition-transform duration-300 dark:text-neutral-400 ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="space-y-1.5 border-t border-gray-200 px-4 py-4 dark:border-neutral-800">
          {category.properties.map((prop) => (
            <PropertyRow key={prop.id} prop={prop} />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type Step = "composition" | "properties" | "results";

export default function Explorer() {
  const [step, setStep] = useState<Step>("composition");
  const [includeElements, setIncludeElements] = useState<string[]>([]);
  const [excludeElements, setExcludeElements] = useState<string[]>([]);

  const compositionString = includeElements.join("-");
  const hasComposition = includeElements.length > 0;

  const steps: { id: Step; label: string }[] = [
    { id: "composition", label: "Composition" },
    { id: "properties", label: "Properties" },
    { id: "results", label: "Results" },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="enterprise-page relative flex w-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-gray-200/70 blur-[150px] dark:bg-neutral-800/40"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gray-300/40 blur-[120px] dark:bg-neutral-700/30"></div>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 overflow-y-auto p-8 lg:p-12">
        <header className="mb-10">
          <h1 className="font-headline mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100 lg:text-5xl">
            Materials{" "}
            <span className="text-gray-500 dark:text-neutral-400">
              Explorer
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600 dark:text-neutral-400">
            Querying high-fidelity global databases (Materials Project, AFLOW,
            OQMD) using our advanced ML surrogate models.
          </p>
        </header>

        {/* Step indicator */}
        <div className="mb-10 flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i <= stepIndex
                      ? "bg-gray-900 text-white dark:bg-neutral-100 dark:text-gray-900"
                      : "border border-gray-300 text-gray-400 dark:border-neutral-700 dark:text-neutral-600"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    i <= stepIndex
                      ? "text-gray-900 dark:text-neutral-100"
                      : "text-gray-400 dark:text-neutral-600"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i < stepIndex
                      ? "bg-gray-900 dark:bg-neutral-100"
                      : "bg-gray-200 dark:bg-neutral-800"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Composition */}
        {step === "composition" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PeriodicTable
              onSelectionChange={({ include, exclude }) => {
                setIncludeElements(include);
                setExcludeElements(exclude);
              }}
            />
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Selected composition
                </p>
                <p className="font-mono text-lg font-bold text-gray-900 dark:text-neutral-100">
                  {compositionString || "No elements selected yet"}
                </p>
              </div>
              <button
                type="button"
                disabled={!hasComposition}
                onClick={() => setStep("properties")}
                className="enterprise-button-primary flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
              >
                Proceed to Properties
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Properties */}
        {step === "properties" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("composition")}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Back to composition
              </button>
              <span className="font-mono text-sm font-bold text-gray-700 dark:text-neutral-300">
                {compositionString}
              </span>
            </div>

            <p className="mb-6 text-sm text-gray-500 dark:text-neutral-400">
              Expand a category, tick the properties you care about, then set a
              target range or note for each.
            </p>

            <div className="space-y-3">
              {propertyCategories.map((cat) => (
                <PropertyAccordion key={cat.id} category={cat} />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep("results")}
                className="enterprise-button-primary flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm">
                  search
                </span>
                Search Materials
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Results */}
        {step === "results" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
                  <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-neutral-300">
                    database
                  </span>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    Indexed structures matching {compositionString}
                  </p>
                  <p className="font-mono text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
                    142,854
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep("properties")}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                Refine properties
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 2xl:grid-cols-3">
              {materials.map((material, idx) => (
                <div
                  key={idx}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-gray-200/80 opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-100 dark:bg-neutral-800/60"></div>

                  <div className="relative z-10 mb-6 flex items-start justify-between">
                    <h3 className="font-headline text-3xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-gray-600 dark:text-neutral-100 dark:group-hover:text-neutral-300">
                      {material.formula}
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {material.crystalSystem}
                    </div>
                  </div>

                  <div className="relative z-10 mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 transition-colors group-hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <img
                      alt={`3D rendering of ${material.formula}`}
                      className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                      src={material.imageUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-neutral-950/80"></div>
                  </div>

                  <div className="relative z-10 mt-auto space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-sm transition-colors group-hover:border-gray-300 dark:border-neutral-800">
                      <span className="font-medium text-gray-500 dark:text-neutral-400">
                        Symmetry Group
                      </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-neutral-100">
                        {material.symmetryGroup}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-sm transition-colors group-hover:border-gray-300 dark:border-neutral-800">
                      <span className="font-medium text-gray-500 dark:text-neutral-400">
                        Band Gap
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-mono font-bold text-gray-900 dark:bg-neutral-800 dark:text-neutral-100">
                        {material.bandGap}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-500 dark:text-neutral-400">
                        Formation Energy
                      </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-neutral-100">
                        {material.formationEnergy}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <button className="group flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/50 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400">
                Load More Results
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-y-0.5">
                  expand_more
                </span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
