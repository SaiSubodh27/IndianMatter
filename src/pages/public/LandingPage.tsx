import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Sun,
  Leaf,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
  Mail,
  MapPin,
  Users,
  Menu,
  X,
  Atom,
  Database,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const exploreMaterials = [
  {
    id: "nmc",
    formula: "NMC",
    fullName: "Lithium Nickel Manganese Cobalt Oxide",
    structure: "Layered Oxide",
    image: "/assets/mineral_nmc.png",
    features: [
      "High energy density",
      "Good cycling performance",
      "Widely researched",
    ],
    detailsUrl: "/app/materials",
  },
  {
    id: "lfp",
    formula: "LFP",
    fullName: "Lithium Iron Phosphate",
    structure: "Olivine Structure",
    image: "/assets/mineral_lfp.png",
    features: ["Thermal stable", "Long cycle life", "Cost effective & safe"],
    detailsUrl: "/app/materials",
  },
  {
    id: "licoo2",
    formula: "LiCoO₂",
    fullName: "Lithium Cobalt Oxide",
    structure: "Layered Oxide",
    image: "/assets/mineral_licoo2.png",
    popular: true,
    features: [
      "High energy density",
      "Stable structure",
      "Widely used in LIBs",
    ],
    detailsUrl: "/app/materials",
  },
  {
    id: "lmo",
    formula: "LMO",
    fullName: "Lithium Manganese Oxide",
    structure: "Spinel Structure",
    image: "/assets/mineral_lmo.png",
    features: [
      "High power capability",
      "Cost effective",
      "Environmentally friendly",
    ],
    detailsUrl: "/app/materials",
  },
  {
    id: "nca",
    formula: "NCA",
    fullName: "Lithium Nickel Cobalt Aluminium Oxide",
    structure: "Layered Oxide",
    image: "/assets/mineral_nca.png",
    features: [
      "High energy density",
      "Good thermal stability",
      "Promising for EVs",
    ],
    detailsUrl: "/app/materials",
  },
];

