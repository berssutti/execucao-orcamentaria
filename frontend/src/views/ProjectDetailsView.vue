<template>
    <v-container>
        <v-card elevation="2" class="pa-4 project-card">
            <ProjectHeader
                :project="project"
                @edit="handleEditProject"
                @delete="handleDeleteProject"
                @back="handleBack"
            />

            <ProjectInfo
                v-if="project"
                :project="project"
                :formatDate="formatDate"
            />

            <InstallmentList
                :installments="installments"
                :formatDate="formatDate"
                @add="handleAddInstallment"
                @edit="handleEditInstallment"
                @delete="handleDeleteInstallment"
                @toggle-details="handleToggleDetails"
            />

            <InstallmentForm
                v-model="showInstallmentForm"
                :installment="currentInstallment"
                :isEditing="isEditing"
                @save="handleSaveInstallment"
                @close="handleCloseInstallmentForm"
            />
        </v-card>
    </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProject } from '@/composables/useProject';
import { useInstallments } from '@/composables/useInstallments';
import { dateFormatter } from '@/utils/dateFormatter';
import ProjectHeader from '@/components/project/details/ProjectHeader.vue';
import ProjectInfo from '@/components/project/details/ProjectInfo.vue';
import InstallmentList from '@/components/project/details/installment/InstallmentList.vue';
import InstallmentForm from '@/components/project/details/installment/InstallmentForm.vue';

export default {
    name: 'ProjectDetailsView',

    components: {
        ProjectHeader,
        ProjectInfo,
        InstallmentList,
        InstallmentForm
    },

    setup() {
        const { project, loading: projectLoading, fetchProject, deleteProject } = useProject();
        const { installments, loading: installmentsLoading, fetchInstallments, createInstallment, updateInstallment, deleteInstallment } = useInstallments();
        const route = useRoute();
        const router = useRouter();

        const showInstallmentForm = ref(false);
        const currentInstallment = ref(null);
        const isEditing = ref(false);

        const formatDate = (date) => dateFormatter(date);

        const handleBack = () => router.go(-1);

        const handleDeleteProject = async () => {
            // TODO: Add alert to confirm deletion
            // TODO: Add dialog of success or error on deletion
            try {
                await deleteProject(project.value.id);
                router.push({ name: 'ProjectList' });
            } catch (error) {
                console.error('Erro ao deletar o projeto:', error);
            }
        };

        const handleAddInstallment = () => {
            currentInstallment.value = {
                amount: '',
                estimated_date: null,
                observation: '',
                destination: '',
                status: 'Pendente',
                effective_date: null
            };
            isEditing.value = false;
            showInstallmentForm.value = true;
        };

        const handleEditInstallment = (installment) => {
            currentInstallment.value = { ...installment };
            isEditing.value = true;
            showInstallmentForm.value = true;
        };

        const handleSaveInstallment = async (installment) => {
            // TODO: Add dialog of success or error on save (edit or create)
            try {
                installment.project = project.value.id;
                isEditing.value 
                    ? await updateInstallment(project.value.id, currentInstallment.value.id, installment) 
                    : await createInstallment(project.value.id, installment);

                await fetchInstallments(project.value.id);

                handleCloseInstallmentForm();
            } catch (error) {
                console.error('Erro ao salvar a parcela:', error);
            }
        };

        const handleDeleteInstallment = (installmentId) => {
            // TODO: Add alert to confirm deletion
            // TODO: Add dialog of success or error on deletion
            deleteInstallment(project.value.id, installmentId);            
        };

        const handleCloseInstallmentForm = () => {
            showInstallmentForm.value = false;
            currentInstallment.value = null;
            isEditing.value = false;
        };

        onMounted(async () => {
            // TODO: pick the project.id from a prop comming from project list
            const id = route.params.id;
            try {
                await Promise.all([fetchProject(id), fetchInstallments(id)]);
            } catch (error) {
                console.error('Erro ao carregar o projeto ou as parcelas:', error);
            }
        });

        return {
            project,
            projectLoading,
            installments,
            installmentsLoading,
            formatDate,
            handleBack,
            handleDeleteProject,
            handleAddInstallment,
            handleEditInstallment,
            handleSaveInstallment,
            handleDeleteInstallment,
            handleCloseInstallmentForm,
            showInstallmentForm,
            currentInstallment,
            isEditing
        };
    }
};
</script>

<style scoped>
.project-card {
    max-width: 800px;
    margin: 20px auto;
    border-radius: 8px;
}
</style>
