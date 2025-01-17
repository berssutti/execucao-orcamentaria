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
                :loading="installmentsLoading"
                @add="handleAddInstallment"
                @edit="handleEditInstallment"
                @delete="handleDeleteInstallment"
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
import { ref, onMounted  } from 'vue';
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
        const { project, loading: projectLoading, error: projectError, fetchProject, deleteProject } = useProject();
        const { installments, loading: installmentsLoading, error: installmentsError, fetchInstallments, createInstallment, deleteInstallment } = useInstallments();
        const route = useRoute();
        const router = useRouter();

        const showInstallmentForm = ref(false);
        const currentInstallment = ref(null);
        const isEditing = ref(false);

        const formatDate = (date) => {
            return dateFormatter(date);
        };

        const handleBack = () => {
            router.go(-1);
        };

        const handleDeleteProject = async () => {
            try {
                await deleteProject(project.value.id);
                router.push({ name: 'ProjectList' });
            } catch (error) {
                // Add alert component
                console.error('Erro ao deletar o projeto:', error);
            }
        };

        const handleAddInstallment = () => {
            currentInstallment.value = {};
            isEditing.value = false;
            showInstallmentForm.value = true;
        };

        const handleEditInstallment = (installment) => {
            currentInstallment.value = { ...installment };
            isEditing.value = false;
            showInstallmentForm.value = true;
        };

        handleSaveInstallment = (installment) => {
            if (isEditing.value) {
                const index = installment.value.findIndex((i) => i.id === installment.id);
                if (index !== -1) {
                    installment.value[index] = { ...installment };
                }
            } else {
                installments
            }
        }



        onMounted(async () => {
            const id = route.params.id;
            await Promise.all([
                fetchProject(id),
                fetchInstallments(id)
            ]);
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
            showInstallmentForm,
            currentInstallment,
        };
    },
};
</script>
<styles>

.project-card {
  max-width: 800px;
  margin: 20px auto;
  border-radius: 8px;
}

</styles>