<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Dialog Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-md"
            @click.stop
          >
            <!-- Icon -->
            <div class="px-6 pt-6 pb-4">
              <div
                :class="[
                  'mx-auto flex items-center justify-center h-12 w-12 rounded-full',
                  variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                ]"
              >
                <svg
                  v-if="variant === 'danger'"
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <svg
                  v-else
                  class="h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <!-- Content -->
            <div class="px-6 pb-4 text-center">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ message }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-150"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                :class="[
                  'inline-flex justify-center items-center px-4 py-2 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150',
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-accent hover:bg-accent-dark focus:ring-accent'
                ]"
                :disabled="loading"
                @click="handleConfirm"
              >
                <span v-if="loading" class="inline-block animate-spin mr-2">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
  loading: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen && !props.loading) {
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
