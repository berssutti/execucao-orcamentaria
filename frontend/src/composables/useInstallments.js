import { ref } from 'vue';
import { installmentService } from '@/services/installmentService';

export function useInstallments() {
    const installments = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchInstallments = async (projectId) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await installmentService.getProjectInstallments(projectId);
            installments.value = response.data;
        } catch(err) {
            error.value = 'Erro ao carregar parcelas';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const createInstallment = async (projectId, data) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await installmentService.createInstallment(projectId, data);
            installments.value = response.data;
        } catch(err) {
            error.value = 'Erro ao criar parcela';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };
    
    const deleteInstallment = async (projectId, installmentId) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await installmentService.deleteInstallment(projectId, installmentId);
            installments.value = null;
        } catch(err) {
            error.value = 'Erro ao deletar parcela';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        installments,
        loading,
        error,
        fetchInstallments,
        createInstallment,
        deleteInstallment
    };
}