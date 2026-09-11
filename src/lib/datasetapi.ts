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
  excludeElements?: string[];
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

export interface IndianMatterExploreRecord {
  mv_id?: string;
  material_id?: string;
  Formula?: string;
  formula?: string;
  nsites?: number;
  band_gap?: number;
  formation_energy?: number;
  density?: number;
  space_group?: string;
  crystal_system?: string;
}

import { API_BASE_URL } from "./api";

export async function searchDatasetMaterials(
  params: SearchParams,
): Promise<SearchResponse> {
  const query = new URLSearchParams();

  if (params.elements && params.elements.length > 0) {
    params.elements.forEach((elem) => query.append("elements", elem));
  }
  if (params.excludeElements && params.excludeElements.length > 0) {
    params.excludeElements.forEach((elem) =>
      query.append("exclude_elements", elem),
    );
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

  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/api/dataset/search?${query.toString()}`,
    );
  } catch {
    throw new Error(
      `Backend unavailable at ${API_BASE_URL}. Start the FastAPI server and try again.`,
    );
  }
  if (!response.ok) {
    throw new Error(`Dataset search failed with status ${response.status}`);
  }

  return response.json();
}

export async function exploreIndianMatter(params: {
  elements?: string[];
  excludeElements?: string[];
  minBandGap?: number;
  maxBandGap?: number;
  limit?: number;
}): Promise<IndianMatterExploreRecord[]> {
  const query = new URLSearchParams();
  params.elements?.forEach((element) => query.append("elements", element));
  params.excludeElements?.forEach((element) =>
    query.append("exclude_elements", element),
  );
  if (params.minBandGap !== undefined)
    query.set("min_band_gap", String(params.minBandGap));
  if (params.maxBandGap !== undefined)
    query.set("max_band_gap", String(params.maxBandGap));
  query.set("limit", String(params.limit ?? 100));
  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/api/indianmatter/explore?${query.toString()}`,
    );
  } catch {
    throw new Error(
      `Backend unavailable at ${API_BASE_URL}. Start the FastAPI server and try again.`,
    );
  }
  if (!response.ok)
    throw new Error(
      `IndianMatter explore failed with status ${response.status}`,
    );
  return response.json();
}
