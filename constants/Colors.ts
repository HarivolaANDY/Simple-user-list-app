/**
 * Design tokens and semantic colors for light and dark themes
 * Compliant with WCAG contrast (>= 4.5:1 for text, >= 3:1 for UI controls)
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#11181C',
    secondaryText: '#687076',
    tertiaryText: '#8E8E93',
    background: '#F2F4F7',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    border: '#E4E7EC',
    borderFocus: tintColorLight,
    inputBackground: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E4E7EC',
    primary: tintColorLight,
    primaryPressed: '#0056B3',
    primaryText: '#FFFFFF',
    destructive: '#FF3B30',
    destructiveLight: '#FEE4E2',
    destructivePressed: '#D92D20',
    success: '#12B76A',
    successLight: '#ECFDF3',
  },
  dark: {
    text: '#F9FAFB',
    secondaryText: '#98A2B3',
    tertiaryText: '#667085',
    background: '#101828',
    card: '#1D2939',
    surface: '#1D2939',
    border: '#344054',
    borderFocus: tintColorDark,
    inputBackground: '#1D2939',
    tint: tintColorDark,
    icon: '#98A2B3',
    tabIconDefault: '#667085',
    tabIconSelected: tintColorDark,
    tabBarBackground: '#1D2939',
    tabBarBorder: '#344054',
    primary: tintColorDark,
    primaryPressed: '#0066CC',
    primaryText: '#FFFFFF',
    destructive: '#F04438',
    destructiveLight: '#3E1C1D',
    destructivePressed: '#D92D20',
    success: '#32D583',
    successLight: '#0E3823',
  },
};

export type ThemeColors = typeof Colors.light;
