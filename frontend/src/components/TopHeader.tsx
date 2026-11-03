import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, LogOut, Settings, Bookmark, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface TopHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function TopHeader({ onToggleMobileMenu }: TopHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userName = user?.name || "Researcher";
  const userEmail = user?.email || "researcher@indianmatter.org";
  const isGoogle = !!user?.isGoogle;
  const initial = userName.charAt(0).toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/materials?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = () => {
    signOut();
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
    <header className="h-16 w-full flex items-center justify-between px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-[#EDE8E2] fixed top-0 left-0 right-0 z-50">
      {/* ── Left: Brand & Search Bar with minimal distance ── */}
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        {/* Mobile menu trigger */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* IndianMatter Brand in top left corner */}
        <Link
          to="/app"
          className="flex items-center gap-2.5 shrink-0 group select-none mr-1"
          aria-label="IndianMatter Home"
        >
          <img
            src="/mi-icon-mark.png"
            alt="IndianMatter"
            className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-headline font-bold text-[15px] sm:text-[16px] text-im-text leading-none tracking-tight">
              Indian<span style={{ color: "var(--im-orange)" }}>Matter</span>
            </span>
            <span className="text-[9px] text-im-textMuted font-normal tracking-wider uppercase mt-0.5 hidden sm:block">
              Materials Platform
            </span>
          </div>
        </Link>

        {/* Search Bar beside logo with minimal distance */}

      </div>

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
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-[#EDE8E2] bg-white hover:bg-im-surfaceAlt transition-colors"
          >
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={userName}
                  className="w-7 h-7 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: "var(--im-brown, #8D5A2B)" }}
                >
                  {initial}
                </div>
              )}
              {isGoogle && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs border border-white">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-2.5 h-2.5"
                  />
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold text-im-text max-w-[120px] truncate">
                {userName}
              </span>
              {isGoogle ? (
                <span className="text-[10px] text-[#1967D2] font-medium flex items-center gap-1">
                  Google
                </span>
              ) : (
                <span className="text-[10px] text-im-textMuted max-w-[120px] truncate">
                  {userEmail}
                </span>
              )}
            </div>
            <ChevronDown
              size={13}
              className={`text-im-textMuted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-popover border border-im-border p-2 z-50 animate-slide-up"
            >
              <div className="px-3 py-2 border-b border-im-border mb-1.5">
                {isGoogle && (
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded-full w-fit">
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-2.5 h-2.5"
                    />
                    Google Account
                  </div>
                )}
                <p className="text-xs font-bold text-im-text truncate">{userName}</p>
                <p className="text-[11px] text-im-textMuted truncate">{userEmail}</p>
              </div>

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
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 font-medium"
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
