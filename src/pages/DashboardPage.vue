<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-600 mt-1">Overview of your account activity</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="activeAccount" class="space-y-6">
      <!-- Balance Card -->
      <div class="bg-white rounded-lg shadow-card p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex-1">
            <p class="text-sm text-gray-600 mb-1">Current Balance</p>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
              {{ formatCurrency(balance, activeAccount.currency) }}
            </h2>
            <p class="text-xs text-gray-500 mt-1">
              {{ activeAccount.currency }} Account
            </p>
          </div>
          <div class="flex gap-2 sm:gap-3">
            <AppButton
              variant="primary"
              @click="handleDeposit"
              class="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm sm:text-base">Deposit</span>
            </AppButton>
            <AppButton
              variant="secondary"
              @click="handleWithdraw"
              class="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
              <span class="text-sm sm:text-base">Withdraw</span>
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Balance Chart -->
      <div class="bg-white rounded-lg shadow-card p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Balance History</h3>
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <div class="min-w-[300px] px-4 sm:px-0">
            <BalanceChart :versions="versions" :currency="activeAccount.currency" />
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-lg shadow-card p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <router-link
            to="/transactions"
            class="text-xs sm:text-sm text-accent hover:text-accent-dark transition-colors whitespace-nowrap"
          >
            View All
          </router-link>
        </div>

        <!-- Transactions Loading -->
        <div v-if="transactionsLoading" class="flex items-center justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>

        <!-- No Transactions -->
        <EmptyState
          v-else-if="recentTransactions.length === 0"
          message="No transactions yet"
          icon="📊"
        />

        <!-- Transactions List -->
        <div v-else class="space-y-3">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div
                :class="[
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  transaction.type === TransactionType.DEPOSIT
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                ]"
              >
                <svg
                  v-if="transaction.type === TransactionType.DEPOSIT"
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm sm:text-base font-medium text-gray-900">
                  {{ transaction.type === TransactionType.DEPOSIT ? 'Deposit' : 'Withdrawal' }}
                </p>
                <p class="text-xs sm:text-sm text-gray-600">
                  {{ formatDateTime(transaction.timestamp) }}
                </p>
                <p v-if="transaction.reference" class="text-xs text-gray-500 mt-1 truncate">
                  Ref: {{ transaction.reference }}
                </p>
              </div>
            </div>
            <div class="text-left sm:text-right flex-shrink-0">
              <p
                :class="[
                  'text-sm sm:text-base font-semibold',
                  transaction.type === TransactionType.DEPOSIT
                    ? 'text-green-600'
                    : 'text-red-600'
                ]"
              >
                {{ transaction.type === TransactionType.DEPOSIT ? '+' : '-' }}
                {{ formatCurrency(transaction.amount, activeAccount.currency) }}
              </p>
              <p class="text-xs sm:text-sm text-gray-600">
                Version: {{ transaction.account_version }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Active Account -->
    <EmptyState
      v-else
      message="No active account selected"
      icon="💳"
    />

    <!-- Deposit Modal -->
    <DepositModal
      v-if="activeAccount"
      :is-open="isDepositModalOpen"
      :account-id="activeAccount.entity_id"
      :currency="activeAccount.currency"
      @close="closeDepositModal"
      @success="handleTransactionSuccess"
    />

    <!-- Withdraw Modal -->
    <WithdrawModal
      v-if="activeAccount"
      :is-open="isWithdrawModalOpen"
      :account-id="activeAccount.entity_id"
      :balance="balance"
      :currency="activeAccount.currency"
      @close="closeWithdrawModal"
      @success="handleTransactionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useBalanceStore } from '@/stores/balance'
import { useTransactionsStore } from '@/stores/transactions'
import { useNotificationsStore } from '@/stores/notifications'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { TransactionType } from '@/types/transaction.types'
import BalanceChart from '@/components/charts/BalanceChart.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import DepositModal from '@/components/transactions/DepositModal.vue'
import WithdrawModal from '@/components/transactions/WithdrawModal.vue'

const accountsStore = useAccountsStore()
const balanceStore = useBalanceStore()
const transactionsStore = useTransactionsStore()
const notificationsStore = useNotificationsStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const isDepositModalOpen = ref(false)
const isWithdrawModalOpen = ref(false)

const activeAccount = computed(() => accountsStore.activeAccount)
const balance = computed(() => balanceStore.balance)
const versions = computed(() => balanceStore.versions)
const transactionsLoading = computed(() => transactionsStore.isLoading)

// Get last 5 transactions
const recentTransactions = computed(() => {
  return transactionsStore.transactions.slice(0, 5)
})

async function loadDashboardData() {
  if (!activeAccount.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Fetch balance, versions, and recent transactions in parallel
    await Promise.all([
      balanceStore.fetchBalance(activeAccount.value.entity_id),
      balanceStore.fetchVersions(activeAccount.value.entity_id),
      fetchRecentTransactions()
    ])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard data'
    notificationsStore.error('Failed to load dashboard data')
  } finally {
    isLoading.value = false
  }
}

async function fetchRecentTransactions() {
  if (!activeAccount.value) {
    return
  }

  await transactionsStore.fetchTransactions(activeAccount.value.entity_id)
}

function handleDeposit() {
  isDepositModalOpen.value = true
}

function handleWithdraw() {
  isWithdrawModalOpen.value = true
}

function closeDepositModal() {
  isDepositModalOpen.value = false
}

function closeWithdrawModal() {
  isWithdrawModalOpen.value = false
}

async function handleTransactionSuccess() {
  // Reload dashboard data after successful transaction
  await loadDashboardData()
}

// Load data on mount
onMounted(async () => {
  // Ensure accounts are loaded
  if (accountsStore.accounts.length === 0) {
    await accountsStore.fetchAccounts()
  }
  
  await loadDashboardData()
})

// Reload data when active account changes
watch(
  () => activeAccount.value?.entity_id,
  async (newAccountId, oldAccountId) => {
    if (newAccountId && newAccountId !== oldAccountId) {
      await loadDashboardData()
    }
  }
)
</script>

<style scoped>
.dashboard-page {
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-page {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-page {
    padding: 2.5rem;
  }
}
</style>
