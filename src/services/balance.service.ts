import { accountService } from './account.service'
import type { Account } from '@/types/account.types'

class BalanceService {
  /**
   * Get current balance for a specific account
   */
  async getBalance(accountId: string): Promise<number> {
    const account = await accountService.getAccountById(accountId)
    return account.balance
  }

  /**
   * Get all balance versions for a specific account
   * Returns account history ordered by version
   */
  async getVersions(accountId: string): Promise<Account[]> {
    const versions = await accountService.getAccountVersions(accountId)
    return versions
  }

  /**
   * Deposit funds to an account
   */
  async deposit(accountId: string, amount: number): Promise<Account> {
    const updatedAccount = await accountService.deposit(accountId, amount)
    return updatedAccount
  }

  /**
   * Withdraw funds from an account
   */
  async withdraw(accountId: string, amount: number): Promise<Account> {
    const updatedAccount = await accountService.withdraw(accountId, amount)
    return updatedAccount
  }
}

export const balanceService = new BalanceService()
