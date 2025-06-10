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
          bakery_id: string
          contact_person: string | null
          created_at: string | null
          customer_number: string | null
          display_url: string | null
          email: string | null
          has_dedicated_display: boolean | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bakery_id: string
          contact_person?: string | null
          created_at?: string | null
          customer_number?: string | null
          display_url?: string | null
          email?: string | null
          has_dedicated_display?: boolean | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bakery_id?: string
          contact_person?: string | null
          created_at?: string | null
          customer_number?: string | null
          display_url?: string | null
          email?: string | null
          has_dedicated_display?: boolean | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
      }
      display_settings: {
        Row: {
          animation_speed: string | null
          auto_refresh_interval: number | null
          background_color: string | null
          background_gradient_end: string | null
          background_gradient_start: string | null
          background_image_url: string | null
          background_type: string | null
          bakery_id: string
          body_font_size: number | null
          border_radius: number | null
          card_background_color: string | null
          card_border_color: string | null
          card_shadow_intensity: number | null
          created_at: string
          enable_animations: boolean | null
          fade_transitions: boolean | null
          header_font_size: number | null
          header_text_color: string | null
          id: string
          product_1_accent_color: string | null
          product_1_bg_color: string | null
          product_1_text_color: string | null
          product_2_accent_color: string | null
          product_2_bg_color: string | null
          product_2_text_color: string | null
          product_3_accent_color: string | null
          product_3_bg_color: string | null
          product_3_text_color: string | null
          product_accent_color: string | null
          product_card_color: string | null
          product_card_size: number | null
          product_text_color: string | null
          progress_animation: boolean | null
          progress_background_color: string | null
          progress_bar_color: string | null
          progress_height: number | null
          show_customer_info: boolean | null
          show_delivery_dates: boolean | null
          show_order_numbers: boolean | null
          show_product_images: boolean | null
          show_progress_bar: boolean | null
          show_progress_percentage: boolean | null
          show_status_indicator: boolean | null
          show_truck_icon: boolean | null
          spacing: number | null
          status_completed_color: string | null
          status_delivered_color: string | null
          status_in_progress_color: string | null
          status_indicator_font_size: number | null
          status_indicator_padding: number | null
          status_pending_color: string | null
          text_color: string | null
          truck_icon_size: number | null
          updated_at: string
        }
        Insert: {
          animation_speed?: string | null
          auto_refresh_interval?: number | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          background_image_url?: string | null
          background_type?: string | null
          bakery_id: string
          body_font_size?: number | null
          border_radius?: number | null
          card_background_color?: string | null
          card_border_color?: string | null
          card_shadow_intensity?: number | null
          created_at?: string
          enable_animations?: boolean | null
          fade_transitions?: boolean | null
          header_font_size?: number | null
          header_text_color?: string | null
          id?: string
          product_1_accent_color?: string | null
          product_1_bg_color?: string | null
          product_1_text_color?: string | null
          product_2_accent_color?: string | null
          product_2_bg_color?: string | null
          product_2_text_color?: string | null
          product_3_accent_color?: string | null
          product_3_bg_color?: string | null
          product_3_text_color?: string | null
          product_accent_color?: string | null
          product_card_color?: string | null
          product_card_size?: number | null
          product_text_color?: string | null
          progress_animation?: boolean | null
          progress_background_color?: string | null
          progress_bar_color?: string | null
          progress_height?: number | null
          show_customer_info?: boolean | null
          show_delivery_dates?: boolean | null
          show_order_numbers?: boolean | null
          show_product_images?: boolean | null
          show_progress_bar?: boolean | null
          show_progress_percentage?: boolean | null
          show_status_indicator?: boolean | null
          show_truck_icon?: boolean | null
          spacing?: number | null
          status_completed_color?: string | null
          status_delivered_color?: string | null
          status_in_progress_color?: string | null
          status_indicator_font_size?: number | null
          status_indicator_padding?: number | null
          status_pending_color?: string | null
          text_color?: string | null
          truck_icon_size?: number | null
          updated_at?: string
        }
        Update: {
          animation_speed?: string | null
          auto_refresh_interval?: number | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          background_image_url?: string | null
          background_type?: string | null
          bakery_id?: string
          body_font_size?: number | null
          border_radius?: number | null
          card_background_color?: string | null
          card_border_color?: string | null
          card_shadow_intensity?: number | null
          created_at?: string
          enable_animations?: boolean | null
          fade_transitions?: boolean | null
          header_font_size?: number | null
          header_text_color?: string | null
          id?: string
          product_1_accent_color?: string | null
          product_1_bg_color?: string | null
          product_1_text_color?: string | null
          product_2_accent_color?: string | null
          product_2_bg_color?: string | null
          product_2_text_color?: string | null
          product_3_accent_color?: string | null
          product_3_bg_color?: string | null
          product_3_text_color?: string | null
          product_accent_color?: string | null
          product_card_color?: string | null
          product_card_size?: number | null
          product_text_color?: string | null
          progress_animation?: boolean | null
          progress_background_color?: string | null
          progress_bar_color?: string | null
          progress_height?: number | null
          show_customer_info?: boolean | null
          show_delivery_dates?: boolean | null
          show_order_numbers?: boolean | null
          show_product_images?: boolean | null
          show_progress_bar?: boolean | null
          show_progress_percentage?: boolean | null
          show_status_indicator?: boolean | null
          show_truck_icon?: boolean | null
          spacing?: number | null
          status_completed_color?: string | null
          status_delivered_color?: string | null
          status_in_progress_color?: string | null
          status_indicator_font_size?: number | null
          status_indicator_padding?: number | null
          status_pending_color?: string | null
          text_color?: string | null
          truck_icon_size?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "display_settings_bakery_id_fkey"
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
