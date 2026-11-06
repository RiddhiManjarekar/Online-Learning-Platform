
import api from './api';

const adminEnrollmentService = {
    // Get all enrollments with optional filters
    getEnrollments: async ({ search = '', courseId = '' } = {}) => {
        const params = {};

        if (search.trim()) {
            params.search = search.trim();
        }

        if (courseId) {
            params.courseId = courseId;
        }

        const response = await api.get('/admin/enrollments', { params });
        return response.data;
    },

    // Get enrollment details
    getEnrollmentById: async (id) => {
        const response = await api.get(`/admin/enrollments/${id}`);
        return response.data;
    },

    // Delete enrollment
    deleteEnrollment: async (id) => {
        await api.delete(`/admin/enrollments/${id}`);
    },
};

export default adminEnrollmentService;
