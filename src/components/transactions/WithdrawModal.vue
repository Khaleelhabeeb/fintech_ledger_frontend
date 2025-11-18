<template>
  <AppModal
    :is-open="isOpen"
    :title="step === 3 ? 'Success!' : 'Withdraw Funds'"
    size="md"
    @close="handleClose"
  >
    <!-- Step 3: Success State -->
    <div v-if="step === 3" class="text-center py-8">
      <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Withdrawal Successful!</h3>
      <p class="text-gray-600">
        {{ formatCurrency(parseFloat(amount), currency) }} has been withdrawn from your account.
      </p>
    </div>

    <!-- Step 1: Amount Entry -->
    <div v-else-if="step === 1">
      <form @submit.prevent="handleNext">
        <div class="space-y-4">
          <!-- Current Balance Display -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Available Balance</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatCurrency(balance, currency) }}
            </p>
          </div>

          <!-- Amount Input -->
          <AppInput
            v-model="amount"
            label="Withdrawal Amount"
            type="number"
            placeholder="0.00"
            :error="errors.amount"
            :disabled="isLoading"
            required
            @blur="validateAmountField"
          />

          <!-- Warning Message -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-sm text-yellow-800">
              Please ensure you have sufficient balance before proceeding.
            </p>
          </div>
        </div>
      </form>
    </div>

    <!-- Step 2: Confirmation -->
    <div v-else-if="step === 2">
      <div class="space-y-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-red-900 mb-2">
            Confirm Withdrawal
          </h4>
          <p class="text-sm text-red-800 mb-3">
            You are about to withdraw {{ formatCurrency(parseFloat(amount), currency) }} from your account.
          </p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-red-700">Current Balance:</span>
              <span class="font-medium text-red-900">{{ formatCurrency(balance, currency) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-red-700">Withdrawal Amount:</span>
              <span class="font-medium text-red-900">{{ formatCurrency(parseFloat(amount), currency) }}</span>
            </div>
            <div class="border-t border-red-300 pt-2 flex justify-between">
              <span class="text-red-700 font-semibold">New Balance:</span>
              <span class="font-semibold text-red-900">
                {{ formatCurrency(balance - parseFloat(amount), currency) }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600">
          This action cannot be undone. Please confirm to proceed with the withdrawal.
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Hide footer during success state -->
      <div v-if="step !== 3" class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
        <AppButton
          v-if="step === 1"
          variant="secondary"
          :disabled="isLoading"
          @click="handleClose"
          class="w-full sm:w-auto"
        >
          Cancel
        </AppButton>
        <AppButton
          v-if="step === 1"
          variant="primary"
          :disabled="!isFormValid || isLoading"
          @click="handleNext"
          class="w-full sm:w-auto"
        >
          Next
        </AppButton>

        <AppButton
          v-if="step === 2"
          variant="secondary"
          :disabled="isLoading"
          @click="handleBack"
          class="w-full sm:w-auto"
        >
          Back
        </AppButton>
        <AppButton
          v-if="step === 2"
          variant="danger"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleConfirm"
          class="w-full sm:w-auto"
        >
          Confirm Withdrawal
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
import { useBalanceStore } from '@/stores/balance'
import { useNotificationsStore } from '@/stores/notifications'
import { validateWithdrawal } from '@/utils/validation'
import { formatCurrency } from '@/utils/format'
import type { Currency } from '@/types/common.types'

interface Props {
  isOpen: boolean
  accountId: string
  balance: number
  currency: Currency
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const balanceStore = useBalanceStore()
const notificationsStore = useNotificationsStore()

const amount = ref<string>('')
const errors = ref<{ amount?: string }>({})
const isLoading = ref(false)
const step = ref<1 | 2 | 3>(1)
const isSuccess = ref(false)

const isFormValid = computed(() => {
  return amount.value && !errors.value.amount && parseFloat(amount.value) > 0
})

const validateAmountField = () => {
  const error = validateWithdrawal(amount.value, props.balance)
  errors.value.amount = error || undefined
}

const handleNext = () => {
  // Validate before moving to confirmation
  validateAmountField()
  
  if (!isFormValid.value) {
    return
  }

  step.value = 2
}

const handleBack = () => {
  step.value = 1
}

const handleConfirm = async () => {
  isLoading.value = true
  
  try {
    const withdrawAmount = parseFloat(amount.value)
    await balanceStore.withdraw(props.accountId, withdrawAmount)
    
    // Show success state
    step.value = 3
    
    // Wait 1.5 seconds to show success message, then close
    setTimeout(() => {
      emit('success')
      handleClose()
    }, 1500)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed'
    notificationsStore.error(errorMessage)
    // Go back to step 1 on error
    step.value = 1
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
  step.value = 1
}

// Watch for modal open to reset form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>
