import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import CustomIcon from "../../assets/custom-icon";

export type SidebarProps = {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
};

export function Sidebar({ isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const path = location.pathname;
  const isAdmin = user?.role === "ADMIN";

  const allNavItems = [
    {
      to: "/",
      label: "Home",
      icon: <CustomIcon icon="home" className="w-5 h-5" />,
      adminOnly: false,
    },
    {
      to: "/catalog",
      label: "Book Catalog",
      icon: <CustomIcon icon="book-open" className="w-5 h-5" />,
      adminOnly: false,
    },
    {
      to: "/history",
      label: "History Log",
      icon: <CustomIcon icon="history" className="w-5 h-5" />,
      adminOnly: false,
    },
    {
      to: "/staff",
      label: "Staff & Users",
      icon: <CustomIcon icon="users" className="w-5 h-5" />,
      adminOnly: true,
    },
  ];

  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eb3338] flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <CustomIcon icon="arrow-right" className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  LibTracker
                </h1>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Dashboard
                </span>
              </div>
            </div>

            {/* Mobile Close */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-red-50 text-[#eb3338] font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={isActive ? "text-[#eb3338]" : "text-slate-400"}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                {user?.username?.charAt(0) || "U"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.username}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <CustomIcon icon="log-out" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
