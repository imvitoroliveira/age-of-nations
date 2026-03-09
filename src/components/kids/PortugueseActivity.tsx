import { useState, useCallback } from 'react';
import { LETTER_WORDS, LETTERS, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useAppStore } from '@/store/appStore';

interface Props { onBack: () => void; }

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export const PortugueseActivity = ({ onBack }: Props) => {
  const [subMode, setSubMode] = useState<'vowels' | 'complete' | null>(null);
  const { recordActivity } = useAppStore();

  if (!subMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ActivityHeader title="📝 Português" category="portuguese" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
          <p className="text-3xl font-bold font-baloo text-foreground">Escolha uma atividade</p>
          <div className="grid grid-cols-1 gap-4 max-w-sm w-full">
            <button onClick={() => setSubMode('vowels')} className="kid-card bg-card p-8 border-kid-pink/30 flex flex-col items-center gap-2">
              <span className="text-5xl">🅰️</span>
              <span className="text-2xl font-bold">Vogais</span>
            </button>
            <button onClick={() => setSubMode('complete')} className="kid-card bg-card p-8 border-kid-blue/30 flex flex-col items-center gap-2">
              <span className="text-5xl">✏️</span>
              <span className="text-2xl font-bold">Complete a Palavra</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (subMode === 'vowels') return <VowelsGame onBack={() => setSubMode(null)} recordActivity={recordActivity} />;
  return <CompleteWordGame onBack={() => setSubMode(null)} recordActivity={recordActivity} />;
};

function VowelsGame({ onBack, recordActivity }: { onBack: () => void; recordActivity: (c: any, b: boolean) => void }) {
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * VOWELS.length));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const target = VOWELS[targetIdx];
  const w = LETTER_WORDS[target];

  const next = useCallback(() => { setFeedback(null); setTargetIdx(Math.floor(Math.random() * VOWELS.length)); }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🅰️ Vogais" category="portuguese" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <span className="text-8xl">{w.emoji}</span>
        <p className="text-3xl font-bold font-baloo">{w.word}</p>
        <p className="text-xl text-muted-foreground">Começa com qual vogal?</p>
        <div className="flex gap-3">
          {VOWELS.map(v => (
            <button key={v} onClick={() => { const c = v === target; setFeedback(c ? 'correct' : 'wrong'); recordActivity('portuguese', c); }}
              className="kid-card bg-card w-16 h-16 border-kid-pink/30 text-3xl font-extrabold font-baloo text-kid-pink">{v}</button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
}

function CompleteWordGame({ onBack, recordActivity }: { onBack: () => void; recordActivity: (c: any, b: boolean) => void }) {
  const words = [
    { word: 'GATO', missing: 1, emoji: '🐱' }, { word: 'BOLA', missing: 2, emoji: '⚽' },
    { word: 'CASA', missing: 0, emoji: '🏠' }, { word: 'PATO', missing: 1, emoji: '🦆' },
    { word: 'SAPO', missing: 3, emoji: '🐸' }, { word: 'VACA', missing: 2, emoji: '🐮' },
  ];

  const [idx, setIdx] = useState(() => Math.floor(Math.random() * words.length));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const current = words[idx];
  const missingLetter = current.word[current.missing];
  const display = current.word.split('').map((c, i) => i === current.missing ? '_' : c).join(' ');

  const optionsSet = new Set([missingLetter]);
  while (optionsSet.size < 4) { const r = LETTERS[Math.floor(Math.random() * LETTERS.length)]; optionsSet.add(r); }
  const shuffledOptions = [...optionsSet].sort(() => Math.random() - 0.5);

  const next = useCallback(() => { setFeedback(null); setIdx(Math.floor(Math.random() * words.length)); }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="✏️ Complete" category="portuguese" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <span className="text-7xl">{current.emoji}</span>
        <p className="text-5xl font-extrabold font-baloo tracking-widest">{display}</p>
        <div className="flex gap-3">
          {shuffledOptions.map((l, i) => (
            <button key={i} onClick={() => { const c = l === missingLetter; setFeedback(c ? 'correct' : 'wrong'); recordActivity('portuguese', c); }}
              className="kid-card bg-card w-16 h-16 border-kid-blue/30 text-3xl font-extrabold font-baloo text-kid-blue">{l}</button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
}
