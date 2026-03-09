import { useState, useCallback } from 'react';
import { LETTERS, LETTER_WORDS } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useChildStore } from '@/store/childStore';

interface Props { onBack: () => void; }

export const LettersActivity = ({ onBack }: Props) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * LETTERS.length));
  const [options, setOptions] = useState<number[]>(() => genOpts(Math.floor(Math.random() * LETTERS.length)));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { recordActivity } = useChildStore();

  function genOpts(t: number) {
    const s = new Set([t]);
    while (s.size < 4) s.add(Math.floor(Math.random() * LETTERS.length));
    return [...s].sort(() => Math.random() - 0.5);
  }

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR'; u.rate = 0.8; speechSynthesis.speak(u);
  };

  const handleQuizAnswer = (idx: number) => {
    const correct = idx === targetIdx;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity('letters', correct);
  };

  const next = useCallback(() => {
    setFeedback(null);
    const t = Math.floor(Math.random() * LETTERS.length);
    setTargetIdx(t);
    setOptions(genOpts(t));
  }, []);

  if (mode === 'explore') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ActivityHeader title="🔤 Letras" category="letters" onBack={onBack} />
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-4">
            <button onClick={() => setMode('quiz')} className="kid-btn bg-primary text-primary-foreground">
              Jogar Quiz! 🎮
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-w-xl mx-auto">
            {LETTERS.map(letter => {
              const w = LETTER_WORDS[letter];
              return (
                <button
                  key={letter}
                  onClick={() => speak(`${letter}. ${w.word}`)}
                  className="kid-card bg-card p-3 flex flex-col items-center gap-1 border-primary/20"
                >
                  <span className="text-3xl font-extrabold font-baloo text-primary">{letter}</span>
                  <span className="text-2xl">{w.emoji}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{w.word}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const target = LETTERS[targetIdx];
  const w = LETTER_WORDS[target];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🔤 Quiz Letras" category="letters" onBack={() => setMode('explore')} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <p className="text-2xl font-bold text-muted-foreground">Qual é a letra de...</p>
        <div className="text-center">
          <span className="text-7xl">{w.emoji}</span>
          <p className="text-3xl font-bold font-baloo mt-2">{w.word}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
          {options.map(idx => (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(idx)}
              className="kid-card bg-card p-6 border-primary/20"
            >
              <span className="text-5xl font-extrabold font-baloo text-primary">{LETTERS[idx]}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
