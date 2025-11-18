import './assets/styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { initializeInterceptors } from './api/interceptors'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

// Global error handler for uncaught errors
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
  console.error('Component instance:', instance)
  
  // You can also send errors to a logging service here
  // Example: errorLoggingService.log(err, info)
}

// Register Pinia first (required for stores)
app.use(createPinia())

// Initialize API interceptors
initializeInterceptors()

// Register Vue Router
app.use(router)

// Initialize auth store to check for existing token BEFORE mounting
const authStore = useAuthStore()

// Use an async IIFE to handle initialization
;(async () => {
  if (authStore.token) {
    // Attempt to fetch current user if token exists
    try {
      await authStore.getCurrentUser()
    } catch (error) {
      // If fetching user fails, the auth store will handle logout
      console.log('Failed to restore user session')
    }
  }
  
  // Mount the app after auth initialization
  app.mount('#app')
})()
