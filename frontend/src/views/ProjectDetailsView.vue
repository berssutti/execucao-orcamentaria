<template>
    <v-container>
        <v-card elevation="2" class="pa-4 project-card">
            <ProjectHeader
                :project="project"
                @edit="handleEditProject"
                @delete="handleDeleteProject"
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
                @save="handleSaveInstallment"
            />
        </v-card>
    </v-container>
</template>

<script>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
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
        const { project, loading: projectLoading, error: projectError, fetchProject } = useProject();
        const { installments, loading: installmentsLoading, error: installmentsError, fetchInstallments } = useInstallments();
        const route = useRoute();

        const formatDate = (date) => {
            return dateFormatter(date);
        };

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
            formatDate
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