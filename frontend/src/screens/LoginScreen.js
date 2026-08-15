import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { t } from '../../translations'
import { loginUser } from '../services/api'
import { showValidationErrorNotification } from '../services/notifications'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function LoginScreen({ navigation }) {
  const { lang } = useLanguage()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState('') // username OR email
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const isFormValid = identifier.trim().length > 0 && password.length > 0

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', t('error', lang))
      return
    }

    setLoading(true)
    try {
      const response = await loginUser(identifier, password, lang)
      await login(response.data.token, response.data.user)
    } catch (error) {
      const message = error.response?.data?.error || t('error', lang)
      Alert.alert('Error', message)
      showValidationErrorNotification('Login Failed', message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    Alert.alert(t('continueWithGoogle', lang), t('googleComingSoon', lang))
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

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

          <View style={styles.form}>

            <Text style={styles.label}>{t('username', lang)} / {t('email', lang)}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'identifier' && styles.inputFocused,
              ]}
              placeholder={`${t('username', lang)} / ${t('email', lang)}`}
              placeholderTextColor={COLORS.textMuted}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              onFocus={() => setFocusedField('identifier')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.label}>{t('password', lang)}</Text>
            <View
              style={[
                styles.passwordRow,
                focusedField === 'password' && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder={t('password', lang)}
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                (!isFormValid || loading) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading || !isFormValid}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {t('loginButton', lang)}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#040303" />
              <Text style={styles.googleButtonText}>{t('continueWithGoogle', lang)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerLinkText}>
                {t('noAccount', lang)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation.navigate('LanguageSelect')}
            >
              <Text style={styles.backLinkText}>
                ← {t('chooseLanguage', lang)}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Smart Grow for Farmers</Text>
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.textDark,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOW.soft,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.border,
    ...SHADOW.soft,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  googleButtonText: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '600',
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