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
        Relationships: []
      }
      cat_slabs: {
        Row: {
          barcode: string | null
          code: string
          created_at: string | null
          dimensions: Json | null
          id: string
          image_url: string | null
          last_updated: string | null
          location: string | null
          name: string
          price: number
          price_per_sqft: number
          quantity: number
          share_link: string | null
          share_link_expiry: string | null
          sqft: number
          supplier: string | null
          type: string
        }
        Insert: {
          barcode?: string | null
          code: string
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          last_updated?: string | null
          location?: string | null
          name: string
          price?: number
          price_per_sqft?: number
          quantity?: number
          share_link?: string | null
          share_link_expiry?: string | null
          sqft?: number
          supplier?: string | null
          type?: string
        }
        Update: {
          barcode?: string | null
          code?: string
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          last_updated?: string | null
          location?: string | null
          name?: string
          price?: number
          price_per_sqft?: number
          quantity?: number
          share_link?: string | null
          share_link_expiry?: string | null
          sqft?: number
          supplier?: string | null
          type?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          warranty_service_id: string | null
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
          warranty_service_id?: string | null
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
          warranty_service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_warranty_service_id_fkey"
            columns: ["warranty_service_id"]
            isOneToOne: false
            referencedRelation: "warranty_services"
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
        Relationships: []
      }
      user_sessions: {
        Row: {
          id: string
          last_login: string
          session_start: string
        }
        Insert: {
          id: string
          last_login?: string
          session_start?: string
        }
        Update: {
          id?: string
          last_login?: string
          session_start?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
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
          purchase_date: string | null
          status: string
          updated_at: string
          user_id: string
          warranty_end: string
          warranty_start: string
          warranty_type_id: string | null
        }
        Insert: {
          address_id?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by_id?: string | null
          created_at?: string
          id?: string
          purchase_date?: string | null
          status: string
          updated_at?: string
          user_id: string
          warranty_end: string
          warranty_start: string
          warranty_type_id?: string | null
        }
        Update: {
          address_id?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by_id?: string | null
          created_at?: string
          id?: string
          purchase_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          warranty_end?: string
          warranty_start?: string
          warranty_type_id?: string | null
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
            foreignKeyName: "warranties_warranty_type_id_fkey"
            columns: ["warranty_type_id"]
            isOneToOne: false
            referencedRelation: "warranty_types"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_services: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      warranty_type_services: {
        Row: {
          created_at: string
          id: string
          max_uses: number
          updated_at: string
          warranty_service_id: string
          warranty_type_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_uses?: number
          updated_at?: string
          warranty_service_id: string
          warranty_type_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_uses?: number
          updated_at?: string
          warranty_service_id?: string
          warranty_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranty_type_services_warranty_service_id_fkey"
            columns: ["warranty_service_id"]
            isOneToOne: false
            referencedRelation: "warranty_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_type_services_warranty_type_id_fkey"
            columns: ["warranty_type_id"]
            isOneToOne: false
            referencedRelation: "warranty_types"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_types: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_request_service: {
        Args: {
          p_warranty_id: string
          p_warranty_service_id: string
        }
        Returns: boolean
      }
      has_any_role: {
        Args: {
          user_uuid: string
          roles: Database["public"]["Enums"]["user_role"][]
        }
        Returns: boolean
      }
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
      is_user: {
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
