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

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  mobileOpen: controlledMobileOpen,
  setMobileOpen: controlledSetMobileOpen,
}: SidebarProps = {}) {
  const location = useLocation();
  const [localMobileOpen, setLocalMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mobileOpen = controlledMobileOpen ?? localMobileOpen;
  const setMobileOpen = controlledSetMobileOpen ?? setLocalMobileOpen;
  const isExpanded = isHovered || mobileOpen;

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
        className={`sidebar-fixed flex flex-col bg-white select-none no-scrollbar ${
          mobileOpen ? "sidebar-open" : ""
        } ${isHovered ? "sidebar-expanded" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Primary navigation"
      >

        {/* ── Primary Nav ── */}
        <nav
          className="flex-1 flex flex-col gap-1 px-3 py-3 overflow-y-auto no-scrollbar"
          aria-label="Main"
        >
          {primaryNav.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.name : undefined}
                onClick={() => setMobileOpen(false)}
                className={`
                  relative flex items-center h-10 rounded-xl text-xs font-medium
                  transition-all duration-150 group
                  ${isExpanded ? "px-3 gap-3 w-full" : "justify-center px-0 w-10 mx-auto"}
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
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.2 : 1.7}
                    style={{ color: active ? "var(--im-orange)" : undefined }}
                    className={
                      active
                        ? ""
                        : "text-im-textMuted group-hover:text-im-textLight transition-colors"
                    }
                  />
                </div>
                <span
                  className={`truncate whitespace-nowrap transition-all duration-200 ${
                    isExpanded
                      ? "opacity-100 max-w-[170px]"
                      : "opacity-0 max-w-0 overflow-hidden hidden"
                  }`}
                >
                  {item.name}
                </span>
                {active && isExpanded && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--im-orange)" }}
                  />
                )}
                {active && !isExpanded && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full"
                    style={{ backgroundColor: "var(--im-orange)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Utility Nav ── */}
        <nav
          className="flex flex-col gap-1 px-3 py-2 border-t border-[#EDE8E2]/70 shrink-0 no-scrollbar"
          aria-label="Utilities"
        >
          {utilityNav.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.name : undefined}
                onClick={() => setMobileOpen(false)}
                className={`
                  relative flex items-center h-10 rounded-xl text-xs font-medium
                  transition-all duration-150 group
                  ${isExpanded ? "px-3 gap-3 w-full" : "justify-center px-0 w-10 mx-auto"}
                  ${
                    active
                      ? "bg-[#FDF5EE] text-[#D47E30] font-semibold"
                      : "text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.2 : 1.7}
                    className={
                      active
                        ? "text-[#D47E30]"
                        : "text-im-textMuted group-hover:text-im-textLight transition-colors"
                    }
                  />
                </div>
                <span
                  className={`truncate whitespace-nowrap transition-all duration-200 ${
                    isExpanded
                      ? "opacity-100 max-w-[170px]"
                      : "opacity-0 max-w-0 overflow-hidden hidden"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom padding spacer */}
        <div className="pb-2" />
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
