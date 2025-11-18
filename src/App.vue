<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAppReady = ref(false)

onMounted(() => {
  // Show app immediately if no token or already initialized
  if (!authStore.token || authStore.isInitialized) {
    isAppReady.value = true
  } else {
    // Wait briefly for auth initialization
    const checkInterval = setInterval(() => {
      if (authStore.isInitialized) {
        isAppReady.value = true
        clearInterval(checkInterval)
      }
    }, 50)
    
    // Force show after 1 second max
    setTimeout(() => {
      isAppReady.value = true
      clearInterval(checkInterval)
    }, 1000)
  }
})
</script>

<template>
  <!-- Loading Screen -->
  <div
    v-if="!isAppReady"
    class="fixed inset-0 bg-background flex items-center justify-center"
  >
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-4 animate-pulse">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-primary mb-2">Ledger System</h1>
      <div class="flex items-center justify-center space-x-2">
        <div class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  </div>

  <!-- Main App -->
  <router-view v-else />
</template>
