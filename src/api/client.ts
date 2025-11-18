import axios, { type AxiosInstance } from 'axios'

// API base URL for FastAPI backend
const API_BASE_URL = 'https://bankingledger-qnxkl.ondigitalocean.app/api/v1'

// Create Axios instance with configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
