import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { PORTUGUESE_QUESTIONS } from '@/data/educationData';

interface Props { onBack: () => void; }

export const PortugueseActivity = ({ onBack }: Props) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = PORTUGUESE_QUESTIONS[questionIdx % PORTUGUESE_QUESTIONS.length];
  const isCorrect = selected !== null ? selected === q.correct : null;

  const next = useCallback(() => {
    setQuestionIdx((i) => i + 1);
    setSelected(null);
  }, []);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const optionColors = ['bg-kids-red', 'bg-kids-blue', 'bg-kids-green', 'bg-kids-orange'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-green)/0.06)] to-background">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl text-kids-green">📖 Português</h1>
        </div>
        <div className="flex items-center gap-1 text-kids-yellow font-bold font-nunito text-lg">
          <Star className="w-5 h-5 fill-current" />
          {score}/{questionIdx + (selected !== null ? 1 : 0)}
        </div>
      </header>

      <main className="flex flex-col items-center px-6 pt-8">
        <div className="bg-card rounded-3xl border-4 border-kids-green p-6 text-center w-full max-w-sm shadow-lg">
          <div className="text-6xl mb-4">{q.image}</div>
          <p className="text-xl font-bold text-foreground mb-6 font-nunito">
            {q.question}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              let extraClass = '';
              if (selected !== null) {
                if (i === q.correct) extraClass = 'ring-4 ring-kids-green scale-105';
                else if (i === selected) extraClass = 'opacity-50';
                else extraClass = 'opacity-30';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`${optionColors[i]} text-white rounded-2xl py-4 text-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${extraClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-6 animate-bounce-in">
              <p className="text-3xl mb-2">{isCorrect ? '🎉' : '😅'}</p>
              <p className={`text-lg font-bold ${isCorrect ? 'text-kids-green' : 'text-kids-red'}`}>
                {isCorrect ? 'Muito bem!' : `Resposta: ${q.options[q.correct]}`}
              </p>
              <Button
                onClick={next}
                className="activity-btn bg-kids-purple text-white mt-4"
              >
                Próxima →
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
