import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { COUNTRIES } from '@/data/countries';
import { cn } from '@/lib/utils';

interface LeaderboardPlayer {
  id: string;
  username: string;
  country_id: string;
  wins: number;
  losses: number;
  games_played: number;
  rank_points: number;
  total_score: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen = ({ onBack }: LeaderboardScreenProps) => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rank_points' | 'wins' | 'games_played'>('rank_points');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, country_id, wins, losses, games_played, rank_points, total_score')
      .order(sortBy, { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching leaderboard:', error);
    } else {
      setPlayers(data || []);
    }
    
    setIsLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankTier = (points: number) => {
    if (points >= 2000) return { name: 'Imperador', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (points >= 1500) return { name: 'Rei', color: 'text-purple-400', bg: 'bg-purple-400/20' };
    if (points >= 1200) return { name: 'Duque', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (points >= 1000) return { name: 'Cavaleiro', color: 'text-green-400', bg: 'bg-green-400/20' };
    return { name: 'Aldeão', color: 'text-gray-400', bg: 'bg-gray-400/20' };
  };

  const getWinRate = (wins: number, gamesPlayed: number) => {
    if (gamesPlayed === 0) return '0%';
    return `${Math.round((wins / gamesPlayed) * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="game-title text-4xl md:text-5xl mb-4">🏆 Ranking Global</h1>
          <p className="text-muted-foreground text-lg">
            Os melhores estrategistas do mundo
          </p>
        </div>

        {/* Sort Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { key: 'rank_points', label: 'Pontos' },
            { key: 'wins', label: 'Vitórias' },
            { key: 'games_played', label: 'Partidas' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key as typeof sortBy)}
              className={cn(
                'px-4 py-2 rounded-lg font-cinzel text-sm transition-all',
                sortBy === tab.key
                  ? 'bg-gold text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="game-panel overflow-hidden animate-scale-in">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando ranking...</p>
            </div>
          ) : players.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">Nenhum jogador ainda</p>
              <p className="text-muted-foreground text-sm">Seja o primeiro a jogar!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-3 text-left text-xs font-cinzel text-muted-foreground uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-cinzel text-muted-foreground uppercase tracking-wider">Jogador</th>
                    <th className="px-4 py-3 text-center text-xs font-cinzel text-muted-foreground uppercase tracking-wider">Tier</th>
                    <th className="px-4 py-3 text-center text-xs font-cinzel text-muted-foreground uppercase tracking-wider">Pontos</th>
                    <th className="px-4 py-3 text-center text-xs font-cinzel text-muted-foreground uppercase tracking-wider">V/D</th>
                    <th className="px-4 py-3 text-center text-xs font-cinzel text-muted-foreground uppercase tracking-wider">Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => {
                    const tier = getRankTier(player.rank_points);
                    const country = COUNTRIES[player.country_id as keyof typeof COUNTRIES];
                    
                    return (
                      <tr 
                        key={player.id}
                        className={cn(
                          'border-b border-border/30 transition-colors hover:bg-muted/30',
                          index < 3 && 'bg-gold/5'
                        )}
                      >
                        <td className="px-4 py-4">
                          <span className={cn(
                            'text-lg font-bold',
                            index === 0 && 'text-yellow-400',
                            index === 1 && 'text-gray-300',
                            index === 2 && 'text-amber-600'
                          )}>
                            {getRankIcon(index)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{country?.flag || '🏳️'}</span>
                            <span className="font-medium text-foreground">{player.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn('px-2 py-1 rounded text-xs font-medium', tier.bg, tier.color)}>
                            {tier.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold text-gold">
                          {player.rank_points.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-green-400">{player.wins}</span>
                          <span className="text-muted-foreground mx-1">/</span>
                          <span className="text-red-400">{player.losses}</span>
                        </td>
                        <td className="px-4 py-4 text-center text-muted-foreground">
                          {getWinRate(player.wins, player.games_played)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
    </div>
  );
};
