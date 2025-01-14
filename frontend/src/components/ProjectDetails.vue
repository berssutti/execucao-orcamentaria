<template>
    <v-container>
      <v-card elevation="2" class="pa-4 project-card">
        <v-card-title class="d-flex flex-column">
          <h2 class="mb-2">Detalhes do Projeto</h2>
          <v-divider class="mb-3"></v-divider>
          <v-row align="center" justify="space-between">
            <v-col cols="auto" class="d-flex gap-2">
              <v-btn prepend-icon="mdi-pencil" color="primary" @click="editProject">
                Editar
              </v-btn>
              <v-btn prepend-icon="mdi-delete" color="red" class="ml-2" @click="deleteProject">
                Deletar
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn prepend-icon="mdi-arrow-left" rounded="xl" color="grey" @click="goBack">
                Voltar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-alert v-if="alertMessage" :type="alertType" dismissible>
            {{ alertMessage }}
          </v-alert>

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
          <v-row align="center" justify="space-between">
            <v-col cols="auto" class="d-flex gap-2">
              <v-btn prepend-icon="mdi-plus" color="success" @click="openCreateModal">
                Adicionar Parcela
              </v-btn>
              <v-btn prepend-icon="mdi-arrow-expand" color="primary" @click="openChartModal" class="ml-2">
                Visualizar Gráfico
              </v-btn>            
            </v-col>
          </v-row>
          <v-list v-if="installments.length > 0">
            <v-list-group v-for="(installment, index) in installments" :key="index" v-model:opened="installment.opened">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" @click="toggleInstallmentDetails(index)">
                  <v-list-item-content>
                    <v-list-item-title>
                      Parcela {{ index + 1 }} - Status: {{ installment.status }}  - R$ {{ installment.amount }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn @click="openEditModal(installment)" color="primary" size="small">Editar</v-btn>
                    <v-btn class="ml-2" @click="deleteInstallment(installment.id)" color="red" size="small">Deletar</v-btn>
                  </v-list-item-action>
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
                <span class="headline">{{ isEditing ? 'Editar Parcela' : 'Adicionar Parcela' }}</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="installmentForm" v-model="valid">
                  <v-text-field v-model="installment.amount" label="Valor" :rules="[v => !!v || 'Campo obrigatório']" prefix="R$" type="number" />
                  <v-text-field v-model="installment.estimated_date" label="Data Estimada" :rules="[v => !!v || 'Campo obrigatório']" type="date" />
                  <v-text-field v-model="installment.observation" label="Observação" />
                  <v-text-field v-model="installment.destination" label="Destino" />

                  <v-select
                    v-model="installment.status"
                    :items="statusOptions"
                    label="Status"
                    :rules="[v => !!v || 'Campo obrigatório']"
                  />

                  <v-text-field
                    v-if="installment.status === 'Quitada'"
                    v-model="installment.effective_date"
                    label="Data Efetiva"
                    :rules="[v => !!v || 'Campo obrigatório']"
                    type="date"
                  />
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn color="grey" @click="installmentModal = false">Cancelar</v-btn>
                <v-btn color="primary" :disabled="!valid" @click="saveInstallment">Salvar</v-btn>
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
        areas: [],
        alertMessage: '',
        alertType: '',

      },
      installments: [],
      installmentModal: false,
      isEditing: false,
      valid: false,
      installment: {
        amount: null,
        estimated_date: null,
        effective_date: null,
        observation: '',
        destination: '',
        status: '',
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
    openEditModal(installment) {
      this.isEditing = true;
      this.installment = { ...installment };
      this.installmentModal = true;
    },
    openCreateModal() {
      this.isEditing = false;
      this.installment = {
        amount: '',
        estimated_date: '',
        observation: '',
        destination: '',
        status: 'Pendente',
        effective_date: ''
      };
      this.installmentModal = true;
    },
    openChartModal() {
      return
    },
    async saveInstallment() {
      const projectId = this.$route.params.id;
      const method = this.isEditing ? 'PUT' : 'POST';
      const url = this.isEditing
        ? `http://localhost:8000/api/projects/${projectId}/installments/${this.installment.id}/`
        : `http://localhost:8000/api/projects/${projectId}/installments/`;

      if (this.installment.status === 'Quitada' || this.installment.status === 'Atrasada') {
        this.installment.effective_date = null
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project: projectId,
            amount: this.installment.amount,
            estimated_date: this.installment.estimated_date,
            effective_date: this.installment.effective_date || null,
            observation: this.installment.observation,
            destination: this.installment.destination,
            status: this.installment.status,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (this.isEditing) {
            const index = this.installments.findIndex(inst => inst.id === data.id);
            this.installments.splice(index, 1, data);
          } else {
            this.installments.push(data);
          }
          this.installmentModal = false;
          
          this.alertMessage = 'Parcela salva com sucesso!';
          this.alertType = 'success';
        } else {
          this.alertMessage = 'Erro ao salvar parcela';
          this.alertType = 'error';
        }
      } catch (error) {
        console.error('Erro ao salvar parcela:', error);
        this.alertMessage = 'Erro ao salvar parcela';
        this.alertType = 'error';
      }
    },
    async deleteInstallment(installmentId) {
      const projectId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/installments/${installmentId}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.installments = this.installments.filter(inst => inst.id !== installmentId);
          
          this.alertMessage = 'Parcela deletada com sucesso';
          this.alertType = 'success';
        } else {
          this.alertMessage = 'Erro ao deletar parcela';
          this.alertType = 'error';
        }
      } catch (error) {
        console.error('Erro ao deletar parcela:', error);
        this.alertMessage = 'Erro ao deletar parcela';
        this.alertType = 'error';
      }
    },
    async deleteProject() {
      const projectId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.$router.push('/projects');
          this.alertMessage = 'Projeto deletado com sucesso!';
          this.alertType = 'success';
        } else {
          this.alertMessage = 'Erro ao deletar projeto';
          this.alertType = 'error';
        }
      } catch (error) {
        console.error('Erro ao deletar projeto:', error);
        this.alertMessage = 'Erro ao deletar projeto';
        this.alertType = 'error';
      }
    },
    editProject() {
      this.$router.push(`/projects/edit/${this.$route.params.id}`);
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    },
    goBack() {
      this.$router.push('/projects');
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

  