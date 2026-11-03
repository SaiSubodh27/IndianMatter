export interface ParsedCIF {
  name: string;
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  volume: number;
  system: string;
  atomCount: number;
}

function extractNumber(text: string, tag: string): number | null {
  const re = new RegExp(`_${tag}\\s+([\\-\\d.]+)`, "i");
  const match = text.match(re);
  return match ? parseFloat(match[1]) : null;
}

function closeEq(x: number, y: number, tol = 0.02): boolean {
  return Math.abs(x - y) <= tol * Math.max(x, y);
}

function closeTo(angle: number, target: number, tol = 0.5): boolean {
  return Math.abs(angle - target) <= tol;
}

function classifySystem(
  a: number,
  b: number,
  c: number,
  alpha: number,
  beta: number,
  gamma: number,
): string {
  const abEq = closeEq(a, b);
  const bcEq = closeEq(b, c);
  const acEq = closeEq(a, c);
  const allRight =
    closeTo(alpha, 90) && closeTo(beta, 90) && closeTo(gamma, 90);

  if (abEq && bcEq && allRight) return "Cubic";
  if (abEq && closeTo(alpha, 90) && closeTo(beta, 90) && closeTo(gamma, 120)) {
    return "Hexagonal";
  }
  if (abEq && !bcEq && allRight) return "Tetragonal";
  if (!abEq && !bcEq && !acEq && allRight) return "Orthorhombic";
  if (
    abEq &&
    bcEq &&
    closeEq(alpha, beta) &&
    closeEq(beta, gamma) &&
    !closeTo(alpha, 90)
  ) {
    return "Trigonal (Rhombohedral)";
  }
  if (closeTo(alpha, 90) && closeTo(gamma, 90) && !closeTo(beta, 90)) {
    return "Monoclinic";
  }
  return "Triclinic";
}

function cellVolume(
  a: number,
  b: number,
  c: number,
  alpha: number,
  beta: number,
  gamma: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const al = toRad(alpha);
  const be = toRad(beta);
  const ga = toRad(gamma);
  const cosAl = Math.cos(al);
  const cosBe = Math.cos(be);
  const cosGa = Math.cos(ga);
  const factor =
    1 - cosAl ** 2 - cosBe ** 2 - cosGa ** 2 + 2 * cosAl * cosBe * cosGa;
  return a * b * c * Math.sqrt(Math.max(factor, 0));
}

function countAtomSites(text: string): number {
  const loopIdx = text.search(/_atom_site_label/i);
  if (loopIdx === -1) return 0;

  const after = text.slice(loopIdx);
  const lines = after.split("\n").slice(1); // skip the label line itself

  let count = 0;
  let pastHeaders = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("_")) {
      // still inside the column-definition header block
      continue;
    }
    if (line === "" || line.startsWith("#")) {
      if (pastHeaders) break; // blank line after data rows = end of loop
      continue;
    }
    if (line.startsWith("loop_") || line.startsWith("data_")) break;
    pastHeaders = true;
    count += 1;
  }
  return count;
}

export function parseCIF(text: string, fallbackName: string): ParsedCIF {
  const dataMatch = text.match(/data_(\S+)/i);
  const name = dataMatch ? dataMatch[1] : fallbackName;

  const a = extractNumber(text, "cell_length_a");
  const b = extractNumber(text, "cell_length_b");
  const c = extractNumber(text, "cell_length_c");
  const alpha = extractNumber(text, "cell_angle_alpha");
  const beta = extractNumber(text, "cell_angle_beta");
  const gamma = extractNumber(text, "cell_angle_gamma");

  if (a === null || b === null || c === null) {
    throw new Error(
      "Couldn't find cell length parameters (_cell_length_a/b/c) in this CIF.",
    );
  }

  const al = alpha ?? 90;
  const be = beta ?? 90;
  const ga = gamma ?? 90;

  const volume = cellVolume(a, b, c, al, be, ga);
  const system = classifySystem(a, b, c, al, be, ga);
  const atomCount = countAtomSites(text);

  return {
    name,
    a,
    b,
    c,
    alpha: al,
    beta: be,
    gamma: ga,
    volume,
    system,
    atomCount,
  };
}
