<template>
  <div class="container mx-auto px-4 py-4 sm:py-6">
    <!-- Page Header -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Version History</h1>
      <p class="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
        View the complete balance version history for your account
      </p>
    </div>

    <!-- Account Info Card -->
    <div v-if="accountsStore.activeAccount" class="mb-4 sm:mb-6 bg-white rounded-lg shadow-card p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <p class="text-xs sm:text-sm text-gray-600">Current Account</p>
          <p class="text-base sm:text-lg font-semibold text-gray-900">
            {{ accountsStore.activeAccount.currency }} Account
          </p>
        </div>
        <div class="text-left sm:text-right">
          <p class="text-xs sm:text-sm text-gray-600">Current Balance</p>
          <p class="text-xl sm:text-2xl font-bold text-accent">
            {{ formatCurrency(balanceStore.balance, accountsStore.activeAccount.currency) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Version History Table -->
    <AppTable
      :columns="columns"
      :data="sortedVersions"
      :loading="balanceStore.isLoading"
      empty-message="No version history available"
    >
      <!-- Version Column -->
      <template #cell-version="{ row, value }">
        <div class="flex items-center space-x-2">
          <span
            :class="[
              'font-medium',
              isCurrentVersion(row) ? 'text-accent' : 'text-gray-900'
            ]"
          >
            {{ value }}
          </span>
          <span
            v-if="isCurrentVersion(row)"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-white"
          >
            Current
          </span>
        </div>
      </template>

      <!-- Balance Column -->
      <template #cell-balance="{ row, value }">
        <span
          :class="[
            'font-semibold text-lg',
            isCurrentVersion(row) ? 'text-accent' : 'text-gray-900'
          ]"
        >
          {{ formatCurrency(value, accountsStore.activeAccount?.currency || 'USD') }}
        </span>
      </template>

      <!-- Actor Column -->
      <template #cell-changed_by_id="{ value }">
        <span class="text-gray-700">{{ value }}</span>
      </template>

      <!-- Timestamp Column -->
      <template #cell-changed_on="{ value }">
        <div class="text-sm">
          <div class="text-gray-900">{{ formatDate(value, 'medium') }}</div>
          <div class="text-gray-500">{{ formatDate(value, 'time') }}</div>
        </div>
      </template>

      <!-- Status Column -->
      <template #cell-active="{ value }">
        <span
          :class="[
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          ]"
        >
          {{ value ? 'Active' : 'Inactive' }}
        </span>
      </template>

      <!-- Actions Column -->
      <template #cell-actions="{ row }">
        <button
          @click="handleViewDetails(row)"
          class="text-accent hover:text-accent-dark font-medium text-sm transition-colors duration-150"
        >
          View Details
        </button>
      </template>
    </AppTable>

    <!-- Empty State when no active account -->
    <div v-if="!accountsStore.activeAccount && !accountsStore.isLoading" class="mt-8">
      <EmptyState
        message="Please select an account to view version history"
      />
    </div>

    <!-- Version Details Modal -->
    <AppModal
      :is-open="isModalOpen"
      title="Version Details"
      size="md"
      @close="closeModal"
    >
      <div v-if="selectedVersion" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Version Number</p>
            <p class="text-lg font-semibold text-gray-900">{{ selectedVersion.version }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                isCurrentVersion(selectedVersion)
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ isCurrentVersion(selectedVersion) ? 'Current Version' : 'Historical Version' }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Balance</p>
              <p class="text-2xl font-bold text-accent">
                {{ formatCurrency(selectedVersion.balance, accountsStore.activeAccount?.currency || 'USD') }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Active Status</p>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  selectedVersion.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ selectedVersion.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-600">Changed By</p>
              <p class="text-base font-medium text-gray-900">{{ selectedVersion.changed_by_id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Changed On</p>
              <p class="text-base font-medium text-gray-900">{{ formatDateTime(selectedVersion.changed_on) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Account ID</p>
              <p class="text-base font-mono text-gray-700 text-sm">{{ selectedVersion.entity_id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Owner ID</p>
              <p class="text-base font-mono text-gray-700 text-sm">{{ selectedVersion.owner_id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Currency</p>
              <p class="text-base font-medium text-gray-900">{{ selectedVersion.currency }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <AppButton
            variant="secondary"
            @click="closeModal"
            class="w-full sm:w-auto"
          >
            Close
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useBalanceStore } from '@/stores/balance'
import AppTable from '@/components/common/AppTable.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import type { Account } from '@/types/account.types'

const accountsStore = useAccountsStore()
const balanceStore = useBalanceStore()

const isModalOpen = ref(false)
const selectedVersion = ref<Account | null>(null)

const columns = [
  { key: 'version', label: 'Version', sortable: false },
  { key: 'balance', label: 'Balance', sortable: false },
  { key: 'changed_by_id', label: 'Actor', sortable: false },
  { key: 'changed_on', label: 'Timestamp', sortable: false },
  { key: 'active', label: 'Status', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false }
]

// Sort versions by changed_on descending (most recent first)
const sortedVersions = computed(() => {
  return [...balanceStore.versions].sort((a, b) => {
    return new Date(b.changed_on).getTime() - new Date(a.changed_on).getTime()
  })
})

// Determine if a version is current (most recent)
const isCurrentVersion = (version: Account) => {
  if (sortedVersions.value.length === 0) return false
  return version.entity_id === sortedVersions.value[0].entity_id && 
         version.version === sortedVersions.value[0].version
}

const fetchVersions = async () => {
  if (accountsStore.activeAccount) {
    try {
      await balanceStore.fetchVersions(accountsStore.activeAccount.entity_id)
      await balanceStore.fetchBalance(accountsStore.activeAccount.entity_id)
    } catch (error) {
      console.error('Failed to fetch version history:', error)
    }
  }
}

const handleViewDetails = (version: Account) => {
  selectedVersion.value = version
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedVersion.value = null
}

// Fetch versions on mount
onMounted(async () => {
  await fetchVersions()
})

// Watch for active account changes
watch(
  () => accountsStore.activeAccountId,
  async (newAccountId) => {
    if (newAccountId) {
      await fetchVersions()
    }
  }
)
</script>
