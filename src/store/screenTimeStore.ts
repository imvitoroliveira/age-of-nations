import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScreenTimeState {
  sessionStartedAt: number | null;
  totalSecondsToday: number;
  lastDate: string;
  dailyLimitMinutes: number;
  isPaused: boolean;

  startSession: () => void;
  tick: () => void;
  pause: () => void;
  resume: () => void;
  isTimeUp: () => boolean;
  getRemainingSeconds: () => number;
  getUsedPercent: () => number;
  setDailyLimit: (minutes: number) => void;
  resetIfNewDay: () => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export const useScreenTimeStore = create<ScreenTimeState>()(
  persist(
    (set, get) => ({
      sessionStartedAt: null,
      totalSecondsToday: 0,
      lastDate: todayStr(),
      dailyLimitMinutes: 15,
      isPaused: false,

      startSession: () => {
        get().resetIfNewDay();
        set({ sessionStartedAt: Date.now(), isPaused: false });
      },

      tick: () => {
        const s = get();
        if (s.isPaused || !s.sessionStartedAt) return;
        set({ totalSecondsToday: s.totalSecondsToday + 1 });
      },

      pause: () => set({ isPaused: true }),
      resume: () => set({ isPaused: false }),

      isTimeUp: () => {
        const s = get();
        return s.totalSecondsToday >= s.dailyLimitMinutes * 60;
      },

      getRemainingSeconds: () => {
        const s = get();
        return Math.max(0, s.dailyLimitMinutes * 60 - s.totalSecondsToday);
      },

      getUsedPercent: () => {
        const s = get();
        return Math.min(100, (s.totalSecondsToday / (s.dailyLimitMinutes * 60)) * 100);
      },

      setDailyLimit: (minutes) => set({ dailyLimitMinutes: minutes }),

      resetIfNewDay: () => {
        if (get().lastDate !== todayStr()) {
          set({ totalSecondsToday: 0, lastDate: todayStr(), sessionStartedAt: null });
        }
      },
    }),
    { name: 'kidari-screen-time' }
  )
);
