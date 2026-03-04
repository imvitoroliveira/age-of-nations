import { GameState, Unit, Position, UNIT_DEFINITIONS, BUILDING_DEFINITIONS } from '@/types/game';

const dist = (a: Position, b: Position): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const updateAI = (state: GameState): GameState => {
  if (state.gameTime % 100 !== 0) return state;

  const aiPlayer = state.players.find(p => p.isAI);
  if (!aiPlayer) return state;

  const units = state.units.map(u => ({ ...u }));
  const buildings = state.buildings.map(b => ({ ...b, trainingQueue: [...(b.trainingQueue || []).map(q => ({ ...q }))] }));
  const players = state.players.map(p => ({ ...p, resources: { ...p.resources } }));

  const pi = players.findIndex(p => p.id === aiPlayer.id);
  const res = players[pi].resources;
  const aiUnits = units.filter(u => u.playerId === aiPlayer.id);
  const aiBuildings = buildings.filter(b => b.playerId === aiPlayer.id && !b.isConstructing);
  const aiVillagers = aiUnits.filter(u => u.type === 'villager');
  const aiMilitary = aiUnits.filter(u => u.type !== 'villager');

  const tc = aiBuildings.find(b => b.type === 'townCenter');
  if (!tc) return { ...state, units, buildings, players };

  // 1. Send idle villagers to gather resources
  const idleVillagers = aiVillagers.filter(u => u.currentAction === 'idle');
  const searchRadius = 25;
  const cx = Math.round(tc.position.x);
  const cy = Math.round(tc.position.y);

  for (const villager of idleVillagers) {
    let nearestResource: Position | null = null;
    let nearestDist = Infinity;

    for (let dy = -searchRadius; dy <= searchRadius; dy++) {
      for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (y < 0 || y >= state.map.height || x < 0 || x >= state.map.width) continue;
        const tile = state.map.tiles[y][x];
        if (tile.resource && tile.resource.amount > 0) {
          const d = dist(villager.position, { x, y });
          if (d < nearestDist) {
            nearestDist = d;
            nearestResource = { x, y };
          }
        }
      }
    }

    if (nearestResource) {
      const ui = units.findIndex(u => u.id === villager.id);
      units[ui] = { ...units[ui], currentAction: 'gathering' as const, targetPosition: nearestResource };
    }
  }

  // 2. Build houses when near pop cap
  if (aiPlayer.population >= aiPlayer.maxPopulation - 1 && res.wood >= 25) {
    const offset = 3 + Math.floor(Math.random() * 5);
    const angle = Math.random() * Math.PI * 2;
    const pos = { x: tc.position.x + Math.cos(angle) * offset, y: tc.position.y + Math.sin(angle) * offset };

    buildings.push({
      id: `building-ai-house-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'house',
      position: pos,
      stats: { ...BUILDING_DEFINITIONS.house.stats },
      playerId: aiPlayer.id,
      isSelected: false,
      isConstructing: false,
      constructionProgress: 100,
      trainingQueue: [],
    });
    players[pi].resources.wood -= 25;

    // Recalculate max pop
    const allAiBuildings = buildings.filter(b => b.playerId === aiPlayer.id && !b.isConstructing);
    players[pi].maxPopulation = allAiBuildings.reduce((t, b) => t + BUILDING_DEFINITIONS[b.type].populationProvided, 0);
  }

  // 3. Build barracks if none exist
  const hasBarracks = aiBuildings.some(b => b.type === 'barracks');
  if (!hasBarracks && res.wood >= 175) {
    const offset = 4 + Math.floor(Math.random() * 3);
    buildings.push({
      id: `building-ai-barracks-${Date.now()}`,
      type: 'barracks',
      position: { x: tc.position.x - offset, y: tc.position.y + Math.floor(Math.random() * 4) },
      stats: { ...BUILDING_DEFINITIONS.barracks.stats },
      playerId: aiPlayer.id,
      isSelected: false,
      isConstructing: false,
      constructionProgress: 100,
      trainingQueue: [],
    });
    players[pi].resources.wood -= 175;
  }

  // 4. Train units
  const barracks = buildings.find(b => b.playerId === aiPlayer.id && b.type === 'barracks' && !b.isConstructing);
  if (barracks && barracks.trainingQueue.length < 2 && res.food >= 60 && res.gold >= 20 && aiPlayer.population < players[pi].maxPopulation) {
    barracks.trainingQueue.push({
      unitType: 'infantry',
      progress: 0,
      totalTime: UNIT_DEFINITIONS.infantry.trainTime,
    });
    players[pi].resources.food -= 60;
    players[pi].resources.gold -= 20;
  }

  // Train villagers from TC
  if (tc && tc.trainingQueue.length === 0 && aiVillagers.length < 6 && res.food >= 50 && aiPlayer.population < players[pi].maxPopulation) {
    const tci = buildings.findIndex(b => b.id === tc.id);
    buildings[tci].trainingQueue.push({
      unitType: 'villager',
      progress: 0,
      totalTime: UNIT_DEFINITIONS.villager.trainTime,
    });
    players[pi].resources.food -= 50;
  }

  // 5. Attack with army when large enough
  if (aiMilitary.length >= 4) {
    const humanPlayer = state.players.find(p => !p.isAI);
    if (humanPlayer) {
      const targetBuilding = state.buildings.find(b => b.playerId === humanPlayer.id);
      if (targetBuilding) {
        for (const soldier of aiMilitary) {
          if (soldier.currentAction === 'idle') {
            const ui = units.findIndex(u => u.id === soldier.id);
            units[ui] = { ...units[ui], currentAction: 'attacking' as const, targetPosition: targetBuilding.position };
          }
        }
      }
    }
  }

  return { ...state, units, buildings, players };
};
