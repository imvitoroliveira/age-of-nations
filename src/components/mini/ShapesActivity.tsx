import { useState, useCallback } from 'react';
import { SHAPES, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useAppStore } from '@/store/appStore';

interface Props { onBack: () => void; }

export const ShapesActivity = ({ onBack }: Props) => {
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * SHAPES.length));
  const [options, setOptions] = useState<number[]>(() => genOpts(Math.floor(Math.random() * SHAPES.length)));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { recordActivity } = useAppStore();

  function genOpts(t: number) {
    const s = new Set([t]);
    while (s.size < Math.min(4, SHAPES.length)) s.add(Math.floor(Math.random() * SHAPES.length));
    return [...s].sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (idx: number) => {
    const correct = idx === targetIdx;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity('shapes', correct);
  };

  const next = useCallback(() => {
    setFeedback(null);
    const t = Math.floor(Math.random() * SHAPES.length);
    setTargetIdx(t);
    setOptions(genOpts(t));
  }, []);

  const target = SHAPES[targetIdx];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🔷 Formas" category="shapes" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <p className="text-2xl font-bold text-muted-foreground">Encontre o(a)</p>
        <button onClick={() => speak(target.name)} className="text-4xl md:text-6xl font-extrabold font-baloo text-primary pop">{target.name}</button>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
          {options.map(idx => (
            <button key={idx} onClick={() => handleAnswer(idx)} className="kid-card bg-card p-8 border-primary/20 flex flex-col items-center gap-2">
              <span className="text-7xl">{SHAPES[idx].emoji}</span>
              <span className="text-lg font-bold">{SHAPES[idx].name}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
