export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY'

export interface LoadingState {
  isLoading: boolean
  error: string | null
}
