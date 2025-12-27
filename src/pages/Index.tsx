import { useState } from 'react';
import { MainMenu } from '@/components/screens/MainMenu';
import { CountrySelection } from '@/components/screens/CountrySelection';
import { GameSetup } from '@/components/screens/GameSetup';
import { GameScreen } from '@/components/game/GameScreen';
import { useGameStore } from '@/store/gameStore';
import { Country } from '@/types/game';
import { toast } from 'sonner';

type Screen = 'menu' | 'countrySelection' | 'gameSetup' | 'game' | 'settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const { selectedCountry, setSelectedCountry, setGameSettings } = useGameStore();

  const handlePlayOnline = () => {
    toast.info('Multiplayer online requer conexão com servidor', {
      description: 'Esta funcionalidade estará disponível em breve!',
    });
  };

  const handleTraining = () => {
    if (!selectedCountry) {
      setCurrentScreen('countrySelection');
    } else {
      setGameSettings({ mode: 'singlePlayer' });
      setCurrentScreen('gameSetup');
    }
  };

  const handleSelectCountry = () => {
    setCurrentScreen('countrySelection');
  };

  const handleSettings = () => {
    toast.info('Configurações', {
      description: 'Painel de configurações será implementado em breve!',
    });
  };

  const handleCountrySelected = (country: Country) => {
    setSelectedCountry(country);
    setGameSettings({ mode: 'singlePlayer' });
    setCurrentScreen('gameSetup');
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleBackToCountrySelection = () => {
    setCurrentScreen('countrySelection');
  };

  switch (currentScreen) {
    case 'countrySelection':
      return (
        <CountrySelection
          onBack={handleBackToMenu}
          onSelect={handleCountrySelected}
        />
      );

    case 'gameSetup':
      return (
        <GameSetup
          onBack={handleBackToCountrySelection}
          onStart={handleStartGame}
        />
      );

    case 'game':
      return <GameScreen />;

    case 'menu':
    default:
      return (
        <MainMenu
          onPlayOnline={handlePlayOnline}
          onTraining={handleTraining}
          onSelectCountry={handleSelectCountry}
          onSettings={handleSettings}
        />
      );
  }
};

export default Index;
