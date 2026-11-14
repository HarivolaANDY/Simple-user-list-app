import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/Colors';

export interface Settings {
  isDarkMode: boolean;
  language: string;
  allowScreenRotation: boolean;
}

export interface SettingsContextType {
  settings: Settings;
  colorScheme: 'light' | 'dark';
  colors: ThemeColors;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  toggleScreenRotation: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  isDarkMode: false,
  language: 'fr',
  allowScreenRotation: true,
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useNativeColorScheme();
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    isDarkMode: systemColorScheme === 'dark',
  });

  // Load settings from storage on app start
  useEffect(() => {
    loadSettings();
  }, []);

  // Update dark mode when system theme changes if no user preference is set
  useEffect(() => {
    const updateTheme = async () => {
      try {
        const userTheme = await AsyncStorage.getItem('userColorScheme');
        if (!userTheme) {
          setSettings((prev) => ({
            ...prev,
            isDarkMode: systemColorScheme === 'dark',
          }));
        }
      } catch (error) {
        console.error('Error checking user theme:', error);
      }
    };

    updateTheme();
  }, [systemColorScheme]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      await AsyncStorage.setItem('userColorScheme', newSettings.isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  };

  const toggleDarkMode = async () => {
    const updated = { ...settings, isDarkMode: !settings.isDarkMode };
    setSettings(updated);
    await saveSettings(updated);
  };

  const setLanguage = async (language: string) => {
    const updated = { ...settings, language };
    setSettings(updated);
    await saveSettings(updated);
  };

  const toggleScreenRotation = async () => {
    const updated = { ...settings, allowScreenRotation: !settings.allowScreenRotation };
    setSettings(updated);
    await saveSettings(updated);
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem('appSettings');
      await AsyncStorage.removeItem('userColorScheme');
      const reset = {
        ...defaultSettings,
        isDarkMode: systemColorScheme === 'dark',
      };
      setSettings(reset);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  const colorScheme = settings.isDarkMode ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  return (
    <SettingsContext.Provider
      value={{
        settings,
        colorScheme,
        colors,
        updateSettings,
        toggleDarkMode,
        setLanguage,
        toggleScreenRotation,
        resetSettings,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
