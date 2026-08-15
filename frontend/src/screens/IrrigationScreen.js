import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { getCrops, getIrrigationRecommendation } from '../services/api'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'
import { scheduleIrrigationReminder, cancelAllScheduledNotifications } from '../services/notifications'

// Maps known DB crop names to translation keys.
// Add more entries here as more crops are added to the backend.
const CROP_NAME_TRANSLATIONS = {
  'Big Onion': { en: 'Big Onion', si: 'රතු ලූනු', ta: 'சிவப்பு வெங்காயம்' },
  // Locked / "coming soon" crops — names only, no functional data yet.
  'Red Onion': { en: 'Red Onion', si: 'රතු ළූණු', ta: 'சிவப்பு வெங்காயம் (சிறிய)' },
  'Chilli': { en: 'Chilli', si: 'මිරිස්', ta: 'மிளகாய்' },
  'Potato': { en: 'Potato', si: 'අර්තාපල්', ta: 'உருளைக்கிழங்கு' },
  'Tomato': { en: 'Tomato', si: 'තක්කාලි', ta: 'தக்காளி' },
  'Maize': { en: 'Maize', si: 'ඉරිඟු', ta: 'சோளம்' },
}

// Icon shown per crop — falls back to a generic plant icon for crops
// that don't have a dedicated emoji mapped yet.
const CROP_ICONS = {
  'Big Onion': '🧅',
  'Red Onion': '🧅',
  'Chilli': '🌶️',
  'Potato': '🥔',
  'Tomato': '🍅',
  'Maize': '🌽',
}

const getCropDisplayName = (cropName, lang) => {
  const entry = CROP_NAME_TRANSLATIONS[cropName]
  return entry ? (entry[lang] || entry.en) : cropName
}

const getCropIcon = (cropName) => CROP_ICONS[cropName] || '🌱'

export default function IrrigationScreen() {
  const { lang } = useLanguage()
  const [crops, setCrops] = useState([])
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingCrops, setLoadingCrops] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasManuallySelected, setHasManuallySelected] = useState(false)

  const LATITUDE = 7.8567
  const LONGITUDE = 80.6517

  useEffect(() => {
    loadCrops()
  }, [])

  const loadCrops = async () => {
    try {
      const response = await getCrops()
      setCrops(response.data)
      const firstAvailable = response.data.find(c => c.is_available !== false)
      if (firstAvailable) {
        setSelectedCrop(firstAvailable)
      }
    } catch (error) {
      console.log('Crops load error:', error)
    } finally {
      setLoadingCrops(false)
    }
  }

  const handleCropPress = (crop) => {
    if (crop.is_available === false) {
      Alert.alert(t('comingSoon', lang), t('comingSoonMessage', lang))
      return
    }
    setSelectedCrop(crop)
    setHasManuallySelected(true)
    setDropdownOpen(false)
  }

