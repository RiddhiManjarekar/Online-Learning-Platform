
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Users,
    Eye,
    Trash2,
    RefreshCw,
    X,
    BookOpen,
    CheckCircle,
} from 'lucide-react';

import adminEnrollmentService from '../../services/adminEnrollmentService';
import adminCourseService from '../../services/adminCourseService';

function AdminEnrollments() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    // Fetch enrollments
    const {
        data: enrollments = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['adminEnrollments', search, courseFilter],
        queryFn: () =>
            adminEnrollmentService.getEnrollments({
                search,
                courseId: courseFilter,
            }),
    });

    // Fetch courses for the course filter
    const {
        data: courses = [],
    } = useQuery({
        queryKey: ['adminCourses'],
        queryFn: () => adminCourseService.getCourses(),
    });

    // Delete enrollment
    const deleteMutation = useMutation({
        mutationFn: (id) =>
            adminEnrollmentService.deleteEnrollment(id),
        onSuccess: () => {
            setSelectedEnrollment(null);

            queryClient.invalidateQueries({
                queryKey: ['adminEnrollments'],
            });

            queryClient.invalidateQueries({
                queryKey: ['adminDashboardStats'],
            });
        },
    });

    const handleDelete = (enrollment) => {
        const confirmed = window.confirm(
            `Remove ${enrollment.learnerName}'s enrollment in "${enrollment.courseTitle}"? This will not delete any certificate.`
        );

        if (confirmed) {
            deleteMutation.mutate(enrollment.id);
        }
    };

    const formatDate = (date) => {
        if (!date) return '—';

        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getErrorMessage = (requestError) =>
        requestError?.response?.data?.message ||
        requestError?.message ||
        'Something went wrong. Please try again.';

    const errorMessage = deleteMutation.error || error;

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Enrollment Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Monitor learner enrollments and course progress.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Search and course filter */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search learner or course..."
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <select
                    value={courseFilter}
                    onChange={(event) => setCourseFilter(event.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                    <option value="">All Courses</option>

                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Error message */}
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {getErrorMessage(errorMessage)}
                </div>
            )}

            {/* Enrollment list */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 p-12 text-gray-500">
                        <RefreshCw size={18} className="animate-spin" />
                        Loading enrollments...
                    </div>
                ) : isError ? (
                    <div className="p-10 text-center">
                        <p className="text-sm text-red-600">
                            {getErrorMessage(error)}
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users
                            size={36}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-3 font-semibold text-gray-800">
                            No enrollments found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or course filter.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-4">Learner</th>
                                        <th className="px-5 py-4">Course</th>
                                        <th className="px-5 py-4">Enrolled On</th>
                                        <th className="px-5 py-4">Progress</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {enrollments.map((enrollment) => (
                                        <tr
                                            key={enrollment.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {enrollment.learnerName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {enrollment.learnerEmail}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="max-w-xs truncate text-sm font-medium text-gray-800">
                                                    {enrollment.courseTitle}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(enrollment.enrolledAt)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="w-36">
                                                    <div className="mb-1 flex justify-between text-xs">
                                                        <span className="text-gray-600">
                                                            {enrollment.completedLessons}/
                                                            {enrollment.totalLessons} lessons
                                                        </span>

                                                        <span className="font-medium text-gray-800">
                                                            {Math.round(enrollment.progressPercentage)}%
                                                        </span>
                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className="h-full rounded-full bg-indigo-600"
                                                            style={{
                                                                width: `${Math.min(100, Math.max(0, enrollment.progressPercentage))}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {enrollment.completed ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                        <CheckCircle size={13} />
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                                        In Progress
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedEnrollment(enrollment)}
                                                        title="View details"
                                                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Eye size={17} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(enrollment)}
                                                        disabled={deleteMutation.isPending}
                                                        title="Remove enrollment"
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
                            Total enrollments: {enrollments.length}
                        </div>
                    </>
                )}
            </div>

            {/* Enrollment details modal */}
            {selectedEnrollment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedEnrollment(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Enrollment Details
                            </h2>

                            <button
                                onClick={() => setSelectedEnrollment(null)}
                                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Learner</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {selectedEnrollment.learnerName}
                                </p>
                                <p className="text-gray-600">
                                    {selectedEnrollment.learnerEmail}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Course</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {selectedEnrollment.courseTitle}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500">Enrolled On</p>
                                    <p className="mt-1 font-medium">
                                        {formatDate(selectedEnrollment.enrolledAt)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Status</p>
                                    <p className="mt-1 font-medium">
                                        {selectedEnrollment.completed
                                            ? 'Completed'
                                            : 'In Progress'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between">
                                    <p className="text-gray-500">Course Progress</p>
                                    <p className="font-semibold text-indigo-600">
                                        {Math.round(selectedEnrollment.progressPercentage)}%
                                    </p>
                                </div>

                                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-indigo-600"
                                        style={{
                                            width: `${Math.min(100, Math.max(0, selectedEnrollment.progressPercentage))}%`,
                                        }}
                                    />
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
                                    {selectedEnrollment.completedLessons} of{' '}
                                    {selectedEnrollment.totalLessons} lessons completed
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Enrollment ID</p>
                                <p className="mt-1 break-all text-xs text-gray-700">
                                    {selectedEnrollment.id}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedEnrollment(null)}
                            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEnrollments;
