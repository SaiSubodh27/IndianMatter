import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Play,
  Upload,
  AlertCircle,
  CheckSquare,
  Square,
  Layers,
  ArrowLeft,
} from "lucide-react";
import {
  predictFromCifFile,
  DirectPredictionResponse,
  PropertyResult,
} from "../../lib/materialsPredictionApi";

// ---------------------------------------------------------------------------
// Property catalogue — one entry per supported property key.
// Organized by physical categories: Energy, Mechanical, Thermal,
// Electronic, Ionic Transport.
// ---------------------------------------------------------------------------

type ModelRequirement = "gnn" | "base" | "structural";

interface PropertyOption {
  key: string;
  title: string;
  category: string;
  unit: string;
  requiresModel: ModelRequirement;
  format: (value: PropertyResult["value"], unit: string) => string;
}

const numeric =
  (digits: number) => (v: PropertyResult["value"], unit: string) => {
    if (typeof v === "number" && !isNaN(v)) {
      return unit ? `${v.toFixed(digits)} ${unit}` : `${v.toFixed(digits)}`;
    }
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) {
      const n = Number(v);
      return unit ? `${n.toFixed(digits)} ${unit}` : `${n.toFixed(digits)}`;
    }
    return "N/A";
  };

const exponential =
  (digits: number) => (v: PropertyResult["value"], unit: string) => {
    if (typeof v === "number" && !isNaN(v)) {
      return unit ? `${v.toExponential(digits)} ${unit}` : `${v.toExponential(digits)}`;
    }
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) {
      const n = Number(v);
      return unit ? `${n.toExponential(digits)} ${unit}` : `${n.toExponential(digits)}`;
    }
    return "N/A";
  };

const scientific =
  (digits: number) => (v: PropertyResult["value"], unit: string) => {
    if (typeof v !== "number") return "N/A";
    const [base, exponent] = v.toExponential(digits).split("e");

    const superscripts: Record<string, string> = {
      "-": "⁻",
      "+": "",
      "0": "⁰",
      "1": "¹",
      "2": "²",
      "3": "³",
      "4": "⁴",
      "5": "⁵",
      "6": "⁶",
      "7": "⁷",
      "8": "⁸",
      "9": "⁹"
    };

    let formattedExponent = "";
    // Remove leading zeros from exponent (e.g., "-04" to "-4")
    const expNum = parseInt(exponent, 10).toString();
    for (const char of expNum) {
      if (char === '+') continue;
      formattedExponent += superscripts[char] || char;
    }

    return `${base} × 10${formattedExponent} ${unit}`;
  };

