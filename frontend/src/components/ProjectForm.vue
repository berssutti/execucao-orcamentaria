<template>
    <v-container>
      <v-card elevation="2" class="pa-4">
        <v-card-title>
          {{ isEditing ? 'Editar Projeto' : 'Novo Projeto' }}
        </v-card-title>
        <v-divider></v-divider>
  
        <v-card-text>
          <v-form @submit.prevent="saveProject">
  
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="project.name"
                  label="Nome do Projeto"
                  :rules="[rules.required, rules.maxLength(200)]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field 
                  v-model="project.description"
                  label="Descrição"
                  :rules="[rules.required, rules.maxLength(200)]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
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
  
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="project.coordinator"
                  label="Coordenador"
                  :rules="[rules.required, rules.maxLength(100)]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="project.substitute_coordinator"
                  label="Coordenador Substituto"
                  :rules="[rules.required, rules.maxLength(100)]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field 
                  v-model="project.academic_supervisor"
                  label="Supervisor Acadêmico"
                  :rules="[rules.required, rules.maxLength(100)]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="project.total_unb_amount_expected"
                  label="Custos Indiretos UnB"
                  type="number"
                  :rules="[rules.required, rules.positive]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="project.total_fcte_amount_expected"
                  label="Custos Indiretos FCTE"
                  type="number"
                  :rules="[rules.required, rules.positive]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="project.processo_sei"
                  label="Processo SEI"
                  :rules="[rules.required, rules.seiFormat]"
                  placeholder="12345.123456/2024-12"
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
  
            <div v-if="project.status === 'Received'">
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
    
            <v-row>
              <v-col cols="12" class="text-right">
                <v-btn type="submit" color="primary" class="mt-4">Salvar</v-btn>
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
    props: ['id'], // Recebe o ID do projeto se estiver editando
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
          status: 'Processing', // Status padrão
          nota_dotacao: '',
          ptres: '',
          Ugr: '',
          total_unb_amount_expected: '',
          total_fcte_amount_expected: '',
          areas: [],
        },
        areaList: [],
        statusOptions: ['Processing', 'Received'],
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
      validateStatus() {
        if (
          this.project.status === 'Received' &&
          (!this.project.nota_dotacao || !this.project.ptres || !this.project.Ugr)
        ) {
          alert(
            'Para alterar o status para "Received", é necessário preencher os campos Nota de Dotação, PTRES e UGR.'
          );
          this.project.status = 'Processing';
        }
      },
      async saveProject() {
        try {
          if (
            this.project.status === 'Received' &&
            (!this.project.nota_dotacao || !this.project.ptres || !this.project.Ugr)
          ) {
            alert(
              'Para salvar com o status "Received", preencha os campos Nota de Dotação, PTRES e UGR.'
            );
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
  
          this.$router.push(`/projects/${this.isEditing ? this.id : (await response.json()).id}`);
        } catch (error) {
          console.error('Erro:', error);
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
  </style>
  