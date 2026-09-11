import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  TrendingUp,
  Box,
  Layers,
  BookOpen,
  Bookmark,
  Settings,
  HelpCircle,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const primaryNav = [
  { name: "Dashboard", path: "/app", icon: LayoutDashboard },
  { name: "Materials Search", path: "/app/materials", icon: Search },
  { name: "CIF Generation", path: "/app/cif-gen", icon: FileText },
  { name: "Property Prediction", path: "/app/predict", icon: TrendingUp },
  { name: "Structure Visualization", path: "/app/structures", icon: Box },
  { name: "Batch Prediction", path: "/app/batch", icon: Layers },
  { name: "DFT Validation", path: "/app/dft", icon: ShieldCheck },
  { name: "Literature & Diversity", path: "/app/literature", icon: BookOpen },
  { name: "Saved Results", path: "/app/saved", icon: Bookmark },
];

const utilityNav = [
  { name: "Settings", path: "/app/settings", icon: Settings },
  { name: "Help & Support", path: "/app/help", icon: HelpCircle },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
      >
        <Menu size={20} />
      </button>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`sidebar-fixed flex flex-col bg-transparent select-none ${mobileOpen ? "sidebar-open" : ""}`}
        aria-label="Primary navigation"
      >
        {/* ── Brand ── */}
        <Link
          to="/app"
          className="flex items-center gap-3 px-5 h-16 shrink-0 group"
          onClick={() => setMobileOpen(false)}
          aria-label="IndianMatter Dashboard"
        >
          <img
            src="/mi-icon-mark.png"
            alt="IndianMatter"
            className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110"
          />
          <div>
            <span className="font-headline font-bold text-[15px] text-im-text leading-none tracking-tight">
              Indian<span style={{ color: "var(--im-orange)" }}>Matter</span>
            </span>
            <p className="text-[9px] text-im-textMuted font-normal tracking-wider uppercase mt-0.5">
              Materials Platform
            </p>
          </div>
        </Link>

        {/* ── Primary Nav ── */}
        <nav
          className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto"
          aria-label="Main"
        >
          {primaryNav.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium
                transition-all duration-120 group
                ${
                  active
                    ? "bg-[--im-orange-subtle] text-[--im-orange] font-semibold"
                    : "text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"
                }
              `}
                style={
                  active
                    ? ({
                        "--im-orange-subtle": "var(--im-orange-subtle)",
                      } as React.CSSProperties)
                    : {}
                }
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.2 : 1.7}
                  style={{ color: active ? "var(--im-orange)" : undefined }}
                  className={
                    active
                      ? ""
                      : "text-im-textMuted group-hover:text-im-textLight"
                  }
                />
                <span className="truncate">{item.name}</span>
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--im-orange)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Utility Nav ── */}
        <nav className="flex flex-col gap-0.5 px-3 py-3" aria-label="Utilities">
          {utilityNav.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium
                transition-all duration-120 group
                ${
                  active
                    ? "bg-[#FDF5EE] text-[#D47E30] font-semibold"
                    : "text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"
                }
              `}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.2 : 1.7}
                  className={
                    active
                      ? "text-[#D47E30]"
                      : "text-im-textMuted group-hover:text-im-textLight"
                  }
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom crystal decoration ── */}
        <div className="px-4 pb-4 pt-2 pointer-events-none select-none shrink-0">
          <div className="w-36 mx-auto opacity-80">
            <img
              src="/assets/dash_sidebar_crystal.png"
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </aside>
    </>
  );
}
