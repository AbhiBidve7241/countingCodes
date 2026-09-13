import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDark: true,
  soundEnabled: true,
  backgroundEffect: 'particles', // 'particles' | 'video' | 'minimal'

  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setBackgroundEffect: (effect) => set({ backgroundEffect: effect }),
}));
