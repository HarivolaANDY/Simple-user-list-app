import { useContext } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { SettingsContext } from '@/context/SettingsContext';

/**
 * Returns the active color scheme ('light' | 'dark').
 * Prefers the user's setting from SettingsContext if available,
 * otherwise falls back to the native system setting.
 */
export function useColorScheme(): 'light' | 'dark' {
  const settingsContext = useContext(SettingsContext);
  const systemScheme = useNativeColorScheme() ?? 'light';

  if (settingsContext?.settings) {
    return settingsContext.settings.isDarkMode ? 'dark' : 'light';
  }

  return systemScheme;
}
