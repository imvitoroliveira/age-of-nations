import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface GameRoom {
  id: string;
  name: string;
  host_id: string;
  status: 'waiting' | 'starting' | 'in_progress' | 'finished';
  max_players: number;
  map_size: string;
  ai_difficulty: string;
  starting_resources: string;
  created_at: string;
  players?: RoomPlayer[];
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  player_id: string;
  country_id: string;
  team: number;
  is_ready: boolean;
  joined_at: string;
  profile?: {
    username: string;
    rank_points: number;
  };
}

export const useGameRooms = () => {
  const { user, profile } = useAuth();
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [roomPlayers, setRoomPlayers] = useState<RoomPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use ref to avoid subscription recreation
  const currentRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentRoomIdRef.current = currentRoom?.id || null;
  }, [currentRoom]);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('game_rooms')
      .select(`*, players:game_room_players(*, profile:profiles(username, rank_points))`)
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
    } else {
      setRooms((data || []) as unknown as GameRoom[]);
    }
    setIsLoading(false);
  }, []);

  const fetchCurrentRoom = useCallback(async (roomId: string) => {
    const { data: roomData, error: roomError } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) {
      console.error('Error fetching room:', roomError);
      return;
    }
    setCurrentRoom(roomData as unknown as GameRoom);

    const { data: playersData, error: playersError } = await supabase
      .from('game_room_players')
      .select(`*, profile:profiles(username, rank_points)`)
      .eq('room_id', roomId);

    if (playersError) {
      console.error('Error fetching room players:', playersError);
    } else {
      setRoomPlayers(playersData || []);
    }
  }, []);

  const createRoom = async (name: string, settings: {
    max_players?: number;
    map_size?: string;
    ai_difficulty?: string;
    starting_resources?: string;
  }) => {
    if (!user || !profile) {
      toast.error('Você precisa estar logado para criar uma sala');
      return null;
    }

    const { data, error } = await supabase
      .from('game_rooms')
      .insert({
        name,
        host_id: user.id,
        max_players: settings.max_players || 2,
        map_size: settings.map_size || 'medium',
        ai_difficulty: settings.ai_difficulty || 'medium',
        starting_resources: settings.starting_resources || 'medium',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      toast.error('Erro ao criar sala');
      return null;
    }

    await joinRoom(data.id, profile.country_id);
    return data;
  };

  const joinRoom = async (roomId: string, countryId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para entrar na sala');
      return false;
    }

    // Check if room is full before joining
    const { data: roomData } = await supabase
      .from('game_rooms')
      .select('max_players')
      .eq('id', roomId)
      .single();

    const { count } = await supabase
      .from('game_room_players')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    if (roomData && count !== null && count >= (roomData.max_players || 2)) {
      toast.error('Sala cheia!');
      return false;
    }

    const { error } = await supabase
      .from('game_room_players')
      .insert({
        room_id: roomId,
        player_id: user.id,
        country_id: countryId,
      });

    if (error) {
      if (error.message.includes('duplicate')) {
        toast.error('Você já está nesta sala');
      } else {
        console.error('Error joining room:', error);
        toast.error('Erro ao entrar na sala');
      }
      return false;
    }

    await fetchCurrentRoom(roomId);
    return true;
  };

  const leaveRoom = async () => {
    if (!user || !currentRoom) return;

    const { error } = await supabase
      .from('game_room_players')
      .delete()
      .eq('room_id', currentRoom.id)
      .eq('player_id', user.id);

    if (error) {
      console.error('Error leaving room:', error);
      toast.error('Erro ao sair da sala');
      return;
    }

    if (currentRoom.host_id === user.id) {
      await supabase.from('game_rooms').delete().eq('id', currentRoom.id);
    }

    setCurrentRoom(null);
    setRoomPlayers([]);
  };

  const toggleReady = async () => {
    if (!user || !currentRoom) return;
    const currentPlayer = roomPlayers.find(p => p.player_id === user.id);
    if (!currentPlayer) return;

    const { error } = await supabase
      .from('game_room_players')
      .update({ is_ready: !currentPlayer.is_ready })
      .eq('id', currentPlayer.id);

    if (error) {
      console.error('Error toggling ready:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const updateCountry = async (countryId: string) => {
    if (!user || !currentRoom) return;
    const currentPlayer = roomPlayers.find(p => p.player_id === user.id);
    if (!currentPlayer) return;

    const { error } = await supabase
      .from('game_room_players')
      .update({ country_id: countryId })
      .eq('id', currentPlayer.id);

    if (error) {
      console.error('Error updating country:', error);
      toast.error('Erro ao atualizar país');
    }
  };

  const startGame = async () => {
    if (!user || !currentRoom || currentRoom.host_id !== user.id) return false;

    const allReady = roomPlayers.every(p => p.is_ready);
    if (!allReady) {
      toast.error('Todos os jogadores precisam estar prontos');
      return false;
    }

    const { error } = await supabase
      .from('game_rooms')
      .update({ status: 'starting', started_at: new Date().toISOString() })
      .eq('id', currentRoom.id);

    if (error) {
      console.error('Error starting game:', error);
      toast.error('Erro ao iniciar partida');
      return false;
    }
    return true;
  };

  // Realtime subscriptions - FIXED: no currentRoom dependency
  useEffect(() => {
    const roomsChannel = supabase
      .channel('rooms-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game_rooms' },
        () => {
          fetchRooms();
          if (currentRoomIdRef.current) {
            fetchCurrentRoom(currentRoomIdRef.current);
          }
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel('players-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game_room_players' },
        () => {
          if (currentRoomIdRef.current) {
            fetchCurrentRoom(currentRoomIdRef.current);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [fetchRooms, fetchCurrentRoom]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms, currentRoom, roomPlayers, isLoading,
    fetchRooms, createRoom, joinRoom, leaveRoom,
    toggleReady, updateCountry, startGame, fetchCurrentRoom,
  };
};
