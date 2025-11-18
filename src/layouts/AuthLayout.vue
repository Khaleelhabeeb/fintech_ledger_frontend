<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Branding -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-2xl mb-3 sm:mb-4">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-primary">Ledger System</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Secure financial management</p>
      </div>

      <!-- Content slot for login/register forms -->
      <div class="bg-white rounded-lg shadow-card p-6 sm:p-8">
        <router-view />
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 sm:mt-8">
        <p class="text-xs sm:text-sm text-gray-500">© 2024 Ledger System. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this simple layout
</script>
