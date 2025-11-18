/**
 * Currency formatting utilities
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
}

const CURRENCY_LOCALES: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP'
}

/**
 * Format a number as currency with the appropriate symbol and decimal places
 * @param amount - The amount to format
 * @param currency - The currency code (USD, EUR, GBP, JPY)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const locale = CURRENCY_LOCALES[currency]
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2
  }

  return new Intl.NumberFormat(locale, options).format(amount)
}

/**
 * Format a number with thousand separators
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount)
}

/**
 * Date formatting utilities
 */

/**
 * Format a date string or Date object to a readable format
 * @param date - ISO date string or Date object
 * @param format - Format type ('short', 'medium', 'long', 'time')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'time' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  switch (format) {
    case 'short':
      // e.g., "11/17/2025"
      return dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    
    case 'medium':
      // e.g., "Nov 17, 2025"
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    
    case 'long':
      // e.g., "November 17, 2025"
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    
    case 'time':
      // e.g., "2:30 PM"
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    
    default:
      return dateObj.toLocaleDateString('en-US')
  }
}

/**
 * Format a date with time
 * @param date - ISO date string or Date object
 * @returns Formatted date and time string (e.g., "Nov 17, 2025 at 2:30 PM")
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) {
    return 'just now'
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`
  } else if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`
  } else {
    return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`
  }
}

/**
 * Format a date to ISO string for API requests
 * @param date - Date object
 * @returns ISO date string (e.g., "2025-11-17")
 */
export function formatDateForAPI(date: Date): string {
  const isoString = date.toISOString().split('T')[0]
  return isoString || ''
}
