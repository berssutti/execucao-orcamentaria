import { ref } from 'vue';
import { projectService } from '@/services/projectService';

export function useProject() {
    const project = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchProject = async (id) => {
        loading.value = true;
        
        try {
            const response = await projectService.getProject(id);
            project.value = response.data;
        } catch(err) {
            error.value = 'Erro ao carregar projeto';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const deleteProject = async (id) => {
        loading.value = true;

        try {
            await projectService.deleteProject(id);
            project.value = project.value.filter(project => project.id !== id);
        } catch(err) {
            error.value = 'Erro ao deletar projeto';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        project,
        loading,
        error,
        fetchProject,
        deleteProject
    };
}