<template>
  <div>
    <bar-chart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "vue-chartjs";

// Registrar os componentes necessários do Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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
    };
  },
  created() {
    this.prepareChartData();
  },
  methods: {
    prepareChartData() {
      console.log("Dados das parcelas(Chart Teste):", this.installments); // Verifique a estrutura dos dados
      if (!this.installments || this.installments.length === 0) {
        console.error("Nenhuma parcela foi encontrada.");
        return;
      }

      const labels = [];
      const areaNames = new Set();
      const areaDataMap = {};

      this.installments.forEach((installment) => {
        const monthYear = new Date(installment.estimated_date).toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });
        labels.push(monthYear);
        console.log(monthYear)

        Object.entries(installment.area_values).forEach(([area, value]) => {
          areaNames.add(area);
          if (!areaDataMap[area]) {
            areaDataMap[area] = [];
          }
          areaDataMap[area].push(value);
        });
        console.log(areaNames)
      });

      Object.values(areaDataMap).forEach((areaData) => {
        while (areaData.length < labels.length) {
          areaData.push(0);
        }
      });

      console.log(areaDataMap)

      const datasets = Array.from(areaNames).map((area) => ({
        label: area,
        data: areaDataMap[area],
        backgroundColor: this.getRandomColor(),
      }));

      console.log(datasets)
      console.log(labels)
      this.chartData = {
        labels,
        datasets,
      };

      this.chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Distribuição de Parcelas por Áreas",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
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