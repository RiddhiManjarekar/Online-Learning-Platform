import { useState } from 'react';
import {
  Award,
  CalendarDays,
  Download,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react';

import certificateService from '../../services/certificateService';

function CertificateCard({ certificate }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    let fileUrl;

    try {
      setDownloading(true);
      setError('');

      const pdfBlob = await certificateService.downloadCertificate(
        certificate.id
      );

      if (!(pdfBlob instanceof Blob) || pdfBlob.size === 0) {
        throw new Error('The downloaded certificate is empty.');
      }

      fileUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `certificate-${certificate.certificateNumber || certificate.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Allow the browser to begin downloading before revoking the URL.
      window.setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 1000);
    } catch (err) {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl);
      }

      setError(
        err.response?.data?.message ||
          'Unable to download certificate. Please try again.'
      );
    } finally {
      setDownloading(false);
    }
  };

  const issueDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Date unavailable';

  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,41,59,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Certificate preview */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-slate-900 p-6 text-center text-white sm:p-7">
        <div className="absolute inset-2 rounded-xl border border-amber-300/50" />
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[25px] border-white/5" />
        <div className="absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-indigo-400/10 blur-2xl" />

        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-300 bg-white/10">
            <Award size={30} className="text-amber-300" />
          </div>

          <p className="mt-4 text-xs font-semibold tracking-[0.3em] text-amber-200">
            LEARNHUB
          </p>

          <h3 className="mt-2 text-lg font-black tracking-wide">
            CERTIFICATE
          </h3>

          <p className="mt-1 text-xs font-medium tracking-widest text-indigo-200">
            OF COMPLETION
          </p>

          <div className="mx-auto my-4 h-px w-20 bg-amber-300" />

          <p className="text-sm font-medium text-indigo-100">
            {certificate.learnerName || 'Learner'}
          </p>

          <p className="mt-2 text-xs text-indigo-200">
            Successfully completed
          </p>

          <p className="mt-1 line-clamp-2 text-base font-bold text-white">
            {certificate.courseTitle || 'Course'}
          </p>
        </div>
      </div>

      {/* Certificate details */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={17} className="shrink-0 text-indigo-600" />
          <span>Issued: {issueDate}</span>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-600" />
          <span className="break-all">
            ID: {certificate.certificateNumber || 'Unavailable'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Preparing PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              Download certificate
            </>
          )}
        </button>

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-center text-sm text-rose-700">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

export default CertificateCard;