import React from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function LanguageSelectScreen({ navigation }) {
  const { changeLanguage } = useLanguage()

  const handleLanguageSelect = async (selectedLang) => {
    await changeLanguage(selectedLang)
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.container}>

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
        <Text style={styles.tagline}>Intelligent Irrigation & Disease Forecasting</Text>
        <Text style={styles.taglineSi}>වාරිමාර්ග හා රෝග අනාවැකිය</Text>
        <Text style={styles.taglineTa}>நுண்ணிய நீர்ப்பாசனம் மற்றும் நோய் முன்னறிவிப்பு</Text>
      </View>

      {/* Language Selection Card */}
      <View style={styles.card}>
        <Text style={styles.chooseText}>Choose Your Language</Text>
        <Text style={styles.chooseTextSub}>භාෂාව තෝරන්න · மொழியை தேர்வு செய்யவும்</Text>

        {/* English */}
        <TouchableOpacity
          style={styles.langCard}
          onPress={() => handleLanguageSelect('en')}
          activeOpacity={0.7}
        >
          <View style={styles.flagCircle}>
            <Image source={require('../../assets/flags/flag-gb.png')} style={styles.flagImage} />
          </View>
          <Text style={styles.langCardText}>English</Text>
        </TouchableOpacity>

        {/* Sinhala */}
        <TouchableOpacity
          style={styles.langCard}
          onPress={() => handleLanguageSelect('si')}
          activeOpacity={0.7}
        >
          <View style={styles.flagCircle}>
            <Image source={require('../../assets/flags/flag-lk.png')} style={styles.flagImage} />
          </View>
          <Text style={styles.langCardText}>සිංහල</Text>
        </TouchableOpacity>

        {/* Tamil */}
        <TouchableOpacity
          style={styles.langCard}
          onPress={() => handleLanguageSelect('ta')}
          activeOpacity={0.7}
        >
          <View style={styles.flagCircle}>
            <Image source={require('../../assets/flags/flag-lk.png')} style={styles.flagImage} />
          </View>
          <Text style={styles.langCardText}>தமிழ்</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Dambulla, Sri Lanka 🇱🇰</Text>
          <Text style={styles.footerVersion}>Powered by Smart Grow</Text>
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
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
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  logo: {
    width: 78,
    height: 78,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: '#fff',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: 12,
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 2,
  },
  taglineSi: {
    fontSize: 12,
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 2,
  },
  taglineTa: {
    fontSize: 12,
    color: '#E8F5E9',
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    ...SHADOW.card,
  },
  chooseText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  chooseTextSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  langCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.soft,
  },
  flagCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  flagImage: {
    width: 48,
    height: 36,
    borderRadius: RADIUS.sm,
  },
  langCardText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
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