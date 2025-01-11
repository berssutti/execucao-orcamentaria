<template>
    <v-container>
      <v-card elevation="2" class="pa-4 project-card">
        <v-card-title>
          <h2>Detalhes do Projeto</h2>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editProject">Editar</v-btn>
        </v-card-title>
  
        <v-card-text>
          <h3 class="section-title">Informações Gerais</h3>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Nome:</strong> {{ project.name }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Descrição:</strong> {{ project.description }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Data de Início:</strong> {{ formatDate(project.start_date) }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Data de Término:</strong> {{ formatDate(project.end_date) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Processo SEI:</strong> {{ project.processo_sei }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Status:</strong> {{ project.status || 'N/A' }}
            </v-col>
          </v-row>
  
          <h3 class="section-title">Gestão</h3>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Coordenador:</strong> {{ project.coordinator }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Coordenador Substituto:</strong> {{ project.substitute_coordinator }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Supervisor Acadêmico:</strong> {{ project.academic_supervisor }}
            </v-col>
          </v-row>
  
          <template v-if="project.status === 'Recebido'">
            <h3 class="section-title">Célula Orçamentária</h3>
            <v-row>
              <v-col cols="12" md="4">
                <strong>Nota de Dotação:</strong> {{ project.nota_dotacao }}
              </v-col>
              <v-col cols="12" md="4">
                <strong>PTRES:</strong> {{ project.ptres }}
              </v-col>
              <v-col cols="12" md="4">
                <strong>UGR:</strong> {{ project.ugr }}
              </v-col>
            </v-row>
          </template>
  
          <h3 class="section-title">Custos</h3>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Custos Indiretos UnB:</strong> R$ {{ project.total_unb_amount_expected }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Custos Indiretos FCTE:</strong> R$ {{ project.total_fcte_amount_expected }}
            </v-col>
          </v-row>
  
          <h3 class="section-title">Áreas</h3>
          <v-row>
            <v-col cols="12">
              <v-chip
                v-for="(area, index) in projectAreas"
                :key="index"
                class="ma-1"
                color="primary"
              >
                {{ area.name }} - {{ area.percentage }}%
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
</template>
  
<script>
export default {
  name: 'ProjectDetails',
  data() {
    return {
      project: {
        name: '',
        description: '',
        start_date: null,
        end_date: null,
        total_unb_amount_expected: null,
        total_fcte_amount_expected: null,
        coordinator: '',
        substitute_coordinator: '',
        academic_supervisor: '',
        processo_sei: '',
        status: null,
        nota_dotacao: '',
        ptres: '',
        ugr: '',
        areas: []
      },
      areaList: [],
      projectAreas: [],
    };
  },
  async created() {
    await this.fetchAreas();
    await this.fetchProjectDetails();
  },
  methods: {
    async fetchProjectDetails() {
      const projectId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do projeto');
        const projectData = await response.json();

        this.project = { ...projectData };

        this.projectAreas = projectData.areas.map((area) => {
          const matchedArea = this.areaList.find((a) => a.name === area.area_name);
          return {
            name: matchedArea ? matchedArea.name : area.area_name,
            percentage: parseFloat(area.percentage),
          };
        });
      } catch (error) {
        console.error('Erro ao carregar os detalhes do projeto:', error);
      }
    },
    async fetchAreas() {
      try {
        const response = await fetch('http://localhost:8000/api/areas/');
        if (!response.ok) throw new Error('Erro ao buscar lista de áreas');
        this.areaList = await response.json();
      } catch (error) {
        console.error('Erro ao carregar a lista de áreas:', error);
      }
    },
    editProject() {
      this.$router.push(`/projects/edit/${this.$route.params.id}`);
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('pt-BR');
    },
  },
};
</script>
  
<style scoped>
    .project-card {
        max-width: 800px;
        margin: 20px auto;
        border-radius: 8px;
    }

    .section-title {
        font-size: 1.1em;
        font-weight: bold;
        margin-top: 16px;
        margin-bottom: 8px;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 4px;
    }

    .v-chip {
        margin: 4px;
    }

    .v-row {
        margin-bottom: 8px;
    }
</style>
  