import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/schema';

interface GameState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'vanishing-student-storage',
    }
  )
);
