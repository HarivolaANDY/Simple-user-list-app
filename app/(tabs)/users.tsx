import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useUsers, User } from '@/context/UsersContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// High-contrast WCAG AA compliant palette for white text (all >= 4.5:1)
const AVATAR_PALETTE = [
  '#0062D2', // Blue (6.2:1)
  '#15803D', // Forest Green (5.1:1)
  '#5E40BE', // Indigo/Purple (7.0:1)
  '#C2410C', // Rust Amber (4.8:1)
  '#86289A', // Violet (6.8:1)
  '#0E7490', // Deep Teal (5.0:1)
  '#BE185D', // Rose (5.8:1)
];

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
};

const getInitials = (first: string, last: string): string => {
  const f = first.trim().charAt(0);
  const l = last.trim().charAt(0);
  return `${f}${l}`.toUpperCase();
};

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  colors: typeof Colors.light;
  isDark: boolean;
}

const UserCard = React.memo(({ user, onEdit, onDelete, colors, isDark }: UserCardProps) => {
  const avatarBg = useMemo(
    () => getAvatarColor(`${user.firstName} ${user.lastName}`),
    [user.firstName, user.lastName]
  );
  const initials = useMemo(
    () => getInitials(user.firstName, user.lastName),
    [user.firstName, user.lastName]
  );

  return (
    <View
      style={[
        styles.userCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.35 : 0.05,
        },
      ]}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
            {user.firstName} {user.lastName}
          </Text>
          <View style={[styles.ageBadge, { backgroundColor: colors.background }]}>
            <Text style={[styles.ageBadgeText, { color: colors.secondaryText }]}>
              {user.age} ans
            </Text>
          </View>
        </View>
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={14} color={colors.secondaryText} />
          <Text style={[styles.userEmail, { color: colors.secondaryText }]} numberOfLines={1}>
            {user.email}
          </Text>
        </View>
      </View>

      {/* Actions (Touch targets min 44x44pt) */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => onEdit(user)}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.background, opacity: pressed ? 0.6 : 1 },
          ]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Modifier ${user.firstName} ${user.lastName}`}
          accessibilityHint="Ouvre la boîte de dialogue d'édition pour cet utilisateur">
          <Ionicons name="pencil" size={19} color={colors.primary} />
        </Pressable>

        <Pressable
          onPress={() => onDelete(user)}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.destructiveLight, opacity: pressed ? 0.6 : 1 },
          ]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Supprimer ${user.firstName} ${user.lastName}`}
          accessibilityHint="Demande une confirmation pour supprimer cet utilisateur">
          <Ionicons name="trash-outline" size={19} color={colors.destructive} />
        </Pressable>
      </View>
    </View>
  );
});

