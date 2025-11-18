<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            :class="modalClasses"
            class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl transform transition-all w-full sm:w-auto"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1 flex-shrink-0"
                @click="handleClose"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div class="px-4 sm:px-6 py-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg sm:rounded-b-lg">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  close: []
}>()

const modalClasses = computed(() => {
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl'
  }
  
  return sizeClasses[props.size]
})

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.isOpen) {
    handleClose()
  }
}

// Handle body scroll lock
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
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
