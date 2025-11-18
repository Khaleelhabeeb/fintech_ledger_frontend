import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { User, LoginCredentials } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('auth_token', response.token)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getCurrentUser() {
    if (!token.value) {
      isInitialized.value = true
      return
    }
    
    isLoading.value = true
    error.value = null
    try {
      user.value = await authService.getCurrentUser()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user'
      // Clear invalid token
      logout()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    error.value = null
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    login,
    logout,
    getCurrentUser
  }
})
