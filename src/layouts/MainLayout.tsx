import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-im-bg text-im-text font-sans flex flex-col">
      {/* Fixed top navigation bar — IndianMatter logo in top left, search bar beside it */}
      <TopHeader onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />

      <div className="flex-1 flex pt-16 relative">
        {/* Left dashboard sidebar — below top header, expands on hover, no logo */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main content — offset by sidebar rail with dividing vertical border */}
        <div className="main-offset flex flex-col flex-1 min-h-[calc(100vh-4rem)] min-w-0 border-l-0 md:border-l md:border-[#EDE8E2]">
          <main className="flex-1 overflow-auto no-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
