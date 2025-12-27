export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      game_room_players: {
        Row: {
          country_id: string
          id: string
          is_ready: boolean | null
          joined_at: string | null
          player_id: string | null
          room_id: string | null
          team: number | null
        }
        Insert: {
          country_id: string
          id?: string
          is_ready?: boolean | null
          joined_at?: string | null
          player_id?: string | null
          room_id?: string | null
          team?: number | null
        }
        Update: {
          country_id?: string
          id?: string
          is_ready?: boolean | null
          joined_at?: string | null
          player_id?: string | null
          room_id?: string | null
          team?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_room_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_room_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          ai_difficulty: string | null
          created_at: string | null
          finished_at: string | null
          host_id: string | null
          id: string
          map_size: string | null
          max_players: number | null
          name: string
          started_at: string | null
          starting_resources: string | null
          status: string | null
        }
        Insert: {
          ai_difficulty?: string | null
          created_at?: string | null
          finished_at?: string | null
          host_id?: string | null
          id?: string
          map_size?: string | null
          max_players?: number | null
          name: string
          started_at?: string | null
          starting_resources?: string | null
          status?: string | null
        }
        Update: {
          ai_difficulty?: string | null
          created_at?: string | null
          finished_at?: string | null
          host_id?: string | null
          id?: string
          map_size?: string | null
          max_players?: number | null
          name?: string
          started_at?: string | null
          starting_resources?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_history: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          id: string
          room_id: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          room_id?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          room_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_players: {
        Row: {
          buildings_created: number | null
          buildings_lost: number | null
          country_id: string
          id: string
          is_winner: boolean | null
          match_id: string | null
          player_id: string | null
          resources_gathered: Json | null
          score: number | null
          units_created: number | null
          units_lost: number | null
        }
        Insert: {
          buildings_created?: number | null
          buildings_lost?: number | null
          country_id: string
          id?: string
          is_winner?: boolean | null
          match_id?: string | null
          player_id?: string | null
          resources_gathered?: Json | null
          score?: number | null
          units_created?: number | null
          units_lost?: number | null
        }
        Update: {
          buildings_created?: number | null
          buildings_lost?: number | null
          country_id?: string
          id?: string
          is_winner?: boolean | null
          match_id?: string | null
          player_id?: string | null
          resources_gathered?: Json | null
          score?: number | null
          units_created?: number | null
          units_lost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_id: string | null
          created_at: string | null
          games_played: number | null
          id: string
          losses: number | null
          rank_points: number | null
          total_score: number | null
          updated_at: string | null
          username: string
          wins: number | null
        }
        Insert: {
          avatar_url?: string | null
          country_id?: string | null
          created_at?: string | null
          games_played?: number | null
          id: string
          losses?: number | null
          rank_points?: number | null
          total_score?: number | null
          updated_at?: string | null
          username: string
          wins?: number | null
        }
        Update: {
          avatar_url?: string | null
          country_id?: string | null
          created_at?: string | null
          games_played?: number | null
          id?: string
          losses?: number | null
          rank_points?: number | null
          total_score?: number | null
          updated_at?: string | null
          username?: string
          wins?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
