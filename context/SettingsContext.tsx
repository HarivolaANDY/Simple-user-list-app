import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface Settings {
  isDarkMode: boolean;
  language: string;
  allowScreenRotation: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleDarkMode: () => void;
  setLanguage: (language: string) => void;
  toggleScreenRotation: () => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  isDarkMode: false,
  language: 'en',
  allowScreenRotation: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    isDarkMode: systemColorScheme === 'dark'
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
          setSettings(prev => ({
            ...prev,
            isDarkMode: systemColorScheme === 'dark'
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
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      // Also save the color scheme preference separately
      await AsyncStorage.setItem('userColorScheme', newSettings.isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  const toggleDarkMode = () => {
    setSettings(prev => {
      const updated = { ...prev, isDarkMode: !prev.isDarkMode };
      saveSettings(updated);
      return updated;
    });
  };

  const setLanguage = (language: string) => {
    setSettings(prev => {
      const updated = { ...prev, language };
      saveSettings(updated);
      return updated;
    });
  };

  const toggleScreenRotation = () => {
    setSettings(prev => {
      const updated = { ...prev, allowScreenRotation: !prev.allowScreenRotation };
      saveSettings(updated);
      return updated;
    });
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem('appSettings');
      await AsyncStorage.removeItem('userColorScheme');
      setSettings({
        ...defaultSettings,
        isDarkMode: systemColorScheme === 'dark'
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
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