const getRecommendation = async () => {
  if (!selectedCrop) {
    Alert.alert('Error', 'Please select a crop first')
    return
  }
  setLoading(true)
  setRecommendation(null)
  try {
    const response = await getIrrigationRecommendation(
      selectedCrop.id, LATITUDE, LONGITUDE, lang
    )
    setRecommendation(response.data)
  } catch (error) {
    Alert.alert('Error', t('error', lang))
    setLoading(false)
    return
  }

  try {
    await cancelAllScheduledNotifications()
    await scheduleIrrigationReminder(1)
  } catch (notifError) {
    console.log('Notification scheduling skipped:', notifError)
  }

  setLoading(false)
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.decorDrop, styles.decorDrop1]}>💧</Text>
          <Text style={[styles.decorDrop, styles.decorDrop2]}>💧</Text>
          <Text style={[styles.decorDrop, styles.decorDrop3]}>💧</Text>
          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <Text style={styles.headerIcon}>💧</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{t('irrigationTitle', lang)}</Text>
              <Text style={styles.headerSubtitle}>{t('locationDambulla', lang)}</Text>
            </View>
          </View>
        </View>

        {/* Crop Selection — Dropdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('selectCrop', lang)}</Text>

          {loadingCrops ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 12 }} />
          ) : (
            <View>
              {/* Dropdown header — shows "Crop List" until the user actually
                  taps a crop, then switches to show the selected crop */}
              <TouchableOpacity
                style={[styles.dropdownHeader, dropdownOpen && styles.dropdownHeaderOpen]}
                onPress={() => setDropdownOpen((prev) => !prev)}
                activeOpacity={0.7}
              >
                <View style={styles.cropIconWrap}>
                  <Text style={styles.cropIcon}>
                    {hasManuallySelected && selectedCrop ? getCropIcon(selectedCrop.crop_name) : '🌱'}
                  </Text>
                </View>
                <Text style={styles.dropdownSelectedText}>
                  {hasManuallySelected && selectedCrop ? getCropDisplayName(selectedCrop.crop_name, lang) : 'Crop List'}
                </Text>
                <Ionicons
                  name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {/* Dropdown list — only rendered when open */}
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {crops.map((crop, index) => {
                    const locked = crop.is_available === false
                    const selected = selectedCrop?.id === crop.id
                    const isLast = index === crops.length - 1
                    return (
                      <TouchableOpacity
                        key={crop.id}
                        style={[
                          styles.dropdownItem,
                          selected && styles.dropdownItemSelected,
                          locked && styles.dropdownItemLocked,
                          isLast && styles.dropdownItemLast,
                        ]}
                        onPress={() => handleCropPress(crop)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.cropIconWrap, locked && styles.cropIconWrapLocked]}>
                          <Text style={styles.cropIcon}>{getCropIcon(crop.crop_name)}</Text>
                        </View>
                        <Text style={[
                          styles.cropButtonText,
                          selected && styles.cropButtonTextSelected,
                          locked && styles.cropButtonTextLocked,
                        ]}>
                          {getCropDisplayName(crop.crop_name, lang)}
                        </Text>
                        {locked ? (
                          <View style={styles.comingSoonBadge}>
                            <Ionicons name="lock-closed" size={11} color="#8D6E63" style={{ marginRight: 4 }} />
                            <Text style={styles.comingSoonBadgeText}>{t('comingSoon', lang)}</Text>
                          </View>
                        ) : (
                          selected && (
                            <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                          )
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Get Advice Button */}
        <TouchableOpacity
          style={styles.adviceButton}
          onPress={getRecommendation}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloudy-night" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.adviceButtonText}>
                {t('getAdvice', lang)}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Recommendation Result */}
        {recommendation && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 {t('result', lang)}</Text>

            {/* Weather */}
            <View style={styles.weatherRow}>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>🌡️</Text>
                <Text style={styles.weatherValue}>{recommendation.temperature_c}°C</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>💧</Text>
                <Text style={styles.weatherValue}>{recommendation.humidity_percent}%</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>🌧️</Text>
                <Text style={styles.weatherValue}>{recommendation.rainfall_mm}mm</Text>
              </View>
            </View>

            {/* Decision */}
            <View style={[
              styles.decisionBox,
              recommendation.should_irrigate
                ? styles.decisionIrrigate
                : styles.decisionSkip
            ]}>
              <Text style={styles.decisionIcon}>
                {recommendation.should_irrigate ? '💧' : '✅'}
              </Text>
              <Text style={styles.decisionText}>
                {recommendation.should_irrigate
                  ? t('irrigate_now', lang)
                  : t('no_irrigation', lang)
                }
              </Text>
            </View>

            {/* Details */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('moistureDeficit', lang)}</Text>
              <Text style={styles.detailValue}>{recommendation.moisture_deficit_mm} mm</Text>
            </View>

            {recommendation.should_irrigate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('waterVolume', lang)}</Text>
                <Text style={styles.detailValue}>
                  {recommendation.recommended_volume_liters?.toLocaleString()} L
                </Text>
              </View>
            )}

            {/* Message */}
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{recommendation.recommendation_note}</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    paddingTop: SPACING.sm,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorDrop: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.12,
  },
  decorDrop1: {
    top: -10,
    right: 20,
    fontSize: 60,
  },
  decorDrop2: {
    bottom: -15,
    right: 90,
    fontSize: 34,
  },
  decorDrop3: {
    top: 30,
    right: -10,
    fontSize: 26,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: '#E8F5E9',
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.soft,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },

  // Dropdown header (collapsed state)
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  dropdownHeaderOpen: {
    borderColor: COLORS.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownSelectedText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // Dropdown list (expanded state)
  dropdownList: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: COLORS.primary,
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    ...SHADOW.soft,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  dropdownItemLocked: {
    backgroundColor: '#FAFAFA',
    opacity: 0.65,
  },

  cropIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  cropIconWrapLocked: {
    backgroundColor: '#EEEEEE',
  },
  cropIcon: {
    fontSize: 20,
  },
  cropButtonText: {
    fontSize: 16,
    color: COLORS.textDark,
    flex: 1,
  },
  cropButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  cropButtonTextLocked: {
    color: COLORS.textMuted,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8D6E63',
  },
  adviceButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.soft,
  },
  adviceButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  weatherItem: {
    flex: 1,
    alignItems: 'center',
  },
  weatherDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  weatherIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  decisionBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  decisionIrrigate: {
    backgroundColor: '#E3F2FD',
  },
  decisionSkip: {
    backgroundColor: '#E8F5E9',
  },
  decisionIcon: {
    fontSize: 36,
    marginBottom: SPACING.xs,
  },
  decisionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  messageBox: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 4,
    marginTop: SPACING.sm,
  },
  messageText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
})