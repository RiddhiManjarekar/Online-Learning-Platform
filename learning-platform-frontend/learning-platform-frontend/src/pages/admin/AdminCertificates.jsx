import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Search,
  Eye,
  Download,
  ShieldCheck,
  ShieldX,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

import adminCertificateService from "../../services/adminCertificateService";

function AdminCertificates() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateToRevoke, setCertificateToRevoke] = useState(null);
  const [revocationReason, setRevocationReason] = useState("");
  const [actionError, setActionError] = useState("");

  // Debounce search to avoid sending an API request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch certificates.
  const {
    data: certificates = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminCertificates", debouncedSearch, statusFilter],
    queryFn: () =>
      adminCertificateService.getCertificates({
        search: debouncedSearch,
        revoked: statusFilter,
      }),
  });

  // Revoke certificate mutation.
  const revokeMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      adminCertificateService.revokeCertificate(id, reason),

    onSuccess: (updatedCertificate) => {
      queryClient.invalidateQueries({
        queryKey: ["adminCertificates"],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminDashboardStats"],
      });

      setCertificateToRevoke(null);
      setRevocationReason("");
      setActionError("");

      // Update the details dialog if it is showing this certificate.
      setSelectedCertificate((current) =>
        current?.id === updatedCertificate.id ? updatedCertificate : current,
      );
    },

    onError: (err) => {
      setActionError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to revoke certificate. Please try again.",
      );
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => adminCertificateService.restoreCertificate(id),

    onSuccess: (updatedCertificate) => {
      queryClient.invalidateQueries({
        queryKey: ["adminCertificates"],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminDashboardStats"],
      });

      // Update details modal if it is open.
      setSelectedCertificate((current) =>
        current?.id === updatedCertificate.id ? updatedCertificate : current,
      );

      setActionError("");
    },

    onError: (error) => {
      setActionError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to restore certificate. Please try again.",
      );
    },
  });

  // Format date for display.
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Download certificate PDF.
  const handleDownload = async (certificate) => {
    try {
      setActionError("");

      const blob = await adminCertificateService.downloadCertificate(
        certificate.id,
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `certificate-${certificate.certificateNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Unable to download certificate.",
      );
    }
  };

  // Submit revocation.
  const handleRevoke = (event) => {
    event.preventDefault();

    if (!revocationReason.trim()) {
      setActionError("Please enter a revocation reason.");
      return;
    }

    if (revocationReason.trim().length > 500) {
      setActionError("Reason cannot exceed 500 characters.");
      return;
    }

    revokeMutation.mutate({
      id: certificateToRevoke.id,
      reason: revocationReason.trim(),
    });
  };

  const handleRestore = (certificate) => {
    const confirmed = window.confirm(
      `Are you sure you want to restore certificate ${certificate.certificateNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    setActionError("");
    restoreMutation.mutate(certificate.id);
  };

  const activeCount = certificates.filter(
    (certificate) => !certificate.revoked,
  ).length;

  const revokedCount = certificates.filter(
    (certificate) => certificate.revoked,
  ).length;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificate Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View, verify, download and manage issued certificates.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Certificates"
          value={certificates.length}
          icon={<Award size={22} />}
        />

        <SummaryCard
          title="Active Certificates"
          value={activeCount}
          icon={<ShieldCheck size={22} />}
        />

        <SummaryCard
          title="Revoked Certificates"
          value={revokedCount}
          icon={<ShieldX size={22} />}
        />
      </div>

      {/* Search and filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search learner, email, course or certificate number..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Certificates</option>
            <option value="false">Active</option>
            <option value="true">Revoked</option>
          </select>
        </div>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Certificates table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            Loading certificates...
          </div>
        ) : isError ? (
          <div className="p-10 text-center">
            <AlertCircle size={30} className="mx-auto mb-3 text-red-500" />

            <p className="font-medium text-gray-800">
              Unable to load certificates.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {error?.response?.data?.message ||
                error?.message ||
                "Please try again."}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center">
            <Award size={36} className="mx-auto mb-3 text-gray-400" />

            <p className="font-medium text-gray-800">No certificates found</p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Certificate</th>
                  <th className="px-5 py-4">Learner</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Issued Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">
                        {certificate.certificateNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {certificate.learnerName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {certificate.learnerEmail || "Email unavailable"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[200px] truncate text-sm text-gray-700">
                        {certificate.courseTitle}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(certificate.issuedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge revoked={certificate.revoked} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedCertificate(certificate);
                            setActionError("");
                          }}
                          title="View details"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDownload(certificate)}
                          title="Download PDF"
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Download size={18} />
                        </button>

                        {certificate.revoked ? (
                          <button
                            onClick={() => handleRestore(certificate)}
                            disabled={restoreMutation.isPending}
                            title="Restore certificate"
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            <ShieldCheck size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCertificateToRevoke(certificate);
                              setRevocationReason("");
                              setActionError("");
                            }}
                            title="Revoke certificate"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <ShieldX size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !isError && certificates.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
            Showing {certificates.length} certificate(s)
          </div>
        )}
      </div>

      {/* Certificate details dialog */}
      {selectedCertificate && (
        <Modal
          title="Certificate Details"
          onClose={() => setSelectedCertificate(null)}
        >
          <div className="space-y-4">
            <DetailRow
              label="Certificate Number"
              value={selectedCertificate.certificateNumber}
            />

            <DetailRow
              label="Learner Name"
              value={selectedCertificate.learnerName}
            />

            <DetailRow
              label="Learner Email"
              value={selectedCertificate.learnerEmail || "Unavailable"}
            />

            <DetailRow label="Course" value={selectedCertificate.courseTitle} />

            <DetailRow
              label="Issue Date"
              value={formatDate(selectedCertificate.issuedAt)}
            />

            <DetailRow
              label="Status"
              value={selectedCertificate.revoked ? "Revoked" : "Active"}
            />

            {selectedCertificate.revoked && (
              <>
                <DetailRow
                  label="Revoked Date"
                  value={formatDate(selectedCertificate.revokedAt)}
                />

                <DetailRow
                  label="Revocation Reason"
                  value={selectedCertificate.revocationReason || "Not provided"}
                />
              </>
            )}

            <button
              onClick={() => handleDownload(selectedCertificate)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download size={17} />
              Download Certificate PDF
            </button>

            {selectedCertificate.revoked ? (
              <button
                onClick={() => handleRestore(selectedCertificate)}
                disabled={restoreMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <ShieldCheck size={17} />
                {restoreMutation.isPending
                  ? "Restoring..."
                  : "Restore Certificate"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setCertificateToRevoke(selectedCertificate);
                  setRevocationReason("");
                  setActionError("");
                  setSelectedCertificate(null);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                <ShieldX size={17} />
                Revoke Certificate
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Revoke certificate dialog */}
      {certificateToRevoke && (
        <Modal
          title="Revoke Certificate"
          onClose={() => {
            if (!revokeMutation.isPending) {
              setCertificateToRevoke(null);
              setRevocationReason("");
              setActionError("");
            }
          }}
        >
          <form onSubmit={handleRevoke} className="space-y-4">
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              You are about to revoke certificate{" "}
              <strong>{certificateToRevoke.certificateNumber}</strong>. Public
              verification will mark it as invalid.
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reason for revocation
              </label>

              <textarea
                value={revocationReason}
                onChange={(event) => {
                  setRevocationReason(event.target.value);
                  setActionError("");
                }}
                rows={4}
                maxLength={500}
                required
                placeholder="Explain why this certificate is being revoked..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {revocationReason.length}/500 characters
              </p>
            </div>

            {actionError && (
              <p className="text-sm text-red-600">{actionError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={revokeMutation.isPending}
                onClick={() => {
                  setCertificateToRevoke(null);
                  setRevocationReason("");
                  setActionError("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={revokeMutation.isPending || !revocationReason.trim()}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {revokeMutation.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}

                {revokeMutation.isPending
                  ? "Revoking..."
                  : "Confirm Revocation"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Reusable summary card.
function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">{icon}</div>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Reusable status badge.
function StatusBadge({ revoked }) {
  return revoked ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
      <ShieldX size={13} />
      Revoked
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      <ShieldCheck size={13} />
      Active
    </span>
  );
}

// Reusable modal.
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// Reusable detail row.
function DetailRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-3">
      <p className="text-xs font-medium uppercase text-gray-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default AdminCertificates;
