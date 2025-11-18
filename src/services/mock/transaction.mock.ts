import type { Transaction, TransactionType, TransactionFilters } from '@/types/transaction.types'
import type { PaginationParams, PaginatedResponse } from '@/types/common.types'
import { accountMockService } from './account.mock'

// Simulate network delay
const delay = (ms: number = Math.random() * 300 + 200) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock transaction history
let mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    accountId: 'acc-1',
    type: 'DEPOSIT' as TransactionType,
    amount: 5000.00,
    balanceAfter: 15000.00,
    actor: 'John Doe',
    createdAt: '2024-11-17T14:30:00Z',
    description: 'Salary deposit'
  },
  {
    id: 'txn-2',
    accountId: 'acc-1',
    type: 'WITHDRAW' as TransactionType,
    amount: 1200.00,
    balanceAfter: 10000.00,
    actor: 'John Doe',
    createdAt: '2024-11-15T10:20:00Z',
    description: 'Rent payment'
  },
  {
    id: 'txn-3',
    accountId: 'acc-1',
    type: 'DEPOSIT' as TransactionType,
    amount: 3500.00,
    balanceAfter: 11200.00,
    actor: 'John Doe',
    createdAt: '2024-11-10T09:15:00Z',
    description: 'Freelance payment'
  },
  {
    id: 'txn-4',
    accountId: 'acc-1',
    type: 'WITHDRAW' as TransactionType,
    amount: 450.00,
    balanceAfter: 7700.00,
    actor: 'John Doe',
    createdAt: '2024-11-08T16:45:00Z',
    description: 'Grocery shopping'
  },
  {
    id: 'txn-5',
    accountId: 'acc-2',
    type: 'DEPOSIT' as TransactionType,
    amount: 2000.00,
    balanceAfter: 8500.50,
    actor: 'John Doe',
    createdAt: '2024-11-16T09:15:00Z',
    description: 'Transfer from USD'
  },
  {
    id: 'txn-6',
    accountId: 'acc-2',
    type: 'WITHDRAW' as TransactionType,
    amount: 750.00,
    balanceAfter: 6500.50,
    actor: 'John Doe',
    createdAt: '2024-11-12T14:30:00Z',
    description: 'Online purchase'
  },
  {
    id: 'txn-7',
    accountId: 'acc-3',
    type: 'DEPOSIT' as TransactionType,
    amount: 5000.00,
    balanceAfter: 12750.25,
    actor: 'John Doe',
    createdAt: '2024-11-15T16:45:00Z',
    description: 'Investment return'
  },
  {
    id: 'txn-8',
    accountId: 'acc-3',
    type: 'WITHDRAW' as TransactionType,
    amount: 1500.00,
    balanceAfter: 7750.25,
    actor: 'John Doe',
    createdAt: '2024-11-09T11:20:00Z',
    description: 'Bill payment'
  },
  {
    id: 'txn-9',
    accountId: 'acc-4',
    type: 'DEPOSIT' as TransactionType,
    amount: 500000.00,
    balanceAfter: 1850000.00,
    actor: 'John Doe',
    createdAt: '2024-11-14T11:20:00Z',
    description: 'Business income'
  },
  {
    id: 'txn-10',
    accountId: 'acc-4',
    type: 'WITHDRAW' as TransactionType,
    amount: 250000.00,
    balanceAfter: 1350000.00,
    actor: 'John Doe',
    createdAt: '2024-11-07T08:30:00Z',
    description: 'Equipment purchase'
  }
]

class TransactionMockService {
  async getTransactions(
    accountId: string,
    filters?: TransactionFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    await delay()

    // Filter transactions by account
    let filtered = mockTransactions.filter(txn => txn.accountId === accountId)

    // Apply filters
    if (filters?.type) {
      filtered = filtered.filter(txn => txn.type === filters.type)
    }

    if (filters?.startDate) {
      filtered = filtered.filter(txn => txn.createdAt >= filters.startDate!)
    }

    if (filters?.endDate) {
      filtered = filtered.filter(txn => txn.createdAt <= filters.endDate!)
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination
    const page = pagination?.page || 1
    const pageSize = pagination?.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedItems = filtered.slice(startIndex, endIndex)

    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize)
    }
  }

  async getTransactionById(id: string): Promise<Transaction> {
    await delay()

    const transaction = mockTransactions.find(txn => txn.id === id)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return transaction
  }

  async createDeposit(accountId: string, amount: number, actor: string, description?: string): Promise<Transaction> {
    await delay()

    if (amount <= 0) {
      throw new Error('Deposit amount must be positive')
    }

    const account = accountMockService.getAccountSync(accountId)
    if (!account) {
      throw new Error('Account not found')
    }

    const newBalance = account.balance + amount

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      accountId,
      type: 'DEPOSIT' as TransactionType,
      amount,
      balanceAfter: newBalance,
      actor,
      createdAt: new Date().toISOString(),
      description
    }

    mockTransactions.unshift(transaction)
    await accountMockService.updateAccountBalance(accountId, newBalance)

    return transaction
  }

  async createWithdrawal(accountId: string, amount: number, actor: string, description?: string): Promise<Transaction> {
    await delay()

    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive')
    }

    const account = accountMockService.getAccountSync(accountId)
    if (!account) {
      throw new Error('Account not found')
    }

    if (account.balance < amount) {
      throw new Error('Insufficient balance')
    }

    const newBalance = account.balance - amount

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      accountId,
      type: 'WITHDRAW' as TransactionType,
      amount,
      balanceAfter: newBalance,
      actor,
      createdAt: new Date().toISOString(),
      description
    }

    mockTransactions.unshift(transaction)
    await accountMockService.updateAccountBalance(accountId, newBalance)

    return transaction
  }
}

export const transactionMockService = new TransactionMockService()
