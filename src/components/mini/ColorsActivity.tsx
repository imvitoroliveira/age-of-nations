import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { COLORS } from '@/data/educationData';

interface Props { onBack: () => void; }

export const ColorsActivity = ({ onBack }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-red)/0.06)] to-background">
      <header className="flex items-center gap-4 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl text-kids-red">🎨 Cores</h1>
      </header>

      {/* Selected color detail */}
      {selected !== null && (
        <div className="text-center py-6 animate-bounce-in" key={selected}>
          <div
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-card shadow-lg"
            style={{ backgroundColor: COLORS[selected].hex }}
          />
          <p className="text-3xl font-bold" style={{ color: COLORS[selected].hex }}>
            {COLORS[selected].name}
          </p>
          <p className="text-5xl mt-2">{COLORS[selected].emoji}</p>
        </div>
      )}

      {/* Color grid */}
      <main className="grid grid-cols-5 gap-4 p-6 max-w-md mx-auto">
        {COLORS.map((color, i) => (
          <button
            key={color.name}
            onClick={() => setSelected(i)}
            className={`w-14 h-14 rounded-2xl border-4 transition-all duration-200 hover:scale-110 active:scale-95 ${
              selected === i ? 'border-foreground scale-110 shadow-lg' : 'border-transparent'
            }`}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
          />
        ))}
      </main>

      {selected === null && (
        <p className="text-center text-muted-foreground font-nunito text-lg mt-8">
          Toque em uma cor para aprender! 👆
        </p>
      )}
    </div>
  );
};
