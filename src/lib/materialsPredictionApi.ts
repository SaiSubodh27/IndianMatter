import { API_BASE_URL, ApiError } from "./api";

// ==========================================
// Existing Bulk Dataset & Job Types
// ==========================================

export type DatasetUploadResponse = {
  dataset_id: string;
  total_rows: number;
  valid_rows: number;
  columns: string[];
  detected_structure_col?: string | null;
  detected_formula_col?: string | null;
};

export type DatasetInspection = DatasetUploadResponse & {
  filename: string;
  max_rows_allowed: number;
  rows_preview: Array<Record<string, unknown>>;
  missing_values_per_column: Record<string, number>;
};

export type PropertyDefinition = {
  key: string;
  name: string;
  category: string;
  unit: string;
  description: string;
  unsupported?: boolean;
};

export type ModelCapability = {
  key: string;
  name: string;
  available: boolean;
  device?: string;
  capabilities: string[];
  error?: string | null;
};

export type PredictionJob = {
  job_id: string;
  status: string;
  progress_percent?: number;
  current_operation?: string;
  results?: Array<Record<string, unknown>>;
};

// ==========================================
// Direct Single CIF Prediction Types
// ==========================================

export interface MaterialMetadata {
  formula: string;
  volume_A3: number;
  density_g_cm3: number;
  num_sites: number;
}

/**
 * Matches the shape returned per-property by the backend's unified
 * `/api/calculations/predict-properties` endpoint. Every entry in
 * `properties` is keyed by its property_key (e.g. "bulk_modulus",
 * "thermal", "band_gap"). The unified endpoint returns a lean shape
 * (property_key, value, unit, status, warnings) — the richer fields
 * below are optional so the type also covers other/legacy endpoints
 * that may populate them.
 */
export interface PropertyResult {
  property_key: string;
  property_name?: string;
  category?: string;
  value: number | string | number[][] | number[][][][] | null;
  unit: string;
  source_model?: string;
  calculation_method?: string;
  status:
  | "calculated"
  | "calculated_with_warnings"
  | "failed"
  | "unavailable"
  | "estimated";
  inputs_used?: string[];
  warnings?: string[];
  limitations?: string;
  raw_details?: Record<string, unknown>;
}

/** Shape of entries under `base_outputs` (e.g. energy_per_atom). */
export interface BaseOutputResult {
  value: number | string | null;
  unit?: string;
  property_key?: string;
  status?: string;
}

export interface DirectPredictionResponse {
  status: string;
  material_metadata: MaterialMetadata;
  model_used: string;
  base_outputs: Record<string, BaseOutputResult>;
  properties: Record<string, PropertyResult>;
}

// ==========================================
// Core HTTP Request Handler
// ==========================================

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(
      `Backend unavailable at ${API_BASE_URL}. Start the FastAPI server and try again.`,
      0,
      true,
    );
  }

  const body = await response.text();
  let parsed: unknown = null;
  try {
    parsed = body ? JSON.parse(body) : null;
  } catch {
    throw new ApiError(
      `Backend returned a non-JSON response (HTTP ${response.status}).`,
      response.status,
    );
  }

  if (!response.ok) {
    const detail =
      parsed && typeof parsed === "object" && "detail" in parsed
        ? String((parsed as { detail?: unknown }).detail)
        : `Request failed with HTTP ${response.status}.`;
    throw new ApiError(detail, response.status);
  }
  return parsed as T;
}

// ==========================================
// Direct CIF Single-Structure Predictions
// ==========================================

/**
 * Calls the backend's unified, dynamic prediction pipeline
 * (`POST /api/calculations/predict-properties`) for a single CIF upload.
 *
 * This endpoint parses the uploaded structure on the fly and evaluates
 * whichever property keys are requested — mechanical, thermal,
 * electrical and ionic-transport properties can all be requested
 * together in one call, since the backend resolves the correct model
 * adapter per key internally. There is no client-side mocking here:
 * whatever the backend computes (or reports as "unavailable"/"failed")
 * is passed straight through to the caller.
 */
export async function predictFromCifFile(
  file: File,
  requestedProperties: string[] = ["bulk_modulus", "shear_modulus", "thermal"],
  temperature: number = 298.15,
): Promise<DirectPredictionResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("properties", requestedProperties.join(","));
  form.append("temperature", String(temperature));

  return request<DirectPredictionResponse>(
    "/api/calculations/predict-properties",
    {
      method: "POST",
      body: form,
    },
  );
}

export async function predictFromCifString(
  cifString: string,
  modelName: "chgnet" | "m3gnet" | "mace" = "chgnet",
  requestedProperties: string[] = ["mechanical", "thermal", "electrical"],
): Promise<DirectPredictionResponse> {
  return request<DirectPredictionResponse>("/api/predict/cif-string", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cif_string: cifString,
      model_name: modelName,
      requested_properties: requestedProperties,
    }),
  });
}

