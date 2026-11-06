import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Menu,
  X,
  BookOpen,
  LogIn,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Info,
  Mail,
  Presentation,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "INSTRUCTOR"
        ? "/instructor"
        : "/dashboard";

  const closeMenu = () => setMenuOpen(false);

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/login", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold transition duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
    }`;

  const navigationLinks = [
    { to: "/courses", label: "Explore", icon: BookOpen },
    { to: "/about", label: "About", icon: Info },
    { to: "/teach", label: "Teach", icon: Presentation },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to={user ? dashboardPath : "/courses"}
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <GraduationCap size={26} />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </span>

          <span>
            <span className="block text-xl font-extrabold tracking-tight text-slate-900">
              Learn<span className="text-indigo-600">Hub</span>
            </span>

            <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Learn • Create • Grow
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 xl:flex">
          {navigationLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={16} strokeWidth={2} />
              {label}
            </NavLink>
          ))}

          {user && (
            <Link
              to={dashboardPath}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop account actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="max-w-36 truncate px-2 text-sm font-medium text-slate-600">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
              >
                <LogIn size={16} />
                Sign in
              </Link>

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Sparkles size={16} />
                Get started
                <ChevronRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {label === "Explore" ? "Explore courses" : label === "Teach" ? "Teach on LearnHub" : label === "About" ? "About Us" : "Contact Us"}
                </span>
                <ChevronRight size={16} className="opacity-50" />
              </NavLink>
            ))}

            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700"
                >
                  <span className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </span>
                  <ChevronRight size={16} className="opacity-50" />
                </Link>

                <div className="my-2 border-t border-slate-100" />

                <div className="px-4 py-2 text-xs font-medium text-slate-400">
                  Signed in as {user.name}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-slate-100" />

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <LogIn size={18} />
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700"
                >
                  <Sparkles size={17} />
                  Create free account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}