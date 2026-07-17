import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { updateLocation } from '../services/api'

export default function LocationPermissionScreen() {
  const { markLocationPrompted } = useAuth()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleAllowLocation = async () => {
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You can enable location later from your device settings.')
        await markLocationPrompted()
        return
      }

      const position = await Location.getCurrentPositionAsync({})
      await updateLocation(position.coords.latitude, position.coords.longitude)
      await markLocationPrompted()
    } catch (error) {
      console.log('Location error:', error)
      Alert.alert('Error', 'Could not fetch your location right now.')
      await markLocationPrompted()
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    await markLocationPrompted()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.iconCircle}>
          <Ionicons name="location" size={64} color="#2E7D32" />
        </View>

        <Text style={styles.title}>Allow your location</Text>
        <Text style={styles.description}>
          We'll use your location to give accurate weather-based irrigation
          and disease risk recommendations for your farm.
        </Text>

        <TouchableOpacity
          style={styles.allowButton}
          onPress={handleAllowLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.allowButtonText}>Allow Location</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} disabled={loading}>
          <Text style={styles.skipText}>Maybe Later</Text>
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
    marginBottom: 16,
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
})