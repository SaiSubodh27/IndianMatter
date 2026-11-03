import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-im-bg text-im-text flex flex-col font-sans">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
