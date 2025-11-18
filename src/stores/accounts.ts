import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { accountService } from '@/services/account.service'
import type { Account } from '@/types/account.types'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const activeAccountId = ref<string | null>(localStorage.getItem('active_account_id'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeAccount = computed(() => 
    accounts.value.find(acc => acc.id === activeAccountId.value) || null
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
          setActiveAccount(firstAccount.id)
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
      const index = accounts.value.findIndex(acc => acc.id === id)
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
    setActiveAccount,
    clearActiveAccount
  }
})
