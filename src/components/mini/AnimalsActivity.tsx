import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { ANIMALS } from '@/data/educationData';

interface Props { onBack: () => void; }

export const AnimalsActivity = ({ onBack }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showSound, setShowSound] = useState(false);

  const handleSelect = (i: number) => {
    setSelected(i);
    setShowSound(false);
  };

  const playSound = () => {
    setShowSound(true);
    // Use speech synthesis for animal sounds
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(ANIMALS[selected!].soundText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-green)/0.06)] to-background">
      <header className="flex items-center gap-4 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl text-kids-green">🐶 Animais</h1>
      </header>

      {/* Selected animal */}
      {selected !== null && (
        <div className="text-center py-6 animate-bounce-in" key={selected}>
          <div className="text-8xl mb-4">{ANIMALS[selected].emoji}</div>
          <p className="text-3xl font-bold text-foreground mb-2">{ANIMALS[selected].name}</p>

          <button
            onClick={playSound}
            className="activity-btn bg-kids-green text-white inline-flex items-center gap-2 mt-2"
          >
            <Volume2 className="w-5 h-5" />
            Ouvir som
          </button>

          {showSound && (
            <div className="mt-4 animate-bounce-in">
              <p className="text-4xl font-bold text-kids-green">
                {ANIMALS[selected].soundText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Animal grid */}
      <main className="grid grid-cols-4 gap-3 p-6 max-w-md mx-auto">
        {ANIMALS.map((animal, i) => (
          <button
            key={animal.name}
            onClick={() => handleSelect(i)}
            className={`text-4xl p-3 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 border-2 ${
              selected === i
                ? 'border-kids-green bg-[hsl(var(--kids-green)/0.1)] scale-110'
                : 'border-transparent hover:bg-muted'
            }`}
          >
            {animal.emoji}
          </button>
        ))}
      </main>

      {selected === null && (
        <p className="text-center text-muted-foreground font-nunito text-lg mt-4">
          Toque em um animal para conhecer! 🐾
        </p>
      )}
    </div>
  );
};
