import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChildStore } from '@/store/childStore';
import { Category, MiniCategory, KidsCategory } from '@/types/education';

interface Props {
  onBack: () => void;
  onSelectCategory: (cat: Category) => void;
}

interface CategoryCard {
  id: Category;
  title: string;
  emoji: string;
  color: string;
  description: string;
}

const MINI_CATEGORIES: CategoryCard[] = [
  { id: 'colors', title: 'Cores', emoji: '🎨', color: 'border-kid-pink bg-kid-pink/10', description: 'Aprenda as cores!' },
  { id: 'animals', title: 'Animais', emoji: '🐾', color: 'border-kid-orange bg-kid-orange/10', description: 'Sons e nomes!' },
  { id: 'letters', title: 'Letras', emoji: '🔤', color: 'border-kid-blue bg-kid-blue/10', description: 'ABC completo!' },
  { id: 'numbers', title: 'Números', emoji: '🔢', color: 'border-kid-green bg-kid-green/10', description: 'Conte até 10!' },
  { id: 'shapes', title: 'Formas', emoji: '🔷', color: 'border-kid-purple bg-kid-purple/10', description: 'Formas geométricas!' },
];

const KIDS_CATEGORIES: CategoryCard[] = [
  { id: 'math', title: 'Matemática', emoji: '🧮', color: 'border-kid-blue bg-kid-blue/10', description: 'Somar e subtrair!' },
  { id: 'portuguese', title: 'Português', emoji: '📝', color: 'border-kid-pink bg-kid-pink/10', description: 'Vogais e palavras!' },
  { id: 'syllables', title: 'Sílabas', emoji: '📖', color: 'border-kid-purple bg-kid-purple/10', description: 'Monte palavras!' },
];

export const CategoryScreen = ({ onBack, onSelectCategory }: Props) => {
  const { activeChild, getTotalStars } = useChildStore();
  
  if (!activeChild) return null;

  const categories = activeChild.ageGroup === 'mini' ? MINI_CATEGORIES : KIDS_CATEGORIES;
  const totalStars = getTotalStars();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card rounded-b-3xl shadow-md">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-12 h-12">
          <ArrowLeft size={28} />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{activeChild.avatarEmoji}</span>
          <div>
            <p className="font-bold font-baloo text-lg leading-tight">{activeChild.name}</p>
            <p className="text-xs text-muted-foreground">{activeChild.ageGroup === 'mini' ? 'Modo Mini' : 'Modo Kids'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full">
          <Star size={18} className="fill-kid-yellow text-kid-yellow" />
          <span className="font-bold">{totalStars}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-bold font-baloo text-center mb-6">O que vamos aprender? 🎯</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          {categories.map(cat => {
            const progress = activeChild.progress[cat.id];
            const stars = progress?.stars || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`kid-card p-6 flex items-center gap-4 ${cat.color}`}
              >
                <span className="text-5xl">{cat.emoji}</span>
                <div className="text-left flex-1">
                  <p className="text-xl font-bold font-baloo">{cat.title}</p>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-kid-yellow text-kid-yellow" />
                    <span className="text-sm font-bold">{stars}</span>
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
