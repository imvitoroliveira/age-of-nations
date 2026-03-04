import { GameMap, MapTile, TerrainType, ResourceType, Position, Unit, Building } from '@/types/game';

export const generateMap = (width: number, height: number, terrainType: TerrainType): GameMap => {
  const tiles: MapTile[][] = [];

  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      let terrain: TerrainType = terrainType;

      // Fixed probability order: water first, then forest, then mountain
      const rand = Math.random();
      if (rand < 0.04) {
        terrain = 'water';
      } else if (rand < 0.18) {
        terrain = 'forest';
      } else if (rand < 0.22) {
        terrain = 'mountain';
      }

      let resource: MapTile['resource'] = undefined;
      if (terrain === 'forest' && Math.random() < 0.4) {
        resource = {
          type: 'wood',
          amount: 100 + Math.floor(Math.random() * 400),
          maxAmount: 500,
        };
      } else if (terrain !== 'water' && terrain !== 'mountain' && terrain !== 'forest' && Math.random() < 0.08) {
        const types: ResourceType[] = ['food', 'gold', 'stone'];
        resource = {
          type: types[Math.floor(Math.random() * types.length)],
          amount: 100 + Math.floor(Math.random() * 400),
          maxAmount: 500,
        };
      }

      tiles[y][x] = {
        position: { x, y },
        terrain,
        resource,
        isExplored: false,
        isVisible: false,
      };
    }
  }

  return { width, height, tiles };
};

export const createInitialUnits = (playerId: string, startPosition: Position): Unit[] => {
  const units: Unit[] = [];
  for (let i = 0; i < 3; i++) {
    units.push({
      id: `unit-${playerId}-${Date.now()}-${i}`,
      type: 'villager',
      position: {
        x: startPosition.x + (i % 2),
        y: startPosition.y + Math.floor(i / 2),
      },
      stats: { health: 25, maxHealth: 25, attack: 3, defense: 0, speed: 1, range: 1 },
      playerId,
      isSelected: false,
      currentAction: 'idle',
    });
  }
  return units;
};

export const createInitialBuildings = (playerId: string, startPosition: Position): Building[] => {
  return [{
    id: `building-${playerId}-tc`,
    type: 'townCenter',
    position: startPosition,
    stats: { health: 2400, maxHealth: 2400, armor: 5 },
    playerId,
    isSelected: false,
    isConstructing: false,
    constructionProgress: 100,
    trainingQueue: [],
  }];
};

export const revealArea = (map: GameMap, centerX: number, centerY: number, radius: number) => {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const y = centerY + dy;
      const x = centerX + dx;
      if (y >= 0 && y < map.height && x >= 0 && x < map.width && dx * dx + dy * dy <= radius * radius) {
        map.tiles[y][x].isExplored = true;
        map.tiles[y][x].isVisible = true;
      }
    }
  }
};
