import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/game/CountryFlag';
import { getAllCountries } from '@/data/countries';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  onPlayOnline: () => void;
  onTraining: () => void;
  onSelectCountry: () => void;
  onSettings: () => void;
}

export const MainMenu = ({ onPlayOnline, onTraining, onSelectCountry, onSettings }: MainMenuProps) => {
  const countries = getAllCountries();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, hsl(var(--forest) / 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, hsl(var(--water) / 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, hsl(var(--terrain-sand) / 0.3) 0%, transparent 40%),
              linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)
            `,
          }}
        />
      </div>

      {/* Animated Flags Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {countries.slice(0, 8).map((country, index) => {
          const positions = [
            { top: '10%', left: '5%' },
            { top: '15%', right: '8%' },
            { top: '40%', left: '3%' },
            { top: '35%', right: '5%' },
            { top: '60%', left: '7%' },
            { top: '65%', right: '10%' },
            { top: '85%', left: '4%' },
            { top: '80%', right: '6%' },
          ];
          return (
            <div
              key={country.id}
              className="absolute text-4xl opacity-30 float-animation flag-wave"
              style={{
                ...positions[index],
                animationDelay: `${index * 0.5}s`,
              }}
            >
              {country.flag}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo / Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block">
            <h1 className="game-title text-5xl md:text-7xl lg:text-8xl mb-4">
              Empire
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 gold-shimmer">
                Conquest
              </span>
            </h1>
            <div className="absolute -inset-4 border-2 border-gold/20 rounded-lg -z-10" />
          </div>
          <p className="text-muted-foreground text-lg md:text-xl mt-6 max-w-md mx-auto">
            Construa seu império, domine seus inimigos e conquiste o mundo
          </p>
        </div>

        {/* Menu Panel */}
        <div className="game-panel p-8 w-full max-w-md animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <nav className="flex flex-col gap-4">
            <Button
              variant="game"
              size="xl"
              onClick={onPlayOnline}
              className="w-full"
            >
              <span className="mr-2">🌐</span>
              Jogar Online
            </Button>

            <Button
              variant="game"
              size="xl"
              onClick={onTraining}
              className="w-full"
            >
              <span className="mr-2">⚔️</span>
              Modo Treino
            </Button>

            <div className="border-t border-border/50 my-2" />

            <Button
              variant="gameOutline"
              size="lg"
              onClick={onSelectCountry}
              className="w-full"
            >
              <span className="mr-2">🏳️</span>
              Escolher Civilização
            </Button>

            <Button
              variant="gameGhost"
              size="lg"
              onClick={onSettings}
              className="w-full"
            >
              <span className="mr-2">⚙️</span>
              Configurações
            </Button>
          </nav>
        </div>

        {/* Country Preview */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {countries.map((country) => (
            <div
              key={country.id}
              className={cn(
                'transition-all duration-300 cursor-pointer',
                hoveredCountry === country.id ? 'scale-125 z-10' : 'opacity-60 hover:opacity-100'
              )}
              onMouseEnter={() => setHoveredCountry(country.id)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <span className="text-2xl">{country.flag}</span>
            </div>
          ))}
        </div>

        {/* Hovered Country Info */}
        {hoveredCountry && (
          <div className="mt-4 text-center animate-fade-in">
            <p className="text-gold font-cinzel">
              {countries.find(c => c.id === hoveredCountry)?.name}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground/50">
        Empire Conquest © 2024 • Inspirado em Age of Empires
      </div>
    </div>
  );
};
