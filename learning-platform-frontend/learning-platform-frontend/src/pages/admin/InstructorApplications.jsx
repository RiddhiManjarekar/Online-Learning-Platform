
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  X,
  GraduationCap,
  Mail,
  CalendarDays,
  BookOpen,
  BriefcaseBusiness,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react'

import adminInstructorApplicationService from '../../services/adminInstructorApplicationService'

const statusStyles = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJECTED: 'bg-red-50 text-red-700 ring-red-200',
}

function formatDate(date) {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-600 ring-slate-200'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {status || 'UNKNOWN'}
    </span>
  )
}

function SummaryCard({ title, count, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

function ApplicationDetails({ application, onClose, onReview, isReviewing }) {
  const [remarks, setRemarks] = useState('')
  const isPending = application.status === 'PENDING'

  function handleReview(status) {
    const action = status === 'APPROVED' ? 'approve' : 'reject'

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this instructor application?`
    )

    if (!confirmed) return

    onReview({
      applicationId: application.id,
      reviewData: {
        status,
        adminRemarks: remarks.trim(),
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Application Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the instructor application
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isReviewing}
            aria-label="Close application details"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {application.fullName}
              </h3>

              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail size={15} />
                {application.email}
              </p>
            </div>

            <StatusBadge status={application.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Expertise
              </p>
              <p className="mt-2 font-semibold text-slate-800">
                {application.expertise}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Experience
              </p>
              <p className="mt-2 font-semibold text-slate-800">
                {application.experience}
              </p>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <BookOpen size={17} />
              Proposed Course
            </h4>
            <p className="mt-2 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
              {application.courseIdea}
            </p>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <BriefcaseBusiness size={17} />
              About the Applicant
            </h4>
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
              {application.about}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={15} />
              Submitted: {formatDate(application.submittedAt)}
            </span>

            {application.reviewedAt && (
              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                Reviewed: {formatDate(application.reviewedAt)}
              </span>
            )}
          </div>

          {!isPending && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Admin Remarks
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                {application.adminRemarks || 'No remarks provided.'}
              </p>
              {application.reviewedBy && (
                <p className="mt-2 text-xs text-slate-500">
                  Reviewed by: {application.reviewedBy}
                </p>
              )}
            </div>
          )}

          {isPending && (
            <div>
              <label
                htmlFor="adminRemarks"
                className="text-sm font-semibold text-slate-800"
              >
                Admin Remarks
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="adminRemarks"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Enter feedback for the applicant..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {remarks.length}/500
              </p>
            </div>
          )}
        </div>

        {isPending && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              onClick={() => handleReview('REJECTED')}
              disabled={isReviewing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={17} />
              Reject
            </button>

            <button
              onClick={() => handleReview('APPROVED')}
              disabled={isReviewing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReviewing ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <CheckCircle size={17} />
              )}
              Approve Application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InstructorApplications() {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminInstructorApplications'],
    queryFn: adminInstructorApplicationService.getAllApplications,
  })

  const reviewMutation = useMutation({
    mutationFn: ({ applicationId, reviewData }) =>
      adminInstructorApplicationService.reviewApplication(
        applicationId,
        reviewData
      ),

    onSuccess: (updatedApplication) => {
      setSelectedApplication(null)
      setErrorMessage('')

      queryClient.setQueryData(
        ['adminInstructorApplications'],
        (oldApplications = []) =>
          oldApplications.map((application) =>
            application.id === updatedApplication.id
              ? updatedApplication
              : application
          )
      )

      queryClient.invalidateQueries({
        queryKey: ['adminDashboardStats'],
      })
    },

    onError: (mutationError) => {
      setErrorMessage(
        mutationError.response?.data?.message ||
        mutationError.response?.data?.error ||
        'Unable to review this application. Please try again.'
      )
    },
  })

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const search = searchTerm.trim().toLowerCase()

      const matchesSearch =
        !search ||
        application.fullName?.toLowerCase().includes(search) ||
        application.email?.toLowerCase().includes(search) ||
        application.expertise?.toLowerCase().includes(search)

      const matchesStatus =
        statusFilter === 'ALL' || application.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, statusFilter])

  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((item) => item.status === 'PENDING').length,
    approved: applications.filter((item) => item.status === 'APPROVED').length,
    rejected: applications.filter((item) => item.status === 'REJECTED').length,
  }), [applications])

  function handleReview({ applicationId, reviewData }) {
    reviewMutation.mutate({ applicationId, reviewData })
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
          <GraduationCap size={18} />
          Admin Management
        </div>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Instructor Applications
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review applications and manage instructor approvals.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Applications"
          count={counts.total}
          icon={Users}
          color="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          title="Pending"
          count={counts.pending}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          title="Approved"
          count={counts.approved}
          icon={CheckCircle}
          color="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Rejected"
          count={counts.rejected}
          icon={XCircle}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Error message */}
      {(errorMessage || isError) && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            {errorMessage || error?.response?.data?.message ||
              'Could not load instructor applications.'}
          </div>
          {isError && (
            <button
              onClick={() => refetch()}
              className="font-semibold underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Search and filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email or expertise..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Applications</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Applications table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Applications</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredApplications.length} application(s) found
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoaderCircle size={30} className="animate-spin text-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading applications...
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <GraduationCap size={28} className="text-slate-400" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No applications found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {applications.length === 0
                ? 'There are no instructor applications yet.'
                : 'Try changing your search or status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Applicant</th>
                  <th className="px-5 py-4 font-semibold">Expertise</th>
                  <th className="px-5 py-4 font-semibold">Experience</th>
                  <th className="px-5 py-4 font-semibold">Submitted</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {application.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {application.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {application.expertise}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {application.experience}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(application.submittedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application details modal */}
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => {
            if (!reviewMutation.isPending) {
              setSelectedApplication(null)
              setErrorMessage('')
            }
          }}
          onReview={handleReview}
          isReviewing={reviewMutation.isPending}
        />
      )}
    </div>
  )
}
