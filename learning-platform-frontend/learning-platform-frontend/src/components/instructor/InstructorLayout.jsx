import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import InstructorSidebar from "./InstructorSidebar";
import { useAuth } from "../../context/AuthContext";

export default function InstructorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f6f7fb] lg:flex">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:flex">
        <InstructorSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-slate-950/60"
          />
          <div className="relative flex shadow-2xl">
            <InstructorSidebar onNavigate={() => setSidebarOpen(false)} />
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 rounded-lg p-2 text-slate-300 hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Instructor Workspace
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Create and manage your courses
              </p>
            </div>
          </div>
          <p className="max-w-40 truncate text-sm font-medium text-slate-600">
            {user?.name || "Instructor"}
          </p>
        </header>
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
