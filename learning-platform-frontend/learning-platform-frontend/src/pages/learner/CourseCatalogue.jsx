import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  BookOpen,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Code2,
  Palette,
  BriefcaseBusiness,
  BrainCircuit,
  PlayCircle,
  CheckCircle2,
  Layers3,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import courseService from "../../services/courseService";
import PublicNavbar from "../../components/common/PublicNavbar";
import PublicFooter from "../../components/common/PublicFooter";
import PublicCourseCard from "../../components/learner/PublicCourseCard";

const slides = [
  {
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    title: "Big goals begin with\none small lesson.",
    description:
      "Explore practical courses, learn from anywhere, and build skills that move you forward.",
    cta: "Explore the library",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85",
    tone: "from-indigo-950 via-violet-900 to-purple-700",
    label: "Learn something new",
  },
  {
    eyebrow: "LEARN AT YOUR OWN PACE",
    title: "Turn curiosity into\nreal-world skills.",
    description:
      "From your first line of code to your next creative breakthrough, your journey starts here.",
    cta: "Find your next skill",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
    tone: "from-sky-950 via-cyan-900 to-blue-700",
    label: "Skills for your future",
  },
  {
    eyebrow: "GROW WITH EVERY CLICK",
    title: "A smarter way to\nkeep growing.",
    description:
      "Discover fresh ideas, build confidence, and celebrate every milestone along the way.",
    cta: "Start learning",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85",
    tone: "from-orange-950 via-orange-800 to-amber-600",
    label: "Make progress daily",
  },
];

