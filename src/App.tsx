import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Explorer from "./pages/Explorer";
import Calculations from "./pages/Calculations";
import SavedMaterials from "./pages/SavedMaterials";
import Trial from "./pages/Trial";
import SignIn from "./pages/SignIn";
import Datasets from "./pages/Datasets";

function Sidebar() {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    picture?: string;
    email?: string;
  } | null>(null);

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

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Crystal Explorer", path: "/dashboard/explorer", icon: "science" },
    {
      name: "Calculations",
      path: "/dashboard/calculations",
      icon: "calculate",
    },
    { name: "Saved Materials", path: "/dashboard/saved", icon: "bookmark" },
    { name: "Datasets", path: "/dashboard/datasets", icon: "database" },
    { name: "Structures", path: "/dashboard/structures", icon: "layers" },
    { name: "Settings", path: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <aside
      className={`h-screen bg-neutral-950 border-r border-neutral-800/20 flex flex-col py-6 sticky top-0 shrink-0 font-headline text-sm transition-all duration-300 z-50 ${
        isMinimized ? "w-28" : "w-64"
      }`}
    >
      <div
        className={`px-6 mb-10 flex items-center ${isMinimized ? "justify-center" : "gap-3"}`}
      >
        <div
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-10 h-10 shrink-0 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center neon-glow cursor-pointer hover:scale-105 transition-transform"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-on-primary-container text-2xl">
            {isMinimized ? "menu" : "science"}
          </span>
        </div>
        {!isMinimized && (
          <span className="text-orange-500 font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">
            Scientific Lab
          </span>
        )}
      </div>

      <nav className={`flex-1 ${isMinimized ? "px-4" : "px-4"} space-y-3`}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              title={isMinimized ? link.name : undefined}
              className={`flex items-center gap-4 py-3 transition-colors rounded-xl overflow-hidden ${
                isMinimized ? "justify-center px-0" : "px-4"
              } ${
                isActive
                  ? "text-orange-400 bg-neutral-900/50 border-r-4 border-orange-500"
                  : "text-neutral-500 hover:bg-neutral-900"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isMinimized ? "text-3xl" : "text-xl"}`}
              >
                {link.icon}
              </span>
              {!isMinimized && (
                <span className="whitespace-nowrap font-medium text-sm">
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`mt-auto ${isMinimized ? "px-4" : "px-4"} space-y-6`}>
        {!isMinimized ? (
          <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all neon-glow whitespace-nowrap">
            New Experiment
          </button>
        ) : (
          <button
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3.5 rounded-xl flex justify-center hover:opacity-90 transition-all neon-glow"
            title="New Experiment"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
        )}
        <div className="pt-6 border-t border-neutral-900">
          <div
            className={`flex items-center ${isMinimized ? "justify-center" : "gap-3 px-4"} mb-4`}
          >
            <div
              className={`shrink-0 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20 overflow-hidden ${isMinimized ? "w-12 h-12" : "w-10 h-10"}`}
            >
              <img
                className="w-full h-full object-cover"
                alt="Portrait"
                src={
                  userProfile?.picture ||
                  "https://ui-avatars.com/api/?name=User"
                }
              />
            </div>
            {!isMinimized && (
              <div className="truncate">
                <p
                  className="text-on-surface text-xs font-bold truncate whitespace-nowrap"
                  title={userProfile?.name || "User profile"}
                >
                  {userProfile?.name || "User profile"}
                </p>
                <p
                  className="text-neutral-500 text-[10px] uppercase tracking-wider truncate whitespace-nowrap"
                  title={userProfile?.email || "AI Researcher"}
                >
                  {userProfile?.email || "AI Researcher"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function MainHeader() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    picture?: string;
    email?: string;
  } | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setUserProfile(null);
    navigate("/");
  };

  return (
    <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-neutral-950/60 backdrop-blur-xl border-b border-neutral-800/20">
      <div className="flex items-center gap-10">
        <h1 className="text-3xl font-bold tracking-tighter text-orange-500 font-headline">
          IndianMatter
        </h1>
        <nav className="hidden md:flex items-center gap-8 font-headline text-base">
          <a
            className="text-orange-400 border-b-2 border-orange-500 pb-1"
            href="#discover"
          >
            Discover
          </a>
          <Link
            to="/dashboard/datasets"
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Datasets
          </Link>
          <a
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
            href="#api"
          >
            API
          </a>
          <a
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
            href="#docs"
          >
            Documentation
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {userProfile ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="User avatar"
                  src={
                    userProfile.picture ||
                    "https://ui-avatars.com/api/?name=" +
                      (userProfile.name || "User")
                  }
                />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-on-surface">
                  {userProfile.name || "User"}
                </p>
                <p className="text-xs text-neutral-500">
                  {userProfile.email || ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg bg-neutral-800/50 text-on-surface text-sm font-medium hover:bg-neutral-800 transition-all border border-outline-variant/20 shadow-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="px-8 py-3 rounded-lg bg-neutral-800/50 text-on-surface text-base font-medium hover:bg-neutral-800 transition-all border border-outline-variant/20 shadow-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in">
      {/* Hero Search Panel */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-transparent blur-3xl -z-10 rounded-full scale-110"></div>
        <div className="glass-card p-10 rounded-xl border border-outline-variant/10 neon-glow relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[160px]">
              magnification_small
            </span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold font-headline tracking-tight text-on-surface mb-4">
              Explore the Molecular Frontier
            </h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
              Predict material properties and crystal structures using our
              high-fidelity AI models trained on Bharat's specific mineralogical
              datasets.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-md px-12 py-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body"
                  placeholder="Enter composition (e.g., SrTiO3, MoS2...)"
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary-container">
                  search
                </span>
              </div>
              <div className="relative w-full md:w-56">
                <select className="w-full h-full bg-surface-container-low border border-outline-variant/30 rounded-md px-4 py-4 text-on-surface appearance-none focus:outline-none focus:border-primary transition-all font-label text-xs uppercase tracking-widest">
                  <option>Materials Project</option>
                  <option>AFLOW</option>
                  <option>OQMD</option>
                  <option>Indian Mineral DB</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  expand_more
                </span>
              </div>
              <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-md font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow">
                Predict
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Recent Predictions */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex flex-col group hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-label uppercase tracking-widest text-neutral-500 mb-1">
                Recent Predictions
              </p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">
                1,402
              </h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">
                timeline
              </span>
            </div>
          </div>
          <div className="mt-auto h-16 w-full flex items-end gap-1">
            {/* Sparkline Mockup */}
            <div className="flex-1 bg-primary/20 h-1/4 rounded-t-sm group-hover:h-1/2 transition-all"></div>
            <div className="flex-1 bg-primary/20 h-1/2 rounded-t-sm group-hover:h-3/4 transition-all"></div>
            <div className="flex-1 bg-primary/40 h-1/3 rounded-t-sm group-hover:h-2/3 transition-all"></div>
            <div className="flex-1 bg-primary/60 h-3/4 rounded-t-sm group-hover:h-full transition-all"></div>
            <div className="flex-1 bg-primary/30 h-1/2 rounded-t-sm group-hover:h-2/3 transition-all"></div>
            <div className="flex-1 bg-primary-container h-5/6 rounded-t-sm group-hover:h-[90%] transition-all"></div>
            <div className="flex-1 bg-primary/40 h-2/3 rounded-t-sm group-hover:h-1/2 transition-all"></div>
          </div>
        </div>

        {/* Card 2: Saved Materials */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex flex-col group hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-label uppercase tracking-widest text-neutral-500 mb-1">
                Saved Materials
              </p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">
                48
              </h3>
            </div>
            <div className="p-2 bg-tertiary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary-container">
                bookmark
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-medium">
                SrTiO3 (Perovskite)
              </span>
              <span className="text-neutral-500">2h ago</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-medium">
                MoS2 (2D Monolayer)
              </span>
              <span className="text-neutral-500">5h ago</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-medium">
                GaN (Semiconductor)
              </span>
              <span className="text-neutral-500">1d ago</span>
            </div>
          </div>
        </div>

        {/* Card 3: Performance Metrics */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex flex-col group hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-label uppercase tracking-widest text-neutral-500 mb-1">
                Model Accuracy
              </p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">
                98.4%
              </h3>
            </div>
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-primary-container">
                verified
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full w-[98.4%] neon-glow"></div>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
              <span className="text-neutral-500">RMSE: 0.012 eV/atom</span>
              <span className="text-primary">VASP Validated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Data Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Large Section: Active Simulations */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-headline tracking-tight">
              Active Computational Jobs
            </h3>
            <a
              className="text-primary text-xs uppercase tracking-widest font-bold flex items-center gap-2"
              href="#"
            >
              View Queue{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="space-y-1">
            {/* Job Item 1 */}
            <div className="group flex items-center justify-between p-4 bg-surface-container-low border-b border-neutral-900/50 hover:bg-surface-container-high transition-all">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse neon-glow"></div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    Elastic Tensor Calculation
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase">
                    System: Na2O-SiO2 Glass
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-primary">64% Completed</p>
                <p className="text-[10px] text-neutral-500 uppercase">
                  Node: NVIDIA-A100-80GB
                </p>
              </div>
            </div>
            {/* Job Item 2 */}
            <div className="group flex items-center justify-between p-4 bg-surface-container-low border-b border-neutral-900/50 hover:bg-surface-container-high transition-all">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse neon-glow"></div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    Band Structure Prediction
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase">
                    System: CsPbI3
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-primary">22% Completed</p>
                <p className="text-[10px] text-neutral-500 uppercase">
                  Node: AMD-EPYC-7763
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small Section: Quick Stats */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden flex flex-col justify-center">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            alt="Microscopic view"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9N3eNmGa5bm9JmfFB9j4H3UZh8X_PYeL76zACpnKcb7OsLwt9-AOBp4QtMTqNnyQMlcWx8_It95LOHOOzl6YjhJA17WUjpqyMYsjInmDDZTCCm5VK6s5vKydB1IiYyfFUYoi3sBQFNjkG8U5IDVLpg8ttfogKJqHjEEKjFvrwCHMCCsGLQVb9dBvTfkwtUaO2SAOpGC6uKor-GA8PdAbJ4wleToWGzMdpWXGZdgrcUyKE_1Fv1GqsnaCXwwn1f3QkMY53nQb_l8s"
          />
          <div className="relative z-10 text-center space-y-4">
            <div className="w-16 h-16 bg-primary-container/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">
                bolt
              </span>
            </div>
            <h4 className="text-xl font-bold font-headline text-on-surface">
              Supercomputing Status
            </h4>
            <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
              All systems operational at CDAC-BENGALURU. Latency: 14ms.
            </p>
            <div className="flex justify-center gap-2 pt-4">
              <span className="px-3 py-1 bg-neutral-900 text-[10px] font-bold text-neutral-400 border border-neutral-800 rounded-full uppercase tracking-widest">
                Active
              </span>
              <span className="px-3 py-1 bg-neutral-900 text-[10px] font-bold text-neutral-400 border border-neutral-800 rounded-full uppercase tracking-widest">
                High Load
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DummyPage({ title }: { title: string }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in">
      <h2 className="text-4xl font-bold font-headline tracking-tight text-on-surface">
        {title}
      </h2>
      <p className="text-on-surface-variant text-lg">
        This is a placeholder for the "{title}" component. Now with exactly the
        color-scheme established in Stitch. Check your 'extracted_screens'
        folder for the raw HTML.
      </p>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative overflow-x-hidden flex flex-col h-full overflow-y-auto">
        <MainHeader />
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="calculations" element={<Calculations />} />
          <Route path="saved" element={<SavedMaterials />} />{" "}
          <Route path="datasets" element={<Datasets />} />{" "}
          <Route path="structures" element={<DummyPage title="Structures" />} />
          <Route path="settings" element={<DummyPage title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
