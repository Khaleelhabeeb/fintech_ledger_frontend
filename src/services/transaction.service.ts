import { apiClient } from '@/api/client'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'

class TransactionService {
  /**
   * Get transactions for a specific account with optional filters
   */
  async getTransactions(
    accountId: string,
    filters?: TransactionFilters
  ): Promise<Transaction[]> {
    const params = {
      start_date: filters?.start_date,
      end_date: filters?.end_date,
      transaction_type: filters?.transaction_type,
      actor_id: filters?.actor_id
    }

    // Remove undefined values from params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    )

    const response = await apiClient.get<Transaction[]>(
      `/accounts/${accountId}/transactions`,
      { params: cleanParams }
    )
    return response.data
  }
}

export const transactionService = new TransactionService()
