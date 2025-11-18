import { apiClient } from '@/api/client'
import type { Account, TransferResponse } from '@/types/account.types'
import type { Currency } from '@/types/common.types'

class AccountService {
  /**
   * Get all accounts for the current user
   */
  async getAccounts(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>('/accounts')
    return response.data
  }

  /**
   * Get a specific account by ID
   */
  async getAccountById(id: string): Promise<Account> {
    const response = await apiClient.get<Account>(`/accounts/${id}`)
    return response.data
  }

  /**
   * Create a new account with specified currency and initial balance
   */
  async createAccount(currency: Currency, initialBalance: number): Promise<Account> {
    const response = await apiClient.post<Account>('/accounts', {
      currency,
      initial_balance: initialBalance
    })
    return response.data
  }

  /**
   * Deposit funds into an account
   */
  async deposit(accountId: string, amount: number): Promise<Account> {
    const response = await apiClient.post<Account>(`/accounts/${accountId}/deposit`, {
      amount
    })
    return response.data
  }

  /**
   * Withdraw funds from an account
   */
  async withdraw(accountId: string, amount: number): Promise<Account> {
    const response = await apiClient.post<Account>(`/accounts/${accountId}/withdraw`, {
      amount
    })
    return response.data
  }

  /**
   * Transfer funds between accounts
   */
  async transfer(fromAccountId: string, toAccountId: string, amount: number): Promise<TransferResponse> {
    const response = await apiClient.post<TransferResponse>('/accounts/transfer', {
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount
    })
    return response.data
  }

  /**
   * Get version history for an account
   */
  async getAccountVersions(accountId: string): Promise<Account[]> {
    const response = await apiClient.get<Account[]>(`/accounts/${accountId}/versions`)
    return response.data
  }
}

export const accountService = new AccountService()
