import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUsers } from '@/context/UsersContext';

export default function HomeScreen() {
  const { addUser } = useUsers();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const handleAddUser = () => {
    if (!firstName || !lastName || !email || !age) {
      alert('Please fill in all fields');
      return;
    }

    addUser({
      firstName,
      lastName,
      email,
      age,
    });

    // Clear form
    setFirstName('');
    setLastName('');
    setEmail('');
    setAge('');
  };

  const handleMenuPress = () => {
    Alert.alert(
      "Options",
      "Choose an option",
      [
        {
          text: "About App",
          onPress: () => Alert.alert("About App", "User List App v1.0\nA simple app to manage users.")
        },
        {
          text: "Help",
          onPress: () => Alert.alert("Help", "Need help? Contact support at support@userlistapp.com")
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Add New User</ThemedText>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#007AFF" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.container}>
        <ThemedView style={styles.formContainer}>
          <ThemedView style={styles.inputContainer}>
            <ThemedText>First Name</ThemedText>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor="#666"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Last Name</ThemedText>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor="#666"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Email</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Age</ThemedText>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </ThemedView>

          <TouchableOpacity style={styles.button} onPress={handleAddUser}>
            <ThemedText style={styles.buttonText}>Add User</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
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
  menuButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
