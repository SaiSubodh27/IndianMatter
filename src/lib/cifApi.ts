export interface ParsedStructure {
  formula: string;
  data_block: string;
  space_group: string;
  space_group_number: string;
  lattice: {
    a: string;
    b: string;
    c: string;
    alpha: string;
    beta: string;
    gamma: string;
  };
  atoms: {
    species: string;
    fractional_coordinates: [number, number, number];
  }[];
}

function valueAfter(lines: string[], key: string) {
  const line = lines.find((item) =>
    item.toLowerCase().startsWith(key.toLowerCase()),
  );
  return line?.split(/\s+/).slice(1).join(" ").trim() || "";
}

function cleanValue(value: string) {
  return value.replace(/[()]/g, "").trim();
}

export async function parseCifFile(file: File): Promise<ParsedStructure> {
  const text = await file.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const atoms: ParsedStructure["atoms"] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase() === "loop_") {
      const headers: string[] = [];
      let index = i + 1;
      while (index < lines.length && lines[index].startsWith("_")) {
        headers.push(lines[index++]);
      }
      const speciesIndex = headers.findIndex((header) =>
        /type_symbol|label/i.test(header),
      );
      const xIndex = headers.findIndex((header) => /fract_x/i.test(header));
      const yIndex = headers.findIndex((header) => /fract_y/i.test(header));
      const zIndex = headers.findIndex((header) => /fract_z/i.test(header));
      
      if (speciesIndex >= 0 && xIndex >= 0 && yIndex >= 0 && zIndex >= 0) {
        while (
          index < lines.length &&
          !lines[index].startsWith("loop_") &&
          !lines[index].startsWith("_") &&
          !lines[index].startsWith("data_")
        ) {
          const values = lines[index].split(/\s+/);
          if (values.length >= headers.length) {
            const x = Number.parseFloat(values[xIndex]);
            const y = Number.parseFloat(values[yIndex]);
            const z = Number.parseFloat(values[zIndex]);
            if ([x, y, z].every(Number.isFinite)) {
              atoms.push({
                species: values[speciesIndex].replace(/[\d+.-]/g, ""),
                fractional_coordinates: [x, y, z],
              });
            }
          }
          index += 1;
        }
      }
      i = index - 1; // Advance the outer loop
    }
  }

  if (!atoms.length)
    throw new Error("No fractional atom coordinates were found in this CIF.");
  const formula =
    valueAfter(lines, "_chemical_formula_sum") ||
    valueAfter(lines, "_chemical_formula_structural") ||
    "Uploaded structure";
  return {
    formula: formula.replace(/[']/g, ""),
    data_block:
      lines.find((line) => line.toLowerCase().startsWith("data_"))?.slice(5) ||
      "uploaded",
    space_group: cleanValue(
      valueAfter(lines, "_space_group_name_h-m") ||
        valueAfter(lines, "_symmetry_space_group_name_h-m") ||
        "Unknown",
    ),
    space_group_number: cleanValue(
      valueAfter(lines, "_space_group_it_number") ||
        valueAfter(lines, "_symmetry_int_tables_number") ||
        "—",
    ),
    lattice: {
      a: cleanValue(valueAfter(lines, "_cell_length_a")),
      b: cleanValue(valueAfter(lines, "_cell_length_b")),
      c: cleanValue(valueAfter(lines, "_cell_length_c")),
      alpha: cleanValue(valueAfter(lines, "_cell_angle_alpha")),
      beta: cleanValue(valueAfter(lines, "_cell_angle_beta")),
      gamma: cleanValue(valueAfter(lines, "_cell_angle_gamma")),
    },
    atoms,
  };
}
