import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NUMBERS, NUMBER_ITEMS } from '@/data/educationData';

interface Props { onBack: () => void; }

export const NumbersActivity = ({ onBack }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (n: number) => {
    setSelected(n);
    if ('speechSynthesis' in window) {
      const info = NUMBER_ITEMS[n];
      const utterance = new SpeechSynthesisUtterance(info.word);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const info = selected !== null ? NUMBER_ITEMS[selected] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-orange)/0.06)] to-background">
      <header className="flex items-center gap-4 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl text-kids-orange">🔢 Números</h1>
      </header>

      {/* Selected number */}
      {selected !== null && info && (
        <div className="text-center py-6 animate-bounce-in" key={selected}>
          <div className="text-8xl font-bold text-kids-orange mb-2">{selected}</div>
          <p className="text-2xl font-bold text-foreground mb-4">{info.word}</p>
          <div className="flex justify-center gap-2 flex-wrap max-w-xs mx-auto">
            {Array.from({ length: info.count }).map((_, i) => (
              <span key={i} className="text-3xl animate-bounce-in" style={{ animationDelay: `${i * 0.08}s` }}>
                {info.emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Number grid */}
      <main className="grid grid-cols-5 gap-3 p-6 max-w-sm mx-auto">
        {NUMBERS.map((n) => (
          <button
            key={n}
            onClick={() => handleSelect(n)}
            className={`w-14 h-14 rounded-2xl text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 ${
              selected === n
                ? 'bg-kids-orange text-white shadow-lg scale-110'
                : 'bg-card border-2 border-border hover:border-kids-orange text-foreground'
            }`}
          >
            {n}
          </button>
        ))}
      </main>

      {selected === null && (
        <p className="text-center text-muted-foreground font-nunito text-lg mt-4">
          Toque em um número para aprender! 🔢
        </p>
      )}
    </div>
  );
};
