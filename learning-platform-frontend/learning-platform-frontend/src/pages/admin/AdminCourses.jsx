
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    BookOpen,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    RefreshCw,
    X,
} from 'lucide-react';

import adminCourseService from '../../services/adminCourseService';

function AdminCourses() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);

    const {
        data: courses = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['adminCourses', search, statusFilter],
        queryFn: () =>
            adminCourseService.getCourses({
                search,
                published: statusFilter,
            }),
    });

    const refreshCourses = () => {
        queryClient.invalidateQueries({
            queryKey: ['adminCourses'],
        });
        queryClient.invalidateQueries({
            queryKey: ['adminDashboardStats'],
        });
    };

    const publishMutation = useMutation({
        mutationFn: (courseId) =>
            adminCourseService.publishCourse(courseId),
        onSuccess: refreshCourses,
    });

    const unpublishMutation = useMutation({
        mutationFn: (courseId) =>
            adminCourseService.unpublishCourse(courseId),
        onSuccess: refreshCourses,
    });

    const deleteMutation = useMutation({
        mutationFn: (courseId) =>
            adminCourseService.deleteCourse(courseId),
        onSuccess: () => {
            setSelectedCourse(null);
            refreshCourses();
        },
    });

    const isActionPending =
        publishMutation.isPending ||
        unpublishMutation.isPending ||
        deleteMutation.isPending;

    const handlePublish = (course) => {
        if (course.published) {
            unpublishMutation.mutate(course.id);
        } else {
            publishMutation.mutate(course.id);
        }
    };

    const handleDelete = (course) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
        );

        if (confirmed) {
            deleteMutation.mutate(course.id);
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

    const getErrorMessage = (mutationError) => {
        return (
            mutationError?.response?.data?.message ||
            mutationError?.message ||
            'Something went wrong. Please try again.'
        );
    };

    const actionError =
        publishMutation.error ||
        unpublishMutation.error ||
        deleteMutation.error;

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Course Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all courses created by instructors.
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

            {/* Search and filter */}
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
                        placeholder="Search by course title or category..."
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                    <option value="">All Courses</option>
                    <option value="true">Published</option>
                    <option value="false">Unpublished</option>
                </select>
            </div>

            {/* Mutation error */}
            {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {getErrorMessage(actionError)}
                </div>
            )}

            {/* Course table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 p-12 text-gray-500">
                        <RefreshCw size={18} className="animate-spin" />
                        Loading courses...
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
                ) : courses.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen
                            size={36}
                            className="mx-auto text-gray-300"
                        />
                        <h3 className="mt-3 font-semibold text-gray-800">
                            No courses found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or status filter.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-4">Course</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Level</th>
                                        <th className="px-5 py-4">Created</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {courses.map((course) => (
                                        <tr
                                            key={course.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {course.thumbnailUrl ? (
                                                        <img
                                                            src={course.thumbnailUrl}
                                                            alt={course.title}
                                                            className="h-11 w-14 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-14 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                                                            <BookOpen size={20} />
                                                        </div>
                                                    )}

                                                    <div className="max-w-xs">
                                                        <p className="font-medium text-gray-900">
                                                            {course.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Instructor ID: {course.instructorId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {course.category}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {course.level}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(course.createdAt)}
                                            </td>

                                            <td className="px-5 py-4">
                                                {course.published ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                        <CheckCircle size={13} />
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                                                        <XCircle size={13} />
                                                        Draft
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedCourse(course)}
                                                        title="View details"
                                                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Eye size={17} />
                                                    </button>

                                                    <button
                                                        onClick={() => handlePublish(course)}
                                                        disabled={isActionPending}
                                                        title={course.published ? 'Unpublish' : 'Publish'}
                                                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                                                    >
                                                        {course.published ? (
                                                            <XCircle size={17} />
                                                        ) : (
                                                            <CheckCircle size={17} />
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(course)}
                                                        disabled={isActionPending}
                                                        title="Delete course"
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
                            Total courses: {courses.length}
                        </div>
                    </>
                )}
            </div>

            {/* Course details modal */}
            {selectedCourse && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedCourse(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Course Details
                            </h2>

                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {selectedCourse.thumbnailUrl && (
                            <img
                                src={selectedCourse.thumbnailUrl}
                                alt={selectedCourse.title}
                                className="mt-4 h-44 w-full rounded-lg object-cover"
                            />
                        )}

                        <h3 className="mt-4 text-xl font-semibold text-gray-900">
                            {selectedCourse.title}
                        </h3>

                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                            {selectedCourse.description}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Category</p>
                                <p className="mt-1 font-medium">
                                    {selectedCourse.category}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Level</p>
                                <p className="mt-1 font-medium">
                                    {selectedCourse.level}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Instructor ID</p>
                                <p className="mt-1 break-all font-medium">
                                    {selectedCourse.instructorId}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className="mt-1 font-medium">
                                    {selectedCourse.published ? 'Published' : 'Draft'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Created</p>
                                <p className="mt-1 font-medium">
                                    {formatDate(selectedCourse.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Last updated</p>
                                <p className="mt-1 font-medium">
                                    {formatDate(selectedCourse.updatedAt)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedCourse(null)}
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

export default AdminCourses;
