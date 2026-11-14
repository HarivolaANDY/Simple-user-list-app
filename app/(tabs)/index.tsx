import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useUsers } from '@/context/UsersContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: string;
}

export default function AddUserScreen() {
  const router = useRouter();
  const { users, addUser } = useUsers();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit comporter au moins 2 caractères';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit comporter au moins 2 caractères';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailLower = email.trim().toLowerCase();
    if (!email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Veuillez saisir un email valide (ex: nom@domaine.com)';
    } else if (users.some((u) => u.email.toLowerCase() === emailLower)) {
      newErrors.email = 'Un utilisateur avec cette adresse email existe déjà';
    }

    const ageNum = parseInt(age.trim(), 10);
    if (!age.trim()) {
      newErrors.age = "L'âge est requis";
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = 'Veuillez entrer un âge valide (entre 1 et 120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validate()) {
      return;
    }

    try {
      await addUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        age: age.trim(),
      });

      setSuccessMessage(`${firstName.trim()} ${lastName.trim()} a été ajouté avec succès !`);
      setFirstName('');
      setLastName('');
      setEmail('');
      setAge('');
      setErrors({});

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer l'utilisateur");
      console.error(error);
    }
  };

  const showHelp = () => {
    Alert.alert(
      'Aide & À propos',
      'User List App v1.2\n\nAjoutez des utilisateurs avec leurs coordonnées. Les données sont conservées automatiquement sur votre appareil.',
      [{ text: 'Compris' }]
    );
  };

  const getInputBorderStyle = (fieldName: string, hasError: boolean) => {
    if (hasError) return colors.destructive;
    if (focusedField === fieldName) return colors.borderFocus;
    return colors.border;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Ajouter un Utilisateur</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
              Remplissez les informations ci-dessous
            </Text>
          </View>
          <Pressable
            onPress={showHelp}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: colors.background, opacity: pressed ? 0.7 : 1 },
            ]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Aide et informations">
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Success Banner */}
          {successMessage && (
            <View
              style={[
                styles.successBanner,
                { backgroundColor: colors.successLight, borderColor: colors.success },
              ]}>
              <View style={styles.successBannerHeader}>
                <View style={styles.successBannerContent}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                  <Text style={[styles.successText, { color: colors.success }]}>
                    {successMessage}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSuccessMessage(null)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Fermer la notification">
                  <Ionicons name="close" size={20} color={colors.success} />
                </Pressable>
              </View>
              <Pressable
                onPress={() => router.push('/users')}
                style={styles.viewListButton}
                accessibilityRole="button"
                accessibilityLabel="Voir la liste des utilisateurs">
                <Text style={[styles.viewListText, { color: colors.primary }]}>
                  Voir la liste des utilisateurs →
                </Text>
              </Pressable>
            </View>
          )}

          {/* Form Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: colorScheme === 'dark' ? 0.25 : 0.05,
              },
            ]}>
            {/* First Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Prénom</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: getInputBorderStyle('firstName', !!errors.firstName),
                  },
                ]}>
                <Ionicons name="person-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={firstName}
                  onChangeText={(val) => {
                    setFirstName(val);
                    if (errors.firstName) setErrors((e) => ({ ...e, firstName: undefined }));
                  }}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ex: Jean"
                  placeholderTextColor={colors.tertiaryText}
                  autoCorrect={false}
                  accessibilityLabel="Champ Prénom"
                  accessibilityHint="Entrez le prénom de l'utilisateur"
                />
              </View>
              {errors.firstName && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>
                    {errors.firstName}
                  </Text>
                </View>
              )}
            </View>

            {/* Last Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nom</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: getInputBorderStyle('lastName', !!errors.lastName),
                  },
                ]}>
                <Ionicons name="person-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={lastName}
                  onChangeText={(val) => {
                    setLastName(val);
                    if (errors.lastName) setErrors((e) => ({ ...e, lastName: undefined }));
                  }}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ex: Dupont"
                  autoCorrect={false}
                  accessibilityLabel="Champ Nom de famille"
                  accessibilityHint="Entrez le nom de l'utilisateur"
                />
              </View>
              {errors.lastName && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>
                    {errors.lastName}
                  </Text>
                </View>
              )}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Adresse email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: getInputBorderStyle('email', !!errors.email),
                  },
                ]}>
                <Ionicons name="mail-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ex: jean.dupont@example.com"
                  placeholderTextColor={colors.tertiaryText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Champ Adresse email"
                  accessibilityHint="Entrez une adresse email valide"
                />
              </View>
              {errors.email && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>
                    {errors.email}
                  </Text>
                </View>
              )}
            </View>

            {/* Age */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Âge</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: getInputBorderStyle('age', !!errors.age),
                  },
                ]}>
                <Ionicons name="calendar-outline" size={20} color={colors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={age}
                  onChangeText={(val) => {
                    setAge(val);
                    if (errors.age) setErrors((e) => ({ ...e, age: undefined }));
                  }}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ex: 29"
                  placeholderTextColor={colors.tertiaryText}
                  keyboardType="numeric"
                  maxLength={3}
                  accessibilityLabel="Champ Âge"
                  accessibilityHint="Entrez l'âge en chiffres entre 1 et 120"
                />
              </View>
              {errors.age && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>
                    {errors.age}
                  </Text>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleAddUser}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Enregistrer l'utilisateur">
              <Ionicons name="person-add" size={20} color="#FFFFFF" style={styles.submitIcon} />
              <Text style={styles.submitButtonText}>Enregistrer l'utilisateur</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  successBanner: {
    flexDirection: 'column',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 16,
    gap: 10,
  },
  successBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  viewListButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 32,
  },
  viewListText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
