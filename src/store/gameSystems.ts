import { GameState, Unit, Building, Position, UNIT_DEFINITIONS, BUILDING_DEFINITIONS } from '@/types/game';

const dist = (a: Position, b: Position): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// 1. Movement system
export const updateMovement = (state: GameState): GameState => {
  const units = state.units.map(unit => {
    if (!unit.targetPosition) return unit;
    if (unit.currentAction === 'idle') return unit;

    const d = dist(unit.position, unit.targetPosition);
    const speed = unit.stats.speed * 0.12;

    if (d < speed) {
      if (unit.currentAction === 'moving') {
        return { ...unit, position: unit.targetPosition, currentAction: 'idle' as const, targetPosition: undefined };
      }
      return { ...unit, position: unit.targetPosition };
    }

    const dx = (unit.targetPosition.x - unit.position.x) / d * speed;
    const dy = (unit.targetPosition.y - unit.position.y) / d * speed;

    // Collision check with water/mountain
    const nextX = unit.position.x + dx;
    const nextY = unit.position.y + dy;
    const tileX = Math.round(nextX);
    const tileY = Math.round(nextY);
    const tile = state.map.tiles[tileY]?.[tileX];

    if (tile && (tile.terrain === 'water' || tile.terrain === 'mountain')) {
      // Can't move there - stop
      return { ...unit, currentAction: 'idle' as const, targetPosition: undefined };
    }

    return {
      ...unit,
      position: { x: nextX, y: nextY },
    };
  });

  return { ...state, units };
};

// 2. Resource gathering
export const updateGathering = (state: GameState): GameState => {
  if (state.gameTime % 10 !== 0) return state;

  const players = state.players.map(p => ({ ...p, resources: { ...p.resources } }));
  const map = { ...state.map, tiles: state.map.tiles.map(row => row.map(t => ({ ...t, resource: t.resource ? { ...t.resource } : undefined }))) };
  const units = state.units.map(u => ({ ...u }));

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (unit.currentAction !== 'gathering' || unit.type !== 'villager') continue;
    if (unit.targetPosition && dist(unit.position, unit.targetPosition) > 1.5) continue;

    const tx = Math.round(unit.position.x);
    const ty = Math.round(unit.position.y);
    const tile = map.tiles[ty]?.[tx];

    if (!tile?.resource || tile.resource.amount <= 0) {
      units[i] = { ...unit, currentAction: 'idle' as const, targetPosition: undefined };
      continue;
    }

    const amount = Math.min(2, tile.resource.amount);
    tile.resource.amount -= amount;

    const pi = players.findIndex(p => p.id === unit.playerId);
    if (pi >= 0) {
      players[pi].resources[tile.resource.type] += amount;
    }

    if (tile.resource.amount <= 0) {
      tile.resource = undefined;
      units[i] = { ...unit, currentAction: 'idle' as const, targetPosition: undefined };
    }
  }

  return { ...state, players, map, units };
};

// 3. Construction
export const updateConstruction = (state: GameState): GameState => {
  const buildings = state.buildings.map(b => ({ ...b, trainingQueue: [...(b.trainingQueue || [])] }));
  const units = state.units.map(u => ({ ...u }));
  let players = state.players.map(p => ({ ...p }));

  for (let i = 0; i < buildings.length; i++) {
    const building = buildings[i];
    if (!building.isConstructing) continue;

    const builders = units.filter(u =>
      u.currentAction === 'building' &&
      u.playerId === building.playerId &&
      dist(u.position, building.position) < 2.5
    );

    if (builders.length > 0) {
      const def = BUILDING_DEFINITIONS[building.type];
      const progressPerTick = (100 / def.buildTime) * builders.length;
      building.constructionProgress = Math.min(100, building.constructionProgress + progressPerTick);

      if (building.constructionProgress >= 100) {
        building.isConstructing = false;
        building.constructionProgress = 100;

        // Update max population
        const pi = players.findIndex(p => p.id === building.playerId);
        if (pi >= 0) {
          const playerBuildings = buildings.filter(b => b.playerId === players[pi].id && !b.isConstructing);
          players[pi] = {
            ...players[pi],
            maxPopulation: playerBuildings.reduce((total, b) => total + BUILDING_DEFINITIONS[b.type].populationProvided, 0),
          };
        }

        for (const builder of builders) {
          const ui = units.findIndex(u => u.id === builder.id);
          if (ui >= 0) {
            units[ui] = { ...units[ui], currentAction: 'idle' as const, targetPosition: undefined };
          }
        }
      }
    }
  }

  return { ...state, buildings, units, players };
};

