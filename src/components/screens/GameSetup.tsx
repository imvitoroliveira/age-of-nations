import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface GameSetupProps {
  onBack: () => void;
  onStart: () => void;
}

export const GameSetup = ({ onBack, onStart }: GameSetupProps) => {
  const { gameSettings, setGameSettings, selectedCountry, startGame } = useGameStore();
  const [playerName, setPlayerName] = useState('Jogador');

  const handleStart = () => {
    startGame(playerName);
    onStart();
  };

  const mapSizeOptions = [
    { value: 'small', label: 'Pequeno', description: '50x50 tiles' },
    { value: 'medium', label: 'Médio', description: '100x100 tiles' },
    { value: 'large', label: 'Grande', description: '150x150 tiles' },
  ] as const;

  const difficultyOptions = [
    { value: 'easy', label: 'Fácil', description: 'IA passiva, mais recursos' },
    { value: 'medium', label: 'Médio', description: 'IA balanceada' },
    { value: 'hard', label: 'Difícil', description: 'IA agressiva e estratégica' },
  ] as const;

  const resourceOptions = [
    { value: 'low', label: 'Escasso', description: 'Poucos recursos iniciais' },
    { value: 'medium', label: 'Normal', description: 'Recursos padrão' },
    { value: 'high', label: 'Abundante', description: 'Muitos recursos iniciais' },
  ] as const;

  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="game-panel p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="game-title text-3xl md:text-4xl mb-2">Configurar Partida</h1>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{selectedCountry?.flag}</span>
              <span className="text-gold font-cinzel text-xl">{selectedCountry?.name}</span>
            </div>
          </div>

          {/* Player Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nome do Jogador
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-crimson text-lg"
              placeholder="Seu nome..."
            />
          </div>

          {/* Map Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Tamanho do Mapa
            </label>
            <div className="grid grid-cols-3 gap-3">
              {mapSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGameSettings({ mapSize: option.value })}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-center',
                    gameSettings.mapSize === option.value
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-muted/30 hover:border-gold/50'
                  )}
                >
                  <div className="font-cinzel text-foreground">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Dificuldade da IA
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGameSettings({ aiDifficulty: option.value })}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-center',
                    gameSettings.aiDifficulty === option.value
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-muted/30 hover:border-gold/50'
                  )}
                >
                  <div className="font-cinzel text-foreground">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Starting Resources */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Recursos Iniciais
            </label>
            <div className="grid grid-cols-3 gap-3">
              {resourceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGameSettings({ startingResources: option.value })}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-center',
                    gameSettings.startingResources === option.value
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-muted/30 hover:border-gold/50'
                  )}
                >
                  <div className="font-cinzel text-foreground">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="gameOutline"
              size="lg"
              onClick={onBack}
            >
              Voltar
            </Button>
            <Button
              variant="game"
              size="lg"
              onClick={handleStart}
              className="pulse-glow"
            >
              Iniciar Partida
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
