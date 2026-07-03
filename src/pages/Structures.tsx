import { useState } from "react";

export default function Structures() {
  const [structures] = useState([
    {
      id: "1",
      name: "SrTiO3",
      system: "Perovskite",
      atoms: 5,
      date: "2026-07-01",
      status: "Analyzed",
    },
    {
      id: "2",
      name: "MoS2",
      system: "2D Monolayer",
      atoms: 3,
      date: "2026-07-02",
      status: "Pending",
    },
    {
      id: "3",
      name: "GaN",
      system: "Semiconductor",
      atoms: 2,
      date: "2026-06-28",
      status: "Failed",
    },
  ]);

  return (
    <div className="enterprise-page">
      <div className="enterprise-shell flex h-full min-h-screen flex-col gap-8">
        <div className="flex items-end justify-between gap-6 border-b border-gray-200 pb-6 dark:border-neutral-800">
          <div>
            <h2 className="mb-2 font-headline text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              Crystal Structures
            </h2>
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              View, manage, and explore 3D atomic structures.
            </p>
          </div>
          <button className="enterprise-button-primary px-6 py-3 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">upload</span>
            Upload CIF
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: List of structures */}
          <div className="enterprise-panel flex h-[600px] flex-col overflow-hidden lg:col-span-1">
            <div className="border-b border-gray-200 bg-gray-50 p-4 font-headline font-bold text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
              My Structures
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {structures.map((s) => (
                <div
                  key={s.id}
                  className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline font-bold text-gray-900 dark:text-neutral-100">
                      {s.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        s.status === "Analyzed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : s.status === "Pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-gray-500 dark:text-neutral-400">
                    {s.system} &bull; {s.atoms} atoms
                  </p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="enterprise-button-secondary flex-1 py-1.5 text-xs">
                      View
                    </button>
                    <button className="enterprise-button-secondary flex-1 py-1.5 text-xs">
                      Calculate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Viewer */}
          <div className="enterprise-panel relative flex h-[600px] flex-col overflow-hidden lg:col-span-2">
            <div className="z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 font-headline font-bold text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
              <span>3D Viewer: SrTiO3</span>
              <div className="flex gap-2">
                <button
                  className="rounded bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  title="Reset View"
                >
                  <span className="material-symbols-outlined text-sm">
                    center_focus_strong
                  </span>
                </button>
                <button
                  className="rounded bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  title="Toggle Unit Cell"
                >
                  <span className="material-symbols-outlined text-sm">
                    grid_4x4
                  </span>
                </button>
              </div>
            </div>
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gray-100 dark:bg-neutral-950">
              {/* 3D viewer placeholder / background grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  backgroundPosition: "center center",
                }}
              ></div>

              <div className="z-10 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <span className="material-symbols-outlined mb-4 text-6xl text-gray-700 dark:text-neutral-300 animate-pulse">
                  view_in_ar
                </span>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-neutral-100">
                  Interactive 3D Viewer
                </h3>
                <p className="max-w-sm text-sm text-gray-600 dark:text-neutral-400">
                  Integration point for 3Dmol.js or react-three-fiber to render
                  bonding potentials, energy surfaces, and electron density.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
