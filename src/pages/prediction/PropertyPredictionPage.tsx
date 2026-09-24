import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Play,
  Upload,
  AlertCircle,
  CheckSquare,
  Square,
  Layers,
  Cpu,
} from "lucide-react";
import {
  predictFromCifFile,
  DirectPredictionResponse,
  PropertyResult,
} from "../../lib/materialsPredictionApi";

// ---------------------------------------------------------------------------
// Property catalogue — one entry per REAL backend property key.
// `requiresModel` is informational only (shown as a badge); the unified
// backend endpoint resolves the right model adapter per key internally,
// so mechanical/thermal/electronic/ionic properties can all be requested
// together in a single call.
// ---------------------------------------------------------------------------

type ModelRequirement = "gnn" | "base";

interface PropertyOption {
  key: string;
  title: string;
  category: string;
  unit: string;
  requiresModel: ModelRequirement;
  format: (value: PropertyResult["value"], unit: string) => string;
}

const numeric =
  (digits: number) => (v: PropertyResult["value"], unit: string) =>
    typeof v === "number" ? `${v.toFixed(digits)} ${unit}` : "N/A";

const exponential =
  (digits: number) => (v: PropertyResult["value"], unit: string) =>
    typeof v === "number" ? `${v.toExponential(digits)} ${unit}` : "N/A";

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
  // --- Mechanical (strain-response, GNN) ---
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

  // --- Thermal (EOS, GNN) ---
  {
    key: "thermal",
    title: "EOS Bulk Modulus (B0)",
    category: "Thermal",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(2),
  },
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

  // --- Ionic transport (base surrogate model, NOT a GNN potential) ---
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
  "Mechanical",
  "Thermal",
  "Electronic",
  "Ionic Transport",
];

const MODEL_BADGE: Record<ModelRequirement, string> = {
  gnn: "GNN",
  base: "Ionic Surrogate",
};

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
// Page
// ---------------------------------------------------------------------------

