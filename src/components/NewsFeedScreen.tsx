import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateSelector, getRecentDateOptions } from './DateSelector';
import { NewsCard } from './NewsCard';
import { getMockNews, type NewsCategory } from '../data/mockNews';
import { useLanguage } from '../i18n/LanguageContext';
import { useFavorites } from '../state/FavoritesContext';
import { useSelectedDate } from '../state/SelectedDateContext';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';

type NewsFeedScreenProps = {
  category: NewsCategory;
};

export function NewsFeedScreen({ category }: NewsFeedScreenProps) {
  const { language, t } = useLanguage();
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { currentDateKey, selectedDateKey, setSelectedDateKey } = useSelectedDate();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const dates = useMemo(
    () => getRecentDateOptions(7, currentDateKey, language, t('date.today')),
    [currentDateKey, language, t],
  );
  const newsItems = useMemo(
    () => getMockNews(category, selectedDateKey, language),
    [category, language, selectedDateKey],
  );
  const title = category === 'home' ? t('screens.home.title') : t('screens.international.title');
  const subtitle =
    category === 'home' ? t('screens.home.subtitle') : t('screens.international.subtitle');
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <DateSelector
        currentDateKey={currentDateKey}
        dates={dates}
        selectedDateKey={selectedDateKey}
        onSelectDate={setSelectedDateKey}
      />

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.countText}>{t('feed.todayPicks')}</Text>
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },
    header: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 12,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 0,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 6,
    },
    list: {
      gap: 14,
      paddingBottom: 8,
      paddingHorizontal: 18,
      paddingTop: 14,
    },
    countText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