// ==========================================
// Bulk Dataset Prediction Pipelines
// ==========================================

export async function uploadPredictionDataset(
  csv: File,
  structures: File[] = [],
) {
  const form = new FormData();
  form.append("file", csv);
  structures.forEach((file) => form.append("structure_files", file));
  return request<DatasetUploadResponse>(
    "/api/materials-prediction/datasets/upload",
    {
      method: "POST",
      body: form,
    },
  );
}

export function inspectPredictionDataset(datasetId: string) {
  return request<DatasetInspection>(
    `/api/materials-prediction/datasets/${encodeURIComponent(datasetId)}/inspection`,
  );
}

export function listPredictionProperties() {
  return request<PropertyDefinition[]>("/api/materials-prediction/properties");
}

export function getPredictionCapabilities() {
  return request<{ models: Record<string, ModelCapability> }>(
    "/api/materials-prediction/models/capabilities",
  );
}

export function createPredictionJob(payload: {
  dataset_id: string;
  selected_models: string[];
  selected_properties: string[];
  calculation_settings?: Record<string, unknown>;
}) {
  return request<PredictionJob>("/api/materials-prediction/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getPredictionJob(jobId: string) {
  return request<PredictionJob>(
    `/api/materials-prediction/predictions/${encodeURIComponent(jobId)}`,
  );
}

export function getPredictionResults(jobId: string) {
  return request<{ results: Array<Record<string, unknown>> }>(
    `/api/materials-prediction/predictions/${encodeURIComponent(jobId)}/results`,
  );
}

export function predictionDownloadUrl(jobId: string, format = "zip") {
  return `${API_BASE_URL}/api/materials-prediction/predictions/${encodeURIComponent(jobId)}/download/${format}`;
}

// ==========================================
// Batch CIF Prediction Pipeline API
// ==========================================

export interface BatchPropertyOption {
  key: string;
  name: string;
  category: string;
  unit: string;
  default: boolean;
  description: string;
}

export interface BatchStatusResponse {
  job_id: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  total: number;
  completed: number;
  current_file: string;
  error?: string | null;
}

export interface BatchResultsResponse {
  job_id: string;
  status: string;
  total: number;
  completed: number;
  results: Array<Record<string, any>>;
  summary: {
    total: number;
    successful: number;
    warnings: number;
    failed: number;
  };
}

export async function fetchBatchProperties(): Promise<BatchPropertyOption[]> {
  const res = await request<{ properties: BatchPropertyOption[] }>(
    "/api/calculations/batch-properties"
  );
  return res.properties;
}

export async function fetchBatchSampleCifs(): Promise<Array<{ filename: string; content: string }>> {
  const res = await request<{ samples: Array<{ filename: string; content: string }> }>(
    "/api/calculations/batch-sample-cifs"
  );
  return res.samples;
}

export async function startBatchCifPrediction(
  files: File[],
  properties: string[],
  temperature = 298.15
): Promise<{ job_id: string; total: number; status: string; message: string }> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  form.append("properties", properties.join(","));
  form.append("temperature", String(temperature));

  return request<{ job_id: string; total: number; status: string; message: string }>(
    "/api/calculations/batch-predict",
    {
      method: "POST",
      body: form,
    }
  );
}

export function getBatchJobStatus(jobId: string): Promise<BatchStatusResponse> {
  return request<BatchStatusResponse>(
    `/api/calculations/batch-predict/status/${encodeURIComponent(jobId)}`
  );
}

export function getBatchJobResults(jobId: string): Promise<BatchResultsResponse> {
  return request<BatchResultsResponse>(
    `/api/calculations/batch-predict/results/${encodeURIComponent(jobId)}`
  );
}

export function getBatchCsvDownloadUrl(jobId: string): string {
  return `${API_BASE_URL}/api/calculations/batch-predict/download/${encodeURIComponent(jobId)}`;
}

export interface BfsyBatchResult {
  filename: string;
  formula: string;
  num_atoms: number;
  bulk_modulus_GPa: number | null;
  shear_modulus_GPa: number | null;
  youngs_modulus_GPa: number | null;
  poisson_ratio: number | null;
  formation_energy_eV_atom: number | null;
  energy_per_atom_eV: number | null;
  compressibility_GPa_inv: number | null;
  pughs_ratio: number | null;
  status: string;
  error_message?: string | null;
}

export interface BfsyBatchResponse {
  status: string;
  model_used: string;
  total: number;
  successful: number;
  failed: number;
  results: BfsyBatchResult[];
  csv_content: string;
}

export async function batchPredictBfsy(files: File[]): Promise<BfsyBatchResponse> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  return request<BfsyBatchResponse>("/api/calculations/batch-predict-bfsy", {
    method: "POST",
    body: form,
  });
}
