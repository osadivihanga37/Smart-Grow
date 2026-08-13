import React from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { t } from '../../translations'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function ProfileScreen({ navigation }) {
  const { lang } = useLanguage()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?')
      if (confirmed) {
        logout()
      }
    } else {
        Alert.alert(
        t('logout', lang),
        'Are you sure you want to logout?',
        [
          { text: t('cancel', lang), style: 'cancel' },
          { text: t('logout', lang), style: 'destructive', onPress: logout }
        ]
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.decorCircleLarge} />
          <View style={styles.decorCircleSmall} />

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>👨‍🌾</Text>
          </View>
          <Text style={styles.username}>{user?.username || 'Farmer'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('profileTitle', lang)}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelWrap}>
              <Ionicons name="person" size={16} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{t('farmerName', lang)}</Text>
            </View>
            <Text style={styles.infoValue}>{user?.username || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelWrap}>
              <Ionicons name="mail" size={16} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{t('email', lang)}</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <View style={styles.infoLabelWrap}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{t('location', lang)}</Text>
            </View>
            <Text style={styles.infoValue}>{t('locationDambulla', lang)}</Text>
          </View>
        </View>

        {/* Irrigation History — button linking to full history screen */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('IrrigationHistory')}
          activeOpacity={0.7}
        >
          <View style={styles.historyButtonRow}>
            <View style={styles.historyIconWrap}>
              <Text style={styles.historyIcon}>💧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Irrigation History</Text>
              <Text style={styles.historySubtext}>View all your past recommendations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.card}>
          <View style={styles.aboutHeader}>
            <View style={styles.aboutIconWrap}>
              <Text style={styles.aboutIcon}>ℹ️</Text>
            </View>
            <Text style={styles.cardTitle}>About Smart Grow</Text>
          </View>
          <Text style={styles.infoText}>
            Smart Grow is an intelligent irrigation and disease forecasting platform
            designed for Big Onion farmers in Dambulla, Sri Lanka.
          </Text>
          <Text style={styles.sourcesHeading}> Research Sources:</Text>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceBullet}>•</Text>
            <Text style={styles.sourceText}>Sumanaratne (1999) — FCRDI, Irrigation Water Requirements</Text>
          </View>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceBullet}>•</Text>
            <Text style={styles.sourceText}>DCS Big Onion Survey (2021) — Matale District Data</Text>
          </View>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceBullet}>•</Text>
            <Text style={styles.sourceText}>Fernando et al. (2018) — Black Mold Disease</Text>
          </View>
          <View style={styles.sourceItem}>
            <Text style={styles.sourceBullet}>•</Text>
            <Text style={styles.sourceText}>Herath et al. (2021) — Anthracnose-Twister Disease</Text>
          </View>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>{t('logout', lang)}</Text>
        </TouchableOpacity>

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
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircleLarge: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 84,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorCircleSmall: {
    position: 'absolute',
    top: 20,
    left: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(249,168,37,0.12)',
  },
  settingsButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
    padding: 4,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  avatar: {
    fontSize: 48,
  },
  username: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#E8F5E9',
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    marginBottom: 0,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.soft,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs + 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // Irrigation history button
  historyButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  historyIcon: {
    fontSize: 16,
  },
  historySubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  aboutIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  sourcesHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  sourceItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: SPACING.xs,
  },
  sourceBullet: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 6,
  },
  sourceText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 18,
  },
  version: {
    fontSize: 12,
    color: COLORS.textMuted,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    margin: SPACING.md,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOW.soft,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
})