// Research Atelier style paper model: preview research dataset for IndianMatter AI Copilot.

export type DatasetStatus = "available" | "partial" | "unavailable";

export type ResearchPaper = {
  id: string;
  title: string;
  authors: string[];
  source: string;
  sourceUrl: string;
  identifier: string;
  publishedAt: string;
  updatedAt: string;
  abstract: string;
  keywords: string[];
  aim: string;
  whyItMatters: string;
  simpleConclusion: string;
  limitations: string[];
  dataset: {
    status: DatasetStatus;
    name?: string;
    url?: string;
  };
  results: Array<{
    metric: string;
    value: string;
    comparison: string;
    unit: string;
    note: string;
  }>;
  topics: string[];
  isNew: boolean;
};

export const researchPapers: ResearchPaper[] = [
  {
    id: "matml-2026-014",
    title: "Interpretable graph learning for accelerating perovskite discovery",
    authors: ["A. Raman", "L. Chen", "M. Iqbal"],
    source: "Materials Informatics Archive",
    sourceUrl: "https://arxiv.org/",
    identifier: "MI-2026-014",
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-25",
    abstract:
      "A graph-learning workflow ranks candidate perovskite compositions while exposing the structural features that influence predicted stability.",
    keywords: [
      "perovskites",
      "graph learning",
      "stability",
      "materials discovery",
    ],
    aim: "To create a model that can suggest promising perovskite compositions while giving researchers a readable explanation for each prediction.",
    whyItMatters:
      "Perovskite screening traditionally requires massive DFT compute. Explainable graph learning reduces candidate evaluation time by order of magnitude.",
    simpleConclusion:
      "The model narrows a large search space quickly, but researchers still need laboratory validation before treating a candidate as reliable.",
    limitations: [
      "Validation is based on a curated computational dataset.",
      "The model has limited evidence for compositions outside the training chemistry.",
    ],
    dataset: {
      status: "available",
      name: "Open Perovskite Stability Set",
      url: "https://github.com/",
    },
    results: [
      {
        metric: "Top-10 candidate precision",
        value: "0.86",
        comparison: "0.71 baseline",
        unit: "score",
        note: "Held-out composition set",
      },
      {
        metric: "Ranking improvement",
        value: "3.2×",
        comparison: "Random search",
        unit: "fold",
        note: "Simulation benchmark",
      },
      {
        metric: "Interpretability coverage",
        value: "92",
        comparison: "—",
        unit: "%",
        note: "Predictions with feature attribution",
      },
    ],
    topics: ["AI for materials", "Perovskites"],
    isNew: true,
  },
  {
    id: "battery-2026-009",
    title: "A compositional map of fast-ion conducting solid electrolytes",
    authors: ["S. Kulkarni", "J. Ortega", "P. Nair"],
    source: "Open Electrochemistry Reports",
    sourceUrl: "https://arxiv.org/",
    identifier: "OER-2026-009",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
    abstract:
      "The study combines calculated migration barriers and measured conductivity to map promising solid-electrolyte families.",
    keywords: [
      "solid electrolytes",
      "ion transport",
      "batteries",
      "composition map",
    ],
    aim: "To identify chemical regions where ions can move quickly enough for safer solid-state battery designs.",
    whyItMatters:
      "Solid-state lithium batteries require high ionic conductivity with mechanical safety against dendrite formation.",
    simpleConclusion:
      "Several related compositions show a useful trade-off between low migration barriers and chemical stability, but long-cycle testing remains necessary.",
    limitations: [
      "Long-term cycling data is not included.",
      "Some composition families have sparse measurements.",
    ],
    dataset: {
      status: "partial",
      name: "Supplementary conductivity tables",
      url: "https://github.com/",
    },
    results: [
      {
        metric: "Best conductivity",
        value: "1.4 × 10⁻²",
        comparison: "8.0 × 10⁻³ reference",
        unit: "S/cm",
        note: "At 300 K",
      },
      {
        metric: "Migration barrier",
        value: "0.24",
        comparison: "0.36 reference",
        unit: "eV",
        note: "Calculated pathway",
      },
      {
        metric: "Families screened",
        value: "218",
        comparison: "—",
        unit: "compositions",
        note: "Combined sources",
      },
    ],
    topics: ["Batteries", "Transport"],
    isNew: true,
  },
  {
    id: "oxide-2026-003",
    title:
      "Uncertainty-aware prediction of oxide band gaps from crystal structure",
    authors: ["R. Mehta", "E. Williams"],
    source: "Computational Materials Notes",
    sourceUrl: "https://arxiv.org/",
    identifier: "CMN-2026-003",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-20",
    abstract:
      "A probabilistic model estimates band gaps and provides uncertainty intervals for previously unseen oxide structures.",
    keywords: ["oxides", "band gap", "uncertainty", "crystal structure"],
    aim: "To make band-gap predictions more useful by showing when the model is confident and when a prediction should be checked carefully.",
    whyItMatters:
      "Deterministic machine learning models often hallucinate confident bandgap numbers on out-of-distribution structures.",
    simpleConclusion:
      "The uncertainty estimate helps researchers decide which predictions are safe to shortlist and which need more evidence.",
    limitations: [
      "The uncertainty calibration depends on the reference dataset.",
      "Experimental disorder is simplified in the structural inputs.",
    ],
    dataset: { status: "unavailable" },
    results: [
      {
        metric: "Mean absolute error",
        value: "0.31",
        comparison: "0.44 baseline",
        unit: "eV",
        note: "Test structures",
      },
      {
        metric: "95% interval coverage",
        value: "93",
        comparison: "90 target",
        unit: "%",
        note: "Calibration set",
      },
      {
        metric: "Out-of-domain flagging",
        value: "0.79",
        comparison: "0.58 baseline",
        unit: "AUROC",
        note: "Held-out chemistry",
      },
    ],
    topics: ["Band gaps", "Oxides"],
    isNew: false,
  },
];

export const topicFilters = [
  "All topics",
  "AI for materials",
  "Batteries",
  "Perovskites",
  "Transport",
  "Band gaps",
  "Oxides",
];

export function formatPaperDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}
