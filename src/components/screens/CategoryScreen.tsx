import { ArrowLeft, Star, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Category } from '@/types/education';
import { CATEGORY_META } from '@/data/educationData';

interface Props {
  onBack: () => void;
  onSelectCategory: (cat: Category) => void;
  onFarm: () => void;
  onAchievements: () => void;
}

const categoryColors: Record<string, string> = {
  colors: 'from-kid-pink/20 to-kid-pink/5 border-kid-pink/30',
  animals: 'from-kid-orange/20 to-kid-orange/5 border-kid-orange/30',
  letters: 'from-kid-blue/20 to-kid-blue/5 border-kid-blue/30',
  numbers: 'from-kid-green/20 to-kid-green/5 border-kid-green/30',
  shapes: 'from-kid-purple/20 to-kid-purple/5 border-kid-purple/30',
  math: 'from-kid-blue/20 to-kid-teal/5 border-kid-blue/30',
  portuguese: 'from-kid-pink/20 to-kid-purple/5 border-kid-pink/30',
  syllables: 'from-kid-purple/20 to-kid-pink/5 border-kid-purple/30',
};

export const CategoryScreen = ({ onBack, onSelectCategory, onFarm, onAchievements }: Props) => {
  const { getActiveChild, getTotalStars, activeChildId, getProgress } = useAppStore();
  const child = getActiveChild();
  if (!child) return null;

  const categories: Category[] = child.age_group === 'mini'
    ? ['colors', 'animals', 'letters', 'numbers', 'shapes']
    : ['math', 'portuguese', 'syllables'];

  const totalStars = getTotalStars();

  return (
    <div className="min-h-screen bg-background flex flex-col pattern-dots">
      {/* Header */}
      <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-kid-pink/5 pointer-events-none" />
        <div className="flex items-center justify-between p-4 relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-11 h-11 hover:bg-primary/10">
            <ArrowLeft size={24} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl float-medium">{child.avatar_emoji}</span>
            </div>
            <div>
              <p className="font-bold font-baloo text-lg leading-tight text-foreground">{child.name}</p>
              <p className="text-xs text-muted-foreground font-semibold">
                {child.age_group === 'mini' ? "Enzo's" : "Valentina's"} • Nível {child.level}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-kid-yellow/15 px-3.5 py-2 rounded-full">
            <Star size={16} className="fill-kid-yellow text-kid-yellow pulse-glow" />
            <span className="font-bold text-foreground">{totalStars}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Quick actions */}
        <div className="flex gap-3 justify-center mb-6 mt-2">
          <button onClick={onFarm} className="kid-card bg-gradient-to-br from-farm-grass/20 to-farm-grass/5 px-5 py-3 border-farm-grass/30 flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🏡</span>
            <span className="font-bold text-sm text-foreground">Fazendinha</span>
          </button>
          <button onClick={onAchievements} className="kid-card bg-gradient-to-br from-kid-yellow/15 to-kid-orange/5 px-5 py-3 border-kid-yellow/30 flex items-center gap-2.5 group">
            <Trophy size={20} className="text-kid-yellow group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm text-foreground">Medalhas</span>
          </button>
        </div>

        <h2 className="text-3xl font-bold font-baloo text-center mb-5 text-foreground">
          O que vamos aprender? 🎯
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          {categories.map((cat, i) => {
            const meta = CATEGORY_META[cat];
            const progress = activeChildId ? getProgress(activeChildId, cat) : null;
            const gradientClass = categoryColors[cat] || 'from-muted/20 to-muted/5 border-muted/30';
            
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`kid-card bg-gradient-to-br ${gradientClass} p-5 flex items-center gap-4 slide-up group`}
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
              >
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{meta.emoji}</span>
                <div className="text-left flex-1">
                  <p className="text-xl font-bold font-baloo text-foreground">{meta.title}</p>
                  <p className="text-sm text-muted-foreground">{meta.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star size={13} className="fill-kid-yellow text-kid-yellow" />
                    <span className="text-sm font-bold text-foreground">{progress?.stars_earned || 0}</span>
                    {(progress?.best_streak || 0) >= 3 && (
                      <span className="badge-pill bg-kid-orange/15 text-kid-orange text-[10px] ml-1">🔥 {progress?.best_streak}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
