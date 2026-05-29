import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateSelector, getRecentDateOptions } from './DateSelector';
import { NewsCard } from './NewsCard';
import { getMockNews, type NewsCategory } from '../data/mockNews';
import { useSelectedDate } from '../state/SelectedDateContext';

type NewsFeedScreenProps = {
  category: NewsCategory;
  title: string;
  subtitle: string;
};

export function NewsFeedScreen({ category, title, subtitle }: NewsFeedScreenProps) {
  const dates = useMemo(() => getRecentDateOptions(7), []);
  const { selectedDateKey, setSelectedDateKey } = useSelectedDate();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const newsItems = useMemo(
    () => getMockNews(category, selectedDateKey),
    [category, selectedDateKey],
  );

  function toggleFavorite(id: string) {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id],
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <DateSelector
        dates={dates}
        selectedDateKey={selectedDateKey}
        onSelectDate={setSelectedDateKey}
      />

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.countText}>今日精选 10 条</Text>
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8f8',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    color: '#162326',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#687578',
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
    color: '#687578',
    fontSize: 13,
    fontWeight: '700',
  },
});
