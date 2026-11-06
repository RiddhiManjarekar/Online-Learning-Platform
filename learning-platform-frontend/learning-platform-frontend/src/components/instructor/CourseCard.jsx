import {
  BookOpen,
  Pencil,
  Trash2,
  EyeOff,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function CourseCard({
  course,
  onPublish,
  onUnpublish,
  onEdit,
  onDelete,
  isUpdating,
}) {
  const isPublished = course.published;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-600 to-teal-500">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen size={48} className="text-white/85" />
          </div>
        )}

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            isPublished
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Course Details */}
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {course.category}
          </p>

          <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-slate-900">
            {course.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
            {course.level}
          </span>

          <span>
            {course.createdAt
              ? new Date(course.createdAt).toLocaleDateString()
              : "Recently created"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <Link
            to={`/instructor/courses/${course.id}/lessons`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <BookOpen size={16} />
            Manage Lessons
          </Link>

          <button
            type="button"
            onClick={() => onEdit(course)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Pencil size={15} />
            Edit
          </button>

          {isPublished ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onUnpublish(course.id)}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EyeOff size={15} />
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onPublish(course.id)}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlayCircle size={15} />
              Publish
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(course)}
            aria-label={`Delete ${course.title}`}
            title="Delete course"
            className="rounded-xl border border-red-100 p-2.5 text-red-600 transition hover:border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;