import { useAppStore } from '@/store/appStore';
import { FARM_ITEMS } from '@/data/educationData';
import { ArrowLeft, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props { onBack: () => void; }

export const FarmScreen = ({ onBack }: Props) => {
  const { getActiveChild, buyFarmItem, getTotalStars } = useAppStore();
  const child = getActiveChild();
  if (!child) return null;

  const ownedItems = child.farm_items;
  const stars = getTotalStars();

  const handleBuy = (itemKey: string, cost: number, name: string) => {
    if (ownedItems.includes(itemKey)) { toast.info(`Você já tem ${name}!`); return; }
    if (buyFarmItem(itemKey, cost)) {
      toast.success(`${name} comprado(a)! 🎉`);
    } else {
      toast.error(`Estrelas insuficientes! Precisa de ${cost} ⭐`);
    }
  };

  const categories = ['animal', 'plant', 'building', 'decoration'] as const;
  const categoryLabels = { animal: '🐄 Animais', plant: '🌿 Plantas', building: '🏠 Construções', decoration: '✨ Decoração' };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-farm-grass/20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-farm-grass/10 via-transparent to-farm-sky/10 pointer-events-none" />
        <div className="flex items-center justify-between p-4 relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-11 h-11 hover:bg-farm-grass/10"><ArrowLeft size={24} /></Button>
          <h2 className="text-2xl font-bold font-baloo text-foreground">🏡 Fazendinha</h2>
          <div className="flex items-center gap-1.5 bg-kid-yellow/15 px-3.5 py-2 rounded-full">
            <Star size={16} className="fill-kid-yellow text-kid-yellow" />
            <span className="font-bold text-foreground">{stars}</span>
          </div>
        </div>
      </div>

      {/* Farm view */}
      <div className="farm-bg p-6 min-h-[220px] flex flex-wrap items-end justify-center gap-5 relative">
        {/* Sun */}
        <div className="absolute top-4 right-6 text-5xl pulse-glow">☀️</div>
        {/* Clouds */}
        <div className="absolute top-6 left-8 text-3xl float-slow opacity-60">☁️</div>
        <div className="absolute top-3 left-1/3 text-2xl float-slow opacity-40" style={{ animationDelay: '1s' }}>☁️</div>
        
        {ownedItems.length === 0 ? (
          <p className="text-lg font-bold text-foreground/60 self-center bg-card/60 backdrop-blur-sm px-4 py-2 rounded-2xl">
            Sua fazendinha está vazia! 👇
          </p>
        ) : (
          ownedItems.map((key, i) => {
            const item = FARM_ITEMS.find(f => f.key === key);
            return item ? (
              <span key={i} className="text-5xl md:text-6xl float-medium cursor-default" style={{ animationDelay: `${i * 0.3}s` }}>
                {item.emoji}
              </span>
            ) : null;
          })
        )}
      </div>

      {/* Shop */}
      <div className="flex-1 p-4 pb-8">
        <div className="flex items-center gap-2 justify-center mb-5">
          <ShoppingBag size={22} className="text-primary" />
          <h3 className="text-2xl font-bold font-baloo text-foreground">Loja da Fazenda</h3>
        </div>
        {categories.map(cat => (
          <div key={cat} className="mb-5">
            <h4 className="text-base font-bold mb-2.5 text-muted-foreground">{categoryLabels[cat]}</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {FARM_ITEMS.filter(i => i.category === cat).map(item => {
                const owned = ownedItems.includes(item.key);
                return (
                  <button key={item.key} onClick={() => handleBuy(item.key, item.cost, item.name)}
                    disabled={owned}
                    className={`kid-card bg-card p-3 flex flex-col items-center gap-1.5 ${
                      owned
                        ? 'border-kid-green/30 bg-kid-green/5 opacity-70'
                        : stars >= item.cost
                          ? 'border-primary/20 hover:border-primary/40'
                          : 'border-muted/40 opacity-50'
                    }`}>
                    <span className={`text-3xl ${owned ? '' : 'group-hover:scale-110'} transition-transform`}>{item.emoji}</span>
                    <span className="text-xs font-bold text-foreground">{item.name}</span>
                    {owned ? (
                      <span className="badge-pill bg-kid-green/15 text-kid-green">✓</span>
                    ) : (
                      <span className="badge-pill bg-kid-yellow/15 text-foreground">
                        <Star size={10} className="fill-kid-yellow text-kid-yellow" /> {item.cost}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
