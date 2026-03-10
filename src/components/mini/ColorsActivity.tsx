import { COLORS, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useQuiz } from '@/hooks/useQuiz';
import { Volume2 } from 'lucide-react';

interface Props { onBack: () => void; }

export const ColorsActivity = ({ onBack }: Props) => {
  const { target, targetIdx, feedback, handleAnswer, next } = useQuiz({
    items: COLORS,
    category: 'colors',
    optionCount: COLORS.length,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🎨 Cores" category="colors" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-muted-foreground mb-2">Toque na cor</p>
          <button onClick={() => speak(target.name)} className="inline-flex items-center gap-2 text-4xl md:text-6xl font-extrabold font-baloo pop" style={{ color: target.hex }}
            aria-label={`Ouvir a cor ${target.name}`}>
            {target.name}
            <Volume2 size={32} className="text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-xl w-full" role="group" aria-label="Opções de cores">
          {COLORS.map((color, i) => (
            <button key={color.name} onClick={() => handleAnswer(i)}
              className="kid-card aspect-square rounded-2xl border-4 border-card shadow-lg hover:scale-110 active:scale-95 transition-transform"
              style={{ backgroundColor: color.hex }}
              aria-label={`Cor ${color.name}`}
              role="option"
              aria-selected={i === targetIdx} />
          ))}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