const ALL_PROPERTIES: PropertyOption[] = [
  // --- Energy ---
  {
    key: "potential_energy",
    title: "Potential Energy per Atom",
    category: "Energy",
    unit: "eV/atom",
    requiresModel: "gnn",
    format: numeric(4),
  },

  // --- Structural (CIF / Material Geometry) ---
  {
    key: "num_sites",
    title: "Number of Sites",
    category: "Structural",
    unit: "",
    requiresModel: "structural",
    format: (v) => (typeof v === "number" ? String(v) : "N/A"),
  },
  {
    key: "volume",
    title: "Volume",
    category: "Structural",
    unit: "Å³",
    requiresModel: "structural",
    format: numeric(2),
  },
  {
    key: "density",
    title: "Density",
    category: "Structural",
    unit: "g/cm³",
    requiresModel: "structural",
    format: numeric(2),
  },

  // --- Mechanical (strain-response, GNN, EOS) ---
  {
    key: "bulk_modulus",
    title: "Bulk Modulus (K_VRH)",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(3),
  },
  {
    key: "shear_modulus",
    title: "Shear Modulus (G_VRH)",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(3),
  },
  {
    key: "youngs_modulus",
    title: "Young's Modulus",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(3),
  },
  {
    key: "poisson_ratio",
    title: "Poisson's Ratio",
    category: "Mechanical",
    unit: "",
    requiresModel: "gnn",
    format: (v) => (typeof v === "number" ? v.toFixed(4) : "N/A"),
  },
  {
    key: "compressibility",
    title: "Compressibility",
    category: "Mechanical",
    unit: "GPa⁻¹",
    requiresModel: "gnn",
    format: scientific(3),
  },
  {
    key: "elastic_anisotropy",
    title: "Elastic Anisotropy",
    category: "Mechanical",
    unit: "",
    requiresModel: "gnn",
    format: (v) => (typeof v === "number" ? v.toFixed(4) : "N/A"),
  },
  {
    key: "thermal",
    title: "EOS Bulk Modulus (B0)",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(2),
  },

  // --- Thermal (GNN) ---
  {
    key: "debye_temperature",
    title: "Debye Temperature",
    category: "Thermal",
    unit: "K",
    requiresModel: "gnn",
    format: numeric(1),
  },
  {
    key: "thermal_conductivity",
    title: "Thermal Conductivity",
    category: "Thermal",
    unit: "W/m·K",
    requiresModel: "gnn",
    format: numeric(3),
  },

  // --- Electronic (GNN / heuristic) ---
  {
    key: "band_gap",
    title: "Electronic Band Gap",
    category: "Electronic",
    unit: "eV",
    requiresModel: "gnn",
    format: numeric(3),
  },
  {
    key: "electronic_state",
    title: "Electronic State",
    category: "Electronic",
    unit: "",
    requiresModel: "gnn",
    format: (v) => (typeof v === "string" ? v : "N/A"),
  },

  // --- Ionic Transport (base surrogate model) ---
  {
    key: "ionic_conductivity",
    title: "Ionic Conductivity",
    category: "Ionic Transport",
    unit: "S/cm",
    requiresModel: "base",
    format: scientific(3),
  },
  {
    key: "ionic_conductivity_activation_energy",
    title: "Activation Energy (Ea)",
    category: "Ionic Transport",
    unit: "eV",
    requiresModel: "base",
    format: numeric(3),
  },
];

const PROPERTY_MAP: Record<string, PropertyOption> = Object.fromEntries(
  ALL_PROPERTIES.map((p) => [p.key, p]),
);

const CATEGORY_ORDER = [
  "Energy",
  "Structural",
  "Mechanical",
  "Thermal",
  "Electronic",
  "Ionic Transport",
];

const MODEL_BADGE: Record<ModelRequirement, string> = {
  gnn: "GNN",
  base: "Ionic Surrogate",
  structural: "Structural",
};

/**
 * Extracts value, unit, status, and warnings for a property key from the API response.
 * Safely resolves Potential Energy per Atom, Structural geometry, and ML properties.
 */
function getPropertyValue(
  key: string,
  result: DirectPredictionResponse,
): {
  value: PropertyResult["value"];
  unit: string;
  status?: string;
  warning?: string;
} {
  if (key === "potential_energy") {
    const rawVal =
      result.base_outputs?.energy_per_atom?.value ??
      result.properties?.[key]?.value;
    const numVal =
      typeof rawVal === "number"
        ? rawVal
        : typeof rawVal === "string" && !isNaN(Number(rawVal))
          ? Number(rawVal)
          : null;

    return {
      value: numVal,
      unit: "eV/atom",
      status: typeof numVal === "number" ? "calculated" : "unavailable",
    };
  }

  if (key === "num_sites") {
    const val = result.material_metadata?.num_sites;
    return {
      value: typeof val === "number" ? val : null,
      unit: "",
      status: typeof val === "number" ? "calculated" : "unavailable",
    };
  }

  if (key === "volume") {
    const val = result.material_metadata?.volume_A3;
    return {
      value: typeof val === "number" ? val : null,
      unit: "Å³",
      status: typeof val === "number" ? "calculated" : "unavailable",
    };
  }

  if (key === "density") {
    const val = result.material_metadata?.density_g_cm3;
    return {
      value: typeof val === "number" ? val : null,
      unit: "g/cm³",
      status: typeof val === "number" ? "calculated" : "unavailable",
    };
  }

  const prop = result.properties?.[key];
  if (!prop) {
    return {
      value: null,
      unit: PROPERTY_MAP[key]?.unit ?? "",
      status: "unavailable",
    };
  }

  return {
    value: prop.value,
    unit: prop.unit || PROPERTY_MAP[key]?.unit || "",
    status: prop.status,
    warning:
      prop.status === "estimated" ||
        prop.status === "calculated_with_warnings" ||
        prop.status === "failed"
        ? prop.warnings?.[0]
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// 3D structure viewer (3Dmol.js), rendering the actual uploaded CIF —
// styled in the spirit of the Materials Project crystal structure viewer.
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    $3Dmol?: any;
  }
}