const databases = [
  {
    id: "mp",
    name: "Materials Project",
    image: "/assets/db_mp.png",
    tagline: "Open-access computed material properties using DFT.",
    scope: "Structural, electronic, magnetic properties",
    org: "UC Berkeley & LBNL",
    popular: true,
    url: "https://materialsproject.org",
  },
  {
    id: "oqmd",
    name: "OQMD",
    image: "/assets/db_oqmd.png",
    tagline: "Open Quantum Materials Database for computed materials data.",
    scope: "Thermodynamic, stability, structural properties",
    org: "Caltech & Northwestern",
    url: "https://oqmd.org",
  },
  {
    id: "jarvis",
    name: "JARVIS",
    image: "/assets/db_jarvis.png",
    tagline: "Joint Automated Repository for Various Integrated Simulations.",
    scope: "DFT, ML-ready data, high-throughput APIs",
    org: "NIST",
    url: "https://jarvis.nist.gov",
  },
  {
    id: "aflow",
    name: "AFLOW",
    image: "/assets/db_aflow.png",
    tagline: "High-throughput computational materials database.",
    scope: "Properties, phase diagrams & dependencies",
    org: "Duke University",
    url: "https://aflowlib.org",
  },
  {
    id: "nomad",
    name: "NOMAD",
    image: "/assets/db_nomad.png",
    tagline: "The FAIR data platform for materials science.",
    scope: "DFT, experimental, simulation repository",
    org: "EuroHPC & Max Planck",
    url: "https://nomad-lab.eu",
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Predict Properties",
    desc: "Faster, smarter decisions from AI-driven property predictions across thousands of materials.",
  },
  {
    icon: Search,
    title: "Explore Possibilities",
    desc: "From data to discovery — search federated databases with periodic-table precision.",
  },
  {
    icon: Leaf,
    title: "Enable a Sustainable Future",
    desc: "Accelerating next-generation materials for a cleaner, greener world.",
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [exploreIdx, setExploreIdx] = useState(2); // LiCoO2 centered
  const [resourceIdx, setResourceIdx] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactState, setContactState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Intersection observer for active nav
  useEffect(() => {
    const sections = ["home", "explore", "about", "resources", "contact"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactState("loading");
    setTimeout(() => {
      setContactState("success");
      setTimeout(() => {
        setContactState("idle");
        setContactForm({ name: "", email: "", subject: "", message: "" });
      }, 4000);
    }, 1200);
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#explore", label: "Explore" },
    { href: "#about", label: "About" },
    { href: "#resources", label: "Resources" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="landing-page min-h-screen bg-white text-[#38240D] overflow-x-hidden selection-orange">
      {/* ── Subtle organic background blobs — CSS only, not images ── */}
      <div
        aria-hidden="true"
        className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(253,251,212,0.5) 0%, transparent 70%)",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-100px] left-[-150px] w-[500px] h-[500px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(212,126,48,0.06) 0%, transparent 70%)",
          borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EBEBEB]/80">
        <div
          className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 h-18 flex items-center justify-between gap-6"
          style={{ height: "72px" }}
        >
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="IndianMatter Home"
          >
            <img
              src="/mi-icon-mark.png"
              alt=""
              aria-hidden="true"
              className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-headline font-bold text-[22px] text-[#1A1A1A] tracking-tight">
              Indian<span style={{ color: "#D47E30" }}>Matter</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8 lg:gap-10"
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, label }) => {
              const sectionId = href.slice(1);
              const active = activeSection === sectionId;
              return (
                <a
                  key={href}
                  href={href}
                  className="text-[14px] font-medium transition-colors duration-120"
                  style={{ color: active ? "#D47E30" : "#6B6B6B" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#D47E30")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active
                      ? "#D47E30"
                      : "#6B6B6B")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              aria-label="Toggle light/dark mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F2F0] transition-all"
            >
              <Sun size={17} />
            </button>
            <Link
              to="/signin"
              className="hidden sm:inline-flex items-center gap-2 text-[14px] font-medium px-5 py-2.5 rounded-full transition-all duration-120 active:scale-95"
              style={{
                backgroundColor: "#D47E30",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(212,126,48,0.32)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#B8671E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#D47E30")
              }
            >
              Sign In <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F2F2F0] transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#EBEBEB] px-6 py-5 space-y-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-3 text-[15px] font-medium text-[#3D3D3D] hover:text-[#D47E30] transition-colors"
              >
                {label}
              </a>
            ))}
            <Link
              to="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: "#D47E30" }}
            >
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-24 lg:pt-24 lg:pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="lg:col-span-7 space-y-7">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline">
              Materials for a Better Tomorrow
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-[#1A1A1A] tracking-tight leading-[1.02]">
              Indian<span style={{ color: "#D47E30" }}>Matter</span>
            </h1>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-light text-[#6B6B6B] tracking-wide">
              Predict. Explore. Accelerate.
            </h2>

            <p className="text-base lg:text-[17px] text-[#6B6B6B] max-w-[520px] leading-relaxed">
              AI-driven insights for next-generation materials discovery,
              designed for a sustainable tomorrow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/app"
                className="inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-8 py-3.5 rounded-full transition-all duration-120 active:scale-95"
                style={{
                  backgroundColor: "#D47E30",
                  boxShadow: "0 10px 28px rgba(212,126,48,0.32)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#B8671E";
                  e.currentTarget.style.boxShadow =
                    "0 14px 36px rgba(212,126,48,0.40)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#D47E30";
                  e.currentTarget.style.boxShadow =
                    "0 10px 28px rgba(212,126,48,0.32)";
                }}
              >
                Start Your Research <ArrowRight size={16} />
              </Link>
              <a
                href="#explore"
                className="inline-flex items-center gap-2 text-[#3D3D3D] text-[15px] font-medium px-7 py-3.5 rounded-full bg-white border border-[#EBEBEB] hover:border-[#D47E30] hover:text-[#D47E30] transition-all duration-120 shadow-soft"
              >
                Try It <ArrowRight size={15} />
              </a>
            </div>

            {/* Micro social proof */}
            <div className="flex items-center gap-4 pt-4 text-[12px] text-[#9A9A9A]">
              <span className="flex items-center gap-1.5">
                <Database size={13} style={{ color: "#D47E30" }} />5 Scientific
                Databases
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DDDBD8]" />
              <span className="flex items-center gap-1.5">
                <Atom size={13} style={{ color: "#D47E30" }} />
                ML Property Prediction
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#DDDBD8]" />
                DFT Validation
              </span>
            </div>
          </div>

          {/* Right — hero visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] lg:min-h-[440px]">
            {/* Glowing ring behind molecule */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 55% 50%, rgba(212,126,48,0.10) 0%, rgba(253,251,212,0.25) 40%, transparent 70%)",
              }}
            />
            {/* Rotating lattice ring SVG */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              viewBox="0 0 400 400"
            >
              <circle
                cx="200"
                cy="200"
                r="160"
                fill="none"
                stroke="#D47E30"
                strokeWidth="0.5"
                strokeDasharray="6 8"
              />
              <circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="#8D5A2B"
                strokeWidth="0.4"
                strokeDasharray="4 6"
              />
              <circle
                cx="200"
                cy="200"
                r="80"
                fill="none"
                stroke="#D47E30"
                strokeWidth="0.3"
                strokeDasharray="3 5"
              />
            </svg>

            {/* Annotation tags — CSS positioned */}
            <span
              className="absolute top-[18%] right-[12%] text-[10px] font-mono text-[#8D5A2B] bg-[#FDFBD4] border border-[#EDE8E2] px-2.5 py-1 rounded-full shadow-soft pointer-events-none"
              aria-hidden="true"
            >
              LiCoO₂
            </span>
            <span
              className="absolute bottom-[22%] left-[8%] text-[10px] font-mono text-[#8D5A2B] bg-[#FDFBD4] border border-[#EDE8E2] px-2.5 py-1 rounded-full shadow-soft pointer-events-none"
              aria-hidden="true"
            >
              R -3 m
            </span>
            <span
              className="absolute top-[42%] left-[4%] text-[10px] font-mono text-[#9A9A9A] bg-white border border-[#EBEBEB] px-2.5 py-1 rounded-full shadow-soft pointer-events-none"
              aria-hidden="true"
            >
              Band Gap: 2.45 eV
            </span>

            {/* Main molecule image */}
            <div className="relative w-[260px] sm:w-[300px] lg:w-[340px]">
              <img
                src="/assets/hero_molecule_clean.png"
                alt="Crystal molecular structure visualization"
                className="w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(141,90,43,0.18)]"
                style={{
                  filter: "drop-shadow(0 24px 40px rgba(212,126,48,0.15))",
                }}
              />
            </div>

            {/* Cursive annotation */}
            <span
              className="absolute bottom-[8%] right-[10%] font-handwriting text-[#825E34] text-2xl leading-tight rotate-[-6deg] pointer-events-none select-none"
              aria-hidden="true"
            >
              Crystal Paradigm
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURE STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-[#EBEBEB]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#FBF0E6" }}
                >
                  <Icon
                    size={20}
                    style={{ color: "#D47E30" }}
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-[17px] text-[#1A1A1A] mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EXPLORE — Physical Card Deck
      ═══════════════════════════════════════════════════════════ */}
      <section id="explore" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-3">
              Material Library
            </p>
            <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight mb-4">
              Explore Materials
            </h2>
            <p className="text-base text-[#6B6B6B] max-w-xl mx-auto">
              Browse key battery and energy materials — each with structural,
              electronic, and thermodynamic properties.
            </p>
          </div>

          {/* Card deck */}
          <div
            className="relative h-[440px] sm:h-[480px] flex items-center justify-center overflow-visible"
            aria-label="Materials card deck"
          >
            {exploreMaterials.map((mat, idx) => {
              const offset = idx - exploreIdx;
              const absOffset = Math.abs(offset);

              // Only render ±2 from center
              if (absOffset > 2) return null;

              const scale = offset === 0 ? 1 : absOffset === 1 ? 0.93 : 0.84;
              const xShift = offset * 200;
              const rotate = offset * -2.5;
              const zIndex = 10 - absOffset * 3;
              const opacity = absOffset > 1 ? 0.55 : 1;
              const isCenter = offset === 0;

              return (
                <article
                  key={mat.id}
                  onClick={() => !isCenter && setExploreIdx(idx)}
                  style={{
                    position: "absolute",
                    transform: `translateX(${xShift}px) scale(${scale}) rotate(${rotate}deg)`,
                    zIndex,
                    opacity,
                    transition:
                      "all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: isCenter ? "default" : "pointer",
                  }}
                  className="w-[280px] sm:w-[300px]"
                  aria-label={`${mat.formula} — ${mat.fullName}`}
                >
                  {/* Back frame */}
                  {isCenter && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        transform: "rotate(2deg) scale(1.02) translateY(10px)",
                        transformOrigin: "center bottom",
                        borderRadius: "2.5rem",
                        background:
                          "linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",
                        border: "1px solid #EDE8E2",
                        zIndex: -1,
                      }}
                    />
                  )}

                  {/* Card front */}
                  <div
                    className="bg-white rounded-[2.5rem] p-6 flex flex-col gap-4"
                    style={{
                      boxShadow: isCenter
                        ? "0 12px 48px rgba(0,0,0,0.10)"
                        : "0 4px 16px rgba(0,0,0,0.06)",
                      border: "1px solid #EBEBEB",
                    }}
                  >
                    {/* Popular badge */}
                    {mat.popular && (
                      <span
                        className="self-start text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "#FBF0E6", color: "#D47E30" }}
                      >
                        Popular
                      </span>
                    )}

                    {/* Formula & structure */}
                    <div>
                      <h3 className="font-headline font-bold text-3xl text-[#1A1A1A] tracking-tight">
                        {mat.formula}
                      </h3>
                      <p className="text-[11px] text-[#9A9A9A] font-medium uppercase tracking-wider mt-0.5">
                        {mat.structure}
                      </p>
                      <p className="text-xs text-[#6B6B6B] mt-1 leading-snug">
                        {mat.fullName}
                      </p>
                    </div>

                    {/* Image */}
                    <div className="h-32 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#F2F2F0] overflow-hidden">
                      <img
                        src={mat.image}
                        alt={`${mat.formula} crystal structure`}
                        className="max-h-[110px] max-w-full object-contain"
                        style={{
                          filter: "drop-shadow(0 4px 8px rgba(141,90,43,0.12))",
                        }}
                      />
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5">
                      {mat.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-[12px] text-[#6B6B6B]"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: "#D47E30" }}
                            aria-hidden="true"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {isCenter && (
                      <Link
                        to={mat.detailsUrl}
                        className="mt-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-120"
                        style={{ backgroundColor: "#D47E30" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#B8671E")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#D47E30")
                        }
                      >
                        View Material <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Deck controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setExploreIdx((p) => Math.max(0, p - 1))}
              disabled={exploreIdx === 0}
              aria-label="Previous material"
              className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#D47E30] hover:text-[#D47E30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-120"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {exploreMaterials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setExploreIdx(idx)}
                  aria-label={`Go to material ${idx + 1}`}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: exploreIdx === idx ? "#D47E30" : "#DDDBD8",
                    width: exploreIdx === idx ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setExploreIdx((p) =>
                  Math.min(exploreMaterials.length - 1, p + 1),
                )
              }
              disabled={exploreIdx === exploreMaterials.length - 1}
              aria-label="Next material"
              className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#D47E30] hover:text-[#D47E30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-120"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT — Crystal Paradigm
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="about"
        className="py-24 lg:py-32 bg-white border-y border-[#EBEBEB]"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Visual */}
            <div className="relative flex items-center justify-center">
              {/* Scientific lattice diagram — SVG generated */}
              <div className="relative w-full max-w-[400px]">
                {/* Soft cream blob behind */}
                <div
                  aria-hidden="true"
                  className="absolute inset-[-10%] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(253,251,212,0.6) 0%, transparent 70%)",
                  }}
                />
                {/* Crystal lattice SVG */}
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-auto"
                  aria-label="Crystal lattice visualization"
                >
                  {/* Lattice grid lines */}
                  {[80, 160, 240, 320].map((x) =>
                    [80, 160, 240, 320].map((y) => (
                      <g key={`${x}-${y}`}>
                        {x < 320 && (
                          <line
                            x1={x}
                            y1={y}
                            x2={x + 80}
                            y2={y}
                            stroke="#D47E30"
                            strokeWidth="0.8"
                            strokeOpacity="0.25"
                          />
                        )}
                        {y < 320 && (
                          <line
                            x1={x}
                            y1={y}
                            x2={x}
                            y2={y + 80}
                            stroke="#D47E30"
                            strokeWidth="0.8"
                            strokeOpacity="0.25"
                          />
                        )}
                        {/* Diagonal bonds */}
                        {x < 320 && y < 320 && (
                          <>
                            <line
                              x1={x}
                              y1={y}
                              x2={x + 80}
                              y2={y + 80}
                              stroke="#8D5A2B"
                              strokeWidth="0.5"
                              strokeOpacity="0.12"
                            />
                            <line
                              x1={x + 80}
                              y1={y}
                              x2={x}
                              y2={y + 80}
                              stroke="#8D5A2B"
                              strokeWidth="0.5"
                              strokeOpacity="0.12"
                            />
                          </>
                        )}
                      </g>
                    )),
                  )}
                  {/* Atom nodes */}
                  {[80, 160, 240, 320].map((x) =>
                    [80, 160, 240, 320].map((y) => {
                      const isCenter = x === 200 || y === 200;
                      return (
                        <g key={`atom-${x}-${y}`}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isCenter ? 8 : 5}
                            fill={
                              x === 200 && y === 200
                                ? "#D47E30"
                                : isCenter
                                  ? "#8D5A2B"
                                  : "white"
                            }
                            stroke={
                              x === 200 && y === 200 ? "#D47E30" : "#D47E30"
                            }
                            strokeWidth={x === 200 && y === 200 ? 0 : 1.2}
                            strokeOpacity="0.45"
                          />
                          {x === 200 && y === 200 && (
                            <circle
                              cx={200}
                              cy={200}
                              r={20}
                              fill="none"
                              stroke="#D47E30"
                              strokeWidth="1"
                              strokeOpacity="0.2"
                            />
                          )}
                        </g>
                      );
                    }),
                  )}
                  {/* Labels */}
                  <text
                    x="210"
                    y="195"
                    fontSize="9"
                    fill="#8D5A2B"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.7"
                  >
                    Li
                  </text>
                  <text
                    x="162"
                    y="165"
                    fontSize="8"
                    fill="#9A9A9A"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.6"
                  >
                    Co
                  </text>
                  <text
                    x="242"
                    y="165"
                    fontSize="8"
                    fill="#9A9A9A"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.6"
                  >
                    O
                  </text>
                </svg>

                {/* Crystal specimen image overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img
                    src="/assets/about_lattice_clean.png"
                    alt="Crystal lattice model"
                    className="w-[55%] h-auto object-contain"
                    style={{
                      filter: "drop-shadow(0 8px 24px rgba(141,90,43,0.16))",
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-3">
                  Our Approach
                </p>
                <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight mb-4">
                  The Crystal Paradigm
                </h2>
                <p className="text-base text-[#6B6B6B] leading-relaxed">
                  <strong className="text-[#3D3D3D] font-semibold">
                    Inherent Matters.
                  </strong>{" "}
                  Every material's behaviour — conductivity, stability,
                  reactivity — is encoded in its crystal structure. IndianMatter
                  was built on this principle.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Atom,
                    title: "Crystal-Centric Approach",
                    desc: "We treat crystallographic data as the ground truth for all property predictions and validations.",
                  },
                  {
                    icon: BarChart3,
                    title: "Property Prediction",
                    desc: "Surrogate ML models trained on DFT datasets enable fast, accurate property screening without expensive simulations.",
                  },
                  {
                    icon: Leaf,
                    title: "Sustainable Impact",
                    desc: "Accelerating discovery of materials that enable cleaner energy, lighter batteries, and greener chemistry.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "#FBF0E6" }}
                    >
                      <Icon
                        size={18}
                        style={{ color: "#D47E30" }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#1A1A1A] mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          RESOURCES — Scientific Databases
      ═══════════════════════════════════════════════════════════ */}
      <section id="resources" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-3">
              Connected Sources
            </p>
            <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight mb-4">
              Scientific Databases
            </h2>
            <p className="text-base text-[#6B6B6B] max-w-xl mx-auto">
              IndianMatter federates across the world's leading open-access
              computational materials databases.
            </p>
          </div>

          {/* Database cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {databases.map((db) => (
              <a
                key={db.id}
                href={db.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl p-6 border border-[#EBEBEB] hover:border-[#D47E30]/40 hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAFAF8] border border-[#F2F2F0] flex items-center justify-center overflow-hidden">
                      <img
                        src={db.image}
                        alt={db.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-[15px] text-[#1A1A1A]">
                        {db.name}
                      </h3>
                      {db.popular && (
                        <span className="text-[9px] font-bold tracking-wider uppercase text-[#D47E30]">
                          Most Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-[#DDDBD8] group-hover:text-[#D47E30] transition-colors shrink-0 mt-1"
                  />
                </div>

                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  {db.tagline}
                </p>

                <div className="mt-auto pt-2 border-t border-[#F2F2F0]">
                  <p className="text-[11px] text-[#9A9A9A]">{db.scope}</p>
                  <p className="text-[11px] font-medium text-[#6B6B6B] mt-0.5">
                    by {db.org}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="py-24 lg:py-32 bg-white border-t border-[#EBEBEB]"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left info */}
            <div className="space-y-8">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-3">
                  Get in Touch
                </p>
                <h2 className="text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight mb-4">
                  Contact
                </h2>
                <p className="text-base text-[#6B6B6B] leading-relaxed max-w-md">
                  For research partnerships, questions about the platform, or
                  collaboration opportunities — we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "research@indianmatter.ai",
                  },
                  { icon: MapPin, label: "Location", value: "India" },
                  {
                    icon: Users,
                    label: "Collaboration",
                    value: "Open to research partnerships",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#FBF0E6" }}
                    >
                      <Icon
                        size={17}
                        style={{ color: "#D47E30" }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#9A9A9A] uppercase tracking-wider font-medium">
                        {label}
                      </p>
                      <p className="text-sm text-[#3D3D3D] font-medium mt-0.5">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crystal decoration */}
              <div className="pt-4 pointer-events-none select-none opacity-60">
                <img
                  src="/assets/contact_crystal.png"
                  alt=""
                  aria-hidden="true"
                  className="w-24 h-auto object-contain"
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(141,90,43,0.15))",
                  }}
                />
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              <form
                onSubmit={handleContactSubmit}
                className="bg-[#FAFAF8] rounded-3xl p-8 border border-[#EBEBEB] space-y-5"
                aria-label="Contact form"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[12px] font-medium text-[#3D3D3D] mb-1.5"
                    >
                      Name <span className="text-[#D47E30]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder="Your full name"
                      className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[12px] font-medium text-[#3D3D3D] mb-1.5"
                    >
                      Email <span className="text-[#D47E30]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@institution.edu"
                      className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-[12px] font-medium text-[#3D3D3D] mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Research collaboration / Query / Other"
                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[12px] font-medium text-[#3D3D3D] mb-1.5"
                  >
                    Message <span className="text-[#D47E30]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tell us about your research interest or question..."
                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8] resize-none"
                  />
                </div>

                {/* Submit states */}
                {contactState === "success" ? (
                  <div className="flex items-center gap-2.5 py-3 px-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                    <CheckCircle2 size={16} className="shrink-0" />
                    Thank you! We'll be in touch soon.
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={contactState === "loading"}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full text-white text-sm font-medium transition-all duration-120 active:scale-[0.98] disabled:opacity-70"
                    style={{ backgroundColor: "#D47E30" }}
                    onMouseEnter={(e) => {
                      if (contactState !== "loading")
                        e.currentTarget.style.backgroundColor = "#B8671E";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#D47E30")
                    }
                  >
                    {contactState === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#EBEBEB] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/mi-icon-mark.png"
              alt=""
              aria-hidden="true"
              className="w-6 h-6 object-contain"
            />
            <span className="font-headline font-bold text-[15px] text-[#1A1A1A]">
              Indian<span style={{ color: "#D47E30" }}>Matter</span>
            </span>
          </div>
          <p className="text-[12px] text-[#9A9A9A] text-center">
            © {new Date().getFullYear()} IndianMatter. Computational materials
            research platform.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-[#6B6B6B]">
            <a href="#" className="hover:text-[#D47E30] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#D47E30] transition-colors">
              Terms
            </a>
            <Link
              to="/signin"
              className="hover:text-[#D47E30] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
