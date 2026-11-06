import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Award,
  Settings,
  GraduationCap,
} from "lucide-react";

const sections = [
  {
    title: "Main Menu",
    links: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/admin/users", label: "User Management", icon: Users },
    ],
  },
  {
    title: "Management",
    links: [
      { to: "/admin/courses", label: "Courses", icon: BookOpen },
      { to: "/admin/enrollments", label: "Enrollments", icon: Users },
      {
        to: "/admin/instructor-applications",
        label: "Instructor Applications",
        icon: GraduationCap,
      },
      { to: "/admin/certificates", label: "Certificates", icon: Award },
      { to: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
    ],
  },
  {
    title: "Other",
    links: [{ to: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

export default function AdminSidebar({ onNavigate }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-950 text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">LearnHub</h1>
          <p className="text-xs text-slate-400">Administration</p>
        </div>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            <div className="space-y-1.5">
              {section.links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  onClick={onNavigate}
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-5">
        <p className="text-xs font-medium text-slate-300">
          LearnHub Admin Panel
        </p>
        <p className="mt-1 text-xs text-slate-500">Platform Management</p>
      </div>
    </aside>
  );
}
