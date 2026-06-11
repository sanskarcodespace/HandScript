import { create } from 'zustand';
import { User } from '../types/user';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User, accessToken: string) => void;
  clearUser: () => void;
  refreshTokens: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  setUser: (user: User, accessToken: string) => {
    // Save user info to sessionStorage for non-sensitive persistence
    sessionStorage.setItem('handnote_user', JSON.stringify(user));
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearUser: () => {
    sessionStorage.removeItem('handnote_user');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  refreshTokens: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { accessToken } = response.data;
      
      const userStr = sessionStorage.getItem('handnote_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      set({
        accessToken,
        isAuthenticated: true,
        ...(user && { user })
      });
      return true;
    } catch (error) {
      get().clearUser();
      return false;
    }
  },

  initialize: async () => {
    // Attempt silent refresh on app load
    try {
      await get().refreshTokens();
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },
}));
