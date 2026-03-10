export type AgeGroup = 'mini' | 'kids';
export type MiniCategory = 'colors' | 'animals' | 'letters' | 'numbers' | 'shapes';
export type KidsCategory = 'math' | 'portuguese' | 'syllables' | 'drawing';
export type Category = MiniCategory | KidsCategory;

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  age_group: AgeGroup;
  avatar_emoji: string;
  avatar_accessories: string[];
  farm_items: string[];
  total_stars: number;
  level: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityProgress {
  id: string;
  child_id: string;
  category: Category;
  correct_count: number;
  total_count: number;
  stars_earned: number;
  streak: number;
  best_streak: number;
  last_played_at?: string;
}

export interface Achievement {
  id: string;
  child_id: string;
  achievement_key: string;
  unlocked_at: string;
}

export interface DailyUsage {
  id: string;
  child_id: string;
  usage_date: string;
  seconds_used: number;
  activities_completed: number;
}

export interface ScreenTimeSettings {
  id: string;
  child_id: string;
  daily_limit_minutes: number;
  break_interval_minutes: number;
  break_duration_minutes: number;
}

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  emoji: string;
  condition: (progress: Record<string, ActivityProgress>, totalStars: number) => boolean;
}

export interface FarmItem {
  key: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'animal' | 'plant' | 'building' | 'decoration';
}
