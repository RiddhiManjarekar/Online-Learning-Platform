import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LoaderCircle,
  PlayCircle,
  Sparkles,
  Clock3,
  ShieldCheck,
  Users,
  BookMarked,
  CircleCheck,
  RefreshCw,
} from "lucide-react";

import courseService from "../../services/courseService";
import enrollmentService from "../../services/enrollmentService";
import { useAuth } from "../../context/AuthContext";
import LearnerNavbar from "../../components/learner/LearnerNavbar";
import CoursePreviewLessons from "../../components/learner/CoursePreviewLessons";

const levelStyles = {
  BEGINNER: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  INTERMEDIATE: "bg-amber-50 text-amber-700 ring-amber-100",
  ADVANCED: "bg-rose-50 text-rose-700 ring-rose-100",
};

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, loading: authLoading } = useAuth();

  const [enrollError, setEnrollError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
    error,
    refetch: refetchCourse,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseById(courseId),
    enabled: Boolean(courseId),
  });

  useEffect(() => {
    setImageFailed(false);
  }, [course?.thumbnailUrl]);

  const {
    data: enrollmentResponse,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
  } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: enrollmentService.getMyEnrollments,
    enabled: Boolean(user && user.role === "LEARNER"),
  });

  const enrollments = Array.isArray(enrollmentResponse)
    ? enrollmentResponse
    : Array.isArray(enrollmentResponse?.data)
      ? enrollmentResponse.data
      : [];

  const isEnrolled = enrollments.some(
    (enrollment) => enrollment.courseId === courseId,
  );

  const enrollMutation = useMutation({
    mutationFn: () => enrollmentService.enroll(courseId),

    onSuccess: async () => {
      setEnrollError("");

      await queryClient.invalidateQueries({
        queryKey: ["myEnrollments"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["myEnrollment", courseId],
      });
    },

    onError: (err) => {
      setEnrollError(
        err.response?.data?.message ||
          "Unable to enroll in this course. Please try again.",
      );
    },
  });

  const handleEnroll = () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/courses/${courseId}` },
      });
      return;
    }

    if (user.role !== "LEARNER") return;

    setEnrollError("");
    enrollMutation.mutate();
  };

  if (authLoading || courseLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Preparing your learning experience...
          </p>
          <p className="mt-1 text-xs text-slate-400">Just a moment</p>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <LearnerNavbar />

        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500">
            <BookOpen size={36} />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
            We couldn't find this course
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            {error?.response?.data?.message ||
              "This course may have been unpublished or removed."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchCourse()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <ArrowLeft size={17} />
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canEnroll = user?.role === "LEARNER";
  const isInstructor = user?.role === "INSTRUCTOR" || user?.role === "ADMIN";

  const levelClass =
    levelStyles[course.level] || "bg-indigo-50 text-indigo-700 ring-indigo-100";

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <LearnerNavbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        {/* Back navigation */}
        <Link
          to="/courses"
          className="mb-7 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to courses
        </Link>

        {/* Course layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          {/* Main course content */}
          <section className="min-w-0">
            {/* Course banner */}
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-indigo-200 via-violet-200 to-fuchsia-200 sm:h-[390px]">
                {course.thumbnailUrl && !imageFailed ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-[32px] border border-white/60 bg-white/50 shadow-xl backdrop-blur-sm">
                      <BookOpen className="h-16 w-16 text-indigo-600" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10" />

                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-7 sm:left-7">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-lg backdrop-blur">
                    <Sparkles size={14} />
                    Featured learning
                  </span>

                  {course.published && (
                    <span className="rounded-full border border-white/30 bg-emerald-500/90 px-3.5 py-2 text-xs font-bold text-white shadow-lg">
                      <CheckCircle2 size={13} className="mr-1 inline" />
                      Published
                    </span>
                  )}
                </div>
              </div>

              {/* Course information */}
              <div className="p-5 sm:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700">
                    {course.category}
                  </span>

                  <span
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${levelClass}`}
                  >
                    {course.level}
                  </span>
                </div>

                <h1 className="max-w-4xl text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[42px]">
                  {course.title}
                </h1>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  {course.description}
                </p>

                {/* Course highlights */}
                <div className="mt-8 grid gap-3 border-t border-slate-100 pt-7 sm:grid-cols-2">
                  <div className="group flex items-center gap-3 rounded-2xl border border-indigo-100/70 bg-indigo-50/60 p-4 transition hover:-translate-y-0.5 hover:bg-indigo-50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <GraduationCap size={23} />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        Learn anywhere
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Online learning experience
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 rounded-2xl border border-emerald-100/70 bg-emerald-50/60 p-4 transition hover:-translate-y-0.5 hover:bg-emerald-50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                      <Clock3 size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        Your own pace
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Learn whenever you're ready
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 rounded-2xl border border-violet-100/70 bg-violet-50/60 p-4 transition hover:-translate-y-0.5 hover:bg-violet-50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                      <BookMarked size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        Structured lessons
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Follow your learning journey
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 rounded-2xl border border-amber-100/70 bg-amber-50/60 p-4 transition hover:-translate-y-0.5 hover:bg-amber-50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        Learn with confidence
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Access your enrolled course
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson preview heading */}

            {/* Course curriculum and lesson previews */}
            <div className="mt-10">
              <CoursePreviewLessons
                courseId={courseId}
                isEnrolled={isEnrolled}
              />
            </div>
          </section>

          {/* Enrollment sidebar */}
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
              {/* Sidebar gradient header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl" />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-white">
                    <Sparkles size={13} />
                    YOUR NEXT LEARNING JOURNEY
                  </span>

                  <h2 className="mt-5 text-2xl font-black leading-tight">
                    Start learning today
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-indigo-100">
                    Take the next step towards your learning goals.
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-slate-800">
                      Your learning starts here
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Enroll to access lessons and keep track of your course
                      progress.
                    </p>
                  </div>
                </div>

                {/* Enrollment status */}
                {canEnroll && enrollmentsLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-4 text-sm font-semibold text-slate-500">
                    <LoaderCircle size={17} className="animate-spin" />
                    Checking enrollment...
                  </div>
                ) : isEnrolled ? (
                  <div>
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
                      <CheckCircle2 size={22} className="shrink-0" />

                      <div>
                        <p className="text-sm font-extrabold">
                          You're enrolled!
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-600">
                          Continue where you left off.
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/learn/${courseId}`}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <PlayCircle size={19} />
                      Continue learning
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                ) : canEnroll ? (
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending || enrollmentsError}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enrollMutation.isPending ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Enrolling...
                      </>
                    ) : enrollmentsError ? (
                      "Unable to check enrollment"
                    ) : (
                      <>
                        Enroll now
                        <ArrowRight
                          size={18}
                          className="transition group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                ) : isInstructor ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <GraduationCap size={19} />
                      <p className="text-sm font-bold">Instructor account</p>
                    </div>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Instructor and admin accounts cannot enroll as learners.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnroll}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Login to enroll
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>
                )}

                {/* Enrollment feedback */}
                {enrollError && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm leading-6 text-rose-700"
                  >
                    {enrollError}
                  </p>
                )}

                {enrollMutation.isSuccess && (
                  <p
                    role="status"
                    className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
                  >
                    <CircleCheck size={18} />
                    Successfully enrolled! Your course is ready.
                  </p>
                )}

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                    <Users size={15} />
                    Learn at your own pace
                  </div>

                  <p className="mt-2 text-center text-xs leading-5 text-slate-400">
                    Grow your skills one lesson at a time.
                  </p>
                </div>
              </div>
            </div>

            {/* Small supporting card */}
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5">
              <div className="flex items-center gap-2 text-indigo-700">
                <Sparkles size={18} />
                <p className="text-sm font-extrabold">Keep growing</p>
              </div>

              <p className="mt-2 text-xs leading-6 text-slate-600">
                Every lesson is another opportunity to build your knowledge and
                move closer to your goals.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;
