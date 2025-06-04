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
      case_parties: {
        Row: {
          case_id: string
          created_at: string | null
          id: string
          invitation_id: string | null
          party_type: string
          profile_id: string
        }
        Insert: {
          case_id: string
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          party_type: string
          profile_id: string
        }
        Update: {
          case_id?: string
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          party_type?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_parties_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_parties_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_parties_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_neutral: string | null
          case_type: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_neutral?: string | null
          case_type: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_neutral?: string | null
          case_type?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_assigned_neutral_fkey"
            columns: ["assigned_neutral"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_by: string
          visible_to_parties: boolean
        }
        Insert: {
          case_id: string
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_by: string
          visible_to_parties?: boolean
        }
        Update: {
          case_id?: string
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_by?: string
          visible_to_parties?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hearings: {
        Row: {
          case_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          meeting_link: string | null
          meeting_password: string | null
          scheduled_at: string
          scheduled_by: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          case_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          meeting_link?: string | null
          meeting_password?: string | null
          scheduled_at: string
          scheduled_by: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          meeting_password?: string | null
          scheduled_at?: string
          scheduled_by?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hearings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hearings_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          case_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          phone: string | null
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          case_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          phone?: string | null
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          case_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          phone?: string | null
          status?: string
          token?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          case_id: string
          content: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          related_to_case: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          related_to_case?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          related_to_case?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_to_case_fkey"
            columns: ["related_to_case"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          expertise: string[] | null
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          organization: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          expertise?: string[] | null
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          expertise?: string[] | null
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
