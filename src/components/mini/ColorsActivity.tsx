import { useState, useCallback } from 'react';
import { COLORS } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useChildStore } from '@/store/childStore';
import { Volume2 } from 'lucide-react';

interface Props { onBack: () => void; }

export const ColorsActivity = ({ onBack }: Props) => {
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * COLORS.length));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { recordActivity } = useChildStore();
  const target = COLORS[targetIdx];

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  const handleTap = (idx: number) => {
    const correct = idx === targetIdx;
    setFeedback(correct ? 'correct' : 'wrong');
    recordActivity('colors', correct);
    if (correct) speak('Muito bem!');
  };

  const next = useCallback(() => {
    setFeedback(null);
    setTargetIdx(Math.floor(Math.random() * COLORS.length));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="🎨 Cores" category="colors" onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-muted-foreground mb-2">Toque na cor</p>
          <button
            onClick={() => speak(target.name)}
            className="inline-flex items-center gap-2 text-4xl md:text-6xl font-extrabold font-baloo pop"
            style={{ color: target.hex }}
          >
            {target.name}
            <Volume2 size={32} className="text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-xl w-full">
          {COLORS.map((color, i) => (
            <button
              key={color.name}
              onClick={() => handleTap(i)}
              className="kid-card aspect-square rounded-2xl border-4 border-card shadow-lg hover:scale-110 active:scale-95 transition-transform"
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
