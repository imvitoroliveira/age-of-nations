import { useRef, useState, useEffect, useCallback } from 'react';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { useAppStore } from '@/store/appStore';
import { LETTERS, speak } from '@/data/educationData';
import { Eraser, ChevronLeft, ChevronRight, Palette, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props { onBack: () => void; }

const COLORS_PALETTE = [
  { name: 'Preto', hex: 'hsl(var(--foreground))' },
  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Laranja', hex: '#F97316' },
  { name: 'Roxo', hex: '#A855F7' },
  { name: 'Rosa', hex: '#EC4899' },
];

const BRUSH_SIZES = [4, 8, 14, 22];

// Simplified letter path guides (center positions for dots)
const LETTER_GUIDES: Record<string, string> = {
  A: 'M 30 85 L 50 15 L 70 85 M 38 60 L 62 60',
  B: 'M 30 15 L 30 85 M 30 15 L 60 15 Q 75 15 75 30 Q 75 45 60 50 L 30 50 M 30 50 L 60 50 Q 78 50 78 67 Q 78 85 60 85 L 30 85',
  C: 'M 70 25 Q 50 10 35 25 Q 20 40 20 50 Q 20 60 35 75 Q 50 90 70 75',
  D: 'M 30 15 L 30 85 M 30 15 L 55 15 Q 75 15 75 50 Q 75 85 55 85 L 30 85',
  E: 'M 65 15 L 30 15 L 30 85 L 65 85 M 30 50 L 55 50',
  F: 'M 65 15 L 30 15 L 30 85 M 30 50 L 55 50',
  G: 'M 70 25 Q 50 10 35 25 Q 20 40 20 50 Q 20 60 35 75 Q 50 90 70 75 L 70 50 L 55 50',
  H: 'M 30 15 L 30 85 M 70 15 L 70 85 M 30 50 L 70 50',
  I: 'M 35 15 L 65 15 M 50 15 L 50 85 M 35 85 L 65 85',
  J: 'M 40 15 L 70 15 M 60 15 L 60 70 Q 60 85 45 85 Q 30 85 30 72',
  K: 'M 30 15 L 30 85 M 65 15 L 30 55 M 38 47 L 68 85',
  L: 'M 30 15 L 30 85 L 65 85',
  M: 'M 20 85 L 20 15 L 50 55 L 80 15 L 80 85',
  N: 'M 30 85 L 30 15 L 70 85 L 70 15',
  O: 'M 50 15 Q 75 15 75 50 Q 75 85 50 85 Q 25 85 25 50 Q 25 15 50 15 Z',
  P: 'M 30 85 L 30 15 L 60 15 Q 75 15 75 35 Q 75 50 60 50 L 30 50',
  Q: 'M 50 15 Q 75 15 75 50 Q 75 85 50 85 Q 25 85 25 50 Q 25 15 50 15 Z M 60 70 L 75 90',
  R: 'M 30 85 L 30 15 L 60 15 Q 75 15 75 32 Q 75 50 60 50 L 30 50 M 55 50 L 70 85',
  S: 'M 68 25 Q 55 12 42 18 Q 28 25 28 38 Q 28 50 50 55 Q 72 60 72 72 Q 72 85 55 88 Q 40 88 30 78',
  T: 'M 20 15 L 80 15 M 50 15 L 50 85',
  U: 'M 30 15 L 30 70 Q 30 85 50 85 Q 70 85 70 70 L 70 15',
  V: 'M 20 15 L 50 85 L 80 15',
  W: 'M 15 15 L 30 85 L 50 40 L 70 85 L 85 15',
  X: 'M 25 15 L 75 85 M 75 15 L 25 85',
  Y: 'M 25 15 L 50 50 L 75 15 M 50 50 L 50 85',
  Z: 'M 25 15 L 75 15 L 25 85 L 75 85',
};

export const DrawingActivity = ({ onBack }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS_PALETTE[0].hex);
  const [brushSize, setBrushSize] = useState(8);
  const [letterIdx, setLetterIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);
  const { recordActivity } = useAppStore();

  const letter = LETTERS[letterIdx];

  const getCanvasSize = useCallback(() => {
    const size = Math.min(window.innerWidth - 32, 340);
    return size;
  }, []);

  const drawGuide = useCallback((ctx: CanvasRenderingContext2D, size: number) => {
    if (!showGuide) return;
    const scale = size / 100;
    ctx.save();
    ctx.strokeStyle = 'hsl(var(--muted-foreground) / 0.15)';
    ctx.lineWidth = 3 * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([6 * scale, 4 * scale]);
    
    const path = LETTER_GUIDES[letter];
    if (path) {
      const p = new Path2D();
      // Parse SVG path and scale
      const scaledPath = path.replace(/(\d+\.?\d*)/g, (match) => {
        return String(parseFloat(match) * scale);
      });
      // Use a temporary SVG path
      const svgPath = new Path2D(scaledPath);
      ctx.stroke(svgPath);
    }
    
    ctx.restore();
  }, [letter, showGuide]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = getCanvasSize();
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'hsl(var(--card))';
    ctx.fillRect(0, 0, size, size);
    drawGuide(ctx, size);
    setHistory([]);
  }, [getCanvasSize, drawGuide]);

  useEffect(() => {
    initCanvas();
  }, [letterIdx, showGuide]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory(prev => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(h => h.slice(0, -1));
  };

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);
    setIsDrawing(true);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const nextLetter = () => {
    recordActivity('drawing', true);
    speak(`Muito bem! Próxima letra!`);
    setLetterIdx(prev => (prev + 1) % LETTERS.length);
  };

  const prevLetter = () => {
    setLetterIdx(prev => (prev - 1 + LETTERS.length) % LETTERS.length);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="✏️ Desenhar Letras" category="drawing" onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center p-4 gap-4">
        {/* Letter display */}
        <div className="flex items-center gap-4">
          <button onClick={prevLetter} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 active:scale-95 transition-transform"
            aria-label="Letra anterior">
            <ChevronLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="text-center">
            <button onClick={() => speak(letter)} className="text-6xl font-extrabold font-baloo text-primary pop"
              aria-label={`Letra ${letter}, toque para ouvir`}>
              {letter}
            </button>
            <p className="text-sm font-bold text-muted-foreground">
              Desenhe a letra <span className="text-primary">{letter}</span> com o dedo!
            </p>
          </div>
          <button onClick={nextLetter} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-transform"
            aria-label="Próxima letra">
            <ChevronRight size={20} className="text-primary-foreground" />
          </button>
        </div>

        {/* Canvas */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-primary/20 touch-none">
          <canvas
            ref={canvasRef}
            className="cursor-crosshair bg-card"
            style={{ width: `${getCanvasSize()}px`, height: `${getCanvasSize()}px`, touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
            aria-label={`Área de desenho para a letra ${letter}`}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
          {/* Colors */}
          <div className="flex gap-1.5 bg-card rounded-2xl p-2 shadow-sm border border-border/30">
            {COLORS_PALETTE.map(c => (
              <button
                key={c.name}
                onClick={() => setColor(c.hex)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c.hex ? 'border-foreground scale-110 ring-2 ring-primary/30' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.hex === 'hsl(var(--foreground))' ? '#1a1a1a' : c.hex }}
                aria-label={`Cor ${c.name}`}
              />
            ))}
          </div>

          {/* Brush sizes */}
          <div className="flex gap-1.5 bg-card rounded-2xl p-2 shadow-sm border border-border/30">
            {BRUSH_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  brushSize === size ? 'bg-primary/15 ring-2 ring-primary/30' : 'hover:bg-muted'
                }`}
                aria-label={`Pincel tamanho ${size}`}
              >
                <div className="rounded-full bg-foreground" style={{ width: size, height: size }} />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5">
            <button onClick={() => setShowGuide(!showGuide)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                showGuide ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              }`}
              aria-label={showGuide ? 'Ocultar guia' : 'Mostrar guia'}>
              <Palette size={18} />
            </button>
            <button onClick={undo} disabled={history.length === 0}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 disabled:opacity-30 transition-all"
              aria-label="Desfazer">
              <Undo2 size={18} />
            </button>
            <button onClick={initCanvas}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all"
              aria-label="Limpar tudo">
              <Eraser size={18} />
            </button>
          </div>
        </div>

        {/* Next button */}
        <button onClick={nextLetter} className="kid-btn bg-primary text-primary-foreground text-lg px-8">
          Próxima letra! →
        </button>
      </div>
    </div>
  );
};
