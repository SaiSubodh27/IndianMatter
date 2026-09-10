export interface MaterialRecord {
  mv_id: string;
  Formula: string;
  nsites: number;
  "E_hull-m (eV/atom)": number;
  "Final M3GNet energy (eV)": number;
  "Form. Energy E_f (eV/atom)": number;
  "Band Gap E_g (eV)": number;
  "Bulk Modulus K (GPa)": number;
  "Shear Modulus G (GPa)": number;
  "Metal Prob.": number;
}

export interface SearchParams {
  elements?: string[];
  matchMode?: "contains" | "exact";
  formula?: string;
  minBandGap?: number;
  maxBandGap?: number;
  minEHull?: number;
  maxEHull?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  results: MaterialRecord[];
}

const API_BASE_URL = "http://localhost:8000/api/dataset";

export async function searchDatasetMaterials(
  params: SearchParams,
): Promise<SearchResponse> {
  const query = new URLSearchParams();

  if (params.elements && params.elements.length > 0) {
    params.elements.forEach((elem) => query.append("elements", elem));
  }
  if (params.matchMode) query.append("match_mode", params.matchMode);
  if (params.formula) query.append("formula", params.formula);
  if (params.minBandGap !== undefined)
    query.append("min_band_gap", params.minBandGap.toString());
  if (params.maxBandGap !== undefined)
    query.append("max_band_gap", params.maxBandGap.toString());
  if (params.minEHull !== undefined)
    query.append("min_e_hull", params.minEHull.toString());
  if (params.maxEHull !== undefined)
    query.append("max_e_hull", params.maxEHull.toString());
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined)
    query.append("limit", params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/search?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Dataset search failed with status ${response.status}`);
  }

  return response.json();
}
