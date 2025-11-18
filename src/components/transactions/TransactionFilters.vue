<template>
  <div class="bg-white rounded-lg shadow-card p-3 sm:p-4 mb-4 sm:mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <!-- Transaction Type Filter -->
      <div>
        <label for="transaction-type" class="block text-sm font-medium text-gray-700 mb-1">
          Transaction Type
        </label>
        <select
          id="transaction-type"
          v-model="localFilters.type"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-150"
          @change="handleFilterChange"
        >
          <option :value="undefined">All Transactions</option>
          <option :value="TransactionType.DEPOSIT">Deposits</option>
          <option :value="TransactionType.WITHDRAW">Withdrawals</option>
        </select>
      </div>

      <!-- Start Date Filter -->
      <div>
        <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          id="start-date"
          v-model="localFilters.startDate"
          type="date"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-150"
          @change="handleFilterChange"
        />
      </div>

      <!-- End Date Filter -->
      <div>
        <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          id="end-date"
          v-model="localFilters.endDate"
          type="date"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-150"
          @change="handleFilterChange"
        />
      </div>
    </div>

    <!-- Filter Actions -->
    <div class="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
      <AppButton
        variant="secondary"
        size="sm"
        @click="handleClearFilters"
        class="w-full sm:w-auto"
      >
        Clear Filters
      </AppButton>
      <AppButton
        variant="primary"
        size="sm"
        @click="handleApplyFilters"
        class="w-full sm:w-auto"
      >
        Apply Filters
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import { TransactionType } from '@/types/transaction.types'
import type { TransactionFilters } from '@/types/transaction.types'

interface Props {
  filters: TransactionFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: TransactionFilters]
  apply: [filters: TransactionFilters]
}>()

const localFilters = ref<TransactionFilters>({ ...props.filters })

const handleFilterChange = () => {
  // Emit update immediately for reactive updates
  emit('update:filters', { ...localFilters.value })
}

const handleApplyFilters = () => {
  // Emit apply event for explicit filter application
  emit('apply', { ...localFilters.value })
}

const handleClearFilters = () => {
  localFilters.value = {
    type: undefined,
    startDate: undefined,
    endDate: undefined
  }
  handleFilterChange()
  handleApplyFilters()
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>
