import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { Sidebar } from "./sidebar";
import { Badge } from "../ui";
import CustomIcon from "../../assets/custom-icon";

export function Layout() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getBreadcrumb = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "Home";
      case "/catalog":
        return "Book Catalog";
      case "/history":
        return "History Log";
      case "/staff":
        return "Staff & Users";
      default:
        return "Home";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      {/* Reusable Sidebar */}
      <Sidebar
        isOpenMobile={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <CustomIcon icon="menu" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400">Dashboard</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900">{getBreadcrumb(location.pathname)}</span>
            </div>
          </div>

          <Badge variant={isAdmin ? "violet" : "emerald"}>{user?.role}</Badge>
        </header>

        {/* Content Body */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
