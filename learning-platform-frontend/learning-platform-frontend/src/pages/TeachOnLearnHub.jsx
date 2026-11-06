import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Send,
  Video,
  Clock,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import PublicNavbar from "../components/common/PublicNavbar";
import PublicFooter from "../components/common/PublicFooter";
import { useAuth } from "../context/AuthContext";
import instructorApplicationService from "../services/instructorApplicationService";

const initialForm = {
  expertise: "",
  experience: "",
  courseIdea: "",
  about: "",
};

const benefits = [
  {
    icon: Users,
    title: "Reach learners",
    description: "Share your knowledge with people who are eager to learn.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Lightbulb,
    title: "Share your expertise",
    description: "Turn your knowledge and experience into structured courses.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Grow professionally",
    description: "Build your teaching portfolio and develop your skills.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const steps = [
  "Complete the instructor application form.",
  "The LearnHub admin team reviews your application.",
  "Once approved, your account receives instructor access.",
  "Create courses and start sharing your knowledge.",
];

const statusStyles = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    className: "bg-amber-100 text-amber-800",
    description: "Your application is waiting for admin review.",
  },
  APPROVED: {
    label: "Approved",
    icon: ShieldCheck,
    className: "bg-emerald-100 text-emerald-800",
    description:
      "Congratulations! Your instructor application has been approved.",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-800",
    description: "Your application was not approved.",
  },
};