// 4. Training
export const updateTraining = (state: GameState): GameState => {
  const buildings = state.buildings.map(b => ({ ...b, trainingQueue: [...(b.trainingQueue || []).map(q => ({ ...q }))] }));
  const units = [...state.units];
  const players = state.players.map(p => ({ ...p }));

  for (const building of buildings) {
    if (building.isConstructing || !building.trainingQueue.length) continue;

    const item = building.trainingQueue[0];
    item.progress += 100 / item.totalTime;

    if (item.progress >= 100) {
      const def = UNIT_DEFINITIONS[item.unitType];
      const spawnOffset = 2 + Math.random();
      const newUnit: Unit = {
        id: `unit-${building.playerId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: item.unitType,
        position: { x: building.position.x + spawnOffset, y: building.position.y + spawnOffset },
        stats: { ...def.stats },
        playerId: building.playerId,
        isSelected: false,
        currentAction: 'idle',
      };

      units.push(newUnit);
      building.trainingQueue.shift();

      const pi = players.findIndex(p => p.id === building.playerId);
      if (pi >= 0) {
        players[pi].population += def.populationCost;
      }
    }
  }

  return { ...state, buildings, units, players };
};

// 5. Combat
export const updateCombat = (state: GameState): GameState => {
  if (state.gameTime % 5 !== 0) return state;

  const units = state.units.map(u => ({ ...u, stats: { ...u.stats } }));
  const buildings = state.buildings.map(b => ({ ...b, stats: { ...b.stats }, trainingQueue: [...(b.trainingQueue || [])] }));
  const players = state.players.map(p => ({ ...p }));

  // Auto-attack: idle military units engage nearby enemies
  for (const unit of units) {
    if (unit.type === 'villager' || unit.currentAction !== 'idle' || unit.stats.health <= 0) continue;

    const nearbyEnemy = units.find(u =>
      u.playerId !== unit.playerId &&
      u.stats.health > 0 &&
      dist(unit.position, u.position) <= unit.stats.range + 3
    );

    if (nearbyEnemy) {
      unit.currentAction = 'attacking' as any;
      unit.targetPosition = nearbyEnemy.position;
    }
  }

  // Process attacks
  for (const unit of units) {
    if (unit.currentAction !== 'attacking' || unit.stats.health <= 0) continue;

    // Attack nearest enemy unit in range
    const enemyUnits = units.filter(u => u.playerId !== unit.playerId && u.stats.health > 0);
    let attacked = false;

    for (const enemy of enemyUnits) {
      if (dist(unit.position, enemy.position) <= unit.stats.range + 0.5) {
        const damage = Math.max(1, unit.stats.attack - enemy.stats.defense);
        enemy.stats.health -= damage;
        attacked = true;
        break;
      }
    }

    // Attack buildings in range
    if (!attacked) {
      for (const building of buildings) {
        if (building.playerId !== unit.playerId && building.stats.health > 0 && dist(unit.position, building.position) <= unit.stats.range + 1.5) {
          const damage = Math.max(1, unit.stats.attack - building.stats.armor);
          building.stats.health -= damage;
          attacked = true;
          break;
        }
      }
    }

    // If nothing in range, keep moving toward target
    if (!attacked && unit.targetPosition && dist(unit.position, unit.targetPosition) > unit.stats.range) {
      // Movement system handles this
    } else if (!attacked) {
      unit.currentAction = 'idle' as any;
      unit.targetPosition = undefined;
    }
  }

  // Remove dead units
  const deadUnitIds = units.filter(u => u.stats.health <= 0).map(u => u.id);
  const aliveUnits = units.filter(u => u.stats.health > 0);

  // Remove dead buildings
  const aliveBuildings = buildings.filter(b => b.stats.health > 0);

  // Update population for dead units
  for (const deadId of deadUnitIds) {
    const deadUnit = state.units.find(u => u.id === deadId);
    if (deadUnit) {
      const pi = players.findIndex(p => p.id === deadUnit.playerId);
      if (pi >= 0) {
        const def = UNIT_DEFINITIONS[deadUnit.type];
        players[pi].population = Math.max(0, players[pi].population - def.populationCost);
      }
    }
  }

  // Recalculate max population
  for (let i = 0; i < players.length; i++) {
    const playerBuildings = aliveBuildings.filter(b => b.playerId === players[i].id && !b.isConstructing);
    players[i].maxPopulation = playerBuildings.reduce((total, b) => total + BUILDING_DEFINITIONS[b.type].populationProvided, 0);
  }

  return { ...state, units: aliveUnits, buildings: aliveBuildings, players };
};

// 6. Fog of War
export const updateFogOfWar = (state: GameState): GameState => {
  if (state.gameTime % 5 !== 0) return state;

  const map = { ...state.map, tiles: state.map.tiles.map(row => row.map(t => ({ ...t, isVisible: false }))) };
  const humanPlayer = state.players.find(p => !p.isAI);
  if (!humanPlayer) return { ...state, map };

  const reveal = (cx: number, cy: number, radius: number) => {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const y = cy + dy;
        const x = cx + dx;
        if (y >= 0 && y < map.height && x >= 0 && x < map.width && dx * dx + dy * dy <= radius * radius) {
          map.tiles[y][x].isExplored = true;
          map.tiles[y][x].isVisible = true;
        }
      }
    }
  };

  for (const unit of state.units) {
    if (unit.playerId === humanPlayer.id) {
      reveal(Math.round(unit.position.x), Math.round(unit.position.y), 5);
    }
  }

  for (const building of state.buildings) {
    if (building.playerId === humanPlayer.id) {
      reveal(Math.round(building.position.x), Math.round(building.position.y), 8);
    }
  }

  return { ...state, map };
};

// 7. Victory Check
export const checkVictory = (state: GameState): GameState => {
  if (state.gameTime % 50 !== 0 || state.gameTime < 100) return state;

  for (const player of state.players) {
    const playerBuildings = state.buildings.filter(b => b.playerId === player.id);
    const playerUnits = state.units.filter(u => u.playerId === player.id);

    if (playerBuildings.length === 0 && playerUnits.length === 0) {
      const winner = state.players.find(p => p.id !== player.id);
      if (winner) {
        return { ...state, winner: winner.id, isPaused: true };
      }
    }
  }

  return state;
};
