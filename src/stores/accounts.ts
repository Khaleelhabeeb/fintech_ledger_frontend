import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { accountService } from '@/services/account.service'
import type { Account } from '@/types/account.types'
import type { Currency } from '@/types/common.types'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const activeAccountId = ref<string | null>(localStorage.getItem('active_account_id'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeAccount = computed(() => 
    accounts.value.find(acc => acc.entity_id === activeAccountId.value) || null
  )

  async function fetchAccounts() {
    isLoading.value = true
    error.value = null
    try {
      accounts.value = await accountService.getAccounts()
      // Set first account as active if no active account is set
      if (!activeAccountId.value && accounts.value.length > 0) {
        const firstAccount = accounts.value[0]
        if (firstAccount) {
          setActiveAccount(firstAccount.entity_id)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch accounts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getAccountById(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const account = await accountService.getAccountById(id)
      // Update account in list if it exists
      const index = accounts.value.findIndex(acc => acc.entity_id === id)
      if (index !== -1) {
        accounts.value[index] = account
      } else {
        accounts.value.push(account)
      }
      return account
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch account'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createAccount(currency: Currency, initialBalance: number) {
    isLoading.value = true
    error.value = null
    try {
      const newAccount = await accountService.createAccount(currency, initialBalance)
      // Add new account to the list without refetching
      accounts.value.push(newAccount)
      return newAccount
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create account'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deposit(accountId: string, amount: number) {
    isLoading.value = true
    error.value = null
    try {
      const updatedAccount = await accountService.deposit(accountId, amount)
      // Update account in list without refetching
      const index = accounts.value.findIndex(acc => acc.entity_id === accountId)
      if (index !== -1) {
        accounts.value[index] = updatedAccount
      }
      return updatedAccount
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to deposit funds'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function withdraw(accountId: string, amount: number) {
    isLoading.value = true
    error.value = null
    try {
      const updatedAccount = await accountService.withdraw(accountId, amount)
      // Update account in list without refetching
      const index = accounts.value.findIndex(acc => acc.entity_id === accountId)
      if (index !== -1) {
        accounts.value[index] = updatedAccount
      }
      return updatedAccount
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to withdraw funds'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function transfer(fromAccountId: string, toAccountId: string, amount: number) {
    isLoading.value = true
    error.value = null
    try {
      const transferResponse = await accountService.transfer(fromAccountId, toAccountId, amount)
      // Update both accounts in list without refetching
      const fromIndex = accounts.value.findIndex(acc => acc.entity_id === fromAccountId)
      if (fromIndex !== -1) {
        accounts.value[fromIndex] = transferResponse.from_account
      }
      const toIndex = accounts.value.findIndex(acc => acc.entity_id === toAccountId)
      if (toIndex !== -1) {
        accounts.value[toIndex] = transferResponse.to_account
      }
      return transferResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to transfer funds'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setActiveAccount(accountId: string) {
    activeAccountId.value = accountId
    localStorage.setItem('active_account_id', accountId)
  }

  function clearActiveAccount() {
    activeAccountId.value = null
    localStorage.removeItem('active_account_id')
  }

  return {
    accounts,
    activeAccountId,
    activeAccount,
    isLoading,
    error,
    fetchAccounts,
    getAccountById,
    createAccount,
    deposit,
    withdraw,
    transfer,
    setActiveAccount,
    clearActiveAccount
  }
})
