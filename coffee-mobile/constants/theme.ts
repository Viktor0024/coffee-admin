/**
 * Design system: colors, spacing, typography, radii, shadows.
 * Used across the app for consistent UI.
 */

import { Platform } from 'react-native';

/** Акцент: активна вкладка, посилання (бірюзовий/зелений) */
const accentTeal = '#00BCD4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1a1a1a',
    textSecondary: '#6a6a6a',
    background: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    surface: '#ffffff',
    tint: accentTeal,
    icon: '#687076',
    tabIconDefault: '#888888',
    tabIconSelected: accentTeal,
    /** Панель кошика внизу */
    primary: '#1c1c1c',
    primaryForeground: '#ffffff',
    border: '#e5e5e5',
    cardShadow: '#000000',
    /** Статуси замовлень */
    statusPreparing: '#f59e0b',
    statusCompleted: '#10b981',
    /** Ціна та кнопка «додати в кошик» — теплий тон під стиль застосунку */
    priceAccent: '#92400e',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#a1a1aa',
    background: '#151718',
    backgroundSecondary: '#1f1f23',
    surface: '#1c1c1f',
    tint: accentTeal,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: accentTeal,
    primary: '#1c1c1c',
    primaryForeground: '#ffffff',
    border: '#2d2d30',
    cardShadow: '#000000',
    statusPreparing: '#f59e0b',
    statusCompleted: '#10b981',
    priceAccent: '#b45309',
  },
};

/** Spacing scale (px). Use for padding, margin, gaps. */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Border radius (px). */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

/** Typography: font sizes. */
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,
} as const;

/** Card shadow (iOS/Android). */
export const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    default: { elevation: 4 },
  }),
  cardSubtle: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    default: { elevation: 2 },
  }),
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
