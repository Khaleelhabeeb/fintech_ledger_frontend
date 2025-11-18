<template>
  <div class="accounts-page">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Accounts</h1>
      <p class="text-sm text-gray-600 mt-1">Manage your multi-currency accounts</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="accounts.length === 0"
      title="No Accounts Found"
      message="You don't have any accounts yet. Contact support to create an account."
      icon="💳"
    />

    <!-- Accounts Grid -->
    <div v-else class="accounts-grid">
      <div
        v-for="account in accounts"
        :key="account.entity_id"
        :class="[
          'account-card',
          'bg-white rounded-lg shadow-card p-6 cursor-pointer transition-all duration-150',
          'hover:shadow-card-hover hover:scale-[1.02]',
          isActiveAccount(account.entity_id) ? 'ring-2 ring-accent border-accent' : 'border border-gray-200'
        ]"
        @click="selectAccount(account.entity_id)"
      >
        <!-- Active Badge -->
        <div v-if="isActiveAccount(account.entity_id)" class="flex items-center justify-end mb-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-white">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Active
          </span>
        </div>

        <!-- Currency Icon -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-xl font-bold">
              {{ getCurrencySymbol(account.currency) }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ account.currency }} Account
              </h3>
              <p class="text-xs text-gray-500">
                ID: {{ account.entity_id.substring(0, 8) }}...
              </p>
            </div>
          </div>
        </div>

        <!-- Balance -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-1">Current Balance</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(account.balance, account.currency) }}
          </p>
        </div>

        <!-- Account Details -->
        <div class="space-y-2 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Status</span>
            <span :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              account.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ account.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Version</span>
            <span class="text-gray-900 font-medium">
              {{ account.version }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Last Updated</span>
            <span class="text-gray-900 font-medium">
              {{ formatRelativeTime(account.changed_on) }}
            </span>
          </div>
        </div>

        <!-- Select Button (visible on hover for non-active accounts) -->
        <div v-if="!isActiveAccount(account.entity_id)" class="mt-4 pt-4 border-t border-gray-100">
          <button
            class="w-full px-4 py-2 text-sm font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors duration-150"
            @click.stop="selectAccount(account.entity_id)"
          >
            Set as Active Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useNotificationsStore } from '@/stores/notifications'
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/format'
import type { Currency } from '@/types/common.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const accountsStore = useAccountsStore()
const notificationsStore = useNotificationsStore()

const isLoading = ref(false)
const error = ref<string | null>(null)

const accounts = computed(() => accountsStore.accounts)
const activeAccountId = computed(() => accountsStore.activeAccountId)

function isActiveAccount(accountId: string): boolean {
  return accountId === activeAccountId.value
}

function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  }
  return symbols[currency] || currency
}

async function selectAccount(accountId: string) {
  try {
    accountsStore.setActiveAccount(accountId)
    notificationsStore.success('Active account updated successfully')
  } catch (err) {
    notificationsStore.error('Failed to set active account')
  }
}

async function loadAccounts() {
  isLoading.value = true
  error.value = null

  try {
    await accountsStore.fetchAccounts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load accounts'
    notificationsStore.error('Failed to load accounts')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Load accounts if not already loaded
  if (accounts.value.length === 0) {
    await loadAccounts()
  }
})
</script>

<style scoped>
.accounts-page {
  padding: 1.5rem;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .accounts-page {
    padding: 2rem;
  }
  
  .accounts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .accounts-page {
    padding: 2.5rem;
  }
  
  .accounts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Desktop: 4 columns */
@media (min-width: 1536px) {
  .accounts-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.account-card {
  position: relative;
}
</style>
