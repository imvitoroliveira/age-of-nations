import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { MapTile, Position, TerrainType } from '@/types/game';
import { cn } from '@/lib/utils';

const TILE_SIZE = 40;

const terrainColors: Record<TerrainType, string> = {
  grass: '#4a7c23',
  forest: '#2d5a1a',
  water: '#2563eb',
  mountain: '#6b7280',
  sand: '#d4a574',
  snow: '#e5e7eb',
};

const terrainPatterns: Record<TerrainType, string> = {
  grass: '🌿',
  forest: '🌲',
  water: '🌊',
  mountain: '⛰️',
  sand: '🏜️',
  snow: '❄️',
};

const resourceIcons: Record<string, string> = {
  wood: '🪵',
  food: '🌾',
  gold: '🪙',
  stone: '🪨',
};

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState<{ start: Position; end: Position } | null>(null);

  const {
    gameState,
    cameraPosition,
    zoomLevel,
    selectedUnits,
    setCameraPosition,
    setZoomLevel,
    selectUnits,
    moveUnits,
    updateGameState,
  } = useGameStore();

  // Game loop
  useEffect(() => {
    if (!gameState?.isStarted) return;

    const gameLoop = setInterval(() => {
      updateGameState();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState?.isStarted, updateGameState]);

  // Render loop
  useEffect(() => {
    if (!canvasRef.current || !gameState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scaledTileSize = TILE_SIZE * zoomLevel;
      const offsetX = -cameraPosition.x * scaledTileSize + canvas.width / 2;
      const offsetY = -cameraPosition.y * scaledTileSize + canvas.height / 2;

      // Calculate visible tiles
      const startX = Math.max(0, Math.floor((cameraPosition.x - canvas.width / scaledTileSize / 2)));
      const startY = Math.max(0, Math.floor((cameraPosition.y - canvas.height / scaledTileSize / 2)));
      const endX = Math.min(gameState.map.width, Math.ceil(startX + canvas.width / scaledTileSize + 2));
      const endY = Math.min(gameState.map.height, Math.ceil(startY + canvas.height / scaledTileSize + 2));

      // Draw tiles
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tile = gameState.map.tiles[y]?.[x];
          if (!tile) continue;

          const screenX = x * scaledTileSize + offsetX;
          const screenY = y * scaledTileSize + offsetY;

          // Draw terrain
          if (tile.isExplored) {
            ctx.fillStyle = tile.isVisible
              ? terrainColors[tile.terrain]
              : `${terrainColors[tile.terrain]}80`;
            ctx.fillRect(screenX, screenY, scaledTileSize, scaledTileSize);

            // Draw grid
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.strokeRect(screenX, screenY, scaledTileSize, scaledTileSize);

            // Draw resources
            if (tile.resource && tile.isVisible) {
              ctx.font = `${scaledTileSize * 0.5}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(
                resourceIcons[tile.resource.type],
                screenX + scaledTileSize / 2,
                screenY + scaledTileSize / 2
              );
            }
          } else {
            // Fog of war
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
        ctx.fillRect(screenX, screenY, size, size);

        // Building icon
        ctx.font = `${size * 0.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏛️', screenX + size / 2, screenY + size / 2);

        // Health bar
        const healthPercent = building.stats.health / building.stats.maxHealth;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(screenX, screenY - 8, size, 6);
        ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';
        ctx.fillRect(screenX, screenY - 8, size * healthPercent, 6);
      });

      // Draw units
      gameState.units.forEach(unit => {
        const screenX = unit.position.x * scaledTileSize + offsetX;
        const screenY = unit.position.y * scaledTileSize + offsetY;
        const size = scaledTileSize * 0.8;

        const player = gameState.players.find(p => p.id === unit.playerId);
        
        // Unit circle
        ctx.beginPath();
        ctx.arc(screenX + size / 2, screenY + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = player?.color || '#666';
        ctx.fill();

        // Selection ring
        if (selectedUnits.includes(unit.id)) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Unit icon
        const icons = {
          villager: '👷',
          infantry: '⚔️',
          archer: '🏹',
          cavalry: '🐎',
        };
        ctx.font = `${size * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icons[unit.type], screenX + size / 2, screenY + size / 2);

        // Health bar
        const healthPercent = unit.stats.health / unit.stats.maxHealth;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(screenX, screenY - 6, size, 4);
        ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';
        ctx.fillRect(screenX, screenY - 6, size * healthPercent, 4);
      });

      // Draw selection box
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

      requestAnimationFrame(render);
    };

    const animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameState, cameraPosition, zoomLevel, selectedUnits, selectionBox]);

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

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
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

    let dx = 0;
    let dy = 0;

    if (e.clientX - rect.left < edgeSize) dx = -scrollSpeed;
    else if (rect.right - e.clientX < edgeSize) dx = scrollSpeed;
    if (e.clientY - rect.top < edgeSize) dy = -scrollSpeed;
    else if (rect.bottom - e.clientY < edgeSize) dy = scrollSpeed;

    if (dx !== 0 || dy !== 0) {
      setCameraPosition({
        x: cameraPosition.x + dx,
        y: cameraPosition.y + dy,
      });
    }
  }, [isDragging, selectionBox, cameraPosition, setCameraPosition]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaledTileSize = TILE_SIZE * zoomLevel;
    const offsetX = -cameraPosition.x * scaledTileSize + canvas.width / 2;
    const offsetY = -cameraPosition.y * scaledTileSize + canvas.height / 2;

    if (e.button === 0 && selectionBox) {
      // Check if it was a click or drag selection
      const boxWidth = Math.abs(selectionBox.end.x - selectionBox.start.x);
      const boxHeight = Math.abs(selectionBox.end.y - selectionBox.start.y);

      if (boxWidth < 5 && boxHeight < 5) {
        // Single click - select unit at position
        const clickX = (e.clientX - rect.left - offsetX) / scaledTileSize;
        const clickY = (e.clientY - rect.top - offsetY) / scaledTileSize;

        const clickedUnit = gameState.units.find(unit => {
          const dx = unit.position.x - clickX;
          const dy = unit.position.y - clickY;
          return Math.sqrt(dx * dx + dy * dy) < 0.5 && unit.playerId === 'player-1';
        });

        if (clickedUnit) {
          selectUnits([clickedUnit.id]);
        } else {
          selectUnits([]);
        }
      } else {
        // Box selection
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

        if (selectedIds.length > 0) {
          selectUnits(selectedIds);
        }
      }
    }

    if (e.button === 2 && selectedUnits.length > 0) {
      // Right click - move units
      const clickX = (e.clientX - rect.left - offsetX) / scaledTileSize;
      const clickY = (e.clientY - rect.top - offsetY) / scaledTileSize;
      moveUnits(selectedUnits, { x: clickX, y: clickY });
    }

    setIsDragging(false);
    setSelectionBox(null);
  }, [gameState, cameraPosition, zoomLevel, selectionBox, selectedUnits, selectUnits, moveUnits]);

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
        case 'w':
        case 'ArrowUp':
          setCameraPosition({ x: cameraPosition.x, y: cameraPosition.y - scrollSpeed });
          break;
        case 's':
        case 'ArrowDown':
          setCameraPosition({ x: cameraPosition.x, y: cameraPosition.y + scrollSpeed });
          break;
        case 'a':
        case 'ArrowLeft':
          setCameraPosition({ x: cameraPosition.x - scrollSpeed, y: cameraPosition.y });
          break;
        case 'd':
        case 'ArrowRight':
          setCameraPosition({ x: cameraPosition.x + scrollSpeed, y: cameraPosition.y });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraPosition, setCameraPosition]);

  if (!gameState) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-background"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        className="cursor-crosshair"
      />
    </div>
  );
};
