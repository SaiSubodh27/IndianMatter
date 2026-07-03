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

function Sidebar() {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

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
    { name: "Settings", path: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <aside
      className={`h-screen bg-gray-50 dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 flex flex-col py-6 sticky top-0 shrink-0 font-body text-sm transition-all duration-300 z-50 ${
        isMinimized ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`px-6 mb-8 flex items-center ${isMinimized ? "justify-center" : "gap-3"}`}
      >
        <div
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-8 h-8 shrink-0 bg-orange-500 rounded flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-white text-lg">
            {isMinimized ? "menu" : "science"}
          </span>
        </div>
        {!isMinimized && (
          <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">
            IndianMatter
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              title={isMinimized ? link.name : undefined}
              className={`flex items-center gap-3 py-2.5 px-3 transition-colors rounded-md overflow-hidden ${
                isActive
                  ? "bg-gray-200 dark:bg-neutral-900 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isMinimized ? "mx-auto text-xl" : "text-lg"}`}
              >
                {link.icon}
              </span>
              {!isMinimized && (
                <span className="whitespace-nowrap">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        {!isMinimized ? (
          <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            New Job
          </button>
        ) : (
          <button
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2.5 rounded-md flex justify-center hover:opacity-90 transition-opacity"
            title="New Job"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        )}
      </div>
    </aside>
  );
}

function MainHeader() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
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
    <header className="h-16 px-8 flex items-center justify-between sticky top-0 z-40 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
          Workspace
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {userProfile ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                {userProfile.name || "User"}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-500">
                {userProfile.email || "Researcher"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-neutral-700">
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
            <button
              onClick={handleLogout}
              className="ml-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="px-4 py-1.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
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
    <div className="flex h-screen bg-gray-100 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-body overflow-hidden">
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
