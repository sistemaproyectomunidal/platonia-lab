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
      corpus_entries: {
        Row: {
          axes: string[] | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          related_nodes: string[] | null
          slug: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          axes?: string[] | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          related_nodes?: string[] | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          axes?: string[] | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          related_nodes?: string[] | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          created_at: string
          filename: string
          id: string
          mime_type: string
          original_name: string
          public_url: string | null
          size_bytes: number
          storage_path: string
          storage_provider: string | null
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          mime_type: string
          original_name: string
          public_url?: string | null
          size_bytes: number
          storage_path: string
          storage_provider?: string | null
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          original_name?: string
          public_url?: string | null
          size_bytes?: number
          storage_path?: string
          storage_provider?: string | null
        }
        Relationships: []
      }
      lab_demos: {
        Row: {
          ai_response: string | null
          axes: string[] | null
          created_at: string
          id: string
          matched_nodes: string[] | null
          prompt: string
          questions: Json | null
          summary: string
        }
        Insert: {
          ai_response?: string | null
          axes?: string[] | null
          created_at?: string
          id?: string
          matched_nodes?: string[] | null
          prompt: string
          questions?: Json | null
          summary: string
        }
        Update: {
          ai_response?: string | null
          axes?: string[] | null
          created_at?: string
          id?: string
          matched_nodes?: string[] | null
          prompt?: string
          questions?: Json | null
          summary?: string
        }
        Relationships: []
      }
      map_nodes: {
        Row: {
          axis: string
          created_at: string
          description: string | null
          id: string
          label: string
          position_x: number | null
          position_y: number | null
        }
        Insert: {
          axis: string
          created_at?: string
          description?: string | null
          id: string
          label: string
          position_x?: number | null
          position_y?: number | null
        }
        Update: {
          axis?: string
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          position_x?: number | null
          position_y?: number | null
        }
        Relationships: []
      }
      podcast_episodes: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          duration: number | null
          episode_number: number
          id: string
          is_published: boolean | null
          published_at: string | null
          title: string
          transcript_key: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          episode_number: number
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title: string
          transcript_key?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          episode_number?: number
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          transcript_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      socratic_questions: {
        Row: {
          axis: string
          created_at: string
          id: string
          related_nodes: string[] | null
          text: string
        }
        Insert: {
          axis: string
          created_at?: string
          id: string
          related_nodes?: string[] | null
          text: string
        }
        Update: {
          axis?: string
          created_at?: string
          id?: string
          related_nodes?: string[] | null
          text?: string
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
