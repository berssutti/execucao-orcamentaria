<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'BarChart',
    props: {
      installments: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
        
        const statusColors = {
          'Pendente': '#FFA500',
          'Quitada': '#4CAF50',
          'Atrasada': '#F44336'
        };
  
        const data = {
          labels: this.installments.map((_, index) => `Parcela ${index + 1}`),
          datasets: Object.keys(statusColors).map(status => ({
            label: status,
            data: this.installments.map(inst => inst.status === status ? inst.amount : 0),
            backgroundColor: statusColors[status]
          }))
        };
  
        new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true,
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
  }
  </style>