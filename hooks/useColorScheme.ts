import { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [userColorScheme, setUserColorScheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // Load saved color scheme preference
    const loadColorScheme = async () => {
      try {
        const savedScheme = await AsyncStorage.getItem('userColorScheme');
        if (savedScheme) {
          setUserColorScheme(savedScheme as 'light' | 'dark');
        }
      } catch (error) {
        console.error('Error loading color scheme:', error);
      }
    };

    loadColorScheme();
  }, []);

  // Return user preference if set, otherwise return system preference
  return userColorScheme || systemColorScheme || 'light';
}
