<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
      <p class="text-sm text-gray-600 mt-1">Manage your profile and preferences</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Settings Content -->
    <div v-else class="settings-content">
      <!-- Profile Information Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="text-lg font-semibold text-gray-900">Profile Information</h2>
          <p class="text-sm text-gray-600 mt-1">View your account details</p>
        </div>

        <div class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">Name</label>
              <p class="info-value">{{ user?.name || 'N/A' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">Email</label>
              <p class="info-value">{{ user?.email || 'N/A' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">Member Since</label>
              <p class="info-value">{{ formatDate(user?.createdAt || '', 'long') }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">User ID</label>
              <p class="info-value text-xs">{{ user?.id || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Default Account Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="text-lg font-semibold text-gray-900">Default Account</h2>
          <p class="text-sm text-gray-600 mt-1">Set your preferred account for multi-currency operations</p>
        </div>

        <div class="section-content">
          <div class="form-group">
            <label for="default-account" class="form-label">
              Default Account
            </label>
            <select
              id="default-account"
              v-model="selectedDefaultAccount"
              class="form-select"
              :disabled="accounts.length === 0"
            >
              <option value="">Select an account</option>
              <option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
              >
                {{ account.currency }} Account - {{ formatCurrency(account.balance, account.currency) }}
              </option>
            </select>
            <p class="form-hint">
              This account will be selected by default when you log in
            </p>
          </div>

          <div class="flex justify-end">
            <AppButton
              variant="primary"
              :loading="isSavingAccount"
              :disabled="!hasAccountChanged"
              @click="saveDefaultAccount"
              class="w-full sm:w-auto"
            >
              Save Default Account
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="text-lg font-semibold text-gray-900">Change Password</h2>
          <p class="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
        </div>

        <div class="section-content">
          <form @submit.prevent="handlePasswordChange">
            <div class="form-group">
              <AppInput
                v-model="passwordForm.currentPassword"
                type="password"
                label="Current Password"
                placeholder="Enter your current password"
                :error="passwordErrors.currentPassword || undefined"
                required
              />
            </div>

            <div class="form-group">
              <AppInput
                v-model="passwordForm.newPassword"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                :error="passwordErrors.newPassword || undefined"
                required
              />
              <p class="form-hint">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div class="form-group">
              <AppInput
                v-model="passwordForm.confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                :error="passwordErrors.confirmPassword || undefined"
                required
              />
            </div>

            <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <AppButton
                variant="secondary"
                type="button"
                :disabled="isChangingPassword"
                @click="resetPasswordForm"
                class="w-full sm:w-auto"
              >
                Cancel
              </AppButton>
              <AppButton
                variant="primary"
                type="submit"
                :loading="isChangingPassword"
                :disabled="!isPasswordFormValid"
                class="w-full sm:w-auto"
              >
                Change Password
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore } from '@/stores/accounts'
import { useNotificationsStore } from '@/stores/notifications'
import { formatCurrency, formatDate } from '@/utils/format'
import { validatePassword, validatePasswordConfirmation } from '@/utils/validation'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const accountsStore = useAccountsStore()
const notificationsStore = useNotificationsStore()

const isLoading = ref(false)
const isSavingAccount = ref(false)
const isChangingPassword = ref(false)

const user = computed(() => authStore.user)
const accounts = computed(() => accountsStore.accounts)
const activeAccountId = computed(() => accountsStore.activeAccountId)

// Default Account Management
const selectedDefaultAccount = ref<string>('')
const initialDefaultAccount = ref<string>('')

const hasAccountChanged = computed(() => {
  return selectedDefaultAccount.value !== initialDefaultAccount.value && selectedDefaultAccount.value !== ''
})

// Password Change Form
interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref<Record<keyof PasswordForm, string | null>>({
  currentPassword: null,
  newPassword: null,
  confirmPassword: null
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword.length > 0 &&
    passwordForm.value.newPassword.length > 0 &&
    passwordForm.value.confirmPassword.length > 0 &&
    !passwordErrors.value.currentPassword &&
    !passwordErrors.value.newPassword &&
    !passwordErrors.value.confirmPassword
  )
})

// Validate password fields on change
watch(() => passwordForm.value.currentPassword, (value) => {
  if (value.length > 0) {
    passwordErrors.value.currentPassword = null
  }
})

watch(() => passwordForm.value.newPassword, (value) => {
  if (value.length > 0) {
    passwordErrors.value.newPassword = validatePassword(value)
  } else {
    passwordErrors.value.newPassword = null
  }
  
  // Re-validate confirmation if it has a value
  if (passwordForm.value.confirmPassword.length > 0) {
    passwordErrors.value.confirmPassword = validatePasswordConfirmation(
      value,
      passwordForm.value.confirmPassword
    )
  }
})

watch(() => passwordForm.value.confirmPassword, (value) => {
  if (value.length > 0) {
    passwordErrors.value.confirmPassword = validatePasswordConfirmation(
      passwordForm.value.newPassword,
      value
    )
  } else {
    passwordErrors.value.confirmPassword = null
  }
})

async function saveDefaultAccount() {
  if (!selectedDefaultAccount.value) {
    notificationsStore.error('Please select an account')
    return
  }

  isSavingAccount.value = true

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    accountsStore.setActiveAccount(selectedDefaultAccount.value)
    initialDefaultAccount.value = selectedDefaultAccount.value
    
    notificationsStore.success('Default account updated successfully')
  } catch (err) {
    notificationsStore.error('Failed to update default account')
  } finally {
    isSavingAccount.value = false
  }
}

async function handlePasswordChange() {
  // Clear previous errors
  passwordErrors.value = {
    currentPassword: null,
    newPassword: null,
    confirmPassword: null
  }

  // Validate current password
  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
    return
  }

  // Validate new password
  const newPasswordError = validatePassword(passwordForm.value.newPassword)
  if (newPasswordError) {
    passwordErrors.value.newPassword = newPasswordError
    return
  }

  // Validate password confirmation
  const confirmError = validatePasswordConfirmation(
    passwordForm.value.newPassword,
    passwordForm.value.confirmPassword
  )
  if (confirmError) {
    passwordErrors.value.confirmPassword = confirmError
    return
  }

  isChangingPassword.value = true

  try {
    // Simulate API call for password change
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real implementation, this would call an auth service method
    // await authService.changePassword({
    //   currentPassword: passwordForm.value.currentPassword,
    //   newPassword: passwordForm.value.newPassword
    // })
    
    notificationsStore.success('Password changed successfully')
    resetPasswordForm()
  } catch (err) {
    passwordErrors.value.currentPassword = 'Current password is incorrect'
    notificationsStore.error('Failed to change password')
  } finally {
    isChangingPassword.value = false
  }
}

function resetPasswordForm() {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordErrors.value = {
    currentPassword: null,
    newPassword: null,
    confirmPassword: null
  }
}

async function loadSettings() {
  isLoading.value = true

  try {
    // Load accounts if not already loaded
    if (accounts.value.length === 0) {
      await accountsStore.fetchAccounts()
    }

    // Set initial default account
    if (activeAccountId.value) {
      selectedDefaultAccount.value = activeAccountId.value
      initialDefaultAccount.value = activeAccountId.value
    }
  } catch (err) {
    notificationsStore.error('Failed to load settings')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadSettings()
})
</script>

<style scoped>
.settings-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-content {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-size: 1rem;
  font-weight: 400;
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #111827;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .settings-page {
    padding: 2rem;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-header {
    padding: 2rem;
  }

  .section-content {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .settings-page {
    padding: 2.5rem;
  }
}
</style>
