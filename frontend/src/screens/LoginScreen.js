import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { t } from '../../translations'
import { loginUser } from '../services/api'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function LoginScreen({ navigation }) {
  const { lang } = useLanguage()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', t('error', lang))
      return
    }

    setLoading(true)
    try {
      const response = await loginUser(username, password, lang)
      await login(response.data.token, response.data.user)
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || t('error', lang)
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.decorCircleLarge} />
            <View style={styles.decorCircleSmall} />
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Smart Grow</Text>
            <Text style={styles.subtitle}>{t('login', lang)}</Text>
          </View>

          {/* Form Card */}
          <View style={styles.form}>

            {/* Username */}
            <Text style={styles.label}>{t('username', lang)}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'username' && styles.inputFocused,
              ]}
              placeholder={t('username', lang)}
              placeholderTextColor={COLORS.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Password */}
            <Text style={styles.label}>{t('password', lang)}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'password' && styles.inputFocused,
              ]}
              placeholder={t('password', lang)}
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {t('loginButton', lang)}
                </Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerLinkText}>
                {t('noAccount', lang)}
              </Text>
            </TouchableOpacity>

            {/* Back to Language */}
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation.navigate('LanguageSelect')}
            >
              <Text style={styles.backLinkText}>
                ← {t('chooseLanguage', lang)}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>🧅 Smart Grow for Big Onion Farmers</Text>
              <Text style={styles.footerVersion}>v1.0</Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl + SPACING.md,
    paddingHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  decorCircleLarge: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorCircleSmall: {
    position: 'absolute',
    top: 30,
    left: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(249,168,37,0.12)',
  },
  logoBadge: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  logo: {
    width: 88,
    height: 88,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: '#E8F5E9',
  },
  form: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    ...SHADOW.card,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.textDark,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOW.soft,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.xs,
  },
  registerLinkText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  backLink: {
    alignItems: 'center',
    marginTop: SPACING.xs,
    padding: SPACING.xs,
  },
  backLinkText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl + SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  footerVersion: {
    fontSize: 11,
    color: COLORS.textMuted,
    opacity: 0.6,
  },
})