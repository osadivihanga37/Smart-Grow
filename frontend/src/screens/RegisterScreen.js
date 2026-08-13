import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { registerUser } from '../services/api'
import { showValidationErrorNotification } from '../services/notifications'
import { isWithinServiceArea, SERVICE_AREA_NAME } from '../utils/serviceArea'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

// Sri Lanka's 25 districts
const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
]

const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i

export default function RegisterScreen({ navigation }) {
  const { lang } = useLanguage()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [age, setAge] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [district, setDistrict] = useState('')
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false)
  const [coords, setCoords] = useState(null) // { latitude, longitude }
  const [locating, setLocating] = useState(false)
  const [outOfServiceArea, setOutOfServiceArea] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleAgeChange = (value) => {
    const numericOnly = value.replace(/[^0-9]/g, '')
    setAge(numericOnly)
  }

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  // Location is now REQUIRED and gated by service area: Smart Grow currently
  // only supports the Dambulla region, so registration is blocked until a
  // farmer's detected location falls within that service area.
  const isFormValid =
    username.trim().length > 0 &&
    GMAIL_REGEX.test(email) &&
    password.length >= 6 &&
    password === confirmPassword &&
    district.length > 0 &&
    coords !== null &&
    !outOfServiceArea

  const handleDetectLocation = async () => {
    setLocating(true)
    setOutOfServiceArea(false)
    try {
      // TEMPORARY — bypass real GPS for testing, remove before submission
      const latitude = 7.8567
      const longitude = 80.6517

      if (!isWithinServiceArea(latitude, longitude)) {
        setCoords(null)
        setOutOfServiceArea(true)
        Alert.alert(
          t('outsideServiceArea', lang),
          t('outsideServiceAreaDesc', lang)
        )
        return
      }

      setCoords({ latitude, longitude })
    } catch (err) {
      Alert.alert(t('error', lang), t('couldNotDetectLocation', lang))
    } finally {
      setLocating(false)
    }
  }

  const validate = () => {
    if (!username || !password) {
      Alert.alert('Error', t('missing_fields', lang) || t('error', lang))
      return false
    }
    if (!GMAIL_REGEX.test(email)) {
      const message = t('invalidGmail', lang)
      Alert.alert('Error', message)
      showValidationErrorNotification('Invalid Email', message)
      return false
    }
    if (password.length < 6) {
      const message = t('passwordTooShort', lang)
      Alert.alert('Error', message)
      showValidationErrorNotification('Weak Password', message)
      return false
    }
    if (password !== confirmPassword) {
      const message = t('passwordsDontMatch', lang)
      Alert.alert('Error', message)
      showValidationErrorNotification('Password Mismatch', message)
      return false
    }
    if (age && (parseInt(age, 10) < 16 || parseInt(age, 10) > 100)) {
      Alert.alert('Error', t('invalidAge', lang))
      return false
    }
    if (!district) {
      Alert.alert('Error', t('selectDistrict', lang))
      return false
    }
    return true
  }

  const handleRegister = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      await registerUser({
        username,
        email,
        password,
        age: age ? parseInt(age, 10) : undefined,
        phone_number: phoneNumber,
        district,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
      Alert.alert(
        t('registerButton', lang),
        'Account created successfully. Please log in to continue.'
      )
      navigation.navigate('Login')
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

  const renderPasswordInput = (fieldKey, label, value, onChangeText, show, setShow) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.passwordRow,
          focusedField === fieldKey && styles.inputFocused,
        ]}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder={label}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity
          onPress={() => setShow((prev) => !prev)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={show ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>
    </>
  )

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
            <Text style={styles.subtitle}>{t('register', lang)}</Text>
          </View>

          <View style={styles.form}>

            {renderInput('username', `${t('username', lang)} *`, username, setUsername, { autoCapitalize: 'none' })}
            {renderInput('email', `${t('email', lang)} * (@gmail.com)`, email, setEmail, { autoCapitalize: 'none', keyboardType: 'email-address' })}

            {renderPasswordInput('password', `${t('password', lang)} *`, password, setPassword, showPassword, setShowPassword)}
            {renderPasswordInput('confirmPassword', `${t('confirmPassword', lang)} *`, confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword)}
            {passwordsMismatch && (
              <Text style={styles.errorText}>{t('passwordsDontMatch', lang)}</Text>
            )}

            {renderInput('age', t('age', lang), age, handleAgeChange, { keyboardType: 'numeric', maxLength: 3 })}
            {renderInput('phone', t('phone', lang), phoneNumber, setPhoneNumber, { keyboardType: 'phone-pad' })}

            {/* District dropdown */}
            <Text style={styles.label}>{t('district', lang)} *</Text>
            <View>
              <TouchableOpacity
                style={[
                  styles.districtDropdownHeader,
                  districtDropdownOpen && styles.districtDropdownHeaderOpen,
                ]}
                onPress={() => setDistrictDropdownOpen((prev) => !prev)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.districtDropdownText,
                    !district && styles.districtDropdownPlaceholder,
                  ]}
                >
                  {district || t('selectDistrict', lang)}
                </Text>
                <Ionicons
                  name={districtDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {districtDropdownOpen && (
                <ScrollView
                  style={styles.districtDropdownList}
                  nestedScrollEnabled
                >
                  {DISTRICTS.map((d, index) => {
                    const selected = district === d
                    const isLast = index === DISTRICTS.length - 1
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.districtItem,
                          selected && styles.districtItemSelected,
                          isLast && styles.districtItemLast,
                        ]}
                        onPress={() => {
                          setDistrict(d)
                          setDistrictDropdownOpen(false)
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.districtItemText,
                            selected && styles.districtItemTextSelected,
                          ]}
                        >
                          {d}
                        </Text>
                        {selected && (
                          <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              )}
            </View>

            {/* Location detection — now REQUIRED, gated by Dambulla service area */}
            <Text style={styles.label}>{t('location', lang)} *</Text>
            <TouchableOpacity
              style={[
                styles.locationButton,
                outOfServiceArea && styles.locationButtonError,
              ]}
              onPress={handleDetectLocation}
              disabled={locating}
            >
              <Ionicons
                name={outOfServiceArea ? 'alert-circle-outline' : 'location-outline'}
                size={18}
                color={outOfServiceArea ? COLORS.danger : COLORS.primary}
              />
              <Text
                style={[
                  styles.locationButtonText,
                  outOfServiceArea && { color: COLORS.danger },
                ]}
              >
                {locating
                  ? t('detectingLocation', lang)
                  : outOfServiceArea
                    ? `${t('outsideServiceArea', lang)} — tap to retry`
                    : coords
                      ? `Location set (${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)})`
                      : t('detectLocation', lang)}
              </Text>
            </TouchableOpacity>
            {outOfServiceArea && (
              <Text style={styles.errorText}>
                {t('outsideServiceAreaDesc', lang)}
              </Text>
            )}

            {/* Register Button — disabled until required fields above are valid */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (!isFormValid || loading) && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading || !isFormValid}
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

            {!isFormValid && (
              <Text style={styles.helperText}>
                {t('registerHelperText', lang)}
              </Text>
            )}

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                {t('haveAccount', lang)}
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
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },

  // District dropdown
  districtDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  districtDropdownHeaderOpen: {
    borderColor: COLORS.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  districtDropdownText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  districtDropdownPlaceholder: {
    color: COLORS.textMuted,
  },
  districtDropdownList: {
    maxHeight: 220,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: COLORS.primary,
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    ...SHADOW.soft,
  },
  districtItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  districtItemLast: {
    borderBottomWidth: 0,
  },
  districtItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  districtItemText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  districtItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  locationButtonError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FDECEA',
  },
  locationButtonText: {
    color: COLORS.textDark,
    fontSize: 13,
    flexShrink: 1,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOW.soft,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.border,
    ...SHADOW.soft,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 16,
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