import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { getDiseaseForecast } from '../services/api'
import { translateDiseaseValue } from '../utils/diseaseDataTranslations'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function DiseaseScreen() {
  const { lang } = useLanguage()
  const [alerts, setAlerts] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  const LATITUDE = 7.8567
  const LONGITUDE = 80.6517

  const checkDiseaseRisk = async () => {
    setLoading(true)
    try {
      const response = await getDiseaseForecast(LATITUDE, LONGITUDE, lang)
      setAlerts(response.data.alerts)
      setWeather(response.data.weather)
      setChecked(true)
    } catch (error) {
      console.log('Disease forecast error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return COLORS.success
      case 'MEDIUM': return COLORS.warning
      case 'HIGH': return '#F44336'
      case 'CRITICAL': return COLORS.danger
      default: return COLORS.textMuted
    }
  }

  const getRiskBg = (level) => {
    switch (level) {
      case 'LOW': return '#E8F5E9'
      case 'MEDIUM': return '#FFF3E0'
      case 'HIGH': return '#FFEBEE'
      case 'CRITICAL': return '#FFEBEE'
      default: return COLORS.background
    }
  }

  const getRiskIcon = (level) => {
    switch (level) {
      case 'LOW': return '✅'
      case 'MEDIUM': return '⚠️'
      case 'HIGH': return '🔴'
      case 'CRITICAL': return '🚨'
      default: return '❓'
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.decorIcon, styles.decorIcon1]}>🦠</Text>
          <Text style={[styles.decorIcon, styles.decorIcon2]}>🦠</Text>
          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <Text style={styles.headerIcon}>🦠</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{t('diseaseTitle', lang)}</Text>
              <Text style={styles.headerSubtitle}>{t('locationDambulla', lang)}</Text>
            </View>
          </View>
        </View>

        {/* Current Weather */}
        {weather && (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherTitle}>{t('currentConditions', lang)}</Text>
            <View style={styles.weatherRow}>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>🌡️</Text>
                <Text style={styles.weatherValue}>{weather.temperature_c}°C</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>💧</Text>
                <Text style={styles.weatherValue}>{weather.humidity_percent}%</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>🌧️</Text>
                <Text style={styles.weatherValue}>{weather.rainfall_mm}mm</Text>
              </View>
            </View>
          </View>
        )}

        {/* Check Button */}
        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkDiseaseRisk}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkButtonText}>
              🔍 {t('checkRisk', lang)}
            </Text>
          )}
        </TouchableOpacity>

        {/* Alerts */}
        {checked && alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>{t('diseaseRiskResults', lang)}</Text>
            {alerts.map((alert, index) => (
              <View
                key={index}
                style={[
                  styles.alertCard,
                  { borderLeftColor: getRiskColor(alert.risk_level) }
                ]}
              >
                <View style={styles.alertHeader}>
                  <View style={[
                    styles.alertIconWrap,
                    { backgroundColor: getRiskBg(alert.risk_level) }
                  ]}>
                    <Text style={styles.alertIcon}>
                      {getRiskIcon(alert.risk_level)}
                    </Text>
                  </View>
                  <View style={styles.alertTitleContainer}>
                    <Text style={styles.alertDisease}>
                      {translateDiseaseValue(alert.disease_name, lang)}
                    </Text>
                    <Text style={styles.alertPathogen}>
                      {translateDiseaseValue(alert.pathogen, lang)}
                    </Text>
                  </View>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskColor(alert.risk_level) }
                  ]}>
                    <Text style={styles.riskBadgeText}>
                      {t(alert.risk_level.toLowerCase(), lang)}
                    </Text>
                  </View>
                </View>

                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>{t('riskScore', lang)}</Text>
                  <Text style={[
                    styles.scoreValue,
                    { color: getRiskColor(alert.risk_level) }
                  ]}>
                    {alert.risk_score}/100
                  </Text>
                </View>

                <Text style={styles.alertMessage}>{alert.alert_message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!checked && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>🌿</Text>
            </View>
            <Text style={styles.emptyText}>
              {t('tapToCheckDisease', lang)}
            </Text>
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
    backgroundColor: COLORS.danger,
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
  decorIcon: {
    position: 'absolute',
    opacity: 0.1,
  },
  decorIcon1: {
    top: -10,
    right: 20,
    fontSize: 60,
  },
  decorIcon2: {
    bottom: -10,
    right: 100,
    fontSize: 30,
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
    color: '#FFEBEE',
    marginTop: 2,
  },
  weatherCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.soft,
  },
  weatherTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  checkButton: {
    backgroundColor: COLORS.danger,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.soft,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  alertsContainer: {
    marginHorizontal: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  alertCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 5,
    ...SHADOW.soft,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  alertIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  alertIcon: {
    fontSize: 22,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertDisease: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  alertPathogen: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  riskBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  riskBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    backgroundColor: COLORS.background,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl + SPACING.md,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyIcon: {
    fontSize: 44,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
})