// import React from "react";

interface Material {
  formula: string;
  crystalSystem: string;
  imageUrl: string;
  symmetryGroup: string;
  bandGap: string;
  formationEnergy: string;
}

const materials: Material[] = [
  {
    formula: "Li7La3Zr2O12",
    crystalSystem: "CUBIC",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmxsTzGYilufLvFdZuGfTyIHf4A52tLscUEJqMMC2aWZVks5pSUS5oOAGLGx7DCwtHPE7sykdgksyYSN1AvyMVpr_kyQwYHVEnwUh9f7O5-4FCip-Keo1ZxcHIRPYneE6tWDuGmHXuRr8aoH3j_4WLc8QZSf4d5rxgQcHcAk_ELL_2tfdTSGyqYx4pyEa8jr-SHjAoUfqvvUDiEivIifKp82dIviJD1Vk49IlzdGOlPt0jE5iInMl5rFczdxVBwIvkqNOIPXKvkcU",
    symmetryGroup: "Ia-3d",
    bandGap: "4.82 eV",
    formationEnergy: "-3.12 eV/atom",
  },
  {
    formula: "CsPbI3",
    crystalSystem: "ORTHO",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBELT8GpyWUgh6xr6_wyiC0jlyUzBOFH04wurT4QqQhC-wFZrLnMtfP1UfEHUrmCLvzraTlTxqP996ETFLLGm0yOGiVrTVcdpuSsjRUEIRzQm2pJ2q0NiiHFlhK7HnCm33DUsPDgauNyhYswbCte0AAEWLdYur9pYmwam5cuY76Sa3nFB6wqST5jJCEMeJWKZcxO1XTPnYC1FZrE1eS-_uXJWIhd9tuc0OCnH4GiaTS13FFBPeoG5NrDxezWuk8SRcGrtz-D1kUiA0",
    symmetryGroup: "Pnma",
    bandGap: "1.73 eV",
    formationEnergy: "-1.45 eV/atom",
  },
  {
    formula: "MoS2",
    crystalSystem: "HEX",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgAPfPh1LivdB_tWmf6kMFJIVV-pHDrCyEWndqtzRn3-xCCwcSX-tU8n80B_LjYWRcjK0OHxsHLz60G3lgaSN2EMQm0edcF0kdTwH31sDWiYzl38YdDEynccI4l432EYrko8cAFDMgzcvMDwQSBYJ_sJf4ZFgL8GL8UU31gzxE9j8o_7VlxM4FGCt4KBJKCXZmn1Am9yxZHOqbxudvyrmV5zTBEp1MODcNads4yhhxTDj7-O6ngMUBl2wW_CsCUYx6MuxUs6eh588",
    symmetryGroup: "P6_3/mmc",
    bandGap: "1.80 eV",
    formationEnergy: "-0.92 eV/atom",
  },
  {
    formula: "BaTiO3",
    crystalSystem: "TETRA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0vBS8M2NbNy8elvFWc94HqoSPJjRGI4z03mQsoxY1hVsCcEkLOaBihbE7wNSnC_iaFwU1RBFiCY3ZYfF27JJY9H89rJvdQXKJUE0bcaHfFZ8hDknfpaPBStbVwE9crSZ4_-l_r6WfVLBDUY1kPKAlan-O-En1Od6HKpID4viMtXxztmVle3raQni58YB_rGdqU032174yOCHi0ls22q--Gg1paMjs5qxT2FOIe9EiwyPiTFz6xq2m-bOj77fiU04xKShBOc-gByo",
    symmetryGroup: "P4mm",
    bandGap: "3.20 eV",
    formationEnergy: "-3.48 eV/atom",
  },
];

export default function Explorer() {
  return (
    <div className="flex flex-1 max-w-[1920px] w-full mx-auto">
      <aside className="hidden md:flex flex-col h-[calc(100vh-5rem)] sticky top-0 w-72 bg-surface-container-low border-r border-outline-variant/20 overflow-y-auto">
        <div className="p-6 flex flex-col gap-8">
          <div>
            <h2 className="font-headline text-lg font-semibold text-on-surface mb-4">
              Chemical Space
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-label text-xs text-on-surface-variant mb-2">
                  Include Elements
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded text-sm text-on-surface px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Li, Fe, O"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label text-xs text-on-surface-variant mb-2">
                  Exclude Elements
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded text-sm text-on-surface px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Toxic elements"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-headline text-lg font-semibold text-on-surface mb-4">
              Crystal System
            </h2>
            <div className="flex flex-col gap-2">
              {["Cubic", "Hexagonal", "Tetragonal", "Orthorhombic"].map(
                (sys) => (
                  <label
                    key={sys}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      className="form-checkbox bg-surface-container-lowest border-outline-variant/40 text-primary rounded-sm focus:ring-primary focus:ring-offset-surface-container-low"
                      type="checkbox"
                    />
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      {sys}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div>
            <h2 className="font-headline text-lg font-semibold text-on-surface mb-4">
              Properties
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-label text-xs text-on-surface-variant">
                    Band Gap (eV)
                  </label>
                  <span className="font-body text-xs text-primary">
                    0 - 5.2
                  </span>
                </div>
                <input
                  className="w-full h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                  type="range"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-label text-xs text-on-surface-variant">
                    Formation Energy (eV/atom)
                  </label>
                  <span className="font-body text-xs text-primary">
                    -4.0 - 0
                  </span>
                </div>
                <input
                  className="w-full h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                  type="range"
                />
              </div>
            </div>
          </div>

          <button className="mt-auto w-full py-2 bg-surface-container-highest hover:bg-surface-bright text-primary font-label text-sm rounded-md transition-colors border border-outline-variant/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
            Apply Filters
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-surface">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Materials Explorer
            </h1>
            <p className="text-on-surface-variant text-sm max-w-2xl">
              Querying global databases (Materials Project, AFLOW, OQMD) for
              advanced material structures and predicted properties.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-secondary-container/20 text-primary border border-secondary-container/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              142,854 Structures
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {materials.map((material, idx) => (
            <div
              key={idx}
              className="glass-card rounded-lg p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest/80 z-0"></div>

              <div className="relative z-10 flex justify-between items-start mb-4">
                <h3 className="font-headline text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {material.formula}
                </h3>
                <div className="px-2 py-1 bg-surface-container-highest rounded text-xs font-label text-on-surface-variant tracking-wider">
                  {material.crystalSystem}
                </div>
              </div>

              <div className="relative z-10 w-full h-40 bg-surface-container-lowest rounded-md mb-4 flex items-center justify-center overflow-hidden border border-outline-variant/10">
                <img
                  alt={`3D rendering of ${material.formula} crystal structure`}
                  className="w-full h-full object-cover opacity-80 mix-blend-screen group-hover:scale-105 transition-transform duration-500 text-center text-xs text-outline-variant italic flex items-center justify-center"
                  src={material.imageUrl}
                />
              </div>

              <div className="relative z-10 space-y-3 mt-auto">
                <div className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">
                    Symmetry Group
                  </span>
                  <span className="font-body text-on-surface">
                    {material.symmetryGroup}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Band Gap</span>
                  <span className="font-body text-on-surface">
                    {material.bandGap}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">
                    Formation Energy
                  </span>
                  <span className="font-body text-on-surface">
                    {material.formationEnergy}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="px-6 py-2 border border-outline-variant/30 rounded-md text-primary font-label text-sm hover:bg-surface-container-high transition-colors">
            Load More Results
          </button>
        </div>
      </main>
    </div>
  );
}
