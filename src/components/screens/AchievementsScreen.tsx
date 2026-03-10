import { useAppStore } from '@/store/appStore';
import { ACHIEVEMENTS } from '@/data/educationData';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityProgress } from '@/types/education';

interface Props { onBack: () => void; }

export const AchievementsScreen = ({ onBack }: Props) => {
  const { activeChildId, progress, unlockedAchievements, getTotalStars } = useAppStore();
  if (!activeChildId) return null;

  const childProgress = (progress[activeChildId] || {}) as Record<string, ActivityProgress>;
  const totalStars = getTotalStars();
  const unlocked = unlockedAchievements[activeChildId] || [];
  const unlockedCount = ACHIEVEMENTS.filter(a => unlocked.includes(a.key) || a.condition(childProgress, totalStars)).length;

  return (
    <div className="min-h-screen bg-background flex flex-col pattern-dots">
      <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-kid-yellow/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-kid-yellow/10 via-transparent to-kid-orange/10 pointer-events-none" />
        <div className="flex items-center p-4 gap-3 relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-kid-yellow/10"><ArrowLeft size={24} /></Button>
          <Trophy size={24} className="text-kid-yellow" />
          <h2 className="text-2xl font-bold font-baloo text-foreground">Medalhas</h2>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="text-center mb-6 slide-up">
          <p className="text-5xl font-extrabold font-baloo hero-gradient-text">{unlockedCount} / {ACHIEVEMENTS.length}</p>
          <p className="text-muted-foreground font-semibold">medalhas conquistadas</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
          {ACHIEVEMENTS.map((ach, i) => {
            const isUnlocked = unlocked.includes(ach.key) || ach.condition(childProgress, totalStars);
            return (
              <div
                key={ach.key}
                className={`kid-card p-4 flex flex-col items-center gap-2 text-center slide-up ${
                  isUnlocked ? 'achievement-unlocked' : 'achievement-locked'
                }`}
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                <span className={`text-4xl ${isUnlocked ? 'sparkle' : ''}`}>{ach.emoji}</span>
                <span className="text-sm font-bold text-foreground">{ach.title}</span>
                <span className="text-xs text-muted-foreground leading-tight">{ach.description}</span>
                {isUnlocked && <span className="badge-pill bg-kid-green/15 text-kid-green">✓ Conquistada!</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
