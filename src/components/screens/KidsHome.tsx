import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface KidsHomeProps {
  onBack: () => void;
  onActivity: (activity: string) => void;
}

const activities = [
  { id: 'math', emoji: '➕', label: 'Matemática', color: 'border-kids-blue bg-[hsl(var(--kids-blue)/0.08)]', textColor: 'text-kids-blue' },
  { id: 'portuguese', emoji: '📖', label: 'Português', color: 'border-kids-green bg-[hsl(var(--kids-green)/0.08)]', textColor: 'text-kids-green' },
  { id: 'syllables', emoji: '🧩', label: 'Sílabas', color: 'border-kids-pink bg-[hsl(var(--kids-pink)/0.08)]', textColor: 'text-kids-pink' },
];

export const KidsHome = ({ onBack, onActivity }: KidsHomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-purple)/0.08)] to-background">
      <header className="flex items-center gap-4 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl text-kids-purple">📚 Kids</h1>
          <p className="text-xs text-muted-foreground font-nunito">4 a 6 anos</p>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 max-w-2xl mx-auto">
        {activities.map((act, i) => (
          <button
            key={act.id}
            onClick={() => onActivity(act.id)}
            className={`kids-card ${act.color} flex flex-col items-center justify-center py-10 animate-bounce-in`}
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
