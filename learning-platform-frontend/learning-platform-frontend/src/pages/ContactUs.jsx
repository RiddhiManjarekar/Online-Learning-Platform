import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MessageCircle,
  Send,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import PublicNavbar from "../components/common/PublicNavbar";
import PublicFooter from "../components/common/PublicFooter";
import contactService from "../services/contactService";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactUs() {
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setNotice("");
  };
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject ||
      !form.message.trim()
    ) {
      setNotice("Please complete all fields before submitting.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setNotice("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      await contactService.submitContactMessage({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setNotice("Your message has been submitted successfully!");
      setForm(initialForm);
    } catch (error) {
      setNotice(
        error.response?.data?.message ||
          "Unable to submit your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PublicNavbar />

      <main className="min-h-screen bg-[#f8f9ff]">
        <section className="bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-700 px-6 py-20 text-center text-white md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            <MessageCircle size={17} /> We're here to help
          </span>
          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-indigo-100">
            Have a question, suggestion, or need help with LearnHub? Send us a
            message.
          </p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-5 lg:py-20">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                Get in touch
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                We'd love to hear from you.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Reach out if you have questions about courses, your account,
                teaching opportunities, or anything else.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Mail size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email us</h3>
                  <a
                    href="mailto:support@learnhub.com"
                    className="mt-1 block text-sm text-indigo-600 hover:underline"
                  >
                    support@learnhub.com
                  </a>
                  <p className="mt-1 text-xs text-slate-500">
                    For general questions and support
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Clock size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">We're listening</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Use the contact form to share your question or feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
              <h3 className="text-lg font-bold">Interested in teaching?</h3>
              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Share your expertise and help others learn.
              </p>
              <Link
                to="/teach"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-amber-200"
              >
                Apply to teach <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 md:p-9 lg:col-span-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill in the details below and our team will receive your message.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={150}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Account Support">Account Support</option>
                  <option value="Course Related">Course Related</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  maxLength={2000}
                  required
                  placeholder="How can we help you?"
                  className="w-full resize-y rounded-xl border border-slate-200 bg-[#f8f9ff] px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.message.length}/2000
                </p>
              </div>

              {notice && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex gap-2 rounded-xl p-4 text-sm leading-6 ${
                    notice.includes("successfully")
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-rose-50 text-rose-800"
                  }`}
                >
                  {notice.includes("successfully") ? (
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  ) : (
                    <MessageCircle size={19} className="mt-0.5 shrink-0" />
                  )}
                  {notice}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit Message"}
                {!submitting && <Send size={17} />}
              </button>
            </form>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
