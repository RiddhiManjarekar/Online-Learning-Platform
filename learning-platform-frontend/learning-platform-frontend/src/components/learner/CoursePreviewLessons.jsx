
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import {
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Eye,
} from 'lucide-react';

import courseService from '../../services/courseService';
import learnerCourseService from '../../services/learnerCourseService';

function CoursePreviewLessons({ courseId, isEnrolled = false }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const {
    data: lessonResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['courseLessons', courseId, isEnrolled],
    queryFn: () =>
      isEnrolled
        ? learnerCourseService.getLessons(courseId)
        : courseService.getPublicLessons(courseId),
    enabled: Boolean(courseId),
  });

  const lessons = Array.isArray(lessonResponse)
    ? lessonResponse
    : Array.isArray(lessonResponse?.data)
      ? lessonResponse.data
      : [];

  const sortedLessons = useMemo(
    () =>
      [...lessons].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      ),
    [lessons]
  );

  const activeLesson = selectedLesson
    ? sortedLessons.find((lesson) => lesson.id === selectedLesson)
    : null;

  const currentLesson =
    activeLesson ||
    sortedLessons.find((lesson) => lesson.preview) ||
    sortedLessons[0] ||
    null;

  // Reset selection when the course changes.
  useEffect(() => {
    setSelectedLesson(null);
  }, [courseId]);

  // Reset selection if the selected lesson is no longer available.
  useEffect(() => {
    if (
      selectedLesson &&
      !sortedLessons.some((lesson) => lesson.id === selectedLesson)
    ) {
      setSelectedLesson(null);
    }
  }, [selectedLesson, sortedLessons]);

  const canWatch = (lesson) =>
    Boolean(isEnrolled || lesson.preview);

  const handleSelectLesson = (lesson) => {
    if (canWatch(lesson)) {
      setSelectedLesson(lesson.id);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="rounded-[24px] border border-slate-200/80 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
          <LoaderCircle
            className="animate-spin text-indigo-600"
            size={28}
          />
        </div>

        <p className="mt-4 text-sm font-bold text-slate-700">
          Loading course lessons...
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Preparing your learning content
        </p>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="rounded-[24px] border border-rose-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <RefreshCw size={25} />
        </div>

        <h2 className="mt-5 text-lg font-extrabold text-slate-900">
          Unable to load course lessons
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Something went wrong while loading the course content.
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isFetching ? 'animate-spin' : ''}
          />
          Try again
        </button>
      </section>
    );
  }

  // Empty state
  if (sortedLessons.length === 0) {
    return (
      <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
          <BookOpen size={30} />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-900">
          Lessons coming soon
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          The instructor is preparing the course content.
          Check back later for new lessons!
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">

      {/* Section heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
            <Sparkles size={14} />
            What's inside
          </span>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Course curriculum
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Explore the lessons and discover what you'll learn.
          </p>
        </div>

        {!isEnrolled && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
            <Eye size={15} />
            Free previews available
          </span>
        )}
      </div>

      {/* Curriculum and video layout */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">

        {/* Lesson list */}
        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <div>
              <h3 className="font-extrabold text-slate-900">
                Lessons
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {sortedLessons.length} lessons in this course
              </p>
            </div>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-indigo-50 px-2 text-sm font-extrabold text-indigo-700">
              {sortedLessons.length}
            </span>
          </div>

          <div className="max-h-[520px] space-y-2 overflow-y-auto p-3">
            {sortedLessons.map((lesson, index) => {
              const available = canWatch(lesson);
              const selected = currentLesson?.id === lesson.id;
              const duration = Number(lesson.durationSeconds) || 0;

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson)}
                  disabled={!available}
                  aria-pressed={selected}
                  className={`group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                    selected
                      ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                      : available
                        ? 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                        : 'cursor-not-allowed border-transparent bg-slate-50/70 opacity-65'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                      selected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : available
                          ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {available ? (
                      <PlayCircle size={20} />
                    ) : (
                      <Lock size={17} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold leading-5 ${
                        selected ? 'text-indigo-800' : 'text-slate-800'
                      }`}
                    >
                      {index + 1}. {lesson.title}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {lesson.preview && !isEnrolled && (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                          Free preview
                        </span>
                      )}

                      {duration > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={12} />
                          {formatDuration(duration)}
                        </span>
                      )}

                      {!available && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Enroll to unlock
                        </span>
                      )}
                    </div>
                  </div>

                  {selected && (
                    <CheckCircle2
                      size={17}
                      className="mt-1 shrink-0 text-indigo-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {!isEnrolled && (
            <div className="border-t border-slate-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <Lock size={17} />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Want full access?
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Enroll in this course to unlock all lessons.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video preview */}
        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
          {currentLesson && canWatch(currentLesson) && currentLesson.embedUrl ? (
            <>
              <div className="relative overflow-hidden bg-slate-950">
                <iframe
                  key={currentLesson.id}
                  src={currentLesson.embedUrl}
                  title={currentLesson.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={14} />
                    {isEnrolled ? 'Available in your course' : 'Free preview'}
                  </span>

                  {Number(currentLesson.durationSeconds) > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Clock size={14} />
                      {formatDuration(Number(currentLesson.durationSeconds))}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-black leading-snug text-slate-900">
                  {currentLesson.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {currentLesson.description ||
                    'No lesson description available.'}
                </p>

                {isEnrolled && (
                  <Link
                    to={`/learn/${courseId}`}
                    className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <BookOpen size={18} />
                    Open learning player
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="flex min-h-[350px] flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm">
                {currentLesson ? (
                  <Lock size={29} />
                ) : (
                  <PlayCircle size={30} />
                )}
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                {currentLesson
                  ? 'Video preview unavailable'
                  : 'Select a lesson to get started'}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {currentLesson
                  ? 'This lesson does not currently have an available video preview.'
                  : 'Choose an available lesson from the list to watch its video here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CoursePreviewLessons;
