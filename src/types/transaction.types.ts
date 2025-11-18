export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT'
}

export interface Transaction {
  id: string
  account_id: string
  amount: number
  type: TransactionType
  actor_id: string
  timestamp: string
  account_version: string
  reference: string | null
}

export interface TransactionFilters {
  start_date?: string
  end_date?: string
  transaction_type?: TransactionType
  actor_id?: string
}
