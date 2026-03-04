import { useGameStore } from '@/store/gameStore';
import { ResourceDisplay } from './ResourceDisplay';
import { BUILDING_DEFINITIONS, UNIT_DEFINITIONS, BuildingType, UnitType } from '@/types/game';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const buildingIcons: Record<string, string> = {
  townCenter: '🏛️', house: '🏠', barracks: '⚔️', archeryRange: '🏹',
  stable: '🐎', tower: '🗼', lumberCamp: '🪵', mill: '🌾', miningCamp: '⛏️',
};

const unitIcons: Record<string, string> = {
  villager: '👷', infantry: '⚔️', archer: '🏹', cavalry: '🐎',
};

interface GameHUDProps {
  onBack: () => void;
}

export const GameHUD = ({ onBack }: GameHUDProps) => {
  const {
    gameState, selectedUnits, selectedBuilding, placementMode,
    setPlacementMode, trainUnit, resetGame,
  } = useGameStore();

  if (!gameState) return null;

  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
  if (!currentPlayer) return null;

  const eraNames = { dark: 'Era das Trevas', feudal: 'Era Feudal', castle: 'Era dos Castelos', imperial: 'Era Imperial' };

  const formatTime = (ticks: number) => {
    const totalSeconds = Math.floor(ticks / 10);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedUnitObjects = gameState.units.filter(u => selectedUnits.includes(u.id));
  const hasVillagerSelected = selectedUnitObjects.some(u => u.type === 'villager');
  const selectedBuildingObj = gameState.buildings.find(b => b.id === selectedBuilding);
  const selectedBuildingDef = selectedBuildingObj ? BUILDING_DEFINITIONS[selectedBuildingObj.type] : null;

  const handleBack = () => {
    resetGame();
    onBack();
  };

  // Victory/Defeat overlay
  if (gameState.winner) {
    const isWinner = gameState.winner === gameState.currentPlayerId;
    const winnerPlayer = gameState.players.find(p => p.id === gameState.winner);

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="game-panel p-12 text-center animate-scale-in max-w-lg">
          <div className="text-6xl mb-6">{isWinner ? '🏆' : '💀'}</div>
          <h1 className={cn(
            'game-title text-4xl mb-4',
            isWinner ? 'text-gold' : 'text-destructive'
          )}>
            {isWinner ? 'VITÓRIA!' : 'DERROTA!'}
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            {isWinner
              ? `Você conquistou o mundo como ${currentPlayer.country.name}!`
              : `${winnerPlayer?.country.name || 'O inimigo'} conquistou seu império.`
            }
          </p>
          <p className="text-muted-foreground mb-8">
            Tempo: {formatTime(gameState.gameTime)} • Unidades: {gameState.units.filter(u => u.playerId === gameState.currentPlayerId).length}
          </p>
          <Button variant="game" size="xl" onClick={handleBack}>
            Voltar ao Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="game-panel m-3 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentPlayer.country.flag}</span>
              <span className="font-cinzel text-gold text-xs">{currentPlayer.country.name}</span>
            </div>
            <ResourceDisplay resources={currentPlayer.resources} size="sm" />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border border-border/50">
              <span className="text-sm">👥</span>
              <span className="text-xs font-semibold">
                {currentPlayer.population}/{currentPlayer.maxPopulation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-gold/20 rounded text-gold-light font-cinzel text-xs">
              {eraNames[currentPlayer.era]}
            </div>
            <div className="font-mono text-muted-foreground text-xs">
              {formatTime(gameState.gameTime)}
            </div>
            <button
              onClick={handleBack}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕ Menu
            </button>
          </div>
        </div>
      </div>

      {/* Placement mode indicator */}
      {placementMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
          <div className="game-panel px-4 py-2 flex items-center gap-3 animate-fade-in">
            <span className="text-lg">{buildingIcons[placementMode]}</span>
            <span className="text-sm text-gold font-cinzel">
              Posicionando: {BUILDING_DEFINITIONS[placementMode].name}
            </span>
            <button
              onClick={() => setPlacementMode(null)}
              className="px-2 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30"
            >
              Cancelar (ESC)
            </button>
          </div>
        </div>
      )}

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="game-panel m-3 p-3">
          <div className="flex items-start gap-4">
            {/* Selection Info */}
            <div className="flex-1 min-w-0">
              {selectedUnitObjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedUnitObjects.length} unidade{selectedUnitObjects.length > 1 ? 's' : ''} selecionada{selectedUnitObjects.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedUnitObjects.slice(0, 12).map(unit => (
                      <div key={unit.id} className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs">
                        <span>{unitIcons[unit.type]}</span>
                        <span className="text-muted-foreground">{UNIT_DEFINITIONS[unit.type].name}</span>
                        <span className="text-foreground">{unit.stats.health}/{unit.stats.maxHealth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBuildingObj && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{buildingIcons[selectedBuildingObj.type]}</span>
                    <span className="font-cinzel text-gold text-sm">{BUILDING_DEFINITIONS[selectedBuildingObj.type].name}</span>
                    <span className="text-xs text-muted-foreground">
                      HP: {selectedBuildingObj.stats.health}/{selectedBuildingObj.stats.maxHealth}
                    </span>
                  </div>
                  {selectedBuildingObj.trainingQueue.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Treinando:</span>
                      {selectedBuildingObj.trainingQueue.map((item, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs">
                          <span>{unitIcons[item.unitType]}</span>
                          {i === 0 && <span className="text-gold">{Math.floor(item.progress)}%</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!selectedUnits.length && !selectedBuilding && (
                <p className="text-xs text-muted-foreground">
                  Clique para selecionar • Clique direito: mover/coletar/atacar • Scroll: zoom
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* Build panel for villagers */}
              {hasVillagerSelected && !placementMode && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 font-cinzel">Construir:</p>
                  <div className="grid grid-cols-3 gap-1">
                    {(Object.entries(BUILDING_DEFINITIONS) as [BuildingType, typeof BUILDING_DEFINITIONS[BuildingType]][]).map(([type, def]) => {
                      const canAfford =
                        currentPlayer.resources.wood >= def.cost.wood &&
                        currentPlayer.resources.food >= def.cost.food &&
                        currentPlayer.resources.gold >= def.cost.gold &&
                        currentPlayer.resources.stone >= def.cost.stone;

                      return (
                        <button
                          key={type}
                          onClick={() => setPlacementMode(type)}
                          disabled={!canAfford}
                          className={cn(
                            'flex flex-col items-center p-1.5 rounded border text-xs transition-all',
                            canAfford
                              ? 'border-border/50 bg-muted/30 hover:bg-gold/20 hover:border-gold/50 cursor-pointer'
                              : 'border-border/20 bg-muted/10 opacity-40 cursor-not-allowed'
                          )}
                          title={`${def.name}\nMadeira: ${def.cost.wood} | Comida: ${def.cost.food}\nOuro: ${def.cost.gold} | Pedra: ${def.cost.stone}`}
                        >
                          <span className="text-base">{buildingIcons[type]}</span>
                          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{def.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Train panel for buildings */}
              {selectedBuildingObj && selectedBuildingDef?.produces && !selectedBuildingObj.isConstructing && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 font-cinzel">Treinar:</p>
                  <div className="flex gap-1">
                    {selectedBuildingDef.produces.map((unitType: UnitType) => {
                      const def = UNIT_DEFINITIONS[unitType];
                      const canAfford =
                        currentPlayer.resources.wood >= def.cost.wood &&
                        currentPlayer.resources.food >= def.cost.food &&
                        currentPlayer.resources.gold >= def.cost.gold &&
                        currentPlayer.resources.stone >= def.cost.stone;
                      const hasPopSpace = currentPlayer.population + def.populationCost <= currentPlayer.maxPopulation;

                      return (
                        <button
                          key={unitType}
                          onClick={() => trainUnit(selectedBuildingObj.id, unitType)}
                          disabled={!canAfford || !hasPopSpace}
                          className={cn(
                            'flex flex-col items-center p-2 rounded border text-xs transition-all min-w-[60px]',
                            canAfford && hasPopSpace
                              ? 'border-border/50 bg-muted/30 hover:bg-gold/20 hover:border-gold/50 cursor-pointer'
                              : 'border-border/20 bg-muted/10 opacity-40 cursor-not-allowed'
                          )}
                          title={`${def.name}\nComida: ${def.cost.food} | Ouro: ${def.cost.gold}\nPop: ${def.populationCost}`}
                        >
                          <span className="text-xl">{unitIcons[unitType]}</span>
                          <span className="text-[10px] text-muted-foreground">{def.name}</span>
                          <span className="text-[9px] text-gold">{def.cost.food}F {def.cost.gold}G</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map */}
      <div className="absolute bottom-20 right-4 z-10">
        <div className="minimap w-44 h-44 overflow-hidden">
          <MiniMap />
        </div>
      </div>
    </>
  );
};

const MiniMap = () => {
  const { gameState, cameraPosition, setCameraPosition } = useGameStore();
  if (!gameState) return null;

  const mapSize = gameState.map.width;
  const viewportSize = 10;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * mapSize;
    const y = ((e.clientY - rect.top) / rect.height) * mapSize;
    setCameraPosition({ x, y });
  };

  return (
    <div className="w-full h-full relative cursor-pointer" onClick={handleClick}>
      <div className="absolute inset-0 bg-forest/50" />

      {gameState.buildings.map(building => {
        const player = gameState.players.find(p => p.id === building.playerId);
        return (
          <div
            key={building.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${(building.position.x / mapSize) * 100}%`,
              top: `${(building.position.y / mapSize) * 100}%`,
              backgroundColor: player?.color || '#666',
            }}
          />
        );
      })}

      {gameState.units.map(unit => {
        const player = gameState.players.find(p => p.id === unit.playerId);
        return (
          <div
            key={unit.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(unit.position.x / mapSize) * 100}%`,
              top: `${(unit.position.y / mapSize) * 100}%`,
              backgroundColor: player?.color || '#666',
            }}
          />
        );
      })}

      <div
        className="absolute border-2 border-gold/50 bg-gold/10"
        style={{
          left: `${(cameraPosition.x / mapSize) * 100 - (viewportSize / mapSize) * 50}%`,
          top: `${(cameraPosition.y / mapSize) * 100 - (viewportSize / mapSize) * 50}%`,
          width: `${(viewportSize / mapSize) * 100}%`,
          height: `${(viewportSize / mapSize) * 100}%`,
        }}
      />
    </div>
  );
};
