<template>
  <v-container>
    <v-card elevation="2" class="pa-4">
      <v-card-title class="text-h5 font-weight-bold">
        {{ isEditing ? 'Editar Projeto' : 'Novo Projeto' }}
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-form @submit.prevent="saveProject">

          <h4 class="mb-3">Detalhes Gerais</h4>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.name"
                label="Nome do Projeto"
                :rules="[rules.required, rules.maxLength(200)]"
                placeholder="Digite o nome do projeto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.description"
                label="Descrição"
                :rules="[rules.required, rules.maxLength(200)]"
                placeholder="Descreva brevemente o projeto"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-3">Período</h4>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.start_date"
                label="Data de Início"
                type="date"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.end_date"
                label="Data de Término"
                type="date"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-3">Gerência</h4>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="project.coordinator"
                label="Coordenador"
                :rules="[rules.required, rules.maxLength(100)]"
                placeholder="Nome do coordenador"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="project.substitute_coordinator"
                label="Coordenador Substituto"
                :rules="[rules.required, rules.maxLength(100)]"
                placeholder="Nome do coordenador substituto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="project.academic_supervisor"
                label="Supervisor Acadêmico"
                :rules="[rules.required, rules.maxLength(100)]"
                placeholder="Nome do supervisor acadêmico"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-3">Orçamento</h4>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.total_unb_amount_expected"
                label="Custos Indiretos UnB"
                type="number"
                :rules="[rules.required, rules.positive]"
                placeholder="Valor esperado para UnB"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.total_fcte_amount_expected"
                label="Custos Indiretos FCTE"
                type="number"
                :rules="[rules.required, rules.positive]"
                placeholder="Valor esperado para FCTE"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-3">Status</h4>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="project.processo_sei"
                label="Processo SEI"
                placeholder="12345.123456/2024-12"
                :rules="[rules.required, rules.seiFormat]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="project.status"
                :items="statusOptions"
                label="Status"
                @change="validateStatus"
              ></v-select>
            </v-col>
          </v-row>

          <div v-if="project.status === 'Recebido'">
            <h4 class="mb-3">Célula Orçamentária</h4>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="project.nota_dotacao"
                  label="Nota de Dotação"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="project.ptres"
                  label="PTRES"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="project.Ugr"
                  label="UGR"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <h4 class="mb-3">Áreas do Projeto</h4>
          <v-row v-for="(area, index) in project.areas" :key="index">
            <v-col cols="6">
              <v-select
                v-model="area.id"
                :items="filteredAreaList(index)"
                item-title="name"
                item-value="id"
                label="Área"
                :rules="[rules.required]"
                required
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="area.percentage"
                label="Porcentagem"
                type="number"
                :rules="[rules.required, rules.percentage]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="text-center">
              <v-btn icon color="red" @click="removeArea(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-btn color="secondary" @click="addArea" class="mb-4">+ Adicionar Área</v-btn>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12" class="text-right">
              <v-btn color="secondary" class="mr-2" @click="$router.back()">Cancelar</v-btn>
              <v-btn type="submit" color="primary">Salvar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'ProjectForm',
    props: ['id'],
    data() {
      return {
        project: {
          name: '',
          description: '',
          start_date: null,
          end_date: null,
          coordinator: '',
          substitute_coordinator: '',
          academic_supervisor: '',
          processo_sei: '',
          status: 'Processando',
          nota_dotacao: '',
          ptres: '',
          Ugr: '',
          total_unb_amount_expected: '',
          total_fcte_amount_expected: '',
          areas: [],
        },
        selectedArea: null,
        areaList: [],
        statusOptions: ['Processando', 'Recebido'],
        isEditing: false,
        rules: {
          required: (value) => !!value || 'Campo obrigatório.',
          maxLength: (max) => (value) =>
            value.length <= max || `Máximo de ${max} caracteres.`,
          positive: (value) =>
            parseFloat(value) > 0 || 'Deve ser um número positivo.',
          seiFormat: (value) =>
            /^\d{5}\.\d{6}\/\d{4}-\d{2}$/.test(value) || 
            'Formato inválido. Use: ddddd.dddddd/YYYY-MM',
          percentage: (value) =>
            value >= 0 && value <= 100 || 'A porcentagem deve estar entre 0 e 100.',
        }
      };
    },
    created() {
      this.fetchAreas();
      if (this.id) {
        this.isEditing = true;
        this.fetchProjectDetails();
      }
    },
    methods: {
      async fetchProjectDetails() {
        try {
          const response = await fetch(`http://localhost:8000/api/projects/${this.id}/`);
          if (!response.ok) throw new Error('Erro ao buscar detalhes do projeto');
          this.project = await response.json();
        } catch (error) {
          console.error('Erro:', error);
        }
      },
      async fetchAreas() {
        try {
          const response = await fetch('http://localhost:8000/api/areas/');
          if (!response.ok) throw new Error('Erro ao buscar lista de áreas');
          this.areaList = await response.json();
        } catch (error) {
          console.error('Erro:', error);
        }
      },
      filteredAreaList(index) {
        const selectedAreas = this.project.areas
          .map((a, i) => (i !== index ? a.id : null))
          .filter((id) => id);
        return this.areaList.filter((area) => !selectedAreas.includes(area.id));
      },
      addArea() {
        this.project.areas.push({ name: '', percentage: 0 });
      },
      removeArea(index) {
        this.project.areas.splice(index, 1);
      },
      validadePercentage() {
        const totalPercentage = this.project.areas.reduce((sum, area) => sum + (Number(area.percentage) || 0), 0);
        return totalPercentage === 100;
      },
      validateStatus() {
        if (
          this.project.status === 'Recebido' &&
          (!this.project.nota_dotacao || !this.project.ptres || !this.project.Ugr)
        ) {
          alert(
            'Para alterar o status para "Recebido", é necessário preencher os campos Nota de Dotação, PTRES e UGR.'
          );
          this.project.status = 'Processando';
        }
      },
      async saveProject() {
        try {
          if (
            this.project.status === 'Recebido' &&
            (!this.project.nota_dotacao || !this.project.ptres || !this.project.Ugr)
          ) {
            alert(
              'Para salvar com o status "Recebido", preencha os campos Nota de Dotação, PTRES e UGR.'
            );
            return;
          }
          if (!this.validadePercentage()) {
            alert('A soma das porcentagens das áreas deve ser 100%');
            return;
          }
  
          const url = this.isEditing
            ? `http://localhost:8000/api/projects/${this.id}/`
            : 'http://localhost:8000/api/projects/';
          const method = this.isEditing ? 'PUT' : 'POST';
  
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.project),
          });
  
          if (!response.ok) throw new Error('Erro ao salvar projeto');
          
          const projectData = await response.json();

          await this.saveAreas(projectData.id);

          this.$router.push(`/projects/${this.isEditing ? this.id : projectData.id}`);
        } catch (error) {
          console.error('Erro:', error);
        }
      },
      async saveAreas(projectId) {
        try {
          for (const area of this.project.areas) {
            if (area.id && area.percentage >= 0) {
              const response = await fetch(`http://localhost:8000/api/projects/${projectId}/areas/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  project: projectId,
                  area: area.id,
                  percentage: area.percentage,
                }),
              });
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao salvar área:', errorData);
                throw new Error('Erro ao salvar área');
              }
            } else {
              console.error('Área ou porcentagem inválida:', area);
            }
          }
        } catch (error) {
          console.error('Erro ao salvar áreas:', error);
          alert('Erro ao salvar áreas. Verifique os dados e tente novamente.');
        }
      },
    },
  };
</script>
  
<style scoped>
  .v-card {
    max-width: 900px;
    margin: auto;
  }
  h4 {
    font-weight: bold;
    margin-top: 16px;
  }
  .v-btn {
    text-transform: none;
  }
</style>
  