import { ArrowLeft, Star } from 'lucide-react';
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
    <div className="flex items-center justify-between p-4 bg-card rounded-b-3xl shadow-md">
      <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-12 h-12">
        <ArrowLeft size={28} />
      </Button>
      <h2 className="text-2xl md:text-3xl font-bold font-baloo text-foreground">{title}</h2>
      <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full">
        <Star size={20} className="fill-kid-yellow text-kid-yellow" />
        <span className="font-bold text-lg">{progress?.stars_earned || 0}</span>
      </div>
    </div>
  );
};
