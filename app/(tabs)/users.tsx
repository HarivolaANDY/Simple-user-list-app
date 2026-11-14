import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUsers } from '@/context/UsersContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
}

export default function UsersScreen() {
  const { users, deleteUser } = useUsers();

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteUser(userId)
        }
      ]
    );
  };

  const handleEditUser = (user: User) => {
    // This would typically navigate to an edit screen
    Alert.alert("Edit User", "Edit functionality coming soon!");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>User List</ThemedText>
      </ThemedView>

      <ThemedView style={styles.userListContainer}>
        {users.length === 0 ? (
          <ThemedText style={styles.emptyText}>No users added yet</ThemedText>
        ) : (
          users.map((user) => (
            <ThemedView key={user.id} style={styles.userItem}>
              <ThemedView style={styles.userInfo}>
                <ThemedText style={styles.userName}>{user.firstName} {user.lastName}</ThemedText>
                <ThemedText>{user.email}</ThemedText>
                <ThemedText>Age: {user.age}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditUser(user)}
                >
                  <Ionicons name="pencil" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteUser(user.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))
        )}
      </ThemedView>
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
  userListContainer: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
}); 