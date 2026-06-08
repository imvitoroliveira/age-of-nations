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
      achievements: {
        Row: {
          category: string
          created_at: string | null
          description: string
          icon: string
          id: string
          key: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          key: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          key?: string
          title?: string
        }
        Relationships: []
      }
      activity_progress: {
        Row: {
          best_streak: number | null
          category: string
          child_id: string
          correct_count: number | null
          created_at: string | null
          id: string
          last_played_at: string | null
          stars_earned: number | null
          streak: number | null
          total_count: number | null
          updated_at: string | null
        }
        Insert: {
          best_streak?: number | null
          category: string
          child_id: string
          correct_count?: number | null
          created_at?: string | null
          id?: string
          last_played_at?: string | null
          stars_earned?: number | null
          streak?: number | null
          total_count?: number | null
          updated_at?: string | null
        }
        Update: {
          best_streak?: number | null
          category?: string
          child_id?: string
          correct_count?: number | null
          created_at?: string | null
          id?: string
          last_played_at?: string | null
          stars_earned?: number | null
          streak?: number | null
          total_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      body_measurements: {
        Row: {
          arm_cm: number | null
          chest_cm: number | null
          created_at: string | null
          hip_cm: number | null
          id: string
          recorded_at: string
          thigh_cm: number | null
          user_id: string
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          arm_cm?: number | null
          chest_cm?: number | null
          created_at?: string | null
          hip_cm?: number | null
          id?: string
          recorded_at?: string
          thigh_cm?: number | null
          user_id: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          arm_cm?: number | null
          chest_cm?: number | null
          created_at?: string | null
          hip_cm?: number | null
          id?: string
          recorded_at?: string
          thigh_cm?: number | null
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "body_measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: number
          age_group: string
          avatar_accessories: Json | null
          avatar_emoji: string
          created_at: string | null
          farm_items: Json | null
          id: string
          level: number | null
          name: string
          parent_id: string
          total_stars: number | null
          updated_at: string | null
        }
        Insert: {
          age?: number
          age_group?: string
          avatar_accessories?: Json | null
          avatar_emoji?: string
          created_at?: string | null
          farm_items?: Json | null
          id?: string
          level?: number | null
          name: string
          parent_id: string
          total_stars?: number | null
          updated_at?: string | null
        }
        Update: {
          age?: number
          age_group?: string
          avatar_accessories?: Json | null
          avatar_emoji?: string
          created_at?: string | null
          farm_items?: Json | null
          id?: string
          level?: number | null
          name?: string
          parent_id?: string
          total_stars?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          activities_completed: number | null
          child_id: string
          id: string
          seconds_used: number | null
          updated_at: string | null
          usage_date: string
        }
        Insert: {
          activities_completed?: number | null
          child_id: string
          id?: string
          seconds_used?: number | null
          updated_at?: string | null
          usage_date?: string
        }
        Update: {
          activities_completed?: number | null
          child_id?: string
          id?: string
          seconds_used?: number | null
          updated_at?: string | null
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_usage_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string | null
          id: string
          name: string
          notes: string | null
          order_index: number
          reps: string
          rest_seconds: number | null
          sets: number
          weight_kg: number | null
          workout_plan_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          order_index: number
          reps: string
          rest_seconds?: number | null
          sets: number
          weight_kg?: number | null
          workout_plan_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          order_index?: number
          reps?: string
          rest_seconds?: number | null
          sets?: number
          weight_kg?: number | null
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          display_name: string | null
          fitness_goals: string[] | null
          gender: string | null
          goal: string | null
          height: number | null
          height_cm: number | null
          id: string
          initial_weight: number | null
          is_premium: boolean | null
          pairing_code: string | null
          parent_pin: string | null
          partner_id: string | null
          partner_name: string | null
          premium_until: string | null
          theme_preference: string | null
          tracking_code: string | null
          updated_at: string | null
          username: string
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          display_name?: string | null
          fitness_goals?: string[] | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          height_cm?: number | null
          id: string
          initial_weight?: number | null
          is_premium?: boolean | null
          pairing_code?: string | null
          parent_pin?: string | null
          partner_id?: string | null
          partner_name?: string | null
          premium_until?: string | null
          theme_preference?: string | null
          tracking_code?: string | null
          updated_at?: string | null
          username: string
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          display_name?: string | null
          fitness_goals?: string[] | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          height_cm?: number | null
          id?: string
          initial_weight?: number | null
          is_premium?: boolean | null
          pairing_code?: string | null
          parent_pin?: string | null
          partner_id?: string | null
          partner_name?: string | null
          premium_until?: string | null
          theme_preference?: string | null
          tracking_code?: string | null
          updated_at?: string | null
          username?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screen_time_settings: {
        Row: {
          break_duration_minutes: number | null
          break_interval_minutes: number | null
          child_id: string
          created_at: string | null
          daily_limit_minutes: number | null
          id: string
        }
        Insert: {
          break_duration_minutes?: number | null
          break_interval_minutes?: number | null
          child_id: string
          created_at?: string | null
          daily_limit_minutes?: number | null
          id?: string
        }
        Update: {
          break_duration_minutes?: number | null
          break_interval_minutes?: number | null
          child_id?: string
          created_at?: string | null
          daily_limit_minutes?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "screen_time_settings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          assigned_to: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          muscle_groups: string[] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          assigned_to: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          muscle_groups?: string[] | null
          name: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          muscle_groups?: string[] | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          duration_minutes: number | null
          finished_at: string | null
          id: string
          notes: string | null
          started_at: string | null
          user_id: string
          workout_plan_id: string | null
        }
        Insert: {
          duration_minutes?: number | null
          finished_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          user_id: string
          workout_plan_id?: string | null
        }
        Update: {
          duration_minutes?: number | null
          finished_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          user_id?: string
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_profile_by_code: {
        Args: { search_code: string }
        Returns: {
          avatar_url: string
          display_name: string
          id: string
          username: string
        }[]
      }
      generate_pairing_code: { Args: never; Returns: string }
      generate_tracking_code: { Args: never; Returns: string }
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