const categories = [
  {
    name: "Development",
    subtitle: "Build digital skills",
    icon: Code2,
    color: "from-indigo-500 to-blue-600",
    background: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    name: "Design",
    subtitle: "Bring ideas to life",
    icon: Palette,
    color: "from-fuchsia-500 to-purple-600",
    background: "bg-fuchsia-50",
    iconColor: "text-fuchsia-600",
  },
  {
    name: "Business",
    subtitle: "Grow your knowledge",
    icon: BriefcaseBusiness,
    color: "from-amber-500 to-orange-600",
    background: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    name: "Personal Growth",
    subtitle: "Invest in yourself",
    icon: BrainCircuit,
    color: "from-emerald-500 to-teal-600",
    background: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

function CourseCatalogue() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [activeSlide, setActiveSlide] = useState(0);

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["publishedCourses"],
    queryFn: async () => {
      const response = await courseService.getPublishedCourses();
      const result = response?.data ?? response;

      if (!Array.isArray(result)) {
        throw new Error("Unexpected course response from server.");
      }

      return result;
    },
  });

  // Automatically rotate slides every 6.5 seconds.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveSlide((current) => (current + 1) % slides.length);
      }
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !term ||
        course.title?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term) ||
        course.category?.toLowerCase().includes(term);

      const matchesLevel =
        selectedLevel === "ALL" ||
        course.level?.toUpperCase() === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [courses, search, selectedLevel]);

  const slide = slides[activeSlide];

  const handleCategoryClick = (category) => {
    setSearch(category);
    document
      .getElementById("course-library")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedLevel("ALL");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800">
      <PublicNavbar />

      {/* Hero Slider */}
      <section className="relative overflow-hidden px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div
            className={`relative isolate min-h-[490px] overflow-hidden rounded-[30px] bg-gradient-to-br ${slide.tone} shadow-[0_25px_80px_rgba(49,46,129,0.22)] transition-all duration-700 sm:min-h-[510px] lg:min-h-[540px]`}
          >
            {/* Background image */}
            <div className="absolute inset-0 -z-10">
              <img
                key={slide.image}
                src={slide.image}
                alt="Learners studying and collaborating"
                className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/45 to-slate-900/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
            </div>

            {/* Decorative shapes */}
            <div className="pointer-events-none absolute -right-24 -top-28 -z-0 h-80 w-80 rounded-full border-[42px] border-white/10 sm:h-[28rem] sm:w-[28rem]" />
            <div className="pointer-events-none absolute -bottom-36 right-1/4 -z-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex min-h-[490px] flex-col justify-center px-6 py-12 sm:min-h-[510px] sm:px-12 lg:min-h-[540px] lg:px-16">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[10px] font-extrabold tracking-[0.18em] text-white shadow-lg backdrop-blur-md sm:text-xs">
                  <Sparkles size={14} />
                  {slide.eyebrow}
                </span>

                <h1 className="mt-6 whitespace-pre-line text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                  {slide.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#course-library"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-2xl"
                  >
                    {slide.cta}
                    <ArrowRight size={17} />
                  </a>

                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                  >
                    <GraduationCap size={18} />
                    Join LearnHub
                  </Link>
                </div>
              </div>

              {/* Floating learning card */}
              <div className="absolute bottom-24 right-12 hidden w-64 rounded-2xl border border-white/25 bg-white/15 p-4 text-white shadow-2xl backdrop-blur-xl xl:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                    <PlayCircle size={25} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white/70">
                      YOUR LEARNING JOURNEY
                    </p>
                    <p className="mt-1 text-sm font-extrabold">
                      {slide.label}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle2 size={15} />
                  Learn at your own pace
                </div>
              </div>

              {/* Slider controls */}
              <div className="mt-10 flex items-center justify-between sm:absolute sm:bottom-8 sm:left-12 sm:right-12 sm:mt-0 lg:left-16 lg:right-16">
                <div className="flex gap-2">
                  {slides.map((item, index) => (
                    <button
                      key={item.eyebrow}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Show slide ${index + 1}`}
                      aria-pressed={activeSlide === index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeSlide === index
                          ? "w-9 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousSlide}
                    aria-label="Previous slide"
                    className="rounded-full border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                    className="rounded-full border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Highlights */}
          <div className="relative z-20 mx-auto -mt-1 grid max-w-5xl grid-cols-1 gap-3 sm:-mt-7 sm:grid-cols-3 sm:gap-4">
            <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
                <BookOpen size={22} />
              </span>
              <div>
                <p className="text-xl font-black text-slate-900">
                  {courses.length}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Published courses
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <Users size={22} />
              </span>
              <div>
                <p className="text-lg font-black text-slate-900">
                  Learn together
                </p>
                <p className="text-xs font-medium text-slate-500">
                  A growing community
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                <Award size={22} />
              </span>
              <div>
                <p className="text-lg font-black text-slate-900">
                  Keep progressing
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Celebrate milestones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Library */}
      <main
        id="course-library"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 pt-8 sm:px-6 lg:px-8"
      >
        {/* Categories */}
        <section className="mb-14">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                <Layers3 size={15} />
                Find your direction
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Explore by interest
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                A little inspiration for what you could learn next.
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-400">
              Choose a category to explore
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map(
              ({
                name,
                subtitle,
                icon: Icon,
                color,
                background,
                iconColor,
              }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleCategoryClick(name)}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.12)] sm:p-6"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 transition duration-300 group-hover:scale-150" />

                  <div className="relative">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${background} ${iconColor} transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon size={27} strokeWidth={1.8} />
                    </span>

                    <h3 className="mt-5 text-sm font-extrabold text-slate-900 sm:text-base">
                      {name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {subtitle}
                    </p>

                    <span
                      className={`mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-md transition duration-300 group-hover:translate-x-1`}
                    >
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </button>
              ),
            )}
          </div>
        </section>

        {/* Course Search */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                <BookOpen size={15} />
                The learning library
              </span>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Courses picked for your growth
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Find a course, follow your curiosity, and get started.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
              <BookOpen size={14} />
              {courses.length} courses available
            </span>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 grid gap-3 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:grid-cols-[1fr_210px] sm:p-4">
            <label className="relative block">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by course, skill or category..."
                aria-label="Search courses"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </label>

            <label className="relative block">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={selectedLevel}
                onChange={(event) => setSelectedLevel(event.target.value)}
                aria-label="Filter by course level"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              >
                <option value="ALL">All levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </label>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((number) => (
                <div
                  key={number}
                  className="h-96 animate-pulse rounded-3xl bg-slate-200/70"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <BookOpen size={26} />
              </span>

              <p className="mt-4 font-bold text-rose-700">
                Unable to load courses
              </p>

              <p className="mt-2 text-sm text-rose-600">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong. Please try again."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Course Results */}
          {!isLoading && !isError && filteredCourses.length > 0 && (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <strong className="text-slate-800">
                    {filteredCourses.length}
                  </strong>{" "}
                  course(s)
                </p>

                {(search || selectedLevel !== "ALL") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-indigo-600 transition hover:text-indigo-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course, index) => (
                  <PublicCourseCard
                    key={course.id}
                    course={course}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredCourses.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <Search size={30} />
              </span>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                No courses found just yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another keyword or clear your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <X size={15} />
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export default CourseCatalogue;