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

    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Buscar projeto por palavra-chave"
          placeholder="Digite para buscar..."
          clearable
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Filtrar por ano"
          placeholder="Selecione o ano"
          dense
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="project in filteredProjects"
        :key="project.id"
        cols="12"
        md="4"
      >
        <v-card
          class="pa-2"
          @click="viewProjectDetails(project.id)"
          elevation="2"
        >
          <v-card-title>{{ project.name }}</v-card-title>
          <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Coordenador:</strong> {{ project.coordinator }}</p>
            <p><strong>Data de Início:</strong> {{ project.start_date }}</p>
            <p><strong>Data de Término:</strong> {{ project.end_date }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary">Ver Detalhes</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-if="error" justify="center">
      <v-alert type="error">{{ error }}</v-alert>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ProjectList',
  data() {
    return {
      projects: [],
      searchQuery: '',
      selectedYear: new Date().getFullYear(),
      loading: false,
      error: null,
      years: [],
    };
  },
  computed: {
    filteredProjects() {
      return this.projects.filter((project) => {
        const projectYearStart = new Date(project.start_date).getFullYear();
        const projectYearEnd = new Date(project.end_date).getFullYear();
        const isYearInRange =
          (this.selectedYear >= projectYearStart && this.selectedYear <= projectYearEnd);

        const isKeywordMatch = (project.description + project.name + project.coordinator + project.processo_sei)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        return isYearInRange && isKeywordMatch;
      });
    },
  },
created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('http://localhost:8000/api/projects/');
        if (!response.ok) {
          throw new Error('Erro ao carregar projetos');
        }
        const data = await response.json();
        this.projects = data;

        this.years = this.getYearRange();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    goToCreateProject() {
      this.$router.push('/projects/create');
    },
    viewProjectDetails(projectId) {
      this.$router.push(`/projects/${projectId}`);
    },
    getYearRange() {
      const currentYear = new Date().getFullYear();
      let maxEndYear = currentYear;
      let minStartYear = currentYear;

      this.projects.forEach(project => {
        const projectEndYear = new Date(project.end_date).getFullYear();
        const projectStartYear = new Date(project.start_date).getFullYear();
        if (projectEndYear > maxEndYear) {
          maxEndYear = projectEndYear;
        }
        if (projectStartYear < minStartYear) {
          minStartYear = projectStartYear;
        }
      });

      const years = [];
      for (let i = minStartYear; i <= maxEndYear; i++) {
        years.push(i);
      }
      return years;
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 1.8em;
  font-weight: bold;
}
.v-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.v-card:hover {
  transform: scale(1.03);
}
.v-btn {
  margin-top: 10px;
}
</style>
