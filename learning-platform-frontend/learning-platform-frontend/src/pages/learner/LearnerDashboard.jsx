import { useQuery } from '@tanstack/react-query';
import { Navigate, Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Trophy,
  TrendingUp,
  Compass,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Target,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import enrollmentService from '../../services/enrollmentService';
import LearnerNavbar from '../../components/learner/LearnerNavbar';
import EnrolledCourseCard from '../../components/learner/EnrolledCourseCard';

function LearnerDashboard() {
  const { user, loading } = useAuth();

  const {
    data: enrollmentResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['myEnrollments'],
    queryFn: enrollmentService.getMyEnrollments,
    enabled: Boolean(user && user.role === 'LEARNER'),
  });

  const enrollments = Array.isArray(enrollmentResponse)
    ? enrollmentResponse
    : Array.isArray(enrollmentResponse?.data)
      ? enrollmentResponse.data
      : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading your learning space...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'INSTRUCTOR') {
    return <Navigate to="/instructor" replace />;
  }

  if (user.role !== 'LEARNER') {
    return <Navigate to="/" replace />;
  }

  const totalCourses = enrollments.length;

  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.completed
  ).length;

  const inProgressCourses = enrollments.filter(
    (enrollment) =>
      !enrollment.completed &&
      (enrollment.completedLessons || 0) > 0
  ).length;

  const overallProgress =
    totalCourses === 0
      ? 0
      : enrollments.reduce(
          (total, enrollment) =>
            total + (enrollment.progressPercentage || 0),
          0
        ) / totalCourses;

  const stats = [
    {
      label: 'Enrolled courses',
      value: totalCourses,
      icon: BookOpen,
      iconStyle: 'bg-indigo-50 text-indigo-600',
      accent: 'from-indigo-500 to-violet-500',
    },
    {
      label: 'In progress',
      value: inProgressCourses,
      icon: TrendingUp,
      iconStyle: 'bg-amber-50 text-amber-600',
      accent: 'from-amber-400 to-orange-500',
    },
    {
      label: 'Completed',
      value: completedCourses,
      icon: Trophy,
      iconStyle: 'bg-emerald-50 text-emerald-600',
      accent: 'from-emerald-400 to-teal-500',
    },
    {
      label: 'Overall progress',
      value: `${overallProgress.toFixed(0)}%`,
      icon: Target,
      iconStyle: 'bg-fuchsia-50 text-fuchsia-600',
      accent: 'from-fuchsia-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <LearnerNavbar />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* Welcome section */}
        <section className="relative isolate mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-500 p-6 text-white shadow-[0_20px_55px_rgba(79,70,229,0.20)] sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[38px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-[10px] font-extrabold tracking-[0.18em] text-white sm:text-xs">
              <Sparkles size={14} />
              YOUR LEARNING SPACE
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back, {user.name || 'Learner'}!
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
              Every lesson brings you closer to your goals. Continue where you
              left off and keep building your skills.
            </p>

            <Link
              to="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              <Compass size={18} />
              Explore courses
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.accent}`} />

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                      {isLoading ? '—' : isError ? '—' : stat.value}
                    </p>
                  </div>

                  <div className={`rounded-2xl p-3 ${stat.iconStyle}`}>
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Learning overview */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
                Your progress
              </span>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                My learning
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Pick up where you left off and keep making progress.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
            >
              Browse more courses
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-3xl border border-slate-100 bg-white"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <RefreshCw size={25} />
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                Couldn't load your courses
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {error?.response?.data?.message ||
                  error?.message ||
                  'Something went wrong. Please try again.'}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={isFetching ? 'animate-spin' : ''}
                />
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && enrollments.length > 0 && (
            <>
              <p className="mb-4 text-sm text-slate-500">
                You are learning in{' '}
                <strong className="text-slate-800">
                  {enrollments.length}
                </strong>{' '}
                course{enrollments.length === 1 ? '' : 's'}.
              </p>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {enrollments.map((enrollment) => (
                  <EnrolledCourseCard
                    key={enrollment.id}
                    enrollment={enrollment}
                  />
                ))}
              </div>
            </>
          )}

          {!isLoading && !isError && enrollments.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <GraduationCap size={34} />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                Your learning journey starts here!
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You haven't enrolled in any courses yet. Explore the catalogue
                and find something exciting to learn.
              </p>

              <Link
                to="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                <BookOpen size={18} />
                Explore courses
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default LearnerDashboard;