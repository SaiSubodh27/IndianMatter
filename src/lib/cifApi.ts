import { API_BASE_URL } from "./api";

export interface ParsedAtom {
  species: string;
  fractional_coordinates: [number, number, number];
  occupancy?: number | null;
}

export interface ParsedStructure {
  data_block: string;
  formula: string;
  space_group: string;
  space_group_number: number;
  lattice: {
    a: number;
    b: number;
    c: number;
    alpha: number;
    beta: number;
    gamma: number;
    volume: number;
  };
  atom_count: number;
  atoms: ParsedAtom[];
}

export async function parseCifFile(file: File): Promise<ParsedStructure> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/cif/parse`, {
    method: "POST",
    body: formData,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      body?.detail ?? `CIF parsing failed with status ${response.status}.`,
    );
  }
  return body as ParsedStructure;
}
