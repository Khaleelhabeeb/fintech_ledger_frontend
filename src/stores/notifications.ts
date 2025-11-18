import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration: number
  timestamp: number
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  let notificationIdCounter = 0

  function addNotification(type: NotificationType, message: string, duration: number = 5000) {
    const id = `notification-${++notificationIdCounter}-${Date.now()}`
    const notification: Notification = {
      id,
      type,
      message,
      duration,
      timestamp: Date.now()
    }

    notifications.value.push(notification)

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number) {
    return addNotification('success', message, duration)
  }

  function error(message: string, duration?: number) {
    return addNotification('error', message, duration)
  }

  function info(message: string, duration?: number) {
    return addNotification('info', message, duration)
  }

  function warning(message: string, duration?: number) {
    return addNotification('warning', message, duration)
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
    clearAll
  }
})
