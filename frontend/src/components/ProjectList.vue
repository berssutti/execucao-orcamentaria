<template>
    <v-container>
      <!-- Título e Botão de Cadastro -->
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col>
          <h1>Lista de Projetos</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="goToCreateProject">Cadastrar Novo Projeto</v-btn>
        </v-col>
      </v-row>
  
      <!-- Grid de Cards de Projetos -->
      <v-row>
        <v-col v-for="project in projects" :key="project.id" cols="12" md="4">
          <v-card class="pa-2" @click="viewProjectDetails(project.id)" elevation="2">
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.name }}</v-card-subtitle>
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
  
      <!-- Mensagem de Carregamento -->
      <v-row v-if="loading" justify="center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-row>
  
      <!-- Mensagem de Erro -->
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
        loading: false,
        error: null,
      };
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
  