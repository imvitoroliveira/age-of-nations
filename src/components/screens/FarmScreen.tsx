import { useAppStore } from '@/store/appStore';
import { FARM_ITEMS } from '@/data/educationData';
import { ArrowLeft, Star } from 'lucide-react';
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
      <div className="flex items-center justify-between p-4 bg-card rounded-b-3xl shadow-md">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-12 h-12"><ArrowLeft size={28} /></Button>
        <h2 className="text-2xl font-bold font-baloo">🏡 Fazendinha</h2>
        <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full">
          <Star size={18} className="fill-kid-yellow text-kid-yellow" />
          <span className="font-bold">{stars}</span>
        </div>
      </div>

      {/* Farm view */}
      <div className="farm-bg p-6 min-h-[200px] flex flex-wrap items-end justify-center gap-4">
        {ownedItems.length === 0 ? (
          <p className="text-xl font-bold text-foreground/70 self-center">Sua fazendinha está vazia! Compre itens abaixo 👇</p>
        ) : (
          ownedItems.map((key, i) => {
            const item = FARM_ITEMS.find(f => f.key === key);
            return item ? (
              <span key={i} className="text-5xl float-slow" style={{ animationDelay: `${i * 0.3}s` }}>{item.emoji}</span>
            ) : null;
          })
        )}
      </div>

      {/* Shop */}
      <div className="flex-1 p-4">
        <h3 className="text-2xl font-bold font-baloo text-center mb-4">🛒 Loja da Fazenda</h3>
        {categories.map(cat => (
          <div key={cat} className="mb-6">
            <h4 className="text-lg font-bold mb-2">{categoryLabels[cat]}</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {FARM_ITEMS.filter(i => i.category === cat).map(item => {
                const owned = ownedItems.includes(item.key);
                return (
                  <button key={item.key} onClick={() => handleBuy(item.key, item.cost, item.name)}
                    disabled={owned}
                    className={`kid-card bg-card p-3 flex flex-col items-center gap-1 ${owned ? 'opacity-50 border-kid-green/30' : 'border-muted'}`}>
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-bold">{item.name}</span>
                    {owned ? (
                      <span className="text-xs text-kid-green font-bold">✓</span>
                    ) : (
                      <span className="text-xs font-bold flex items-center gap-0.5">
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
