import { useState, useCallback } from 'react';
import { generateMathProblem } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIMathProblem {
  story: string;
  question: string;
  a: number;
  b: number;
  operator: string;
  answer: number;
  options: number[];
  emoji: string;
}

interface Props { onBack: () => void; }

export const MathActivity = ({ onBack }: Props) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [problem, setProblem] = useState(() => generateMathProblem('easy'));
  const [aiProblem, setAiProblem] = useState<AIMathProblem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const { recordActivity, children, activeChildId } = useAppStore();

  const activeChild = children.find(c => c.id === activeChildId);

  const fetchAIProblem = async () => {
    setIsLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-math', {
        body: {
          difficulty,
          age: activeChild?.age || 5,
          childName: activeChild?.name || '',
        },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.error === 'rate_limit') {
          toast.error('Muitas requisições, tente novamente em breve');
        } else if (data.error === 'payment_required') {
          toast.error('Créditos insuficientes para IA');
        }
        throw new Error(data.error);
      }

      setAiProblem(data as AIMathProblem);
    } catch (e) {
      console.error('AI problem generation failed, using fallback:', e);
      setAiProblem(null);
      setProblem(generateMathProblem(difficulty));
    } finally {
      setIsLoadingAI(false);
    }
  };

  const currentAnswer = aiProblem ? aiProblem.answer : problem.answer;
  const currentOptions = aiProblem ? aiProblem.options : problem.options;

  const handleAnswer = (val: number) => {
    const correct = val === currentAnswer;
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
    setAiProblem(null);
    if (useAI) {
      fetchAIProblem();
    } else {
      setProblem(generateMathProblem(difficulty));
    }
  }, [difficulty, useAI]);

  const toggleAI = () => {
    const newVal = !useAI;
    setUseAI(newVal);
    if (newVal) {
      fetchAIProblem();
    } else {
      setAiProblem(null);
      setProblem(generateMathProblem(difficulty));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🧮 Matemática" category="math" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Difficulty + AI toggle */}
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <div className="flex gap-2 items-center">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <span key={d} className={`px-3 py-1 rounded-full text-sm font-bold ${d === difficulty ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {d === 'easy' ? '⭐' : d === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
              </span>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">🔥 {streak}</span>
          </div>
          <button
            onClick={toggleAI}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              useAI
                ? 'bg-gradient-to-r from-kid-purple to-kid-blue text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Sparkles size={14} />
            {useAI ? 'IA Ativada ✨' : 'Ativar IA'}
          </button>
        </div>

        {/* Problem display */}
        {isLoadingAI ? (
          <div className="bg-card rounded-3xl p-8 shadow-xl border-4 border-primary/20 flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground">A IA está criando um problema especial... ✨</p>
          </div>
        ) : aiProblem ? (
          <div className="bg-card rounded-3xl p-6 shadow-xl border-4 border-kid-purple/30 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{aiProblem.emoji}</span>
              <p className="text-sm font-semibold text-muted-foreground">{aiProblem.story}</p>
            </div>
            <p className="text-4xl md:text-5xl font-extrabold font-baloo text-center text-foreground my-4">
              {aiProblem.a} {aiProblem.operator} {aiProblem.b} = ?
            </p>
            <p className="text-center text-sm font-bold text-kid-purple">{aiProblem.question}</p>
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-8 shadow-xl border-4 border-primary/20">
            <p className="text-6xl md:text-8xl font-extrabold font-baloo text-center text-foreground">
              {problem.a} {problem.operator} {problem.b} = ?
            </p>
          </div>
        )}

        {/* Options */}
        {!isLoadingAI && (
          <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
            {currentOptions.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} className="kid-card bg-card p-6 border-secondary/30">
                <span className="text-4xl font-extrabold font-baloo text-secondary">{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