export default function PropertyPredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "bulk_modulus",
    "shear_modulus",
    "thermal",
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
      setError("Select at least one property to compute.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // The unified backend endpoint resolves whichever model adapters
      // (mechanical / thermal / electrical / ionic) each requested
      // property needs — no client-side model routing required.
      const res = await predictFromCifFile(file, selectedKeys);
      setResult(res);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Prediction failed. Ensure backend service is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form
            onSubmit={handlePredict}
            className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6"
          >
            <h2 className="font-headline font-bold text-lg text-[#1E2227]">
              Prediction Inputs
            </h2>

            <FileInput file={file} onChange={setFile} />

            <PropertyChecklist
              selectedKeys={selectedKeys}
              onToggle={toggleProperty}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading
                ? "Running Model Inference & Property Calculators..."
                : "Run Property Prediction"}
              <Play size={14} />
            </button>

            {error && (
              <div
                role="alert"
                className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700"
              >
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-7">
          <ResultsPanel result={result} loading={loading} cifText={cifText} />
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
    <div className="space-y-3">
      <span className="block text-xs font-semibold text-[#1E2227]">
        Target Properties
      </span>
      <div className="max-h-80 overflow-y-auto pr-1 space-y-4">
        {CATEGORY_ORDER.map((category) => {
          const props = ALL_PROPERTIES.filter((p) => p.category === category);
          return (
            <div key={category} className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C929C]">
                {category}
              </span>
              <div className="space-y-1.5">
                {props.map((prop) => {
                  const isChecked = selectedKeys.includes(prop.key);
                  return (
                    <div
                      key={prop.key}
                      onClick={() => onToggle(prop.key)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${isChecked
                        ? "border-[#F1641D] bg-[#FAF4EE] text-[#1E2227]"
                        : "border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D]"
                        }`}
                    >
                      <div className="flex items-center gap-2 truncate">
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
                        <span className="font-medium truncate">
                          {prop.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-1.5 py-0.5 rounded border border-[#EFE5DC]">
                          {MODEL_BADGE[prop.requiresModel]}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-2 py-0.5 rounded border border-[#EFE5DC]">
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

function ResultsPanel({
  result,
  loading,
  cifText,
}: {
  result: DirectPredictionResponse | null;
  loading: boolean;
  cifText: string | null;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E] space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-[#F1641D] border-t-transparent rounded-full mx-auto" />
        <p>Executing model inference and property calculators...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E]">
        Awaiting CIF prediction request. Select a structure file and target
        properties to begin calculation.
      </div>
    );
  }

  return <PredictionResultView result={result} cifText={cifText} />;
}

function PredictionResultView({
  result,
  cifText,
}: {
  result: DirectPredictionResponse;
  cifText: string | null;
}) {
  const { material_metadata, base_outputs, properties, model_used } = result;
  const energyPerAtom = base_outputs?.energy_per_atom?.value;
  const returnedKeys = Object.keys(properties ?? {});

  return (
    <section
      className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6"
      aria-label="Prediction result"
    >
      {/* Header Info */}
      <div className="border-b border-[#F2E7DC] pb-4 flex justify-between items-start">
        <div>
          <h2 className="font-headline font-bold text-2xl text-[#1E2227]">
            {material_metadata.formula || "Predicted Structure"}
          </h2>
          <p className="text-xs text-[#8C929C] mt-1 flex items-center gap-2">
            <Cpu size={12} className="text-[#F1641D]" />
            Pipeline:{" "}
            <span className="uppercase font-semibold text-[#1E2227]">
              {model_used}
            </span>{" "}
            · Sites: {material_metadata.num_sites} · Volume:{" "}
            {material_metadata.volume_A3.toFixed(2)} Å³
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF4EE] text-[#F1641D] border border-[#EFE5DC]">
          Density: {material_metadata.density_g_cm3.toFixed(2)} g/cm³
        </span>
      </div>

      {/* 3D Crystal Structure Display Section — renders the actual uploaded CIF */}
      <div className="bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#1E2227] uppercase tracking-wider">
            Crystal Lattice Visualization
          </span>
          <span className="text-[10px] text-[#8C929C]">
            Interactive 3D Unit Cell
          </span>
        </div>
        <div className="w-full h-72 bg-white rounded-xl border border-[#EFE5DC] overflow-hidden relative flex items-center justify-center">
          <StructureViewer cifText={cifText} />
        </div>
      </div>

      {/* Potential Energy Banner */}
      {typeof energyPerAtom === "number" && (
        <div className="bg-[#FAF4EE] rounded-2xl p-4 border border-[#EFE5DC] flex justify-between items-center">
          <div>
            <span className="block text-xs font-bold text-[#8C929C] uppercase">
              Potential Energy Per Atom
            </span>
            <span className="text-xl font-headline font-bold text-[#1E2227]">
              {energyPerAtom.toFixed(4)} eV/atom
            </span>
          </div>
          <Layers className="text-[#F1641D] opacity-80" size={24} />
        </div>
      )}

      {/* Predicted Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {returnedKeys.map((key) => {
          const prop = properties[key];
          const display = PROPERTY_MAP[key];
          if (!prop || !display) return null;

          return (
            <PropertyCard
              key={key}
              title={display.title}
              category={display.category}
              value={display.format(prop.value, prop.unit)}
              status={prop.status}
              warning={
                prop.status === "estimated" ||
                  prop.status === "calculated_with_warnings" ||
                  prop.status === "failed"
                  ? prop.warnings?.[0]
                  : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}

function PropertyCard({
  title,
  value,
  category,
  status,
  warning,
}: {
  title: string;
  value: string;
  category: string;
  status?: string;
  warning?: string;
}) {
  return (
    <div className="bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="block text-[10px] font-bold text-[#8C929C] uppercase tracking-wider">
            {category}
          </span>
          {status && status !== "calculated" && (
            <span className="text-[9px] uppercase tracking-wider text-[#F1641D] bg-white px-1.5 py-0.5 rounded border border-[#EFE5DC]">
              {status.replace(/_/g, " ")}
            </span>
          )}
        </div>
        <span className="block text-xs font-bold text-[#1E2227] mt-1">
          {title}
        </span>
        <span className="block mt-2 text-2xl font-headline font-bold text-[#1E2227] break-words">
          {value}
        </span>
        {warning && (
          <span className="block mt-2 text-[10px] text-[#8C929C] leading-snug">
            {warning}
          </span>
        )}
      </div>
    </div>
  );
}