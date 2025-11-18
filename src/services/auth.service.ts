import { apiClient } from '@/api/client'
import type { User, LoginCredentials, AuthResponse } from '@/types/auth.types'

class AuthService {
  /**
   * Register a new user with username, email, and password
   */
  async register(username: string, email: string, password: string): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', {
      username,
      email,
      password
    })
    return response.data
  }

  /**
   * Authenticate user with username and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  /**
   * Logout current user
   */
  logout(): void {
    // No API call needed for stateless JWT
    // Token removal handled by store
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  }
}

export const authService = new AuthService()
