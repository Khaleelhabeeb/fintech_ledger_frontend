import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Wait for auth initialization to complete
    if (!authStore.isInitialized) {
      // Wait a bit for initialization
      let attempts = 0
      while (!authStore.isInitialized && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
    }
    
    // Check if route requires authentication
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (requiresAuth && !authStore.isAuthenticated) {
      // Redirect to login page with return URL
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
      // Redirect authenticated users away from login page
      next({ name: 'Dashboard' })
    } else {
      // Allow navigation
      next()
    }
  })
}
