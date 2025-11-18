export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY'

export interface LoadingState {
  isLoading: boolean
  error: string | null
}
