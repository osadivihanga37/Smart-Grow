import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Show notifications with sound/banner even while the app is in the foreground —
// otherwise validation-error alerts triggered mid-session would be silent.
//Notifications.setNotificationHandler({
//  handleNotification: async () => ({
//    shouldShowAlert: true,
//    shouldPlaySound: true,
//    shouldSetBadge: false,
//  }),
//})

/**
 * Requests notification permission from the OS.
 * Returns 'granted', 'denied', or 'undetermined'.
 * NOTE: iOS/Android notification permissions are only ever granted or denied —
 * there's no separate "while using the app" mode the way there is for location.
 */
export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  if (existingStatus === 'granted') return 'granted'

  const { status } = await Notifications.requestPermissionsAsync()
  return status
}

export async function getNotificationPermissionStatus() {
  const { status } = await Notifications.getPermissionsAsync()
  return status
}

/**
 * Fires an immediate local notification — used for validation errors
 * (bad email format, wrong password, weak new password, etc.) so the
 * farmer gets a device notification in addition to the in-app Alert.
 */
export async function showValidationErrorNotification(title, body) {
  const status = await getNotificationPermissionStatus()
  if (status !== 'granted') return // respect the farmer's permission choice silently

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null, // null trigger = fire immediately
  })
}

/**
 * Schedules a reminder for the next irrigation day, based on the
 * recommendation just given (e.g. "irrigate again in 2 days").
 * daysFromNow should come from your recommendation_note / moisture_deficit
 * logic on the backend — pass whatever interval your irrigation model implies.
 */
export async function scheduleIrrigationReminder(daysFromNow = 1) {
  const status = await getNotificationPermissionStatus()
  if (status !== 'granted') return null

  const triggerDate = new Date()
  triggerDate.setDate(triggerDate.getDate() + daysFromNow)
  triggerDate.setHours(8, 0, 0, 0) // 8 AM on the target day

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Irrigation Reminder',
      body: 'Your next irrigation day has arrived — check the app for today\'s recommendation.',
      sound: true,
    },
    trigger: triggerDate,
  })

  return identifier
}

/**
 * Cancels a previously scheduled irrigation reminder — call this if the
 * farmer irrigates early/manually, or requests a fresh recommendation
 * before the old reminder would have fired.
 */
export async function cancelIrrigationReminder(identifier) {
  if (!identifier) return
  await Notifications.cancelScheduledNotificationAsync(identifier)
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}