
import api from './api';

// Admin profile
export const getAdminProfile = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateAdminProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};

// Change password
export const changeAdminPassword = async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
};

// Platform settings
export const getPlatformSettings = async () => {
    const response = await api.get('/admin/settings');
    return response.data;
};

export const updatePlatformSettings = async (settingsData) => {
    const response = await api.put('/admin/settings', settingsData);
    return response.data;
};

// Course categories
export const getCategories = async () => {
    const response = await api.get('/admin/categories');
    return response.data;
};

export const getCategoryById = async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
};
