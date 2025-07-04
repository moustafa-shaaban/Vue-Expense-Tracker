<template>
  <div class="relative w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useTransactionsStore } from 'src/stores/transactions'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

// Register chart components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const props = defineProps({
  data: Object,
  options: Object
})

const canvasRef = ref(null)
const chartInstance = ref(null)

const transactionsStore = useTransactionsStore();

// Recreate chart on data or options change
watch(() => [props.data, props.options], () => {
  destroyChart()
  createChart()
}, { deep: true })

onMounted(() => {
  transactionsStore.loadData()
  createChart()
})

onBeforeUnmount(() => {
  destroyChart()
})

function createChart() {
  if (!canvasRef.value) return

  chartInstance.value = new ChartJS(canvasRef.value.getContext('2d'), {
    type: 'pie',
    data: props.data,
    options: {
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold'
          },
          formatter: (value, context) => {
            const label = context.chart.data.labels?.[context.dataIndex] || ''
            return `${label}\n${value}`
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    },
    plugins: [ChartDataLabels]
  })
}

function destroyChart() {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
}

// Expose chart instance for parent to access in export
defineExpose({
  chart: chartInstance
})
</script>

<style scoped>
.relative {
  position: relative;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
