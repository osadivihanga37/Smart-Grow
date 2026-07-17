import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl, Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { t } from '../../translations'
import { getDiseaseForecast } from '../services/api'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function HomeScreen({ navigation }) {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const LATITUDE = 7.8567
  const LONGITUDE = 80.6517

  const fetchWeather = async () => {
    try {
      const response = await getDiseaseForecast(LATITUDE, LONGITUDE, lang)
      setWeather(response.data.weather)
    } catch (error) {
      console.log('Weather fetch error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchWeather()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/hero-farm.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Text style={styles.heroWelcome}>{t('welcome', lang)},</Text>
            <Text style={styles.heroUsername}>{user?.username || 'Farmer'} </Text>
          </View>
        </View>

        {/* Weather Card — floats over hero */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.weatherTitle}>
              Dambulla — {t('todayWeather', lang)}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size="large" style={{ marginVertical: 20 }} />
          ) : weather ? (
            <View style={styles.weatherGrid}>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>🌡️</Text>
                <Text style={styles.weatherValue}>{weather.temperature_c}°C</Text>
                <Text style={styles.weatherLabel}>{t('temperature', lang)}</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>💧</Text>
                <Text style={styles.weatherValue}>{weather.humidity_percent}%</Text>
                <Text style={styles.weatherLabel}>{t('humidity', lang)}</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Text style={styles.weatherIcon}>🌧️</Text>
                <Text style={styles.weatherValue}>{weather.rainfall_mm}mm</Text>
                <Text style={styles.weatherLabel}>{t('rainfall', lang)}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.errorText}>{t('error', lang)}</Text>
          )}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Irrigation')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.actionIcon}>💧</Text>
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>{t('irrigationTitle', lang)}</Text>
            <Text style={styles.actionSubtitle}>Get water recommendation for your crop</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Disease')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.actionIcon}>🦠</Text>
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>{t('diseaseTitle', lang)}</Text>
            <Text style={styles.actionSubtitle}>Check disease risk for today</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Crops')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.actionIcon}>🧅</Text>
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>{t('crops', lang)}</Text>
            <Text style={styles.actionSubtitle}>Big Onion advisory data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Info Banner */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🧅 Big Onion Season</Text>
          <Text style={styles.infoText}>Harvest months: September — October</Text>
          <Text style={styles.infoText}>Average yield: 20.4 MT/hectare (Dambulla)</Text>
          <Text style={styles.infoSource}>Source: DCS Big Onion Survey 2021</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 94, 32, 0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLogo: {
    width: 44,
    height: 44,
    marginRight: SPACING.sm,
  },
  heroWelcome: {
    ...TYPOGRAPHY.caption,
    color: '#E8F5E9',
  },
  heroUsername: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
  },
  weatherCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: -32,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  weatherTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
    color: COLORS.textDark,
    marginLeft: 6,
  },
  weatherGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherItem: {
    flex: 1,
    alignItems: 'center',
  },
  weatherDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  weatherIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  weatherLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  errorText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.soft,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textDark,
    marginBottom: 3,
  },
  infoSource: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
})