export type ThemeName = 'dark' | 'light';

export type ThemeColors = {
  accent: string;
  accentStrong: string;
  accentText: string;
  appBackground: string;
  border: string;
  borderSoft: string;
  favoriteBackground: string;
  favoriteBorder: string;
  favoriteText: string;
  overlay: string;
  surface: string;
  surfaceMuted: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  textSecondary: string;
};

export const darkColors: ThemeColors = {
  appBackground: '#0B0F0F',
  surface: '#141A1B',
  surfaceRaised: '#192021',
  surfaceMuted: '#202829',
  border: '#273233',
  borderSoft: '#202829',
  text: '#F1F5F4',
  textSecondary: '#9AA6A7',
  textMuted: '#6F7B7C',
  accent: '#8BC7C0',
  accentStrong: '#B8E3DD',
  accentText: '#081111',
  favoriteBackground: '#4A3B19',
  favoriteBorder: '#8D7130',
  favoriteText: '#F5D87B',
  overlay: 'rgba(0, 0, 0, 0.54)',
};

export const lightColors: ThemeColors = {
  appBackground: '#F4F7F6',
  surface: '#FFFFFF',
  surfaceRaised: '#EEF3F2',
  surfaceMuted: '#E6ECEB',
  border: '#D7E0DE',
  borderSoft: '#E7EEEC',
  text: '#162326',
  textSecondary: '#657274',
  textMuted: '#8A9698',
  accent: '#315F63',
  accentStrong: '#254F55',
  accentText: '#FFFFFF',
  favoriteBackground: '#FFF4CE',
  favoriteBorder: '#E1BA4C',
  favoriteText: '#8B6515',
  overlay: 'rgba(10, 18, 20, 0.38)',
};

export const themeColors: Record<ThemeName, ThemeColors> = {
  dark: darkColors,
  light: lightColors,
};

export const colors = darkColors;
