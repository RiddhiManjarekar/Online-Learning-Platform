
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Award,
  CheckCircle,
  LoaderCircle,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import certificateService from '../services/certificateService';

function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState('');

  const verificationMutation = useMutation({
    mutationFn: certificateService.verifyCertificate,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = certificateNumber.trim();

    if (!value) {
      return;
    }

    verificationMutation.mutate(value);
  };

  const result = verificationMutation.data;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
            <Award size={34} className="text-indigo-700" />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Certificate Verification
          </h1>

          <p className="mt-3 text-slate-500">
            Verify the authenticity of a LearnHub course completion certificate.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="certificateNumber"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Certificate ID
            </label>

            <input
              id="certificateNumber"
              type="text"
              value={certificateNumber}
              onChange={(event) => {
                setCertificateNumber(event.target.value);
                verificationMutation.reset();
              }}
              placeholder="Enter your certificate ID"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              disabled={
                verificationMutation.isPending ||
                !certificateNumber.trim()
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verificationMutation.isPending ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search size={19} />
                  Verify Certificate
                </>
              )}
            </button>
          </form>

          {verificationMutation.isError && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              Verification failed. Please check your certificate ID and try again.
            </div>
          )}

          {result && (
            <div
              className={`mt-6 rounded-xl border p-5 ${
                result.valid
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {result.valid ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle size={23} />
                    <h2 className="text-lg font-bold">
                      Valid Certificate
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-emerald-800">
                    This certificate exists in the LearnHub records.
                  </p>

                  <div className="mt-5 space-y-3 border-t border-emerald-200 pt-4 text-sm">
                    <div>
                      <p className="text-emerald-700">Learner</p>
                      <p className="font-semibold text-slate-900">
                        {result.learnerName}
                      </p>
                    </div>

                    <div>
                      <p className="text-emerald-700">Course</p>
                      <p className="font-semibold text-slate-900">
                        {result.courseTitle}
                      </p>
                    </div>

                    <div>
                      <p className="text-emerald-700">Issued on</p>
                      <p className="font-semibold text-slate-900">
                        {result.issuedAt
                          ? new Date(result.issuedAt).toLocaleDateString('en-IN')
                          : 'Not available'}
                      </p>
                    </div>

                    <div>
                      <p className="text-emerald-700">Certificate ID</p>
                      <p className="break-all font-semibold text-slate-900">
                        {result.certificateNumber}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3 text-red-700">
                  <XCircle size={24} className="shrink-0" />
                  <div>
                    <h2 className="font-bold">Certificate not found</h2>
                    <p className="mt-1 text-sm">
                      We could not find a certificate with this ID. Please check the number and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          LearnHub · Certificate Verification
        </p>
      </div>
    </div>
  );
}

export default VerifyCertificate;
