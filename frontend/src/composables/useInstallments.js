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

    return {
        installments,
        loading,
        error,
        fetchInstallments
    };
}