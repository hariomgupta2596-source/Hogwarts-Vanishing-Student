import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/schema';

interface GameState {
  user: User | null;
  house: string | null;
  isMuted: boolean;
  usedHints: Record<number, boolean>;
  setHouse: (house: string) => void;
  setUser: (user: User | null) => void;
  toggleMute: () => void;
  setHintUsed: (gameId: number) => void;
  logout: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      house: null,
      setHouse: (house) => set({ house }),
      isMuted: false,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      usedHints: {},
      setHintUsed: (gameId) => set((state) => ({
        usedHints: { ...state.usedHints, [gameId]: true }
      })),
      logout: () => set({ user: null, house: null, usedHints: {} }),
    }),
    {
      name: 'vanishing-student-storage',
    }
  )
);
