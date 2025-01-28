import api from './api';

export const installmentService = {
    getProjectInstallments(projectId) {
        return api.get(`/projects/${projectId}/installments/`);
    },

    createInstallment(projectId, data) {
        return api.post(`/projects/${projectId}/installments/`, data);
    },

    updateInstallment(projectId, installmentId, data) {
        return api.put(`/projects/${projectId}/installments/${installmentId}/`, data);
    },

    deleteInstallment(projectId, installmentId) {
        return api.delete(`/projects/${projectId}/installments/${installmentId}/`);
    }
};