
import api from './api';

const adminCertificateService = {

    // Get all certificates with optional search and status filter.
    getCertificates: async ({ search = '', revoked = '' } = {}) => {
        const params = {};

        if (search.trim()) {
            params.search = search.trim();
        }

        if (revoked !== '') {
            params.revoked = revoked;
        }

        const response = await api.get('/admin/certificates', { params });
        return response.data;
    },

    // Get one certificate's details.
    getCertificateById: async (id) => {
        const response = await api.get(`/admin/certificates/${id}`);
        return response.data;
    },

    // Download certificate PDF.
    downloadCertificate: async (id) => {
        const response = await api.get(
            `/admin/certificates/${id}/download`,
            { responseType: 'blob' }
        );

        return response.data;
    },

    // Revoke a certificate.
    revokeCertificate: async (id, reason) => {
        const response = await api.patch(
            `/admin/certificates/${id}/revoke`,
            { reason }
        );

        return response.data;
    },

    restoreCertificate : async (id) => {
    const response = await api.patch(
        `/admin/certificates/${id}/restore`
    );

    return response.data;
  },
};

export default adminCertificateService;
