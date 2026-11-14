import React from 'react';
import {
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  Alert,
  View,
  Text,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '@/context/SettingsContext';
import { useUsers } from '@/context/UsersContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, toggleDarkMode, toggleScreenRotation, resetSettings } = useSettings();
  const { resetUsers } = useUsers();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleResetSettings = () => {
    Alert.alert(
      'Réinitialiser les paramètres',
      'Voulez-vous rétablir tous les réglages par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetSettings();
              Alert.alert('Succès', 'Les paramètres ont été réinitialisés.');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser les paramètres.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleResetUsers = () => {
    Alert.alert(
      'Réinitialiser les utilisateurs',
      'Voulez-vous restaurer les utilisateurs de démonstration par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Restaurer',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetUsers();
              Alert.alert('Succès', 'La liste des utilisateurs a été réinitialisée.');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser la liste.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Paramètres</Text>
          <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
            Préférences de l'application
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}>
        {/* Section: Apparence */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            APPARENCE & AFFICHAGE
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.05,
              },
            ]}>
            {/* Dark Mode */}
            <View style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Ionicons
                  name={settings.isDarkMode ? 'moon' : 'sunny'}
                  size={20}
                  color={settings.isDarkMode ? colors.primary : '#FF9500'}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Mode Sombre</Text>
                <Text style={[styles.rowDescription, { color: colors.secondaryText }]}>
                  {settings.isDarkMode ? 'Thème sombre actif' : 'Thème clair actif'}
                </Text>
              </View>
              <Switch
                value={settings.isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                accessibilityRole="switch"
                accessibilityLabel="Basculer le mode sombre"
                accessibilityHint="Active ou désactive le thème sombre sur toute l'application"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Screen Rotation */}
            <View style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Rotation de l'écran</Text>
                <Text style={[styles.rowDescription, { color: colors.secondaryText }]}>
                  {settings.allowScreenRotation
                    ? 'Autoriser le mode paysage'
                    : 'Verrouillé en mode portrait'}
                </Text>
              </View>
              <Switch
                value={settings.allowScreenRotation}
                onValueChange={toggleScreenRotation}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                accessibilityRole="switch"
                accessibilityLabel="Basculer la rotation d'écran"
                accessibilityHint="Autorise ou verrouille la bascule automatique en mode paysage"
              />
            </View>
          </View>
        </View>

        {/* Section: Gestion des données */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            GESTION DES DONNÉES
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.05,
              },
            ]}>
            {/* Reset Users */}
            <Pressable
              onPress={handleResetUsers}
              style={({ pressed }) => [
                styles.actionRow,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Restaurer les utilisateurs de démonstration"
              accessibilityHint="Réinitialise la liste locale avec les utilisateurs de démonstration">
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  Restaurer utilisateurs démo
                </Text>
                <Text style={[styles.rowDescription, { color: colors.secondaryText }]}>
                  Recharger la liste initiale par défaut
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.tertiaryText} />
            </Pressable>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Reset Settings */}
            <Pressable
              onPress={handleResetSettings}
              style={({ pressed }) => [
                styles.actionRow,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Réinitialiser les préférences"
              accessibilityHint="Rétablit les paramètres par défaut de l'application">
              <View style={[styles.iconContainer, { backgroundColor: colors.destructiveLight }]}>
                <Ionicons name="refresh-outline" size={20} color={colors.destructive} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.destructive }]}>
                  Réinitialiser les préférences
                </Text>
                <Text style={[styles.rowDescription, { color: colors.secondaryText }]}>
                  Rétablir tous les réglages par défaut
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.tertiaryText} />
            </Pressable>
          </View>
        </View>

        {/* Section: Informations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            À PROPOS
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.05,
              },
            ]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Application</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>User List</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Version</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>1.2.0 (Pro UI/UX)</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Stack</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                Expo 52 • React Native 0.76 • TypeScript
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Stockage</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>AsyncStorage local</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    minHeight: 52,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    minHeight: 52,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
