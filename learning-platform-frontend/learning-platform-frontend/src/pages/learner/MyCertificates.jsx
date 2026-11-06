import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  ArrowLeft,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import LearnerNavbar from '../../components/learner/LearnerNavbar';
import CertificateCard from '../../components/learner/CertificateCard';
import certificateService from '../../services/certificateService';

function MyCertificates() {
  const { user, loading: authLoading } = useAuth();

  const {
    data: certificatesResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: certificateService.getMyCertificates,
    enabled: Boolean(user && user.role === 'LEARNER'),
  });

  // Support either a direct array or an Axios response.
  const certificates = useMemo(() => {
    const responseData =
      certificatesResponse?.data ?? certificatesResponse;

    return Array.isArray(responseData) ? responseData : [];
  }, [certificatesResponse]);

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    'Unable to load your certificates. Please try again.';

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'LEARNER') {
    return (
      <Navigate
        to={
          user.role === 'INSTRUCTOR' || user.role === 'ADMIN'
            ? '/instructor'
            : '/'
        }
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LearnerNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        {/* Back navigation */}
        <Link
          to="/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Page heading */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100">
              <Award size={29} className="text-indigo-700" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Your achievements
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                My Certificates
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Your learning achievements and course completions.
              </p>
            </div>
          </div>

          {/* Certificate count */}
          <div className="flex items-center gap-3 self-start rounded-2xl border border-indigo-100 bg-white px-5 py-3 shadow-sm sm:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Award size={21} className="text-indigo-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Certificates earned
              </p>

              <p className="text-2xl font-bold tabular-nums text-slate-900">
                {isLoading || isError ? '—' : certificates.length}
              </p>
            </div>
          </div>
        </section>

        {/* Loading state */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-indigo-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your certificates...
            </p>
          </div>
        ) : isError ? (
          /* Error state */
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Award size={27} className="text-red-500" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load certificates
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFetching ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <RefreshCw size={17} />
              )}
              Try Again
            </button>
          </div>
        ) : certificates.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100">
              <Award size={34} className="text-amber-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No certificates yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              You haven't earned any certificates yet. Complete all the
              lessons in an enrolled course to receive your certificate
              and celebrate your achievement.
            </p>

            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Sparkles size={17} />
              Continue Learning
            </Link>
          </div>
        ) : (
          /* Certificate list */
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  size={20}
                  className="shrink-0 text-emerald-700"
                />

                <p className="text-sm font-medium text-emerald-800">
                  Your certificates are issued by LearnHub.
                </p>
              </div>

              <span className="text-xs font-semibold text-emerald-700">
                {certificates.length}{' '}
                {certificates.length === 1
                  ? 'certificate'
                  : 'certificates'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MyCertificates;