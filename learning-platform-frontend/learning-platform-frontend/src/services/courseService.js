
import api from './api';

const courseService = {
    getMyCourses: async () => {
        const response = await api.get('/instructor/courses/me');
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post(
            '/instructor/courses',
            courseData
        );
        return response.data;
    },

    updateCourse: async (id, courseData) => {
        const response = await api.put(
            `/instructor/courses/${id}`,
            courseData
        );
        return response.data;
    },

    deleteCourse: async (id) => {
        await api.delete(`/instructor/courses/${id}`);
    },

    publishCourse: async (id) => {
        const response = await api.patch(
            `/instructor/courses/${id}/publish`
        );
        return response.data;
    },

    unpublishCourse: async (id) => {
        const response = await api.patch(
            `/instructor/courses/${id}/unpublish`
        );
        return response.data;
    },

    // Public: get all published courses.
    getPublishedCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },

    // Public: get details of one published course.
    getCourseById: async (courseId) => {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    },

    getPublicLessons: async (courseId) => {
  const response = await api.get(`/courses/${courseId}/lessons`);
  return response.data;
}, 

  getAvailableCategories: async () =>{
  const response=await api.get('/categories');
 return response.data;
  },
    
};

export default courseService;
