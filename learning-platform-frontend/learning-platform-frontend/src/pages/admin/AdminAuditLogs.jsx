import { useEffect, useState } from "react";
import { useQuery,keepPreviousData  } from "@tanstack/react-query";
import {
  Search,
  ClipboardList,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
  FilterX,
  Copy,
  Check,
} from "lucide-react";

import adminAuditLogService from "../../services/adminAuditLogService";

const actionOptions = [
  "CREATE_COURSE",
  "UPDATE_COURSE",
  "PUBLISH_COURSE",
  "UNPUBLISH_COURSE",
  "DELETE_COURSE",
  "UPDATE_USER_ROLE",
  "ACTIVATE_USER",
  "DEACTIVATE_USER",
  "DELETE_ENROLLMENT",
  "REVOKE_CERTIFICATE",
  "RESTORE_CERTIFICATE",
];

const entityOptions = ["USER", "COURSE", "ENROLLMENT", "CERTIFICATE"];

const formatAction = (action = "") => {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActionStyle = (action = "") => {
  if (action.includes("DELETE") || action.includes("REVOKE")) {
    return "bg-red-100 text-red-700";
  }

  if (
    action.includes("PUBLISH") ||
    action.includes("ACTIVATE") ||
    action.includes("RESTORE")
  ) {
    return "bg-green-100 text-green-700";
  }

  if (action.includes("UPDATE") || action.includes("UNPUBLISH")) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-blue-100 text-blue-700";
};

const AdminAuditLogs = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(0);

  // Avoid an API request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, action, entityType]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["adminAuditLogs", debouncedSearch, action, entityType, page],
    queryFn: () =>
      adminAuditLogService.getAuditLogs({
        search: debouncedSearch,
        action,
        entityType,
        page,
        size: 10,
      }),
      placeholderData:keepPreviousData,
  });

  const logs = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setAction("");
    setEntityType("");
  };

  const hasFilters = search || action || entityType;

  const handleCopyId = async (id) => {
    if (!id) return;

    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track important activities performed on your platform.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Matching Activities</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {isLoading ? "..." : totalElements}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <ClipboardList size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Filters</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {[debouncedSearch, action, entityType].filter(Boolean).length}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Search size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search audit logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Actions</option>

            {actionOptions.map((item) => (
              <option key={item} value={item}>
                {formatAction(item)}
              </option>
            ))}
          </select>

          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Entity Types</option>

            {entityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <FilterX size={16} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Audit logs table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800">Activity History</h2>

          <p className="mt-1 text-xs text-gray-500">
            Latest activities appear first.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle size={35} className="text-red-500" />

            <p className="font-medium text-gray-700">
              Failed to load audit logs.
            </p>

            <p className="max-w-md px-4 text-sm text-gray-500">
              {error?.response?.data?.message ||
                error?.message ||
                "Please try again."}
            </p>

            <button
              onClick={() => refetch()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : totalElements === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={40} className="mx-auto text-gray-300" />

            <p className="mt-3 font-medium text-gray-700">
              No audit logs found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {hasFilters
                ? "Try changing or clearing your filters."
                : "Activities will appear here when users perform actions."}
            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-blue-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4">Performed By</th>
                  <th className="whitespace-nowrap px-5 py-4">Action</th>
                  <th className="whitespace-nowrap px-5 py-4">Entity</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="whitespace-nowrap px-5 py-4">Date & Time</th>
                  <th className="px-5 py-4 text-center">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {log.performedByName || "Unknown user"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {log.performedById || "N/A"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getActionStyle(log.action)}`}
                      >
                        {formatAction(log.action || "UNKNOWN")}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-gray-700">
                        {log.entityType || "N/A"}
                      </p>

                      <p className="max-w-32 truncate text-xs text-gray-400">
                        {log.entityId || "N/A"}
                      </p>
                    </td>

                    <td className="max-w-xs px-5 py-4 text-gray-600">
                      <p className="line-clamp-2">
                        {log.description || "No description"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setCopied(false);
                        }}
                        title="View details"
                        aria-label="View audit log details"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !isError && totalElements > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages}
              {" · "}
              {totalElements} total activities
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((previous) => Math.max(previous - 1, 0))}
                disabled={page === 0 || isFetching}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() => setPage((previous) => previous + 1)}
                disabled={page + 1 >= totalPages || isFetching}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-log-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h2
                id="audit-log-title"
                className="text-lg font-semibold text-gray-800"
              >
                Audit Log Details
              </h2>

              <button
                onClick={() => setSelectedLog(null)}
                aria-label="Close details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs text-gray-500">Action</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${getActionStyle(selectedLog.action)}`}
                >
                  {formatAction(selectedLog.action || "UNKNOWN")}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500">Performed By</p>
                <p className="mt-1 font-medium text-gray-800">
                  {selectedLog.performedByName || "Unknown user"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedLog.performedById || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Entity Type</p>
                <p className="mt-1 font-medium text-gray-800">
                  {selectedLog.entityType || "N/A"}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500">Entity ID</p>

                  <button
                    onClick={() => handleCopyId(selectedLog.entityId)}
                    disabled={!selectedLog.entityId}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-40"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy ID"}
                  </button>
                </div>

                <p className="mt-1 break-all rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                  {selectedLog.entityId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="mt-1 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                  {selectedLog.description || "No description"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="mt-1 font-medium text-gray-800">
                  {formatDate(selectedLog.createdAt)}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
