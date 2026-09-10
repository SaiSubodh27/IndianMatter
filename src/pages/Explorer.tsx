import { useMemo, useRef, useState, useEffect } from "react";
import PeriodicTable from "../components/PeriodicTable";
import { searchDatasetMaterials, MaterialRecord } from "../lib/datasetapi";
import StructureViewer, {
  type ViewerControls,
  type ViewerStyle,
} from "../components/StructureViewer";

interface ExploreMaterialRow {
  material_id: string;
  formula: string;
  space_group: string;
  crystal_system: string;
  band_gap: number;
  formation_energy: number;
  density: number;
  is_stable: boolean;
  // IndianMatter-only fields (undefined for the other 4 sources)
  nsites?: number;
  e_hull?: number;
  m3gnet_energy?: number;
  bulk_modulus?: number;
  shear_modulus?: number;
  metal_prob?: number;
  num_elements?: number;
  volume?: number;
  lattice_a?: number;
  lattice_b?: number;
  lattice_c?: number;
  alpha?: number;
  beta?: number;
  gamma?: number;
}

type RangeProperty = {
  id: string;
  label: string;
  type: "range";
  unit?: string;
  min: number;
  max: number;
  step: number;
  /** true if this property is actually wired to a live backend filter.
   *  Properties without this flag are shown for reference/selection but
   *  don't yet affect the search results — see README note in Explorer(). */
  wired?: boolean;
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

type Step = "composition" | "properties" | "results";
type StabilityFilter = "all" | "stable" | "unstable";
type DataSource =
  | "materials_project"
  | "oqmd"
  | "aflow"
  | "jarvis"
  | "indianmatter";

const sourceEndpoints: Record<DataSource, string> = {
  materials_project: "http://localhost:8000/api/materials/explore",
  oqmd: "http://localhost:8000/api/oqmd/explore",
  aflow: "http://localhost:8000/api/aflow/explore",
  jarvis: "http://localhost:8000/api/jarvis/explore",
  indianmatter: "http://localhost:8000/api/indianmatter/explore",
};

const structureEndpoints: Record<DataSource, (id: string) => string> = {
  materials_project: (id) =>
    `http://localhost:8000/api/materials/structure/${id}`,
  oqmd: (id) =>
    `http://localhost:8000/api/oqmd/structure/${id.replace(/^oqmd-/, "")}`,
  aflow: (id) =>
    `http://localhost:8000/api/aflow/structure/${id.replace(/^aflow-/, "")}`,
  jarvis: (id) =>
    `http://localhost:8000/api/jarvis/structure/${id.replace(/^jarvis-/, "")}`,
  // mv_id is used as-is, matching the CIF filenames in 38510_CIFs/
  indianmatter: (id) =>
    `http://localhost:8000/api/indianmatter/structure/${id}`,
};

const csvDownloadEndpoints: Record<DataSource, string> = {
  materials_project: "http://localhost:8000/api/materials/download/csv",
  oqmd: "http://localhost:8000/api/oqmd/download/csv",
  aflow: "http://localhost:8000/api/aflow/download/csv",
  jarvis: "http://localhost:8000/api/jarvis/download/csv",
  indianmatter: "http://localhost:8000/api/indianmatter/download/csv",
};

const cifDownloadEndpoints: Record<DataSource, (id: string) => string> = {
  materials_project: (id) =>
    `http://localhost:8000/api/materials/download/cif/${id}`,
  oqmd: (id) =>
    `http://localhost:8000/api/oqmd/download/cif/${id.replace(/^oqmd-/, "")}`,
  aflow: (id) =>
    `http://localhost:8000/api/aflow/download/cif/${id.replace(/^aflow-/, "")}`,
  jarvis: (id) =>
    `http://localhost:8000/api/jarvis/download/cif/${id.replace(/^jarvis-/, "")}`,
  indianmatter: (id) =>
    `http://localhost:8000/api/indianmatter/download/cif/${id}`,
};

const sourceLabels: Record<DataSource, string> = {
  materials_project: "Materials Project",
  oqmd: "OQMD",
  aflow: "AFLOW",
  jarvis: "JARVIS",
  indianmatter: "IndianMatter DB",
};

// Small distinct accent per source so a mixed results list stays scannable —
// deliberately different hues from the stable/unstable pill colors below so
// the two kinds of badges are never confused for each other.
const sourceBadgeStyles: Record<DataSource, string> = {
  materials_project:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50",
  oqmd: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/50",
  aflow:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50",
  jarvis:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  indianmatter:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",
};

// Only Materials Project's /structure endpoint returns an actual CIF string
// today — OQMD/AFLOW/JARVIS's equivalents return their own native payload
// shapes (sites+unit_cell, CONTCAR-style geometry, raw OPTIMADE resource)
// pending real CIF conversion on the backend (see the 501 stubs in those
// routers). Feeding non-CIF text into the 3D viewer would just render a
// confusing "0 atoms" error, so detect it up front and show a clear,
// source-specific message instead of pretending it's supported.
function looksLikeCif(text: string): boolean {
  return text.trim().toLowerCase().startsWith("data_");
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
        options: [
          "Cubic",
          "Hexagonal",
          "Tetragonal",
          "Orthorhombic",
          "Trigonal",
          "Monoclinic",
          "Triclinic",
        ],
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
      {
        id: "volume-per-atom",
        label: "Volume per Atom",
        type: "range",
        unit: "Å³/atom",
        min: 5,
        max: 100,
        step: 1,
      },
      {
        id: "num-atoms",
        label: "Number of Atoms",
        type: "range",
        unit: "atoms",
        min: 1,
        max: 200,
        step: 1,
      },
      {
        id: "num-sites",
        label: "Number of Sites",
        type: "range",
        unit: "sites",
        min: 1,
        max: 100,
        step: 1,
      },
      {
        id: "packing-fraction",
        label: "Packing Fraction",
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
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
        wired: true,
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
      {
        id: "gap-type",
        label: "Gap Type",
        type: "categorical",
        options: ["Direct", "Indirect"],
      },
      {
        id: "fermi-energy",
        label: "Fermi Energy",
        type: "range",
        unit: "eV",
        min: -10,
        max: 10,
        step: 0.1,
      },
      {
        id: "work-function",
        label: "Work Function",
        type: "range",
        unit: "eV",
        min: 2,
        max: 7,
        step: 0.1,
      },
      {
        id: "effective-mass",
        label: "Effective Mass",
        type: "range",
        unit: "mₑ",
        min: 0,
        max: 5,
        step: 0.05,
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
        min: -4,
        max: 0,
        step: 0.1,
        wired: true,
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
        unit: "10⁻⁶/K",
        min: 0,
        max: 50,
        step: 1,
      },
      {
        id: "debye-temperature",
        label: "Debye Temperature",
        type: "range",
        unit: "K",
        min: 0,
        max: 1200,
        step: 10,
      },
      {
        id: "specific-heat",
        label: "Specific Heat",
        type: "range",
        unit: "J/mol·K",
        min: 0,
        max: 200,
        step: 1,
      },
      {
        id: "melting-point",
        label: "Melting Point",
        type: "range",
        unit: "K",
        min: 200,
        max: 4000,
        step: 50,
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
      {
        id: "diffusion-barrier",
        label: "Li Diffusion Barrier",
        type: "range",
        unit: "eV",
        min: 0,
        max: 2,
        step: 0.05,
      },
      {
        id: "max-voltage",
        label: "Max Voltage",
        type: "range",
        unit: "V",
        min: 0,
        max: 6,
        step: 0.1,
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
      {
        id: "poisson-ratio",
        label: "Poisson's Ratio",
        type: "range",
        min: 0,
        max: 0.5,
        step: 0.01,
      },
      {
        id: "young-modulus",
        label: "Young's Modulus",
        type: "range",
        unit: "GPa",
        min: 0,
        max: 500,
        step: 5,
      },
      {
        id: "hardness",
        label: "Vickers Hardness",
        type: "range",
        unit: "GPa",
        min: 0,
        max: 50,
        step: 0.5,
      },
    ],
  },

  {
    id: "magnetic",
    label: "Magnetic",
    icon: "explore",
    properties: [
      {
        id: "total-magnetization",
        label: "Total Magnetization",
        type: "range",
        unit: "μB",
        min: 0,
        max: 10,
        step: 0.1,
      },
      {
        id: "magnetic-ordering",
        label: "Magnetic Ordering",
        type: "categorical",
        options: ["FM", "AFM", "NM", "FiM"],
      },
    ],
  },

  {
    id: "optical",
    label: "Optical",
    icon: "visibility",
    properties: [
      {
        id: "refractive-index",
        label: "Refractive Index",
        type: "range",
        min: 1,
        max: 4,
        step: 0.05,
      },
      {
        id: "dielectric-constant",
        label: "Dielectric Constant",
        type: "range",
        min: 1,
        max: 50,
        step: 0.5,
      },
      {
        id: "absorption-coefficient",
        label: "Absorption Coefficient",
        type: "range",
        unit: "cm⁻¹",
        min: 0,
        max: 100000,
        step: 1000,
      },
    ],
  },

  // ============================================================
  // IndianMatter Database Properties
  // ============================================================

  {
    id: "indianmatter",
    label: "IndianMatter DB",
    icon: "database",
    properties: [
      {
        id: "im-nsites",
        label: "Number of Sites",
        type: "range",
        unit: "sites",
        min: 2,
        max: 200,
        step: 1,
        wired: true,
      },
      {
        id: "im-e-hull",
        label: "Energy Above Hull",
        type: "range",
        unit: "eV/atom",
        min: -1.72,
        max: 0.03,
        step: 0.001,
        wired: true,
      },
      {
        id: "im-m3gnet-energy",
        label: "Final M3GNet Energy",
        type: "range",
        unit: "eV",
        min: -1320,
        max: -2.9,
        step: 1,
        wired: true,
      },
      {
        id: "im-formation-energy",
        label: "Formation Energy",
        type: "range",
        unit: "eV/atom",
        min: -4.31,
        max: 0.42,
        step: 0.01,
        wired: true,
      },
      {
        id: "im-band-gap",
        label: "Band Gap",
        type: "range",
        unit: "eV",
        min: -0.22,
        max: 9.18,
        step: 0.01,
        wired: true,
      },
      {
        id: "im-bulk-modulus",
        label: "Bulk Modulus",
        type: "range",
        unit: "GPa",
        min: 12,
        max: 234,
        step: 1,
        wired: true,
      },
      {
        id: "im-shear-modulus",
        label: "Shear Modulus",
        type: "range",
        unit: "GPa",
        min: 8,
        max: 128,
        step: 1,
        wired: true,
      },
      {
        id: "im-metal-prob",
        label: "Metal Probability",
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
        wired: true,
      },
      {
        id: "im-num-elements",
        label: "Number of Elements",
        type: "range",
        unit: "elements",
        min: 2,
        max: 8,
        step: 1,
        wired: true,
      },
      {
        id: "im-volume",
        label: "Volume",
        type: "range",
        unit: "Å³",
        min: 26,
        max: 3850,
        step: 5,
        wired: true,
      },
      {
        id: "im-density",
        label: "Density",
        type: "range",
        unit: "g/cm³",
        min: 0.9,
        max: 18.7,
        step: 0.1,
        wired: true,
      },
      {
        id: "im-lattice-a",
        label: "Lattice a",
        type: "range",
        unit: "Å",
        min: 2.5,
        max: 57.7,
        step: 0.5,
        wired: true,
      },
      {
        id: "im-lattice-b",
        label: "Lattice b",
        type: "range",
        unit: "Å",
        min: 2.6,
        max: 58.2,
        step: 0.5,
        wired: true,
      },
      {
        id: "im-lattice-c",
        label: "Lattice c",
        type: "range",
        unit: "Å",
        min: 2.6,
        max: 60,
        step: 0.5,
        wired: true,
      },
      {
        id: "im-alpha",
        label: "Lattice α",
        type: "range",
        unit: "°",
        min: 6.8,
        max: 178,
        step: 1,
        wired: true,
      },
      {
        id: "im-beta",
        label: "Lattice β",
        type: "range",
        unit: "°",
        min: 3,
        max: 175,
        step: 1,
        wired: true,
      },
      {
        id: "im-gamma",
        label: "Lattice γ",
        type: "range",
        unit: "°",
        min: 13,
        max: 171,
        step: 1,
        wired: true,
      },
    ],
  },
];

/** Lifted range-filter state shape, keyed by property id. Only entries
 *  for properties flagged `wired: true` above actually affect the
 *  backend query right now (band-gap, formation-energy). Everything
 *  else is captured here for future backend wiring but currently just
 *  informational. */
interface RangeFilterValue {
  checked: boolean;
  lo: number;
  hi: number;
}

const RangeInput = ({
  prop,
  value,
  onChange,
}: {
  prop: RangeProperty;
  value: RangeFilterValue;
  onChange: (next: RangeFilterValue) => void;
}) => {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="number"
          value={value.lo}
          step={prop.step}
          onChange={(e) => onChange({ ...value, lo: Number(e.target.value) })}
          className="w-full rounded-sm border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs text-orange-600 focus:border-orange-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-orange-400"
        />
        <span className="text-xs text-gray-400 dark:text-neutral-500">to</span>
        <input
          type="number"
          value={value.hi}
          step={prop.step}
          onChange={(e) => onChange({ ...value, hi: Number(e.target.value) })}
          className="w-full rounded-sm border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs text-orange-600 focus:border-orange-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-orange-400"
        />
      </div>
      <input
        type="range"
        min={prop.min}
        max={prop.max}
        step={prop.step}
        value={value.hi}
        onChange={(e) => onChange({ ...value, hi: Number(e.target.value) })}
        className="h-1 w-full cursor-pointer appearance-none rounded-sm bg-gray-200 accent-orange-500 dark:bg-neutral-800"
      />
    </div>
  );
};

const PropertyRow = ({
  prop,
  rangeValue,
  onRangeChange,
}: {
  prop: Property;
  rangeValue?: RangeFilterValue;
  onRangeChange?: (next: RangeFilterValue) => void;
}) => {
  const [notes, setNotes] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [localChecked, setLocalChecked] = useState(false);

  // Range properties use lifted state (passed from parent) so wired
  // properties can feed the actual search. Categorical properties stay
  // local since none are backend-wired yet.
  const checked =
    prop.type === "range" && rangeValue ? rangeValue.checked : localChecked;

  const setChecked = (next: boolean) => {
    if (prop.type === "range" && rangeValue && onRangeChange) {
      onRangeChange({ ...rangeValue, checked: next });
    } else {
      setLocalChecked(next);
    }
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
          <div className="h-4 w-4 rounded-sm border border-gray-300 bg-white transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 dark:border-neutral-700 dark:bg-neutral-950 dark:peer-checked:border-neutral-100 dark:peer-checked:bg-neutral-100" />
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
        {prop.type === "range" && prop.wired && (
          <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-orange-500">
            Live filter
          </span>
        )}
      </label>

      {checked && (
        <div className="mt-3 space-y-3 pl-7">
          {prop.type === "range" ? (
            rangeValue && onRangeChange ? (
              <RangeInput
                prop={prop}
                value={rangeValue}
                onChange={onRangeChange}
              />
            ) : null
          ) : (
            <div className="flex flex-wrap gap-2">
              {prop.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setSelectedOptions((prev) =>
                      prev.includes(opt)
                        ? prev.filter((o) => o !== opt)
                        : [...prev, opt],
                    )
                  }
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

          {prop.type === "range" && !prop.wired && (
            <p className="text-[10px] text-gray-400 dark:text-neutral-600">
              Not yet connected to a live filter for the selected data source —
              reserved for display/future backend support.
            </p>
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

const PropertyAccordion = ({
  category,
  rangeFilters,
  onRangeChange,
}: {
  category: PropertyCategory;
  rangeFilters: Record<string, RangeFilterValue>;
  onRangeChange: (id: string, next: RangeFilterValue) => void;
}) => {
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
            <PropertyRow
              key={prop.id}
              prop={prop}
              rangeValue={
                prop.type === "range" ? rangeFilters[prop.id] : undefined
              }
              onRangeChange={
                prop.type === "range"
                  ? (next) => onRangeChange(prop.id, next)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** Builds the initial lifted range-filter state for every range property
 *  across all categories, so RangeInput always has a defined value. */
function buildInitialRangeFilters(): Record<string, RangeFilterValue> {
  const initial: Record<string, RangeFilterValue> = {};
  propertyCategories.forEach((cat) => {
    cat.properties.forEach((prop) => {
      if (prop.type === "range") {
        initial[prop.id] = { checked: false, lo: prop.min, hi: prop.max };
      }
    });
  });
  return initial;
}

// Small reusable stability pill — same visual language as the Analyzed /
// Pending / Failed badges on the Structures page, so "stable" reads as a
// status at a glance rather than a plain boolean column.
const StabilityPill = ({ stable }: { stable: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
      stable
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        stable ? "bg-emerald-500" : "bg-rose-500"
      }`}
    />
    {stable ? "Stable" : "Unstable"}
  </span>
);

const SourceBadge = ({ source }: { source: DataSource }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${sourceBadgeStyles[source]}`}
  >
    {sourceLabels[source]}
  </span>
);

// Small stat block for the detail panel spec sheet — label above, value
// below, matching the visual language of the Dashboard's stat cards
// instead of a plain label/value form row.
const StatBlock = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-600">
      {label}
    </p>
    <div className="font-mono text-sm font-bold text-gray-900 dark:text-neutral-100">
      {children}
    </div>
  </div>
);

export default function Explorer() {
  const [step, setStep] = useState<Step>("composition");
  const [includeElements, setIncludeElements] = useState<string[]>([]);
  const [excludeElements, setExcludeElements] = useState<string[]>([]);
  const [materialsList, setMaterialsList] = useState<ExploreMaterialRow[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] =
    useState<ExploreMaterialRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [stabilityFilter, setStabilityFilter] =
    useState<StabilityFilter>("all");
  const [cifData, setCifData] = useState<string>("");
  const [structureLoading, setStructureLoading] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);
  const [showRawStructure, setShowRawStructure] = useState(false);
  const [viewerStyle, setViewerStyle] = useState<ViewerStyle>("sphere");
  const [unitCellOn, setUnitCellOn] = useState(true);
  const [dataSource, setDataSource] = useState<DataSource>("materials_project");
  const [rangeFilters, setRangeFilters] = useState<
    Record<string, RangeFilterValue>
  >(buildInitialRangeFilters());

  const controlsRef = useRef<ViewerControls | null>(null);

  const compositionString = includeElements.join("-");
  const hasComposition = includeElements.length > 0;

  const steps: { id: Step; label: string }[] = [
    { id: "composition", label: "Composition" },
    { id: "properties", label: "Properties" },
    { id: "results", label: "Results" },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  const handleRangeChange = (id: string, next: RangeFilterValue) => {
    setRangeFilters((prev) => ({ ...prev, [id]: next }));
  };

  /** Append a checked range filter to a URL using the backend query names. */
  /** Convert a property id (kebab-case, optionally im- prefixed) to a
   *  snake_case query parameter base name. e.g. "im-band-gap" → "band_gap". */
  function propertyIdToParamName(id: string): string {
    return id.replace(/^im-/, "").replace(/-/g, "_");
  }

  /** Append every checked `wired` range filter to the URL automatically.
   *  Works for both generic sources and IndianMatter DB. */
  const appendWiredRangeFilters = (url: URL) => {
    propertyCategories.forEach((cat) => {
      cat.properties.forEach((prop) => {
        if (prop.type === "range" && prop.wired) {
          const filter = rangeFilters[prop.id];
          if (filter?.checked) {
            const paramBase = propertyIdToParamName(prop.id);
            url.searchParams.append(`min_${paramBase}`, String(filter.lo));
            url.searchParams.append(`max_${paramBase}`, String(filter.hi));
          }
        }
      });
    });
  };

  const downloadCSV = () => {
    // Route through the backend's per-source CSV endpoint so exports stay
    // consistent with whatever filters actually produced this result set,
    // rather than re-serializing the in-memory rows client-side.
    const url = new URL(csvDownloadEndpoints[dataSource]);
    if (includeElements.length > 0)
      url.searchParams.append("elements", includeElements.join(","));
    if (excludeElements.length > 0)
      url.searchParams.append("exclude_elements", excludeElements.join(","));

    appendWiredRangeFilters(url);

    if (stabilityFilter !== "all") {
      url.searchParams.append(
        "is_stable",
        String(stabilityFilter === "stable"),
      );
    }

    url.searchParams.append("limit", "100");

    window.open(url.toString(), "_blank");
  };
  const exportCIF = () => {
    if (!selectedMaterialId) return;
    const url = cifDownloadEndpoints[dataSource](selectedMaterialId);
    window.open(url, "_blank");
  };

  const handleFilterSearch = async () => {
    setLoading(true);
    // Clear any previously selected material/structure from a prior
    // search so stale 3D data doesn't linger under a new result set.
    setSelectedMaterialId("");
    setSelectedMaterial(null);
    setCifData("");
    setStructureError(null);

    try {
      const baseUrl = new URL(sourceEndpoints[dataSource]);

      if (includeElements.length > 0) {
        baseUrl.searchParams.append("elements", includeElements.join(","));
      }
      if (excludeElements.length > 0) {
        baseUrl.searchParams.append(
          "exclude_elements",
          excludeElements.join(","),
        );
      }

      appendWiredRangeFilters(baseUrl);

      if (stabilityFilter !== "all") {
        baseUrl.searchParams.append(
          "is_stable",
          String(stabilityFilter === "stable"),
        );
      }

      const response = await fetch(baseUrl.toString());
      if (!response.ok) throw new Error("Database pipeline query failed.");

      const data: ExploreMaterialRow[] = await response.json();
      setMaterialsList(data);
      setStep("results");
    } catch (err) {
      console.error("Filtering execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (row: ExploreMaterialRow) => {
    setSelectedMaterialId(row.material_id);
    setSelectedMaterial(row);
    setCifData("");
    setStructureError(null);
    setShowRawStructure(false);
    setStructureLoading(true);
    try {
      const response = await fetch(
        structureEndpoints[dataSource](row.material_id),
      );
      if (!response.ok)
        throw new Error("Failed to download cell geometry file.");
      const data = await response.json();
      const text = data.cif_string || JSON.stringify(data, null, 2);
      setCifData(text);
      if (!data.cif_string) {
        setStructureError(
          `${sourceLabels[dataSource]} doesn't export a ready-to-view CIF yet — showing raw structure data instead.`,
        );
      }
    } catch (err) {
      console.error("Failed loading crystal structure mapping:", err);
      setStructureError("Couldn't load structure data for this material.");
      setCifData("");
    } finally {
      setStructureLoading(false);
    }
  };

  const selectedMaterialsText = useMemo(() => {
    return selectedMaterial
      ? selectedMaterial.formula
      : "Click a row to view structure";
  }, [selectedMaterial]);

  const cifIsRenderable = cifData.length > 0 && looksLikeCif(cifData);

  return (
    <div className="enterprise-page relative flex w-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-gray-200/70 blur-[150px] dark:bg-neutral-800/40" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gray-300/40 blur-[120px] dark:bg-neutral-700/30" />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-6 lg:p-10">
        <header className="mb-8">
          <h1 className="font-headline mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100 lg:text-5xl">
            Materials{" "}
            <span className="text-gray-500 dark:text-neutral-400">
              Explorer
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600 dark:text-neutral-400">
            Query materials across multiple databases, inspect rows, open the 3D
            structure, and export CSV or CIF.
          </p>
        </header>

        <div className="mb-8 flex items-center gap-3">
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
                />
              )}
            </div>
          ))}
        </div>

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

            {/* Data Source — standalone block, NOT nested inside the filters grid */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                Data Source
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(sourceEndpoints) as DataSource[]).map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setDataSource(src)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                      dataSource === src
                        ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
                    }`}
                  >
                    {sourceLabels[src]}
                  </button>
                ))}
              </div>
            </div>

            {/* Stability — button group instead of a plain <select> */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                Stability
              </p>
              <div className="flex gap-2">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "stable", label: "Stable only" },
                    { id: "unstable", label: "Unstable only" },
                  ] as { id: StabilityFilter; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStabilityFilter(opt.id)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                      stabilityFilter === opt.id
                        ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* All live range filters are driven from the accordions above.
                IndianMatter DB filters use the im-* properties and are mapped
                to their corresponding backend query parameters in
                appendIndianMatterFilters. */}

            <div className="space-y-3">
              {propertyCategories.map((cat) => (
                <PropertyAccordion
                  key={cat.id}
                  category={cat}
                  rangeFilters={rangeFilters}
                  onRangeChange={handleRangeChange}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleFilterSearch}
                disabled={loading}
                className="enterprise-button-primary flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">
                  search
                </span>
                {loading
                  ? "Searching..."
                  : `Search ${sourceLabels[dataSource]}`}
              </button>
            </div>
          </section>
        )}

        {step === "results" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <SourceBadge source={dataSource} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    Results for{" "}
                    <span className="font-mono">
                      {compositionString || "selected composition"}
                    </span>
                  </p>
                  <p className="font-mono text-xl font-bold text-gray-900 dark:text-neutral-100">
                    {materialsList.length} materials
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={downloadCSV}
                  disabled={!materialsList.length}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 transition-colors hover:border-gray-400 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                  CSV
                </button>
                <button
                  type="button"
                  onClick={exportCIF}
                  disabled={!selectedMaterialId}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 transition-colors hover:border-gray-400 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <span className="material-symbols-outlined text-sm">
                    file_download
                  </span>
                  CIF
                </button>
                <button
                  type="button"
                  onClick={() => setStep("properties")}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 transition-colors hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <span className="material-symbols-outlined text-sm">
                    tune
                  </span>
                  Refine
                </button>
              </div>
            </div>

            {materialsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
                <span className="material-symbols-outlined mb-3 text-4xl text-gray-300 dark:text-neutral-700">
                  search_off
                </span>
                <p className="text-sm font-semibold text-gray-600 dark:text-neutral-400">
                  No materials matched this query.
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-neutral-600">
                  Try widening a range filter or switching data sources.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-2">
                  <div className="max-h-[70vh] overflow-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="sticky top-0 bg-gray-50 text-left dark:bg-neutral-950">
                        <tr className="text-xs uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                          <th className="px-4 py-3">Formula</th>
                          <th className="px-4 py-3">Space Group</th>
                          <th className="px-4 py-3">Crystal System</th>
                          <th className="px-4 py-3 text-right">Band Gap</th>
                          <th className="px-4 py-3 text-right">
                            Formation Energy
                          </th>
                          <th className="px-4 py-3 text-right">Density</th>
                          <th className="px-4 py-3">Stability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialsList.map((m, idx) => {
                          const active = selectedMaterialId === m.material_id;
                          return (
                            <tr
                              key={`${m.material_id}-${idx}`}
                              onClick={() => handleRowClick(m)}
                              className={`cursor-pointer border-l-2 border-t border-gray-100 transition-colors dark:border-neutral-800 ${
                                active
                                  ? "border-l-orange-500 bg-orange-50/60 dark:bg-orange-950/20"
                                  : "border-l-transparent hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                              } ${
                                !active && idx % 2 === 1
                                  ? "bg-gray-50/40 dark:bg-neutral-950/30"
                                  : ""
                              }`}
                            >
                              <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-neutral-100">
                                {m.formula}
                              </td>
                              <td className="px-4 py-3 text-gray-700 dark:text-neutral-300">
                                {m.space_group}
                              </td>
                              <td className="px-4 py-3">
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-neutral-800 dark:text-neutral-400">
                                  {m.crystal_system}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-neutral-100">
                                {m.band_gap.toFixed(3)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-neutral-100">
                                {m.formation_energy.toFixed(3)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-neutral-100">
                                {m.density.toFixed(3)}
                              </td>
                              <td className="px-4 py-3">
                                <StabilityPill stable={m.is_stable} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  {selectedMaterial ? (
                    <div className="flex h-full flex-col">
                      <div className="border-b border-gray-200 p-5 dark:border-neutral-800">
                        <div className="mb-2 flex items-center gap-2">
                          <SourceBadge source={dataSource} />
                          {selectedMaterial && (
                            <StabilityPill
                              stable={selectedMaterial.is_stable}
                            />
                          )}
                        </div>
                        <h3 className="mb-1 text-3xl font-bold text-gray-900 dark:text-neutral-100">
                          {selectedMaterialsText}
                        </h3>
                        <p className="font-mono text-xs text-gray-400 dark:text-neutral-600">
                          {selectedMaterial.material_id}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-5">
                        <StatBlock label="Space Group">
                          {selectedMaterial.space_group}
                        </StatBlock>
                        <StatBlock label="Crystal System">
                          {selectedMaterial.crystal_system}
                        </StatBlock>
                        <StatBlock label="Band Gap (eV)">
                          {selectedMaterial.band_gap.toFixed(3)}
                        </StatBlock>
                        <StatBlock label="Formation Energy (eV/atom)">
                          {selectedMaterial.formation_energy.toFixed(3)}
                        </StatBlock>
                        <StatBlock label="Density (g/cm³)">
                          {selectedMaterial.density.toFixed(3)}
                        </StatBlock>
                      </div>

                      {/* 3D structure viewer */}
                      <div className="border-t border-gray-200 p-5 dark:border-neutral-800">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                            3D Structure
                          </p>
                          {cifIsRenderable && (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={viewerStyle}
                                onChange={(e) => {
                                  const style = e.target.value as ViewerStyle;
                                  setViewerStyle(style);
                                  controlsRef.current?.setStyle(style);
                                }}
                                className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                              >
                                <option value="sphere">Ball & Stick</option>
                                <option value="stick">Stick</option>
                                <option value="line">Wireframe</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => controlsRef.current?.resetView()}
                                title="Reset view"
                                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  center_focus_strong
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setUnitCellOn((v) => !v);
                                  controlsRef.current?.toggleUnitCell();
                                }}
                                title="Toggle unit cell"
                                className={`rounded p-1 ${
                                  unitCellOn
                                    ? "bg-gray-900 text-white dark:bg-neutral-100 dark:text-gray-900"
                                    : "text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                }`}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  grid_4x4
                                </span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="relative h-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-950">
                          {structureLoading ? (
                            <div className="flex h-full items-center justify-center">
                              <span className="material-symbols-outlined animate-spin text-3xl text-gray-400 dark:text-neutral-600">
                                progress_activity
                              </span>
                            </div>
                          ) : cifIsRenderable ? (
                            <StructureViewer
                              key={selectedMaterial.material_id}
                              cifData={cifData}
                              backgroundColor="#f4f4f5"
                              initialStyle={viewerStyle}
                              showUnitCell={unitCellOn}
                              onViewerReady={(controls) => {
                                controlsRef.current = controls;
                              }}
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                              <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-neutral-700">
                                view_in_ar
                              </span>
                              <p className="text-xs text-gray-500 dark:text-neutral-400">
                                {structureError ||
                                  "Click a row to load its structure."}
                              </p>
                            </div>
                          )}
                        </div>

                        {cifData && !cifIsRenderable && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => setShowRawStructure((v) => !v)}
                              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 dark:text-neutral-600 dark:hover:text-neutral-300"
                            >
                              {showRawStructure ? "Hide" : "Show"} raw structure
                              data
                            </button>
                            {showRawStructure && (
                              <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-2 text-[10px] text-gray-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                {cifData}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
                      <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-neutral-700">
                        touch_app
                      </span>
                      <p className="text-sm font-semibold text-gray-600 dark:text-neutral-400">
                        Select a material
                      </p>
                      <p className="text-xs text-gray-400 dark:text-neutral-600">
                        Click any row to see its details and 3D structure.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export const Explorer1: React.FC = () => {
  const [selectedElements] = useState<string[]>([]);
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchDatasetMaterials({
        elements: selectedElements,
        matchMode: "contains",
        page: 1,
        limit: 20,
      });
      setMaterials(data.results);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch dataset search results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedElements]);

  return (
    <div>
      {/* Pass handleSearch or setSelectedElements to your Periodic Table Component */}
      <h3>Search Results ({total} materials found)</h3>
      {loading ? (
        <p>Loading dataset materials...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Formula</th>
              <th>Band Gap (eV)</th>
              <th>E_hull (eV/atom)</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat.mv_id}>
                <td>{mat.mv_id}</td>
                <td>{mat.Formula}</td>
                <td>{mat["Band Gap E_g (eV)"]}</td>
                <td>{mat["E_hull-m (eV/atom)"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
