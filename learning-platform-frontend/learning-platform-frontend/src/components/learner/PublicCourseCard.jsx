
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock3,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  PlayCircle,
} from "lucide-react";

const palettes = [
  "from-violet-600 via-indigo-600 to-blue-700",
  "from-cyan-600 via-sky-600 to-blue-700",
  "from-amber-500 via-orange-500 to-rose-600",
  "from-emerald-500 via-teal-600 to-cyan-700",
];

const levelStyles = {
  BEGINNER: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  INTERMEDIATE: "bg-amber-50 text-amber-700 ring-amber-100",
  ADVANCED: "bg-rose-50 text-rose-700 ring-rose-100",
};

function PublicCourseCard({ course, index = 0 }) {
  const palette = palettes[index % palettes.length];
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [course.thumbnailUrl]);

  const level = course.level?.toUpperCase() || "ALL LEVELS";
  const levelStyle =
    levelStyles[level] || "bg-indigo-50 text-indigo-700 ring-indigo-100";

  const hasThumbnail = course.thumbnailUrl && !imageFailed;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,41,59,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_22px_50px_rgba(79,70,229,0.14)]">

      {/* Course Thumbnail */}
      <div
        className={`relative h-52 shrink-0 overflow-hidden bg-gradient-to-br ${palette}`}
      >
        {hasThumbnail ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title || "Course thumbnail"}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Decorative shapes */}
            <div className="absolute -right-12 -top-14 h-56 w-56 rounded-full border-[30px] border-white/10" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-white/10 blur-sm" />

            <div className="relative flex flex-col items-center text-white">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/15 shadow-2xl backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen size={42} strokeWidth={1.4} />
              </span>
              <span className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Learn something new
              </span>
            </div>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10" />

        {/* Category badge */}
        <span className="absolute left-4 top-4 inline-flex max-w-[75%] items-center gap-1.5 truncate rounded-full border border-white/40 bg-white/85 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 shadow-lg backdrop-blur-md">
          <Sparkles size={12} className="shrink-0 text-indigo-600" />
          {course.category || "Featured"}
        </span>

        {/* Decorative play icon */}
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-white/30">
          <PlayCircle size={21} />
        </span>
      </div>

      {/* Course Information */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* Level and duration */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ${levelStyle}`}
          >
            {course.level || "All levels"}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Clock3 size={14} />
            Self-paced
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-extrabold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-indigo-700">
          {course.title || "Untitled course"}
        </h3>

        {/* Description */}
        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
          {course.description ||
            "Explore this course and start learning new skills."}
        </p>

        {/* Bottom divider */}
        <div className="mb-4 border-t border-slate-100" />

        {/* Course action */}
        <Link
          to={`/courses/${course.id}`}
          className="group/button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3.5 text-sm font-extrabold text-indigo-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
        >
          <GraduationCap size={17} />
          Explore course
          <ArrowUpRight
            size={17}
            className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}

export default PublicCourseCard;
