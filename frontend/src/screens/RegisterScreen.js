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
import { registerUser } from '../services/api'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function RegisterScreen({ navigation }) {
  const { lang } = useLanguage()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [district, setDistrict] = useState('Dambulla')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', t('missing_fields', lang) || t('error', lang))
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const response = await registerUser({
        username,
        email,
        password,
        phone_number: phoneNumber,
        district,
      })
      await login(response.data.token, response.data.user)
    } catch (error) {
      const backendError = error.response?.data?.error
      const message =
        typeof backendError === 'object'
          ? Object.values(backendError).flat().join('\n')
          : backendError || t('error', lang)
      Alert.alert('Error', message)
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (fieldKey, label, value, onChangeText, extraProps = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === fieldKey && styles.inputFocused,
        ]}
        placeholder={label}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
        {...extraProps}
      />
    </>
  )

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
            <Text style={styles.subtitle}>{t('register', lang)}</Text>
          </View>

          {/* Form Card */}
          <View style={styles.form}>

            {renderInput('username', `${t('username', lang)} *`, username, setUsername, { autoCapitalize: 'none' })}
            {renderInput('email', t('email', lang), email, setEmail, { autoCapitalize: 'none', keyboardType: 'email-address' })}
            {renderInput('password', `${t('password', lang)} *`, password, setPassword, { secureTextEntry: true })}
            {renderInput('phone', t('phone', lang), phoneNumber, setPhoneNumber, { keyboardType: 'phone-pad' })}
            {renderInput('district', t('district', lang), district, setDistrict)}

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>
                  {t('registerButton', lang)}
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                {t('haveAccount', lang)}
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg + SPACING.sm,
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
    top: 20,
    left: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(249,168,37,0.12)',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  logo: {
    width: 64,
    height: 64,
  },
  appName: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
    marginBottom: 2,
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
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOW.soft,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.xs,
  },
  loginLinkText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  backLink: {
    alignItems: 'center',
    marginTop: SPACING.xs,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  backLinkText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
})