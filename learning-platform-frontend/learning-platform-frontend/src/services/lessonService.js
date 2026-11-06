import api from './api';

const lessonService = {
    getLessons: async (courseId) => {
        const response = await api.get(
            `/instructor/courses/${courseId}/lessons`
        );
        return response.data;
    },

    createLesson: async (courseId, lessonData) => {
        const response = await api.post(
            `/instructor/courses/${courseId}/lessons`,
            lessonData
        );
        return response.data;
    },

    updateLesson: async (lessonId, lessonData) => {
        const response = await api.put(
            `/instructor/courses/lessons/${lessonId}`,
            lessonData
        );
        return response.data;
    },

    deleteLesson: async (lessonId) => {
        await api.delete(
            `/instructor/courses/lessons/${lessonId}`
        );
    }
};

export default lessonService;