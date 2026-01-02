import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../services/api';

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {
      const user = await authAPI.login(email, password);
      await SecureStore.setItemAsync('userId', user.id);
      await SecureStore.setItemAsync('userEmail', user.email);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string, password: string, name?: string) => {
    try {
      const user = await authAPI.register(email, password, name);
      await SecureStore.setItemAsync('userId', user.id);
      await SecureStore.setItemAsync('userEmail', user.email);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('userEmail');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  
  loadUser: async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      const userEmail = await SecureStore.getItemAsync('userEmail');
      
      if (userId && userEmail) {
        // Optionally fetch full user profile
        set({ 
          user: { id: userId, email: userEmail },
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

