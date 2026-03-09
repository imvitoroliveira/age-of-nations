import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgeGroup, ChildProfile, Category, CategoryProgress } from '@/types/education';
import { AVATAR_EMOJIS } from '@/data/educationData';

interface ChildState {
  children: ChildProfile[];
  activeChildId: string | null;
  activeChild: ChildProfile | null;
  
  addChild: (name: string, age: number, avatarEmoji: string) => void;
  removeChild: (id: string) => void;
  setActiveChild: (id: string | null) => void;
  recordActivity: (category: Category, correct: boolean) => void;
  getProgress: (category: Category) => CategoryProgress;
  getTotalStars: () => number;
}

function getAgeGroup(age: number): AgeGroup {
  return age <= 3 ? 'mini' : 'kids';
}

function getDefaultProgress(ageGroup: AgeGroup): Record<string, CategoryProgress> {
  const categories: Category[] = ageGroup === 'mini'
    ? ['colors', 'animals', 'letters', 'numbers', 'shapes']
    : ['math', 'portuguese', 'syllables', 'words', 'stories'];
  
  const progress: Record<string, CategoryProgress> = {};
  categories.forEach(cat => {
    progress[cat] = { category: cat, completed: 0, total: 20, stars: 0 };
  });
  return progress;
}

export const useChildStore = create<ChildState>()(
  persist(
    (set, get) => ({
      children: [],
      activeChildId: null,
      activeChild: null,

      addChild: (name, age, avatarEmoji) => {
        const ageGroup = getAgeGroup(age);
        const child: ChildProfile = {
          id: crypto.randomUUID(),
          name,
          age,
          ageGroup,
          avatarEmoji: avatarEmoji || AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
          progress: getDefaultProgress(ageGroup),
        };
        set(state => ({
          children: [...state.children, child],
          activeChildId: child.id,
          activeChild: child,
        }));
      },

      removeChild: (id) => {
        set(state => {
          const children = state.children.filter(c => c.id !== id);
          const activeChildId = state.activeChildId === id ? null : state.activeChildId;
          return {
            children,
            activeChildId,
            activeChild: activeChildId ? children.find(c => c.id === activeChildId) || null : null,
          };
        });
      },

      setActiveChild: (id) => {
        set(state => ({
          activeChildId: id,
          activeChild: id ? state.children.find(c => c.id === id) || null : null,
        }));
      },

      recordActivity: (category, correct) => {
        set(state => {
          if (!state.activeChildId) return state;
          const children = state.children.map(child => {
            if (child.id !== state.activeChildId) return child;
            const prog = child.progress[category] || { category, completed: 0, total: 20, stars: 0 };
            const newCompleted = prog.completed + 1;
            const newStars = correct ? prog.stars + 1 : prog.stars;
            return {
              ...child,
              progress: {
                ...child.progress,
                [category]: {
                  ...prog,
                  completed: newCompleted,
                  stars: newStars,
                  lastPlayed: new Date().toISOString(),
                },
              },
            };
          });
          const activeChild = children.find(c => c.id === state.activeChildId) || null;
          return { children, activeChild };
        });
      },

      getProgress: (category) => {
        const child = get().activeChild;
        if (!child) return { category, completed: 0, total: 20, stars: 0 };
        return child.progress[category] || { category, completed: 0, total: 20, stars: 0 };
      },

      getTotalStars: () => {
        const child = get().activeChild;
        if (!child) return 0;
        return Object.values(child.progress).reduce((sum, p) => sum + p.stars, 0);
      },
    }),
    { name: 'aprende-kids-children' }
  )
);
