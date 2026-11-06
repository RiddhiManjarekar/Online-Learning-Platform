import { useQuery } from '@tanstack/react-query';
import {
  Users, GraduationCap, UserRound, BookOpen, BookCheck, BookX,
  ClipboardList, Award, RefreshCw, AlertCircle, Sparkles
} from 'lucide-react';
import adminService from '../../services/adminService';

function StatCard({ title, value, icon: Icon, description, tone = 'indigo' }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    blue: 'bg-sky-50 text-sky-600 ring-sky-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  };
  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{(value ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div className={`rounded-2xl p-3 ring-1 ${tones[tone] || tones.indigo}`}>
          <Icon size={22} strokeWidth={1.8} />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}

function DistributionBar({ label, value = 0, total = 0, color }) {
  const percentage = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold tabular-nums text-slate-900">{value.toLocaleString('en-IN')} <span className="font-normal text-slate-400">({percentage.toFixed(0)}%)</span></span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats = {}, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['adminDashboardStats'], queryFn: adminService.getDashboardStats,
    staleTime: 30 * 1000, retry: 1,
  });

  if (isLoading) return <div className="flex min-h-96 items-center justify-center"><div className="text-center"><RefreshCw size={30} className="mx-auto animate-spin text-indigo-600" /><p className="mt-3 text-sm text-slate-500">Preparing your dashboard...</p></div></div>;
  if (isError) return <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"><AlertCircle size={38} className="mx-auto text-rose-500" /><h3 className="mt-3 text-lg font-semibold text-slate-900">Unable to load dashboard</h3><p className="mt-2 text-sm text-slate-500">{error?.response?.data?.message || 'Something went wrong while fetching dashboard statistics.'}</p><button onClick={() => refetch()} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Try again</button></div>;

  const totalUsers = stats.totalUsers ?? 0;
  const totalCourses = stats.totalCourses ?? 0;
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#172554] via-[#263b78] to-[#4f46a5] px-6 py-7 text-white shadow-lg shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="absolute -bottom-28 right-40 -z-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100"><Sparkles size={13} /> PLATFORM OVERVIEW</div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Good to see you, Admin</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100/85">Here’s a snapshot of what’s happening across your LearnHub community.</p>
          </div>
          <button onClick={() => refetch()} disabled={isFetching} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60 sm:w-auto"><RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} /> Refresh data</button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900">People & community</h2><p className="mt-1 text-sm text-slate-500">Your platform audience at a glance</p></div><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Users</span></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total users" value={stats.totalUsers} icon={Users} description="All registered platform users" tone="indigo" />
          <StatCard title="Learners" value={stats.totalLearners} icon={GraduationCap} description="Members learning on LearnHub" tone="blue" />
          <StatCard title="Instructors" value={stats.totalInstructors} icon={UserRound} description="Creators sharing their knowledge" tone="violet" />
          <StatCard title="Administrators" value={stats.totalAdmins} icon={Users} description="Platform management accounts" tone="amber" />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900">Learning activity</h2><p className="mt-1 text-sm text-slate-500">Courses and learner engagement</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Content</span></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total courses" value={stats.totalCourses} icon={BookOpen} description="Courses created on the platform" />
          <StatCard title="Published" value={stats.publishedCourses} icon={BookCheck} description="Available in the course catalogue" tone="green" />
          <StatCard title="Unpublished" value={stats.unpublishedCourses} icon={BookX} description="Draft or hidden courses" tone="amber" />
          <StatCard title="Enrollments" value={stats.totalEnrollments} icon={ClipboardList} description="Total learner course enrollments" tone="blue" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] sm:p-6">
          <div className="mb-7"><h2 className="text-lg font-bold text-slate-900">Community breakdown</h2><p className="mt-1 text-sm text-slate-500">How your registered users are distributed</p></div>
          <div className="space-y-6">
            <DistributionBar label="Learners" value={stats.totalLearners} total={totalUsers} color="bg-sky-500" />
            <DistributionBar label="Instructors" value={stats.totalInstructors} total={totalUsers} color="bg-violet-500" />
            <DistributionBar label="Administrators" value={stats.totalAdmins} total={totalUsers} color="bg-amber-500" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] sm:p-6">
          <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-slate-900">Course health</h2><p className="mt-1 text-sm text-slate-500">Publishing status overview</p></div><div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><BookCheck size={20} /></div></div>
          <div className="mt-7 space-y-6">
            <DistributionBar label="Published" value={stats.publishedCourses} total={totalCourses} color="bg-emerald-500" />
            <DistributionBar label="Unpublished" value={stats.unpublishedCourses} total={totalCourses} color="bg-orange-400" />
          </div>
          <div className="mt-7 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-sm font-medium text-slate-600">Certificates issued</span><span className="inline-flex items-center gap-2 text-lg font-bold text-slate-900"><Award size={18} className="text-amber-500" />{(stats.totalCertificates ?? 0).toLocaleString('en-IN')}</span></div>
        </div>
      </section>
    </div>
  );
}
