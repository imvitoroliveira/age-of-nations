import { useGameStore } from '@/store/gameStore';
import { ResourceDisplay } from './ResourceDisplay';
import { cn } from '@/lib/utils';

export const GameHUD = () => {
  const { gameState, selectedUnits, selectedBuilding } = useGameStore();

  if (!gameState) return null;

  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
  if (!currentPlayer) return null;

  const eraNames = {
    dark: 'Era das Trevas',
    feudal: 'Era Feudal',
    castle: 'Era dos Castelos',
    imperial: 'Era Imperial',
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Top HUD - Resources */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="game-panel m-4 p-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Country Flag */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentPlayer.country.flag}</span>
              <span className="font-cinzel text-gold text-sm">{currentPlayer.country.name}</span>
            </div>

            {/* Resources */}
            <ResourceDisplay resources={currentPlayer.resources} size="sm" />

            {/* Population */}
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-md border border-border/50">
              <span className="text-base">👥</span>
              <span className="text-sm font-semibold">
                {currentPlayer.population}/{currentPlayer.maxPopulation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Era */}
            <div className="px-3 py-1 bg-gold/20 rounded text-gold-light font-cinzel text-sm">
              {eraNames[currentPlayer.era]}
            </div>

            {/* Game Time */}
            <div className="font-mono text-muted-foreground text-sm">
              {formatTime(gameState.gameTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD - Selection Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="game-panel m-4 p-4">
          <div className="flex items-center gap-6">
            {/* Selected Units/Building Info */}
            <div className="flex-1">
              {selectedUnits.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {selectedUnits.length === 1 ? '👷' : `👷 x${selectedUnits.length}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedUnits.length === 1 ? 'Unidade selecionada' : 'Unidades selecionadas'}
                    </span>
                  </div>
                </div>
              )}

              {!selectedUnits.length && !selectedBuilding && (
                <p className="text-sm text-muted-foreground">
                  Clique para selecionar unidades • Clique direito para mover
                </p>
              )}
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">
                WASD ou Setas: Mover câmera • Scroll: Zoom
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map */}
      <div className="absolute bottom-24 right-4 z-10">
        <div className="minimap w-48 h-48 overflow-hidden">
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
    <div
      className="w-full h-full relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Simple minimap visualization */}
      <div className="absolute inset-0 bg-forest/50" />

      {/* Buildings */}
      {gameState.buildings.map(building => {
        const player = gameState.players.find(p => p.id === building.playerId);
        const x = (building.position.x / mapSize) * 100;
        const y = (building.position.y / mapSize) * 100;
        return (
          <div
            key={building.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: player?.color || '#666',
            }}
          />
        );
      })}

      {/* Units */}
      {gameState.units.map(unit => {
        const player = gameState.players.find(p => p.id === unit.playerId);
        const x = (unit.position.x / mapSize) * 100;
        const y = (unit.position.y / mapSize) * 100;
        return (
          <div
            key={unit.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: player?.color || '#666',
            }}
          />
        );
      })}

      {/* Viewport indicator */}
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
