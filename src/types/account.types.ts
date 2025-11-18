import type { Currency } from './common.types'

export interface Account {
  id: string
  userId: string
  currency: Currency
  balance: number
  createdAt: string
  updatedAt: string
}
