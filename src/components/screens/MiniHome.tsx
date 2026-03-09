import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface MiniHomeProps {
  onBack: () => void;
  onActivity: (activity: string) => void;
}

const activities = [
  { id: 'colors', emoji: '🎨', label: 'Cores', color: 'border-kids-red bg-[hsl(var(--kids-red)/0.08)]', textColor: 'text-kids-red' },
  { id: 'animals', emoji: '🐶', label: 'Animais', color: 'border-kids-green bg-[hsl(var(--kids-green)/0.08)]', textColor: 'text-kids-green' },
  { id: 'letters', emoji: '🔤', label: 'Letras', color: 'border-kids-blue bg-[hsl(var(--kids-blue)/0.08)]', textColor: 'text-kids-blue' },
  { id: 'numbers', emoji: '🔢', label: 'Números', color: 'border-kids-orange bg-[hsl(var(--kids-orange)/0.08)]', textColor: 'text-kids-orange' },
];

export const MiniHome = ({ onBack, onActivity }: MiniHomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-orange)/0.08)] to-background">
      <header className="flex items-center gap-4 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl text-kids-orange">🧸 Mini</h1>
          <p className="text-xs text-muted-foreground font-nunito">1 a 3 anos</p>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-5 p-6 max-w-lg mx-auto">
        {activities.map((act, i) => (
          <button
            key={act.id}
            onClick={() => onActivity(act.id)}
            className={`kids-card ${act.color} flex flex-col items-center justify-center py-8 animate-bounce-in`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="text-5xl mb-3">{act.emoji}</span>
            <span className={`text-lg font-bold ${act.textColor}`}>{act.label}</span>
          </button>
        ))}
      </main>
    </div>
  );
};
