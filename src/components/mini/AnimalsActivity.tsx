import { useState, useCallback } from 'react';
import { ANIMALS } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useChildStore } from '@/store/childStore';

interface Props { onBack: () => void; }

export const AnimalsActivity = ({ onBack }: Props) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [quizTarget, setQuizTarget] = useState(() => Math.floor(Math.random() * ANIMALS.length));
  const [quizOptions, setQuizOptions] = useState<number[]>(() => genOptions(Math.floor(Math.random() * ANIMALS.length)));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { recordActivity } = useChildStore();

  function genOptions(target: number) {
    const opts = new Set([target]);
    while (opts.size < 4) opts.add(Math.floor(Math.random() * ANIMALS.length));
    return [...opts].sort(() => Math.random() - 0.5);
  }

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR'; u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  const handleAnimalTap = (idx: number) => {
    setSelectedAnimal(idx);
    const a = ANIMALS[idx];
    speak(`${a.name}. O ${a.name.toLowerCase()} faz ${a.soundText}`);
  };

  const handleQuizAnswer = (idx: number) => {
    const correct = idx === quizTarget;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity('animals', correct);
  };

  const nextQuiz = useCallback(() => {
    setFeedback(null);
    const t = Math.floor(Math.random() * ANIMALS.length);
    setQuizTarget(t);
    setQuizOptions(genOptions(t));
  }, []);

  if (mode === 'explore') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ActivityHeader title="🐾 Animais" category="animals" onBack={onBack} />
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-4">
            <button onClick={() => setMode('quiz')} className="kid-btn bg-primary text-primary-foreground">
              Jogar Quiz! 🎮
            </button>
          </div>

          {selectedAnimal !== null && (
            <div className="text-center mb-6 bounce-in">
              <span className="text-8xl">{ANIMALS[selectedAnimal].emoji}</span>
              <p className="text-3xl font-bold font-baloo mt-2">{ANIMALS[selectedAnimal].name}</p>
              <p className="text-2xl text-kid-orange font-bold">{ANIMALS[selectedAnimal].soundText}</p>
            </div>
          )}

          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-xl mx-auto">
            {ANIMALS.map((animal, i) => (
              <button
                key={animal.name}
                onClick={() => handleAnimalTap(i)}
                className="kid-card bg-card p-4 flex flex-col items-center gap-1 border-muted"
              >
                <span className="text-5xl">{animal.emoji}</span>
                <span className="text-sm font-bold">{animal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const target = ANIMALS[quizTarget];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🐾 Quiz Animal" category="animals" onBack={() => setMode('explore')} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <p className="text-2xl font-bold text-muted-foreground">Qual animal faz...</p>
        <button onClick={() => speak(target.soundText)} className="text-5xl md:text-7xl font-extrabold font-baloo text-kid-orange pop">
          {target.soundText}
        </button>
        <div className="grid grid-cols-2 gap-4 max-w-md w-full">
          {quizOptions.map(idx => (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(idx)}
              className="kid-card bg-card p-6 flex flex-col items-center gap-2 border-muted"
            >
              <span className="text-6xl">{ANIMALS[idx].emoji}</span>
              <span className="text-xl font-bold">{ANIMALS[idx].name}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={nextQuiz} />
    </div>
  );
};
