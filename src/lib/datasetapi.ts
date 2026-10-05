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
  database?: string;
  elements?: string[];
  excludeElements?: string[];
  matchMode?: "contains" | "exact" | "any" | "all";
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
    if (params.database && params.database !== "dataset" && params.database !== "indianmatter") {
      // Other databases usually expect comma-separated string
      query.append("elements", params.elements.join(","));
    } else {
      params.elements.forEach((elem) => query.append("elements", elem));
    }
  }
  if (params.excludeElements && params.excludeElements.length > 0) {
    if (params.database && params.database !== "dataset" && params.database !== "indianmatter") {
      query.append("exclude_elements", params.excludeElements.join(","));
    } else {
      params.excludeElements.forEach((elem) =>
        query.append("exclude_elements", elem),
      );
    }
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

  let endpoint = "/api/dataset/search";
  if (params.database === "indianmatter") endpoint = "/api/indianmatter/explore";
  else if (params.database === "materials_project") endpoint = "/api/materials/explore";
  else if (params.database === "oqmd") endpoint = "/api/oqmd/explore";
  else if (params.database === "jarvis") endpoint = "/api/jarvis/explore";
  else if (params.database === "aflow") endpoint = "/api/aflow/explore";

  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}?${query.toString()}`,
    );
  } catch {
    throw new Error(
      `Backend unavailable at ${API_BASE_URL}. Start the FastAPI server and try again.`,
    );
  }
  if (!response.ok) {
    throw new Error(`${params.database || 'dataset'} search failed with status ${response.status}`);
  }

  let data = await response.json();
  if (Array.isArray(data)) {
    return {
      total: data.length,
      page: params.page || 1,
      limit: params.limit || 100,
      results: data.map((item: any) => ({
        ...item,
        mv_id: item.mv_id || item.material_id || item.auid || item.entry_id,
        Formula: item.Formula || item.formula,
        "Band Gap E_g (eV)": item.band_gap ?? item["Band Gap E_g (eV)"],
        "Form. Energy E_f (eV/atom)": item.formation_energy ?? item["Form. Energy E_f (eV/atom)"],
        "E_hull-m (eV/atom)": item.e_hull ?? item.ehull ?? item["E_hull-m (eV/atom)"],
      }))
    };
  }
  return data;
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
