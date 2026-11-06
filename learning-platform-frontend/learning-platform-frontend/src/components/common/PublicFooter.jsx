import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  ArrowUpRight,
  Heart,
  Camera,
  Users,
  PlayCircle,
  BookOpen,
  Info,
  Presentation,
  Sparkles,
  Headphones,
} from "lucide-react";

export default function PublicFooter() {
  const socialLinks = [
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: Camera,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: Users,
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      icon: PlayCircle,
    },
  ];

  const exploreLinks = [
    { label: "Browse courses", to: "/courses", icon: BookOpen },
    { label: "About Us", to: "/about", icon: Info },
    { label: "Teach on LearnHub", to: "/teach", icon: Presentation },
    { label: "Become a learner", to: "/register", icon: GraduationCap },
    { label: "Sign in", to: "/login", icon: ArrowUpRight },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#172044] text-slate-300">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              to="/courses"
              className="group mb-5 inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-950/40 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <GraduationCap size={27} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-white">
                Learn<span className="text-indigo-300">Hub</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              A brighter way to learn. Discover useful skills, learn at your
              own pace, and turn curiosity into confidence.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
              <Sparkles size={14} className="text-amber-300" />
              Learn something new every day
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-bold text-white">
              <span className="h-5 w-1 rounded-full bg-indigo-400" />
              Explore LearnHub
            </h3>

            <ul className="space-y-4 text-sm">
              {exploreLinks.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-3 text-slate-400 transition hover:translate-x-1 hover:text-indigo-200"
                  >
                    <Icon
                      size={16}
                      className="text-indigo-300/80 transition group-hover:text-indigo-200"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-bold text-white">
              <span className="h-5 w-1 rounded-full bg-fuchsia-400" />
              We're here to help
            </h3>

            <p className="mb-5 text-sm leading-7 text-slate-400">
              Have a question, suggestion, or need assistance? We'd love to
              hear from you.
            </p>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500/30"
            >
              <Headphones size={17} className="text-indigo-300" />
              Contact our team
              <ArrowUpRight
                size={15}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <div className="mt-5">
              <a
                href="mailto:support@learnhub.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                <Mail size={16} className="text-indigo-300" />
                support@learnhub.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5">
            Made for curious minds
            <Heart size={13} className="fill-rose-400 text-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}