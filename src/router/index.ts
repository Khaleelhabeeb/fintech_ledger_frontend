import { createRouter, createWebHistory } from 'vue-router'
import { setupAuthGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/pages/auth/LoginPage.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/pages/auth/RegisterPage.vue')
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'accounts',
          name: 'Accounts',
          component: () => import('@/pages/AccountsPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'transactions',
          name: 'Transactions',
          component: () => import('@/pages/TransactionsPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'history',
          name: 'History',
          component: () => import('@/pages/HistoryPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/pages/SettingsPage.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

// Setup authentication guard
setupAuthGuard(router)

export default router
