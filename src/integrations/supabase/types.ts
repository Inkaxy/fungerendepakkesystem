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
      bakeries: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          assigned_display_station_id: string | null
          bakery_id: string
          contact_person: string | null
          created_at: string | null
          customer_number: string | null
          display_url: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          assigned_display_station_id?: string | null
          bakery_id: string
          contact_person?: string | null
          created_at?: string | null
          customer_number?: string | null
          display_url?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          assigned_display_station_id?: string | null
          bakery_id?: string
          contact_person?: string | null
          created_at?: string | null
          customer_number?: string | null
          display_url?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_assigned_display_station_id_fkey"
            columns: ["assigned_display_station_id"]
            isOneToOne: false
            referencedRelation: "display_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
      }
      display_assignments: {
        Row: {
          assigned_at: string
          created_at: string
          customer_id: string
          display_station_id: string
          display_url: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          created_at?: string
          customer_id: string
          display_station_id: string
          display_url: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          created_at?: string
          customer_id?: string
          display_station_id?: string
          display_url?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "display_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "display_assignments_display_station_id_fkey"
            columns: ["display_station_id"]
            isOneToOne: false
            referencedRelation: "display_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      display_settings: {
        Row: {
          accent_color: string
          animation_speed: number
          background_color: string
          created_at: string
          customer_id: string | null
          display_station_id: string
          enable_animations: boolean
          font_size: number
          header_height: number
          id: string
          products_per_view: number
          rotation_interval: number
          show_customer_info: boolean
          show_delivery_date: boolean
          show_notes: boolean
          show_product_images: boolean
          show_quantities: boolean
          text_color: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          animation_speed?: number
          background_color?: string
          created_at?: string
          customer_id?: string | null
          display_station_id: string
          enable_animations?: boolean
          font_size?: number
          header_height?: number
          id?: string
          products_per_view?: number
          rotation_interval?: number
          show_customer_info?: boolean
          show_delivery_date?: boolean
          show_notes?: boolean
          show_product_images?: boolean
          show_quantities?: boolean
          text_color?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          animation_speed?: number
          background_color?: string
          created_at?: string
          customer_id?: string | null
          display_station_id?: string
          enable_animations?: boolean
          font_size?: number
          header_height?: number
          id?: string
          products_per_view?: number
          rotation_interval?: number
          show_customer_info?: boolean
          show_delivery_date?: boolean
          show_notes?: boolean
          show_product_images?: boolean
          show_quantities?: boolean
          text_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "display_settings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "display_settings_display_station_id_fkey"
            columns: ["display_station_id"]
            isOneToOne: false
            referencedRelation: "display_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      display_stations: {
        Row: {
          bakery_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_shared: boolean
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          bakery_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_shared?: boolean
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          bakery_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_shared?: boolean
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "display_stations_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
      }
      order_products: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          packing_status: string | null
          product_id: string
          quantity: number
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          packing_status?: string | null
          product_id: string
          quantity: number
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          packing_status?: string | null
          product_id?: string
          quantity?: number
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          bakery_id: string
          created_at: string | null
          customer_id: string
          delivery_date: string
          id: string
          notes: string | null
          order_number: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          bakery_id: string
          created_at?: string | null
          customer_id: string
          delivery_date: string
          id?: string
          notes?: string | null
          order_number: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          bakery_id?: string
          created_at?: string | null
          customer_id?: string
          delivery_date?: string
          id?: string
          notes?: string | null
          order_number?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      packing_sessions: {
        Row: {
          bakery_id: string
          created_at: string | null
          files_uploaded: number | null
          id: string
          product_types: number | null
          session_date: string
          status: string | null
          total_orders: number | null
          unique_customers: number | null
          updated_at: string | null
        }
        Insert: {
          bakery_id: string
          created_at?: string | null
          files_uploaded?: number | null
          id?: string
          product_types?: number | null
          session_date: string
          status?: string | null
          total_orders?: number | null
          unique_customers?: number | null
          updated_at?: string | null
        }
        Update: {
          bakery_id?: string
          created_at?: string | null
          files_uploaded?: number | null
          id?: string
          product_types?: number | null
          session_date?: string
          status?: string | null
          total_orders?: number | null
          unique_customers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packing_sessions_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bakery_id: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          product_number: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          bakery_id: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          product_number?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          bakery_id?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          product_number?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bakery_id: string | null
          created_at: string | null
          email: string | null
          email_confirmed: boolean | null
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string | null
          provider: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bakery_id?: string | null
          created_at?: string | null
          email?: string | null
          email_confirmed?: boolean | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string | null
          provider?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bakery_id?: string | null
          created_at?: string | null
          email?: string | null
          email_confirmed?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string | null
          provider?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_display_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_bakery_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "super_admin" | "bakery_admin" | "bakery_user"
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
      user_role: ["super_admin", "bakery_admin", "bakery_user"],
    },
  },
} as const