export default function TeachOnLearnHub() {
  const { user, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [applications, setApplications] = useState([]);
  const [fetchingApplications, setFetchingApplications] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const role = user?.role?.toUpperCase();

  const isLearner = role === "LEARNER";
  const isInstructor = role === "INSTRUCTOR";
  const hasPendingApplication = applications.some(
    (application) => application.status === "PENDING",
  );

  
  const [applicationsError, setApplicationsError] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated && isLearner) {
      loadApplications();
    }
  }, [loading, isAuthenticated, isLearner]);

  const loadApplications = async () => {
    try {
      setApplicationsError("");
      setFetchingApplications(true);

      const data = await instructorApplicationService.getMyApplications();

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load instructor applications:", error);

      setApplicationsError(
        error.response?.data?.message ||
          "Unable to load your application history. Please try again.",
      );
    } finally {
      setFetchingApplications(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setNotice(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);

    if (!isAuthenticated) {
      setNotice({
        type: "error",
        message: "Please log in to submit an instructor application.",
      });
      return;
    }

    if (!isLearner) {
      setNotice({
        type: "error",
        message: "Only learner accounts can submit instructor applications.",
      });
      return;
    }

    if (hasPendingApplication) {
      setNotice({
        type: "error",
        message: "You already have an application waiting for review.",
      });
      return;
    }

    const requiredValues = [
      form.expertise,
      form.experience,
      form.courseIdea,
      form.about,
    ];

    if (requiredValues.some((value) => !value.trim())) {
      setNotice({
        type: "error",
        message: "Please complete all fields before submitting.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const applicationData = {
        expertise: form.expertise.trim(),
        experience: form.experience.trim(),
        courseIdea: form.courseIdea.trim(),
        about: form.about.trim(),
      };


      await instructorApplicationService.submitApplication(applicationData);

      setForm(initialForm);

      await loadApplications();

      setNotice({
        type: "success",
        message: "Your instructor application has been submitted successfully!",
      });
    } catch (error) {
      console.error("Instructor application submission failed:", error);

      setNotice({
        type: "error",
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong while submitting your application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderApplicationStatus = (application) => {
    const status = statusStyles[application.status];

    if (!status) return null;

    const StatusIcon = status.icon;

    return (
      <div
        key={application.id}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">
              {application.courseIdea}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Expertise: {application.expertise}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
          >
            <StatusIcon size={16} />
            {status.label}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {status.description}
        </p>

        {application.adminRemarks && (
          <div className="mt-4 rounded-xl bg-[#f8f9ff] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Admin Remarks
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {application.adminRemarks}
            </p>
          </div>
        )}

        {application.submittedAt && (
          <p className="mt-4 text-xs text-slate-400">
            Submitted: {new Date(application.submittedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <PublicNavbar />

      <main className="bg-[#f8f9ff]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-700 px-6 py-20 text-white md:py-28">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                <GraduationCap size={18} />
                Teach on LearnHub
              </span>

              <h1 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">
                Your knowledge can
                <span className="block text-amber-300">inspire someone.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-indigo-100 md:text-lg">
                Become a LearnHub instructor, create meaningful courses, and
                help learners build skills through your knowledge and
                experience.
              </p>

              <a
                href="#instructor-application"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
              >
                Apply to Become an Instructor
                <ArrowRight size={18} />
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] bg-white/10 blur-xl" />

              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-300 text-indigo-900">
                  <Video size={34} />
                </div>

                <h2 className="mt-7 text-2xl font-bold">
                  Teach. Inspire. Empower.
                </h2>

                <p className="mt-3 leading-7 text-indigo-100">
                  Create structured lessons, organize course content, and help
                  learners move forward with confidence.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "Create and manage courses",
                    "Organize lessons",
                    "Track learner enrollments",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-white"
                    >
                      <CheckCircle2 size={18} className="text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Why Teach With Us?
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Make your knowledge count
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Help others learn while building your own professional journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                How It Works
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
                Your instructor journey
              </h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-2xl bg-[#f8f9ff] p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="pt-1 leading-7 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application status */}
        {isAuthenticated && isLearner && (
          <section className="mx-auto max-w-5xl px-6 pt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your Applications
              </h2>
              <p className="mt-2 text-slate-600">
                Track the status of your instructor applications.
              </p>
            </div>
            {fetchingApplications ? (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
                Loading your applications...
              </div>
            ) : applicationsError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
                <p className="text-sm font-medium text-rose-700">
                  {applicationsError}
                </p>

                <button
                  type="button"
                  onClick={loadApplications}
                  className="mt-4 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(renderApplicationStatus)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <GraduationCap size={35} className="mx-auto text-indigo-400" />
                <p className="mt-3 font-semibold text-slate-700">
                  No applications submitted yet.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Complete the form below to begin your instructor journey.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Application form */}
        <section
          id="instructor-application"
          className="mx-auto max-w-5xl px-6 py-20"
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-100">
            <div className="bg-gradient-to-r from-indigo-700 to-violet-700 px-7 py-9 text-white md:px-10">
              <h2 className="text-2xl font-extrabold md:text-3xl">
                Instructor Application
              </h2>

              <p className="mt-2 leading-7 text-indigo-100">
                Tell us about yourself and what you would like to teach.
              </p>
            </div>

            <div className="p-6 md:p-10">
              {loading ? (
                <p className="text-center text-slate-500">
                  Checking your account...
                </p>
              ) : !isAuthenticated ? (
                <div className="rounded-2xl bg-indigo-50 p-7 text-center">
                  <GraduationCap
                    size={40}
                    className="mx-auto text-indigo-600"
                  />

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    Login to become an instructor
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Please log in to your LearnHub learner account before
                    submitting an instructor application.
                  </p>

                  <Link
                    to="/login"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Login to Continue
                    <ArrowRight size={17} />
                  </Link>
                </div>
              ) : isInstructor ? (
                <div className="rounded-2xl bg-emerald-50 p-7 text-center">
                  <ShieldCheck size={42} className="mx-auto text-emerald-600" />

                  <h3 className="mt-4 text-xl font-bold text-emerald-900">
                    You are already a LearnHub instructor!
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Your instructor access is active. You can now create and
                    manage your courses.
                  </p>

                  <Link
                    to="/instructor/dashboard"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Go to Instructor Dashboard
                    <ArrowRight size={17} />
                  </Link>
                </div>
              ) : !isLearner ? (
                <div className="rounded-2xl bg-amber-50 p-7 text-center text-amber-800">
                  <p className="font-semibold">
                    Instructor applications are available for learner accounts.
                  </p>
                </div>
              ) : hasPendingApplication ? (
                <div className="rounded-2xl bg-amber-50 p-7 text-center">
                  <Clock size={40} className="mx-auto text-amber-600" />

                  <h3 className="mt-4 text-xl font-bold text-amber-900">
                    Your application is under review
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    Please wait for the LearnHub admin team to review your
                    application. You can check the status above.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account information */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Full name
                      </label>

                      <input
                        value={user?.name || ""}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email address
                      </label>

                      <input
                        value={user?.email || ""}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="instructor-expertise"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Area of expertise
                      </label>

                      <input
                        id="instructor-expertise"
                        name="expertise"
                        value={form.expertise}
                        onChange={handleChange}
                        maxLength={120}
                        required
                        placeholder="e.g. Java, Web Development, Design"
                        className="w-full rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="instructor-experience"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Teaching / professional experience
                      </label>

                      <select
                        id="instructor-experience"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="">Select experience</option>
                        <option value="No prior teaching experience">
                          No prior teaching experience
                        </option>
                        <option value="Less than 1 year">
                          Less than 1 year
                        </option>
                        <option value="1–3 years">1–3 years</option>
                        <option value="3–5 years">3–5 years</option>
                        <option value="More than 5 years">
                          More than 5 years
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="instructor-course"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      What course would you like to create?
                    </label>

                    <input
                      id="instructor-course"
                      name="courseIdea"
                      value={form.courseIdea}
                      onChange={handleChange}
                      maxLength={150}
                      required
                      placeholder="e.g. Complete Java Programming for Beginners"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="instructor-about"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Tell us about yourself
                    </label>

                    <textarea
                      id="instructor-about"
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      rows={5}
                      maxLength={1500}
                      required
                      placeholder="Describe your background, skills, and why you want to teach on LearnHub..."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <p className="mt-1 text-right text-xs text-slate-400">
                      {form.about.length}/1500
                    </p>
                  </div>

                  {notice && (
                    <div
                      role="alert"
                      className={`rounded-xl p-4 text-sm leading-6 ${
                        notice.type === "success"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {notice.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || fetchingApplications}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send size={17} />
                      </>
                    )}
                  </button>

                  <p className="text-xs leading-5 text-slate-500">
                    Your application will be reviewed by the LearnHub admin
                    team. Instructor access is granted only after approval.
                  </p>
                </form>
              )}

              {notice && !isLearner && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800"
                >
                  {notice.message}
                </div>
              )}

              {notice && isLearner && hasPendingApplication && (
                <div
                  role="status"
                  className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  {notice.message}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="pb-16 text-center">
          <p className="text-sm text-slate-500">
            Want to explore courses instead?{" "}
            <Link
              to="/courses"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Browse LearnHub courses
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
