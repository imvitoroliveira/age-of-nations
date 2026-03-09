import { useState, useCallback } from 'react';
import { NUMBERS, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useAppStore } from '@/store/appStore';

interface Props { onBack: () => void; }

const COUNTING_ITEMS = ['🍎', '🌟', '🐟', '🦋', '🌺'];

export const NumbersActivity = ({ onBack }: Props) => {
  const [mode, setMode] = useState<'explore' | 'count'>('explore');
  const [targetNum, setTargetNum] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [countEmoji] = useState(() => COUNTING_ITEMS[Math.floor(Math.random() * COUNTING_ITEMS.length)]);
  const [options, setOptions] = useState<number[]>(() => genOpts(Math.floor(Math.random() * 9) + 1));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { recordActivity } = useAppStore();

  function genOpts(t: number) {
    const s = new Set([t]);
    while (s.size < 4) { const n = Math.floor(Math.random() * 10); if (n !== t) s.add(n); }
    return [...s].sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (n: number) => {
    const correct = n === targetNum;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity('numbers', correct);
  };

  const next = useCallback(() => {
    setFeedback(null);
    const t = Math.floor(Math.random() * 9) + 1;
    setTargetNum(t);
    setOptions(genOpts(t));
  }, []);

  if (mode === 'explore') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ActivityHeader title="🔢 Números" category="numbers" onBack={onBack} />
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-4">
            <button onClick={() => setMode('count')} className="kid-btn bg-secondary text-secondary-foreground">Contar! 🧮</button>
          </div>
          <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
            {NUMBERS.map(n => (
              <button key={n} onClick={() => speak(`${n}`)} className="kid-card bg-card aspect-square flex flex-col items-center justify-center border-secondary/30">
                <span className="text-4xl font-extrabold font-baloo text-secondary">{n}</span>
                <span className="text-xs mt-1">{Array(Math.min(n, 5)).fill('⭐').join('')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🧮 Contando" category="numbers" onBack={() => setMode('explore')} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <p className="text-2xl font-bold text-muted-foreground">Quantos tem?</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-xs">
          {Array(targetNum).fill(0).map((_, i) => (
            <span key={i} className="text-5xl bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>{countEmoji}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
          {options.map(n => (
            <button key={n} onClick={() => handleAnswer(n)} className="kid-card bg-card p-6 border-secondary/30">
              <span className="text-5xl font-extrabold font-baloo text-secondary">{n}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
