<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-primary">Welcome back</h2>
      <p class="text-gray-600 mt-1">Sign in to your account to continue</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Username Input -->
      <AppInput
        v-model="formData.username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        :error="errors.username"
        :disabled="authStore.isLoading"
        required
        @blur="validateField('username')"
      />

      <!-- Password Input -->
      <AppInput
        v-model="formData.password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        :error="errors.password"
        :disabled="authStore.isLoading"
        required
        @blur="validateField('password')"
      />

      <!-- Error Message from Auth Store -->
      <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-700">{{ authStore.error }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <AppButton
        type="submit"
        variant="primary"
        :loading="authStore.isLoading"
        :disabled="authStore.isLoading"
        class="w-full"
      >
        {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
      </AppButton>
    </form>

    <!-- Register Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <router-link
          to="/auth/register"
          class="font-medium text-accent hover:text-accent-dark transition-colors"
        >
          Create one
        </router-link>
      </p>
    </div>

    <!-- Demo Credentials -->
    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
      <p class="text-xs text-blue-700">username: alice</p>
      <p class="text-xs text-blue-700">Password: alice12345</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { validateRequired, validatePassword } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const formData = reactive({
  username: '',
  password: ''
})

// Form errors
const errors = reactive({
  username: '',
  password: ''
})

// Validate individual field
const validateField = (field: 'username' | 'password') => {
  if (field === 'username') {
    errors.username = validateRequired(formData.username, 'Username') || ''
  } else if (field === 'password') {
    errors.password = validatePassword(formData.password, {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumber: false,
      requireSpecialChar: false
    }) || ''
  }
}

// Validate entire form
const validateForm = (): boolean => {
  validateField('username')
  validateField('password')
  
  return !errors.username && !errors.password
}

// Handle form submission
const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    // Attempt login
    await authStore.login({
      username: formData.username,
      password: formData.password
    })

    // Redirect to dashboard on success
    router.push('/dashboard')
  } catch (error) {
    // Error is already handled by the auth store
    console.error('Login failed:', error)
  }
}
</script>
