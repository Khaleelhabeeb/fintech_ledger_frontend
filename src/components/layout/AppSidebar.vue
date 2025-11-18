<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out',
      'lg:translate-x-0 lg:fixed',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Logo/Branding -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-primary-light">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="text-xl font-semibold">Ledger</span>
      </div>
      
      <!-- Mobile close button -->
      <button
        @click="$emit('close')"
        class="lg:hidden p-2 rounded-lg hover:bg-primary-light transition-colors"
        aria-label="Close sidebar"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150',
          'hover:bg-primary-light',
          isActiveRoute(item.path)
            ? 'bg-accent text-white'
            : 'text-gray-300 hover:text-white'
        ]"
        @click="$emit('navigate')"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-primary-light">
      <p class="text-xs text-gray-400">© 2024 Ledger System</p>
    </div>
  </aside>

  <!-- Mobile backdrop -->
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'

// Icons as functional components
const DashboardIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  })
])

const AccountsIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  })
])

const TransactionsIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  })
])

const HistoryIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const SettingsIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }),
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  })
])

interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: false
})

defineEmits<{
  close: []
  navigate: []
}>()

const route = useRoute()

const navigationItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { name: 'accounts', label: 'Accounts', path: '/accounts', icon: AccountsIcon },
  { name: 'transactions', label: 'Transactions', path: '/transactions', icon: TransactionsIcon },
  { name: 'history', label: 'History', path: '/history', icon: HistoryIcon },
  { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsIcon }
]

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
