import { apiClient, USE_MOCK } from '@/api/client'
import { transactionMockService } from './mock/transaction.mock'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'
import type { PaginationParams, PaginatedResponse } from '@/types/common.types'

class TransactionService {
  /**
   * Get transactions for a specific account with optional filters and pagination
   */
  async getTransactions(
    accountId: string,
    filters?: TransactionFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    if (USE_MOCK) {
      return transactionMockService.getTransactions(accountId, filters, pagination)
    }

    const params = {
      ...filters,
      page: pagination?.page,
      pageSize: pagination?.pageSize
    }

    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      `/accounts/${accountId}/transactions`,
      { params }
    )
    return response.data
  }

  /**
   * Create a deposit transaction
   */
  async deposit(
    accountId: string,
    amount: number,
    actor: string,
    description?: string
  ): Promise<Transaction> {
    if (USE_MOCK) {
      return transactionMockService.createDeposit(accountId, amount, actor, description)
    }

    const response = await apiClient.post<Transaction>(
      `/accounts/${accountId}/transactions/deposit`,
      { amount, actor, description }
    )
    return response.data
  }

  /**
   * Create a withdrawal transaction
   */
  async withdraw(
    accountId: string,
    amount: number,
    actor: string,
    description?: string
  ): Promise<Transaction> {
    if (USE_MOCK) {
      return transactionMockService.createWithdrawal(accountId, amount, actor, description)
    }

    const response = await apiClient.post<Transaction>(
      `/accounts/${accountId}/transactions/withdraw`,
      { amount, actor, description }
    )
    return response.data
  }
}

export const transactionService = new TransactionService()
