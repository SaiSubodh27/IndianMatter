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
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  FileText,
  X,
  FileCheck,
} from "lucide-react";
import {
  predictFromCifFile,
  DirectPredictionResponse,
  PropertyResult,
} from "../../lib/materialsPredictionApi";
import { API_BASE_URL } from "../../lib/api";
import { useLocation } from "react-router-dom";

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
    if (typeof v === "number" && !isNaN(v)) {
      const abs = Math.abs(v);
      if (abs !== 0 && (abs < 0.001 || abs >= 10000)) {
        return unit
          ? `${v.toExponential(digits)} ${unit}`
          : `${v.toExponential(digits)}`;
      }
      return unit ? `${v.toFixed(digits)} ${unit}` : `${v.toFixed(digits)}`;
    }
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) {
      const n = Number(v);
      const abs = Math.abs(n);
      if (abs !== 0 && (abs < 0.001 || abs >= 10000)) {
        return unit
          ? `${n.toExponential(digits)} ${unit}`
          : `${n.toExponential(digits)}`;
      }
      return unit ? `${n.toFixed(digits)} ${unit}` : `${n.toFixed(digits)}`;
    }
    return "N/A";
  };

const ALL_PROPERTIES: PropertyOption[] = [
  // --- Energy (DFT / GNN surrogate) ---
  {
    key: "formation_energy",
    title: "Formation Energy (Ef)",
    category: "Energy",
    unit: "eV/atom",
    requiresModel: "gnn",
    format: numeric(3),
  },
  {
    key: "ehull",
    title: "Energy Above Convex Hull (E_hull)",
    category: "Energy",
    unit: "eV/atom",
    requiresModel: "gnn",
    format: (v, unit) => {
      if (typeof v === "number" && !isNaN(v)) {
        const meV = v * 1000;
        return `${v.toFixed(4)} ${unit} (${meV >= 0 ? "+" : ""}${meV.toFixed(1)} meV)`;
      }
      return "N/A";
    },
  },
  {
    key: "is_stable",
    title: "Thermodynamic Stability",
    category: "Energy",
    unit: "",
    requiresModel: "gnn",
    format: (v) => {
      if (typeof v === "boolean") {
        return v ? "Stable (≤ 25 meV/atom)" : "Unstable (> 25 meV/atom)";
      }
      if (typeof v === "string") return v;
      return "N/A";
    },
  },
  {
    key: "potential_energy",
    title: "Potential Energy per Atom",
    category: "Energy",
    unit: "eV/atom",
    requiresModel: "gnn",
    format: numeric(3),
  },

  // --- Structural (direct geometry) ---
  {
    key: "num_sites",
    title: "Number of Atomic Sites",
    category: "Structural",
    unit: "",
    requiresModel: "structural",
    format: (v) => (typeof v === "number" ? String(v) : "N/A"),
  },
  {
    key: "volume",
    title: "Unit Cell Volume",
    category: "Structural",
    unit: "Å³",
    requiresModel: "structural",
    format: numeric(2),
  },
  {
    key: "density",
    title: "Theoretical Density",
    category: "Structural",
    unit: "g/cm³",
    requiresModel: "structural",
    format: numeric(2),
  },

  // --- Mechanical (GNN surrogate) ---
  {
    key: "bulk_modulus",
    title: "Bulk Modulus (VRH)",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(1),
  },
  {
    key: "shear_modulus",
    title: "Shear Modulus (VRH)",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(1),
  },
  {
    key: "youngs_modulus",
    title: "Young's Modulus (E)",
    category: "Mechanical",
    unit: "GPa",
    requiresModel: "gnn",
    format: numeric(1),
  },
  {
    key: "poisson_ratio",
    title: "Poisson's Ratio (ν)",
    category: "Mechanical",
    unit: "",
    requiresModel: "gnn",
    format: numeric(3),
  },
  {
    key: "fracture_toughness",
    title: "Fracture Toughness (K_Ic)",
    category: "Mechanical",
    unit: "MPa·m^0.5",
    requiresModel: "gnn",
    format: numeric(2),
  },
  {
    key: "volume_change",
    title: "Volume Change on Delithiation (ΔV)",
    category: "Mechanical",
    unit: "%",
    requiresModel: "gnn",
    format: numeric(2),
  },

  // --- Thermal (GNN surrogate) ---
  {
    key: "thermal_conductivity",
    title: "Thermal Conductivity (κ)",
    category: "Thermal",
    unit: "W/m·K",
    requiresModel: "gnn",
    format: numeric(2),
  },
  {
    key: "debye_temperature",
    title: "Debye Temperature (θ_D)",
    category: "Thermal",
    unit: "K",
    requiresModel: "gnn",
    format: numeric(0),
  },
  {
    key: "thermal_expansion",
    title: "Thermal Expansion Coeff (α_V)",
    category: "Thermal",
    unit: "10⁻⁶ K⁻¹",
    requiresModel: "gnn",
    format: numeric(2),
  },
  {
    key: "thermal_stability",
    title: "Thermal Stability Decomposition Temp (T_dec)",
    category: "Thermal",
    unit: "°C",
    requiresModel: "gnn",
    format: numeric(1),
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
    key: "electrical_conductivity",
    title: "Electrical Conductivity (σ_e)",
    category: "Electronic",
    unit: "S/cm",
    requiresModel: "gnn",
    format: scientific(3),
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
    title: "Ionic Conductivity (σ_i)",
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

  const firstWarning =
    Array.isArray(prop.warnings) && prop.warnings.length > 0
      ? prop.warnings[0]
      : undefined;

  return {
    value: prop.value,
    unit: prop.unit ?? PROPERTY_MAP[key]?.unit ?? "",
    status: prop.status,
    warning: firstWarning,
  };
}

// ---------------------------------------------------------------------------
// 3D Crystal Viewer
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    $3Dmol: any;
  }
}

