<template>
  <div class="container mx-auto px-4 py-4 sm:py-6">
    <!-- Page Header -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Transaction History</h1>
      <p class="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
        View and filter all transactions for your account
      </p>
    </div>

    <!-- Filters -->
    <TransactionFilters
      :filters="transactionsStore.filters"
      @update:filters="handleFiltersUpdate"
      @apply="handleFiltersApply"
    />

    <!-- Transactions Table -->
    <AppTable
      :columns="columns"
      :data="transactionsStore.transactions"
      :loading="transactionsStore.isLoading"
      :pagination="{
        page: transactionsStore.pagination.page,
        pageSize: transactionsStore.pagination.pageSize,
        total: transactionsStore.totalItems,
        totalPages: transactionsStore.totalPages
      }"
      empty-message="No transactions found"
      @page-change="handlePageChange"
    >
      <!-- Transaction Type Column -->
      <template #cell-type="{ value }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            value === TransactionType.DEPOSIT
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          ]"
        >
          {{ value === TransactionType.DEPOSIT ? 'Deposit' : 'Withdrawal' }}
        </span>
      </template>

      <!-- Amount Column -->
      <template #cell-amount="{ row, value }">
        <span
          :class="[
            'font-medium',
            row.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'
          ]"
        >
          {{ row.type === TransactionType.DEPOSIT ? '+' : '-' }}{{ formatCurrency(value, accountsStore.activeAccount?.currency || 'USD') }}
        </span>
      </template>

      <!-- Balance After Column -->
      <template #cell-balanceAfter="{ value }">
        <span class="font-medium text-gray-900">
          {{ formatCurrency(value, accountsStore.activeAccount?.currency || 'USD') }}
        </span>
      </template>

      <!-- Date Column -->
      <template #cell-createdAt="{ value }">
        <div class="text-sm">
          <div class="text-gray-900">{{ formatDate(value, 'medium') }}</div>
          <div class="text-gray-500">{{ formatDate(value, 'time') }}</div>
        </div>
      </template>

      <!-- Actor Column -->
      <template #cell-actor="{ value }">
        <span class="text-gray-700">{{ value }}</span>
      </template>

      <!-- Description Column -->
      <template #cell-description="{ value }">
        <span class="text-gray-600 text-sm">{{ value || '-' }}</span>
      </template>
    </AppTable>

    <!-- Empty State when no active account -->
    <div v-if="!accountsStore.activeAccount && !accountsStore.isLoading" class="mt-8">
      <EmptyState
        message="Please select an account to view transactions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import AppTable from '@/components/common/AppTable.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TransactionFilters from '@/components/transactions/TransactionFilters.vue'
import { TransactionType } from '@/types/transaction.types'
import type { TransactionFilters as TFilters } from '@/types/transaction.types'
import { formatCurrency, formatDate } from '@/utils/format'

const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()

const columns = [
  { key: 'type', label: 'Type', sortable: false },
  { key: 'amount', label: 'Amount', sortable: false },
  { key: 'balanceAfter', label: 'Balance After', sortable: false },
  { key: 'createdAt', label: 'Date', sortable: false },
  { key: 'actor', label: 'Actor', sortable: false },
  { key: 'description', label: 'Description', sortable: false }
]

const fetchTransactions = async () => {
  if (accountsStore.activeAccount) {
    try {
      await transactionsStore.fetchTransactions(accountsStore.activeAccount.id)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }
}

const handleFiltersUpdate = (filters: TFilters) => {
  transactionsStore.setFilters(filters)
}

const handleFiltersApply = async (filters: TFilters) => {
  transactionsStore.setFilters(filters)
  await fetchTransactions()
}

const handlePageChange = async (page: number) => {
  transactionsStore.setPage(page)
  await fetchTransactions()
}

// Fetch transactions on mount
onMounted(async () => {
  await fetchTransactions()
})

// Watch for active account changes
watch(
  () => accountsStore.activeAccountId,
  async (newAccountId) => {
    if (newAccountId) {
      transactionsStore.clearFilters()
      await fetchTransactions()
    }
  }
)
</script>
