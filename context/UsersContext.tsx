import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
}

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, user: Omit<User, 'id'>) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const updateUser = (id: string, updatedUser: Omit<User, 'id'>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...updatedUser, id } : user
    ));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, deleteUser, updateUser }}>
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