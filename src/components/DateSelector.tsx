import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../theme/colors';

export type DateOption = {
  key: string;
  dayNumber: string;
  label: string;
  weekday: string;
};

type CalendarCell = {
  date: Date | null;
  dateKey: string;
  dayNumber: string;
  disabled: boolean;
  isSelected: boolean;
  isToday: boolean;
};

const weekdays = [
  '\u5468\u65e5',
  '\u5468\u4e00',
  '\u5468\u4e8c',
  '\u5468\u4e09',
  '\u5468\u56db',
  '\u5468\u4e94',
  '\u5468\u516d',
];
const calendarWeekdays = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d'];
const calendarExpandedHeight = 360;

export function getRecentDateOptions(days = 7, currentDateKey?: string): DateOption[] {
  const today = parseDateKey(currentDateKey ?? '') ?? getToday();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - index);

    return {
      key: formatDateKey(date),
      dayNumber: String(date.getDate()),
      label: index === 0 ? '\u4eca\u5929' : `${date.getMonth() + 1}\u6708${date.getDate()}\u65e5`,
      weekday: weekdays[date.getDay()],
    };
  });
}

type DateSelectorProps = {
  currentDateKey: string;
  dates: DateOption[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

type ChevronButtonProps = {
  accessibilityLabel: string;
  direction: 'down' | 'up';
  onPress: () => void;
  placement: 'row' | 'panel';
};

export function DateSelector({
  currentDateKey,
  dates,
  selectedDateKey,
  onSelectDate,
}: DateSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const calendarProgress = useRef(new Animated.Value(0)).current;
  const today = useMemo(() => parseDateKey(currentDateKey) ?? getToday(), [currentDateKey]);
  const selectedDate = useMemo(() => parseDateKey(selectedDateKey) ?? today, [selectedDateKey, today]);
  const calendarCells = useMemo(
    () => getCalendarCells(selectedDate, selectedDateKey, today),
    [selectedDate, selectedDateKey, today],
  );
  const calendarTitle = `${selectedDate.getFullYear()}\u5e74${selectedDate.getMonth() + 1}\u6708`;
  const collapsedPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          isVerticalSwipe(gestureState.dx, gestureState.dy, 'down'),
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          isVerticalSwipe(gestureState.dx, gestureState.dy, 'down'),
        onPanResponderGrant: () => setExpanded(true),
        onPanResponderRelease: (_, gestureState) => {
          if (isVerticalSwipe(gestureState.dx, gestureState.dy, 'down')) {
            setExpanded(true);
          }
        },
        onPanResponderTerminationRequest: () => true,
      }),
    [],
  );
  const expandedPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          isVerticalSwipe(gestureState.dx, gestureState.dy, 'up'),
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          isVerticalSwipe(gestureState.dx, gestureState.dy, 'up'),
        onPanResponderGrant: () => setExpanded(false),
        onPanResponderRelease: (_, gestureState) => {
          if (isVerticalSwipe(gestureState.dx, gestureState.dy, 'up')) {
            setExpanded(false);
          }
        },
        onPanResponderTerminationRequest: () => true,
      }),
    [],
  );

  useEffect(() => {
    Animated.timing(calendarProgress, {
      toValue: expanded ? 1 : 0,
      duration: expanded ? 240 : 220,
      easing: expanded ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [calendarProgress, expanded]);

  function toggleExpanded() {
    setExpanded((current) => !current);
  }

  function selectCalendarDate(cell: CalendarCell) {
    if (!cell.date || cell.disabled) {
      return;
    }

    onSelectDate(cell.dateKey);
  }

  const calendarContainerStyle = {
    height: calendarProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, calendarExpandedHeight],
    }),
    marginTop: calendarProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    }),
    opacity: calendarProgress.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 0.55, 1],
    }),
  };

  const calendarPanelStyle = {
    opacity: calendarProgress,
    transform: [
      {
        translateY: calendarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-16, 0],
        }),
      },
      {
        scale: calendarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1],
        }),
      },
    ],
  };

  const calendarGridStyle = {
    opacity: calendarProgress.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [0, 0.4, 1],
    }),
    transform: [
      {
        translateY: calendarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-6, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.dateRow} {...collapsedPanResponder.panHandlers}>
        <ChevronButton
          accessibilityLabel={expanded ? '\u6536\u8d77\u65e5\u5386' : '\u5c55\u5f00\u65e5\u5386'}
          direction={expanded ? 'up' : 'down'}
          onPress={toggleExpanded}
          placement="row"
        />

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
                <Text style={[styles.weekday, selected && styles.selectedMeta]}>
                  {date.weekday}
                </Text>
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
      </View>

      <Animated.View
        pointerEvents={expanded ? 'auto' : 'none'}
        style={[styles.calendarContainer, calendarContainerStyle]}>
        <Animated.View
          {...expandedPanResponder.panHandlers}
          style={[styles.calendarPanel, calendarPanelStyle]}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={styles.calendarTitle}>{calendarTitle}</Text>
              <Text style={styles.calendarSubtitle}>
                {'\u53ef\u67e5\u770b\u4eca\u5929\u53ca\u4ee5\u524d\u7684\u65e5\u671f'}
              </Text>
            </View>
            <ChevronButton
              accessibilityLabel="\u6536\u8d77\u65e5\u5386"
              direction="up"
              onPress={() => setExpanded(false)}
              placement="panel"
            />
          </View>

          <Animated.View style={[styles.calendarContent, calendarGridStyle]}>
            <View style={styles.weekdayGrid}>
              {calendarWeekdays.map((weekday) => (
                <Text key={weekday} style={styles.calendarWeekday}>
                  {weekday}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarCells.map((cell, index) => (
                <Pressable
                  key={cell.dateKey || `empty-${index}`}
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: cell.disabled || !cell.date,
                    selected: cell.isSelected,
                  }}
                  disabled={!cell.date || cell.disabled}
                  onPress={() => selectCalendarDate(cell)}
                  style={styles.calendarCell}>
                  {cell.date && (
                    <View
                      style={[
                        styles.calendarDay,
                        cell.isToday && styles.todayDay,
                        cell.isSelected && styles.selectedCalendarDay,
                        cell.disabled && styles.disabledDay,
                      ]}>
                      <Text
                        style={[
                          styles.calendarDayText,
                          cell.isToday && styles.todayDayText,
                          cell.isSelected && styles.selectedCalendarDayText,
                          cell.disabled && styles.disabledDayText,
                        ]}>
                        {cell.dayNumber}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function ChevronButton({ accessibilityLabel, direction, onPress, placement }: ChevronButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chevronButtonBase,
        placement === 'row' ? styles.rowChevronButton : styles.panelChevronButton,
        pressed && styles.chevronButtonPressed,
      ]}>
      <View pointerEvents="none" style={styles.chevronIcon}>
        <View
          style={[
            styles.chevronLine,
            direction === 'down' ? styles.chevronDownLeft : styles.chevronUpLeft,
          ]}
        />
        <View
          style={[
            styles.chevronLine,
            direction === 'down' ? styles.chevronDownRight : styles.chevronUpRight,
          ]}
        />
      </View>
    </Pressable>
  );
}

function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function isVerticalSwipe(dx: number, dy: number, direction: 'down' | 'up') {
  const verticalDistance = Math.abs(dy);
  const horizontalDistance = Math.abs(dx);
  const isIntentionalVerticalSwipe = verticalDistance > 20 && verticalDistance > horizontalDistance * 1.15;

  return isIntentionalVerticalSwipe && (direction === 'down' ? dy > 0 : dy < 0);
}

function getCalendarCells(selectedDate: Date, selectedDateKey: string, today: Date): CalendarCell[] {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyCount = firstDay.getDay();
  const totalCells = Math.ceil((leadingEmptyCount + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - leadingEmptyCount + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return {
        date: null,
        dateKey: '',
        dayNumber: '',
        disabled: true,
        isSelected: false,
        isToday: false,
      };
    }

    const date = new Date(year, month, dayNumber);
    const dateKey = formatDateKey(date);
    const isFuture = date.getTime() > today.getTime();

    return {
      date,
      dateKey,
      dayNumber: String(dayNumber),
      disabled: isFuture,
      isSelected: dateKey === selectedDateKey,
      isToday: dateKey === formatDateKey(today),
    };
  });
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 2,
  },
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chevronButtonBase: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  rowChevronButton: {
    marginLeft: 18,
    marginRight: 5,
  },
  panelChevronButton: {
    marginLeft: 12,
  },
  chevronButtonPressed: {
    backgroundColor: colors.border,
  },
  chevronIcon: {
    height: 14,
    position: 'relative',
    width: 20,
  },
  chevronLine: {
    backgroundColor: colors.accentStrong,
    borderRadius: 2,
    height: 3,
    position: 'absolute',
    top: 6,
    width: 12,
  },
  chevronDownLeft: {
    left: 0,
    transform: [{ rotate: '42deg' }],
  },
  chevronDownRight: {
    right: 0,
    transform: [{ rotate: '-42deg' }],
  },
  chevronUpLeft: {
    left: 0,
    transform: [{ rotate: '-42deg' }],
  },
  chevronUpRight: {
    right: 0,
    transform: [{ rotate: '42deg' }],
  },
  scroller: {
    flexGrow: 0,
    flexShrink: 1,
  },
  container: {
    gap: 10,
    paddingLeft: 6,
    paddingRight: 18,
    paddingVertical: 4,
  },
  item: {
    alignItems: 'center',
    minWidth: 58,
  },
  weekday: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
  },
  dayBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  selectedDayBox: {
    backgroundColor: colors.accent,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  selectedDayNumber: {
    color: '#081111',
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
  selectedMeta: {
    color: colors.accentStrong,
    fontWeight: '700',
  },
  calendarContainer: {
    marginHorizontal: 18,
    overflow: 'hidden',
  },
  calendarPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: calendarExpandedHeight,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  calendarSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  calendarContent: {
    flex: 1,
  },
  weekdayGrid: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  calendarWeekday: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 12,
    rowGap: 5,
  },
  calendarCell: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  calendarDay: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  todayDay: {
    borderColor: colors.accentStrong,
  },
  selectedCalendarDay: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  disabledDay: {
    opacity: 0.34,
  },
  calendarDayText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  todayDayText: {
    color: colors.accentStrong,
  },
  selectedCalendarDayText: {
    color: '#081111',
  },
  disabledDayText: {
    color: colors.textMuted,
  },
});
