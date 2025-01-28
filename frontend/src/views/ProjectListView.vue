<template>
  <v-container>
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col>
        <h1>Lista de Projetos</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="goToCreateProject">Cadastrar Novo Projeto</v-btn>
      </v-col>
    </v-row>

    <ProjectFilter
      :years="years"
      :initial-filters="initialFilters"
      @update:filters="updateFilters"
    />

    <template v-if="!loading">
      <v-row v-if="filteredProjects.length > 0">
        <v-col
          v-for="project in paginatedProjects"
          :key="project.id"
          cols="12"
          md="4"
        >
          <ProjectCard
            :project="project"
            @click="viewProjectDetails(project.id)"
          />
        </v-col>
      </v-row>
      
      <v-row v-else justify="center">
        <v-col cols="12" class="text-center">
          <p>Nenhum projeto encontrado.</p>
        </v-col>
      </v-row>

      <v-row v-if="filteredProjects.length > 0" justify="center" class="mt-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          total-visible="5"
        ></v-pagination>
      </v-row>
    </template>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-if="error" justify="center">
      <v-alert type="error">{{ error }}</v-alert>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useProject } from '@/composables/useProject';
import ProjectCard from '@/components/project/list/ProjectCard.vue';
import ProjectFilter from '@/components/project/list/ProjectFilter.vue';

const router = useRouter();
const { project: projects, loading, error, fetchProject } = useProject();

const initialFilters = ref({
  searchQuery: '',
  selectedYear: new Date().getFullYear(),
  currentPage: 1
});

const savedState = sessionStorage.getItem('projectsListState');
if (savedState) {
  const state = JSON.parse(savedState);
  initialFilters.value = {
    searchQuery: state.searchQuery || '',
    selectedYear: Number(state.selectedYear) || new Date().getFullYear(),
    currentPage: Number(state.currentPage) || 1
  };
}

const searchQuery = ref(initialFilters.value.searchQuery);
const selectedYear = ref(initialFilters.value.selectedYear);
const years = ref([]);
const currentPage = ref(initialFilters.value.currentPage);
const itemsPerPage = 6;

const filteredProjects = computed(() => {
  if (!projects.value) return [];

  return projects.value.filter((project) => {
    const projectYearStart = new Date(project.start_date).getFullYear();
    const projectYearEnd = new Date(project.end_date).getFullYear();
    const isYearInRange =
      (Number(selectedYear.value) >= projectYearStart && Number(selectedYear.value) <= projectYearEnd);
    
    const isKeywordMatch = (project.description + project.name + project.coordinator + project.processo_sei)
      .toLowerCase()
      .includes((searchQuery.value || '').toLowerCase());
      
    return isYearInRange && isKeywordMatch;
  });
});

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProjects.value.length / itemsPerPage));
});

const fetchProjects = async () => {
  try {
    await fetchProject();
    years.value = getYearRange();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const getYearRange = () => {
  if (!projects.value || projects.value.length === 0) 
    return [new Date().getFullYear()];

  const currentYear = new Date().getFullYear();
  let maxEndYear = currentYear;
  let minStartYear = currentYear;

  projects.value.forEach(project => {
    const projectEndDate = new Date(project.end_date + 'T00:00:00');
    const projectStartDate = new Date(project.start_date + 'T00:00:00');

    const projectEndYear = projectEndDate.getFullYear();
    const projectStartYear = projectStartDate.getFullYear();

    maxEndYear = Math.max(maxEndYear, projectEndYear);
    minStartYear = Math.min(minStartYear, projectStartYear);
  });

  return Array.from({ length: maxEndYear - minStartYear + 1 }, (_, i) => minStartYear + i);
};

const goToCreateProject = () => {
  router.push({ name: 'ProjectCreate'}); 
};

const viewProjectDetails = (projectId) => {
  const state = {
    searchQuery: searchQuery.value,
    selectedYear: selectedYear.value,
    currentPage: currentPage.value,
  };
  sessionStorage.setItem('projectsListState', JSON.stringify(state));
  router.push({ name: 'ProjectDetails', params: { id: projectId } });
};

const updateFilters = (filters) => {
  searchQuery.value = filters.searchQuery;
  selectedYear.value = filters.selectedYear;
  currentPage.value = 1;

  const state = {
    searchQuery: filters.searchQuery,
    selectedYear: filters.selectedYear,
    currentPage: currentPage.value,
  };
  sessionStorage.setItem('projectsListState', JSON.stringify(state));
};

onMounted(fetchProjects);
</script>

<style scoped>
h1 {
  font-size: 1.8em;
  font-weight: bold;
}
.v-btn {
  margin-top: 10px;
}
</style>