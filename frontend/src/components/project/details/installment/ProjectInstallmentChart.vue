<template>
    <v-dialog max-width="800px">
      <v-card  class="rounded-lg">
        <v-card-title class="d-flex justify-end">
          <v-btn icon @click="emitClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <stacked-bar-chart v-if="installments.length > 0" :installments="installments" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import StackedBarChart from '@/components/shared/charts/BarChart.vue';
  
  export default {
    name: 'ChartModal',

    components: {
      StackedBarChart,
    },

    props: {
      installments: {
        type: Array,
        required: true,
      },
    },

    setup(props, { emit }) {
  
      const emitClose = () => {
        emit('close', false)
      };
  
      return {
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
  