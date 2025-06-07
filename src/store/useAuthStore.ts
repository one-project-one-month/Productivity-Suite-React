import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type User = {
  id: string;
  name: string;
  email: string;
  genderId: number;
  genderName: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthDataStore = create<AuthState>()(
  persist(
    immer((set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      logout: () => {
        set({ user: null });
        localStorage.removeItem('auth-storage');
      },
    })),
    {
      name: 'auth-storage',
    }
  )
);
