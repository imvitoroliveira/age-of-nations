import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useFarmLayoutStore, PlacedItem } from '@/store/farmLayoutStore';
import { FARM_ITEMS } from '@/data/educationData';
import { ArrowLeft, Star, ShoppingBag, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { playBuy, playTap } from '@/lib/sounds';

interface Props { onBack: () => void; }

const GRID_ROWS = 6;
const GRID_COLS = 7;

// Ground type per row for visual variety
const ROW_STYLES = [
  'bg-farm-sky/20',      // sky row
  'bg-farm-sky/10',      // light sky
  'bg-farm-grass/10',    // light grass
  'bg-farm-grass/15',    // grass
  'bg-farm-grass/20',    // darker grass
  'bg-farm-dirt/15',     // dirt/path
];

export const FarmScreen = ({ onBack }: Props) => {
  const { getActiveChild, buyFarmItem, getTotalStars, activeChildId } = useAppStore();
  const { getLayout, placeItem, moveItem, removeItem, isOccupied } = useFarmLayoutStore();
  const child = getActiveChild();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [mode, setMode] = useState<'map' | 'shop'>('map');
  const [movingItem, setMovingItem] = useState<string | null>(null);

  if (!child || !activeChildId) return null;

  const ownedItems = child.farm_items;
  const stars = getTotalStars();
  const layout = getLayout(activeChildId);
  const placedKeys = layout.map(i => i.key);
  const unplacedItems = ownedItems.filter(key => !placedKeys.includes(key));

  const handleCellTap = (row: number, col: number) => {
    if (movingItem) {
      // Moving an existing item
      if (!isOccupied(activeChildId, row, col)) {
        moveItem(activeChildId, movingItem, row, col);
        setMovingItem(null);
        toast.success('Item movido!');
      } else {
        toast.error('Essa posição já está ocupada!');
      }
      return;
    }

    if (selectedItem) {
      // Placing a new item from inventory
      if (!isOccupied(activeChildId, row, col)) {
        placeItem(activeChildId, selectedItem, row, col);
        setSelectedItem(null);
        toast.success('Item colocado! 🎉');
      } else {
        toast.error('Essa posição já está ocupada!');
      }
      return;
    }

    // Tap on placed item to move
    const placed = layout.find(i => i.row === row && i.col === col);
    if (placed) {
      setMovingItem(placed.key);
      toast.info('Toque em outro lugar para mover');
    }
  };

  const handleBuy = (itemKey: string, cost: number, name: string) => {
    if (ownedItems.includes(itemKey)) {
      toast.info(`Você já tem ${name}!`);
      return;
    }
    if (buyFarmItem(itemKey, cost)) {
      playBuy();
      toast.success(`${name} comprado(a)! Agora coloque no mapa! 🎉`);
      setSelectedItem(itemKey);
      setMode('map');
    } else {
      toast.error(`Estrelas insuficientes! Precisa de ${cost} ⭐`);
    }
  };

  const handlePickUnplaced = (key: string) => {
    setSelectedItem(key);
    setMovingItem(null);
    toast.info('Toque no mapa para posicionar');
  };

  const handleRemoveFromMap = (key: string) => {
    removeItem(activeChildId, key);
    toast.info('Item removido do mapa');
  };

  const categories = ['animal', 'plant', 'building', 'decoration'] as const;
  const categoryLabels = { animal: '🐄 Animais', plant: '🌿 Plantas', building: '🏠 Construções', decoration: '✨ Decoração' };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-farm-grass/20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-farm-grass/10 via-transparent to-farm-sky/10 pointer-events-none" />
        <div className="flex items-center justify-between p-4 relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-11 h-11 hover:bg-farm-grass/10">
            <ArrowLeft size={24} />
          </Button>
          <h2 className="text-2xl font-bold font-baloo text-foreground">🏡 Fazendinha</h2>
          <div className="flex items-center gap-1.5 bg-kid-yellow/15 px-3.5 py-2 rounded-full">
            <Star size={16} className="fill-kid-yellow text-kid-yellow" />
            <span className="font-bold text-foreground">{stars}</span>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {(selectedItem || movingItem) && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-primary/10 border-2 border-primary/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span className="text-sm font-bold text-foreground">
              {movingItem
                ? `Movendo: ${FARM_ITEMS.find(f => f.key === movingItem)?.emoji} Toque no mapa`
                : `Posicionando: ${FARM_ITEMS.find(f => f.key === selectedItem)?.emoji} Toque no mapa`}
            </span>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setMovingItem(null); }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Farm Grid Map */}
      <div className="px-3 py-3">
        <div className="rounded-3xl overflow-hidden border-4 border-farm-grass/30 shadow-xl relative">
          {/* Sky background with sun & clouds */}
          <div className="absolute inset-0 bg-gradient-to-b from-farm-sky/30 via-farm-sky/10 to-farm-grass/20 pointer-events-none" />
          <div className="absolute top-2 right-4 text-3xl pulse-glow pointer-events-none">☀️</div>
          <div className="absolute top-3 left-6 text-xl float-slow opacity-50 pointer-events-none">☁️</div>
          <div className="absolute top-1 left-1/3 text-lg float-slow opacity-30 pointer-events-none" style={{ animationDelay: '1.5s' }}>☁️</div>

          {/* Grid */}
          <div className="relative z-10">
            {Array.from({ length: GRID_ROWS }).map((_, row) => (
              <div key={row} className="flex">
                {Array.from({ length: GRID_COLS }).map((_, col) => {
                  const placed = layout.find(i => i.row === row && i.col === col);
                  const item = placed ? FARM_ITEMS.find(f => f.key === placed.key) : null;
                  const isMoving = movingItem === placed?.key;
                  const canPlace = (selectedItem || movingItem) && !placed;

                  return (
                    <button
                      key={col}
                      onClick={() => handleCellTap(row, col)}
                      onDoubleClick={() => placed && handleRemoveFromMap(placed.key)}
                      className={`
                        flex-1 aspect-square flex items-center justify-center relative
                        transition-all duration-150
                        ${ROW_STYLES[row] || 'bg-farm-grass/10'}
                        ${canPlace ? 'hover:bg-primary/15 cursor-pointer' : ''}
                        ${isMoving ? 'ring-2 ring-primary ring-inset bg-primary/20 animate-pulse' : ''}
                        ${placed && !isMoving ? 'hover:bg-kid-yellow/10 cursor-grab' : ''}
                        ${!placed && !canPlace ? 'cursor-default' : ''}
                        border-[0.5px] border-foreground/[0.03]
                      `}
                      aria-label={item ? `${item.name} na posição ${row + 1},${col + 1}` : `Célula vazia ${row + 1},${col + 1}`}
                    >
                      {item && (
                        <span className={`text-2xl md:text-3xl ${isMoving ? 'opacity-50' : 'drop-shadow-sm'} transition-all`}>
                          {item.emoji}
                        </span>
                      )}
                      {canPlace && !placed && (
                        <span className="absolute inset-0 flex items-center justify-center text-primary/20 text-lg">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unplaced inventory */}
      {unplacedItems.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">Itens sem posição — toque para colocar</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {unplacedItems.map(key => {
              const item = FARM_ITEMS.find(f => f.key === key);
              if (!item) return null;
              return (
                <button
                  key={key}
                  onClick={() => handlePickUnplaced(key)}
                  className={`flex-shrink-0 kid-card bg-card px-3 py-2 flex items-center gap-1.5 ${
                    selectedItem === key ? 'border-primary ring-2 ring-primary/30' : 'border-muted/30'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center px-4 py-2">
        <button
          onClick={() => setMode('map')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            mode === 'map'
              ? 'bg-farm-grass/20 text-foreground border-2 border-farm-grass/40'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <MapPin size={14} /> Mapa
        </button>
        <button
          onClick={() => setMode('shop')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            mode === 'shop'
              ? 'bg-kid-yellow/15 text-foreground border-2 border-kid-yellow/40'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <ShoppingBag size={14} /> Loja
        </button>
      </div>

      {/* Shop (collapsible) */}
      {mode === 'shop' && (
        <div className="flex-1 p-4 pb-8 slide-up">
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
                    <button
                      key={item.key}
                      onClick={() => handleBuy(item.key, item.cost, item.name)}
                      disabled={owned}
                      className={`kid-card bg-card p-3 flex flex-col items-center gap-1.5 ${
                        owned
                          ? 'border-kid-green/30 bg-kid-green/5 opacity-70'
                          : stars >= item.cost
                            ? 'border-primary/20 hover:border-primary/40'
                            : 'border-muted/40 opacity-50'
                      }`}
                      aria-label={`${item.name}, custa ${item.cost} estrelas${owned ? ', já comprado' : ''}`}
                    >
                      <span className="text-3xl transition-transform">{item.emoji}</span>
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
      )}

      {/* Hint */}
      <div className="text-center px-4 pb-4">
        <p className="text-[11px] text-muted-foreground/60 font-semibold">
          Toque num item para mover • Toque duplo para remover do mapa
        </p>
      </div>
    </div>
  );
};
