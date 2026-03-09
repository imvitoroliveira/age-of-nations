import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { LETTERS, LETTER_WORDS } from '@/data/educationData';

interface Props { onBack: () => void; }

export const LettersActivity = ({ onBack }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  const speakLetter = (letter: string) => {
    setSelected(letter);
    if ('speechSynthesis' in window) {
      const info = LETTER_WORDS[letter];
      const utterance = new SpeechSynthesisUtterance(`${letter}. ${info.word}`);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const info = selected ? LETTER_WORDS[selected] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-blue)/0.06)] to-background">
      <header className="flex items-center gap-4 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl text-kids-blue">🔤 Letras</h1>
      </header>

      {/* Selected letter */}
      {selected && info && (
        <div className="text-center py-6 animate-bounce-in" key={selected}>
          <div className="text-8xl font-bold text-kids-blue mb-2">{selected}</div>
          <div className="text-5xl mb-2">{info.emoji}</div>
          <p className="text-2xl font-bold text-foreground">{info.word}</p>
        </div>
      )}

      {/* Alphabet grid */}
      <main className="grid grid-cols-7 gap-2 p-4 max-w-md mx-auto">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            onClick={() => speakLetter(letter)}
            className={`w-11 h-11 rounded-xl text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95 ${
              selected === letter
                ? 'bg-kids-blue text-white shadow-lg scale-110'
                : 'bg-card border-2 border-border hover:border-kids-blue text-foreground'
            }`}
          >
            {letter}
          </button>
        ))}
      </main>

      {!selected && (
        <p className="text-center text-muted-foreground font-nunito text-lg mt-4">
          Toque em uma letra para aprender! ✏️
        </p>
      )}
    </div>
  );
};
