import { useEffect, useState, useRef } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useTheme } from "./contexts/ThemeProvider";
import {
  Activity,
  ArrowRight,
  Beaker,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  FlaskConical,
  FolderOpen,
  Layers3,
  Search,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import Landing from "./pages/Landing";
import Explorer from "./pages/Explorer";
import Calculations from "./pages/Calculations";
import SavedMaterials from "./pages/SavedMaterials";
import Trial from "./pages/Trial";
import SignIn from "./pages/SignIn";
import ContactUs from "./pages/ContactUs";
import Datasets from "./pages/Datasets";
import Structures from "./pages/Structures";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import AICopilot from "./pages/AICopilot";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    picture?: string;
    email?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profileObj = localStorage.getItem("userProfile");
    if (profileObj) {
      try {
        setUserProfile(JSON.parse(profileObj));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setUserProfile(null);
    setMenuOpen(false);
    navigate("/");
  };

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Research Papers", path: "/dashboard/ai-copilot", icon: "article" },

    { name: "Explorer", path: "/dashboard/explorer", icon: "science" },
    {
      name: "Calculations",
      path: "/dashboard/calculations",
      icon: "calculate",
    },

    { name: "Structures", path: "/dashboard/structures", icon: "layers" },
  ];

  return (
    <header className="h-20 px-8 flex items-center sticky top-0 z-50 bg-[#FBFAF8] dark:bg-neutral-950 border-b border-gray-200/70 dark:border-neutral-800 font-body text-sm shrink-0">
      {/* Logo */}
      <div className="flex items-end gap-2.5 w-64 shrink-0">
        <img
          src="/mi-icon-mark.png"
          alt="IndianMatter"
          className="w-12 h-12 shrink-0 object-contain"
        />
        <span className="text-xl tracking-tight whitespace-nowrap hidden sm:block leading-none pb-0.5">
          <span className="text-orange-500 font-bold">Indian</span>
          <span className="text-gray-900 dark:text-white font-bold">
            Matter
          </span>
        </span>
      </div>

      {/* Nav links — centered, understated, generous tracking like Function's nav */}
      <nav className="hide-scrollbar flex items-center justify-center gap-10 flex-1 overflow-x-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`group relative py-2 transition-colors duration-200 whitespace-nowrap tracking-wide ${
                isActive
                  ? "text-gray-900 dark:text-white font-semibold"
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white font-medium"
              }`}
            >
              {link.name}
              <span
                className={`absolute left-1/2 -bottom-[1px] h-[2px] bg-orange-500 rounded-full transition-all duration-300 ease-in-out -translate-x-1/2 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center justify-end gap-5 w-64 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-gray-500 dark:text-neutral-400 hover:text-orange-500 transition-colors duration-200"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {userProfile ? (
          <>
            <span className="w-px h-5 bg-gray-300 dark:bg-neutral-700" />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center rounded-full shrink-0 outline-none"
              >
                <div
                  className="flex h-10 w-10 min-h-10 min-w-10 shrink-0 grow-0 aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-orange-400 bg-gray-200 dark:bg-neutral-800 transition-colors duration-200"
                  style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    minHeight: "40px",
                    maxWidth: "40px",
                    maxHeight: "40px",
                    borderRadius: "50%",
                    flex: "0 0 40px",
                  }}
                >
                  <img
                    className="w-full h-full object-cover rounded-full"
                    style={{ borderRadius: "50%" }}
                    alt="User avatar"
                    src={
                      userProfile.picture ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(userProfile.name || "User") +
                        "&rounded=true&background=0D8ABC&color=fff"
                    }
                  />
                </div>
              </button>

              <div
                className={`absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-none shadow-lg overflow-hidden origin-top-right transition-all duration-200 ${
                  menuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-neutral-800">
                  <div
                    className="flex h-10 w-10 min-h-10 min-w-10 shrink-0 grow-0 aspect-square rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      minHeight: "40px",
                      maxWidth: "40px",
                      maxHeight: "40px",
                      borderRadius: "50%",
                      flex: "0 0 40px",
                    }}
                  >
                    <img
                      className="w-full h-full object-cover rounded-full"
                      style={{ borderRadius: "50%" }}
                      alt="User avatar"
                      src={
                        userProfile.picture ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(userProfile.name || "User") +
                          "&rounded=true&background=0D8ABC&color=fff"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {userProfile.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-500 truncate">
                      {userProfile.email || "Researcher"}
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    save
                  </span>
                  Saved
                </Link>
                <Link
                  to="/dashboard/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 pl-11 text-xs text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Saved Materials
                </Link>
                <Link
                  to="/dashboard/saved?tab=papers"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 pl-11 text-xs text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Saved Papers
                </Link>
                <Link
                  to="/dashboard/datasets"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    database
                  </span>
                  Datasets
                </Link>
                <Link
                  to="/dashboard/aboutus"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    info
                  </span>
                  About Us
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    settings
                  </span>
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    logout
                  </span>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link
            to="/signin"
            className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
function Dashboard() {
  const { theme } = useTheme();
  const lightMode = theme === "light";
  const metrics = [
    {
      label: "Saved Materials",
      value: "12",
      icon: FolderOpen,
      tone: "text-[#FF7A00]",
      to: "/dashboard/saved",
    },
    {
      label: "Research Papers",
      value: "24",
      icon: BookOpen,
      tone: "text-[#FF7A00]",
      to: "/dashboard/ai-copilot",
    },
    {
      label: "Structures Analyzed",
      value: "1",
      icon: Layers3,
      tone: "text-[#FF7A00]",
      to: "/dashboard/structures",
    },
    {
      label: "Active Calculations",
      value: "3",
      icon: Activity,
      tone: "text-[#FF7A00]",
      to: "/dashboard/calculations",
    },
  ];

  const activity = [
    {
      text: "SrTiO3 crystal structure analyzed",
      status: "Completed",
      tone: "text-[#FF7A00]",
      icon: CheckCircle2,
    },
    {
      text: "Li10GeP2S12 inference completed",
      status: "Completed",
      tone: "text-[#FF7A00]",
      icon: CheckCircle2,
    },
    {
      text: "MoS2 structure uploaded",
      status: "Pending",
      tone: "text-[#777]",
      icon: Clock3,
    },
    {
      text: "24 research papers synchronized",
      status: "Completed",
      tone: "text-[#FF7A00]",
      icon: CheckCircle2,
    },
    {
      text: "GaN analysis requires attention",
      status: "Needs review",
      tone: "text-[#FF7A00]",
      icon: CircleAlert,
    },
  ];

  const quickActions = [
    { label: "Search a Material", icon: Search, to: "/dashboard/explorer" },
    { label: "Upload CIF", icon: Upload, to: "/dashboard/structures" },
    { label: "Run Inference", icon: FlaskConical, to: "/trial" },
    { label: "Browse Papers", icon: BookOpen, to: "/dashboard/ai-copilot" },
  ];

  return (
    <div
      className={`${lightMode ? "dashboard-light" : ""} min-h-full bg-[#070707] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8 lg:py-8`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-5 border-b border-[#2a2a2a] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A00]">
              Research command center
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, Sai Subodh
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9A9A9A]">
              Explore materials, review research, and run physics-informed
              predictions from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/explorer"
              className="inline-flex items-center gap-2 rounded-md bg-[#FF7A00] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition hover:bg-[#ff8b26] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#070707]"
            >
              <Search className="h-4 w-4" /> Search Materials
            </Link>
            <Link
              to="/dashboard/calculations"
              className="inline-flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-[#171717] px-4 py-2.5 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            >
              <Zap className="h-4 w-4" /> Run New Calculation
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-[#292929] bg-[#171717] p-4 shadow-xl shadow-black/10 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Material Search</h2>
              <p className="mt-1 text-xs text-[#9A9A9A]">
                Find a composition or crystal system in the materials explorer.
              </p>
            </div>
            <Search className="h-5 w-5 text-[#FF7A00]" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
              <input
                aria-label="Search materials"
                className="w-full rounded-md border border-[#333] bg-[#0d0d0d] py-3 pl-10 pr-4 text-sm text-[#F5F5F5] outline-none placeholder:text-[#777] focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                placeholder="Enter formula (e.g. SrTiO3)"
                type="text"
              />
            </div>
            <Link
              to="/dashboard/explorer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FF7A00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff8b26] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            >
              Search <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, tone, to }) => (
            <Link
              key={label}
              to={to}
              className="group rounded-lg border border-[#292929] bg-[#171717] p-4 transition hover:-translate-y-0.5 hover:border-[#444] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] sm:p-5"
            >
              <div className="flex items-start justify-between">
                <span className={`rounded-md bg-black/25 p-2 ${tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <ChevronRight className="h-4 w-4 text-[#555] transition group-hover:translate-x-0.5 group-hover:text-[#FF7A00]" />
              </div>
              <p className="mt-4 text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-[#9A9A9A]">{label}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-[#292929] bg-[#171717] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  Your latest workspace events
                </p>
              </div>
              <Activity className="h-5 w-5 text-[#FF7A00]" />
            </div>
            <div className="space-y-1">
              {activity.map(({ text, status, tone, icon: Icon }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 border-t border-[#292929] py-3 first:border-t-0"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${tone}`} />
                  <p className="min-w-0 flex-1 text-sm text-[#d9d9d9]">
                    {text}
                  </p>
                  <span className={`shrink-0 text-[11px] font-medium ${tone}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#292929] bg-[#171717] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  Jump into your next research task
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[#FF7A00]" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {quickActions.map(({ label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-3 rounded-md border border-[#303030] bg-[#1e1e1e] px-3 py-3 text-sm text-[#e7e7e7] transition hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                >
                  <Icon className="h-4 w-4 text-[#FF7A00]" />
                  {label}
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-[#666]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-[#3b2a1d] bg-[#1e1b18] p-5 shadow-xl shadow-orange-950/10 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A00]">
                  Featured Material
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Featured Material: Li7La3Zr2O12
                </h2>
                <p className="mt-1 text-sm text-[#9A9A9A]">
                  Solid-state battery electrolyte candidate
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#64401f] bg-[#2b2118] text-[#FF7A00]">
                <Beaker className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-5">
              {[
                ["Activation Energy", "0.245 eV"],
                ["Ionic Conductivity", "1.4 × 10^-2 S/cm"],
                ["Chemical Stability", "High"],
                ["Structural Match", "94%"],
                ["Synthesis Ease", "5/5"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] text-[#9A9A9A]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#F5F5F5]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/dashboard/calculations"
                className="inline-flex items-center gap-2 rounded-md bg-[#FF7A00] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#ff8b26] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                View Full Analysis <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/dashboard/saved"
                className="inline-flex items-center gap-2 rounded-md border border-[#4a3b2d] px-3.5 py-2 text-xs font-semibold text-[#F5F5F5] hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                Compare
              </Link>
              <button
                type="button"
                disabled
                title="Report download is not available yet"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-[#333] px-3.5 py-2 text-xs font-semibold text-[#666]"
              >
                <Download className="h-3.5 w-3.5" /> Download Report
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-[#292929] bg-[#171717] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Research Spotlight</h2>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  From the research library
                </p>
              </div>
              <BookOpen className="h-5 w-5 text-[#FF7A00]" />
            </div>
            <h3 className="mt-6 text-base font-semibold leading-6 text-[#F5F5F5]">
              Garnet-Type Solid Electrolytes: Materials, Interfaces, and
              Batteries
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#9A9A9A]">
              LLZO-based solid electrolytes are being investigated for their
              ionic conductivity, chemical stability against lithium metal, and
              suitability for solid-state battery architectures.
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                to="/dashboard/ai-copilot"
                className="inline-flex items-center gap-2 rounded-md bg-[#252525] px-3.5 py-2 text-xs font-semibold text-[#F5F5F5] hover:bg-[#303030] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                Read Paper <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/dashboard/saved?tab=papers"
                className="rounded-md border border-[#333] px-3.5 py-2 text-xs font-semibold text-[#bdbdbd] hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                Save Paper
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-[#292929] bg-[#171717] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Crystal Structure Status
                </h2>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  Analysis queue overview
                </p>
              </div>
              <Layers3 className="h-5 w-5 text-[#FF7A00]" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["SrTiO3", "Analyzed", "Cubic, 5 atoms", "text-[#FF7A00]"],
                ["MoS2", "Pending", "Hexagonal, 6 atoms", "text-[#777]"],
                ["GaN", "Needs Attention", "Analysis failed", "text-[#FF7A00]"],
              ].map(([name, status, detail, tone]) => (
                <Link
                  to="/dashboard/structures"
                  key={name}
                  className="flex items-center gap-3 rounded-md border border-[#2d2d2d] bg-[#1e1e1e] p-3 transition hover:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="mt-1 text-xs text-[#9A9A9A]">{detail}</p>
                    {name === "GaN" && (
                      <p className="mt-1 text-[11px] text-[#FF7A00]">
                        Check CIF file and retry analysis.
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${tone}`}>
                    {status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#555]" />
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#292929] bg-[#111111] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-[#24201b] p-2 text-[#FF7A00]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Recommended for You</h2>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  Because you analyzed Li10GeP2S12, you may be interested in
                  LLZO, Na3PS4, and other solid electrolytes.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/dashboard/explorer"
                className="rounded-full border border-[#3b3025] bg-[#1c1814] px-3.5 py-2 text-xs font-medium text-[#FF7A00] hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                Li7La3Zr2O12
              </Link>
              <Link
                to="/dashboard/explorer"
                className="rounded-full border border-[#333] bg-[#1a1a1a] px-3.5 py-2 text-xs font-medium text-[#c8c8c8] hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                Na3PS4
              </Link>
              <Link
                to="/dashboard/explorer"
                className="rounded-full border border-[#333] bg-[#1a1a1a] px-3.5 py-2 text-xs font-medium text-[#c8c8c8] hover:border-[#FF7A00] hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                Garnet-type solid electrolytes
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-body overflow-hidden">
      <Navbar />
      <main className="flex-1 relative overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ai-copilot" element={<AICopilot />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="calculations" element={<Calculations />} />
          <Route path="saved" element={<SavedMaterials />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="structures" element={<Structures />} />
          <Route path="settings" element={<Settings />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="aboutus" element={<AboutUs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
