import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Eye,
  Pencil,
  PlusCircle,
  Save,
  Trash2,
  X,
  Clock3,
  PlayCircle,
} from "lucide-react";

import courseService from "../../services/courseService";
import lessonService from "../../services/lessonService";
import { getYouTubeVideoId } from "../../utils/youtube";

const emptyLesson = {
  title: "",
  description: "",
  youtubeUrl: "",
  orderIndex: 1,
  durationSeconds: "",
  preview: false,
};

function ManageLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(emptyLesson);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [formError, setFormError] = useState("");

  const coursesQuery = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: courseService.getMyCourses,
  });

  const lessonsQuery = useQuery({
    queryKey: ["instructorLessons", courseId],
    queryFn: () => lessonService.getLessons(courseId),
    enabled: Boolean(courseId),
  });

  const course = coursesQuery.data?.find((item) => item.id === courseId);
  const lessons = lessonsQuery.data || [];

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.orderIndex - b.orderIndex),
    [lessons]
  );

  const videoId = getYouTubeVideoId(formData.youtubeUrl);

  const refreshLessons = () => {
    queryClient.invalidateQueries({
      queryKey: ["instructorLessons", courseId],
    });

    queryClient.invalidateQueries({
      queryKey: ["instructorCourses"],
    });
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingLessonId) {
        return lessonService.updateLesson(editingLessonId, data);
      }

      return lessonService.createLesson(courseId, data);
    },
    onSuccess: () => {
      refreshLessons();
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: lessonService.deleteLesson,
    onSuccess: refreshLessons,
  });

  const publishMutation = useMutation({
    mutationFn: courseService.publishCourse,
    onSuccess: refreshLessons,
  });

  const unpublishMutation = useMutation({
    mutationFn: courseService.unpublishCourse,
    onSuccess: refreshLessons,
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ currentLesson, otherLesson }) => {
      const toRequest = (lesson, orderIndex) => ({
        title: lesson.title,
        description: lesson.description || "",
        youtubeUrl: `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}`,
        orderIndex,
        durationSeconds: lesson.durationSeconds ?? null,
        preview: lesson.preview,
      });

      const temporaryOrder =
        Math.max(...lessons.map((lesson) => lesson.orderIndex), 0) + 1;

      await lessonService.updateLesson(
        currentLesson.id,
        toRequest(currentLesson, temporaryOrder)
      );

      await lessonService.updateLesson(
        otherLesson.id,
        toRequest(otherLesson, currentLesson.orderIndex)
      );

      await lessonService.updateLesson(
        currentLesson.id,
        toRequest(currentLesson, otherLesson.orderIndex)
      );
    },
    onSuccess: refreshLessons,
  });

  function resetForm() {
    setFormData({
      ...emptyLesson,
      orderIndex: lessons.length + 1,
    });

    setEditingLessonId(null);
    setFormError("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Lesson title is required.");
      return;
    }

    if (!videoId) {
      setFormError("Please enter a valid YouTube video URL.");
      return;
    }

    const orderIndex = Number(formData.orderIndex);

    if (!Number.isInteger(orderIndex) || orderIndex < 1) {
      setFormError("Lesson order must be a positive whole number.");
      return;
    }

    const durationSeconds =
      formData.durationSeconds === ""
        ? null
        : Number(formData.durationSeconds);

    if (
      durationSeconds !== null &&
      (!Number.isInteger(durationSeconds) || durationSeconds < 1)
    ) {
      setFormError("Duration must be a positive whole number of seconds.");
      return;
    }

    saveMutation.mutate({
      title: formData.title.trim(),
      description: formData.description.trim(),
      youtubeUrl: formData.youtubeUrl.trim(),
      orderIndex,
      durationSeconds,
      preview: formData.preview,
    });
  }

  function handleEdit(lesson) {
    setEditingLessonId(lesson.id);

    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      youtubeUrl: `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}`,
      orderIndex: lesson.orderIndex,
      durationSeconds: lesson.durationSeconds ?? "",
      preview: lesson.preview,
    });

    setFormError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(lesson) {
    const confirmed = window.confirm(`Delete lesson "${lesson.title}"?`);

    if (confirmed) {
      deleteMutation.mutate(lesson.id);
    }
  }

  function moveLesson(index, direction) {
    const otherIndex = index + direction;

    if (otherIndex < 0 || otherIndex >= sortedLessons.length) return;

    reorderMutation.mutate({
      currentLesson: sortedLessons[index],
      otherLesson: sortedLessons[otherIndex],
    });
  }

  const mutationError =
    saveMutation.error ||
    deleteMutation.error ||
    publishMutation.error ||
    unpublishMutation.error ||
    reorderMutation.error;

  function getErrorMessage(error) {
    return (
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again."
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  if (coursesQuery.isLoading || lessonsQuery.isLoading) {
    return (
      <div className="mx-auto flex min-h-64 w-full max-w-6xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading course and lessons...
          </p>
        </div>
      </div>
    );
  }

  if (coursesQuery.isError || lessonsQuery.isError) {
    return (
      <div
        role="alert"
        className="mx-auto w-full max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        {getErrorMessage(coursesQuery.error || lessonsQuery.error)}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <BookOpen size={36} className="mx-auto text-slate-400" />
        <h2 className="mt-3 text-xl font-bold text-slate-900">
          Course not found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          This course may have been deleted or does not belong to your account.
        </p>
        <button
          type="button"
          onClick={() => navigate("/instructor/courses")}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
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
            Curriculum Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage Lessons
          </h1>

          <p className="mt-2 text-sm text-slate-500">{course.title}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-2 text-xs font-semibold ${
              course.published
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {course.published ? "Published" : "Draft"}
          </span>

          {course.published ? (
            <button
              type="button"
              disabled={unpublishMutation.isPending}
              onClick={() => unpublishMutation.mutate(courseId)}
              className="rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
            >
              {unpublishMutation.isPending ? "Unpublishing..." : "Unpublish"}
            </button>
          ) : (
            <button
              type="button"
              disabled={
                publishMutation.isPending || lessons.length === 0
              }
              onClick={() => publishMutation.mutate(courseId)}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishMutation.isPending ? "Publishing..." : "Publish Course"}
            </button>
          )}
        </div>
      </div>

      {/* Course Status */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
            <BookOpen size={21} />
          </div>

          <div>
            <p className="font-semibold text-indigo-950">
              {lessons.length} lesson(s) added
            </p>
            <p className="mt-1 text-sm leading-6 text-indigo-700">
              {course.published
                ? "Your course is currently visible in the public catalogue."
                : "Add at least one lesson before publishing this course."}
            </p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {(formError || mutationError) && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {formError || getErrorMessage(mutationError)}
        </div>
      )}

      {/* Lesson Form */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                {editingLessonId ? <Pencil size={18} /> : <PlusCircle size={18} />}
              </div>

              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                {editingLessonId ? "Edit Lesson" : "Add New Lesson"}
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Add a YouTube video to your course curriculum.
            </p>
          </div>

          {editingLessonId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <X size={16} />
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="lessonTitle"
              className="text-sm font-semibold text-slate-800"
            >
              Lesson Title <span className="text-red-500">*</span>
            </label>

            <input
              id="lessonTitle"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              required
              placeholder="Example: Introduction to Java"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="lessonDescription"
              className="text-sm font-semibold text-slate-800"
            >
              Lesson Description
            </label>

            <textarea
              id="lessonDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
              rows={3}
              placeholder="What will learners learn in this lesson?"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label
              htmlFor="youtubeUrl"
              className="text-sm font-semibold text-slate-800"
            >
              YouTube Video URL <span className="text-red-500">*</span>
            </label>

            <input
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              required
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
            />

            <p className="mt-2 text-xs text-slate-500">
              Supported: youtube.com/watch, youtu.be, /embed and /shorts URLs.
            </p>
          </div>

          {/* Video Preview */}
          {videoId && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Video Preview
              </p>

              <div className="aspect-video max-w-2xl overflow-hidden rounded-2xl bg-slate-950 shadow-sm">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube lesson preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="orderIndex"
                className="text-sm font-semibold text-slate-800"
              >
                Lesson Order <span className="text-red-500">*</span>
              </label>

              <input
                id="orderIndex"
                type="number"
                name="orderIndex"
                value={formData.orderIndex}
                onChange={handleChange}
                min="1"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="durationSeconds"
                className="text-sm font-semibold text-slate-800"
              >
                Duration (seconds)
              </label>

              <input
                id="durationSeconds"
                type="number"
                name="durationSeconds"
                value={formData.durationSeconds}
                onChange={handleChange}
                min="1"
                placeholder="Example: 600"
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-indigo-50/50">
            <input
              type="checkbox"
              name="preview"
              checked={formData.preview}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 accent-indigo-600"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Make this a free preview
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Learners may be allowed to watch this lesson without enrolling,
                once we implement learner access.
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
            {editingLessonId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {saveMutation.isPending
                ? "Saving..."
                : editingLessonId
                  ? "Update Lesson"
                  : "Add Lesson"}
            </button>
          </div>
        </form>
      </section>

      {/* Curriculum */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Course Curriculum
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Arrange your lessons in the order learners should follow.
          </p>
        </div>

        {sortedLessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <BookOpen size={28} />
            </div>

            <p className="mt-4 font-semibold text-slate-800">
              No lessons added yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first YouTube lesson using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedLessons.map((lesson, index) => (
              <article
                key={lesson.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                  {lesson.orderIndex}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {lesson.title}
                    </h3>

                    {lesson.preview && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Free Preview
                      </span>
                    )}
                  </div>

                  {lesson.description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                      {lesson.description}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={13} />
                      {lesson.durationSeconds
                        ? `${Math.floor(lesson.durationSeconds / 60)} min ${lesson.durationSeconds % 60} sec`
                        : "Duration not specified"}
                    </span>

                    <a
                      href={`https://www.youtube.com/watch?v=${encodeURIComponent(lesson.youtubeVideoId)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      <PlayCircle size={13} />
                      Open YouTube video
                    </a>
                  </div>
                </div>

                {/* Lesson Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    title="Move up"
                    aria-label={`Move ${lesson.title} up`}
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => moveLesson(index, -1)}
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp size={17} />
                  </button>

                  <button
                    type="button"
                    title="Move down"
                    aria-label={`Move ${lesson.title} down`}
                    disabled={
                      index === sortedLessons.length - 1 ||
                      reorderMutation.isPending
                    }
                    onClick={() => moveLesson(index, 1)}
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowDown size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(lesson)}
                    className="rounded-lg border border-indigo-100 p-2.5 text-indigo-600 transition hover:bg-indigo-50"
                    title="Edit lesson"
                    aria-label={`Edit ${lesson.title}`}
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(lesson)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg border border-red-100 p-2.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    title="Delete lesson"
                    aria-label={`Delete ${lesson.title}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {reorderMutation.isPending && (
          <p className="text-sm font-medium text-indigo-600">
            Updating lesson order...
          </p>
        )}
      </section>
    </div>
  );
}

export default ManageLessons;