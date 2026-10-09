import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Sun,
  Leaf,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
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
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

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
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [exploreIdx, setExploreIdx] = useState(2); // LiCoO2 centered
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactState, setContactState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  // Ultra-smooth cross-browser scrolling engine using requestAnimationFrame
  // Guarantees smooth easing animation even if the user's OS or browser has reduced motion or native smooth scroll disabled
  const smoothScrollTo = (targetPosition: number, duration = 650) => {
    const startPosition =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;
    const distance = targetPosition - startPosition;
    if (Math.abs(distance) < 2) return;

    let startTime: number | null = null;

    // Cubic ease-in-out easing curve for fluid, natural acceleration and deceleration
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animationStep = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        window.requestAnimationFrame(animationStep);
      }
    };

    window.requestAnimationFrame(animationStep);
  };

  // Dedicated smooth scroll function ensuring fixed navbar offset (72px)
  const scrollToSection = (e?: React.MouseEvent, targetId?: string) => {
    if (e) e.preventDefault();
    const id = (targetId || "explore").replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 72;
      const currentScroll =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;
      const elementPosition = el.getBoundingClientRect().top;
      const targetPosition = Math.max(
        0,
        elementPosition + currentScroll - navOffset,
      );

      smoothScrollTo(targetPosition, 650);
      window.history.pushState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  // Scroll to hash target on initial load / hashchange with navbar offset
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace(/^#/, "");
        const el = document.getElementById(id);
        if (el) {
          const timer = setTimeout(() => {
            const navOffset = 72;
            const currentScroll =
              window.scrollY ||
              window.pageYOffset ||
              document.documentElement.scrollTop ||
              0;
            const elementPosition = el.getBoundingClientRect().top;
            const targetPosition = Math.max(
              0,
              elementPosition + currentScroll - navOffset,
            );
            smoothScrollTo(targetPosition, 650);
            setActiveSection(id);
          }, 150);
          return () => clearTimeout(timer);
        }
      }
    };

    handleInitialHash();
    window.addEventListener("hashchange", handleInitialHash);
    return () => window.removeEventListener("hashchange", handleInitialHash);
  }, []);

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

  // Automatic scrolling from left to right: card to card with pause-on-hover
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setExploreIdx((prev) => (prev + 1) % exploreMaterials.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  const nextMaterial = () => {
    setExploreIdx((prev) => (prev + 1) % exploreMaterials.length);
  };

  const prevMaterial = () => {
    setExploreIdx((prev) => (prev - 1 + exploreMaterials.length) % exploreMaterials.length);
  };

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
    { href: "/research", label: "Research" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="landing-page min-h-screen bg-white text-[#38240D] overflow-x-clip selection-orange">
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
          NAVBAR (Locked / Fixed at Top)
      ═══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
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
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, label }) => {
              const isRoute = href.startsWith("/");
              const sectionId = href.slice(1);
              const active = !isRoute && activeSection === sectionId;
              const linkClasses = `text-[14px] font-medium transition-all duration-150 px-3.5 py-1.5 rounded-full ${
                active
                  ? "text-[#D47E30] bg-[#FBF0E6] font-semibold"
                  : "text-[#6B6B6B] hover:text-[#D47E30] hover:bg-[#FDF5EE]/60"
              }`;

              if (isRoute) {
                return (
                  <Link key={href} to={href} className={linkClasses}>
                    {label}
                  </Link>
                );
              }

              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => scrollToSection(e, sectionId)}
                  className={linkClasses}
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
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[#EDE8E2] bg-white hover:bg-[#FAF8F5] transition-all shadow-sm"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover shadow-xs"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#8D5A2B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.isGoogle && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs border border-white">
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          alt="Google"
                          className="w-2.5 h-2.5"
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-semibold text-[#1A1A1A] max-w-[120px] truncate">
                      {user.name}
                    </span>
                    {user.isGoogle ? (
                      <span className="text-[10px] text-[#1967D2] font-medium flex items-center gap-1">
                        Google
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6B6B6B] max-w-[120px] truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-[#8C929C] transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#EDE8E2] p-2.5 z-50 animate-slide-up">
                    <div className="px-3 py-2 border-b border-[#F2EDE6] mb-1.5">
                      {user.isGoogle && (
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded-full w-fit">
                          <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-2.5 h-2.5"
                          />
                          Google Account
                        </div>
                      )}
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#6B6B6B] truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/app");
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF0E6] hover:text-[#D47E30] transition-colors text-left"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={13} />
                    </button>
                    <div className="h-px bg-[#EDE8E2] my-1 mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
            )}
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
            {navLinks.map(({ href, label }) => {
              const isRoute = href.startsWith("/");
              const linkClasses = `flex items-center py-2.5 px-3 rounded-lg text-[15px] font-medium transition-colors ${
                !isRoute && activeSection === href.slice(1)
                  ? "text-[#D47E30] bg-[#FBF0E6] font-semibold"
                  : "text-[#3D3D3D] hover:text-[#D47E30]"
              }`;

              if (isRoute) {
                return (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClasses}
                  >
                    {label}
                  </Link>
                );
              }

              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    scrollToSection(e, href.slice(1));
                  }}
                  className={linkClasses}
                >
                  {label}
                </a>
              );
            })}
            {isAuthenticated && user ? (
              <div className="mt-3 pt-3 border-t border-[#EBEBEB] space-y-2">
                <div className="px-2 py-1 flex items-center gap-2.5">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#8D5A2B] text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.isGoogle && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-white">
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          alt=""
                          className="w-2.5 h-2.5"
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#1A1A1A] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-[#6B6B6B] truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/app");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: "#D47E30" }}
                >
                  Open Workspace <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: "#D47E30" }}
              >
                Sign In <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO — Large Background Crystal Visual Layer (No Container / No Card)
      ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
          HERO — Balanced Left Content & Controlled Right Video Visual
      ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
          HERO — Integrated Background Video Visual Layer (No Container / No Circle)
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-14 lg:pt-28 lg:pb-18 min-h-[540px] lg:min-h-[600px] flex items-center overflow-hidden"
      >
        {/* Soft atmospheric background glow */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(253,251,212,0.65) 0%, rgba(212,126,48,0.12) 45%, transparent 70%)",
          }}
        />

        {/* Integrated Background Video Layer (4-Edge Seamless Fade & Natural Left-to-Right Emergence) */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-full md:w-[68%] lg:w-[60%] xl:w-[56%] h-full pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, transparent 6%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.50) 38%, rgba(0,0,0,0.85) 58%, black 76%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.3) 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 6%, black 18%, black 82%, rgba(0,0,0,0.4) 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, transparent 6%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.50) 38%, rgba(0,0,0,0.85) 58%, black 76%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.3) 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 6%, black 18%, black 82%, rgba(0,0,0,0.4) 94%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center lg:object-right-center"
            style={{
              filter:
                "drop-shadow(0 20px 40px rgba(212,126,48,0.18))",
            }}
          >
            <source src="/videos/create_a_background_video_whic.mp4" type="video/mp4" />
            <source src="/create_a_background_video_whic.mp4" type="video/mp4" />
            <source src="/assets/create_a_background_video_whic.mp4" type="video/mp4" />
          </video>

          {/* Left-edge smooth gradient dissolver (0% opacity on left behind text) */}
          <div className="absolute inset-y-0 left-0 w-52 sm:w-64 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
          {/* Right-edge smooth gradient dissolver (eliminates vertical right cut) */}
          <div className="absolute inset-y-0 right-0 w-32 sm:w-44 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
          {/* Top gentle fade under navbar */}
          <div className="absolute top-0 inset-x-0 h-20 sm:h-24 bg-gradient-to-b from-white via-white/75 to-transparent pointer-events-none z-10" />
          {/* Bottom gentle fade into feature section */}
          <div className="absolute bottom-0 inset-x-0 h-24 sm:h-28 bg-gradient-to-t from-white via-white/75 to-transparent pointer-events-none z-10" />
        </div>

        {/* Hero Left Content */}
        <div className="relative z-10 max-w-[580px] space-y-7 py-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDFBD4] border border-[#EDE8E2] text-[11px] font-bold tracking-[0.2em] uppercase text-[#8D5A2B] font-headline shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D47E30] animate-pulse" />
            Materials for a Better Tomorrow
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-[#1A1A1A] tracking-tight leading-[1.02]">
            Indian<span style={{ color: "#D47E30" }}>Matter</span>
          </h1>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-light text-[#6B6B6B] tracking-wide">
            Predict. Explore. Accelerate.
          </h2>

          <p className="text-base lg:text-[17px] text-[#6B6B6B] max-w-[500px] leading-relaxed">
            AI-driven insights for next-generation materials discovery,
            designed for a sustainable tomorrow.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/app");
                } else {
                  navigate("/signin?redirect=/app");
                }
              }}
              className="inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-8 py-3.5 rounded-full transition-all duration-120 active:scale-95 cursor-pointer"
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
            </button>
            <a
              href="#explore"
              onClick={(e) => scrollToSection(e, "explore")}
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
          EXPLORE — Auto-Scrolling 3D Card Library
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="explore"
        className="py-16 sm:py-20 lg:py-24 bg-[#FAFAF8] border-y border-[#EBEBEB] scroll-mt-[72px] overflow-hidden relative"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF0E6] text-[#D47E30] text-[11px] font-bold tracking-[0.2em] uppercase font-headline mb-3">
              <Atom size={14} /> Material Library
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3">
              Explore Materials
            </h2>
            <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
              Browse key battery and energy materials in our computational repository — automatically rotating through atomic structures and verified predictions.
            </p>
          </div>

          {/* Cards Carousel: Auto-scrolling left-to-right with front & back card depth and transition effects */}
          <div
            className="relative w-full max-w-6xl mx-auto h-[540px] sm:h-[570px] flex items-center justify-center select-none"
            style={{ perspective: "1200px" }}
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            {exploreMaterials.map((mat, idx) => {
              const total = exploreMaterials.length;
              let offset = idx - exploreIdx;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isActive = offset === 0;

              // Style and depth transforms based on relative distance to active front card
              const getCardTransform = () => {
                if (offset === 0) {
                  return {
                    transform: "translate3d(-50%, -50%, 50px) scale(1.02) rotateY(0deg)",
                    zIndex: 30,
                    opacity: 1,
                  };
                }
                if (offset === 1) {
                  return {
                    transform: "translate3d(calc(-50% + min(320px, 30vw)), -50%, -70px) scale(0.86) rotateY(-10deg)",
                    zIndex: 20,
                    opacity: 0.65,
                  };
                }
                if (offset === -1) {
                  return {
                    transform: "translate3d(calc(-50% - min(320px, 30vw)), -50%, -70px) scale(0.86) rotateY(10deg)",
                    zIndex: 20,
                    opacity: 0.65,
                  };
                }
                if (offset === 2) {
                  return {
                    transform: "translate3d(calc(-50% + min(560px, 56vw)), -50%, -150px) scale(0.72) rotateY(-16deg)",
                    zIndex: 10,
                    opacity: 0.28,
                  };
                }
                if (offset === -2) {
                  return {
                    transform: "translate3d(calc(-50% - min(560px, 56vw)), -50%, -150px) scale(0.72) rotateY(16deg)",
                    zIndex: 10,
                    opacity: 0.28,
                  };
                }
                return {
                  transform: "translate3d(-50%, -50%, -200px) scale(0.6)",
                  zIndex: 5,
                  opacity: 0,
                };
              };

              const cardStyle = getCardTransform();

              return (
                <div
                  key={mat.id}
                  onClick={() => {
                    if (!isActive) setExploreIdx(idx);
                  }}
                  className={`absolute top-1/2 left-1/2 w-[295px] sm:w-[360px] md:w-[390px] transition-all duration-750 ease-[cubic-bezier(0.34,1.25,0.64,1)] ${
                    isActive ? "cursor-default" : "cursor-pointer"
                  } ${Math.abs(offset) >= 2 ? "max-sm:hidden" : ""}`}
                  style={{
                    transform: cardStyle.transform,
                    zIndex: cardStyle.zIndex,
                    opacity: cardStyle.opacity,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glowing ambient aura behind the active front card */}
                  {isActive && (
                    <div
                      key={`aura-${mat.id}`}
                      className="absolute -inset-4 sm:-inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-[#D47E30]/25 via-[#F1641D]/15 to-transparent blur-2xl animate-pulse-glow pointer-events-none"
                      style={{ transform: "translateZ(-30px)" }}
                      aria-hidden="true"
                    />
                  )}

                  <div
                    className={`relative w-full bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden flex flex-col ${
                      isActive
                        ? "border-[#D47E30] shadow-[0_28px_60px_-15px_rgba(212,126,48,0.28),0_16px_32px_-8px_rgba(0,0,0,0.08)] ring-2 ring-[#D47E30]/40"
                        : "border-[#E8E8E6] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] hover:border-[#D47E30]/40"
                    }`}
                  >
                    {/* Shimmer light-beam sweep effect on card change */}
                    {isActive && (
                      <div
                        key={`shimmer-${exploreIdx}`}
                        className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] z-20"
                        aria-hidden="true"
                      >
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] animate-card-shimmer" />
                      </div>
                    )}

                    {/* Card Top / Header */}
                    <div className="p-5 sm:p-6 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 ${
                            isActive ? "bg-[#FBF0E6] scale-105" : "bg-stone-100 scale-100"
                          }`}
                        >
                          <Atom
                            size={20}
                            style={{ color: isActive ? "#D47E30" : "#888" }}
                            strokeWidth={2}
                          />
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-2xl text-[#1A1A1A] tracking-tight leading-none">
                            {mat.formula}
                          </h3>
                          <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#D47E30] mt-1">
                            {mat.structure}
                          </p>
                        </div>
                      </div>
                      {mat.popular && (
                        <span
                          className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shrink-0"
                          style={{ backgroundColor: "#FBF0E6", color: "#D47E30" }}
                        >
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Crystal Structure Presentation Area */}
                    <div className="px-5 sm:px-6 py-2">
                      <div className="w-full h-40 sm:h-44 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F3ECE4] flex items-center justify-center p-3 relative overflow-hidden group">
                        {/* Orbital resonance dashed ring on active front card */}
                        {isActive && (
                          <div
                            className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#D47E30]/25 border-dashed animate-[spin_28s_linear_infinite] pointer-events-none"
                            aria-hidden="true"
                          />
                        )}

                        {/* Active Focus Pill */}
                        {isActive && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-[#D47E30] bg-white/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-xs border border-[#D47E30]/20 z-10">
                            <Sparkles
                              size={11}
                              className="animate-spin text-[#D47E30]"
                              style={{ animationDuration: "6s" }}
                            />
                            <span>Active Focus</span>
                          </div>
                        )}

                        <img
                          src={mat.image}
                          alt={`${mat.formula} crystal structure`}
                          className={`w-full h-full object-contain transition-all duration-700 ${
                            isActive
                              ? "scale-100 drop-shadow-[0_14px_28px_rgba(141,90,43,0.24)] animate-crystal-float"
                              : "scale-90 opacity-80"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Card Body & Features */}
                    <div className="p-5 sm:p-6 pt-2 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#2A2A2A] mb-2.5 line-clamp-1">
                          {mat.fullName}
                        </h4>

                        <ul className="space-y-1.5 mb-5">
                          {mat.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-2 text-[12.5px] text-[#666]">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#D47E30]" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = mat.detailsUrl;
                          if (isAuthenticated) {
                            navigate(url);
                          } else {
                            navigate(`/signin?redirect=${encodeURIComponent(url)}`);
                          }
                        }}
                        className={`w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
                          isActive
                            ? "bg-[#D47E30] text-white hover:bg-[#B8671E] shadow-md shadow-[#D47E30]/25 active:scale-95 cursor-pointer"
                            : "bg-[#F3EFEA] text-[#554C42] hover:bg-[#EAE4DC] cursor-pointer"
                        }`}
                      >
                        <span>View Material Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={prevMaterial}
              aria-label="Previous material"
              className="w-11 h-11 rounded-full bg-white border border-[#E5E5E5] text-[#333] hover:text-[#D47E30] hover:border-[#D47E30] hover:bg-[#FBF0E6]/30 flex items-center justify-center transition-all shadow-sm active:scale-90 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2">
              {exploreMaterials.map((mat, idx) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setExploreIdx(idx)}
                  aria-label={`View ${mat.formula}`}
                  className="group relative py-2 px-1 cursor-pointer focus:outline-none"
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: exploreIdx === idx ? "#D47E30" : "#DDDBD8",
                      height: "8px",
                      width: exploreIdx === idx ? "28px" : "8px",
                    }}
                  />
                  <span className="sr-only">{mat.formula}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={nextMaterial}
              aria-label="Next material"
              className="w-11 h-11 rounded-full bg-white border border-[#E5E5E5] text-[#333] hover:text-[#D47E30] hover:border-[#D47E30] hover:bg-[#FBF0E6]/30 flex items-center justify-center transition-all shadow-sm active:scale-90 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Progress Countdown Bar */}
          <div className="max-w-[200px] sm:max-w-[260px] mx-auto mt-4">
            <div className="w-full h-1 bg-[#E8E8E6] rounded-full overflow-hidden">
              <div
                key={exploreIdx}
                className="h-full bg-gradient-to-r from-[#D47E30] to-[#F1641D] rounded-full"
                style={{
                  animation: isCarouselHovered ? "none" : "progressTimer 3.8s linear forwards",
                  width: isCarouselHovered ? "100%" : undefined,
                  opacity: isCarouselHovered ? 0.4 : 1,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#9A9A9A] mt-1.5 px-0.5">
              <span>{isCarouselHovered ? "Paused on hover" : "Auto-cycling"}</span>
              <span className="font-mono text-[#D47E30] font-semibold">
                {exploreIdx + 1} / {exploreMaterials.length}
              </span>
            </div>
          </div>

          {/* Helper note */}
          <p className="text-center text-[12px] text-[#9A9A9A] mt-3">
            Automatic carousel • Hover over cards to pause • Click background cards to bring to front
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT — Crystal Paradigm
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="about"
        className="py-24 lg:py-32 bg-white border-y border-[#EBEBEB] scroll-mt-[72px]"
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
      <section
        id="resources"
        className="pt-8 pb-20 sm:pt-9 sm:pb-24 lg:pt-10 lg:pb-28 bg-white scroll-mt-[72px]"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5">
              Connected Sources
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3">
              Scientific Databases
            </h2>
            <p className="text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
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
        className="pt-8 pb-16 sm:pt-9 sm:pb-20 lg:pt-10 lg:pb-24 bg-white border-t border-[#EBEBEB] scroll-mt-[72px]"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left info */}
            <div className="space-y-6 sm:space-y-7">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5">
                  Get in Touch
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3">
                  Contact
                </h2>
                <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-md">
                  For research partnerships, questions about the platform, or
                  collaboration opportunities — we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-4">
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
                  <div key={label} className="flex items-center gap-3.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#FBF0E6" }}
                    >
                      <Icon
                        size={16}
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
              <div className="pt-2 pointer-events-none select-none opacity-60">
                <img
                  src="/assets/contact_crystal.png"
                  alt=""
                  aria-hidden="true"
                  className="w-20 h-auto object-contain"
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
                className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-7 border border-[#EBEBEB] space-y-4"
                aria-label="Contact form"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[12px] font-medium text-[#3D3D3D] mb-1"
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
                      className="w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[12px] font-medium text-[#3D3D3D] mb-1"
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
                      className="w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-[12px] font-medium text-[#3D3D3D] mb-1"
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
                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[12px] font-medium text-[#3D3D3D] mb-1"
                  >
                    Message <span className="text-[#D47E30]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tell us about your research interest or question..."
                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8] resize-none"
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
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-white text-sm font-medium transition-all duration-120 active:scale-[0.98] disabled:opacity-70"
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
