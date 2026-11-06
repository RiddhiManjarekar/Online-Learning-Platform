import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  LoaderCircle,
  Lock,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import LearnerNavbar from '../../components/learner/LearnerNavbar';
import learnerCourseService from '../../services/learnerCourseService';

function LearningPlayer() {
  const { courseId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completionError, setCompletionError] = useState('');

  const {
    data: lessonsResponse,
    isLoading: lessonsLoading,
    isError: lessonsError,
    error: lessonError,
    refetch: refetchLessons,
  } = useQuery({
    queryKey: ['learnerLessons', courseId],
    queryFn: () => learnerCourseService.getLessons(courseId),
    enabled: Boolean(user && user.role === 'LEARNER' && courseId),
  });

  const {
    data: progress,
    isLoading: progressLoading,
    isError: progressError,
    error: progressFetchError,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: () => learnerCourseService.getProgress(courseId),
    enabled: Boolean(user && user.role === 'LEARNER' && courseId),
  });

  // Support services that return either an array or an Axios response.
  const sortedLessons = useMemo(() => {
    const responseData = lessonsResponse?.data ?? lessonsResponse;
    const lessonList = Array.isArray(responseData) ? responseData : [];

    return [...lessonList].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );
  }, [lessonsResponse]);

  // Keep the selected lesson index valid if the lesson list changes.
  useEffect(() => {
    setSelectedIndex((currentIndex) => {
      if (sortedLessons.length === 0) {
        return 0;
      }

      return Math.min(currentIndex, sortedLessons.length - 1);
    });
  }, [sortedLessons.length]);

  const currentLesson = sortedLessons[selectedIndex];

  const completeMutation = useMutation({
    mutationFn: (lessonId) =>
      learnerCourseService.completeLesson(courseId, lessonId),

    onSuccess: async () => {
      setCompletionError('');

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['learnerLessons', courseId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['courseProgress', courseId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['myEnrollments'],
        }),
      ]);
    },

    onError: (error) => {
      setCompletionError(
        error?.response?.data?.message ||
          error?.message ||
          'Could not mark this lesson as completed. Please try again.'
      );
    },
  });

  const handleComplete = () => {
    if (
      !currentLesson ||
      currentLesson.completed ||
      currentLesson.locked ||
      completeMutation.isPending
    ) {
      return;
    }

    setCompletionError('');
    completeMutation.mutate(currentLesson.id);
  };

  const goToPrevious = () => {
    setCompletionError('');
    setSelectedIndex((index) => Math.max(0, index - 1));
  };

  const goToNext = () => {
    setCompletionError('');
    setSelectedIndex((index) =>
      Math.min(sortedLessons.length - 1, index + 1)
    );
  };

  const handleLessonSelect = (index, lesson) => {
    if (lesson.locked) {
      return;
    }

    setCompletionError('');
    setSelectedIndex(index);
  };

  const rawPercentage = Number(progress?.progressPercentage ?? 0);
  const percentage = Number.isFinite(rawPercentage)
    ? Math.min(100, Math.max(0, rawPercentage))
    : 0;

  const completedLessons = progress?.completedLessons ?? 0;
  const totalLessons = progress?.totalLessons ?? sortedLessons.length;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'LEARNER') {
    return (
      <Navigate
        to={
          user.role === 'INSTRUCTOR' || user.role === 'ADMIN'
            ? '/instructor'
            : '/'
        }
        replace
      />
    );
  }

  if (lessonsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-sm font-medium text-slate-600">
          Loading your lessons...
        </span>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LearnerNavbar />

        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <PlayCircle className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to load lessons
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {lessonError?.response?.data?.message ||
              'You may not be enrolled in this course, or the course is unavailable.'}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => refetchLessons()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sortedLessons.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LearnerNavbar />

        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <PlayCircle className="h-8 w-8 text-indigo-600" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No lessons available
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            The instructor has not added lessons to this course yet.
          </p>

          <Link
            to="/dashboard"
            className="mt-7 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LearnerNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Course progress */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Your learning progress
              </p>

              <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                {progress?.courseTitle || 'Your Course'}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {progressLoading
                  ? 'Updating your progress...'
                  : `${completedLessons} of ${totalLessons} lessons completed`}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-4 py-2 text-right">
              <p className="text-2xl font-bold tabular-nums text-indigo-700">
                {progressLoading ? '—' : `${percentage}%`}
              </p>
              <p className="text-xs font-medium text-indigo-600">
                Completed
              </p>
            </div>
          </div>

          <div
            className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Course completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {progressError && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-amber-700">
              <span>
                Could not refresh progress
                {progressFetchError?.response?.data?.message
                  ? `: ${progressFetchError.response.data.message}`
                  : '.'}
              </span>

              <button
                onClick={() => refetchProgress()}
                className="font-semibold underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          )}
        </section>

        {/* Player and lesson list */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
          {/* Main lesson area */}
          <main className="min-w-0 lg:col-span-2">
            {/* Video */}
            <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-lg">
              {currentLesson?.embedUrl && !currentLesson.locked ? (
                <iframe
                  key={currentLesson.id}
                  src={currentLesson.embedUrl}
                  title={currentLesson.title || 'Course lesson video'}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center px-4 text-center text-white">
                  <Lock size={40} className="mb-3 text-slate-400" />
                  <p className="text-lg font-semibold">
                    {currentLesson?.locked
                      ? 'This lesson is locked'
                      : 'Video unavailable'}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {currentLesson?.locked
                      ? 'This lesson is not currently available to you.'
                      : 'The instructor has not provided a video for this lesson.'}
                  </p>
                </div>
              )}
            </div>

            {/* Lesson information */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-indigo-600">
                    Lesson {selectedIndex + 1} of {sortedLessons.length}
                  </p>

                  <h2 className="mt-2 break-words text-xl font-bold text-slate-900 sm:text-2xl">
                    {currentLesson?.title}
                  </h2>
                </div>

                {currentLesson?.completed && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle size={15} />
                    Completed
                  </span>
                )}
              </div>

              {currentLesson?.description && (
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {currentLesson.description}
                </p>
              )}

              {currentLesson?.durationSeconds > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  <Clock size={16} />
                  {Math.floor(currentLesson.durationSeconds / 60)} minutes
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={goToPrevious}
                  disabled={selectedIndex === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <button
                  onClick={handleComplete}
                  disabled={
                    currentLesson?.completed ||
                    currentLesson?.locked ||
                    completeMutation.isPending
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completeMutation.isPending ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}

                  {currentLesson?.completed
                    ? 'Completed'
                    : completeMutation.isPending
                      ? 'Saving...'
                      : 'Mark as Complete'}
                </button>

                <button
                  onClick={goToNext}
                  disabled={selectedIndex === sortedLessons.length - 1}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>

              {completionError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {completionError}
                </p>
              )}
            </section>
          </main>

          {/* Lesson sidebar */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-900">
                  Course Content
                </h2>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  {sortedLessons.length} lessons
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Select a lesson to start learning
              </p>
            </div>

            <div className="max-h-[650px] space-y-2 overflow-y-auto p-3">
              {sortedLessons.map((lesson, index) => {
                const isSelected = index === selectedIndex;
                const isLocked = Boolean(lesson.locked);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleLessonSelect(index, lesson)}
                    disabled={isLocked}
                    aria-current={isSelected ? 'step' : undefined}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                      isSelected
                        ? 'bg-indigo-50 ring-1 ring-indigo-200'
                        : isLocked
                          ? 'cursor-not-allowed bg-slate-50 opacity-60'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isLocked ? (
                        <Lock size={18} className="text-slate-400" />
                      ) : lesson.completed ? (
                        <CheckCircle
                          size={19}
                          className="text-emerald-600"
                        />
                      ) : (
                        <Circle
                          size={19}
                          className={
                            isSelected
                              ? 'text-indigo-600'
                              : 'text-slate-300'
                          }
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`break-words text-sm font-semibold ${
                          isSelected
                            ? 'text-indigo-700'
                            : 'text-slate-800'
                        }`}
                      >
                        {index + 1}. {lesson.title}
                      </p>

                      {lesson.durationSeconds > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          {Math.floor(lesson.durationSeconds / 60)} min
                        </p>
                      )}

                      {isLocked && (
                        <p className="mt-1 text-xs text-slate-400">
                          Locked
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <PlayCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-indigo-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default LearningPlayer;