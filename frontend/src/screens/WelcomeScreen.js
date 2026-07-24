import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../../translations'
import { COLORS, TYPOGRAPHY, SPACING } from '../theme'

export default function WelcomeScreen({ navigation }) {
  const { lang } = useLanguage()
  const pulseA = useRef(new Animated.Value(0)).current
  const pulseB = useRef(new Animated.Value(0)).current
  const logoScale = useRef(new Animated.Value(0.85)).current
  const logoRotate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loopPulse = (value, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 2200,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )

    const loopLogoScale = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.85,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )

    const loopLogoRotate = Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: -1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )

    loopPulse(pulseA, 0).start()
    loopPulse(pulseB, 600).start()
    loopLogoScale.start()
    loopLogoRotate.start()

    const timer = setTimeout(() => {
      navigation.replace('About')
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigation])

  const circleAScale = pulseA.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] })
  const circleAOpacity = pulseA.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.9] })
  const circleBScale = pulseB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] })
  const circleBOpacity = pulseB.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] })
  const logoRotateDeg = logoRotate.interpolate({ inputRange: [-1, 1], outputRange: ['-4deg', '4deg'] })

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.circleA,
          { transform: [{ scale: circleAScale }], opacity: circleAOpacity },
        ]}
      />
      <Animated.View
        style={[
          styles.circleB,
          { transform: [{ scale: circleBScale }], opacity: circleBOpacity },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Animated.Image
            source={require('../../assets/logo.png')}
            style={[
              styles.logo,
              { transform: [{ scale: logoScale }, { rotate: logoRotateDeg }] },
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{t('welcomeTo', lang)}</Text>
        <Text style={styles.name}>Smart Grow</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  circleA: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleB: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(249,168,37,0.14)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  logoBadge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 130,
    height: 130,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
    textAlign: 'center',
  },
  name: {
    ...TYPOGRAPHY.h1,
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },
})