import { useState, type FormEvent } from "react";
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
// `requiresModel` determines which model adapter must run this property:
//   "gnn"  -> CHGNet / M3GNet / MACE interatomic potential
//   "base" -> the ionic-transport surrogate (v5 base model), not a GNN
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
    format: exponential(3),
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
    unit: "mS/cm",
    requiresModel: "base",
    format: numeric(3),
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

type GnnModel = "chgnet" | "m3gnet" | "mace";
const BASE_MODEL_KEY = "base_model"; // sent to backend when ionic properties are requested

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PropertyPredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [gnnModel, setGnnModel] = useState<GnnModel>("chgnet");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "bulk_modulus",
    "shear_modulus",
    "thermal",
  ]);
  const [result, setResult] = useState<DirectPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRequirements = new Set(
    selectedKeys.map((k) => PROPERTY_MAP[k]?.requiresModel).filter(Boolean),
  );
  const usesIonicModel = selectedRequirements.has("base");
  const usesGnnModel = selectedRequirements.has("gnn");

  const toggleProperty = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const isPropertyDisabled = (prop: PropertyOption) => {
    // Mutually exclusive: a GNN-model run and a base-model run can't happen
    // in the same request, since the backend resolves one adapter per call.
    if (usesIonicModel && prop.requiresModel === "gnn") return true;
    if (usesGnnModel && prop.requiresModel === "base") return true;
    return false;
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

    const effectiveModel = usesIonicModel ? BASE_MODEL_KEY : gnnModel;

    try {
      const res = await predictFromCifFile(file, effectiveModel, selectedKeys);
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

            <ModelPicker
              usesIonicModel={usesIonicModel}
              gnnModel={gnnModel}
              onSelectGnnModel={setGnnModel}
            />

            <PropertyChecklist
              selectedKeys={selectedKeys}
              isPropertyDisabled={isPropertyDisabled}
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
          <ResultsPanel result={result} loading={loading} />
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
        Submit a CIF structure to run model inference using CHGNet, M3GNet, or
        MACE interatomic potentials, or the ionic-transport surrogate model.
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

function ModelPicker({
  usesIonicModel,
  gnnModel,
  onSelectGnnModel,
}: {
  usesIonicModel: boolean;
  gnnModel: GnnModel;
  onSelectGnnModel: (m: GnnModel) => void;
}) {
  if (usesIonicModel) {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#1E2227]">
          Prediction Model
        </label>
        <div className="py-2 px-3 rounded-xl border border-[#F1641D] bg-[#FAF4EE] text-[#F1641D] text-xs font-bold uppercase tracking-wider text-center">
          Base Model (Ionic Transport Surrogate)
        </div>
        <p className="text-[11px] text-[#8C929C] leading-snug">
          Ionic conductivity properties use a dedicated surrogate model, not an
          interatomic potential — the GNN picker is hidden while these are
          selected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#1E2227]">
        ML Interatomic Model Architecture
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(["chgnet", "m3gnet", "mace"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSelectGnnModel(m)}
            className={`py-2 px-3 rounded-xl border text-xs font-medium uppercase tracking-wider transition-all ${
              gnnModel === m
                ? "border-[#F1641D] bg-[#FAF4EE] text-[#F1641D] font-bold"
                : "border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function PropertyChecklist({
  selectedKeys,
  isPropertyDisabled,
  onToggle,
}: {
  selectedKeys: string[];
  isPropertyDisabled: (prop: PropertyOption) => boolean;
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
                  const disabled = isPropertyDisabled(prop);
                  return (
                    <div
                      key={prop.key}
                      onClick={() => !disabled && onToggle(prop.key)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                        disabled
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : isChecked
                            ? "border-[#F1641D] bg-[#FAF4EE] text-[#1E2227] cursor-pointer"
                            : "border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D] cursor-pointer"
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
                      <span className="text-[10px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-2 py-0.5 rounded border border-[#EFE5DC] shrink-0">
                        {prop.unit || "—"}
                      </span>
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
}: {
  result: DirectPredictionResponse | null;
  loading: boolean;
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

  return <PredictionResultView result={result} />;
}

function PredictionResultView({
  result,
}: {
  result: DirectPredictionResponse;
}) {
  const { material_metadata, base_outputs, properties, model_used } = result;
  const energyPerAtom = base_outputs?.energy_per_atom?.value;

  const returnedKeys = Object.keys(properties ?? {});

  return (
    <section
      className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6"
      aria-label="Prediction result"
    >
      <div className="border-b border-[#F2E7DC] pb-4 flex justify-between items-start">
        <div>
          <h2 className="font-headline font-bold text-2xl text-[#1E2227]">
            {material_metadata.formula || "Predicted Structure"}
          </h2>
          <p className="text-xs text-[#8C929C] mt-1 flex items-center gap-2">
            <Cpu size={12} className="text-[#F1641D]" />
            Model:{" "}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {returnedKeys.map((key) => {
          const prop = properties[key];
          const display = PROPERTY_MAP[key];
          if (!prop || !display) return null;

          if (prop.status === "failed") {
            return (
              <PropertyCard
                key={key}
                title={display.title}
                category={display.category}
                value="Failed"
                warning={prop.warnings?.[0]}
              />
            );
          }
          if (prop.status === "unavailable") {
            return (
              <PropertyCard
                key={key}
                title={display.title}
                category={display.category}
                value="Not available"
                warning={prop.warnings?.[0]}
              />
            );
          }

          return (
            <PropertyCard
              key={key}
              title={display.title}
              category={display.category}
              value={display.format(prop.value, prop.unit)}
              warning={
                prop.status === "estimated" ? prop.warnings?.[0] : undefined
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
  warning,
}: {
  title: string;
  value: string;
  category: string;
  warning?: string;
}) {
  return (
    <div className="bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] flex flex-col justify-between">
      <div>
        <span className="block text-[10px] font-bold text-[#8C929C] uppercase tracking-wider">
          {category}
        </span>
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
