/**
 * Zustand store: User auth state
 */
import { create } from 'zustand';

interface AuthState {
  user: null | { id: string; name: string };
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
