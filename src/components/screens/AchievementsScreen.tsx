import { useAppStore } from '@/store/appStore';
import { ACHIEVEMENTS } from '@/data/educationData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityProgress } from '@/types/education';

interface Props { onBack: () => void; }

export const AchievementsScreen = ({ onBack }: Props) => {
  const { activeChildId, progress, unlockedAchievements, getTotalStars } = useAppStore();
  if (!activeChildId) return null;

  const childProgress = (progress[activeChildId] || {}) as Record<string, ActivityProgress>;
  const totalStars = getTotalStars();
  const unlocked = unlockedAchievements[activeChildId] || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4 gap-2 bg-card rounded-b-3xl shadow-md">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full"><ArrowLeft size={28} /></Button>
        <h2 className="text-2xl font-bold font-baloo">🏆 Medalhas</h2>
      </div>

      <div className="flex-1 p-4">
        <div className="text-center mb-6">
          <p className="text-4xl font-bold font-baloo">{unlocked.length} / {ACHIEVEMENTS.length}</p>
          <p className="text-muted-foreground">medalhas conquistadas</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.key) || ach.condition(childProgress, totalStars);
            return (
              <div key={ach.key}
                className={`kid-card p-4 flex flex-col items-center gap-2 text-center ${
                  isUnlocked ? 'bg-kid-yellow/10 border-kid-yellow/40' : 'bg-muted/30 border-muted opacity-60'
                }`}>
                <span className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>{ach.emoji}</span>
                <span className="text-sm font-bold">{ach.title}</span>
                <span className="text-xs text-muted-foreground">{ach.description}</span>
                {isUnlocked && <span className="text-xs text-kid-green font-bold">✓ Conquistada!</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
