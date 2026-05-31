import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SelectedDateProvider } from '../state/SelectedDateContext';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <SelectedDateProvider>
      <StatusBar style="light" backgroundColor={colors.appBackground} />
      <Tabs
        tabBar={(props) => <TextOnlyTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '\u4e3b\u9875',
          }}
        />
        <Tabs.Screen
          name="international"
          options={{
            title: '\u56fd\u9645',
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: '\u6211\u7684',
          }}
        />
      </Tabs>
    </SelectedDateProvider>
  );
}

function TextOnlyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { height: 50 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const options = descriptors[route.key]?.options;
        const label =
          options?.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options?.title !== undefined
              ? options.title
              : route.name;

        function onPress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}>
            <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
              {typeof label === 'string' ? label : options?.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.accentStrong,
  },
});
