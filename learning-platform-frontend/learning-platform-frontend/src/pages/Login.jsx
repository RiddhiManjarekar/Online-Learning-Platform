
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

 
async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    setSubmitting(true);

    try {
        await login({
            email: form.email.trim(),
            password: form.password,
        });

        // HomeRedirect will decide where the user should go.
        navigate('/', { replace: true });

    } catch (err) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
            setError('Invalid email or password. Please try again.');
        } else {
            setError(
                err.response?.data?.message ||
                'Unable to sign in. Check your connection and try again.'
            );
        }
    } finally {
        setSubmitting(false);
    }
}


  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500">
            <GraduationCap size={25} />
          </span>
          <span className="text-xl font-bold tracking-tight">LearnHub</span>
        </Link>

        <div className="relative max-w-xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-indigo-200">
            <Sparkles size={16} />
            Your next chapter starts here
          </span>

          <h1 className="text-5xl font-bold leading-tight xl:text-6xl">
            Learn something new.
            <span className="mt-2 block text-indigo-400">
              Become something more.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Build real skills, explore new ideas, and move closer to your
            goals—one lesson at a time.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <BookOpen className="mb-4 text-indigo-300" size={25} />
              <p className="font-semibold">Learn at your pace</p>
              <p className="mt-1 text-sm text-slate-400">
                Your journey, your schedule.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <GraduationCap className="mb-4 text-indigo-300" size={25} />
              <p className="font-semibold">Grow your skills</p>
              <p className="mt-1 text-sm text-slate-400">
                Turn knowledge into progress.
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-slate-400">
          Learn with purpose. Grow with confidence.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 font-bold text-slate-900 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap size={23} />
            </span>
            LearnHub
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Sign in to your account
            </h2>
            <p className="mt-3 text-slate-500">
              Continue where your learning journey left off.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <Mail size={19} className="shrink-0 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New to LearnHub?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-10 text-center text-xs leading-5 text-slate-400">
            By continuing, you agree to use the platform responsibly.
          </p>
        </div>
      </section>
    </main>
  );
}
