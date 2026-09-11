// Centralised access to the IndianMatter backend.
//
// Every failure mode the prediction request can hit is mapped to a specific,
// actionable message here rather than surfacing a bare "Failed to fetch" —
// the browser's network-level rejection is indistinguishable from a dozen
// unrelated causes, so it is never shown to the user as-is.

const RAW_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_TOPATH_URL ||
  "http://localhost:8000";

export const API_BASE_URL = RAW_BASE.replace(/\/+$/, "");

/** Default ceiling for a prediction request. Featurisation dominates. */
export const PREDICT_TIMEOUT_MS = 120_000;

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never reached the server. */
  readonly status: number;
  /** True when the backend could not be reached at all. */
  readonly unreachable: boolean;

  constructor(message: string, status = 0, unreachable = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.unreachable = unreachable;
  }
}

/** Pull the most specific message a FastAPI error body offers. */
function detailFrom(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;

  const detail = record.detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();

  // FastAPI request-validation errors arrive as a list of {loc, msg, type}.
  if (Array.isArray(detail)) {
    const parts = detail
      .map((entry) =>
        entry && typeof entry === "object"
          ? String((entry as Record<string, unknown>).msg ?? "")
          : "",
      )
      .filter(Boolean);
    if (parts.length) return parts.join("; ");
  }

  const error = record.error;
  if (typeof error === "string" && error.trim()) return error.trim();

  return null;
}

function statusMessage(status: number, detail: string | null): string {
  // A detail from the server is always more useful than our generic text,
  // except for 5xx where we prefix it so the user knows the side it failed on.
  switch (status) {
    case 400:
      return detail ?? "Invalid CIF file — the server rejected this upload.";
    case 404:
      return `Prediction endpoint not found at ${API_BASE_URL}. The backend may be running an older build.`;
    case 405:
      return "Prediction endpoint rejected the request method.";
    case 413:
      return "CIF file is too large for the prediction service.";
    case 415:
      return "Unsupported file format — only .cif files are accepted.";
    case 422:
      return detail ?? "The request was rejected as invalid by the server.";
    case 429:
      return "Too many requests — please wait a moment and try again.";
    case 500:
      return detail
        ? `Prediction failed: ${detail}`
        : "Prediction failed inside the model pipeline.";
    case 502:
    case 503:
    case 504:
      return "Prediction service unavailable — the backend is up but not ready to serve predictions.";
    default:
      if (status >= 500) {
        return detail
          ? `Prediction service error (${status}): ${detail}`
          : `Prediction service error (${status}).`;
      }
      return detail ?? `Request failed with status ${status}.`;
  }
}

/**
 * POST a request and decode it, translating transport, status and parse
 * failures into an ApiError carrying a message worth showing a user.
 */
async function requestJson(
  path: string,
  init: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<unknown> {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onExternalAbort, { once: true });

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch {
    if (timedOut) {
      throw new ApiError(
        `Request timed out after ${Math.round(timeoutMs / 1000)}s. Large structures can exceed this — try a smaller cell.`,
      );
    }
    if (externalSignal?.aborted) {
      throw new ApiError("Request cancelled.");
    }
    // fetch() rejects for DNS, connection-refused, TLS and CORS alike.
    throw new ApiError(
      `Backend unavailable — could not reach the prediction service at ${API_BASE_URL}. Confirm the server is running and that VITE_API_BASE_URL points at it.`,
      0,
      true,
    );
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }

  const raw = await response.text();

  let parsed: unknown = null;
  let parseFailed = false;
  if (raw.trim()) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parseFailed = true;
    }
  }

  if (!response.ok) {
    // An HTML error page means we very likely hit a proxy or the dev server
    // rather than the API — say so instead of dumping markup.
    if (parseFailed) {
      throw new ApiError(
        `Invalid server response (HTTP ${response.status}, not JSON). ${API_BASE_URL} may not be the API server.`,
        response.status,
      );
    }
    throw new ApiError(
      statusMessage(response.status, detailFrom(parsed)),
      response.status,
    );
  }

  if (parseFailed || parsed === null) {
    throw new ApiError(
      "Invalid server response — expected JSON from the prediction service.",
      response.status,
    );
  }

  return parsed;
}

