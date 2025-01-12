<template>
    <v-container>
      <v-card elevation="2" class="pa-4 project-card">
        <v-card-title>
          <h2>Detalhes do Projeto</h2>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editProject">Editar</v-btn>
          <v-btn class="btn-installment" color="success" @click="openInstallmentModal">Adicionar Parcela</v-btn>
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

          <h3 class="section-title">Parcelas</h3>
          <v-list v-if="installments.length > 0">
            <v-list-group v-for="(installment, index) in installments" :key="index" v-model:opened="installment.opened">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" @click="toggleInstallmentDetails(index)">
                  <v-list-item-content>
                    <v-list-item-title>
                      Parcela {{ index + 1 }} - Status: {{ installment.status }}  - R$ {{ installment.amount }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <v-list-item v-if="expandedIndex === index">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    <strong>Data Estimada:</strong> {{ formatDate(installment.estimated_date) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong>Observação:</strong> {{ installment.observation || 'N/A' }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong>Destino:</strong> {{ installment.destination || 'N/A' }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong>Data Efetiva:</strong> {{ formatDate(installment.effective_date) || 'N/A' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
          <v-row v-else>
          <v-col cols="12">
            <v-alert type="info" :value="true">
              Nenhuma parcela cadastrada.
            </v-alert>
          </v-col>
        </v-row>

          <v-dialog v-model="installmentModal" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Adicionar Parcela</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="installmentForm" v-model="valid">
                  <v-text-field v-model="newInstallment.amount" label="Valor" :rules="[v => !!v || 'Campo obrigatório']" type="number" />
                  <v-text-field v-model="newInstallment.estimated_date" label="Data Estimada" :rules="[v => !!v || 'Campo obrigatório']" type="date" />
                  <v-text-field v-model="newInstallment.observation" label="Observação" />
                  <v-text-field v-model="newInstallment.destination" label="Destino" />
                  
                  <v-select
                    v-model="newInstallment.status"
                    :items="statusOptions"
                    label="Status"
                    :rules="[v => !!v || 'Campo obrigatório']"
                  />

                  <v-text-field
                    v-if="newInstallment.status === 'Quitada'"
                    v-model="newInstallment.effective_date"
                    label="Data Efetiva"
                    type="date"
                  />
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue" @click="installmentModal = false">Cancelar</v-btn>
                <v-btn color="green" :disabled="!valid" @click="addInstallment">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
      installments: [],
      installmentModal: false,
      valid: false,
      newInstallment: {
        amount: null,
        estimated_date: null,
        effective_date: null,
        observation: '',
        destination: '',
        status: 'Pendente',
      },
      statusOptions: ['Atrasada', 'Quitada', 'Pendente'],
    };
  },
  async created() {
    await this.fetchAreas();
    await this.fetchProjectDetails();
    await this.fetchInstallments();
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
    async fetchInstallments() {
      const projectId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/installments/`);
        if (!response.ok) throw new Error('Erro ao buscar parcelas do projeto');
        this.installments = await response.json();
      } catch (error) {
        console.error('Erro ao carregar as parcelas:', error);
      }
    },
    toggleInstallmentDetails(index) {
      this.expandedIndex = index;
    },
    openInstallmentModal() {
      this.installmentModal = true;
    },
    async addInstallment() {
      const projectId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/installments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project: projectId,
            amount: this.newInstallment.amount,
            estimated_date: this.newInstallment.estimated_date,
            effective_date: this.newInstallment.effective_date || null,
            observation: this.newInstallment.observation,
            destination: this.newInstallment.destination,
            status: this.newInstallment.status,
          }),
        });

        if (response.ok) {
          this.installmentModal = false;
          this.newInstallment = {
            amount: null,
            estimated_date: null,
            effective_date: null,
            observation: '',
            destination: '',
            status: 'Pendente',
          };
          await this.fetchInstallments();
        } else {
          alert('Erro ao adicionar parcela');
        }
      } catch (error) {
        console.error('Erro ao adicionar parcela:', error);
      }
    },
    editProject() {
      this.$router.push(`/projects/edit/${this.$route.params.id}`);
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
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

.btn-installment {
  margin-left: 10px;
}

.v-expansion-panel-header {
  font-weight: bold;
  background-color: #f5f5f5;
}

.v-expansion-panel-content {
  background-color: #f9f9f9;
  padding: 16px;
}

.v-expansion-panel--active .v-expansion-panel-header {
  background-color: #eeeeee;
}

</style>

  