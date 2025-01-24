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
      addresses: {
        Row: {
          address_type: string | null
          apt_suite_unit: string | null
          city: string
          created_at: string
          id: string
          is_primary: boolean | null
          state_code: string
          street_address: string
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          address_type?: string | null
          apt_suite_unit?: string | null
          city: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          state_code: string
          street_address: string
          updated_at?: string
          user_id: string
          zip_code: string
        }
        Update: {
          address_type?: string | null
          apt_suite_unit?: string | null
          city?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          state_code?: string
          street_address?: string
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_logs: {
        Row: {
          changed_by_id: string
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          changed_by_id: string
          created_at?: string
          id?: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          changed_by_id?: string
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"]
          old_role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_change_logs_changed_by_id_fkey"
            columns: ["changed_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_change_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          completed_date: string | null
          created_at: string
          id: string
          notes: string | null
          scheduled_date: string | null
          service_type: string
          status: string
          updated_at: string
          user_id: string
          warranty_id: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          service_type: string
          status: string
          updated_at?: string
          user_id: string
          warranty_id: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          service_type?: string
          status?: string
          updated_at?: string
          user_id?: string
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranties"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      warranties: {
        Row: {
          address_id: string | null
          approval_status: string
          approved_at: string | null
          approved_by_id: string | null
          created_at: string
          id: string
          product_name: string
          purchase_date: string
          status: string
          updated_at: string
          user_id: string
          warranty_end: string
          warranty_start: string
        }
        Insert: {
          address_id?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by_id?: string | null
          created_at?: string
          id?: string
          product_name: string
          purchase_date: string
          status: string
          updated_at?: string
          user_id: string
          warranty_end: string
          warranty_start: string
        }
        Update: {
          address_id?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by_id?: string | null
          created_at?: string
          id?: string
          product_name?: string
          purchase_date?: string
          status?: string
          updated_at?: string
          user_id?: string
          warranty_end?: string
          warranty_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranties_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_approved_by_id_fkey"
            columns: ["approved_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      is_customer: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      is_dev: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "dev" | "admin" | "user" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
