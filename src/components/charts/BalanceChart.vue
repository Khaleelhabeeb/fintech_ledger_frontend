<template>
  <div class="balance-chart">
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="flex items-center justify-center h-64 text-gray-500">
      No balance history available
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js'
import type { Account } from '@/types/account.types'
import { formatCurrency, formatDateTime } from '@/utils/format'
import type { Currency } from '@/types/common.types'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  versions: Account[]
  currency?: Currency
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'USD'
})

const chartData = computed(() => {
  if (!props.versions || props.versions.length === 0) {
    return null
  }

  // Sort versions by changed_on ascending for proper chart display
  const sortedVersions = [...props.versions].sort(
    (a, b) => new Date(a.changed_on).getTime() - new Date(b.changed_on).getTime()
  )

  return {
    labels: sortedVersions.map(v => formatDateTime(v.changed_on)),
    datasets: [
      {
        label: 'Balance',
        data: sortedVersions.map(v => v.balance),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.y
          return `Balance: ${formatCurrency(value ?? 0, props.currency)}`
        }
      },
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#3B82F6',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        callback: (value) => {
          return formatCurrency(Number(value), props.currency)
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}))
</script>

<style scoped>
.balance-chart {
  width: 100%;
  height: 300px;
}

@media (min-width: 768px) {
  .balance-chart {
    height: 350px;
  }
}

@media (min-width: 1024px) {
  .balance-chart {
    height: 400px;
  }
}
</style>
