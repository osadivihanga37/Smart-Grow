import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { getIrrigationHistory } from '../services/api'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function IrrigationHistoryScreen({ navigation }) {
  const { lang } = useLanguage()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const dedupeByDay = (records) => {
    const seenDays = new Set()
    const result = []
    for (const record of records) {
      const dayKey = new Date(record.created_at).toDateString()
      if (!seenDays.has(dayKey)) {
        seenDays.add(dayKey)
        result.push(record)
      }
    }
    return result
  }

  const fetchHistory = async () => {
    try {
      const response = await getIrrigationHistory()
      setHistory(dedupeByDay(response.data || []))
    } catch (err) {
      console.log('Irrigation history load error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchHistory()
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('irrigationHistoryTitle', lang)}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} />
        ) : history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>💧</Text>
            </View>
            <Text style={styles.emptyText}>
              {t('noHistoryYet', lang)}
            </Text>
          </View>
        ) : (
          history.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordTop}>
                <View style={[
                  styles.recordIconWrap,
                  { backgroundColor: record.should_irrigate ? '#E3F2FD' : '#E8F5E9' },
                ]}>
                  <Text style={styles.recordIcon}>
                    {record.should_irrigate ? '💧' : '✅'}
                  </Text>
                </View>
                <View style={styles.recordTextWrap}>
                  <Text style={styles.recordCropName}>
                    {record.crop_name || 'Big Onion'}
                  </Text>
                  <Text style={styles.recordDateTime}>
                    {formatDate(record.created_at)} · {formatTime(record.created_at)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.recordBadge,
                    { backgroundColor: record.should_irrigate ? '#1565C0' : COLORS.primary },
                  ]}
                >
                  <Text style={styles.recordBadgeText}>
                    {record.should_irrigate ? t('irrigate', lang) : t('skip', lang)}
                  </Text>
                </View>
              </View>

              <View style={styles.recordDetailsRow}>
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>{t('temp', lang)}</Text>
                  <Text style={styles.recordDetailValue}>{record.temperature_c}°C</Text>
                </View>
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>{t('humidity', lang)}</Text>
                  <Text style={styles.recordDetailValue}>{record.humidity_percent}%</Text>
                </View>
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>{t('rainfall', lang)}</Text>
                  <Text style={styles.recordDetailValue}>{record.rainfall_mm}mm</Text>
                </View>
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>{t('deficit', lang)}</Text>
                  <Text style={styles.recordDetailValue}>{record.moisture_deficit_mm}mm</Text>
                </View>
              </View>

              {record.should_irrigate && record.recommended_volume_liters ? (
                <Text style={styles.recordVolume}>
                  {t('recommended', lang)}: {Math.round(record.recommended_volume_liters).toLocaleString()} {t('liters', lang)}
                </Text>
              ) : null}

              {record.recommendation_note ? (
                <Text style={styles.recordNote}>{record.recommendation_note}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
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
  content: { padding: SPACING.md },

  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl + SPACING.md,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E3F2FD',
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

  recordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW.soft,
  },
  recordTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  recordIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  recordIcon: {
    fontSize: 20,
  },
  recordTextWrap: {
    flex: 1,
  },
  recordCropName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  recordDateTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  recordBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  recordBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  recordDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  recordDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  recordDetailLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  recordDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  recordVolume: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
    marginTop: SPACING.xs,
  },
  recordNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    lineHeight: 18,
    fontStyle: 'italic',
  },
})