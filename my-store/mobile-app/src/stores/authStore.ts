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
      await persistSession(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string, password: string, name?: string) => {
    try {
      const user = await authAPI.register(email, password, name);
      await persistSession(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    await clearSession();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  
  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('userId');
      const userEmail = await SecureStore.getItemAsync('userEmail');
      
      if (userId && userEmail) {
        set({ 
          user: { id: userId, email: userEmail },
          isAuthenticated: true,
          isLoading: false 
        });
        
        // Validate the session in the background and refresh user data.
        if (token) {
          try {
            const fresh = await authAPI.me();
            set({ user: fresh, isAuthenticated: true });
          } catch {
            // Token invalid/expired - clear local session
            await clearSession();
            set({ user: null, isAuthenticated: false });
          }
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

async function persistSession(user: User & { token?: string }) {
  if (user.token) {
    await SecureStore.setItemAsync('authToken', user.token);
  }
  await SecureStore.setItemAsync('userId', user.id);
  await SecureStore.setItemAsync('userEmail', user.email);
}

async function clearSession() {
  await SecureStore.deleteItemAsync('authToken');
  await SecureStore.deleteItemAsync('userId');
  await SecureStore.deleteItemAsync('userEmail');
}

