import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-im-bg text-im-text font-sans">
      {/* Fixed sidebar — locked on desktop */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div className="main-offset flex flex-col min-h-screen min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
