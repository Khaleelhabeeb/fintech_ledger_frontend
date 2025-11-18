import { apiClient, USE_MOCK } from '@/api/client'
import { balanceMockService } from './mock/balance.mock'
import { transactionService } from './transaction.service'
import type { BalanceVersion } from '@/types/balance.types'

class BalanceService {
  /**
   * Get current balance for a specific account
   */
  async getBalance(accountId: string): Promise<number> {
    if (USE_MOCK) {
      return balanceMockService.getBalance(accountId)
    }

    const response = await apiClient.get<{ balance: number }>(`/accounts/${accountId}/balance`)
    return response.data.balance
  }

  /**
   * Get all balance versions for a specific account
   */
  async getVersions(accountId: string): Promise<BalanceVersion[]> {
    if (USE_MOCK) {
      return balanceMockService.getVersions(accountId)
    }

    const response = await apiClient.get<BalanceVersion[]>(`/accounts/${accountId}/versions`)
    return response.data
  }

  /**
   * Get a specific balance version by ID
   */
  async getVersionById(versionId: string): Promise<BalanceVersion> {
    if (USE_MOCK) {
      return balanceMockService.getVersionById(versionId)
    }

    const response = await apiClient.get<BalanceVersion>(`/versions/${versionId}`)
    return response.data
  }

  /**
   * Deposit funds to an account
   */
  async deposit(accountId: string, amount: number, actor: string = 'user', description?: string): Promise<{ newBalance: number }> {
    const transaction = await transactionService.deposit(accountId, amount, actor, description)
    return { newBalance: transaction.balanceAfter }
  }

  /**
   * Withdraw funds from an account
   */
  async withdraw(accountId: string, amount: number, actor: string = 'user', description?: string): Promise<{ newBalance: number }> {
    const transaction = await transactionService.withdraw(accountId, amount, actor, description)
    return { newBalance: transaction.balanceAfter }
  }
}

export const balanceService = new BalanceService()
