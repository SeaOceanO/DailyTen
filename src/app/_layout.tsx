import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import { FavoritesProvider } from '../state/FavoritesContext';
import { SelectedDateProvider } from '../state/SelectedDateContext';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SelectedDateProvider>
          <FavoritesProvider>
            <AppTabs />
          </FavoritesProvider>
        </SelectedDateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppTabs() {
  const { colors, statusBarStyle } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.appRoot}>
      <StatusBar style={statusBarStyle} backgroundColor={colors.appBackground} />
      <Tabs
        tabBar={(props) => <TextOnlyTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: colors.appBackground,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
          }}
        />
        <Tabs.Screen
          name="international"
          options={{
            title: t('tabs.international'),
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: t('tabs.mine'),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            href: null,
            title: t('favorites.title'),
          }}
        />
      </Tabs>
    </View>
  );
}

function TextOnlyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tabBottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <View style={[styles.tabBar, { height: 64 + tabBottomInset, paddingBottom: tabBottomInset }]}>
      {state.routes.map((route) => {
        const options = descriptors[route.key]?.options;
        const hidden = route.name === 'favorites';

        if (hidden) {
          return null;
        }

        const focused = state.routes[state.index]?.key === route.key;
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    appRoot: {
      flex: 1,
      backgroundColor: colors.appBackground,
      width: '100%',
    },
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
      height: 64,
      justifyContent: 'center',
      minWidth: 0,
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
}
