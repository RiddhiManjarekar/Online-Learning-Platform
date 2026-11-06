
import api from './api';

const adminAuditLogService = {

    // Get all audit logs with optional filters
    
getAuditLogs: async ({
    search = '',
    performedById = '',
    action = '',
    entityType = '',
    page = 0,
    size = 10
} = {}) => {
    const response = await api.get('/admin/audit-logs', {
        params: {
            search: search || undefined,
            performedById: performedById || undefined,
            action: action || undefined,
            entityType: entityType || undefined,
            page,
            size
        }
    });

    return response.data;
},


    // Get one audit log by ID
    getAuditLogById: async (id) => {

        const response = await api.get(`/admin/audit-logs/${id}`);

        return response.data;
    }
};

export default adminAuditLogService;
