import type { User, LoginCredentials, AuthResponse } from '@/types/auth.types'

// Simulate network delay
const delay = (ms: number = Math.random() * 300 + 200) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock user data
const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  createdAt: '2024-01-15T10:00:00Z'
}

// Mock JWT token
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAwMDAwfQ.mock-signature'

class AuthMockService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay()

    // Simulate validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required')
    }

    // Simple mock authentication - accept demo credentials or any email with password "password"
    const validPasswords = ['password', 'Demo123!']
    if (!validPasswords.includes(credentials.password)) {
      throw new Error('Invalid credentials')
    }

    return {
      user: mockUser,
      token: mockToken
    }
  }

  async logout(): Promise<void> {
    await delay()
    // Mock logout - no action needed
  }

  async getCurrentUser(): Promise<User> {
    await delay()
    return mockUser
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    await delay()

    // Simulate validation
    if (!email || !password || !name) {
      throw new Error('All fields are required')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Return mock user with provided data
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString()
    }

    return {
      user: newUser,
      token: mockToken
    }
  }
}

export const authMockService = new AuthMockService()
