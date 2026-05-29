import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NewsItem } from '../data/mockNews';

type NewsCardProps = {
  item: NewsItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export function NewsCard({ item, isFavorite, onToggleFavorite }: NewsCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.imagePlaceholder, { backgroundColor: item.placeholderColor }]}>
        <Text style={styles.imageText}>图片占位</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Pressable
            accessibilityLabel={isFavorite ? '取消收藏' : '收藏'}
            accessibilityRole="button"
            onPress={() => onToggleFavorite(item.id)}
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}>
            <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.summary}>{item.summary}</Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>为什么重要</Text>
          <Text style={styles.reasonText}>{item.whyItMatters}</Text>
        </View>

        <Text style={styles.source}>来源：{item.source}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e1e7e7',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    alignItems: 'center',
    height: 132,
    justifyContent: 'center',
  },
  imageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
    color: '#172326',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
  },
  favoriteButton: {
    alignItems: 'center',
    borderColor: '#d2dada',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  favoriteButtonActive: {
    backgroundColor: '#fff4cf',
    borderColor: '#e4c45f',
  },
  favoriteIcon: {
    color: '#6d777a',
    fontSize: 18,
    lineHeight: 20,
  },
  favoriteIconActive: {
    color: '#9a7314',
  },
  summary: {
    color: '#415053',
    fontSize: 14,
    lineHeight: 21,
  },
  reasonBox: {
    backgroundColor: '#f4f7f7',
    borderRadius: 8,
    padding: 12,
  },
  reasonLabel: {
    color: '#254f55',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  reasonText: {
    color: '#465457',
    fontSize: 13,
    lineHeight: 19,
  },
  source: {
    color: '#6b7679',
    fontSize: 12,
  },
});
