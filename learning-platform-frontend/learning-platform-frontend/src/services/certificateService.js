
import api from './api';

const certificateService = {
  // Generate a certificate for a completed course
  generateCertificate: async (courseId) => {
    const response = await api.post(
      `/learner/certificates/courses/${courseId}`
    );
    return response.data;
  },

  // Get all certificates of the logged-in learner
  getMyCertificates: async () => {
    const response = await api.get('/learner/certificates');
    return response.data;
  },

  // Download certificate PDF as a Blob
  downloadCertificate: async (certificateId) => {
    const response = await api.get(
      `/learner/certificates/${certificateId}/download`,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },

  // Public certificate verification
  verifyCertificate: async (certificateNumber) => {
    const response = await api.get(
      `/certificates/verify/${encodeURIComponent(certificateNumber)}`
    );
    return response.data;
  },
};

export default certificateService;
