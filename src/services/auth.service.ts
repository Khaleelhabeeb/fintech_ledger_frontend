import { apiClient, USE_MOCK } from '@/api/client'
import { authMockService } from './mock/auth.mock'
import type { User, LoginCredentials, AuthResponse } from '@/types/auth.types'

class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      return authMockService.login(credentials)
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    if (USE_MOCK) {
      return authMockService.logout()
    }

    await apiClient.post('/auth/logout')
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      return authMockService.getCurrentUser()
    }

    const response = await apiClient.get<User>('/auth/me')
    return response.data
  }
}

export const authService = new AuthService()
