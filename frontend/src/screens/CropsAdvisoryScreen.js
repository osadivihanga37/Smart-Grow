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
        {/* Compact header */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Text style={styles.headerIcon}>🧅</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>{translateCropValue(advisory.crop_name, lang)}</Text>
            <Text style={styles.headerSubtitle}>{translateCropValue(advisory.region, lang)}</Text>
          </View>
        </View>

        {/* Compact 2-column grid */}
        <View style={styles.grid}>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>📊</Text>
            <Text style={styles.gridLabel}>{t('averageYield', lang)}</Text>
            <Text style={styles.gridValue}>
              {advisory.average_yield_mt_per_ha} {t('perHectare', lang)}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>💰</Text>
            <Text style={styles.gridLabel}>{t('productionCost', lang)}</Text>
            <Text style={styles.gridValue}>
              Rs. {advisory.production_cost_per_kg} {t('perKg', lang)}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>📅</Text>
            <Text style={styles.gridLabel}>{t('harvestWindow', lang)}</Text>
            <Text style={styles.gridValueSmall}>
              {translateCropValue(advisory.harvest_start_month, lang)} – {translateCropValue(advisory.harvest_end_month, lang)}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>💧</Text>
            <Text style={styles.gridLabel}>{t('bestIrrigationMethod', lang)}</Text>
            <Text style={styles.gridValueSmall}>{translateCropValue(advisory.best_irrigation_method, lang)}</Text>
            <Text style={styles.gridSubValue}>
              {advisory.best_irrigation_yield} {t('perHectare', lang)}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🌱</Text>
            <Text style={styles.gridLabel}>{t('bestLandType', lang)}</Text>
            <Text style={styles.gridValueSmall}>{translateCropValue(advisory.best_land_type, lang)}</Text>
            <Text style={styles.gridSubValue}>
              {advisory.best_land_type_yield} {t('perHectare', lang)}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridIcon}>🌾</Text>
            <Text style={styles.gridLabel}>{t('bestSeedVariety', lang)}</Text>
            <Text style={styles.gridValueSmall}>{translateCropValue(advisory.best_seed_variety, lang)}</Text>
            <Text style={styles.gridSubValue}>
              {advisory.best_seed_variety_yield} {t('perHectare', lang)}
            </Text>
          </View>

        </View>

        <Text style={styles.source}>{t('source', lang)}: {translateCropValue(advisory.data_source, lang)}</Text>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FFF8E1',
    marginTop: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
    ...SHADOW.soft,
  },
  gridIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  gridValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  gridValueSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 17,
  },
  gridSubValue: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  source: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});