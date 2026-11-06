
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Target,
  Users,
  Award,
  Lightbulb,
  Rocket,
  Heart,
  CheckCircle2,
} from "lucide-react";
import PublicNavbar from "../components/common/PublicNavbar";
import PublicFooter from "../components/common/PublicFooter";

const features = [
  {
    icon: BookOpen,
    title: "Learn at Your Own Pace",
    description:
      "Explore courses, access lessons, and continue learning whenever it suits you.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Users,
    title: "Learn from Instructors",
    description:
      "Discover courses created by instructors who share their knowledge and experience.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description:
      "Complete eligible courses and celebrate your progress with certificates.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Target,
    title: "Build Your Skills",
    description:
      "Focus on practical knowledge and develop skills that support your goals.",
    color: "bg-pink-100 text-pink-600",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Curiosity",
    description: "We believe learning begins with asking questions and exploring ideas.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "We want learning opportunities to be approachable and welcoming.",
  },
  {
    icon: Rocket,
    title: "Growth",
    description: "We encourage learners to keep improving, one lesson at a time.",
  },
];

export default function AboutUs() {
  return (
    <>
      <PublicNavbar />

      <main className="overflow-hidden bg-[#f8f9ff]">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-700 px-6 py-20 text-white md:py-28">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
              <GraduationCap size={17} />
              Welcome to LearnHub
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">
              Learning today.
              <br />
              <span className="text-amber-300">Growing tomorrow.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-indigo-100 md:text-lg">
              LearnHub is an online learning platform designed to help learners
              discover knowledge, develop new skills, and learn from instructors
              in one convenient place.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
              >
                Explore Courses <ArrowRight size={18} />
              </Link>
              <Link
                to="/teach"
                className="rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Become an Instructor
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-24">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Who We Are
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
              Making learning a journey worth taking.
            </h2>
            <p className="mt-6 leading-8 text-slate-600">
              LearnHub brings learners and instructors together through an
              organized online learning experience. Whether you are exploring
              a new subject or sharing your expertise, our platform provides
              a place to learn, teach, and grow.
            </p>
            <p className="mt-4 leading-8 text-slate-600">
              Our goal is to make it easier to discover courses, follow lessons,
              track learning progress, and recognize achievements.
            </p>
            <Link
              to="/courses"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Start exploring <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-200 to-pink-200 opacity-60 blur-xl" />
            <div className="relative rounded-[2rem] border border-white bg-white p-8 shadow-xl md:p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
                <GraduationCap size={34} />
              </div>
              <h3 className="mt-7 text-2xl font-bold text-slate-900">
                Knowledge opens doors.
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Every course you explore, every lesson you complete, and every
                skill you develop takes you one step further.
              </p>
              <div className="mt-7 space-y-4">
                {[
                  "Discover courses across subjects",
                  "Learn through structured lessons",
                  "Track your learning journey",
                  "Celebrate completed courses",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 size={19} className="shrink-0 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                The LearnHub Experience
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
                Everything you need to keep growing
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                A learning experience designed around discovery, progress, and achievement.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-100 bg-[#f8f9ff] p-7 transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                    <Icon size={27} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              What Guides Us
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Our core values
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                <Icon size={30} className="text-indigo-600" />
                <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-indigo-700 to-violet-700 px-7 py-14 text-center text-white md:px-16">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Your next learning chapter starts here.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-indigo-100">
              Explore courses or share your knowledge with the LearnHub community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/courses" className="rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">
                Browse Courses
              </Link>
              <Link to="/teach" className="rounded-xl border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
                Teach on LearnHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
