import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Star } from 'lucide-react';
import { generateMathProblem, MathProblem } from '@/data/educationData';

interface Props { onBack: () => void; }

export const MathActivity = ({ onBack }: Props) => {
  const [problem, setProblem] = useState<MathProblem>(() => generateMathProblem(10, false));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const newProblem = useCallback(() => {
    setProblem(generateMathProblem(10, total > 4));
    setAnswer('');
    setFeedback(null);
  }, [total]);

  const checkAnswer = () => {
    const num = parseInt(answer, 10);
    if (isNaN(num)) return;
    setTotal((t) => t + 1);
    if (num === problem.answer) {
      setFeedback('correct');
      setScore((s) => s + 1);
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-blue)/0.06)] to-background">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl text-kids-blue">➕ Matemática</h1>
        </div>
        <div className="flex items-center gap-1 text-kids-yellow font-bold font-nunito text-lg">
          <Star className="w-5 h-5 fill-current" />
          {score}/{total}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-6 pt-8">
        {/* Problem display */}
        <div className="bg-card rounded-3xl border-4 border-kids-blue p-8 text-center w-full max-w-sm shadow-lg">
          <p className="text-6xl font-bold text-foreground mb-6 font-bubble">
            {problem.a} {problem.operator} {problem.b} = ?
          </p>

          {feedback === null ? (
            <div className="flex flex-col items-center gap-4">
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                className="w-28 h-16 text-4xl text-center font-bold rounded-2xl border-4 border-kids-blue bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-kids-blue/30"
                autoFocus
                inputMode="numeric"
              />
              <Button
                onClick={checkAnswer}
                disabled={!answer}
                className="activity-btn bg-kids-blue text-white text-xl px-12"
              >
                Verificar
              </Button>
            </div>
          ) : (
            <div className="animate-bounce-in">
              {feedback === 'correct' ? (
                <div>
                  <p className="text-5xl mb-2">🎉</p>
                  <p className="text-2xl font-bold text-kids-green">Parabéns!</p>
                </div>
              ) : (
                <div>
                  <p className="text-5xl mb-2">😅</p>
                  <p className="text-2xl font-bold text-kids-red">
                    A resposta é {problem.answer}
                  </p>
                </div>
              )}
              <Button
                onClick={newProblem}
                className="activity-btn bg-kids-purple text-white mt-4 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Próxima
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
