import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOW } from '../theme'

const { width } = Dimensions.get('window')

const PAGES = [
  {
    code: 'en',
    tabLabel: 'English',
    title: 'About Smart Grow',
    body: 'Smart Grow helps Big Onion farmers make better irrigation and disease-prevention decisions using real-time weather data and research-backed recommendations — available in English, Sinhala, and Tamil.',
    button: 'Get Started',
  },
  {
    code: 'si',
    tabLabel: 'සිංහල',
    title: 'ස්මාර්ට් ග්‍රෝ පිළිබඳ',
    body: 'තථ්‍ය කාලීන කාලගුණ දත්ත සහ පර්යේෂණ පදනම් වූ නිර්දේශ භාවිතා කරමින්, ලොකු ලූනු ගොවීන්ට වඩා හොඳ වාරිමාර්ග හා රෝග වැළැක්වීමේ තීරණ ගැනීමට ස්මාර්ට් ග්‍රෝ උපකාරී වේ — සිංහල, ඉංග්‍රීසි සහ දෙමළ භාෂාවලින්.',
    button: 'ආරම්භ කරන්න',
  },
  {
    code: 'ta',
    tabLabel: 'தமிழ்',
    title: 'ஸ்மார்ட் க்ரோ பற்றி',
    body: 'நிகழ்நேர வானிலை தரவு மற்றும் ஆராய்ச்சி அடிப்படையிலான பரிந்துரைகளைப் பயன்படுத்தி, பெரிய வெங்காய விவசாயிகள் சிறந்த நீர்ப்பாசன மற்றும் நோய் தடுப்பு முடிவுகளை எடுக்க ஸ்மார்ட் க்ரோ உதவுகிறது — தமிழ், ஆங்கிலம் மற்றும் சிங்களத்தில்.',
    button: 'தொடங்குங்கள்',
  },
]

export default function AboutScreen({ navigation }) {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = (index) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true })
    setActiveIndex(index)
  }

  const handleMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tappable language tab bar */}
      <View style={styles.tabBar}>
        {PAGES.map((page, index) => (
          <TouchableOpacity
            key={page.code}
            style={[styles.tab, activeIndex === index && styles.tabActive]}
            onPress={() => scrollToIndex(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeIndex === index && styles.tabTextActive]}>
              {page.tabLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {PAGES.map((page) => (
          <View key={page.code} style={styles.page}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.body}>{page.body}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('LanguageSelect')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>{page.button}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {PAGES.map((page, index) => (
          <View
            key={page.code}
            style={[styles.dot, activeIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    ...SHADOW.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  page: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  logoBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.soft,
  },
  logo: {
    width: 96,
    height: 96,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  body: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.soft,
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
})