import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settingItems = [
  '兴趣设置',
  '收藏',
  '推送时间',
  '屏蔽关键词',
  '数据来源说明',
  '隐私设置',
  '关于每日十条',
];

export default function MineScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>我的</Text>
          <Text style={styles.subtitle}>管理你的本地阅读偏好</Text>
        </View>

        <View style={styles.list}>
          {settingItems.map((item) => (
            <View key={item} style={styles.row}>
              <Text style={styles.rowText}>{item}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8f8',
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  header: {
    marginBottom: 18,
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
    gap: 10,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e4e8e8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  rowText: {
    color: '#1f2d30',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    color: '#8a9497',
    fontSize: 24,
    lineHeight: 24,
  },
});
