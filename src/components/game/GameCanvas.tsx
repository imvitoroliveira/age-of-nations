import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Position, TerrainType } from '@/types/game';

const TILE_SIZE = 40;

const terrainColors: Record<TerrainType, string> = {
  grass: '#4a7c23',
  forest: '#2d5a1a',
  water: '#2563eb',
  mountain: '#6b7280',
  sand: '#d4a574',
  snow: '#e5e7eb',
};

const resourceIcons: Record<string, string> = {
  wood: '🪵',
  food: '🌾',
  gold: '🪙',
  stone: '🪨',
};

const buildingIcons: Record<string, string> = {
  townCenter: '🏛️',
  house: '🏠',
  barracks: '⚔️',
  archeryRange: '🏹',
  stable: '🐎',
  tower: '🗼',
  lumberCamp: '🪵',
  mill: '🌾',
  miningCamp: '⛏️',
};

const unitIcons: Record<string, string> = {
  villager: '👷',
  infantry: '⚔️',
  archer: '🏹',
  cavalry: '🐎',
};

const dist = (a: Position, b: Position) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ start: Position; end: Position } | null>(null);

  const {
    gameState,
    cameraPosition,
    zoomLevel,
    selectedUnits,
    placementMode,
    setCameraPosition,
    setZoomLevel,
    selectUnits,
    selectBuilding,
    moveUnits,
    gatherResource,
    attackMove,
    constructBuilding,
    updateGameState,
  } = useGameStore();

  // Game loop
  useEffect(() => {
    if (!gameState?.isStarted) return;
    const gameLoop = setInterval(updateGameState, 100);
    return () => clearInterval(gameLoop);
  }, [gameState?.isStarted, updateGameState]);

  // Render loop - FIXED: use cancelled flag to prevent RAF leak
  useEffect(() => {
    if (!canvasRef.current || !gameState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    const render = () => {
      if (cancelled) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scaledTileSize = TILE_SIZE * zoomLevel;
      const offsetX = -cameraPosition.x * scaledTileSize + canvas.width / 2;
      const offsetY = -cameraPosition.y * scaledTileSize + canvas.height / 2;

      const startX = Math.max(0, Math.floor(cameraPosition.x - canvas.width / scaledTileSize / 2));
      const startY = Math.max(0, Math.floor(cameraPosition.y - canvas.height / scaledTileSize / 2));
      const endX = Math.min(gameState.map.width, Math.ceil(startX + canvas.width / scaledTileSize + 2));
      const endY = Math.min(gameState.map.height, Math.ceil(startY + canvas.height / scaledTileSize + 2));

      // Draw tiles
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tile = gameState.map.tiles[y]?.[x];
          if (!tile) continue;

          const screenX = x * scaledTileSize + offsetX;
          const screenY = y * scaledTileSize + offsetY;

          if (tile.isExplored) {
            ctx.fillStyle = tile.isVisible
              ? terrainColors[tile.terrain]
              : `${terrainColors[tile.terrain]}60`;
            ctx.fillRect(screenX, screenY, scaledTileSize, scaledTileSize);

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.strokeRect(screenX, screenY, scaledTileSize, scaledTileSize);

            if (tile.resource && tile.isVisible) {
              ctx.font = `${scaledTileSize * 0.45}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(
                resourceIcons[tile.resource.type],
                screenX + scaledTileSize / 2,
                screenY + scaledTileSize / 2
              );
              // Show resource amount
              ctx.font = `${scaledTileSize * 0.2}px sans-serif`;
              ctx.fillStyle = '#fff';
              ctx.fillText(
                `${tile.resource.amount}`,
                screenX + scaledTileSize / 2,
                screenY + scaledTileSize * 0.85
              );
            }
          } else {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(screenX, screenY, scaledTileSize, scaledTileSize);
          }
        }
      }

      // Draw buildings
      gameState.buildings.forEach(building => {
        const screenX = building.position.x * scaledTileSize + offsetX;
        const screenY = building.position.y * scaledTileSize + offsetY;
        const size = scaledTileSize * 2;

        const player = gameState.players.find(p => p.id === building.playerId);
        ctx.fillStyle = player?.color || '#666';
        ctx.globalAlpha = building.isConstructing ? 0.5 : 1;
        ctx.fillRect(screenX, screenY, size, size);
        ctx.globalAlpha = 1;

        ctx.font = `${size * 0.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(buildingIcons[building.type] || '🏗️', screenX + size / 2, screenY + size / 2);

        // Construction progress
        if (building.isConstructing) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(screenX, screenY - 12, size, 8);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(screenX, screenY - 12, size * (building.constructionProgress / 100), 8);
          ctx.font = `${size * 0.15}px sans-serif`;
          ctx.fillStyle = '#fff';
          ctx.fillText(`${Math.floor(building.constructionProgress)}%`, screenX + size / 2, screenY - 8);
        }

        // Health bar
        const healthPercent = building.stats.health / building.stats.maxHealth;
        if (healthPercent < 1) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(screenX, screenY - 8, size, 5);
          ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';
          ctx.fillRect(screenX, screenY - 8, size * healthPercent, 5);
        }

        // Training queue indicator
        if (building.trainingQueue.length > 0) {
          const item = building.trainingQueue[0];
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.fillRect(screenX, screenY + size + 2, size * (item.progress / 100), 4);
        }
      });

      // Draw units
      gameState.units.forEach(unit => {
        const screenX = unit.position.x * scaledTileSize + offsetX;
        const screenY = unit.position.y * scaledTileSize + offsetY;
        const size = scaledTileSize * 0.8;

        const player = gameState.players.find(p => p.id === unit.playerId);

        ctx.beginPath();
        ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = player?.color || '#666';
        ctx.fill();

        if (selectedUnits.includes(unit.id)) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.font = `${size * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unitIcons[unit.type] || '?', screenX + size / 2, screenY + size / 2);

        // Action indicator
        if (unit.currentAction === 'gathering') {
          ctx.font = `${size * 0.3}px sans-serif`;
          ctx.fillText('⛏️', screenX + size, screenY);
        } else if (unit.currentAction === 'building') {
          ctx.font = `${size * 0.3}px sans-serif`;
          ctx.fillText('🔨', screenX + size, screenY);
        } else if (unit.currentAction === 'attacking') {
          ctx.font = `${size * 0.3}px sans-serif`;
          ctx.fillText('💥', screenX + size, screenY);
        }

        // Health bar
        const healthPercent = unit.stats.health / unit.stats.maxHealth;
        if (healthPercent < 1) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(screenX, screenY - 6, size, 4);
          ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';
          ctx.fillRect(screenX, screenY - 6, size * healthPercent, 4);
        }
      });

      // Selection box
      if (selectionBox) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          Math.min(selectionBox.start.x, selectionBox.end.x),
          Math.min(selectionBox.start.y, selectionBox.end.y),
          Math.abs(selectionBox.end.x - selectionBox.start.x),
          Math.abs(selectionBox.end.y - selectionBox.start.y)
        );
        ctx.setLineDash([]);
      }

      // Placement mode indicator
      if (placementMode) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText('Clique para posicionar • ESC para cancelar', canvas.width / 2, 30);
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => { cancelled = true; };
  }, [gameState, cameraPosition, zoomLevel, selectedUnits, selectionBox, placementMode]);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getWorldPos = useCallback((clientX: number, clientY: number): Position => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaledTileSize = TILE_SIZE * zoomLevel;
    const offsetX = -cameraPosition.x * scaledTileSize + canvas.width / 2;
    const offsetY = -cameraPosition.y * scaledTileSize + canvas.height / 2;
    return {
      x: (clientX - rect.left - offsetX) / scaledTileSize,
      y: (clientY - rect.top - offsetY) / scaledTileSize,
    };
  }, [cameraPosition, zoomLevel]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setSelectionBox({ start: { x: e.clientX, y: e.clientY }, end: { x: e.clientX, y: e.clientY } });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && selectionBox) {
      setSelectionBox({ ...selectionBox, end: { x: e.clientX, y: e.clientY } });
    }

    // Edge scrolling
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const edgeSize = 50;
    const scrollSpeed = 0.5;
    let dx = 0, dy = 0;

    if (e.clientX - rect.left < edgeSize) dx = -scrollSpeed;
    else if (rect.right - e.clientX < edgeSize) dx = scrollSpeed;
    if (e.clientY - rect.top < edgeSize) dy = -scrollSpeed;
    else if (rect.bottom - e.clientY < edgeSize) dy = scrollSpeed;

    if (dx !== 0 || dy !== 0) {
      setCameraPosition({ x: cameraPosition.x + dx, y: cameraPosition.y + dy });
    }
  }, [isDragging, selectionBox, cameraPosition, setCameraPosition]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!gameState || !canvasRef.current) return;

    const worldPos = getWorldPos(e.clientX, e.clientY);

    // Left click
    if (e.button === 0) {
      // Placement mode
      if (placementMode) {
        constructBuilding(worldPos);
        setIsDragging(false);
        setSelectionBox(null);
        return;
      }

      if (selectionBox) {
        const boxWidth = Math.abs(selectionBox.end.x - selectionBox.start.x);
        const boxHeight = Math.abs(selectionBox.end.y - selectionBox.start.y);

        if (boxWidth < 5 && boxHeight < 5) {
          // Single click
          const clickedUnit = gameState.units.find(unit =>
            unit.playerId === 'player-1' && dist(unit.position, worldPos) < 0.6
          );

          if (clickedUnit) {
            selectUnits([clickedUnit.id]);
          } else {
            // Check for building click
            const clickedBuilding = gameState.buildings.find(b =>
              b.playerId === 'player-1' && dist(b.position, worldPos) < 1.5
            );
            if (clickedBuilding) {
              selectBuilding(clickedBuilding.id);
            } else {
              selectUnits([]);
            }
          }
        } else {
          // Box selection
          const rect = canvasRef.current.getBoundingClientRect();
          const scaledTileSize = TILE_SIZE * zoomLevel;
          const offsetX = -cameraPosition.x * scaledTileSize + canvasRef.current.width / 2;
          const offsetY = -cameraPosition.y * scaledTileSize + canvasRef.current.height / 2;

          const minX = (Math.min(selectionBox.start.x, selectionBox.end.x) - rect.left - offsetX) / scaledTileSize;
          const maxX = (Math.max(selectionBox.start.x, selectionBox.end.x) - rect.left - offsetX) / scaledTileSize;
          const minY = (Math.min(selectionBox.start.y, selectionBox.end.y) - rect.top - offsetY) / scaledTileSize;
          const maxY = (Math.max(selectionBox.start.y, selectionBox.end.y) - rect.top - offsetY) / scaledTileSize;

          const selectedIds = gameState.units
            .filter(unit =>
              unit.playerId === 'player-1' &&
              unit.position.x >= minX && unit.position.x <= maxX &&
              unit.position.y >= minY && unit.position.y <= maxY
            )
            .map(unit => unit.id);

          if (selectedIds.length > 0) selectUnits(selectedIds);
        }
      }
    }

    // Right click - context action
    if (e.button === 2 && selectedUnits.length > 0) {
      const tileX = Math.round(worldPos.x);
      const tileY = Math.round(worldPos.y);
      const tile = gameState.map.tiles[tileY]?.[tileX];

      const selectedUnitObjects = gameState.units.filter(u => selectedUnits.includes(u.id));
      const hasVillagers = selectedUnitObjects.some(u => u.type === 'villager');
      const hasMilitary = selectedUnitObjects.some(u => u.type !== 'villager');

      // Check enemy nearby
      const enemyUnit = gameState.units.find(u =>
        u.playerId !== 'player-1' && dist(u.position, worldPos) < 1.5
      );
      const enemyBuilding = gameState.buildings.find(b =>
        b.playerId !== 'player-1' && dist(b.position, worldPos) < 2
      );

      if (enemyUnit || enemyBuilding) {
        attackMove(selectedUnits, worldPos);
      } else if (tile?.resource && hasVillagers) {
        gatherResource(selectedUnits, { x: tileX, y: tileY });
      } else {
        moveUnits(selectedUnits, worldPos);
      }
    }

    setIsDragging(false);
    setSelectionBox(null);
  }, [gameState, cameraPosition, zoomLevel, selectionBox, selectedUnits, placementMode,
    selectUnits, selectBuilding, moveUnits, gatherResource, attackMove, constructBuilding, getWorldPos]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(zoomLevel + delta);
  }, [zoomLevel, setZoomLevel]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollSpeed = 2;
      switch (e.key) {
        case 'w': case 'ArrowUp':
          setCameraPosition({ x: cameraPosition.x, y: cameraPosition.y - scrollSpeed });
          break;
        case 's': case 'ArrowDown':
          setCameraPosition({ x: cameraPosition.x, y: cameraPosition.y + scrollSpeed });
          break;
        case 'a': case 'ArrowLeft':
          setCameraPosition({ x: cameraPosition.x - scrollSpeed, y: cameraPosition.y });
          break;
        case 'd': case 'ArrowRight':
          setCameraPosition({ x: cameraPosition.x + scrollSpeed, y: cameraPosition.y });
          break;
        case 'Escape':
          useGameStore.getState().setPlacementMode(null);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraPosition, setCameraPosition]);

  if (!gameState) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando jogo...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        className={placementMode ? 'cursor-cell' : 'cursor-crosshair'}
      />
    </div>
  );
};
