/**
 * Validation utilities for forms and user input
 */

/**
 * Email validation
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Get email validation error message
 * @param email - Email address to validate
 * @returns Error message or null if valid
 */
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required'
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address'
  }

  return null
}

/**
 * Password validation
 */

export interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumber: boolean
  requireSpecialChar: boolean
}

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false
}

/**
 * Validate password against requirements
 * @param password - Password to validate
 * @param requirements - Password requirements (optional)
 * @returns True if password meets requirements, false otherwise
 */
export function isValidPassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): boolean {
  if (!password || typeof password !== 'string') {
    return false
  }

  if (password.length < requirements.minLength) {
    return false
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    return false
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    return false
  }

  if (requirements.requireNumber && !/\d/.test(password)) {
    return false
  }

  if (requirements.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false
  }

  return true
}

/**
 * Get password validation error message
 * @param password - Password to validate
 * @param requirements - Password requirements (optional)
 * @returns Error message or null if valid
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): string | null {
  if (!password) {
    return 'Password is required'
  }

  if (password.length < requirements.minLength) {
    return `Password must be at least ${requirements.minLength} characters long`
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }

  if (requirements.requireNumber && !/\d/.test(password)) {
    return 'Password must contain at least one number'
  }

  if (requirements.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character'
  }

  return null
}

/**
 * Validate password confirmation matches
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message or null if valid
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }

  return null
}

/**
 * Amount validation
 */

/**
 * Validate amount is a positive number
 * @param amount - Amount to validate
 * @returns True if amount is valid, false otherwise
 */
export function isValidAmount(amount: number | string): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount) || numAmount <= 0) {
    return false
  }

  return true
}

/**
 * Validate amount with maximum decimal places
 * @param amount - Amount to validate
 * @param maxDecimals - Maximum number of decimal places (default: 2)
 * @returns True if amount has valid decimal places, false otherwise
 */
export function hasValidDecimals(amount: number | string, maxDecimals: number = 2): boolean {
  const amountStr = typeof amount === 'number' ? amount.toString() : amount
  const decimalPart = amountStr.split('.')[1]

  if (!decimalPart) {
    return true
  }

  return decimalPart.length <= maxDecimals
}

/**
 * Get amount validation error message
 * @param amount - Amount to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 */
export function validateAmount(
  amount: number | string,
  options: {
    min?: number
    max?: number
    maxDecimals?: number
    fieldName?: string
  } = {}
): string | null {
  const {
    min = 0.01,
    max,
    maxDecimals = 2,
    fieldName = 'Amount'
  } = options

  if (amount === '' || amount === null || amount === undefined) {
    return `${fieldName} is required`
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return `${fieldName} must be a valid number`
  }

  if (numAmount <= 0) {
    return `${fieldName} must be greater than zero`
  }

  if (numAmount < min) {
    return `${fieldName} must be at least ${min}`
  }

  if (max !== undefined && numAmount > max) {
    return `${fieldName} cannot exceed ${max}`
  }

  if (!hasValidDecimals(amount, maxDecimals)) {
    return `${fieldName} can have at most ${maxDecimals} decimal places`
  }

  return null
}

/**
 * Validate withdrawal amount against available balance
 * @param amount - Amount to withdraw
 * @param balance - Available balance
 * @returns Error message or null if valid
 */
export function validateWithdrawal(amount: number | string, balance: number): string | null {
  const basicValidation = validateAmount(amount, { fieldName: 'Withdrawal amount' })
  
  if (basicValidation) {
    return basicValidation
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (numAmount > balance) {
    return 'Insufficient balance for this withdrawal'
  }

  return null
}

/**
 * General validation utilities
 */

/**
 * Check if a string is empty or only whitespace
 * @param value - String to check
 * @returns True if empty, false otherwise
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateRequired(value: string | null | undefined, fieldName: string): string | null {
  if (isEmpty(value)) {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Validate minimum length
 * @param value - Value to validate
 * @param minLength - Minimum length
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`
  }
  return null
}

/**
 * Validate maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum length
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | null {
  if (value.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters`
  }
  return null
}
