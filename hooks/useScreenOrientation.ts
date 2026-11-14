import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSettings } from '@/context/SettingsContext';

export function useScreenOrientation() {
  const { settings } = useSettings();

  useEffect(() => {
    const updateOrientation = async () => {
      try {
        if (settings.allowScreenRotation) {
          // Allow all orientations
          await ScreenOrientation.unlockAsync();
        } else {
          // Lock to portrait
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
        }
      } catch (error) {
        console.error('Error updating screen orientation:', error);
      }
    };

    updateOrientation();
  }, [settings.allowScreenRotation]);
} 