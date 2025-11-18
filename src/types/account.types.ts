import type { Currency } from './common.types'

export interface Account {
  entity_id: string
  version: string
  owner_id: string
  balance: number
  currency: Currency
  active: boolean
  changed_by_id: string
  changed_on: string
}

export interface TransferResponse {
  from_account: Account
  to_account: Account
}
