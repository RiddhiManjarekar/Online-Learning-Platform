import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, UserRound, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-slate-950/60"
          />
          <div className="relative flex w-72 max-w-[85vw] flex-col shadow-2xl">
            <div className="absolute right-3 top-4 z-10">
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6 md:h-20 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900 md:text-lg">
                Admin Panel
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your learning platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 sm:flex">
              <ShieldCheck size={17} className="text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700">
                Administrator
              </span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="rounded-full bg-slate-100 p-2">
                <UserRound size={18} className="text-slate-600" />
              </div>
              <div>
                <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                  {user?.name || "Admin"}
                </p>
                <p className="max-w-40 truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
