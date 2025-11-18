<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <!-- Icon -->
    <div class="mb-4">
      <slot name="icon">
        <svg
          class="h-16 w-16 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </slot>
    </div>
    
    <!-- Title -->
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>
    
    <!-- Message -->
    <p class="text-sm text-gray-500 text-center max-w-sm mb-6">
      {{ message }}
    </p>
    
    <!-- Action Button -->
    <div v-if="actionText || $slots.action">
      <slot name="action">
        <button
          v-if="actionText"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-150"
          @click="handleAction"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message: string
  actionText?: string
}

defineProps<Props>()

const emit = defineEmits<{
  action: []
}>()

const handleAction = () => {
  emit('action')
}
</script>
