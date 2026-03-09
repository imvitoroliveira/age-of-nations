export type AgeGroup = 'mini' | 'kids';

export type MiniCategory = 'colors' | 'animals' | 'letters' | 'numbers' | 'shapes';
export type KidsCategory = 'math' | 'portuguese' | 'syllables' | 'words' | 'stories';

export type Category = MiniCategory | KidsCategory;

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  avatarEmoji: string;
  progress: Record<string, CategoryProgress>;
}

export interface CategoryProgress {
  category: Category;
  completed: number;
  total: number;
  stars: number;
  lastPlayed?: string;
}

export interface ActivityResult {
  correct: boolean;
  category: Category;
  timestamp: number;
}

export interface ColorItem {
  name: string;
  hex: string;
  emoji: string;
}

export interface AnimalItem {
  name: string;
  emoji: string;
  sound: string;
  soundText: string;
}

export interface ShapeItem {
  name: string;
  emoji: string;
  sides: number;
}

export interface MathProblem {
  a: number;
  b: number;
  operator: '+' | '-';
  answer: number;
  options: number[];
}

export interface SyllableWord {
  word: string;
  syllables: string[];
  image: string;
}
