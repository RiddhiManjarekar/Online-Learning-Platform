import api from './api';

const enrollmentService = {

    // Enroll in a course.
    enroll: async (courseId) => {
        const response = await api.post(
            `/learner/enrollments/${courseId}`
        );

        return response.data;
    },

    // Get all courses enrolled by the current learner.
    getMyEnrollments: async () => {
        const response = await api.get('/learner/enrollments');
        return response.data;
    },

    // Get enrollment details for one course.
    getMyEnrollment: async (courseId) => {
        const response = await api.get(
            `/learner/enrollments/${courseId}`
        );

        return response.data;
    }
};

export default enrollmentService;