import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, RefreshCw } from 'lucide-react';
import { SYLLABLE_WORDS } from '@/data/educationData';

interface Props { onBack: () => void; }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const SyllablesActivity = ({ onBack }: Props) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const word = SYLLABLE_WORDS[wordIdx % SYLLABLE_WORDS.length];

  const shuffledSyllables = useMemo(
    () => shuffle(word.syllables),
    [wordIdx]
  );

  const handleTap = (syl: string) => {
    if (done) return;
    const expectedIdx = placed.length;
    if (syl === word.syllables[expectedIdx]) {
      const newPlaced = [...placed, syl];
      setPlaced(newPlaced);
      if (newPlaced.length === word.syllables.length) {
        setDone(true);
        setScore((s) => s + 1);
      }
    }
  };

  const next = useCallback(() => {
    setWordIdx((i) => i + 1);
    setPlaced([]);
    setDone(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-pink)/0.06)] to-background">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl text-kids-pink">🧩 Sílabas</h1>
        </div>
        <div className="flex items-center gap-1 text-kids-yellow font-bold font-nunito text-lg">
          <Star className="w-5 h-5 fill-current" />
          {score}
        </div>
      </header>

      <main className="flex flex-col items-center px-6 pt-8">
        <div className="bg-card rounded-3xl border-4 border-kids-pink p-8 text-center w-full max-w-sm shadow-lg">
          {/* Emoji hint */}
          <div className="text-7xl mb-4">{word.emoji}</div>

          {/* Slots */}
          <div className="flex justify-center gap-2 mb-8">
            {word.syllables.map((syl, i) => (
              <div
                key={i}
                className={`w-20 h-16 rounded-xl border-4 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  placed[i]
                    ? 'border-kids-green bg-[hsl(var(--kids-green)/0.1)] text-kids-green animate-bounce-in'
                    : 'border-dashed border-kids-pink/40 text-muted-foreground'
                }`}
              >
                {placed[i] || '?'}
              </div>
            ))}
          </div>

          {/* Syllable options */}
          {!done && (
            <div className="flex justify-center gap-3 flex-wrap">
              {shuffledSyllables.map((syl, i) => {
                const isPlaced = placed.includes(syl);
                return (
                  <button
                    key={`${syl}-${i}`}
                    onClick={() => handleTap(syl)}
                    disabled={isPlaced}
                    className={`px-6 py-3 rounded-xl text-xl font-bold transition-all duration-200 ${
                      isPlaced
                        ? 'opacity-30 bg-muted text-muted-foreground'
                        : 'bg-kids-pink text-white hover:scale-110 active:scale-95 shadow-md'
                    }`}
                  >
                    {syl}
                  </button>
                );
              })}
            </div>
          )}

          {done && (
            <div className="animate-bounce-in">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-2xl font-bold text-kids-green mb-1">{word.word}!</p>
              <p className="text-muted-foreground font-nunito mb-4">Muito bem!</p>
              <Button onClick={next} className="activity-btn bg-kids-purple text-white inline-flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Próxima palavra
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
