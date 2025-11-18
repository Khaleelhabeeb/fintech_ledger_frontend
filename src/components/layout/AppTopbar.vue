<template>
  <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
    <!-- Left section: Mobile menu button -->
    <div class="flex items-center space-x-4">
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Right section: Account selector and user menu -->
    <div class="flex items-center space-x-4">
      <!-- Account Selector Dropdown -->
      <div class="relative" v-if="accountsStore.accounts.length > 0">
        <button
          @click="toggleAccountDropdown"
          class="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors bg-white"
          :disabled="accountsStore.isLoading"
        >
          <svg class="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <div class="text-left hidden sm:block">
            <div class="text-sm font-medium text-gray-900">
              {{ activeAccount?.currency || 'Select Account' }}
            </div>
            <div class="text-xs text-gray-500" v-if="activeAccount">
              {{ formatCurrency(activeAccount.balance, activeAccount.currency) }}
            </div>
          </div>
          <!-- Mobile: Show only currency code -->
          <span class="text-sm font-medium text-gray-900 sm:hidden">
            {{ activeAccount?.currency || 'Account' }}
          </span>
          <svg class="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Account Dropdown Menu -->
        <div
          v-if="isAccountDropdownOpen"
          class="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-[80vh] overflow-y-auto"
        >
          <div class="px-4 py-2 border-b border-gray-200">
            <p class="text-xs font-semibold text-gray-500 uppercase">Select Account</p>
          </div>
          <button
            v-for="account in accountsStore.accounts"
            :key="account.id"
            @click="selectAccount(account.id)"
            :class="[
              'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between',
              account.id === activeAccount?.id ? 'bg-accent-light bg-opacity-10' : ''
            ]"
          >
            <div class="min-w-0 flex-1">
              <div class="font-medium text-gray-900">{{ account.currency }}</div>
              <div class="text-sm text-gray-600 truncate">{{ formatCurrency(account.balance, account.currency) }}</div>
            </div>
            <svg
              v-if="account.id === activeAccount?.id"
              class="w-5 h-5 text-accent flex-shrink-0 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- User Menu Dropdown -->
      <div class="relative">
        <button
          @click="toggleUserDropdown"
          class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span class="text-sm font-semibold text-white">
              {{ userInitials }}
            </span>
          </div>
          <svg class="w-4 h-4 text-gray-600 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- User Dropdown Menu -->
        <div
          v-if="isUserDropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <div class="px-4 py-3 border-b border-gray-200">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name || 'User' }}</p>
            <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email || '' }}</p>
          </div>
          <router-link
            to="/settings"
            @click="closeUserDropdown"
            class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm">Settings</span>
          </router-link>
          <button
            @click="handleLogout"
            class="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600 border-t border-gray-200 mt-2 pt-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Click outside to close dropdowns -->
  <div
    v-if="isAccountDropdownOpen || isUserDropdownOpen"
    @click="closeAllDropdowns"
    class="fixed inset-0 z-40"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore } from '@/stores/accounts'
import { formatCurrency } from '@/utils/format'

defineEmits<{
  'toggle-sidebar': []
}>()

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const isAccountDropdownOpen = ref(false)
const isUserDropdownOpen = ref(false)

const activeAccount = computed(() => accountsStore.activeAccount)

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    if (first && second) {
      return (first + second).toUpperCase()
    }
  }
  return name.substring(0, 2).toUpperCase()
})

function toggleAccountDropdown() {
  isAccountDropdownOpen.value = !isAccountDropdownOpen.value
  isUserDropdownOpen.value = false
}

function toggleUserDropdown() {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
  isAccountDropdownOpen.value = false
}

function closeAllDropdowns() {
  isAccountDropdownOpen.value = false
  isUserDropdownOpen.value = false
}

function closeUserDropdown() {
  isUserDropdownOpen.value = false
}

function selectAccount(accountId: string) {
  accountsStore.setActiveAccount(accountId)
  isAccountDropdownOpen.value = false
}

async function handleLogout() {
  authStore.logout()
  closeAllDropdowns()
  await router.push('/auth/login')
}

// Close dropdowns on escape key
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeAllDropdowns()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
