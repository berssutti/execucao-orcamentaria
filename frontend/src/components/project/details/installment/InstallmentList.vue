<template>
    <div>
      <h3 class="section-title">Parcelas</h3>
      <v-row align="center" justify="space-between">
        <v-col cols="auto" class="d-flex gap-2">
          <v-btn prepend-icon="mdi-plus" color="success" @click="$emit('create')">
            Adicionar Parcela
          </v-btn>
          <v-btn prepend-icon="mdi-chart-bar-stacked" color="primary" @click="$emit('view-chart')" class="ml-2">
            Visualizar Gráfico
          </v-btn>            
        </v-col>
      </v-row>
  
      <v-list v-if="installments.length > 0">
        <v-list-group v-for="(installment, index) in installments" :key="index" v-model:opened="installment.opened">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" @click="$emit('toggle-details', index)">
              <v-list-item-content>
                <v-list-item-title>
                  Parcela {{ index + 1 }} - Status: {{ installment.status }}  - R$ {{ installment.amount }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click.stop="$emit('edit', installment)" color="primary" size="small">Editar</v-btn>
                <v-btn class="ml-2" @click.stop="$emit('delete', installment.id)" color="red" size="small">Deletar</v-btn>
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
    </div>
  </template>
  
  <script>
import { dateFormatter } from '@/utils/dateFormatter';

  export default {
    name: 'InstallmentList',
    props: {
      installments: {
        type: Array,
        required: true
      },
      expandedIndex: {
        type: Number,
        default: null
      }
    },
    methods: {
      formatDate(date) {
        return dateFormatter(date);
      },
    },
    emits: ['create', 'edit', 'delete', 'view-chart', 'toggle-details']
  };
  </script>
  
  <style scoped>
  .section-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-top: 16px;
    margin-bottom: 8px;
    border-bottom: 2px solid #eeeeee;
    padding-bottom: 4px;
  }
  </style>