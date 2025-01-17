<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditing ? 'Editar Parcela' : 'Adicionar Parcela' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field 
              v-model="installment.amount" 
              label="Valor" 
              :rules="[v => !!v || 'Campo obrigatório']" 
              prefix="R$" 
              type="number" 
            />
            <v-text-field 
              v-model="installment.estimated_date" 
              label="Data Estimada" 
              :rules="[v => !!v || 'Campo obrigatório']" 
              type="date" 
            />
            <v-text-field 
              v-model="installment.observation" 
              label="Observação" 
            />
            <v-text-field 
              v-model="installment.destination" 
              label="Destino" 
            />
  
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
          <v-btn color="grey" @click="$emit('close')">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="$emit('save')">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'InstallmentForm',
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      installment: {
        type: Object,
        required: true
      },
      isEditing: {
        type: Boolean,
        required: true
      },
      statusOptions: {
        type: Array,
        required: true
      },
      valid: {
        type: Boolean,
        required: true
      }
    },
    emits: ['update:modelValue', 'save', 'close'],
    data() {
      return {
        valid: false,
      }
    },
    methods: {
      cancel() {
        this.$refs.form.resetValidation();
        this.$emit('close');
      },
      save() {
        if (this.valid) {
          this.$emit('save', this.installment);
        }
      },
    },
  };
  </script>