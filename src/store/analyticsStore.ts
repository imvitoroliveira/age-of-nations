import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '@/types/education';

export interface ActivityEvent {
  childId: string;
  category: Category;
  correct: boolean;
  timestamp: string;
}

export interface DailySnapshot {
  date: string; // YYYY-MM-DD
  childId: string;
  totalActivities: number;
  correctCount: number;
  secondsUsed: number;
  categoriesPlayed: Record<string, { total: number; correct: number }>;
}

interface AnalyticsState {
  events: ActivityEvent[];
  dailySnapshots: Record<string, DailySnapshot[]>; // keyed by childId
  
  trackEvent: (childId: string, category: Category, correct: boolean) => void;
  trackScreenTime: (childId: string, seconds: number) => void;
  getDailySnapshots: (childId: string, days?: number) => DailySnapshot[];
  getCategoryStats: (childId: string) => { category: string; total: number; correct: number; accuracy: number }[];
  getWeeklyTrend: (childId: string) => { day: string; activities: number; correct: number }[];
  getStreakDays: (childId: string) => number;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getOrCreateSnapshot(snapshots: DailySnapshot[], childId: string, date: string): DailySnapshot {
  const existing = snapshots.find(s => s.date === date);
  if (existing) return existing;
  return {
    date,
    childId,
    totalActivities: 0,
    correctCount: 0,
    secondsUsed: 0,
    categoriesPlayed: {},
  };
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      events: [],
      dailySnapshots: {},

      trackEvent: (childId, category, correct) => {
        const date = todayStr();
        const event: ActivityEvent = { childId, category, correct, timestamp: new Date().toISOString() };

        set(state => {
          const childSnapshots = [...(state.dailySnapshots[childId] || [])];
          const snapshot = { ...getOrCreateSnapshot(childSnapshots, childId, date) };
          snapshot.totalActivities += 1;
          if (correct) snapshot.correctCount += 1;
          
          const catStats = { ...(snapshot.categoriesPlayed[category] || { total: 0, correct: 0 }) };
          catStats.total += 1;
          if (correct) catStats.correct += 1;
          snapshot.categoriesPlayed = { ...snapshot.categoriesPlayed, [category]: catStats };

          const idx = childSnapshots.findIndex(s => s.date === date);
          if (idx >= 0) childSnapshots[idx] = snapshot;
          else childSnapshots.push(snapshot);

          // Keep only last 90 days of events, unlimited snapshots
          const recentEvents = [...state.events, event].slice(-500);

          return {
            events: recentEvents,
            dailySnapshots: { ...state.dailySnapshots, [childId]: childSnapshots },
          };
        });
      },

      trackScreenTime: (childId, seconds) => {
        const date = todayStr();
        set(state => {
          const childSnapshots = [...(state.dailySnapshots[childId] || [])];
          const snapshot = { ...getOrCreateSnapshot(childSnapshots, childId, date) };
          snapshot.secondsUsed = seconds;

          const idx = childSnapshots.findIndex(s => s.date === date);
          if (idx >= 0) childSnapshots[idx] = snapshot;
          else childSnapshots.push(snapshot);

          return {
            dailySnapshots: { ...state.dailySnapshots, [childId]: childSnapshots },
          };
        });
      },

      getDailySnapshots: (childId, days = 7) => {
        const snapshots = get().dailySnapshots[childId] || [];
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().slice(0, 10);
        return snapshots.filter(s => s.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
      },

      getCategoryStats: (childId) => {
        const snapshots = get().dailySnapshots[childId] || [];
        const aggregated: Record<string, { total: number; correct: number }> = {};
        
        for (const snap of snapshots) {
          for (const [cat, stats] of Object.entries(snap.categoriesPlayed)) {
            if (!aggregated[cat]) aggregated[cat] = { total: 0, correct: 0 };
            aggregated[cat].total += stats.total;
            aggregated[cat].correct += stats.correct;
          }
        }

        return Object.entries(aggregated).map(([category, stats]) => ({
          category,
          total: stats.total,
          correct: stats.correct,
          accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        })).sort((a, b) => b.total - a.total);
      },

      getWeeklyTrend: (childId) => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const result: { day: string; activities: number; correct: number }[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          const snap = (get().dailySnapshots[childId] || []).find(s => s.date === dateStr);
          result.push({
            day: days[d.getDay()],
            activities: snap?.totalActivities || 0,
            correct: snap?.correctCount || 0,
          });
        }
        return result;
      },

      getStreakDays: (childId) => {
        const snapshots = (get().dailySnapshots[childId] || []).sort((a, b) => b.date.localeCompare(a.date));
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          const snap = snapshots.find(s => s.date === dateStr);
          if (snap && snap.totalActivities > 0) streak++;
          else if (i > 0) break; // Allow today to be missing
        }
        return streak;
      },
    }),
    { name: 'kidari-analytics' }
  )
);
