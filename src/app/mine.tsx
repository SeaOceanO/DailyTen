import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '../i18n/LanguageContext';
import type { Language, TranslationKey } from '../i18n/translations';
import { useTheme, type ThemePreference } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';

type SettingItem = {
  key: string;
  labelKey: TranslationKey;
};

const settingItems: SettingItem[] = [
  { key: 'interests', labelKey: 'settings.interests' },
  { key: 'theme', labelKey: 'settings.theme' },
  { key: 'language', labelKey: 'settings.language' },
  { key: 'favorites', labelKey: 'settings.favorites' },
  { key: 'pushTime', labelKey: 'settings.pushTime' },
  { key: 'blockedKeywords', labelKey: 'settings.blockedKeywords' },
  { key: 'sourceInfo', labelKey: 'settings.sourceInfo' },
  { key: 'privacy', labelKey: 'settings.privacy' },
  { key: 'about', labelKey: 'settings.about' },
];

const themeOptions: { labelKey: TranslationKey; value: ThemePreference }[] = [
  { labelKey: 'theme.dark', value: 'dark' },
  { labelKey: 'theme.light', value: 'light' },
  { labelKey: 'theme.system', value: 'system' },
];

const languageOptions: { labelKey: TranslationKey; value: Language }[] = [
  { labelKey: 'language.zh', value: 'zh' },
  { labelKey: 'language.en', value: 'en' },
];

const themePreferenceLabelKeys: Record<ThemePreference, TranslationKey> = {
  dark: 'theme.dark',
  light: 'theme.light',
  system: 'theme.system',
};

const languageLabelKeys: Record<Language, TranslationKey> = {
  zh: 'language.zh',
  en: 'language.en',
};

export default function MineScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { colors, preference, setThemePreference } = useTheme();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  function selectTheme(nextPreference: ThemePreference) {
    setThemePreference(nextPreference);
    setThemeModalVisible(false);
  }

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setLanguageModalVisible(false);
  }

  function handleSettingPress(itemKey: string) {
    if (itemKey === 'theme') {
      setThemeModalVisible(true);
      return;
    }

    if (itemKey === 'language') {
      setLanguageModalVisible(true);
      return;
    }

    if (itemKey === 'favorites') {
      router.push('/favorites');
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('mine.title')}</Text>
          <Text style={styles.subtitle}>{t('mine.subtitle')}</Text>
        </View>

        <View style={styles.list}>
          {settingItems.map((item) => {
            const isThemeRow = item.key === 'theme';
            const isLanguageRow = item.key === 'language';
            const isFavoritesRow = item.key === 'favorites';
            const isInteractiveRow = isThemeRow || isLanguageRow || isFavoritesRow;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                disabled={!isInteractiveRow}
                onPress={() => handleSettingPress(item.key)}
                style={({ pressed }) => [
                  styles.row,
                  isInteractiveRow && pressed && styles.rowPressed,
                ]}>
                <Text style={styles.rowText}>{t(item.labelKey)}</Text>
                {isThemeRow && (
                  <Text style={styles.rowValue}>{t(themePreferenceLabelKeys[preference])}</Text>
                )}
                {isLanguageRow && (
                  <Text style={styles.rowValue}>{t(languageLabelKeys[language])}</Text>
                )}
                <Text style={styles.chevron}>{'\u203a'}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <SelectionModal
        onClose={() => setThemeModalVisible(false)}
        selectedValue={preference}
        styles={styles}
        subtitle={t('modal.themeSubtitle')}
        title={t('modal.themeTitle')}
        visible={themeModalVisible}
        options={themeOptions.map((option) => ({
          label: t(option.labelKey),
          value: option.value,
        }))}
        onSelect={(value) => selectTheme(value as ThemePreference)}
        selectedText={t('selection.selected')}
      />

      <SelectionModal
        onClose={() => setLanguageModalVisible(false)}
        selectedValue={language}
        styles={styles}
        subtitle={t('modal.languageSubtitle')}
        title={t('modal.languageTitle')}
        visible={languageModalVisible}
        options={languageOptions.map((option) => ({
          label: t(option.labelKey),
          value: option.value,
        }))}
        onSelect={(value) => selectLanguage(value as Language)}
        selectedText={t('selection.selected')}
      />
    </SafeAreaView>
  );
}

type SelectionOption = {
  label: string;
  value: string;
};

type SelectionModalProps = {
  onClose: () => void;
  onSelect: (value: string) => void;
  options: SelectionOption[];
  selectedText: string;
  selectedValue: string;
  styles: MineStyles;
  subtitle: string;
  title: string;
  visible: boolean;
};

type MineStyles = ReturnType<typeof createStyles>;

function SelectionModal({
  onClose,
  onSelect,
  options,
  selectedText,
  selectedValue,
  styles,
  subtitle,
  title,
  visible,
}: SelectionModalProps) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalPanel}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>

          <View style={styles.optionList}>
            {options.map((option) => {
              const selected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onSelect(option.value)}
                  style={({ pressed }) => [
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                    pressed && styles.optionRowPressed,
                  ]}>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                  {selected && <Text style={styles.selectedText}>{selectedText}</Text>}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.appBackground,
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
      gap: 10,
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 56,
      paddingHorizontal: 16,
    },
    rowPressed: {
      backgroundColor: colors.surfaceRaised,
    },
    rowText: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
    },
    rowValue: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
      marginRight: 10,
    },
    chevron: {
      color: colors.textMuted,
      fontSize: 24,
      lineHeight: 24,
    },
    modalOverlay: {
      alignItems: 'center',
      backgroundColor: colors.overlay,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    modalPanel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      padding: 18,
      width: '100%',
    },
    modalTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
      lineHeight: 26,
    },
    modalSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 6,
    },
    optionList: {
      gap: 10,
      marginTop: 16,
    },
    optionRow: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 50,
      paddingHorizontal: 14,
    },
    optionRowPressed: {
      backgroundColor: colors.surfaceRaised,
    },
    optionRowSelected: {
      borderColor: colors.accentStrong,
    },
    optionText: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
    },
    optionTextSelected: {
      color: colors.accentStrong,
    },
    selectedText: {
      color: colors.accentStrong,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
