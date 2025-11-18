export interface BalanceVersion {
  id: string
  accountId: string
  version: number
  balance: number
  changeAmount: number
  changedBy: string
  timestamp: string
  isCurrent: boolean
}
