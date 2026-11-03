/**
 * DEAD CODE — unused page (no route in App.tsx). Safe to delete.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Activity,
  Download,
  ExternalLink,
} from "lucide-react";
import CrystalViewerCanvas from "./CrystalViewerCanvas";

const liCoO2Atoms = [
  {
    species: "Li",
    fractional_coordinates: [0.0, 0.0, 0.0] as [number, number, number],
  },
  {
    species: "Li",
    fractional_coordinates: [0.5, 0.5, 0.5] as [number, number, number],
  },
  {
    species: "Co",
    fractional_coordinates: [0.0, 0.0, 0.5] as [number, number, number],
  },
  {
    species: "Co",
    fractional_coordinates: [0.5, 0.5, 0.0] as [number, number, number],
  },
  {
    species: "O",
    fractional_coordinates: [0.0, 0.0, 0.24] as [number, number, number],
  },
  {
    species: "O",
    fractional_coordinates: [0.0, 0.0, 0.76] as [number, number, number],
  },
  {
    species: "O",
    fractional_coordinates: [0.5, 0.5, 0.24] as [number, number, number],
  },
  {
    species: "O",
    fractional_coordinates: [0.5, 0.5, 0.76] as [number, number, number],
  },
];

export default function MaterialDetailsPage() {
  const [activeTab, setActiveTab] = useState<
    "structure" | "electronic" | "thermo" | "literature"
  >("structure");

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/app/materials"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C929C] hover:text-[#F1641D] transition-colors mb-3"
        >
          <ArrowLeft size={14} /> Back to Materials Search
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#F1641D] uppercase tracking-wider font-headline">
              <span>Materials Project • mp-22526</span>
              <span>• Trigonal (R -3 m)</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-[#1E2227] tracking-tight mt-1">
              LiCoO₂
            </h1>
            <p className="text-sm text-[#5F6771]">
              Lithium Cobalt Oxide — Layered Cathode Material
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/app/dft"
              className="px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck size={14} className="text-[#F1641D]" /> Validate with
              DFT
            </Link>
            <Link
              to="/app/predict"
              className="px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5 shadow-sm"
            >
              <Activity size={14} /> Predict Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Main Split Stage: 3D Visualization + Key Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3D Visualizer Canvas (7 Columns) */}
        <div className="lg:col-span-7 min-h-[560px]">
          <CrystalViewerCanvas
            atoms={liCoO2Atoms}
            lattice={{
              a: 2.816,
              b: 2.816,
              c: 14.054,
              alpha: 90,
              beta: 90,
              gamma: 120,
            }}
            materialLabel="LiCoO₂"
            sourceLabel="Materials Project • mp-22526"
          />
        </div>

        {/* Fundamental Properties Card (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4">
          <h3 className="font-headline font-bold text-lg text-[#1E2227]">
            Intrinsic Properties
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]">
              <span className="text-[#5F6771]">Band Gap (DFT)</span>
              <span className="font-bold text-[#1E2227]">2.45 eV (Direct)</span>
            </div>
            <div className="bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]">
              <span className="text-[#5F6771]">Formation Energy</span>
              <span className="font-bold text-[#2E7D32]">-2.180 eV/atom</span>
            </div>
            <div className="bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]">
              <span className="text-[#5F6771]">Energy Above Hull</span>
              <span className="font-bold text-[#2E7D32]">
                0.000 eV (On Hull)
              </span>
            </div>
            <div className="bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]">
              <span className="text-[#5F6771]">Ionic Conductivity (300K)</span>
              <span className="font-bold text-[#F1641D]">1.24 × 10⁻³ S/cm</span>
            </div>
            <div className="bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]">
              <span className="text-[#5F6771]">Crystal Density</span>
              <span className="font-bold text-[#1E2227]">5.06 g/cm³</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert("CIF structure downloaded.")}
              className="w-full py-2.5 bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl text-xs font-semibold text-[#1E2227] hover:bg-[#EFE5DC] transition-colors flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download Validated CIF
            </button>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Section */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-card border border-[#EFE5DC] space-y-6">
        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 border-b border-[#F2E7DC] pb-3">
          {[
            { id: "structure", label: "Crystallographic Lattice" },
            { id: "electronic", label: "Electronic Band Structure" },
            { id: "thermo", label: "Thermodynamic Hull" },
            { id: "literature", label: "Research Citations" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "structure"
                    | "electronic"
                    | "thermo"
                    | "literature",
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#F1641D] text-white shadow-sm"
                  : "bg-[#FAF4EE] text-[#5F6771] hover:text-[#1E2227]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "structure" && (
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-base text-[#1E2227]">
              Lattice Vectors (Conventional)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]">
                <span className="text-[#8C929C] block text-[10px]">a</span>
                <span className="font-bold">2.816 Å</span>
              </div>
              <div className="bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]">
                <span className="text-[#8C929C] block text-[10px]">b</span>
                <span className="font-bold">2.816 Å</span>
              </div>
              <div className="bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]">
                <span className="text-[#8C929C] block text-[10px]">c</span>
                <span className="font-bold">14.054 Å</span>
              </div>
              <div className="bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]">
                <span className="text-[#8C929C] block text-[10px]">Volume</span>
                <span className="font-bold">96.5 Å³</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "electronic" && (
          <div className="bg-[#FAF4EE] p-8 rounded-2xl border border-[#EFE5DC] text-center space-y-2">
            <p className="font-headline font-bold text-base text-[#1E2227]">
              Electronic Density of States (DOS)
            </p>
            <p className="text-xs text-[#6C737E]">
              Valence band dominated by Co 3d and O 2p hybridization. Direct
              electronic band gap = 2.45 eV.
            </p>
          </div>
        )}

        {activeTab === "thermo" && (
          <div className="bg-[#FAF4EE] p-8 rounded-2xl border border-[#EFE5DC] text-center space-y-2">
            <p className="font-headline font-bold text-base text-[#1E2227]">
              Li-Co-O Convex Hull
            </p>
            <p className="text-xs text-[#2E7D32] font-semibold">
              Material lies directly on the thermodynamic convex hull (Ehull =
              0.000 eV). Zero decomposition enthalpy into binary constituents.
            </p>
          </div>
        )}

        {activeTab === "literature" && (
          <div className="space-y-3">
            {[
              {
                title: "Electrochemical characterization of LiCoO2 cathodes",
                journal: "J. Power Sources",
                year: "2023",
                doi: "10.1016/j.jpowsour.2023",
              },
              {
                title:
                  "First-principles study of Li-ion diffusion in layered oxides",
                journal: "Phys. Rev. B",
                year: "2022",
                doi: "10.1103/PhysRevB.105",
              },
            ].map((paper, idx) => (
              <div
                key={idx}
                className="bg-[#FAF4EE] p-4 rounded-xl border border-[#EFE5DC] flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-bold text-[#1E2227]">{paper.title}</p>
                  <p className="text-[11px] text-[#6C737E] mt-0.5">
                    {paper.journal} ({paper.year})
                  </p>
                </div>
                <span className="text-[#F1641D] font-mono flex items-center gap-1">
                  DOI <ExternalLink size={12} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
