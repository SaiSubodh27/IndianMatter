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
import Landing from "./pages/Landing";
import Explorer from "./pages/Explorer";
import Calculations from "./pages/Calculations";
import SavedMaterials from "./pages/SavedMaterials";
import Trial from "./pages/Trial";
import SignIn from "./pages/SignIn";
import Datasets from "./pages/Datasets";
import Structures from "./pages/Structures";
import Settings from "./pages/Settings";

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
    { name: "Explorer", path: "/dashboard/explorer", icon: "science" },
    {
      name: "Calculations",
      path: "/dashboard/calculations",
      icon: "calculate",
    },
    { name: "Saved", path: "/dashboard/saved", icon: "bookmark" },
    { name: "Datasets", path: "/dashboard/datasets", icon: "database" },
    { name: "Structures", path: "/dashboard/structures", icon: "layers" },
  ];

  return (
    <header className="h-20 px-8 flex items-center sticky top-0 z-50 bg-[#FBFAF8] dark:bg-neutral-950 border-b border-gray-200/70 dark:border-neutral-800 font-body text-sm shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 w-64 shrink-0">
        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg">
            science
          </span>
        </div>
        <span className="text-gray-900 dark:text-white font-serif text-xl tracking-tight whitespace-nowrap hidden sm:block">
          IndianMatter
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
                className="flex items-center"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-orange-400 transition-colors duration-200">
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
              </button>

              <div
                className={`absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden origin-top-right transition-all duration-200 ${
                  menuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userProfile.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-500 truncate">
                    {userProfile.email || "Researcher"}
                  </p>
                </div>
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
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Material Search
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="Enter formula (e.g. SrTiO3)"
              type="text"
            />
          </div>
          <button className="bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
          <div className="text-gray-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">
            Total Materials
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            142,854
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
          <div className="text-gray-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">
            Active Jobs
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            12
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
          <div className="text-gray-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">
            Compute Nodes
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            8 / 10
          </div>
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Recent Calculations
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                Job ID
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                Material
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">
                #8291
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-300">
                SrTiO3
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-300">
                Band Structure
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                  Completed
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">
                #8292
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-300">
                MoS2
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-300">
                Density of States
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                  Running
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
          <Route path="saved" element={<SavedMaterials />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="structures" element={<Structures />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
