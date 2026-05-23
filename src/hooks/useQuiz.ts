import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { Category } from '@/types/education';

interface QuizConfig<T> {
  items: T[];
  category: Category;
  optionCount?: number;
}

interface QuizState<T> {
  target: T;
  targetIdx: number;
  options: number[];
  feedback: 'correct' | 'wrong' | null;
  handleAnswer: (idx: number) => void;
  next: () => void;
}

export function useQuiz<T>({ items, category, optionCount = 4 }: QuizConfig<T>): QuizState<T> {
  const { recordActivity } = useAppStore();

  const genOptions = useCallback((t: number) => {
    const opts = new Set([t]);
    while (opts.size < Math.min(optionCount, items.length)) {
      opts.add(Math.floor(Math.random() * items.length));
    }
    return [...opts].sort(() => Math.random() - 0.5);
  }, [items.length, optionCount]);

  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * items.length));
  const [options, setOptions] = useState<number[]>(() => genOptions(targetIdx));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleAnswer = useCallback((idx: number) => {
    const correct = idx === targetIdx;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity(category, correct);
  }, [targetIdx, category, recordActivity]);

  const next = useCallback(() => {
    setFeedback(null);
    const t = Math.floor(Math.random() * items.length);
    setTargetIdx(t);
    setOptions(genOptions(t));
  }, [items.length]);

  return {
    target: items[targetIdx],
    targetIdx,
    options,
    feedback,
    handleAnswer,
    next,
  };
}