const THREE_DMOL_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js";

let threeDMolLoadPromise: Promise<any> | null = null;

function loadThreeDMol(): Promise<any> {
  if (window.$3Dmol) return Promise.resolve(window.$3Dmol);
  if (threeDMolLoadPromise) return threeDMolLoadPromise;

  threeDMolLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${THREE_DMOL_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(window.$3Dmol));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load 3Dmol.js")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = THREE_DMOL_SRC;
    script.async = true;
    script.onload = () => resolve(window.$3Dmol);
    script.onerror = () => reject(new Error("Failed to load 3Dmol.js"));
    document.body.appendChild(script);
  });

  return threeDMolLoadPromise;
}

function useCifText(file: File | null) {
  const [cifText, setCifText] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setCifText(null);
      return;
    }
    let cancelled = false;
    file
      .text()
      .then((text) => {
        if (!cancelled) setCifText(text);
      })
      .catch(() => {
        if (!cancelled) setCifText(null);
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  return cifText;
}

function StructureViewer({ cifText }: { cifText: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!cifText || !containerRef.current) {
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadThreeDMol()
      .then(($3Dmol) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: "white",
        });
        viewerRef.current = viewer;

        viewer.addModel(cifText, "cif");
        viewer.setStyle(
          {},
          { sphere: { scale: 0.28 }, stick: { radius: 0.1 } },
        );
        try {
          viewer.addUnitCell();
        } catch {
          // unit-cell overlay is best-effort; some CIFs omit full symmetry
        }
        viewer.zoomTo();
        viewer.render();
        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch {
          // no-op
        }
        viewerRef.current = null;
      }
    };
  }, [cifText]);

  if (!cifText) {
    return (
      <div className="text-center space-y-2 p-4">
        <Layers className="mx-auto text-[#F1641D]" size={32} />
        <p className="text-xs font-medium text-[#1E2227]">
          Upload a CIF file to preview the 3D crystal structure.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#6C737E] bg-white/70">
          Loading structure viewer…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-600 bg-white/90 px-4 text-center">
          Couldn't load the 3D structure viewer. Check your network
          connection and try again.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function PropertyPredictionPage() {
  const [viewMode, setViewMode] = useState<"predict" | "results">("predict");
  const [file, setFile] = useState<File | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "bulk_modulus",
    "shear_modulus",
  ]);
  const [result, setResult] = useState<DirectPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cifText = useCifText(file);

  const toggleProperty = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handlePredict = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Upload a CIF file before running a prediction.");
      return;
    }
    if (selectedKeys.length === 0) {
      setError("Select at least one property to generate predictions.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Pass selected properties to backend endpoint
      const res = await predictFromCifFile(file, selectedKeys);
      setResult(res);
      // STEP 6: Once prediction completes successfully:
      // AUTOMATICALLY NAVIGATE TO THE DEDICATED RESULTS PAGE.
      setViewMode("results");
    } catch (requestError) {
      // If prediction fails: DO NOT navigate to the Results page.
      // Remain on the Property Prediction page and show an appropriate error message.
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Prediction failed. Ensure backend service is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === "results" && result) {
    return (
      <DedicatedResultsPage
        result={result}
        cifText={cifText}
        selectedKeys={selectedKeys}
        onBack={() => setViewMode("predict")}
      />
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <PageHeader />

      <form
        onSubmit={handlePredict}
        className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-card border border-[#EFE5DC] space-y-8"
      >
        <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4">
          <h2 className="font-headline font-bold text-xl text-[#1E2227]">
            Prediction Inputs
          </h2>
          <span className="text-xs text-[#8C929C]">Step 1 of 2</span>
        </div>

        <FileInput file={file} onChange={setFile} />

        <PropertyChecklist
          selectedKeys={selectedKeys}
          onToggle={toggleProperty}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F1641D] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Running Model Inference & Property Calculators...
              </>
            ) : (
              <>
                Run Property Prediction
                <Play size={15} />
              </>
            )}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 items-start"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dedicated Results Page View
// ---------------------------------------------------------------------------

function DedicatedResultsPage({
  result,
  cifText,
  selectedKeys,
  onBack,
}: {
  result: DirectPredictionResponse;
  cifText: string | null;
  selectedKeys: string[];
  onBack: () => void;
}) {
  const { material_metadata } = result;

  // Selected properties mapped and ordered
  const selectedProps = selectedKeys
    .map((k) => PROPERTY_MAP[k])
    .filter((p): p is PropertyOption => Boolean(p));

  // Only render categories that have at least one selected property
  const visibleCategories = CATEGORY_ORDER.filter((cat) =>
    selectedProps.some((p) => p.category === cat),
  );

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-6 px-4 sm:px-8 py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E2227] hover:text-[#F1641D] bg-white hover:bg-[#FAF4EE] px-4 py-2.5 rounded-xl border border-[#EFE5DC] shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} className="text-[#F1641D]" /> Back to Property Prediction
        </button>
        <div className="flex items-center gap-2 text-xs font-medium text-[#6C737E]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Prediction Complete
        </div>
      </div>

      {/* Two Equal-Sized Main Panels: Equal Width & Equal Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* LEFT PANEL: CIF / Crystal Structure (Stable) */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] flex flex-col h-[540px] md:h-[640px] lg:h-[680px]">
          <div className="border-b border-[#F2E7DC] pb-4 shrink-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C929C] mb-1">
              Material Structure
            </span>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#1E2227] break-words">
              {material_metadata.formula || "Predicted Structure"}
            </h2>
          </div>

          <div className="bg-[#FAF4EE] rounded-2xl p-4 border border-[#EFE5DC] flex flex-col flex-1 min-h-0 mt-4 space-y-3">
            <div className="flex justify-between items-center shrink-0">
              <span className="text-xs font-bold text-[#1E2227] uppercase tracking-wider">
                Crystal Lattice Visualization
              </span>
              <span className="text-[10px] text-[#8C929C]">
                Interactive 3D Unit Cell
              </span>
            </div>
            <div className="w-full flex-1 min-h-0 bg-white rounded-xl border border-[#EFE5DC] overflow-hidden relative flex items-center justify-center">
              <StructureViewer cifText={cifText} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Property Results (Equal outer dimensions, scrolls internally) */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] flex flex-col h-[540px] md:h-[640px] lg:h-[680px]">
          {/* Stable Right Header */}
          <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4 shrink-0">
            <div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#1E2227]">
                Property Results
              </h3>

            </div>
            <span className="text-xs font-bold text-[#F1641D] bg-[#FAF4EE] px-3 py-1 rounded-full border border-[#EFE5DC] shrink-0">
              {selectedProps.length} {selectedProps.length === 1 ? "property" : "properties"}
            </span>
          </div>

          {/* Independently Scrollable Container for Results */}
          <div className="overflow-y-auto pr-2 mt-4 space-y-6 flex-1 min-h-0">
            {visibleCategories.length === 0 ? (
              <div className="bg-[#FAF4EE] rounded-2xl p-8 border border-[#EFE5DC] text-center space-y-1.5 my-auto">
                <p className="font-headline font-bold text-sm text-[#1E2227]">
                  No properties selected
                </p>
                <p className="text-xs text-[#6C737E]">
                  Select at least one target property to generate predictions.
                </p>
              </div>
            ) : (
              visibleCategories.map((category) => {
                const propsInCategory = selectedProps.filter(
                  (p) => p.category === category,
                );

                return (
                  <div key={category} className="space-y-3">
                    {/* Category Heading (displayed once above its selected properties) */}
                    <div className="border-b border-[#F2E7DC] pb-2 flex items-center justify-between">
                      <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-[#8C929C]">
                        {category}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#F1641D] bg-[#FAF4EE] px-2 py-0.5 rounded-full border border-[#EFE5DC]">
                        {propsInCategory.length}{" "}
                        {propsInCategory.length === 1 ? "property" : "properties"}
                      </span>
                    </div>

                    {/* Full-width horizontal property blocks (one per row) */}
                    <div className="space-y-2.5">
                      {propsInCategory.map((prop) => {
                        const { value, unit, status, warning } = getPropertyValue(
                          prop.key,
                          result,
                        );
                        const formattedValue = prop.format(value, unit);

                        return (
                          <PropertyResultBlock
                            key={prop.key}
                            title={prop.title}
                            value={formattedValue}
                            status={status}
                            warning={warning}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function PageHeader() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
        <Activity size={14} /> Unified Material Property Inference
      </div>
      <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
        Property Prediction Engine
      </h1>
      <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
        Submit a CIF structure to calculate desired target properties using optimized model pipelines.
      </p>
    </div>
  );
}

function FileInput({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className="block text-xs font-semibold text-[#1E2227]">
      CIF Structure File
      <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer hover:border-[#F1641D] transition-colors">
        <Upload size={15} className="text-[#F1641D]" />
        <span className="truncate">{file?.name ?? "Choose a .cif file"}</span>
        <input
          type="file"
          accept=".cif,.CIF"
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </span>
    </label>
  );
}

function PropertyChecklist({
  selectedKeys,
  onToggle,
}: {
  selectedKeys: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-3">
        <span className="block text-sm font-bold text-[#1E2227]">
          Target Properties
        </span>
        <span className="text-xs font-semibold text-[#F1641D] bg-[#FAF4EE] px-3 py-1 rounded-full border border-[#EFE5DC]">
          {selectedKeys.length} selected
        </span>
      </div>

      {/* Complete property list with normal page scrolling (no internal scrollbar) */}
      <div className="space-y-6">
        {CATEGORY_ORDER.map((category) => {
          const props = ALL_PROPERTIES.filter((p) => p.category === category);
          if (props.length === 0) return null;

          return (
            <div key={category} className="space-y-2.5">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C929C]">
                {category}
              </span>

              {/* Two-column responsive grid on desktop/tablet, single-column on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {props.map((prop) => {
                  const isChecked = selectedKeys.includes(prop.key);
                  return (
                    <div
                      key={prop.key}
                      onClick={() => onToggle(prop.key)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all cursor-pointer select-none ${isChecked
                        ? "border-[#F1641D] bg-[#FAF4EE] text-[#1E2227] shadow-sm ring-1 ring-[#F1641D]/20"
                        : "border-[#E9DFD4] bg-white text-[#6C737E] hover:border-[#F1641D] hover:bg-[#FAF4EE]/20"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 mr-2">
                        {isChecked ? (
                          <CheckSquare
                            size={16}
                            className="text-[#F1641D] shrink-0"
                          />
                        ) : (
                          <Square
                            size={16}
                            className="text-gray-400 shrink-0"
                          />
                        )}
                        <span className="font-medium text-[#1E2227] truncate">
                          {prop.title}
                        </span>
                      </div>
                      <div className="flex items-center shrink-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C929C] bg-white px-2 py-0.5 rounded border border-[#EFE5DC]">
                          {prop.unit || "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Full-width horizontal property block displaying Property Name and prominent Value + Unit.
 */
function PropertyResultBlock({
  title,
  value,
  status,
  warning,
}: {
  title: string;
  value: string;
  status?: string;
  warning?: string;
}) {
  return (
    <div className="w-full bg-[#FAF4EE] rounded-2xl p-4 sm:p-4.5 border border-[#EFE5DC] space-y-1 transition-all hover:border-[#F1641D]/40">
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-semibold text-[#6C737E]">
          {title}
        </span>
        {status && status !== "calculated" && (
          <span className="text-[9px] uppercase tracking-wider text-[#F1641D] bg-white px-2 py-0.5 rounded border border-[#EFE5DC]">
            {status.replace(/_/g, " ")}
          </span>
        )}
      </div>
      <div className="text-[19px] sm:text-[20px] leading-tight font-headline font-bold text-[#1E2227] tracking-tight">
        {value}
      </div>
      {warning && (
        <p className="text-[10px] sm:text-[11px] text-[#8C929C] leading-snug pt-0.5">
          {warning}
        </p>
      )}
    </div>
  );
}