import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  firebaseUser: { uid: string; email: string | null; emailVerified: boolean } | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setFirebaseUser: (fu: AuthState['firebaseUser']) => void;
  setLoading: (v: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      firebaseUser: null,
      isLoading: true,
      setUser: user => set({ user }),
      setFirebaseUser: firebaseUser => set({ firebaseUser }),
      setLoading: isLoading => set({ isLoading }),
      clear: () => set({ user: null, firebaseUser: null }),
    }),
    { name: 'r2w-auth', partialize: state => ({ user: state.user }) }
  )
);
