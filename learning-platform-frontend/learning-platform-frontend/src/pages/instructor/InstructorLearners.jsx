
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Search,
  BookOpen,
  Clock3,
  ChevronDown,
  X,
  CalendarDays,
  Award,
  RefreshCw
} from 'lucide-react'
import instructorEnrollmentService from '../../services/instructorEnrollmentService'

function StatCard({ title, value, description, icon: Icon, tone }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </article>
  )
}

function ProgressBar({ percentage }) {
  const progress = Math.min(100, Math.max(0, Number(percentage) || 0))

  return (
    <div className="min-w-28">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">
          {progress.toFixed(0)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'L'
}

function formatDate(date) {
  if (!date) return 'Not available'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return 'Not available'

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function LearnerDetails({ learner, onClose }) {
  if (!learner) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="learner-dialog-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Learner profile
            </span>
            <h2
              id="learner-dialog-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              Learning progress
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close learner details"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-700">
            {getInitials(learner.learnerName)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              {learner.learnerName}
            </h3>
            <p className="truncate text-sm text-slate-500">
              {learner.learnerEmail}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-700">Course</p>
            <p className="mt-1 font-bold text-slate-900">
              {learner.courseTitle}
            </p>
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Overall progress
              </span>
              <span className="text-sm font-bold text-indigo-700">
                {Number(learner.progressPercentage || 0).toFixed(1)}%
              </span>
            </div>
            <ProgressBar percentage={learner.progressPercentage} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <BookOpen size={19} className="text-indigo-600" />
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {learner.completedLessons} / {learner.totalLessons}
              </p>
              <p className="text-xs text-slate-500">Lessons completed</p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              {learner.completed ? (
                <Award size={19} className="text-emerald-600" />
              ) : (
                <Clock3 size={19} className="text-amber-600" />
              )}
              <p className="mt-3 text-lg font-bold text-slate-900">
                {learner.completed ? 'Completed' : 'In progress'}
              </p>
              <p className="text-xs text-slate-500">Course status</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <CalendarDays size={19} className="text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Enrolled on</p>
              <p className="text-sm font-semibold text-slate-800">
                {formatDate(learner.enrolledAt)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Close details
        </button>
      </section>
    </div>
  )
}

export default function InstructorLearners() {
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedLearner, setSelectedLearner] = useState(null)

  const {
    data: enrollments = [],
    isLoading,
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['instructorEnrollments'],
    queryFn: instructorEnrollmentService.getMyEnrollments
  })

  const courses = useMemo(() => {
    const uniqueCourses = new Map()

    enrollments.forEach(enrollment => {
      if (enrollment.courseId) {
        uniqueCourses.set(enrollment.courseId, enrollment.courseTitle)
      }
    })

    return Array.from(uniqueCourses, ([id, title]) => ({ id, title }))
  }, [enrollments])

  const filteredEnrollments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return enrollments.filter(enrollment => {
      const matchesCourse =
        selectedCourse === 'all' ||
        enrollment.courseId === selectedCourse

      const matchesSearch =
        !normalizedSearch ||
        [
          enrollment.learnerName,
          enrollment.learnerEmail,
          enrollment.courseTitle
        ].some(value => value?.toLowerCase().includes(normalizedSearch))

      return matchesCourse && matchesSearch
    })
  }, [enrollments, search, selectedCourse])

  const totalLearners = enrollments.length
  const completedLearners = enrollments.filter(item => item.completed).length
  const averageProgress = totalLearners
    ? enrollments.reduce(
        (total, item) => total + (Number(item.progressPercentage) || 0),
        0
      ) / totalLearners
    : 0

  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your learners...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <Users size={35} className="mx-auto text-rose-500" />
        <h2 className="mt-3 font-bold text-slate-900">
          Unable to load learners
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-600 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-9">
        <div className="absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full border-[35px] border-white/10" />
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-50">
              <GraduationCap size={14} /> LEARNER MANAGEMENT
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Your learning community
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-50">
              Track your learners, follow their progress and celebrate their
              achievements across your courses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/90">
            <Users size={18} />
            {totalLearners} enrolments
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total enrolments"
          value={totalLearners}
          description="Across all your courses"
          icon={Users}
          tone="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Course completions"
          value={completedLearners}
          description="Learners who completed a course"
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Average progress"
          value={`${averageProgress.toFixed(1)}%`}
          description="Average progress across enrolments"
          icon={TrendingUp}
          tone="bg-amber-50 text-amber-600"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Enrolled learners
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and monitor learners enrolled in your courses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 lg:self-auto"
            >
              <RefreshCw
                size={16}
                className={isFetching ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_260px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search learner or course..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCourse}
                onChange={event => setSelectedCourse(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              >
                <option value="all">All courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              {enrollments.length === 0 ? (
                <GraduationCap size={30} />
              ) : (
                <Search size={28} />
              )}
            </div>
            <h3 className="mt-4 font-bold text-slate-900">
              {enrollments.length === 0
                ? 'No learners yet'
                : 'No matching learners'}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {enrollments.length === 0
                ? 'Once learners enroll in your courses, they will appear here.'
                : 'Try another search term or choose a different course filter.'}
            </p>
            {search || selectedCourse !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedCourse('all')
                }}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Learner</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Enrolled</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnrollments.map(learner => (
                    <tr
                      key={learner.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                            {getInitials(learner.learnerName)}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
                              {learner.learnerName}
                            </p>
                            <p className="max-w-48 truncate text-xs text-slate-500">
                              {learner.learnerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-48 truncate text-sm font-medium text-slate-700">
                          {learner.courseTitle}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {learner.completedLessons} of {learner.totalLessons} lessons
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar percentage={learner.progressPercentage} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(learner.enrolledAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            learner.completed
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {learner.completed ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Clock3 size={13} />
                          )}
                          {learner.completed ? 'Completed' : 'In progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedLearner(learner)}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {filteredEnrollments.map(learner => (
                <article
                  key={learner.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                      {getInitials(learner.learnerName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {learner.learnerName}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        {learner.learnerEmail}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        learner.completed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {learner.completed ? 'Completed' : 'In progress'}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-700">
                      {learner.courseTitle}
                    </p>
                    <div className="mt-3">
                      <ProgressBar percentage={learner.progressPercentage} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {learner.completedLessons} of {learner.totalLessons} lessons completed
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">
                      Joined {formatDate(learner.enrolledAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedLearner(learner)}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      View details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {filteredEnrollments.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Showing {filteredEnrollments.length} of {enrollments.length} enrolments
          </div>
        )}
      </section>

      <LearnerDetails
        learner={selectedLearner}
        onClose={() => setSelectedLearner(null)}
      />
    </div>
  )
}
