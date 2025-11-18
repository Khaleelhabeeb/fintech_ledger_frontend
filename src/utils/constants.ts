/**
 * Application-wide constants
 */

/**
 * Currency constants
 */
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'] as const
export type Currency = typeof CURRENCIES[number]

export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen'
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
}

/**
 * Pagination constants
 */
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export const MAX_PAGE_SIZE = 100
export const MIN_PAGE_SIZE = 5

/**
 * Transaction constants
 */
export const TRANSACTION_TYPES = ['DEPOSIT', 'WITHDRAW'] as const
export type TransactionType = typeof TRANSACTION_TYPES[number]

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdrawal'
}

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  DEPOSIT: 'text-green-600',
  WITHDRAW: 'text-red-600'
}

/**
 * Date format constants
 */
export const DATE_FORMAT_SHORT = 'short'
export const DATE_FORMAT_MEDIUM = 'medium'
export const DATE_FORMAT_LONG = 'long'
export const DATE_FORMAT_TIME = 'time'

/**
 * API constants
 */
export const API_TIMEOUT = 10000 // 10 seconds
export const API_RETRY_ATTEMPTS = 3
export const API_RETRY_DELAY = 1000 // 1 second

/**
 * Authentication constants
 */
export const AUTH_TOKEN_KEY = 'auth_token'
export const ACTIVE_ACCOUNT_KEY = 'active_account_id'
export const TOKEN_EXPIRY_BUFFER = 300 // 5 minutes in seconds

/**
 * Notification constants
 */
export const NOTIFICATION_DURATION = 5000 // 5 seconds
export const NOTIFICATION_MAX_QUEUE = 5

export const NOTIFICATION_TYPES = ['success', 'error', 'info', 'warning'] as const
export type NotificationType = typeof NOTIFICATION_TYPES[number]

/**
 * Validation constants
 */
export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 128
export const MIN_AMOUNT = 0.01
export const MAX_AMOUNT_DECIMALS = 2

/**
 * UI constants
 */
export const MOBILE_BREAKPOINT = 768 // pixels
export const TABLET_BREAKPOINT = 1024 // pixels
export const DESKTOP_BREAKPOINT = 1280 // pixels

export const SIDEBAR_WIDTH = 256 // pixels
export const SIDEBAR_COLLAPSED_WIDTH = 64 // pixels
export const TOPBAR_HEIGHT = 64 // pixels

/**
 * Chart constants
 */
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#1E293B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#06B6D4'
}

export const CHART_DEFAULT_HEIGHT = 300 // pixels
export const CHART_MAX_DATA_POINTS = 30

/**
 * Loading states
 */
export const LOADING_DELAY = 300 // milliseconds before showing loader
export const MIN_LOADING_TIME = 500 // minimum time to show loader

/**
 * Mock service constants
 */
export const MOCK_NETWORK_DELAY_MIN = 200 // milliseconds
export const MOCK_NETWORK_DELAY_MAX = 500 // milliseconds

/**
 * Route names
 */
export const ROUTE_NAMES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  DASHBOARD: 'Dashboard',
  ACCOUNTS: 'Accounts',
  TRANSACTIONS: 'Transactions',
  HISTORY: 'History',
  SETTINGS: 'Settings'
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: AUTH_TOKEN_KEY,
  ACTIVE_ACCOUNT: ACTIVE_ACCOUNT_KEY,
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme'
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  INVALID_AMOUNT: 'Please enter a valid amount.',
  GENERIC_ERROR: 'An error occurred. Please try again.'
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  DEPOSIT_SUCCESS: 'Deposit completed successfully',
  WITHDRAW_SUCCESS: 'Withdrawal completed successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  PASSWORD_CHANGED: 'Password changed successfully'
} as const

/**
 * Empty state messages
 */
export const EMPTY_STATE_MESSAGES = {
  NO_ACCOUNTS: 'No accounts found',
  NO_TRANSACTIONS: 'No transactions yet',
  NO_VERSIONS: 'No version history available',
  NO_RESULTS: 'No results found'
} as const

/**
 * Button variants
 */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'danger', 'ghost'] as const
export type ButtonVariant = typeof BUTTON_VARIANTS[number]

/**
 * Input types
 */
export const INPUT_TYPES = ['text', 'email', 'password', 'number', 'date'] as const
export type InputType = typeof INPUT_TYPES[number]

/**
 * Modal sizes
 */
export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl'] as const
export type ModalSize = typeof MODAL_SIZES[number]

/**
 * Table sort directions
 */
export const SORT_DIRECTIONS = ['asc', 'desc'] as const
export type SortDirection = typeof SORT_DIRECTIONS[number]
