import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Link, useNavigate } from "react-router-dom";

import {
  PlusCircle,
  Search,
  BookOpen,
  Layers3,
  CheckCircle2,
  FileEdit,
} from "lucide-react";

import courseService from "../../services/courseService";
import CourseCard from "../../components/instructor/CourseCard";

function MyCourses() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: courseService.getMyCourses,
  });

  const refreshCourses = () => {
    queryClient.invalidateQueries({
      queryKey: ["instructorCourses"],
    });
  };

  const publishMutation = useMutation({
    mutationFn: courseService.publishCourse,
    onSuccess: refreshCourses,
  });

  const unpublishMutation = useMutation({
    mutationFn: courseService.unpublishCourse,
    onSuccess: refreshCourses,
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: refreshCourses,
  });

  const isUpdating =
    publishMutation.isPending || unpublishMutation.isPending;

  // Course statistics
  const publishedCount = courses.filter(
    (course) => course.published
  ).length;

  const draftCount = courses.length - publishedCount;

  // Search and filtering
  const filteredCourses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesFilter =
        filter === "ALL" ||
        (filter === "PUBLISHED" && course.published) ||
        (filter === "DRAFT" && !course.published);

      const title = (course.title || "").toLowerCase();
      const category = (course.category || "").toLowerCase();

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        category.includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, search]);

  const handleDelete = (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      deleteMutation.mutate(course.id);
    }
  };

  const handleEdit = (course) => {
    navigate(`/instructor/courses/${course.id}/edit`);
  };

  const mutationError =
    publishMutation.error ||
    unpublishMutation.error ||
    deleteMutation.error;

  const getErrorMessage = (apiError) => {
    return (
      apiError?.response?.data?.detail ||
      apiError?.response?.data?.message ||
      apiError?.message ||
      "Something went wrong. Please try again."
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-64 w-full max-w-[1440px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div
        role="alert"
        className="mx-auto w-full max-w-[1440px] rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        <p className="font-semibold">Unable to load your courses.</p>

        <p className="mt-1">{getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Course Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Courses
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage, organize and publish your courses.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <PlusCircle size={18} />
          Create Course
        </Link>
      </div>

      {/* Course Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              All Courses
            </p>

            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Layers3 size={20} />
            </div>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {courses.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total courses created
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {publishedCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Visible in the public catalogue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Drafts
            </p>

            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <FileEdit size={20} />
            </div>
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-600">
            {draftCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Courses awaiting publication
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by course title or category..."
            aria-label="Search courses"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Courses", value: "ALL" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Drafts", value: "DRAFT" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                filter === item.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mutation Errors */}
      {mutationError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {getErrorMessage(mutationError)}
        </div>
      )}

      {/* Delete Progress */}
      {deleteMutation.isPending && (
        <p className="text-sm font-medium text-slate-500">
          Deleting course...
        </p>
      )}

      {/* Course List Heading */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Your Course Library
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>
      </div>

      {/* Course Cards */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <BookOpen size={32} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {courses.length === 0
              ? "You haven't created any courses yet"
              : "No matching courses found"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {courses.length === 0
              ? "Create your first course and start building your learning content."
              : "Try changing your search keyword or selecting a different filter."}
          </p>

          {courses.length === 0 && (
            <Link
              to="/instructor/courses/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <PlusCircle size={18} />
              Create Your First Course
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPublish={(id) => publishMutation.mutate(id)}
              onUnpublish={(id) => unpublishMutation.mutate(id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;