import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { updateLocation } from '../services/api'
import { isWithinServiceArea, SERVICE_AREA_NAME } from '../utils/serviceArea'

export default function LocationPermissionScreen() {
  const { markLocationPrompted } = useAuth()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [outOfServiceArea, setOutOfServiceArea] = useState(false)

  const handleAllowLocation = async () => {
    setLoading(true)
    setOutOfServiceArea(false)
    try {
      // TEMPORARY — bypass real GPS for testing, remove before submission
      const latitude = 7.8567
      const longitude = 80.6517

      if (!isWithinServiceArea(latitude, longitude)) {
        setOutOfServiceArea(true)
        return
      }

      await updateLocation(latitude, longitude)
      await markLocationPrompted()
    } catch (error) {
      console.log('Location error:', error)
      Alert.alert('Error', t('couldNotDetectLocation', lang))
    } finally {
      setLoading(false)
    }
  }

  if (outOfServiceArea) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, styles.iconCircleError]}>
            <Ionicons name="alert-circle" size={64} color="#C62828" />
          </View>

          <Text style={styles.title}>{t('outsideServiceArea', lang)}</Text>
          <Text style={styles.description}>
            {t('outsideServiceAreaDesc', lang)}
          </Text>

          <TouchableOpacity
            style={styles.allowButton}
            onPress={handleAllowLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.allowButtonText}>{t('checkAgain', lang)}</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.iconCircle}>
          <Ionicons name="location" size={64} color="#2E7D32" />
        </View>

        <Text style={styles.title}>{t('allowYourLocation', lang)}</Text>
        <Text style={styles.description}>
          {t('locationPermissionDesc', lang)}
        </Text>

        <TouchableOpacity
          style={styles.allowButton}
          onPress={handleAllowLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.allowButtonText}>{t('allowLocationButton', lang)}</Text>
          )}
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
  iconCircleError: {
    backgroundColor: '#FDECEA',
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
    marginBottom: 16,
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})