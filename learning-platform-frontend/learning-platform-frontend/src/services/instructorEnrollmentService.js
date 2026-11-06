
import api from './api'

const instructorEnrollmentService = {
  // All learners enrolled in the logged-in instructor's courses.
  getMyEnrollments: async () => {
    const response = await api.get('/instructor/enrollments')
    return response.data
  },

  // Learners enrolled in one particular course.
  getCourseLearners: async (courseId) => {
    const response = await api.get(
      `/instructor/enrollments/course/${courseId}`
    )
    return response.data
  },

  // Individual learner's progress in a course.
  getLearnerProgress: async (courseId, learnerId) => {
    const response = await api.get(
      `/instructor/enrollments/course/${courseId}/learner/${learnerId}`
    )
    return response.data
  }
}

export default instructorEnrollmentService
