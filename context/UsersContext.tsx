import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  createdAt?: string;
}

interface UsersContextType {
  users: User[];
  isLoading: boolean;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, user: Omit<User, 'id'>) => Promise<void>;
  resetUsers: () => Promise<void>;
}

const USERS_STORAGE_KEY = '@user_list_users';

const INITIAL_USERS: User[] = [
  {
    id: '1',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@example.com',
    age: '28',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@example.com',
    age: '34',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    firstName: 'Camille',
    lastName: 'Leroy',
    email: 'camille.leroy@example.com',
    age: '25',
    createdAt: new Date().toISOString(),
  },
];

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        // Seed initial mock users for a delightful first experience
        setUsers(INITIAL_USERS);
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
    } catch (error) {
      console.error('Error loading users from storage:', error);
      setUsers(INITIAL_USERS);
    } finally {
      setIsLoading(false);
    }
  };

  const persistUsers = async (newUsers: User[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    await persistUsers(updated);
  };

  const deleteUser = async (id: string) => {
    const updated = users.filter((user) => user.id !== id);
    setUsers(updated);
    await persistUsers(updated);
  };

  const updateUser = async (id: string, updatedUser: Omit<User, 'id'>) => {
    const updated = users.map((user) =>
      user.id === id ? { ...updatedUser, id, createdAt: user.createdAt } : user
    );
    setUsers(updated);
    await persistUsers(updated);
  };

  const resetUsers = async () => {
    setUsers(INITIAL_USERS);
    await persistUsers(INITIAL_USERS);
  };

  return (
    <UsersContext.Provider value={{ users, isLoading, addUser, deleteUser, updateUser, resetUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
