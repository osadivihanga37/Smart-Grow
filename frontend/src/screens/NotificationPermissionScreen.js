import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { requestNotificationPermission } from '../services/notifications'

export default function NotificationPermissionScreen() {
  const { markNotificationPrompted } = useAuth()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleAllow = async () => {
    setLoading(true)
    try {
      const status = await requestNotificationPermission()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You can enable notifications later from your device settings.')
      }
    } catch (error) {
      console.log('Notification permission error:', error)
    } finally {
      await markNotificationPrompted()
      setLoading(false)
    }
  }

  const handleDontAllow = async () => {
    await markNotificationPrompted()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.iconCircle}>
          <Ionicons name="notifications" size={64} color="#2E7D32" />
        </View>

        <Text style={styles.title}>{t('stayUpdated', lang)}</Text>
        <Text style={styles.description}>
          {t('notificationPermissionDesc', lang)}
        </Text>

        <TouchableOpacity
          style={styles.allowButton}
          onPress={handleAllow}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.allowButtonText}>{t('allow', lang)}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whileUsingButton}
          onPress={handleAllow}
          disabled={loading}
        >
          <Text style={styles.whileUsingButtonText}>{t('allowWhileUsing', lang)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDontAllow} disabled={loading}>
          <Text style={styles.skipText}>{t('dontAllow', lang)}</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  allowButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  whileUsingButton: {
    borderColor: '#2E7D32',
    borderWidth: 1.5,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  whileUsingButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
})