const THREE_DMOL_SRC = "https://3Dmol.org/build/3Dmol-min.js";
let threeDMolLoadPromise: Promise<any> | null = null;

function loadThreeDMol(): Promise<any> {
  if (window.$3Dmol) return Promise.resolve(window.$3Dmol);
  if (threeDMolLoadPromise) return threeDMolLoadPromise;

  threeDMolLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${THREE_DMOL_SRC}"]`);
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
          // Some CIFs may lack unit cell parameters
        }
        viewer.zoomTo();
        viewer.render();

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [cifText]);

  if (!cifText) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-[#8C929C] space-y-2">
        <Layers size={32} className="text-[#8C929C]/40" />
        <p>No crystallographic structure loaded.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#6C737E] bg-white/70">
          Loading 3D unit cell viewer…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-600 bg-white/90 px-4 text-center">
          Unable to render 3D viewer. The structure file can still be downloaded.
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
  const [materialName, setMaterialName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cifSource, setCifSource] = useState<"uploaded" | "generated" | null>(null);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "bulk_modulus",
    "shear_modulus",
    "band_gap",
    "ionic_conductivity",
  ]);

  const [result, setResult] = useState<DirectPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [generatingCif, setGeneratingCif] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If navigated from CIF Generator or other pages with router state
  const location = useLocation();
  useEffect(() => {
    const st = location.state as { cifString?: string; formula?: string } | null;
    if (st?.formula) {
      setMaterialName(st.formula);
    }
    if (st?.cifString) {
      const generatedFile = new File(
        [st.cifString],
        `${(st.formula || "generated").replace(/\s+/g, "_")}.cif`,
        { type: "chemical/x-cif" },
      );
      setFile(generatedFile);
      setCifSource("generated");
    }
  }, [location.state]);

  const cifText = useCifText(file);

  const toggleProperty = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Dedicated generator function to fetch/synthesize a CIF from material formula
  const generateCifFromFormula = async (targetFormula: string): Promise<File> => {
    setGeneratingCif(true);
    setLoadingStage(`Synthesizing relaxed CIF structure for "${targetFormula}" via CIF Generator...`);
    try {
      const res = await fetch(`${API_BASE_URL}/cif/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula: targetFormula.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `CIF generator failed (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (!data.success || !data.cif_string) {
        throw new Error(
          data.notes || `Could not resolve or synthesize CIF structure for "${targetFormula}". Check formula stoichiometry.`
        );
      }

      const generatedFile = new File(
        [data.cif_string],
        `${targetFormula.trim().replace(/\s+/g, "_")}.cif`,
        { type: "chemical/x-cif" }
      );
      setFile(generatedFile);
      setCifSource("generated");
      return generatedFile;
    } finally {
      setGeneratingCif(false);
    }
  };

  // Run Property Prediction
  const handlePredict = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (selectedKeys.length === 0) {
      setError("Select at least one property to generate predictions.");
      return;
    }

    const hasFile = Boolean(file);
    const hasName = Boolean(materialName.trim());

    if (!hasFile && !hasName) {
      setError("Please provide a Material Name/Formula or upload a CIF file (or both).");
      return;
    }

    setLoading(true);

    try {
      let activeFile: File;

      if (!hasFile && hasName) {
        // Step 1: Synthesize CIF from formula via CIF Generator
        activeFile = await generateCifFromFormula(materialName.trim());
      } else {
        // CIF file is directly provided
        activeFile = file!;
      }

      // Step 2: Run property prediction with the CIF file
      setLoadingStage(
        `Evaluating physical properties across AI models for ${materialName.trim() || activeFile.name}...`
      );
      const res = await predictFromCifFile(activeFile, selectedKeys);
      setResult(res);
      setViewMode("results");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Prediction failed. Ensure backend service is running.",
      );
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  // Pre-generate CIF standalone action
  const handlePreGenerateCif = async () => {
    if (!materialName.trim()) return;
    setError(null);
    try {
      await generateCifFromFormula(materialName.trim());
    } catch (err: any) {
      setError(err.message || "Failed to generate CIF.");
    } finally {
      setLoadingStage("");
    }
  };

  if (viewMode === "results" && result) {
    return (
      <DedicatedResultsPage
        result={result}
        cifText={cifText}
        selectedKeys={selectedKeys}
        materialName={materialName}
        cifSource={cifSource}
        onBack={() => setViewMode("predict")}
      />
    );
  }

  // Determine current input mode
  const inputMode =
    file && materialName.trim()
      ? "both"
      : file
      ? "cif_only"
      : materialName.trim()
      ? "name_only"
      : "none";

  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <PageHeader />

      <form
        onSubmit={handlePredict}
        className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-card border border-[#EFE5DC] space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2E7DC] pb-4 gap-2">
          <div>
            <h2 className="font-headline font-bold text-xl text-[#1E2227]">
              Prediction Inputs
            </h2>
            <p className="text-xs text-[#8C929C] mt-0.5">
              Enter a Material Formula/Name, upload a CIF file, or provide both.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {inputMode === "name_only" && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-accent border border-orange-200">
                Auto-Generate CIF Mode
              </span>
            )}
            {inputMode === "cif_only" && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Direct CIF Mode
              </span>
            )}
            {inputMode === "both" && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Formula + CIF Mode
              </span>
            )}
          </div>
        </div>

        {/* Dual Input Grid: Material Name / Formula + CIF File */}
        <div className="space-y-6">
          {/* 1. Material Name / Formula Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E2227] uppercase tracking-wider">
                Material Formula or Name
              </label>
              <span className="text-[11px] text-[#8C929C]">
                {file ? "Optional (overrides label)" : "Required if no CIF is uploaded"}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="e.g. LiCoO2, Fe2O3, Na3Zr2Si2PO12, LFP, NMC"
                className="flex-1 bg-[#FAF4EE]/60 border border-[#E9DFD4] rounded-xl px-4 py-3 text-sm font-mono text-[#1E2227] outline-none focus:border-accent transition-colors"
              />

              {materialName.trim() && !file && (
                <button
                  type="button"
                  onClick={handlePreGenerateCif}
                  disabled={generatingCif || loading}
                  className="px-4 py-3 bg-[#FAF4EE] hover:bg-[#F2E7DC] border border-[#E9DFD4] rounded-xl text-xs font-semibold text-accent flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                  title="Generate CIF structure now"
                >
                  <Sparkles size={14} className={generatingCif ? "animate-spin motion-reduce:animate-none" : ""} />
                  <span>{generatingCif ? "Synthesizing..." : "Synthesize CIF First"}</span>
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-[#8C929C] mr-1">Quick Presets:</span>
              {["LiCoO2", "Fe2O3", "TiO2", "Na3Zr2Si2PO12", "NaCl", "Si"].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setMaterialName(sym)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium bg-[#FAF4EE] text-[#5F6771] hover:bg-[#F2E7DC] hover:text-[#1E2227] border border-[#EFE5DC] transition-colors"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* 2. CIF File Upload Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E2227] uppercase tracking-wider">
                Crystallographic CIF File
              </label>
              <span className="text-[11px] text-[#8C929C]">
                {materialName.trim()
                  ? "Optional (auto-generated if omitted)"
                  : "Required if no formula is provided"}
              </span>
            </div>

            <FileInput
              file={file}
              cifSource={cifSource}
              onChange={(newFile) => {
                setFile(newFile);
                setCifSource(newFile ? "uploaded" : null);
              }}
            />
          </div>
        </div>

        {/* Property Checklist */}
        <PropertyChecklist
          selectedKeys={selectedKeys}
          onToggle={toggleProperty}
        />

        {/* Submit Button & Stage Feedback */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={loading || generatingCif}
            className="w-full bg-accent text-white py-4 rounded-xl text-sm font-semibold hover:bg-accent-hover disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-soft cursor-pointer active:scale-98"
          >
            {loading || generatingCif ? (
              <>
                <RefreshCw size={16} className="animate-spin motion-reduce:animate-none" />
                <span>{loadingStage || "Processing Prediction Pipeline..."}</span>
              </>
            ) : (
              <>
                <span>
                  {file
                    ? "Run Property Prediction"
                    : materialName.trim()
                    ? `Generate CIF & Predict Properties for ${materialName.trim()}`
                    : "Run Property Prediction"}
                </span>
                <Play size={15} />
              </>
            )}
          </button>

          {loadingStage && (
            <p className="text-center text-xs text-[#8C929C] font-medium">
              {loadingStage}
            </p>
          )}
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
  materialName,
  cifSource,
  onBack,
}: {
  result: DirectPredictionResponse;
  cifText: string | null;
  selectedKeys: string[];
  materialName?: string;
  cifSource?: "uploaded" | "generated" | null;
  onBack: () => void;
}) {
  const { material_metadata } = result;
  const [copiedCif, setCopiedCif] = useState(false);

  const selectedProps = selectedKeys
    .map((k) => PROPERTY_MAP[k])
    .filter((p): p is PropertyOption => Boolean(p));

  const visibleCategories = CATEGORY_ORDER.filter((cat) =>
    selectedProps.some((p) => p.category === cat),
  );

  const handleCopyCif = () => {
    if (!cifText) return;
    navigator.clipboard.writeText(cifText);
    setCopiedCif(true);
    setTimeout(() => setCopiedCif(false), 2000);
  };

  const handleDownloadCif = () => {
    if (!cifText) return;
    const blob = new Blob([cifText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(material_metadata.formula || materialName || "crystal").replace(/\s+/g, "_")}.cif`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-6 px-4 sm:px-8 py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E2227] hover:text-accent bg-white hover:bg-[#FAF4EE] px-4 py-2.5 rounded-xl border border-[#EFE5DC] shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} className="text-accent" /> Back to Property Prediction
        </button>

        <div className="flex items-center gap-3">
          {cifSource === "generated" && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-accent border border-orange-200">
              Synthesized via CIF Generator
            </span>
          )}
          <div className="flex items-center gap-2 text-xs font-medium text-[#6C737E]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Prediction Complete
          </div>
        </div>
      </div>

      {/* Main Panels: Left (Lattice & CIF) and Right (Properties) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* LEFT PANEL: CIF / Crystal Structure */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] flex flex-col h-[540px] md:h-[640px] lg:h-[680px]">
          <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4 shrink-0">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C929C] mb-1">
                Material Structure
              </span>
              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#1E2227] break-words">
                {material_metadata.formula || materialName || "Predicted Structure"}
              </h2>
            </div>

            {cifText && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCif}
                  className="p-2 border border-[#E9DFD4] rounded-xl text-xs text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1 transition-colors"
                  title="Copy CIF String"
                >
                  {copiedCif ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCif}
                  className="px-3 py-2 bg-[#FAF4EE] hover:bg-accent-soft border border-[#E9DFD4] text-accent rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Download .cif file"
                >
                  <Download size={13} />
                  <span>CIF</span>
                </button>
              </div>
            )}
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

        {/* RIGHT PANEL: Property Results */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-card border border-[#EFE5DC] flex flex-col h-[540px] md:h-[640px] lg:h-[680px]">
          <div className="flex items-center justify-between border-b border-[#F2E7DC] pb-4 shrink-0">
            <div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#1E2227]">
                Property Results
              </h3>
            </div>
            <span className="text-xs font-bold text-accent bg-[#FAF4EE] px-3 py-1 rounded-full border border-[#EFE5DC] shrink-0">
              {selectedProps.length} {selectedProps.length === 1 ? "property" : "properties"}
            </span>
          </div>

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
                    <div className="border-b border-[#F2E7DC] pb-2 flex items-center justify-between">
                      <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-[#8C929C]">
                        {category}
                      </h4>
                      <span className="text-[10px] font-semibold text-accent bg-[#FAF4EE] px-2 py-0.5 rounded-full border border-[#EFE5DC]">
                        {propsInCategory.length}{" "}
                        {propsInCategory.length === 1 ? "property" : "properties"}
                      </span>
                    </div>

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
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent font-headline mb-1">
        <Activity size={14} /> Unified Material Property Inference
      </div>
      <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
        Property Prediction Engine
      </h1>
      <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
        Provide a material formula/name, upload a CIF file, or both. If no CIF is uploaded, the integrated CIF Generator will synthesize the crystallographic structure automatically.
      </p>
    </div>
  );
}

function FileInput({
  file,
  cifSource,
  onChange,
}: {
  file: File | null;
  cifSource?: "uploaded" | "generated" | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      {file ? (
        <div className="flex items-center justify-between p-3.5 bg-[#FAF4EE]/70 rounded-xl border border-[#E9DFD4]">
          <div className="flex items-center gap-3 min-w-0">
            <FileCheck size={20} className="text-accent shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1E2227] font-mono truncate">
                {file.name}
              </p>
              <p className="text-[10px] text-[#8C929C]">
                {cifSource === "generated" ? "Synthesized via CIF Generator" : "Uploaded from disk"}
                {" • "}{(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 text-[#8C929C] hover:text-red-600 rounded-lg transition-colors"
            title="Remove CIF file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="block">
          <span className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/40 px-4 py-4 text-[#6C737E] cursor-pointer hover:border-accent hover:bg-[#FAF4EE] transition-all text-xs">
            <Upload size={16} className="text-accent" />
            <span>Click to upload or drag & drop a .cif file</span>
            <input
              type="file"
              accept=".cif,.CIF"
              className="sr-only"
              onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />
          </span>
        </label>
      )}
    </div>
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
        <span className="text-xs font-semibold text-accent bg-[#FAF4EE] px-3 py-1 rounded-full border border-[#EFE5DC]">
          {selectedKeys.length} selected
        </span>
      </div>

      <div className="space-y-6">
        {CATEGORY_ORDER.map((category) => {
          const props = ALL_PROPERTIES.filter((p) => p.category === category);
          if (props.length === 0) return null;

          return (
            <div key={category} className="space-y-2.5">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C929C]">
                {category}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {props.map((prop) => {
                  const isChecked = selectedKeys.includes(prop.key);
                  return (
                    <div
                      key={prop.key}
                      onClick={() => onToggle(prop.key)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all cursor-pointer select-none ${isChecked
                        ? "border-accent bg-[#FAF4EE] text-[#1E2227] shadow-sm ring-1 ring-accent/20"
                        : "border-[#E9DFD4] bg-white text-[#6C737E] hover:border-accent hover:bg-[#FAF4EE]/20"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 mr-2">
                        {isChecked ? (
                          <CheckSquare
                            size={16}
                            className="text-accent shrink-0"
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
    <div className="w-full bg-[#FAF4EE] rounded-2xl p-4 sm:p-4.5 border border-[#EFE5DC] space-y-1 transition-all hover:border-accent/40">
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-semibold text-[#6C737E]">
          {title}
        </span>
        {status && status !== "calculated" && (
          <span className="text-[9px] uppercase tracking-wider text-accent bg-white px-2 py-0.5 rounded border border-[#EFE5DC]">
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