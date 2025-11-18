import { defineStore } from 'pinia'
import { ref } from 'vue'
import { balanceService } from '@/services/balance.service'
import { useAuthStore } from './auth'
import type { BalanceVersion } from '@/types/balance.types'

export const useBalanceStore = defineStore('balance', () => {
  const balance = ref<number>(0)
  const versions = ref<BalanceVersion[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBalance(accountId: string) {
    isLoading.value = true
    error.value = null
    try {
      balance.value = await balanceService.getBalance(accountId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch balance'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchVersions(accountId: string) {
    isLoading.value = true
    error.value = null
    try {
      versions.value = await balanceService.getVersions(accountId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch versions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getVersionById(versionId: string) {
    isLoading.value = true
    error.value = null
    try {
      const version = await balanceService.getVersionById(versionId)
      return version
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch version'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deposit(accountId: string, amount: number) {
    isLoading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      const actor = authStore.user?.email || 'user'
      const result = await balanceService.deposit(accountId, amount, actor)
      balance.value = result.newBalance
      // Refresh versions to include the new transaction
      await fetchVersions(accountId)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Deposit failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function withdraw(accountId: string, amount: number) {
    isLoading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      const actor = authStore.user?.email || 'user'
      const result = await balanceService.withdraw(accountId, amount, actor)
      balance.value = result.newBalance
      // Refresh versions to include the new transaction
      await fetchVersions(accountId)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Withdrawal failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearBalance() {
    balance.value = 0
    versions.value = []
    error.value = null
  }

  return {
    balance,
    versions,
    isLoading,
    error,
    fetchBalance,
    fetchVersions,
    getVersionById,
    deposit,
    withdraw,
    clearBalance
  }
})
