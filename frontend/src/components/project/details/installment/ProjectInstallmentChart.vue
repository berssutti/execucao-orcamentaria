<template>
    <v-dialog v-model="internalChartModal" max-width="800px">
      <v-card  class="rounded-lg">
        <v-card-title class="d-flex justify-end">
          <v-btn icon @click="emitClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <stacked-bar-chart v-if="installments.length > 0" :installments="installments" />
          <div v-else class="text-center">Nenhum dado disponível</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import StackedBarChart from '@/components/shared/charts/BarChart.vue';
  
  export default {
    name: 'ChartModal',
  
    components: {
      StackedBarChart,
    },
  
    props: {
      chartModal: {
        type: Boolean,
        required: true,
      },
      installments: {
        type: Array,
        required: true,
      },
    },
  
    emits: ['update:chartModal'],
  
    setup(props, { emit }) {
      const internalChartModal = ref(props.chartModal);
  
      watch(
        () => props.chartModal,
        (newVal) => {
          internalChartModal.value = newVal;
        }
      );
  
      watch(internalChartModal, (newVal) => {
        emit('update:chartModal', newVal);
      });
  
      const emitClose = () => {
        emit('close', false)
      };
  
      return {
        internalChartModal,
        emitClose,
      };
    },
  };
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
    font-size: 16px;
    color: gray;
  }
  </style>
  