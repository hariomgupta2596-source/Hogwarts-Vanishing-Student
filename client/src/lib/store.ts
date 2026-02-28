import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/schema';

interface GameState {
  user: User | null;
  house: string | null;
  setHouse: (house: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      house: null,
      setHouse: (house) => set({ house }),
      logout: () => set({ user: null, house: null }),
    }),
    {
      name: 'vanishing-student-storage',
    }
  )
);
