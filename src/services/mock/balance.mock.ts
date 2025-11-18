import type { BalanceVersion } from '@/types/balance.types'
import { accountMockService } from './account.mock'

// Simulate network delay
const delay = (ms: number = Math.random() * 300 + 200) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock balance versions - historical snapshots
let mockBalanceVersions: BalanceVersion[] = [
  {
    id: 'ver-1',
    accountId: 'acc-1',
    version: 1,
    balance: 5000.00,
    changeAmount: 5000.00,
    changedBy: 'System',
    timestamp: '2024-01-15T10:00:00Z',
    isCurrent: false
  },
  {
    id: 'ver-2',
    accountId: 'acc-1',
    version: 2,
    balance: 7700.00,
    changeAmount: 2700.00,
    changedBy: 'John Doe',
    timestamp: '2024-02-01T14:30:00Z',
    isCurrent: false
  },
  {
    id: 'ver-3',
    accountId: 'acc-1',
    version: 3,
    balance: 7250.00,
    changeAmount: -450.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-08T16:45:00Z',
    isCurrent: false
  },
  {
    id: 'ver-4',
    accountId: 'acc-1',
    version: 4,
    balance: 10750.00,
    changeAmount: 3500.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-10T09:15:00Z',
    isCurrent: false
  },
  {
    id: 'ver-5',
    accountId: 'acc-1',
    version: 5,
    balance: 9550.00,
    changeAmount: -1200.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-15T10:20:00Z',
    isCurrent: false
  },
  {
    id: 'ver-6',
    accountId: 'acc-1',
    version: 6,
    balance: 15000.00,
    changeAmount: 5000.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-17T14:30:00Z',
    isCurrent: true
  },
  {
    id: 'ver-7',
    accountId: 'acc-2',
    version: 1,
    balance: 3000.00,
    changeAmount: 3000.00,
    changedBy: 'System',
    timestamp: '2024-02-20T11:00:00Z',
    isCurrent: false
  },
  {
    id: 'ver-8',
    accountId: 'acc-2',
    version: 2,
    balance: 6500.50,
    changeAmount: 3500.50,
    changedBy: 'John Doe',
    timestamp: '2024-05-15T10:30:00Z',
    isCurrent: false
  },
  {
    id: 'ver-9',
    accountId: 'acc-2',
    version: 3,
    balance: 5750.50,
    changeAmount: -750.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-12T14:30:00Z',
    isCurrent: false
  },
  {
    id: 'ver-10',
    accountId: 'acc-2',
    version: 4,
    balance: 8500.50,
    changeAmount: 2000.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-16T09:15:00Z',
    isCurrent: true
  },
  {
    id: 'ver-11',
    accountId: 'acc-3',
    version: 1,
    balance: 5000.00,
    changeAmount: 5000.00,
    changedBy: 'System',
    timestamp: '2024-03-10T08:30:00Z',
    isCurrent: false
  },
  {
    id: 'ver-12',
    accountId: 'acc-3',
    version: 2,
    balance: 7750.25,
    changeAmount: 2750.25,
    changedBy: 'John Doe',
    timestamp: '2024-06-20T12:00:00Z',
    isCurrent: false
  },
  {
    id: 'ver-13',
    accountId: 'acc-3',
    version: 3,
    balance: 6250.25,
    changeAmount: -1500.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-09T11:20:00Z',
    isCurrent: false
  },
  {
    id: 'ver-14',
    accountId: 'acc-3',
    version: 4,
    balance: 12750.25,
    changeAmount: 5000.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-15T16:45:00Z',
    isCurrent: true
  },
  {
    id: 'ver-15',
    accountId: 'acc-4',
    version: 1,
    balance: 1000000.00,
    changeAmount: 1000000.00,
    changedBy: 'System',
    timestamp: '2024-04-05T12:00:00Z',
    isCurrent: false
  },
  {
    id: 'ver-16',
    accountId: 'acc-4',
    version: 2,
    balance: 1350000.00,
    changeAmount: 350000.00,
    changedBy: 'John Doe',
    timestamp: '2024-08-10T09:30:00Z',
    isCurrent: false
  },
  {
    id: 'ver-17',
    accountId: 'acc-4',
    version: 3,
    balance: 1100000.00,
    changeAmount: -250000.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-07T08:30:00Z',
    isCurrent: false
  },
  {
    id: 'ver-18',
    accountId: 'acc-4',
    version: 4,
    balance: 1850000.00,
    changeAmount: 500000.00,
    changedBy: 'John Doe',
    timestamp: '2024-11-14T11:20:00Z',
    isCurrent: true
  }
]

class BalanceMockService {
  async getBalance(accountId: string): Promise<number> {
    await delay()

    const account = accountMockService.getAccountSync(accountId)
    if (!account) {
      throw new Error('Account not found')
    }

    return account.balance
  }

  async getVersions(accountId: string): Promise<BalanceVersion[]> {
    await delay()

    const versions = mockBalanceVersions
      .filter(ver => ver.accountId === accountId)
      .sort((a, b) => b.version - a.version)

    return versions
  }

  async getVersionById(versionId: string): Promise<BalanceVersion> {
    await delay()

    const version = mockBalanceVersions.find(ver => ver.id === versionId)
    if (!version) {
      throw new Error('Version not found')
    }

    return version
  }

  async getCurrentVersion(accountId: string): Promise<BalanceVersion> {
    await delay()

    const currentVersion = mockBalanceVersions.find(
      ver => ver.accountId === accountId && ver.isCurrent
    )

    if (!currentVersion) {
      throw new Error('Current version not found')
    }

    return currentVersion
  }

  async createVersion(
    accountId: string,
    newBalance: number,
    changeAmount: number,
    changedBy: string
  ): Promise<BalanceVersion> {
    await delay()

    // Mark all existing versions for this account as not current
    mockBalanceVersions.forEach(ver => {
      if (ver.accountId === accountId && ver.isCurrent) {
        ver.isCurrent = false
      }
    })

    // Get the next version number
    const existingVersions = mockBalanceVersions.filter(ver => ver.accountId === accountId)
    const nextVersion = existingVersions.length > 0 
      ? Math.max(...existingVersions.map(v => v.version)) + 1 
      : 1

    const newVersion: BalanceVersion = {
      id: `ver-${Date.now()}`,
      accountId,
      version: nextVersion,
      balance: newBalance,
      changeAmount,
      changedBy,
      timestamp: new Date().toISOString(),
      isCurrent: true
    }

    mockBalanceVersions.push(newVersion)
    return newVersion
  }
}

export const balanceMockService = new BalanceMockService()
