import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { User, LoginCredentials } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function register(username: string, email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      await authService.register(username, email, password)
      // Registration successful, user should now login
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      token.value = response.access_token
      localStorage.setItem('access_token', response.access_token)
      
      // Fetch user data after successful login
      await getCurrentUser()
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
      isInitialized.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user'
      isInitialized.value = true
      // Clear invalid token
      logout()
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
    localStorage.removeItem('access_token')
    error.value = null
  }

  // Allow setting isInitialized from outside
  function setInitialized(value: boolean) {
    isInitialized.value = value
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    register,
    login,
    logout,
    getCurrentUser,
    setInitialized
  }
})
