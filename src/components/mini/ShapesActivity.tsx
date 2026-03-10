import { SHAPES, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useQuiz } from '@/hooks/useQuiz';

interface Props { onBack: () => void; }

export const ShapesActivity = ({ onBack }: Props) => {
  const { target, options, feedback, handleAnswer, next } = useQuiz({
    items: SHAPES,
    category: 'shapes',
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🔷 Formas" category="shapes" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <p className="text-2xl font-bold text-muted-foreground">Encontre o(a)</p>
        <button onClick={() => speak(target.name)} className="text-4xl md:text-6xl font-extrabold font-baloo text-primary pop"
          aria-label={`Ouvir a forma ${target.name}`}>{target.name}</button>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full" role="group" aria-label="Opções de formas">
          {options.map(idx => (
            <button key={idx} onClick={() => handleAnswer(idx)}
              className="kid-card bg-card p-8 border-primary/20 flex flex-col items-center gap-2"
              aria-label={`Forma ${SHAPES[idx].name}: ${SHAPES[idx].emoji}`}>
              <span className="text-7xl" role="img" aria-label={SHAPES[idx].name}>{SHAPES[idx].emoji}</span>
              <span className="text-lg font-bold">{SHAPES[idx].name}</span>
            </button>
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
