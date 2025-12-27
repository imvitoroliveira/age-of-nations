import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useGameRooms, GameRoom } from '@/hooks/useGameRooms';
import { COUNTRIES } from '@/data/countries';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MultiplayerLobbyProps {
  onBack: () => void;
  onStartGame: (roomId: string) => void;
  onLogin: () => void;
}

export const MultiplayerLobby = ({ onBack, onStartGame, onLogin }: MultiplayerLobbyProps) => {
  const { user, profile } = useAuth();
  const {
    rooms,
    currentRoom,
    roomPlayers,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    updateCountry,
    startGame,
  } = useGameRooms();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(profile?.country_id || 'usa');

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="game-panel p-8 text-center max-w-md animate-scale-in">
          <h2 className="game-title text-3xl mb-4">Multiplayer Online</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para jogar online
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="gameOutline" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="game" onClick={onLogin}>
              Entrar / Criar Conta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If in a room, show room view
  if (currentRoom) {
    const isHost = currentRoom.host_id === user.id;
    const currentPlayer = roomPlayers.find(p => p.player_id === user.id);
    const allReady = roomPlayers.length > 1 && roomPlayers.every(p => p.is_ready);

    const handleStartGame = async () => {
      const success = await startGame();
      if (success) {
        onStartGame(currentRoom.id);
      }
    };

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          {/* Room Header */}
          <div className="game-panel p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="game-title text-2xl mb-1">{currentRoom.name}</h1>
                <p className="text-muted-foreground text-sm">
                  {roomPlayers.length}/{currentRoom.max_players} jogadores
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn(
                  'px-3 py-1 rounded text-sm font-medium',
                  currentRoom.status === 'waiting' ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold'
                )}>
                  {currentRoom.status === 'waiting' ? 'Aguardando' : 'Iniciando'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Players List */}
            <div className="lg:col-span-2">
              <div className="game-panel p-6 animate-scale-in">
                <h2 className="font-cinzel text-lg text-gold mb-4">Jogadores</h2>
                <div className="space-y-3">
                  {roomPlayers.map((player) => {
                    const country = COUNTRIES[player.country_id as keyof typeof COUNTRIES];
                    const isCurrentPlayer = player.player_id === user.id;
                    
                    return (
                      <div
                        key={player.id}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border-2 transition-all',
                          isCurrentPlayer ? 'border-gold bg-gold/10' : 'border-border bg-muted/30',
                          player.is_ready && 'ring-2 ring-green-500/50'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{country?.flag || '🏳️'}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {player.profile?.username || 'Jogador'}
                              </span>
                              {player.player_id === currentRoom.host_id && (
                                <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded">
                                  Host
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {player.profile?.rank_points || 1000} pontos
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {player.is_ready ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                              ✓ Pronto
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded">
                              Aguardando
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty slots */}
                  {Array.from({ length: currentRoom.max_players - roomPlayers.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-border/50 text-muted-foreground"
                    >
                      Aguardando jogador...
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings & Actions */}
            <div className="space-y-6">
              {/* Country Selection */}
              <div className="game-panel p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="font-cinzel text-lg text-gold mb-4">Sua Civilização</h2>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(COUNTRIES).map((country) => (
                    <button
                      key={country.id}
                      onClick={() => {
                        setSelectedCountry(country.id);
                        updateCountry(country.id);
                      }}
                      className={cn(
                        'p-2 rounded transition-all text-2xl',
                        selectedCountry === country.id
                          ? 'bg-gold/20 ring-2 ring-gold scale-110'
                          : 'bg-muted/30 hover:bg-muted/50'
                      )}
                      title={country.name}
                    >
                      {country.flag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Settings */}
              <div className="game-panel p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="font-cinzel text-lg text-gold mb-4">Configurações</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mapa:</span>
                    <span className="text-foreground capitalize">{currentRoom.map_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recursos:</span>
                    <span className="text-foreground capitalize">{currentRoom.starting_resources}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant={currentPlayer?.is_ready ? 'gameOutline' : 'game'}
                  size="lg"
                  className="w-full"
                  onClick={toggleReady}
                >
                  {currentPlayer?.is_ready ? 'Cancelar' : '✓ Estou Pronto'}
                </Button>

                {isHost && (
                  <Button
                    variant="game"
                    size="lg"
                    className="w-full pulse-glow"
                    onClick={handleStartGame}
                    disabled={!allReady}
                  >
                    {allReady ? '⚔️ Iniciar Partida' : 'Aguardando jogadores...'}
                  </Button>
                )}

                <Button
                  variant="gameGhost"
                  size="lg"
                  className="w-full"
                  onClick={leaveRoom}
                >
                  Sair da Sala
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Room list view
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Digite um nome para a sala');
      return;
    }

    const room = await createRoom(newRoomName, {
      max_players: 2,
      map_size: 'medium',
      starting_resources: 'medium',
    });

    if (room) {
      setShowCreateModal(false);
      setNewRoomName('');
      toast.success('Sala criada!');
    }
  };

  const handleJoinRoom = async (room: GameRoom) => {
    const success = await joinRoom(room.id, selectedCountry);
    if (success) {
      toast.success('Você entrou na sala!');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="game-title text-4xl md:text-5xl mb-4">🌐 Multiplayer Online</h1>
          <p className="text-muted-foreground text-lg">
            Encontre ou crie uma sala para jogar
          </p>
        </div>

        {/* Player Info */}
        <div className="game-panel p-4 mb-6 flex items-center justify-between animate-scale-in">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{COUNTRIES[profile?.country_id as keyof typeof COUNTRIES]?.flag || '🏳️'}</span>
            <div>
              <p className="font-medium text-foreground">{profile?.username}</p>
              <p className="text-sm text-muted-foreground">{profile?.rank_points || 1000} pontos</p>
            </div>
          </div>
          <Button variant="game" onClick={() => setShowCreateModal(true)}>
            + Criar Sala
          </Button>
        </div>

        {/* Rooms List */}
        <div className="game-panel animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 border-b border-border/50">
            <h2 className="font-cinzel text-lg text-gold">Salas Disponíveis</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando salas...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">Nenhuma sala disponível</p>
              <p className="text-muted-foreground text-sm">Crie uma sala para começar!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {rooms.map((room) => {
                const playerCount = room.players?.length || 0;
                
                return (
                  <div
                    key={room.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center text-2xl">
                        🏰
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{room.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {playerCount}/{room.max_players} jogadores • {room.map_size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="gameOutline"
                      onClick={() => handleJoinRoom(room)}
                      disabled={playerCount >= room.max_players}
                    >
                      {playerCount >= room.max_players ? 'Cheio' : 'Entrar'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button variant="gameOutline" size="lg" onClick={onBack}>
            ← Voltar ao Menu
          </Button>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="game-panel p-6 w-full max-w-md animate-scale-in">
            <h2 className="font-cinzel text-xl text-gold mb-4">Criar Nova Sala</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Nome da Sala
              </label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: Batalha Épica"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="gameOutline"
                className="flex-1"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="game"
                className="flex-1"
                onClick={handleCreateRoom}
              >
                Criar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
