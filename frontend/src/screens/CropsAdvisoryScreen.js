import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { getCropAdvisory, getCropAdvisoryList } from '../services/api';
import { t } from '../../translations';
import { translateCropValue } from '../utils/cropDataTranslations';
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme';

// Icon shown per crop in the selector row.
const CROP_ICONS = {
  'Big Onion': '🧅',
  'Red Onion': '🧅',
  'Chilli': '🌶️',
  'Potato': '🥔',
  'Tomato': '🍅',
  'Maize': '🌽',
};
const getCropIcon = (cropName) => CROP_ICONS[cropName] || '🌱';

export default function CropsAdvisoryScreen() {
  const { lang } = useLanguage();

  const [cropList, setCropList] = useState([]);
  const [selectedCropName, setSelectedCropName] = useState('Big Onion');
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCropList = async () => {
    try {
      const response = await getCropAdvisoryList(lang);
      setCropList(response.data.data || []);
    } catch (err) {
      console.log('Crop advisory list load error:', err);
    }
  };

  const fetchAdvisory = async (cropName = selectedCropName) => {
    try {
      setError(null);
      const response = await getCropAdvisory(cropName, lang);
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
    fetchCropList();
    fetchAdvisory(selectedCropName);
  }, [lang]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCropList();
    fetchAdvisory(selectedCropName);
  };

  const handleCropSelect = (crop) => {
    if (crop.is_available === false) {
      Alert.alert(t('comingSoon', lang), t('comingSoonMessage', lang));
      return;
    }
    setSelectedCropName(crop.crop_name);
    setLoading(true);
    fetchAdvisory(crop.crop_name);
  };

  // Exclude the currently-selected crop — it's already shown in the banner above.
  const otherCrops = cropList.filter((crop) => crop.crop_name !== selectedCropName);

  const cropSelector = otherCrops.length > 0 && (
    <View style={styles.cropSelectorList}>
      {otherCrops.map((crop) => {
        const locked = crop.is_available === false;
        return (
          <TouchableOpacity
            key={crop.crop_name}
            style={[styles.cropRow, locked && styles.cropRowLocked]}
            onPress={() => handleCropSelect(crop)}
            activeOpacity={0.7}
          >
            <View style={[styles.cropRowIconWrap, locked && styles.cropRowIconWrapLocked]}>
              <Text style={styles.cropRowIcon}>{getCropIcon(crop.crop_name)}</Text>
            </View>
            <Text style={[styles.cropRowText, locked && styles.cropRowTextLocked]}>
              {translateCropValue(crop.crop_name, lang)}
            </Text>
            {locked && (
              <View style={styles.comingSoonBadge}>
                <Ionicons name="lock-closed" size={11} color="#8D6E63" style={{ marginRight: 4 }} />
                <Text style={styles.comingSoonBadgeText}>{t('comingSoon', lang)}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
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
        {/* Page title */}
        <View style={styles.pageTitleRow}>
          <View style={styles.pageTitleIconWrap}>
            <Text style={styles.pageTitleIcon}>🧺</Text>
          </View>
          <View>
            <Text style={styles.pageTitle}>{t('cropAdvisoryTitle', lang)}</Text>
            <Text style={styles.pageSubtitle}>{t('cropAdvisorySubtitle', lang)}</Text>
          </View>
        </View>

        {/* Compact header — currently selected crop */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Text style={styles.headerIcon}>{getCropIcon(advisory.crop_name)}</Text>
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

        {/* Other crops — currently selected crop excluded since it's shown above */}
        {cropSelector}

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
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  pageTitleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  pageTitleIcon: {
    fontSize: 22,
  },
  pageTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textDark,
  },
  pageSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  cropSelectorList: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  cropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  cropRowLocked: {
    backgroundColor: '#FAFAFA',
    opacity: 0.65,
  },
  cropRowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  cropRowIconWrapLocked: {
    backgroundColor: '#EEEEEE',
  },
  cropRowIcon: {
    fontSize: 20,
  },
  cropRowText: {
    fontSize: 16,
    color: COLORS.textDark,
    flex: 1,
  },
  cropRowTextLocked: {
    color: COLORS.textMuted,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8D6E63',
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
    marginBottom: SPACING.md,
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