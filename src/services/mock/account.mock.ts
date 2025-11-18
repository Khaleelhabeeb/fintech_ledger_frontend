import type { Account } from '@/types/account.types'

// Simulate network delay
const delay = (ms: number = Math.random() * 300 + 200) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock accounts data for multiple currencies
let mockAccounts: Account[] = [
  {
    id: 'acc-1',
    userId: 'user-1',
    currency: 'USD',
    balance: 15000.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-17T14:30:00Z'
  },
  {
    id: 'acc-2',
    userId: 'user-1',
    currency: 'EUR',
    balance: 8500.50,
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2024-11-16T09:15:00Z'
  },
  {
    id: 'acc-3',
    userId: 'user-1',
    currency: 'GBP',
    balance: 12750.25,
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-11-15T16:45:00Z'
  },
  {
    id: 'acc-4',
    userId: 'user-1',
    currency: 'JPY',
    balance: 1850000.00,
    createdAt: '2024-04-05T12:00:00Z',
    updatedAt: '2024-11-14T11:20:00Z'
  }
]

class AccountMockService {
  async getAccounts(userId: string = 'user-1'): Promise<Account[]> {
    await delay()
    return mockAccounts.filter(acc => acc.userId === userId)
  }

  async getAccountById(id: string): Promise<Account> {
    await delay()
    
    const account = mockAccounts.find(acc => acc.id === id)
    if (!account) {
      throw new Error('Account not found')
    }
    
    return account
  }

  async createAccount(userId: string, currency: string): Promise<Account> {
    await delay()

    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      userId,
      currency: currency as any,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockAccounts.push(newAccount)
    return newAccount
  }

  async updateAccountBalance(accountId: string, newBalance: number): Promise<Account> {
    await delay()

    const account = mockAccounts.find(acc => acc.id === accountId)
    if (!account) {
      throw new Error('Account not found')
    }

    account.balance = newBalance
    account.updatedAt = new Date().toISOString()
    
    return account
  }

  // Helper method to get account by ID synchronously (for internal use)
  getAccountSync(accountId: string): Account | undefined {
    return mockAccounts.find(acc => acc.id === accountId)
  }
}

export const accountMockService = new AccountMockService()
