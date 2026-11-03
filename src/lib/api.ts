// Centralised access to the IndianMatter backend.

const RAW_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_TOPATH_URL ||
  "http://localhost:8000";

export const API_BASE_URL = RAW_BASE.replace(/\/+$/, "");

/** Default ceiling for a prediction request. Featurisation dominates. */
export const PREDICT_TIMEOUT_MS = 120_000;

export class ApiError extends Error {
  readonly status: number;
  readonly unreachable: boolean;

  constructor(message: string, status = 0, unreachable = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.unreachable = unreachable;
  }
}

function detailFrom(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;

  const detail = record.detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();

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

export type PropertyResultItem = {
  property_key: string;
  property_name: string;
  category?: string;
  value?: number | string | Record<string, unknown> | null;
  unit?: string;
  source_model?: string;
  status: "calculated" | "failed";
  error?: string;
  warning?: string;
};

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

export type TrialPredictionResponse = {
  status: string;
  Ea?: number;
  logA?: number;
  conductivity?: number;
  temperature_k?: number;
  composition?: string;
  classification?: string;
  confidence?: string;
  validation_status?: string;
  warnings?: string[];
  feature_coverage?: FeatureCoverage;
  log_a_is_constant?: boolean;
  model_version?: string;
  results?: PropertyResultItem[];
  results_by_key?: Record<string, PropertyResultItem>;
};

export type PredictOptions = {
  file: File;
  temperature: number;
  properties?: string[];
  materialName?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function predictFromCIF({
  file,
  temperature,
  properties,
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

  if (properties && properties.length > 0) {
    formData.append("properties", JSON.stringify(properties));
  }

  // NOTE: "/trial/predict" is a DEAD route — the backend (main.py) does not
  // register any /trial router. This call will always 404 against the current
  // backend. The real ionic-conductivity prediction is served by
  // /api/calculations/ionic-conductivity (see materialsPredictionApi.ts).
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
