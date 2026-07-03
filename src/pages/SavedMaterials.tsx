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
    <div className="enterprise-page">
      <div className="enterprise-shell flex h-full min-h-screen flex-col">
        <header className="mb-8 flex flex-col gap-6 border-b border-gray-200 pb-6 dark:border-neutral-800 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 dark:text-neutral-300">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                folder_special
              </span>
              <span className="font-label text-xs uppercase tracking-wider">
                Library
              </span>
            </div>
            <h2 className="mb-3 font-headline text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-neutral-100 md:text-4xl lg:text-[3.5rem]">
              Saved Materials
            </h2>
            <p className="max-w-2xl text-sm tracking-wide text-gray-600 dark:text-neutral-400 md:text-base">
              Manage your tracked crystallographic structures and review
              historical DFT simulation data.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button className="enterprise-button-secondary h-10 px-4 py-0">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Export CSV
            </button>
            <button className="enterprise-button-primary h-10 px-4 py-0 font-label text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">
                play_circle
              </span>
              Batch Predict
            </button>
          </div>
        </header>

        <section className="enterprise-panel mb-8 flex shrink-0 flex-col gap-2 p-2 sm:flex-row">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500">
              search
            </span>
            <input
              className="enterprise-input h-10 pl-10"
              placeholder="Search by formula, ID, or property..."
              type="text"
            />
          </div>
          <div className="hidden h-px w-full bg-gray-200 sm:block sm:h-10 sm:w-px dark:bg-neutral-800"></div>
          <div className="flex gap-2 shrink-0">
            <button className="enterprise-button-secondary h-10 px-4 py-0 text-sm">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              Filter
            </button>
            <button className="enterprise-button-secondary h-10 px-4 py-0 text-sm">
              <span className="material-symbols-outlined text-[18px]">
                sort
              </span>
              Sort
            </button>
          </div>
        </section>

        <section className="enterprise-panel flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
                  <th className="w-12 py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    <input
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                      type="checkbox"
                    />
                  </th>
                  <th className="py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Material Formula
                  </th>
                  <th className="py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Date Saved
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Pred. Conductivity (S/cm)
                  </th>
                  <th className="py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Status
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm dark:divide-neutral-800">
                {tableData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="group transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60"
                  >
                    <td className="py-4 px-6">
                      <input
                        className="rounded border-gray-300 text-gray-900 opacity-0 transition-opacity focus:ring-gray-300 group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-gray-100 text-xs font-medium text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                          {row.element}
                        </div>
                        <div>
                          <div className="font-headline font-medium tracking-wide text-gray-900 dark:text-neutral-100">
                            {row.formula}
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-gray-500 dark:text-neutral-400">
                            ID: {row.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-neutral-400">
                      {row.date}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-gray-900 dark:text-neutral-100">
                      {row.conductivity}
                    </td>
                    <td className="py-4 px-6">
                      {row.statusType === "success" && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <div className="relative h-1.5 w-1.5 rounded-full bg-emerald-500">
                            <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-60"></div>
                          </div>
                          {row.status}
                        </div>
                      )}
                      {row.statusType === "pending" && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {row.status}
                        </div>
                      )}
                      {row.statusType === "error" && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
                          <span className="material-symbols-outlined text-[14px]">
                            error
                          </span>
                          {row.status}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100">
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
          <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
            <span className="text-xs text-gray-500 dark:text-neutral-400">
              Showing 1-4 of 124 saved structures
            </span>
            <div className="flex gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                disabled
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
