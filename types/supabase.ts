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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          description: string
          icon: string
          name: string
          threshold: number
        }
        Insert: {
          code: string
          description: string
          icon: string
          name: string
          threshold?: number
        }
        Update: {
          code?: string
          description?: string
          icon?: string
          name?: string
          threshold?: number
        }
        Relationships: []
      }
      attendances: {
        Row: {
          checked_in_at: string
          created_at: string
          gym_id: string
          id: string
          member_id: string
          source: Database["public"]["Enums"]["attendance_source"]
        }
        Insert: {
          checked_in_at?: string
          created_at?: string
          gym_id: string
          id?: string
          member_id: string
          source?: Database["public"]["Enums"]["attendance_source"]
        }
        Update: {
          checked_in_at?: string
          created_at?: string
          gym_id?: string
          id?: string
          member_id?: string
          source?: Database["public"]["Enums"]["attendance_source"]
        }
        Relationships: [
          {
            foreignKeyName: "attendances_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          entity: string
          entity_id: string | null
          gym_id: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          entity: string
          entity_id?: string | null
          gym_id: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          gym_id?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      class_bookings: {
        Row: {
          class_id: string
          created_at: string
          gym_id: string
          id: string
          member_id: string
          status: Database["public"]["Enums"]["class_booking_status"]
        }
        Insert: {
          class_id: string
          created_at?: string
          gym_id: string
          id?: string
          member_id: string
          status?: Database["public"]["Enums"]["class_booking_status"]
        }
        Update: {
          class_id?: string
          created_at?: string
          gym_id?: string
          id?: string
          member_id?: string
          status?: Database["public"]["Enums"]["class_booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number
          ends_at: string
          gym_id: string
          id: string
          name: string
          starts_at: string
          trainer_id: string
        }
        Insert: {
          capacity?: number
          ends_at: string
          gym_id: string
          id?: string
          name: string
          starts_at: string
          trainer_id: string
        }
        Update: {
          capacity?: number
          ends_at?: string
          gym_id?: string
          id?: string
          name?: string
          starts_at?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
          phone: string
          plan: Database["public"]["Enums"]["gym_plan"]
          slug: string
          stripe_customer_id: string | null
          subscription_status: Database["public"]["Enums"]["gym_subscription_status"]
          timezone: string
          trial_ends_at: string | null
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          phone: string
          plan?: Database["public"]["Enums"]["gym_plan"]
          slug: string
          stripe_customer_id?: string | null
          subscription_status?: Database["public"]["Enums"]["gym_subscription_status"]
          timezone?: string
          trial_ends_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string
          plan?: Database["public"]["Enums"]["gym_plan"]
          slug?: string
          stripe_customer_id?: string | null
          subscription_status?: Database["public"]["Enums"]["gym_subscription_status"]
          timezone?: string
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      member_achievements: {
        Row: {
          achievement_code: string
          gym_id: string
          id: string
          member_id: string
          unlocked_at: string
        }
        Insert: {
          achievement_code: string
          gym_id: string
          id?: string
          member_id: string
          unlocked_at?: string
        }
        Update: {
          achievement_code?: string
          gym_id?: string
          id?: string
          member_id?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_achievements_achievement_code_fkey"
            columns: ["achievement_code"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "member_achievements_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_achievements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          assigned_routine_id: string | null
          assigned_trainer_id: string | null
          birth_date: string | null
          created_at: string
          email: string
          full_name: string
          goal: string
          gym_id: string
          id: string
          joined_at: string
          last_attendance_at: string | null
          membership_expires_at: string
          phone: string
          profile_id: string | null
          risk_band: Database["public"]["Enums"]["risk_band"]
          risk_score: number
          status: Database["public"]["Enums"]["member_status"]
        }
        Insert: {
          assigned_routine_id?: string | null
          assigned_trainer_id?: string | null
          birth_date?: string | null
          created_at?: string
          email: string
          full_name: string
          goal: string
          gym_id: string
          id?: string
          joined_at?: string
          last_attendance_at?: string | null
          membership_expires_at: string
          phone: string
          profile_id?: string | null
          risk_band?: Database["public"]["Enums"]["risk_band"]
          risk_score?: number
          status?: Database["public"]["Enums"]["member_status"]
        }
        Update: {
          assigned_routine_id?: string | null
          assigned_trainer_id?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string
          full_name?: string
          goal?: string
          gym_id?: string
          id?: string
          joined_at?: string
          last_attendance_at?: string | null
          membership_expires_at?: string
          phone?: string
          profile_id?: string | null
          risk_band?: Database["public"]["Enums"]["risk_band"]
          risk_score?: number
          status?: Database["public"]["Enums"]["member_status"]
        }
        Relationships: [
          {
            foreignKeyName: "members_assigned_routine_id_fkey"
            columns: ["assigned_routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_assigned_trainer_id_fkey"
            columns: ["assigned_trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_by: string
          currency: string
          gym_id: string
          id: string
          member_id: string
          method: Database["public"]["Enums"]["payment_method"]
          paid_at: string
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          created_by: string
          currency?: string
          gym_id: string
          id?: string
          member_id: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          created_by?: string
          currency?: string
          gym_id?: string
          id?: string
          member_id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          gym_id: string
          id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          gym_id: string
          id?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          gym_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          gym_id: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          gym_id?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          gym_id?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_entries: {
        Row: {
          arm_cm: number | null
          body_fat_pct: number | null
          chest_cm: number | null
          gym_id: string
          hip_cm: number | null
          id: string
          member_id: string
          notes: string | null
          photo_url: string | null
          recorded_at: string
          thigh_cm: number | null
          waist_cm: number | null
          weight_kg: number
        }
        Insert: {
          arm_cm?: number | null
          body_fat_pct?: number | null
          chest_cm?: number | null
          gym_id: string
          hip_cm?: number | null
          id?: string
          member_id: string
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string
          thigh_cm?: number | null
          waist_cm?: number | null
          weight_kg: number
        }
        Update: {
          arm_cm?: number | null
          body_fat_pct?: number | null
          chest_cm?: number | null
          gym_id?: string
          hip_cm?: number | null
          id?: string
          member_id?: string
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string
          thigh_cm?: number | null
          waist_cm?: number | null
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_entries_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_entries_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          gym_id: string
          id: string
          is_active: boolean
          member_id: string
          routine_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          gym_id: string
          id?: string
          is_active?: boolean
          member_id: string
          routine_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          gym_id?: string
          id?: string
          is_active?: boolean
          member_id?: string
          routine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_assignments_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_assignments_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_exercises: {
        Row: {
          day_index: number
          exercise_name: string
          id: string
          notes: string | null
          order_index: number
          reps: string
          rest_seconds: number
          routine_id: string
          sets: number
          video_url: string | null
        }
        Insert: {
          day_index?: number
          exercise_name: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: string
          rest_seconds?: number
          routine_id: string
          sets?: number
          video_url?: string | null
        }
        Update: {
          day_index?: number
          exercise_name?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: string
          rest_seconds?: number
          routine_id?: string
          sets?: number
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string
          created_by: string
          days_per_week: number
          description: string
          gym_id: string
          id: string
          level: Database["public"]["Enums"]["routine_level"]
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          days_per_week?: number
          description: string
          gym_id: string
          id?: string
          level?: Database["public"]["Enums"]["routine_level"]
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          days_per_week?: number
          description?: string
          gym_id?: string
          id?: string
          level?: Database["public"]["Enums"]["routine_level"]
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "routines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routines_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          comment: string | null
          created_at: string
          difficulty: number
          gym_id: string
          id: string
          member_id: string
          mood: number
          workout_log_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          difficulty: number
          gym_id: string
          id?: string
          member_id: string
          mood: number
          workout_log_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          difficulty?: number
          gym_id?: string
          id?: string
          member_id?: string
          mood?: number
          workout_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surveys_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string
          day_index: number
          duration_minutes: number
          gym_id: string
          id: string
          member_id: string
          routine_id: string
        }
        Insert: {
          completed_at?: string
          day_index?: number
          duration_minutes?: number
          gym_id: string
          id?: string
          member_id: string
          routine_id: string
        }
        Update: {
          completed_at?: string
          day_index?: number
          duration_minutes?: number
          gym_id?: string
          id?: string
          member_id?: string
          routine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_gym_id: { Args: never; Returns: string }
      auth_member_id: { Args: never; Returns: string }
      auth_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      attendance_source: "staff" | "self"
      class_booking_status: "booked" | "cancelled" | "attended"
      gym_plan: "free" | "starter" | "pro" | "enterprise"
      gym_subscription_status: "trialing" | "active" | "past_due" | "canceled"
      member_status: "active" | "paused" | "churned"
      payment_method: "cash" | "transfer" | "card"
      payment_status: "paid" | "pending" | "failed"
      risk_band: "saludable" | "atencion" | "en_riesgo"
      routine_level: "principiante" | "intermedio" | "avanzado"
      user_role: "superadmin" | "owner" | "trainer" | "member"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      attendance_source: ["staff", "self"],
      class_booking_status: ["booked", "cancelled", "attended"],
      gym_plan: ["free", "starter", "pro", "enterprise"],
      gym_subscription_status: ["trialing", "active", "past_due", "canceled"],
      member_status: ["active", "paused", "churned"],
      payment_method: ["cash", "transfer", "card"],
      payment_status: ["paid", "pending", "failed"],
      risk_band: ["saludable", "atencion", "en_riesgo"],
      routine_level: ["principiante", "intermedio", "avanzado"],
      user_role: ["superadmin", "owner", "trainer", "member"],
    },
  },
} as const
