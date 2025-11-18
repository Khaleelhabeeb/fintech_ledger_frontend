import axios, { type AxiosInstance } from 'axios'

// Environment variables with defaults
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create Axios instance with configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export { USE_MOCK }
