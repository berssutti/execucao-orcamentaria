<template>
  <div>
    <bar-chart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: "StackedBarChart",
  components: { BarChart: Bar },
  props: {
    installments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartData: null,
      chartOptions: null,
      areaColors: {
        'Engenharia de Software': '#4CAF50',
        'Engenharia Eletrônica': '#2196F3',
      }
    };
  },
  watch: {
    installments: {
      handler() {
        this.prepareChartData();
      },
      deep: true
    }
  },
  created() {
    this.prepareChartData();
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    },
    prepareChartData() {
      if (!this.installments || this.installments.length === 0) {
        console.error("Nenhuma parcela foi encontrada.");
        return;
      }

      const sortedInstallments = [...this.installments].sort((a, b) => 
        new Date(a.estimated_date) - new Date(b.estimated_date)
      );

      const labels = [];
      const areaNames = new Set();
      const areaDataMap = {};

      sortedInstallments.forEach((installment) => {
        const monthYear = new Date(installment.estimated_date).toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });
        
        if (!labels.includes(monthYear)) {
          labels.push(monthYear);
        }

        Object.entries(installment.area_values).forEach(([area, value]) => {
          areaNames.add(area);
          if (!areaDataMap[area]) {
            areaDataMap[area] = new Array(labels.length).fill(0);
          }
          const monthIndex = labels.indexOf(monthYear);
          areaDataMap[area][monthIndex] = (areaDataMap[area][monthIndex] || 0) + value;
        });
      });

      const datasets = Array.from(areaNames).map((area) => ({
        label: area,
        data: areaDataMap[area],
        backgroundColor: this.areaColors[area] || this.getRandomColor(),
      }));

      this.chartData = {
        labels,
        datasets,
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Distribuição de Parcelas por Áreas",
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${this.formatCurrency(value)}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Mês',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor (R$)',
              font: {
                weight: 'bold'
              }
            },
            ticks: {
              callback: (value) => this.formatCurrency(value)
            }
          }
        },
      };
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
});
</script>

<style scoped>
div {
  height: 400px;
}
</style>