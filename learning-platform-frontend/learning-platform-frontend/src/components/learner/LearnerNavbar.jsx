import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LogOut,
  UserRound,
  Award,
  LayoutDashboard,
  GraduationCap,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export default function LearnerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const homePath = user ? '/dashboard' : '/courses';

  const navClass = ({ isActive }) =>
    `inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-700'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-[76px] sm:px-6 lg:px-8">
        <Link to={homePath} className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap size={23} />
          </span>

          <span className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
            Learn<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/courses" className={navClass}>
            <BookOpen size={16} />
            Explore
          </NavLink>

          {user?.role === 'LEARNER' && (
            <>
              <NavLink to="/dashboard" end className={navClass}>
                <LayoutDashboard size={16} />
                My learning
              </NavLink>

              <NavLink to="/certificates" className={navClass}>
                <Award size={16} />
                Certificates
              </NavLink>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user?.name && (
            <span className="hidden max-w-40 items-center gap-2 truncate rounded-full bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 lg:inline-flex">
              <UserRound size={16} className="shrink-0 text-indigo-500" />
              <span className="truncate">{user.name}</span>
            </span>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:px-4 sm:text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {user?.role === 'LEARNER' && (
        <div className="flex justify-center gap-1 border-t border-slate-100 px-2 py-2 md:hidden">
          <NavLink to="/courses" className={navClass}>
            <BookOpen size={15} />
            Explore
          </NavLink>

          <NavLink to="/dashboard" end className={navClass}>
            <LayoutDashboard size={15} />
            My learning
          </NavLink>

          <NavLink to="/certificates" className={navClass}>
            <Award size={15} />
            Certificates
          </NavLink>
        </div>
      )}
    </header>
  );
}