
import api from './api'

const getAllApplications = async () => {
  const response = await api.get('/instructor-applications/admin')
  return response.data
}

const reviewApplication = async (applicationId, reviewData) => {
  const response = await api.patch(
    `/instructor-applications/admin/${applicationId}/review`,
    reviewData
  )

  return response.data
}

const adminInstructorApplicationService = {
  getAllApplications,
  reviewApplication,
}

export default adminInstructorApplicationService
