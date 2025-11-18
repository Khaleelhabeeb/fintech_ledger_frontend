<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <AppSidebar
      :is-open="isSidebarOpen"
      @close="closeSidebar"
      @navigate="handleNavigate"
    />

    <!-- Main content area -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <!-- Topbar -->
      <AppTopbar @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main class="flex-1 p-4 lg:p-6">
        <router-view />
      </main>
    </div>

    <!-- Notification Toast Container -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import NotificationToast from '@/components/layout/NotificationToast.vue'

const accountsStore = useAccountsStore()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function handleNavigate() {
  // Close sidebar on mobile after navigation
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
}

// Initialize data on mount
onMounted(async () => {
  // Fetch user if not already loaded
  if (!authStore.user && authStore.token) {
    await authStore.getCurrentUser()
  }
  
  // Fetch accounts if not already loaded
  if (accountsStore.accounts.length === 0) {
    await accountsStore.fetchAccounts()
  }
})
</script>
