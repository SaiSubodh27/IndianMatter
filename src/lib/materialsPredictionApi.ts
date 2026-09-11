import { API_BASE_URL, ApiError } from "./api";

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
