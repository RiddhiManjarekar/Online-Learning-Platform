import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

import CourseForm from "../../components/instructor/CourseForm";
import courseService from "../../services/courseService";

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: courseService.getMyCourses,
  });

  const course = courses.find((item) => item.id === courseId);

  const updateMutation = useMutation({
    mutationFn: (data) => courseService.updateCourse(courseId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instructorCourses"],
      });

      navigate("/instructor/courses");
    },
  });

  function getErrorMessage(error) {
    return (
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load your courses. Please try again."
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-64 w-full max-w-4xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="mx-auto w-full max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        {getErrorMessage(error)}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <BookOpen size={28} />
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Course not found
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This course may have been deleted or does not belong to your account.
        </p>

        <button
          type="button"
          onClick={() => navigate("/instructor/courses")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to My Courses
        </button>
      </div>
    );
  }

  const updateError = updateMutation.error
    ? getErrorMessage(updateMutation.error)
    : "";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-7">
      {/* Page Heading */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/instructor/courses")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to My Courses
        </button>

        <p className="text-sm font-semibold text-indigo-600">
          Course Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Edit Course
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update your course information and keep your content up to date.
        </p>
      </div>

      {/* Course Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {course.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {course.category}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            course.published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {course.published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Update Error */}
      {updateError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {updateError}
        </div>
      )}

      {/* Shared Course Form */}
      <CourseForm
        key={course.id}
        initialData={course}
        onSubmit={(data) => updateMutation.mutate(data)}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}

export default EditCourse;