export type LatticeParameters = {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
};

export type DetailedStructure = {
  space_group?: string;
  density?: number;
  volume?: number;
  elements?: string[];
  lattice?: LatticeParameters;
};

export type ClassificationDetailed = {
  crystal_system?: string;
  material_type?: string;
  ion_conductor_type?: string;
};

export type TemperaturePoint = {
  temperature_k: number;
  conductivity_s_cm: number;
};

/**
 * How much of the model's 343-descriptor input was genuinely available for this
 * structure. `computed_directly` comes from matminer/pymatgen under the training
 * names; `reconstructed` was recomputed from descriptor definitions because the
 * original generation scripts no longer exist; `imputed` was zero-filled, which
 * for most of these descriptors is a value the model never saw during training.
 * `coverage_level` is what drives `confidence` -- it measures input completeness,
 * not how favourably the material scored.
 */
export type FeatureCoverage = {
  expected: number;
  computed: number;
  computed_directly: number;
  reconstructed: number;
  imputed: number;
  coverage_pct: number;
  coverage_level: "high" | "partial" | "low" | "unknown";
  missing_dft: number;
  missing_dataset_relative: number;
  missing_structural: number;
};

/**
 * Response contract of POST /trial/predict, mirroring the dict returned by
 * `model_service.predict_from_cif`. Canonical units are fixed on the backend:
 * Ea in eV, conductivity in S/cm, temperature in K. Conversions happen only
 * at the presentation layer.
 */
export type TrialPredictionResponse = {
  status: string;
  Ea: number;
  logA: number;
  conductivity: number;
  temperature_k: number;
  composition: string;
  classification: string;
  classification_detailed?: ClassificationDetailed;
  detailed_structure?: DetailedStructure;
  hes_score?: number;
  normalized_hes?: number;
  hes_rating?: string;
  confidence?: string;
  validation_status?: string;
  prediction_quality?: string;
  temperature_series?: TemperaturePoint[];
  warnings?: string[];
  feature_coverage?: FeatureCoverage;
  /** [min, max] Kelvin the model was fitted over. Requests outside it are
   *  rejected with HTTP 400 rather than answered by extrapolation. */
  supported_temperature_range_k?: [number, number];
  /** True when the bundled log10(A) model returns the same value for any input,
   *  which makes absolute conductivity a fixed-prefactor estimate. */
  log_a_is_constant?: boolean;
  model_version?: string;
  source?: string;
};

export type PredictOptions = {
  file: File;
  temperature: number;
  materialName?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
};

/** Run a prediction against the live model service. */
export async function predictFromCIF({
  file,
  temperature,
  materialName,
  signal,
  timeoutMs = PREDICT_TIMEOUT_MS,
}: PredictOptions): Promise<TrialPredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("temperature", String(temperature));
  if (materialName && materialName.trim()) {
    formData.append("material_name", materialName.trim());
  }

  // Content-Type is deliberately unset — the browser must add the multipart
  // boundary itself.
  const body = await requestJson(
    "/trial/predict",
    { method: "POST", body: formData },
    timeoutMs,
    signal,
  );

  const record = body as Record<string, unknown>;
  if (record.status === "error" || record.status === "prediction_failed") {
    throw new ApiError(
      String(record.error ?? "Prediction failed inside the model pipeline."),
      500,
    );
  }
  return record as unknown as TrialPredictionResponse;
}

/** Cheap reachability probe used to distinguish "server down" from "route missing". */
export async function checkBackendHealth(
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, { method: "GET", signal });
    return response.ok;
  } catch {
    return false;
  }
}
