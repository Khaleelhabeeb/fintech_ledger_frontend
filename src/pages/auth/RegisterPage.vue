<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-primary">Create an account</h2>
      <p class="text-gray-600 mt-1">Get started with your financial management</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Username Input -->
      <AppInput
        v-model="formData.username"
        label="Username"
        type="text"
        placeholder="Choose a username"
        :error="errors.username"
        :disabled="isLoading"
        required
        @blur="validateField('username')"
      />

      <!-- Email Input -->
      <AppInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        :error="errors.email"
        :disabled="isLoading"
        required
        @blur="validateField('email')"
      />

      <!-- Password Input -->
      <AppInput
        v-model="formData.password"
        label="Password"
        type="password"
        placeholder="Create a password"
        :error="errors.password"
        :disabled="isLoading"
        required
        @blur="validateField('password')"
        hint="At least 8 characters with uppercase, lowercase, and number"
      />

      <!-- Confirm Password Input -->
      <AppInput
        v-model="formData.confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        :error="errors.confirmPassword"
        :disabled="isLoading"
        required
        @blur="validateField('confirmPassword')"
      />

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-green-700">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <AppButton
        type="submit"
        variant="primary"
        :loading="isLoading"
        :disabled="isLoading"
        class="w-full"
      >
        {{ isLoading ? 'Creating account...' : 'Create account' }}
      </AppButton>
    </form>

    <!-- Login Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <router-link
          to="/auth/login"
          class="font-medium text-accent hover:text-accent-dark transition-colors"
        >
          Sign in
        </router-link>
      </p>
    </div>

    <!-- Demo Notice -->
    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-xs font-medium text-yellow-900 mb-1">Demo Mode</p>
      <p class="text-xs text-yellow-700">
        This is a demo registration form. In production, this would create a real account.
        For now, please use the demo credentials on the login page.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateRequired
} from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Form errors
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Loading and message states
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Validate individual field
const validateField = (field: keyof typeof formData) => {
  switch (field) {
    case 'username':
      errors.username = validateRequired(formData.username, 'Username') || ''
      break
    case 'email':
      errors.email = validateEmail(formData.email) || ''
      break
    case 'password':
      errors.password = validatePassword(formData.password) || ''
      break
    case 'confirmPassword':
      errors.confirmPassword = validatePasswordConfirmation(
        formData.password,
        formData.confirmPassword
      ) || ''
      break
  }
}

// Validate entire form
const validateForm = (): boolean => {
  validateField('username')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  
  return !errors.username && !errors.email && !errors.password && !errors.confirmPassword
}

// Handle form submission
const handleSubmit = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  // Validate form
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Call the auth service to register the user
    await authStore.register(
      formData.username,
      formData.email,
      formData.password
    )

    successMessage.value = 'Account created successfully! Redirecting to login...'

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
