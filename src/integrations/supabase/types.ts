export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          agent_status: string
          channel_id: string | null
          client_id: string | null
          created_at: string | null
          creators_influencers: string | null
          formats: string | null
          id: string
          message_hook: string | null
          objective_id: string | null
          status: string
          target_audience: string | null
          targeting: string | null
          titel: string
          tone_style: string | null
        }
        Insert: {
          agent_status?: string
          channel_id?: string | null
          client_id?: string | null
          created_at?: string | null
          creators_influencers?: string | null
          formats?: string | null
          id?: string
          message_hook?: string | null
          objective_id?: string | null
          status?: string
          target_audience?: string | null
          targeting?: string | null
          titel: string
          tone_style?: string | null
        }
        Update: {
          agent_status?: string
          channel_id?: string | null
          client_id?: string | null
          created_at?: string | null
          creators_influencers?: string | null
          formats?: string | null
          id?: string
          message_hook?: string | null
          objective_id?: string | null
          status?: string
          target_audience?: string | null
          targeting?: string | null
          titel?: string
          tone_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          channel: string
          id: string
        }
        Insert: {
          channel: string
          id?: string
        }
        Update: {
          channel?: string
          id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          agent_status: string
          brand: string
          brand_challenge: string | null
          brand_promise: string | null
          country: string | null
          country_id: string | null
          created_at: string | null
          domain: string
          id: string
          logo: string | null
          primary_audience_b2b: string | null
          primary_audience_b2c: string | null
          profile: string | null
          secondary_audience_b2b: string | null
          secondary_audience_b2c: string | null
        }
        Insert: {
          agent_status?: string
          brand: string
          brand_challenge?: string | null
          brand_promise?: string | null
          country?: string | null
          country_id?: string | null
          created_at?: string | null
          domain: string
          id?: string
          logo?: string | null
          primary_audience_b2b?: string | null
          primary_audience_b2c?: string | null
          profile?: string | null
          secondary_audience_b2b?: string | null
          secondary_audience_b2c?: string | null
        }
        Update: {
          agent_status?: string
          brand?: string
          brand_challenge?: string | null
          brand_promise?: string | null
          country?: string | null
          country_id?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          logo?: string | null
          primary_audience_b2b?: string | null
          primary_audience_b2c?: string | null
          profile?: string | null
          secondary_audience_b2b?: string | null
          secondary_audience_b2c?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          country: string
          id: string
        }
        Insert: {
          country: string
          id?: string
        }
        Update: {
          country?: string
          id?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          description: string | null
          id: string
          objective: string
        }
        Insert: {
          description?: string | null
          id?: string
          objective: string
        }
        Update: {
          description?: string | null
          id?: string
          objective?: string
        }
        Relationships: []
      }
      relevance_scores: {
        Row: {
          channel: string | null
          channel_id: string
          client_id: string
          created_at: string | null
          id: string
          rationale: string | null
          score: number | null
        }
        Insert: {
          channel?: string | null
          channel_id: string
          client_id: string
          created_at?: string | null
          id?: string
          rationale?: string | null
          score?: number | null
        }
        Update: {
          channel?: string | null
          channel_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
          rationale?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relevance_scores_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relevance_scores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      campaign_audience_context: {
        Row: {
          agent_status: string | null
          audience_context: string | null
          brand: string | null
          brand_challenge: string | null
          brand_promise: string | null
          campaign_id: string | null
          channel: string | null
          channel_id: string | null
          client_id: string | null
          country: string | null
          creators_influencers: string | null
          domain: string | null
          formats: string | null
          message_hook: string | null
          objective_id: string | null
          profile: string | null
          rationale: string | null
          status: string | null
          target_audience: string | null
          targeting: string | null
          titel: string | null
          tone_style: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_context_n8n_agents: {
        Row: {
          agent_status: string | null
          audience_context: string | null
          brand: string | null
          brand_challenge: string | null
          brand_promise: string | null
          campaign_id: string | null
          channel: string | null
          channel_id: string | null
          client_id: string | null
          country: string | null
          creators_influencers: string | null
          domain: string | null
          formats: string | null
          message_hook: string | null
          objective_description: string | null
          objective_id: string | null
          objective_name: string | null
          profile: string | null
          rationale: string | null
          status: string | null
          target_audience: string | null
          targeting: string | null
          titel: string | null
          tone_style: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      enable_realtime_for_clients: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      agent_status_enum: "ready" | "in_progress"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status_enum: ["ready", "in_progress"],
    },
  },
} as const
