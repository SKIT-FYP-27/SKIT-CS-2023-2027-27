import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
