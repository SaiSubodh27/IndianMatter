import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, LogOut, Settings, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopHeader() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Researcher");

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      if (profile?.name) setUserName(profile.name);
    } catch {}
  }, []);

  const initial = userName.charAt(0).toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/materials?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 sm:px-8 bg-white/70 backdrop-blur-md border-b border-im-border sticky top-0 z-30">
      {/* ── Search Bar ── */}
      <form onSubmit={handleSearch} className="relative w-72 sm:w-[380px]">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-im-textMuted pointer-events-none"
          size={15}
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search materials, structures, tools…"
          aria-label="Search materials"
          className="w-full bg-im-surfaceAlt border border-im-border rounded-full py-2 pl-10 pr-14 text-xs text-im-text outline-none focus:border-[#D47E30] focus:bg-white transition-all placeholder:text-im-textMuted"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-im-textMuted bg-white border border-im-border px-1.5 py-0.5 rounded pointer-events-none">
          ⌘K
        </kbd>
      </form>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-full flex items-center justify-center text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt transition-colors"
        >
          <Bell size={16} />
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D47E30]"
          />
        </button>

        {/* User dropdown */}
        <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-im-surfaceAlt transition-colors"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ backgroundColor: "var(--im-brown, #8D5A2B)" }}
            >
              {initial}
            </div>
            <span className="hidden sm:block text-xs font-medium text-im-text max-w-[100px] truncate">
              {userName}
            </span>
            <ChevronDown
              size={13}
              className={`text-im-textMuted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-popover border border-im-border p-1.5 z-50 animate-slide-up"
            >
              <button
                role="menuitem"
                onClick={() => { setDropdownOpen(false); navigate("/app/settings"); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-im-text hover:bg-im-surfaceAlt transition-colors flex items-center gap-2.5"
              >
                <Settings size={13} className="text-im-textMuted" />
                Profile & Settings
              </button>
              <button
                role="menuitem"
                onClick={() => { setDropdownOpen(false); navigate("/app/saved"); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-im-text hover:bg-im-surfaceAlt transition-colors flex items-center gap-2.5"
              >
                <Bookmark size={13} className="text-im-textMuted" />
                Saved Results
              </button>
              <div className="h-px bg-im-border my-1 mx-1" />
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
