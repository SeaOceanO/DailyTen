import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NewsCard } from '../components/NewsCard';
import { localizeNewsItem } from '../data/mockNews';
import type { FavoriteNewsItem, NewsCategory } from '../data/mockNews';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { useFavorites } from '../state/FavoritesContext';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { language, t } = useLanguage();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const localizedFavorites = useMemo(
    () => favorites.map((favorite) => localizeNewsItem(favorite, language)),
    [favorites, language],
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}>
          <Text style={styles.backText}>{t('favorites.back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('favorites.title')}</Text>
      </View>

      {localizedFavorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{t('favorites.emptyTitle')}</Text>
          <Text style={styles.emptyHint}>{t('favorites.emptyHint')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {localizedFavorites.map((item) => (
            <View key={item.id} style={styles.favoriteItem}>
              <Text style={styles.metaText}>{getFavoriteMeta(item, language, t)}</Text>
              <NewsCard
                item={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function getFavoriteMeta(
  item: FavoriteNewsItem,
  language: Language,
  t: ReturnType<typeof useLanguage>['t'],
) {
  const categoryLabel =
    item.category === 'home'
      ? t('favorites.category.home')
      : t('favorites.category.international');

  return `${categoryLabel} · ${formatDateKey(item.dateKey, language)} · ${item.source}`;
}

function formatDateKey(dateKey: string, language: Language) {
  const [year, month, day] = dateKey.split('-').map(Number);

  if (!year || !month || !day) {
    return dateKey;
  }

  if (language === 'en') {
    return `${getEnglishMonth(month)} ${day}, ${year}`;
  }

  return `${year}年${month}月${day}日`;
}

function getEnglishMonth(month: number) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[month - 1] ?? '';
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },
    header: {
      paddingBottom: 12,
      paddingHorizontal: 18,
      paddingTop: 12,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: 12,
      paddingVertical: 4,
    },
    backText: {
      color: colors.accentStrong,
      fontSize: 15,
      fontWeight: '700',
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 0,
    },
    list: {
      gap: 16,
      paddingBottom: 24,
      paddingHorizontal: 18,
    },
    favoriteItem: {
      gap: 8,
    },
    metaText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    emptyState: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '800',
      lineHeight: 28,
      textAlign: 'center',
    },
    emptyHint: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 8,
      textAlign: 'center',
    },
  });
}
