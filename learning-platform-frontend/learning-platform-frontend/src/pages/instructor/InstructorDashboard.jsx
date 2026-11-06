
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Globe,
  FileEdit,
  ArrowRight,
  Plus,
  Sparkles,
  Layers3,
  Users,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import courseService from "../../services/courseService";
import instructorEnrollmentService from "../../services/instructorEnrollmentService";

function StatCard({ title, value, icon: Icon, description, tone }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-2xl p-3 ${tone}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </article>
  );
}

export default function InstructorDashboard() {
  // Fetch instructor courses
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: courseService.getMyCourses,
  });

  // Fetch instructor enrollments
  const {
    data: enrollments = [],
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    refetch: refetchEnrollments,
    isFetching: enrollmentsFetching,
  } = useQuery({
    queryKey: ["instructorEnrollments"],
    queryFn: instructorEnrollmentService.getMyEnrollments,
  });

  // Course statistics
  const publishedCourses = courses.filter((course) => course.published);
  const draftCourses = courses.filter((course) => !course.published);

  const recentCourses = [...courses]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 4);

  // Enrollment statistics
  const totalLearners = enrollments.length;

  const completedLearners = enrollments.filter(
    (enrollment) => enrollment.completed
  ).length;

  const averageProgress = totalLearners
    ? enrollments.reduce(
        (total, enrollment) =>
          total + (Number(enrollment.progressPercentage) || 0),
        0
      ) / totalLearners
    : 0;

  // Course loading state
  if (isLoading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading your workspace...
      </div>
    );
  }

  // Course error state
  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center text-rose-600">
        Unable to load your courses. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7">

      {/* Welcome Section */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#172554] via-[#254477] to-[#0f766e] px-6 py-7 text-white shadow-lg shadow-slate-900/10 sm:px-8 sm:py-9">
        <div className="absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full border-[35px] border-white/5" />

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100">
              <Sparkles size={13} /> INSTRUCTOR STUDIO
            </span>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Your teaching space
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-100/85">
              Create meaningful learning experiences and keep your courses
              moving forward.
            </p>
          </div>

          <Link
            to="/instructor/courses/create"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-teal-50 sm:w-auto"
          >
            <Plus size={18} /> Create a course
          </Link>
        </div>
      </section>

      {/* Course Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Your course portfolio
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A quick look at the content you manage
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total courses"
            value={courses.length}
            icon={Layers3}
            description="All courses created by you"
            tone="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Published courses"
            value={publishedCourses.length}
            icon={Globe}
            description="Visible in the course catalogue"
            tone="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Draft courses"
            value={draftCourses.length}
            icon={FileEdit}
            description="Courses still being prepared"
            tone="bg-amber-50 text-amber-600"
          />
        </div>
      </section>

      {/* Learner Statistics */}
      <section>
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your learners
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor the progress of learners in your courses.
            </p>
          </div>

          <Link
            to="/instructor/learners"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View all learners <ArrowRight size={16} />
          </Link>
        </div>

        {enrollmentsError ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-rose-600">
              Unable to load learner statistics.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() => refetchEnrollments()}
              disabled={enrollmentsFetching}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={enrollmentsFetching ? "animate-spin" : ""}
              />
              Try again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total enrolments"
              value={enrollmentsLoading ? "..." : totalLearners}
              icon={Users}
              description="Across all your courses"
              tone="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              title="Completed courses"
              value={enrollmentsLoading ? "..." : completedLearners}
              icon={CheckCircle2}
              description="Learners who completed a course"
              tone="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Average progress"
              value={
                enrollmentsLoading
                  ? "..."
                  : `${averageProgress.toFixed(1)}%`
              }
              icon={TrendingUp}
              description="Average learner progress"
              tone="bg-amber-50 text-amber-600"
            />
          </div>
        )}
      </section>

      {/* Recently Created Courses */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] sm:p-7">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recently created
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pick up where you left off
            </p>
          </div>

          <Link
            to="/instructor/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            All courses <ArrowRight size={16} />
          </Link>
        </div>

        {recentCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
            <BookOpen size={34} className="mx-auto text-slate-400" />

            <h3 className="mt-3 font-semibold text-slate-900">
              Your first course starts here
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Build a course and share your knowledge with learners.
            </p>

            <Link
              to="/instructor/courses/create"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-indigo-600"
            >
              Create your first course <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {course.category} · {course.level}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    course.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {course.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
