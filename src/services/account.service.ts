import { apiClient, USE_MOCK } from '@/api/client'
import { accountMockService } from './mock/account.mock'
import type { Account } from '@/types/account.types'

class AccountService {
  /**
   * Get all accounts for the current user
   */
  async getAccounts(): Promise<Account[]> {
    if (USE_MOCK) {
      return accountMockService.getAccounts()
    }

    const response = await apiClient.get<Account[]>('/accounts')
    return response.data
  }

  /**
   * Get a specific account by ID
   */
  async getAccountById(id: string): Promise<Account> {
    if (USE_MOCK) {
      return accountMockService.getAccountById(id)
    }

    const response = await apiClient.get<Account>(`/accounts/${id}`)
    return response.data
  }
}

export const accountService = new AccountService()
