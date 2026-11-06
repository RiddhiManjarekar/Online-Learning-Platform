import api from './api';

const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    getUsers: async ({ search = '', role = '' } = {}) => {
        const response = await api.get('/admin/users', {
            params: {
                ...(search.trim() && { search: search.trim() }),
                ...(role && { role }),
            },
        });

        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    updateUserRole: async (id, role) => {
        const response = await api.patch(`/admin/users/${id}/role`, {
            role,
        });

        return response.data;
    },

    updateUserStatus: async (id, enabled) => {
        const response = await api.patch(`/admin/users/${id}/status`, {
            enabled,
        });

        return response.data;
    },
};

export default adminService;