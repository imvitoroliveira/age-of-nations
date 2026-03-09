import { useState, useCallback } from 'react';
import { generateMathProblem } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useAppStore } from '@/store/appStore';

interface Props { onBack: () => void; }

export const MathActivity = ({ onBack }: Props) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [problem, setProblem] = useState(() => generateMathProblem('easy'));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const { recordActivity } = useAppStore();

  const handleAnswer = (val: number) => {
    const correct = val === problem.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity('math', correct);
    if (correct) {
      const s = streak + 1;
      setStreak(s);
      if (s >= 5 && difficulty === 'easy') setDifficulty('medium');
      else if (s >= 10 && difficulty === 'medium') setDifficulty('hard');
    } else setStreak(0);
  };

  const next = useCallback(() => {
    setFeedback(null);
    setProblem(generateMathProblem(difficulty));
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🧮 Matemática" category="math" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <div className="flex gap-2 items-center">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <span key={d} className={`px-3 py-1 rounded-full text-sm font-bold ${d === difficulty ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {d === 'easy' ? '⭐' : d === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
            </span>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">🔥 {streak}</span>
        </div>
        <div className="bg-card rounded-3xl p-8 shadow-xl border-4 border-primary/20">
          <p className="text-6xl md:text-8xl font-extrabold font-baloo text-center text-foreground">{problem.a} {problem.operator} {problem.b} = ?</p>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
          {problem.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)} className="kid-card bg-card p-6 border-secondary/30">
              <span className="text-4xl font-extrabold font-baloo text-secondary">{opt}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
