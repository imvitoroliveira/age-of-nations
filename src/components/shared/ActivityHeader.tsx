import { ArrowLeft, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Category } from '@/types/education';

interface ActivityHeaderProps {
  title: string;
  category: Category;
  onBack: () => void;
}

export const ActivityHeader = ({ title, category, onBack }: ActivityHeaderProps) => {
  const { activeChildId, getProgress } = useAppStore();
  const progress = activeChildId ? getProgress(activeChildId, category) : null;

  return (
    <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-primary/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-kid-pink/5 pointer-events-none" />
      <div className="flex items-center justify-between p-4 relative z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-11 h-11 hover:bg-primary/10">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold font-baloo text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {(progress?.streak || 0) >= 2 && (
            <div className="flex items-center gap-0.5 bg-kid-orange/15 px-2 py-1 rounded-full">
              <Zap size={12} className="text-kid-orange fill-kid-orange" />
              <span className="text-xs font-bold text-kid-orange">{progress?.streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-kid-yellow/15 px-3 py-1.5 rounded-full">
            <Star size={16} className="fill-kid-yellow text-kid-yellow" />
            <span className="font-bold text-foreground">{progress?.stars_earned || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
