export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW'
}

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  amount: number
  balanceAfter: number
  actor: string
  createdAt: string
  description?: string
}

export interface TransactionFilters {
  type?: TransactionType
  startDate?: string
  endDate?: string
}
