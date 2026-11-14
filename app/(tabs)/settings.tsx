import { StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSettings } from '@/context/SettingsContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

export default function SettingsScreen() {
  const { settings, toggleDarkMode, setLanguage, toggleScreenRotation, resetSettings } = useSettings();

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetSettings();
              Alert.alert("Success", "Settings have been reset to default values.");
            } catch (error) {
              Alert.alert("Error", "Failed to reset settings. Please try again.");
              console.error('Error resetting settings:', error);
            }
          }
        }
      ]
    );
  };

  const handleLanguageChange = async (language: string) => {
    try {
      await setLanguage(language);
    } catch (error) {
      Alert.alert("Error", "Failed to change language. Please try again.");
      console.error('Error changing language:', error);
    }
  };

  const handleDarkModeToggle = async () => {
    try {
      await toggleDarkMode();
    } catch (error) {
      Alert.alert("Error", "Failed to toggle dark mode. Please try again.");
      console.error('Error toggling dark mode:', error);
    }
  };

  const handleScreenRotationToggle = async () => {
    try {
      await toggleScreenRotation();
    } catch (error) {
      Alert.alert("Error", "Failed to toggle screen rotation. Please try again.");
      console.error('Error toggling screen rotation:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <ThemedText>Dark Mode</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Use dark theme for the app
              </ThemedText>
            </ThemedView>
            <Switch
              value={settings.isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.isDarkMode ? '#007AFF' : '#f4f3f4'}
            />
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingInfo}>
              <ThemedText>Screen Rotation</ThemedText>
              <ThemedText style={styles.settingDescription}>
                Allow the app to rotate when device orientation changes
              </ThemedText>
            </ThemedView>
            <Switch
              value={settings.allowScreenRotation}
              onValueChange={handleScreenRotationToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.allowScreenRotation ? '#007AFF' : '#f4f3f4'}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Language</ThemedText>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                settings.language === lang.code && styles.languageItemActive,
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <ThemedText
                style={[
                  styles.languageText,
                  settings.language === lang.code && styles.languageTextActive,
                ]}>
                {lang.name}
              </ThemedText>
              {settings.language === lang.code && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Reset</ThemedText>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetSettings}
          >
            <Ionicons name="refresh" size={20} color="#FF3B30" />
            <ThemedText style={styles.resetButtonText}>Reset All Settings</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  languageItemActive: {
    backgroundColor: '#E5F1FF',
    borderColor: '#007AFF',
  },
  languageText: {
    fontSize: 16,
  },
  languageTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
}); 