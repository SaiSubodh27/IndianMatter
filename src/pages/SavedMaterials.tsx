// import React from "react";

export default function SavedMaterials() {
  const tableData = [
    {
      formula: "LiFePO4",
      id: "mat-8821a",
      element: "Li",
      date: "Oct 24, 2023",
      conductivity: "1.2 � 10?4",
      status: "Simulation Complete",
      statusType: "success",
    },
    {
      formula: "Na3V2(PO4)3",
      id: "mat-9104b",
      element: "Na",
      date: "Oct 22, 2023",
      conductivity: "8.4 � 10?5",
      status: "Pending DFT",
      statusType: "pending",
    },
    {
      formula: "SiO2",
      id: "mat-104c",
      element: "Si",
      date: "Oct 18, 2023",
      conductivity: "--",
      status: "Calculation Failed",
      statusType: "error",
    },
    {
      formula: "BaTiO3",
      id: "mat-442x",
      element: "Ti",
      date: "Oct 15, 2023",
      conductivity: "3.5 � 10?6",
      status: "Simulation Complete",
      statusType: "success",
    },
  ];

  return (
    <div className="flex-1 pt-8 px-4 md:px-8 lg:px-12 pb-24 max-w-7xl mx-auto w-full animate-in fade-in h-full flex flex-col">
      {/* Page Header */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              folder_special
            </span>
            <span className="font-label text-xs tracking-wider uppercase">
              Library
            </span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-[3.5rem] font-bold text-on-surface tracking-tight leading-none mb-3">
            Saved Materials
          </h2>
          <p className="font-body text-on-surface-variant text-sm md:text-base max-w-2xl tracking-wide">
            Manage your tracked crystallographic structures and review
            historical DFT simulation data.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="h-10 px-4 rounded-md ghost-border text-primary hover:bg-surface-container-highest flex items-center gap-2 molecular-transition font-label text-sm bg-surface-container-low">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export CSV
          </button>
          <button className="h-10 px-4 rounded-md gradient-btn text-on-primary font-label font-bold text-sm flex items-center gap-2 neon-glow molecular-transition hover:scale-[1.02] active:scale-95">
            <span className="material-symbols-outlined text-[18px]">
              play_circle
            </span>
            Batch Predict
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <section className="glass-card rounded-xl p-2 mb-8 ambient-shadow ghost-border flex flex-col sm:flex-row gap-2 shrink-0">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            search
          </span>
          <input
            className="w-full bg-transparent border-none text-on-surface placeholder:text-neutral-600 focus:ring-0 pl-10 h-10 font-body text-sm"
            placeholder="Search by formula, ID, or property..."
            type="text"
          />
        </div>
        <div className="h-px sm:h-10 w-full sm:w-px bg-outline-variant/30 hidden sm:block"></div>
        <div className="flex gap-2 shrink-0">
          <button className="h-10 px-4 rounded-lg bg-surface-container flex items-center gap-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high molecular-transition text-sm">
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
          <button className="h-10 px-4 rounded-lg bg-surface-container flex items-center gap-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high molecular-transition text-sm">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            Sort
          </button>
        </div>
      </section>

      {/* Data Grid View */}
      <section className="bg-surface-container-lowest rounded-xl ghost-border overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="py-4 px-6 font-label text-xs tracking-wider text-on-surface-variant w-12">
                  <input
                    className="rounded bg-surface-container-highest border-outline-variant text-primary focus:ring-primary/50 focus:ring-offset-surface-container-lowest"
                    type="checkbox"
                  />
                </th>
                <th className="py-4 px-6 font-label text-xs tracking-wider text-on-surface-variant">
                  Material Formula
                </th>
                <th className="py-4 px-6 font-label text-xs tracking-wider text-on-surface-variant">
                  Date Saved
                </th>
                <th className="py-4 px-6 font-label text-xs tracking-wider text-on-surface-variant text-right">
                  Pred. Conductivity (S/cm)
                </th>
                <th className="py-4 px-6 font-label text-xs tracking-wider text-on-surface-variant">
                  Status
                </th>
                <th className="py-4 px-6 font-label text-xs tracking-wider text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 font-body text-sm">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-surface-container-low/50 molecular-transition group"
                >
                  <td className="py-4 px-6">
                    <input
                      className="rounded bg-surface-container border-outline-variant/50 text-primary focus:ring-primary/50 focus:ring-offset-surface-container-lowest opacity-0 group-hover:opacity-100 transition-opacity"
                      type="checkbox"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center text-primary font-label text-xs border border-primary/20">
                        {row.element}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface font-headline tracking-wide">
                          {row.formula}
                        </div>
                        <div className="text-xs text-on-surface-variant/70 font-mono mt-0.5">
                          ID: {row.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">
                    {row.date}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-on-surface">
                    {row.conductivity}
                  </td>
                  <td className="py-4 px-6">
                    {row.statusType === "success" && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary neon-glow relative">
                          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                        </div>
                        {row.status}
                      </div>
                    )}
                    {row.statusType === "pending" && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px]">
                          schedule
                        </span>
                        {row.status}
                      </div>
                    )}
                    {row.statusType === "error" && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-error-container/20 border border-error-container/50 text-error text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px]">
                          error
                        </span>
                        {row.status}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-neutral-500 hover:text-primary molecular-transition p-1">
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="py-4 px-6 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest shrink-0">
          <span className="text-xs text-on-surface-variant font-body">
            Showing 1-4 of 124 saved structures
          </span>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high disabled:opacity-50 molecular-transition"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high molecular-transition">
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
