import { useState, useEffect } from 'react';
import { MainMenu } from '@/components/screens/MainMenu';
import { CountrySelection } from '@/components/screens/CountrySelection';
import { GameSetup } from '@/components/screens/GameSetup';
import { GameScreen } from '@/components/game/GameScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { LeaderboardScreen } from '@/components/screens/LeaderboardScreen';
import { MultiplayerLobby } from '@/components/screens/MultiplayerLobby';
import { useGameStore } from '@/store/gameStore';

import { useAuth } from '@/hooks/useAuth';
import { Country } from '@/types/game';
import { toast } from 'sonner';

type Screen = 'menu' | 'countrySelection' | 'gameSetup' | 'game' | 'settings' | 'auth' | 'leaderboard' | 'multiplayer';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const { selectedCountry, setSelectedCountry, setGameSettings } = useGameStore();
  const { user, isLoading } = useAuth();

  // Redirect to menu after login
  useEffect(() => {
    if (user && currentScreen === 'auth') {
      setCurrentScreen('menu');
    }
  }, [user, currentScreen]);

  const handlePlayOnline = () => {
    setCurrentScreen('multiplayer');
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

  const handleLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleProfile = () => {
    if (user) {
      toast.info('Perfil', {
        description: 'Painel de perfil será implementado em breve!',
      });
    } else {
      setCurrentScreen('auth');
    }
  };

  const handleCountrySelected = (country: Country) => {
    setSelectedCountry(country);
    setGameSettings({ mode: 'singlePlayer' });
    setCurrentScreen('gameSetup');
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleMultiplayerStartGame = (roomId: string) => {
    // For now, start single player game with selected settings
    // In full implementation, this would sync with the room
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleBackToCountrySelection = () => {
    setCurrentScreen('countrySelection');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('menu');
  };

  const handleLoginFromLobby = () => {
    setCurrentScreen('auth');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  switch (currentScreen) {
    case 'auth':
      return (
        <AuthScreen
          onBack={handleBackToMenu}
          onSuccess={handleAuthSuccess}
        />
      );

    case 'leaderboard':
      return (
        <LeaderboardScreen
          onBack={handleBackToMenu}
        />
      );

    case 'multiplayer':
      return (
        <MultiplayerLobby
          onBack={handleBackToMenu}
          onStartGame={handleMultiplayerStartGame}
          onLogin={handleLoginFromLobby}
        />
      );

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
          onLeaderboard={handleLeaderboard}
          onProfile={handleProfile}
        />
      );
  }
};

export default Index;
