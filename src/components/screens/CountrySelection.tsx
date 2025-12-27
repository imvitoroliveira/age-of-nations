import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CountryCard } from '@/components/game/CountryFlag';
import { getAllCountries } from '@/data/countries';
import { useGameStore } from '@/store/gameStore';
import { Country } from '@/types/game';
import { cn } from '@/lib/utils';

interface CountrySelectionProps {
  onBack: () => void;
  onSelect: (country: Country) => void;
}

export const CountrySelection = ({ onBack, onSelect }: CountrySelectionProps) => {
  const countries = getAllCountries();
  const { selectedCountry, setSelectedCountry } = useGameStore();

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleConfirm = () => {
    if (selectedCountry) {
      onSelect(selectedCountry);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="game-title text-4xl md:text-5xl mb-4">Escolha sua Civilização</h1>
          <p className="text-muted-foreground text-lg">
            Cada nação possui características únicas que influenciam sua estratégia
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {countries.map((country, index) => (
            <div
              key={country.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CountryCard
                country={country}
                selected={selectedCountry?.id === country.id}
                onClick={() => handleSelect(country)}
              />
            </div>
          ))}
        </div>

        {/* Selected Country Preview */}
        {selectedCountry && (
          <div className="game-panel p-6 mb-8 animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-8xl flag-wave">{selectedCountry.flag}</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-cinzel text-3xl text-gold mb-2">{selectedCountry.name}</h2>
                <p className="text-muted-foreground mb-4">{selectedCountry.description}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-gold/20 rounded-lg">
                    <span className="text-gold-light font-medium">{selectedCountry.bonuses.description}</span>
                  </div>
                  <div className="px-4 py-2 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Terreno: </span>
                    <span className="text-foreground capitalize">{selectedCountry.terrainType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="gameOutline"
            size="xl"
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button
            variant="game"
            size="xl"
            onClick={handleConfirm}
            disabled={!selectedCountry}
            className={cn(!selectedCountry && 'opacity-50 cursor-not-allowed')}
          >
            Confirmar Seleção
          </Button>
        </div>
      </div>
    </div>
  );
};
