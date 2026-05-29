import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export type DateOption = {
  key: string;
  dayNumber: string;
  label: string;
  weekday: string;
};

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getRecentDateOptions(days = 7): DateOption[] {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - index);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    return {
      key,
      dayNumber: String(date.getDate()),
      label: index === 0 ? '今天' : `${date.getMonth() + 1}月${date.getDate()}日`,
      weekday: weekdays[date.getDay()],
    };
  });
}

type DateSelectorProps = {
  dates: DateOption[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

export function DateSelector({ dates, selectedDateKey, onSelectDate }: DateSelectorProps) {
  return (
    <ScrollView
      horizontal
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      contentOffset={{ x: 0, y: 0 }}
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
      contentContainerStyle={styles.container}>
      {dates.map((date) => {
        const selected = date.key === selectedDateKey;

        return (
          <Pressable
            key={date.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelectDate(date.key)}
            style={styles.item}>
            <Text style={[styles.weekday, selected && styles.selectedMeta]}>{date.weekday}</Text>
            <View style={[styles.dayBox, selected && styles.selectedDayBox]}>
              <Text style={[styles.dayNumber, selected && styles.selectedDayNumber]}>
                {date.dayNumber}
              </Text>
            </View>
            <Text style={[styles.label, selected && styles.selectedMeta]}>{date.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flexGrow: 0,
  },
  container: {
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  item: {
    alignItems: 'center',
    minWidth: 58,
  },
  weekday: {
    color: '#778285',
    fontSize: 12,
    marginBottom: 6,
  },
  dayBox: {
    alignItems: 'center',
    backgroundColor: '#edf1f1',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  selectedDayBox: {
    backgroundColor: '#254f55',
  },
  dayNumber: {
    color: '#1f2d30',
    fontSize: 17,
    fontWeight: '700',
  },
  selectedDayNumber: {
    color: '#ffffff',
  },
  label: {
    color: '#778285',
    fontSize: 11,
    marginTop: 6,
  },
  selectedMeta: {
    color: '#254f55',
    fontWeight: '700',
  },
});
