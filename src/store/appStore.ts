import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChildProfile, ActivityProgress, Category, AgeGroup } from '@/types/education';
import { AVATAR_EMOJIS } from '@/data/educationData';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { playAchievement } from '@/lib/sounds';

interface AppState {
  // Local children (works without auth)
  children: ChildProfile[];
  activeChildId: string | null;
  parentPin: string | null;

  addChild: (name: string, age: number, avatarEmoji: string) => ChildProfile;
  removeChild: (id: string) => void;
  setActiveChild: (id: string | null) => void;
  getActiveChild: () => ChildProfile | null;

  // Progress (local)
  progress: Record<string, Record<string, ActivityProgress>>;
  recordActivity: (category: Category, correct: boolean) => void;
  getProgress: (childId: string, category: Category) => ActivityProgress;
  getTotalStars: (childId?: string) => number;

  // Farm
  buyFarmItem: (itemKey: string, cost: number) => boolean;

  // Parent PIN
  setParentPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;

  // Achievements (local tracking)
  unlockedAchievements: Record<string, string[]>;
  unlockAchievement: (key: string) => void;
  hasAchievement: (key: string) => boolean;
}

function getAgeGroup(age: number): AgeGroup {
  return age <= 3 ? 'mini' : 'kids';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      children: [],
      activeChildId: null,
      parentPin: null,
      progress: {},
      unlockedAchievements: {},

      addChild: (name, age, avatarEmoji) => {
        const child: ChildProfile = {
          id: crypto.randomUUID(),
          parent_id: '',
          name,
          age,
          age_group: getAgeGroup(age),
          avatar_emoji: avatarEmoji || AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
          avatar_accessories: [],
          farm_items: [],
          total_stars: 0,
          level: 1,
        };
        set(s => ({
          children: [...s.children, child],
          activeChildId: child.id,
          progress: { ...s.progress, [child.id]: {} },
          unlockedAchievements: { ...s.unlockedAchievements, [child.id]: [] },
        }));
        return child;
      },

      removeChild: (id) => set(s => ({
        children: s.children.filter(c => c.id !== id),
        activeChildId: s.activeChildId === id ? null : s.activeChildId,
      })),

      setActiveChild: (id) => set({ activeChildId: id }),

      getActiveChild: () => {
        const s = get();
        return s.children.find(c => c.id === s.activeChildId) || null;
      },

      recordActivity: (category, correct) => {
        const s = get();
        const childId = s.activeChildId;
        if (!childId) return;

        const childProgress = s.progress[childId] || {};
        const prev = childProgress[category] || {
          id: '', child_id: childId, category,
          correct_count: 0, total_count: 0, stars_earned: 0,
          streak: 0, best_streak: 0,
        };

        const newStreak = correct ? prev.streak + 1 : 0;
        const updated: ActivityProgress = {
          ...prev,
          total_count: prev.total_count + 1,
          correct_count: correct ? prev.correct_count + 1 : prev.correct_count,
          stars_earned: correct ? prev.stars_earned + 1 : prev.stars_earned,
          streak: newStreak,
          best_streak: Math.max(prev.best_streak, newStreak),
          last_played_at: new Date().toISOString(),
        };

        const newProgress = { ...s.progress, [childId]: { ...childProgress, [category]: updated } };

        // Update child total stars
        const totalStars = Object.values(newProgress[childId]).reduce((sum, p) => sum + p.stars_earned, 0);
        const level = Math.floor(totalStars / 10) + 1;
        const children = s.children.map(c =>
          c.id === childId ? { ...c, total_stars: totalStars, level } : c
        );

        set({ progress: newProgress, children });

        // Track in analytics
        useAnalyticsStore.getState().trackEvent(childId, category, correct);
      },

      getProgress: (childId, category) => {
        const s = get();
        return s.progress[childId]?.[category] || {
          id: '', child_id: childId, category,
          correct_count: 0, total_count: 0, stars_earned: 0,
          streak: 0, best_streak: 0,
        };
      },

      getTotalStars: (childId?) => {
        const s = get();
        const id = childId || s.activeChildId;
        if (!id) return 0;
        const cp = s.progress[id];
        if (!cp) return 0;
        return Object.values(cp).reduce((sum, p) => sum + p.stars_earned, 0);
      },

      buyFarmItem: (itemKey, cost) => {
        const s = get();
        const child = s.getActiveChild();
        if (!child || child.total_stars < cost) return false;

        set(state => ({
          children: state.children.map(c =>
            c.id === child.id
              ? { ...c, farm_items: [...c.farm_items, itemKey], total_stars: c.total_stars - cost }
              : c
          ),
        }));
        return true;
      },

      setParentPin: (pin) => set({ parentPin: pin }),
      verifyPin: (pin) => get().parentPin === pin,

      unlockAchievement: (key) => {
        const s = get();
        const childId = s.activeChildId;
        if (!childId) return;
        const current = s.unlockedAchievements[childId] || [];
        if (current.includes(key)) return;
        set(state => ({
          unlockedAchievements: {
            ...state.unlockedAchievements,
            [childId]: [...current, key],
          },
        }));
      },

      hasAchievement: (key) => {
        const s = get();
        const childId = s.activeChildId;
        if (!childId) return false;
        return (s.unlockedAchievements[childId] || []).includes(key);
      },
    }),
    { name: 'kidari-app-store' }
  )
);
