
import api from './api';

const adminCourseService = {
    // Get all courses with optional filters
    getCourses: async ({ search = '', published = '' } = {}) => {
        const params = {};

        if (search.trim()) {
            params.search = search.trim();
        }

        if (published !== '') {
            params.published = published;
        }

        const response = await api.get('/admin/courses', { params });
        return response.data;
    },

    // Get course details
    getCourseById: async (id) => {
        const response = await api.get(`/admin/courses/${id}`);
        return response.data;
    },

    // Publish course
    publishCourse: async (id) => {
        const response = await api.patch(`/admin/courses/${id}/publish`);
        return response.data;
    },

    // Unpublish course
    unpublishCourse: async (id) => {
        const response = await api.patch(`/admin/courses/${id}/unpublish`);
        return response.data;
    },

    // Delete course
    deleteCourse: async (id) => {
        await api.delete(`/admin/courses/${id}`);
    },
};

export default adminCourseService;
