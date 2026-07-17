import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { getCropAdvisory } from '../services/api';
import { t } from '../../translations';
import { translateCropValue } from '../utils/cropDataTranslations';
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme';

export default function CropsAdvisoryScreen() {
  const { lang } = useLanguage();

  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvisory = async () => {
    try {
      setError(null);
      const response = await getCropAdvisory('Big Onion', lang);
      setAdvisory(response.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || t('error', lang);
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [lang]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdvisory();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.decorIcon, styles.decorIcon1]}>🧅</Text>
          <Text style={[styles.decorIcon, styles.decorIcon2]}>🧅</Text>
          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <Text style={styles.headerIcon}>🧅</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{translateCropValue(advisory.crop_name, lang)}</Text>
              <Text style={styles.headerSubtitle}>{translateCropValue(advisory.region, lang)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardsWrap}>

          {/* Average Yield */}
          <View style={styles.card}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.cardIcon}>📊</Text>
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLabel}>{t('averageYield', lang)}</Text>
              <Text style={styles.cardValue}>
                {advisory.average_yield_mt_per_ha} {t('perHectare', lang)}
              </Text>
            </View>
          </View>

          {/* Best Irrigation Method */}
          <View style={styles.card}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.cardIcon}>💧</Text>
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLabel}>{t('bestIrrigationMethod', lang)}</Text>
              <Text style={styles.cardValue}>{translateCropValue(advisory.best_irrigation_method, lang)}</Text>
              <Text style={styles.cardSubValue}>
                {t('yieldLabel', lang)}: {advisory.best_irrigation_yield} {t('perHectare', lang)}
              </Text>
            </View>
          </View>

          {/* Best Land Type */}
          <View style={styles.card}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.cardIcon}>🌱</Text>
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLabel}>{t('bestLandType', lang)}</Text>
              <Text style={styles.cardValue}>{translateCropValue(advisory.best_land_type, lang)}</Text>
              <Text style={styles.cardSubValue}>
                {t('yieldLabel', lang)}: {advisory.best_land_type_yield} {t('perHectare', lang)}
              </Text>
            </View>
          </View>

          {/* Best Seed Variety */}
          <View style={styles.card}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.cardIcon}>🌾</Text>
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLabel}>{t('bestSeedVariety', lang)}</Text>
              <Text style={styles.cardValue}>{translateCropValue(advisory.best_seed_variety, lang)}</Text>
              <Text style={styles.cardSubValue}>
                {t('yieldLabel', lang)}: {advisory.best_seed_variety_yield} {t('perHectare', lang)}
              </Text>
            </View>
          </View>

          {/* Harvest Window */}
          <View style={styles.card}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#FFF8E1' }]}>
              <Text style={styles.cardIcon}>📅</Text>
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLabel}>{t('harvestWindow', lang)}</Text>
              <Text style={styles.cardValue}>
                {translateCropValue(advisory.harvest_start_month, lang)} – {translateCropValue(advisory.harvest_end_month, lang)}
              </Text>
            </View>
          </View>

          {/* Production Cost */}
          <View style={styles.card}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#FBE9E7' }]}>
              <Text style={styles.cardIcon}>💰</Text>
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLabel}>{t('productionCost', lang)}</Text>
              <Text style={styles.cardValue}>
                Rs. {advisory.production_cost_per_kg} {t('perKg', lang)}
              </Text>
            </View>
          </View>

          <Text style={styles.source}>{t('source', lang)}: {translateCropValue(advisory.data_source, lang)}</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    paddingTop: SPACING.sm,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorIcon: {
    position: 'absolute',
    opacity: 0.15,
  },
  decorIcon1: {
    top: -10,
    right: 20,
    fontSize: 60,
  },
  decorIcon2: {
    bottom: -10,
    right: 100,
    fontSize: 30,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: '#FFF8E1',
    marginTop: 2,
  },
  cardsWrap: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...SHADOW.soft,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  cardSubValue: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  source: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});