import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Linking, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { updateLocation } from '../services/api'
import { isWithinServiceArea, SERVICE_AREA_NAME } from '../utils/serviceArea'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function LocationTrackingScreen({ navigation }) {
  const { lang } = useLanguage()

  const [coords, setCoords] = useState(null)
  const [loading, setLoading] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [outOfServiceArea, setOutOfServiceArea] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLocation()
  }, [])

  const fetchLocation = async () => {
    setLoading(true)
    setPermissionDenied(false)
    setOutOfServiceArea(false)
    try {
      // TEMPORARY — bypass real GPS for testing, remove before submission
      const newCoords = {
        latitude: 7.8567,
        longitude: 80.6517,
      }

      if (!isWithinServiceArea(newCoords.latitude, newCoords.longitude)) {
        setOutOfServiceArea(true)
        setCoords(newCoords)
        return
      }

      setCoords(newCoords)

      try {
        await updateLocation(newCoords.latitude, newCoords.longitude)
      } catch (err) {
        // Non-fatal — the map/tracking view still works even if the sync fails.
      }
    } catch (err) {
      Alert.alert(t('error', lang), t('couldNotDetectLocation', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenInMaps = () => {
    if (!coords) return
    const { latitude, longitude } = coords
    const label = 'My Farm Location'

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(label)})`,
      default: `https://www.google.com/maps?q=${latitude},${longitude}`,
    })

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('locationTrackingTitle', lang)}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerBlock}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Text style={styles.statusText}>{t('detectingYourLocation', lang)}</Text>
          </View>
        ) : permissionDenied ? (
          <View style={styles.centerBlock}>
            <Ionicons name="location-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.statusText}>
              {t('locationPermissionRequired', lang)}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchLocation}>
              <Text style={styles.retryButtonText}>{t('grantPermission', lang)}</Text>
            </TouchableOpacity>
          </View>
        ) : outOfServiceArea ? (
          <View style={styles.centerBlock}>
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
            <Text style={[styles.statusText, { color: COLORS.danger }]}>
              {t('outsideServiceAreaDesc', lang)}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchLocation}>
              <Text style={styles.retryButtonText}>{t('checkAgain', lang)}</Text>
            </TouchableOpacity>
          </View>
        ) : coords ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="location" size={22} color={COLORS.primary} />
                <Text style={styles.cardTitle}>{t('currentLocation', lang)}</Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>{t('latitude', lang)}</Text>
                <Text style={styles.coordValue}>{coords.latitude.toFixed(5)}</Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>{t('longitude', lang)}</Text>
                <Text style={styles.coordValue}>{coords.longitude.toFixed(5)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mapsButton}
              onPress={handleOpenInMaps}
              activeOpacity={0.85}
            >
              <Ionicons name="map-outline" size={20} color="#fff" />
              <Text style={styles.mapsButtonText}>{t('openInGoogleMaps', lang)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchLocation}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
              <Text style={styles.refreshButtonText}>{t('refreshLocation', lang)}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.statusText}>{t('couldNotDetectLocation', lang)}</Text>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  headerTitle: { ...TYPOGRAPHY.h3, color: '#fff' },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  statusText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  retryButtonText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOW.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  cardTitle: { ...TYPOGRAPHY.h3, color: COLORS.textDark },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  coordLabel: { fontSize: 14, color: COLORS.textMuted },
  coordValue: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW.soft,
  },
  mapsButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  refreshButtonText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
})