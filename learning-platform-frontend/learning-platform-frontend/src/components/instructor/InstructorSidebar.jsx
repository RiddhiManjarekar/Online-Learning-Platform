import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  GraduationCap,
  LogOut,
  Users
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { label: 'Overview', path: '/instructor', icon: LayoutDashboard, end: true },
  { label: 'My Courses', path: '/instructor/courses', icon: BookOpen,end:true },
  { label: 'Create Course', path: '/instructor/courses/create', icon: PlusCircle },
  { label: 'My Learners', path: '/instructor/learners', icon: Users }
]

export default function InstructorSidebar({ onNavigate }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-slate-950 text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">LearnHub</h1>
          <p className="text-xs text-slate-400">Instructor Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        {navigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={19} />
          Sign out
        </button>
      </div>
    </aside>
  )
}