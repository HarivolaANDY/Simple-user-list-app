import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Pressable,
  Modal,
  Switch,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createThemeStyles } from '../styles/theme';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
}

const HomeScreen: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('Home');
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  const styles = createThemeStyles(darkMode);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });
    ScreenOrientation.unlockAsync();
    return () => subscription.remove();
  }, []);

  const isLandscape = dimensions.window.width > dimensions.window.height;
  const screenWidth = dimensions.window.width;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(parseInt(age, 10)) || parseInt(age, 10) < 0 || parseInt(age, 10) > 150) {
      newErrors.age = 'Please enter a valid age';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addUser = () => {
    if (!validateForm()) {
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      name: name.trim(),
      email: email.trim(),
      age: parseInt(age, 10),
    };
    setUsers([...users, newUser]);
    setName('');
    setEmail('');
    setAge('');
    setErrors({});
  };

  const deleteUser = (userId: number) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter((user) => user.id !== userId));
          },
        },
      ]
    );
  };

  const renderUserList = () => {
    if (users.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons 
            name="people" 
            size={64} 
            color={darkMode ? '#666' : '#999'} 
          />
          <Text style={styles.userDetail}>
            No users added yet
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        {users.map((user) => (
          <View
            key={user.id}
            style={styles.userItem}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.name}
              </Text>
              <Text style={styles.userDetail}>
                {user.email}
              </Text>
              <Text style={styles.userDetail}>
                Age: {user.age}
              </Text>
            </View>
            <Pressable 
              onPress={() => deleteUser(user.id)}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed
              ]}
            >
              <MaterialIcons 
                name="delete" 
                size={24} 
                color={darkMode ? '#ff6b6b' : '#ff0000'} 
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderHomeContent = () => (
    <View style={[styles.formContainer, isLandscape && styles.landscapeFormContainer]}>
      <TextInput
        style={[
          styles.input,
          isLandscape && { width: screenWidth * 0.3 },
          errors.name && styles.inputError,
        ]}
        placeholder="Name"
        placeholderTextColor={darkMode ? '#ccc' : '#666'}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) {
            setErrors({ ...errors, name: undefined });
          }
        }}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      
      <TextInput
        style={[
          styles.input,
          isLandscape && { width: screenWidth * 0.3 },
          errors.email && styles.inputError,
        ]}
        placeholder="Email"
        placeholderTextColor={darkMode ? '#ccc' : '#666'}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) {
            setErrors({ ...errors, email: undefined });
          }
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      
      <TextInput
        style={[
          styles.input,
          isLandscape && { width: screenWidth * 0.3 },
          errors.age && styles.inputError,
        ]}
        placeholder="Age"
        placeholderTextColor={darkMode ? '#ccc' : '#666'}
        value={age}
        onChangeText={(text) => {
          setAge(text);
          if (errors.age) {
            setErrors({ ...errors, age: undefined });
          }
        }}
        keyboardType="numeric"
        maxLength={3}
      />
      {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
      
      <Button title="Add User" onPress={addUser} />
    </View>
  );

  const renderContent = () => {
    switch (selectedOption) {
      case 'User List':
        return renderUserList();
      case 'Parameters':
        return (
          <View style={styles.content}>
            <View style={styles.parameterItem}>
              <Text style={styles.userName}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>
          </View>
        );
      case 'About':
        return (
          <View style={styles.content}>
            <Text style={styles.userDetail}>
              App Version: 1.0.0
            </Text>
            <Text style={styles.userDetail}>
              Copyright © 2023 MyApp
            </Text>
          </View>
        );
      case 'Home':
      default:
        return renderHomeContent();
    }
  };

  const renderMenu = () => (
    <Modal
      transparent={true}
      visible={isMenuVisible}
      onRequestClose={() => setIsMenuVisible(false)}
      animationType="fade"
    >
      <Pressable 
        style={styles.menuOverlay} 
        onPress={() => setIsMenuVisible(false)}
        accessibilityLabel="Close menu"
      >
        <View 
          style={[
            styles.menuContent,
            { transform: [{ translateX: isMenuVisible ? 0 : -300 }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.titleText}>
              Menu
            </Text>
            <Pressable 
              onPress={() => setIsMenuVisible(false)}
              style={styles.closeButton}
              accessibilityLabel="Close menu"
            >
              <MaterialIcons 
                name="close" 
                size={24} 
                color={darkMode ? '#fff' : '#000'} 
              />
            </Pressable>
          </View>
          {['Home', 'User List', 'Parameters', 'About'].map((option) => (
            <Pressable
              key={option}
              style={[
                styles.menuItem,
                selectedOption === option && styles.selectedMenuItem
              ]}
              onPress={() => {
                setSelectedOption(option);
                setIsMenuVisible(false);
              }}
              accessibilityLabel={`Navigate to ${option}`}
              accessibilityRole="button"
            >
              <MaterialIcons
                name={
                  option === 'Home' ? 'home' :
                  option === 'User List' ? 'people' :
                  option === 'Parameters' ? 'settings' :
                  'info'
                }
                size={24}
                color={selectedOption === option ? '#007AFF' : (darkMode ? '#fff' : '#000')}
                style={styles.menuItemIcon}
              />
              <Text style={[
                styles.menuItemText,
                selectedOption === option && styles.selectedMenuItemText
              ]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.menuIcon} 
        onPress={() => setIsMenuVisible(true)}
        accessibilityLabel="Open menu"
        accessibilityRole="button"
      >
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </Pressable>

      <View style={styles.titleBar}>
        <Text style={styles.titleText}>
          {selectedOption}
        </Text>
      </View>

      {renderMenu()}

      <ScrollView contentContainerStyle={styles.mainContentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default HomeScreen; 