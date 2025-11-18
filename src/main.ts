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

// Mount the app immediately - don't wait for auth
app.mount('#app')

// Initialize auth in the background after mounting
const authStore = useAuthStore()
if (authStore.token) {
  // Fetch user in background without blocking
  authStore.getCurrentUser().catch(() => {
    console.log('Failed to restore user session')
  })
} else {
  // Mark as initialized if no token
  authStore.setInitialized(true)
}
