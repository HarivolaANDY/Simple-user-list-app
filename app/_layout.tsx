import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from '@/context/SettingsContext';
import { UsersProvider } from '@/context/UsersContext';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    // Add your fonts here if needed
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <UsersProvider>
          <ScreenOrientationHandler />
          <Slot />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </UsersProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

function ScreenOrientationHandler() {
  useScreenOrientation();
  return null;
}
