
import api from './api';

const learnerCourseService = {
  // Get all lessons available to an enrolled learner
  getLessons: async (courseId) => {
    const response = await api.get(
      `/learner/courses/${courseId}/lessons`
    );
    return response.data;
  },

  // Get the learner's course progress
  getProgress: async (courseId) => {
    const response = await api.get(
      `/learner/courses/${courseId}/progress`
    );
    return response.data;
  },

  // Mark a lesson as completed
  completeLesson: async (courseId, lessonId) => {
    const response = await api.patch(
      `/learner/courses/${courseId}/lessons/${lessonId}/complete`
    );
    return response.data;
  },
};

export default learnerCourseService;
