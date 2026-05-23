import { useState, useCallback } from 'react';
import { ANIMALS, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useQuiz } from '@/hooks/useQuiz';

interface Props { onBack: () => void; }

export const AnimalsActivity = ({ onBack }: Props) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  
  const { 
    target, 
    options, 
    feedback, 
    handleAnswer, 
    next 
  } = useQuiz({
    items: ANIMALS,
    category: 'animals',
  });

  const handleAnimalTap = (idx: number) => {
    setSelectedAnimal(idx);
    const a = ANIMALS[idx];
    speak(`${a.name}. O ${a.name.toLowerCase()} faz ${a.soundText}`);
  };

  if (mode === 'explore') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ActivityHeader title="🐾 Animais" category="animals" onBack={onBack} />
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-4">
            <button onClick={() => setMode('quiz')} className="kid-btn bg-primary text-primary-foreground">Jogar Quiz! 🎮</button>
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
              <button key={animal.name} onClick={() => handleAnimalTap(i)} className="kid-card bg-card p-4 flex flex-col items-center gap-1 border-muted">
                <span className="text-5xl">{animal.emoji}</span>
                <span className="text-sm font-bold">{animal.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🐾 Quiz Animal" category="animals" onBack={() => setMode('explore')} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <p className="text-2xl font-bold text-muted-foreground">Qual animal faz...</p>
        <button onClick={() => speak(target.soundText)} className="text-5xl md:text-7xl font-extrabold font-baloo text-kid-orange pop">{target.soundText}</button>
        <div className="grid grid-cols-2 gap-4 max-w-md w-full">
          {options.map(idx => (
            <button key={idx} onClick={() => handleAnswer(idx)} className="kid-card bg-card p-6 flex flex-col items-center gap-2 border-muted">
              <span className="text-6xl">{ANIMALS[idx].emoji}</span>
              <span className="text-xl font-bold">{ANIMALS[idx].name}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
