import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transactionService } from '@/services/transaction.service'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const filters = ref<TransactionFilters>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTransactions(accountId: string) {
    isLoading.value = true
    error.value = null
    try {
      const response: Transaction[] = await transactionService.getTransactions(
        accountId,
        filters.value
      )
      transactions.value = response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch transactions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(newFilters: TransactionFilters) {
    filters.value = { ...newFilters }
  }

  function clearFilters() {
    filters.value = {}
  }

  function clearTransactions() {
    transactions.value = []
    filters.value = {}
    error.value = null
  }

  return {
    transactions,
    filters,
    isLoading,
    error,
    fetchTransactions,
    setFilters,
    clearFilters,
    clearTransactions
  }
})
