import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Award,
  LoaderCircle,
  AlertCircle,
  Clock3,
} from 'lucide-react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import certificateService from '../../services/certificateService';

function EnrolledCourseCard({ enrollment }) {
  const queryClient = useQueryClient();

  const progress = Math.min(
    100,
    Math.max(0, Number(enrollment.progressPercentage) || 0)
  );

  const completedLessons = Number(enrollment.completedLessons) || 0;
  const totalLessons = Number(enrollment.totalLessons) || 0;

  const isCompleted = enrollment.completed || progress >= 100;

  const {
    data: certificateResponse,
    isLoading: certificatesLoading,
    isError: certificatesError,
    refetch: refetchCertificates,
  } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: certificateService.getMyCertificates,
    enabled: isCompleted,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const certificates = Array.isArray(certificateResponse)
    ? certificateResponse
    : Array.isArray(certificateResponse?.data)
      ? certificateResponse.data
      : [];

  const existingCertificate = certificates.find(
    (certificate) => certificate.courseId === enrollment.courseId
  );

  const certificateMutation = useMutation({
    mutationFn: () =>
      certificateService.generateCertificate(enrollment.courseId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['myCertificates'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['myEnrollments'],
      });
    },
  });

  const certificateError =
    certificateMutation.error?.response?.data?.message ||
    'Unable to generate your certificate. Please try again.';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,41,59,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Course thumbnail */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100">
        {enrollment.courseThumbnailUrl ? (
          <img
            src={enrollment.courseThumbnailUrl}
            alt={enrollment.courseTitle || 'Course thumbnail'}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen size={50} className="text-indigo-400" />
          </div>
        )}

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-white/95 text-indigo-700'
          }`}
        >
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Completed
            </span>
          ) : (
            'Your course'
          )}
        </span>
      </div>

      {/* Course information */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-slate-900">
          {enrollment.courseTitle || 'Untitled course'}
        </h3>

        <div className="mt-4 mb-3 flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <BookOpen size={15} />
            {completedLessons} of {totalLessons} lessons
          </span>

          <span className="font-extrabold tabular-nums text-indigo-700">
            {progress.toFixed(0)}%
          </span>
        </div>

        <div
          className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${enrollment.courseTitle || 'Course'} progress`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                : 'bg-gradient-to-r from-indigo-500 to-violet-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {isCompleted ? (
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={17} />
            Course completed
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} className="text-amber-500" />
            Keep learning — you're making progress!
          </div>
        )}

        {/* Certificate section */}
        {isCompleted && (
          <div className="mb-4">
            {certificatesLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                <LoaderCircle size={17} className="animate-spin" />
                Checking certificate...
              </div>
            ) : certificatesError ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  Unable to check your certificate right now.
                </p>

                <button
                  type="button"
                  onClick={() => refetchCertificates()}
                  className="mt-2 text-sm font-bold text-amber-800 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            ) : existingCertificate ? (
              <Link
                to="/certificates"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <Award size={18} />
                View certificate
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => certificateMutation.mutate()}
                  disabled={certificateMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-amber-950 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {certificateMutation.isPending ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Generating certificate...
                    </>
                  ) : (
                    <>
                      <Award size={18} />
                      Generate certificate
                    </>
                  )}
                </button>

                {certificateMutation.isError && (
                  <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-rose-600">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {certificateError}
                  </p>
                )}

                {certificateMutation.isSuccess && (
                  <p role="status" className="mt-2 text-sm font-medium text-emerald-700">
                    Certificate generated! Updating your certificate list...
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-auto">
          <Link
            to={`/learn/${enrollment.courseId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
          >
            <PlayCircle size={18} />
            {isCompleted ? 'Review course' : 'Continue learning'}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EnrolledCourseCard;