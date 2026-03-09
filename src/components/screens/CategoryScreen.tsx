import { ArrowLeft, Star, Sparkles } from 'lucide-react';
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

export const CategoryScreen = ({ onBack, onSelectCategory, onFarm, onAchievements }: Props) => {
  const { getActiveChild, getTotalStars, activeChildId, getProgress } = useAppStore();
  const child = getActiveChild();
  if (!child) return null;

  const categories: Category[] = child.age_group === 'mini'
    ? ['colors', 'animals', 'letters', 'numbers', 'shapes']
    : ['math', 'portuguese', 'syllables'];

  const totalStars = getTotalStars();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 bg-card rounded-b-3xl shadow-md">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-12 h-12"><ArrowLeft size={28} /></Button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{child.avatar_emoji}</span>
          <div>
            <p className="font-bold font-baloo text-lg leading-tight">{child.name}</p>
            <p className="text-xs text-muted-foreground">{child.age_group === 'mini' ? "Enzo's" : "Valentina's"} • Nível {child.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full">
          <Star size={18} className="fill-kid-yellow text-kid-yellow" />
          <span className="font-bold">{totalStars}</span>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Quick actions */}
        <div className="flex gap-3 justify-center mb-6">
          <button onClick={onFarm} className="kid-card bg-farm-grass/20 px-4 py-3 border-farm-grass/40 flex items-center gap-2">
            <span className="text-2xl">🏡</span>
            <span className="font-bold text-sm">Fazendinha</span>
          </button>
          <button onClick={onAchievements} className="kid-card bg-kid-yellow/10 px-4 py-3 border-kid-yellow/40 flex items-center gap-2">
            <Sparkles size={20} className="text-kid-yellow" />
            <span className="font-bold text-sm">Medalhas</span>
          </button>
        </div>

        <h2 className="text-3xl font-bold font-baloo text-center mb-6">O que vamos aprender? 🎯</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          {categories.map(cat => {
            const meta = CATEGORY_META[cat];
            const progress = activeChildId ? getProgress(activeChildId, cat) : null;
            return (
              <button key={cat} onClick={() => onSelectCategory(cat)} className={`kid-card p-6 flex items-center gap-4 ${meta.color}`}>
                <span className="text-5xl">{meta.emoji}</span>
                <div className="text-left flex-1">
                  <p className="text-xl font-bold font-baloo">{meta.title}</p>
                  <p className="text-sm text-muted-foreground">{meta.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-kid-yellow text-kid-yellow" />
                    <span className="text-sm font-bold">{progress?.stars_earned || 0}</span>
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
