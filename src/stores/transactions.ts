import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transactionService } from '@/services/transaction.service'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'
import type { PaginationParams, PaginatedResponse } from '@/types/common.types'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const filters = ref<TransactionFilters>({})
  const pagination = ref<PaginationParams>({
    page: 1,
    pageSize: 10
  })
  const totalPages = ref(0)
  const totalItems = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTransactions(accountId: string) {
    isLoading.value = true
    error.value = null
    try {
      const response: PaginatedResponse<Transaction> = await transactionService.getTransactions(
        accountId,
        filters.value,
        pagination.value
      )
      transactions.value = response.items
      totalPages.value = response.totalPages
      totalItems.value = response.total
      pagination.value.page = response.page
      pagination.value.pageSize = response.pageSize
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch transactions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(newFilters: TransactionFilters) {
    filters.value = { ...newFilters }
    // Reset to first page when filters change
    pagination.value.page = 1
  }

  function setPagination(newPagination: Partial<PaginationParams>) {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  function setPage(page: number) {
    pagination.value.page = page
  }

  function setPageSize(pageSize: number) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // Reset to first page when page size changes
  }

  function clearFilters() {
    filters.value = {}
    pagination.value.page = 1
  }

  function clearTransactions() {
    transactions.value = []
    filters.value = {}
    pagination.value = { page: 1, pageSize: 10 }
    totalPages.value = 0
    totalItems.value = 0
    error.value = null
  }

  return {
    transactions,
    filters,
    pagination,
    totalPages,
    totalItems,
    isLoading,
    error,
    fetchTransactions,
    setFilters,
    setPagination,
    setPage,
    setPageSize,
    clearFilters,
    clearTransactions
  }
})
