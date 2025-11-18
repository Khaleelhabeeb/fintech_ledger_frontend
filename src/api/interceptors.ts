import { apiClient } from './client'
import type { AxiosError } from 'axios'

/**
 * Initialize API interceptors for request and response handling
 * This should be called once during application initialization
 */
export function initializeInterceptors() {
  // Request interceptor - attach JWT token to all requests
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle global errors
  apiClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError<{ detail?: string }>) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        // Clear auth token
        localStorage.removeItem('access_token')
        localStorage.removeItem('active_account_id')
        
        // Redirect to login page
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }
      }

      // Extract error message from FastAPI detail field
      if (error.response?.data?.detail) {
        const detailMessage = error.response.data.detail
        // Create a new error with the detail message for better error handling
        const enhancedError = new Error(detailMessage) as AxiosError<{ detail?: string }>
        enhancedError.response = error.response
        enhancedError.request = error.request
        enhancedError.config = error.config
        return Promise.reject(enhancedError)
      }

      // Handle other error status codes
      if (error.response?.status === 403) {
        console.error('Forbidden: You do not have permission to perform this action')
      } else if (error.response?.status === 404) {
        console.error('Not Found: The requested resource was not found')
      } else if (error.response?.status && error.response.status >= 500) {
        console.error('Server Error: Please try again later')
      }

      return Promise.reject(error)
    }
  )
}
