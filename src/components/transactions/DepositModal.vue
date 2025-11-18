<template>
  <AppModal
    :is-open="isOpen"
    :title="isSuccess ? 'Success!' : 'Deposit Funds'"
    size="md"
    @close="handleClose"
  >
    <!-- Success State -->
    <div v-if="isSuccess" class="text-center py-8">
      <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Deposit Successful!</h3>
      <p class="text-gray-600">
        {{ formatCurrency(parseFloat(amount), currency) }} has been deposited to your account.
      </p>
    </div>

    <!-- Form State -->
    <form v-else @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- Amount Input -->
        <AppInput
          v-model="amount"
          label="Amount"
          type="number"
          placeholder="0.00"
          :error="errors.amount"
          :disabled="isLoading"
          required
          @blur="validateAmountField"
        />

        <!-- Currency Display (read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <div class="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
            {{ currency }}
          </div>
        </div>

        <!-- Info Message -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-800">
            Funds will be deposited to your {{ currency }} account.
          </p>
        </div>
      </div>
    </form>

    <template #footer>
      <!-- Hide footer during success state -->
      <div v-if="!isSuccess" class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
        <AppButton
          variant="secondary"
          :disabled="isLoading"
          @click="handleClose"
          class="w-full sm:w-auto"
        >
          Cancel
        </AppButton>
        <AppButton
          variant="primary"
          :loading="isLoading"
          :disabled="!isFormValid || isLoading"
          @click="handleSubmit"
          class="w-full sm:w-auto"
        >
          Deposit
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAccountsStore } from '@/stores/accounts'
import { useNotificationsStore } from '@/stores/notifications'
import { validateAmount } from '@/utils/validation'
import { formatCurrency } from '@/utils/format'
import type { Currency } from '@/types/common.types'

interface Props {
  isOpen: boolean
  accountId: string
  currency: Currency
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const accountsStore = useAccountsStore()
const notificationsStore = useNotificationsStore()

const amount = ref<string>('')
const errors = ref<{ amount?: string }>({})
const isLoading = ref(false)
const isSuccess = ref(false)

const isFormValid = computed(() => {
  return amount.value && !errors.value.amount && parseFloat(amount.value) > 0
})

const validateAmountField = () => {
  const error = validateAmount(amount.value, {
    min: 0.01,
    maxDecimals: 2,
    fieldName: 'Amount'
  })
  errors.value.amount = error || undefined
}

const handleSubmit = async () => {
  // Validate before submit
  validateAmountField()
  
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  
  try {
    const depositAmount = parseFloat(amount.value)
    await accountsStore.deposit(props.accountId, depositAmount)
    
    // Show success state
    isSuccess.value = true
    
    // Wait 1.5 seconds to show success message, then close
    setTimeout(() => {
      emit('success')
      handleClose()
    }, 1500)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Deposit failed'
    notificationsStore.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  if (!isLoading.value) {
    resetForm()
    emit('close')
  }
}

const resetForm = () => {
  amount.value = ''
  errors.value = {}
  isSuccess.value = false
}

// Watch for modal open to reset form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>