export default function UsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { users, deleteUser, updateUser } = useUsers();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'recent' | 'name' | 'age'>('recent');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let list = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.age.includes(q)
      );
    }

    if (sortMode === 'name') {
      return [...list].sort((a, b) => a.lastName.localeCompare(b.lastName));
    }
    if (sortMode === 'age') {
      return [...list].sort((a, b) => parseInt(a.age, 10) - parseInt(b.age, 10));
    }
    return list;
  }, [users, searchQuery, sortMode]);

  const handleDeleteUser = useCallback(
    (user: User) => {
      Alert.alert(
        'Supprimer un utilisateur',
        `Voulez-vous vraiment supprimer ${user.firstName} ${user.lastName} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => deleteUser(user.id),
          },
        ]
      );
    },
    [deleteUser]
  );

  const handleOpenEdit = useCallback((user: User) => {
    setEditingUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditEmail(user.email);
    setEditAge(user.age);
    setEditError(null);
  }, []);

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    if (!editFirstName.trim() || !editLastName.trim() || !editEmail.trim() || !editAge.trim()) {
      setEditError('Tous les champs sont requis');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailLower = editEmail.trim().toLowerCase();
    if (!emailRegex.test(editEmail.trim())) {
      setEditError('Veuillez entrer un email valide');
      return;
    }

    if (
      users.some(
        (u) => u.id !== editingUser.id && u.email.toLowerCase() === emailLower
      )
    ) {
      setEditError('Cet email est déjà utilisé par un autre utilisateur');
      return;
    }

    const ageNum = parseInt(editAge.trim(), 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setEditError('Veuillez entrer un âge valide (1-120)');
      return;
    }

    await updateUser(editingUser.id, {
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      email: editEmail.trim().toLowerCase(),
      age: editAge.trim(),
    });

    setEditingUser(null);
  };

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <UserCard
        user={item}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteUser}
        colors={colors}
        isDark={isDark}
      />
    ),
    [handleOpenEdit, handleDeleteUser, colors, isDark]
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons
          name={searchQuery ? 'search-outline' : 'people-outline'}
          size={44}
          color={colors.tertiaryText}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? 'Aucun résultat trouvé' : 'Aucun utilisateur'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
        {searchQuery
          ? `Aucun utilisateur ne correspond à votre recherche "${searchQuery}".`
          : 'Votre répertoire est vide. Ajoutez un utilisateur pour commencer.'}
      </Text>
      {!searchQuery && (
        <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [
            styles.emptyButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Ajouter un utilisateur">
          <Ionicons name="person-add" size={18} color="#FFFFFF" />
          <Text style={styles.emptyButtonText}>Ajouter un utilisateur</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Utilisateurs</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.countBadgeText}>{users.length}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [
            styles.addQuickButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Créer un nouvel utilisateur">
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addQuickButtonText}>Nouveau</Text>
        </Pressable>
      </View>

      {/* Search Bar & Sort Filter */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher par nom, email..."
            placeholderTextColor={colors.tertiaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Rechercher un utilisateur"
            accessibilityHint="Filtre la liste en temps réel"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={10}
              style={styles.clearSearchButton}
              accessibilityRole="button"
              accessibilityLabel="Effacer la recherche">
              <Ionicons name="close-circle" size={18} color={colors.secondaryText} />
            </Pressable>
          )}
        </View>

        {/* Sort Pills */}
        <View style={styles.sortRow}>
          <Pressable
            onPress={() => setSortMode('recent')}
            style={[
              styles.sortPill,
              { backgroundColor: sortMode === 'recent' ? colors.primary : colors.background },
            ]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Trier par plus récents">
            <Text
              style={[
                styles.sortPillText,
                { color: sortMode === 'recent' ? '#FFFFFF' : colors.secondaryText },
              ]}>
              Récents
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSortMode('name')}
            style={[
              styles.sortPill,
              { backgroundColor: sortMode === 'name' ? colors.primary : colors.background },
            ]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Trier par nom alphabétique">
            <Text
              style={[
                styles.sortPillText,
                { color: sortMode === 'name' ? '#FFFFFF' : colors.secondaryText },
              ]}>
              Nom (A-Z)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSortMode('age')}
            style={[
              styles.sortPill,
              { backgroundColor: sortMode === 'age' ? colors.primary : colors.background },
            ]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Trier par âge croissant">
            <Text
              style={[
                styles.sortPillText,
                { color: sortMode === 'age' ? '#FFFFFF' : colors.secondaryText },
              ]}>
              Âge
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Virtualized User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        ListEmptyComponent={renderEmptyComponent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />

      {/* Edit User Modal */}
      <Modal
        visible={editingUser !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingUser(null)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Modifier l'utilisateur</Text>
              <Pressable
                onPress={() => setEditingUser(null)}
                style={styles.modalCloseButton}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Fermer la boîte de dialogue d'édition">
                <Ionicons name="close" size={24} color={colors.secondaryText} />
              </Pressable>
            </View>

            {editError && (
              <View style={[styles.modalErrorBanner, { backgroundColor: colors.destructiveLight }]}>
                <Ionicons name="alert-circle" size={18} color={colors.destructive} />
                <Text style={[styles.modalErrorText, { color: colors.destructive }]}>
                  {editError}
                </Text>
              </View>
            )}

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>Prénom</Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editFirstName}
                  onChangeText={setEditFirstName}
                  autoCorrect={false}
                  accessibilityLabel="Prénom de l'utilisateur"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>Nom</Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editLastName}
                  onChangeText={setEditLastName}
                  autoCorrect={false}
                  accessibilityLabel="Nom de famille de l'utilisateur"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>Email</Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Adresse email de l'utilisateur"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>Âge</Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editAge}
                  onChangeText={setEditAge}
                  keyboardType="numeric"
                  maxLength={3}
                  accessibilityLabel="Âge de l'utilisateur"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setEditingUser(null)}
                style={[styles.modalButton, { borderColor: colors.border, borderWidth: 1 }]}
                accessibilityRole="button"
                accessibilityLabel="Annuler les modifications">
                <Text style={[styles.modalCancelText, { color: colors.secondaryText }]}>Annuler</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveEdit}
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                accessibilityRole="button"
                accessibilityLabel="Enregistrer les modifications">
                <Text style={styles.modalSaveText}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  countBadge: {
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addQuickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 11,
    justifyContent: 'center',
  },
  addQuickButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sortPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  clearSearchButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  ageBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  userEmail: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 270,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    minHeight: 46,
    borderRadius: 12,
    marginTop: 8,
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
  },
  modalErrorText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalForm: {
    maxHeight: 320,
  },
  modalField: {
    gap: 6,
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
