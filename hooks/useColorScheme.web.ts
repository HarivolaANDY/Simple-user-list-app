import { useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { SettingsContext } from '@/context/SettingsContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const settingsContext = useContext(SettingsContext);
  const colorScheme = useRNColorScheme() ?? 'light';

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (settingsContext?.settings) {
    return settingsContext.settings.isDarkMode ? 'dark' : 'light';
  }

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
