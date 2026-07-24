import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Switch, Alert, Platform, TextInput, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { getProfile, updateUserProfile, deleteUserAccount } from '../services/api'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function SettingsScreen({ navigation }) {
  const { lang } = useLanguage()
  const { user, logout } = useAuth()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState(user?.username || '')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile()
        if (response.data?.username) {
          setName(response.data.username)
        }
      } catch (err) {
        // Non-fatal — fall back to whatever AuthContext already has.
      }
    }
    fetchProfile()
  }, [])

  // UPDATE
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert(t('error', lang), t('nameCannotBeEmpty', lang))
      return
    }
    setSaving(true)
    try {
      await updateUserProfile({ username: name.trim() })
      setEditing(false)
      Alert.alert(t('save', lang), t('profileUpdated', lang))
    } catch (err) {
      Alert.alert(t('error', lang), t('couldNotUpdateProfile', lang))
    } finally {
      setSaving(false)
    }
  }

  // REMOVE
  const confirmDeleteAccount = () => {
    const message = t('deleteAccountConfirm', lang)
    if (Platform.OS === 'web') {
      if (window.confirm(message)) handleDeleteAccount()
    } else {
      Alert.alert(t('deleteAccount', lang), message, [
        { text: t('cancel', lang), style: 'cancel' },
        { text: t('deleteAccount', lang), style: 'destructive', onPress: handleDeleteAccount },
      ])
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteUserAccount()
      await logout()
    } catch (err) {
      Alert.alert(t('error', lang), t('couldNotDeleteAccount', lang))
      setDeleting(false)
    }
  }

  // CREATE — placeholder for adding a new farm/plot entry; wire to your Crops/Farm model
  const handleAddFarmPlot = () => {
    Alert.alert('Add Plot', 'Hook this up to a "create farm plot" endpoint when that model exists.')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings', lang)}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* ACCOUNT — Update */}
        <Text style={styles.sectionLabel}>{t('settingsAccount', lang)}</Text>
        <View style={styles.card}>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('farmerName', lang)}
                autoFocus
              />
              <TouchableOpacity
                style={styles.rowButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.rowButtonText}>{t('save', lang)}</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.row} onPress={() => setEditing(true)}>
              <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.rowText}>{t('updateProfile', lang)} ({name || t('username', lang)})</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('LanguageSelect')}>
            <Ionicons name="language-outline" size={22} color={COLORS.primary} />
            <Text style={styles.rowText}>{t('changeLanguage', lang)}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* PERMISSIONS */}
        <Text style={styles.sectionLabel}>{t('permissions', lang)}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            <Text style={styles.rowText}>{t('notifications', lang)}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: COLORS.primary }}
            />
          </View>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('LocationTracking')}
          >
            <Ionicons name="location-outline" size={22} color={COLORS.primary} />
            <Text style={styles.rowText}>{t('locationTrackingSetting', lang)}</Text>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ true: COLORS.primary }}
            />
          </TouchableOpacity>
        </View>

        {/* CREATE */}
        <Text style={styles.sectionLabel}>{t('farmData', lang)}</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleAddFarmPlot}>
            <Ionicons name="add-circle-outline" size={22} color={COLORS.primary} />
            <Text style={styles.rowText}>{t('addFarmPlot', lang)}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* REMOVE / DANGER ZONE */}
        <Text style={[styles.sectionLabel, { color: COLORS.danger }]}>{t('dangerZone', lang)}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={confirmDeleteAccount}
            disabled={deleting}
          >
            <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
            {deleting ? (
              <ActivityIndicator color={COLORS.danger} style={{ marginLeft: SPACING.sm }} />
            ) : (
              <Text style={[styles.rowText, { color: COLORS.danger }]}>{t('deleteAccount', lang)}</Text>
            )}
          </TouchableOpacity>
        </View>

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
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    ...SHADOW.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  rowText: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.textDark },
  rowButton: {
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  rowButtonText: { color: '#fff', fontWeight: '700' },
  input: {
    margin: SPACING.md,
    marginBottom: 0,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
})