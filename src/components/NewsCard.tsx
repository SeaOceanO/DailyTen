import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CoverVisual } from './CoverVisual';
import type { NewsItem } from '../data/mockNews';
import { colors } from '../theme/colors';

type NewsCardProps = {
  item: NewsItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export function NewsCard({ item, isFavorite, onToggleFavorite }: NewsCardProps) {
  return (
    <View style={styles.card}>
      <CoverVisual visual={item.coverVisual} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Pressable
            accessibilityLabel={isFavorite ? '\u53d6\u6d88\u6536\u85cf' : '\u6536\u85cf'}
            accessibilityRole="button"
            onPress={() => onToggleFavorite(item.id)}
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}>
            <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
              {isFavorite ? '\u2605' : '\u2606'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.summary}>{item.summary}</Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>{'\u4e3a\u4ec0\u4e48\u91cd\u8981'}</Text>
          <Text style={styles.reasonText}>{item.whyItMatters}</Text>
        </View>

        <Text style={styles.source}>
          {'\u6765\u6e90\uff1a'}
          {item.source}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  body: {
    gap: 10,
    padding: 16,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
  },
  favoriteButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  favoriteButtonActive: {
    backgroundColor: colors.favoriteBackground,
    borderColor: colors.favoriteBorder,
  },
  favoriteIcon: {
    color: colors.textSecondary,
    fontSize: 18,
    lineHeight: 20,
  },
  favoriteIconActive: {
    color: colors.favoriteText,
  },
  summary: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  reasonBox: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 8,
    padding: 12,
  },
  reasonLabel: {
    color: colors.accentStrong,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  reasonText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  source: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
