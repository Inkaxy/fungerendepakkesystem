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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_packing_products: {
        Row: {
          bakery_id: string
          created_at: string
          id: string
          product_id: string
          product_name: string
          session_date: string
          total_quantity: number
          updated_at: string
        }
        Insert: {
          bakery_id: string
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          session_date: string
          total_quantity?: number
          updated_at?: string
        }
        Update: {
          bakery_id?: string
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          session_date?: string
          total_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      bakery_credentials: {
        Row: {
          bakery_id: string
          created_at: string | null
          created_by: string | null
          id: string
          last_tested_at: string | null
          microsoft_client_id_encrypted: string | null
          microsoft_client_secret_encrypted: string | null
          microsoft_tenant_id_encrypted: string | null
          resend_api_key_encrypted: string | null
          test_error: string | null
          test_status: string | null
          updated_at: string | null
        }
        Insert: {
          bakery_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_tested_at?: string | null
          microsoft_client_id_encrypted?: string | null
          microsoft_client_secret_encrypted?: string | null
          microsoft_tenant_id_encrypted?: string | null
          resend_api_key_encrypted?: string | null
          test_error?: string | null
          test_status?: string | null
          updated_at?: string | null
        }
        Update: {
          bakery_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_tested_at?: string | null
          microsoft_client_id_encrypted?: string | null
          microsoft_client_secret_encrypted?: string | null
          microsoft_tenant_id_encrypted?: string | null
          resend_api_key_encrypted?: string | null
          test_error?: string | null
          test_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bakery_credentials_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: true
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
        ]
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
      display_presets: {
        Row: {
          bakery_id: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          preset_type: string | null
          settings: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bakery_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          preset_type?: string | null
          settings: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bakery_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          preset_type?: string | null
          settings?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "display_presets_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "display_presets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      display_settings: {
        Row: {
          always_show_customer_name: boolean | null
          animation_speed: string | null
          auto_hide_completed_customers: boolean | null
          auto_hide_completed_timer: number | null
          auto_refresh_interval: number | null
          auto_screen_detection: boolean | null
          background_color: string | null
          background_gradient_end: string | null
          background_gradient_start: string | null
          background_image_url: string | null
          background_type: string | null
          bakery_id: string
          basket_display_format: string | null
          body_font_size: number | null
          border_radius: number | null
          card_background_color: string | null
          card_border_color: string | null
          card_shadow_intensity: number | null
          cat_animation_speed: string | null
          created_at: string
          customer_card_height: string | null
          customer_cards_columns: number | null
          customer_cards_gap: number | null
          customer_priority_mode: string | null
          customer_sort_order: string | null
          display_margin: number | null
          display_padding: number | null
          enable_animations: boolean | null
          enable_cat_animations: boolean | null
          fade_transitions: boolean | null
          font_family: string | null
          force_single_screen: boolean | null
          fullscreen_mode: boolean | null
          header_font_size: number | null
          header_text_color: string | null
          hide_empty_customers: boolean | null
          id: string
          large_screen_optimization: boolean | null
          line_height: number | null
          main_title: string | null
          manual_refresh_button_position: string | null
          max_products_per_card: number | null
          minimum_card_width: number | null
          pause_mode_enabled: boolean | null
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
          product_change_animation: boolean | null
          product_list_style: string | null
          product_text_color: string | null
          progress_animation: boolean | null
          progress_background_color: string | null
          progress_bar_color: string | null
          progress_height: number | null
          responsive_breakpoint: string | null
          screen_size_preset: string | null
          screen_type: string
          show_basket_quantity: boolean | null
          show_bouncing_cats: boolean | null
          show_customer_info: boolean | null
          show_customer_numbers: boolean | null
          show_date_indicator: boolean | null
          show_delivery_date_indicators: boolean | null
          show_delivery_dates: boolean | null
          show_falling_cats: boolean | null
          show_line_items_count: boolean | null
          show_manual_refresh_button: boolean | null
          show_order_numbers: boolean | null
          show_product_images: boolean | null
          show_progress_bar: boolean | null
          show_progress_percentage: boolean | null
          show_running_cats: boolean | null
          show_stats_cards: boolean | null
          show_status_badges: boolean | null
          show_status_indicator: boolean | null
          show_truck_icon: boolean | null
          spacing: number | null
          stats_card_height: string | null
          stats_columns: number | null
          stats_icon_color: string | null
          status_completed_color: string | null
          status_delivered_color: string | null
          status_in_progress_color: string | null
          status_indicator_font_size: number | null
          status_indicator_padding: number | null
          status_pending_color: string | null
          subtitle: string | null
          text_color: string | null
          text_shadow_blur: number | null
          text_shadow_color: string | null
          text_shadow_enabled: boolean | null
          text_shadow_offset_x: number | null
          text_shadow_offset_y: number | null
          touch_friendly_sizes: boolean | null
          touch_target_size: number | null
          truck_icon_size: number | null
          updated_at: string
        }
        Insert: {
          always_show_customer_name?: boolean | null
          animation_speed?: string | null
          auto_hide_completed_customers?: boolean | null
          auto_hide_completed_timer?: number | null
          auto_refresh_interval?: number | null
          auto_screen_detection?: boolean | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          background_image_url?: string | null
          background_type?: string | null
          bakery_id: string
          basket_display_format?: string | null
          body_font_size?: number | null
          border_radius?: number | null
          card_background_color?: string | null
          card_border_color?: string | null
          card_shadow_intensity?: number | null
          cat_animation_speed?: string | null
          created_at?: string
          customer_card_height?: string | null
          customer_cards_columns?: number | null
          customer_cards_gap?: number | null
          customer_priority_mode?: string | null
          customer_sort_order?: string | null
          display_margin?: number | null
          display_padding?: number | null
          enable_animations?: boolean | null
          enable_cat_animations?: boolean | null
          fade_transitions?: boolean | null
          font_family?: string | null
          force_single_screen?: boolean | null
          fullscreen_mode?: boolean | null
          header_font_size?: number | null
          header_text_color?: string | null
          hide_empty_customers?: boolean | null
          id?: string
          large_screen_optimization?: boolean | null
          line_height?: number | null
          main_title?: string | null
          manual_refresh_button_position?: string | null
          max_products_per_card?: number | null
          minimum_card_width?: number | null
          pause_mode_enabled?: boolean | null
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
          product_change_animation?: boolean | null
          product_list_style?: string | null
          product_text_color?: string | null
          progress_animation?: boolean | null
          progress_background_color?: string | null
          progress_bar_color?: string | null
          progress_height?: number | null
          responsive_breakpoint?: string | null
          screen_size_preset?: string | null
          screen_type?: string
          show_basket_quantity?: boolean | null
          show_bouncing_cats?: boolean | null
          show_customer_info?: boolean | null
          show_customer_numbers?: boolean | null
          show_date_indicator?: boolean | null
          show_delivery_date_indicators?: boolean | null
          show_delivery_dates?: boolean | null
          show_falling_cats?: boolean | null
          show_line_items_count?: boolean | null
          show_manual_refresh_button?: boolean | null
          show_order_numbers?: boolean | null
          show_product_images?: boolean | null
          show_progress_bar?: boolean | null
          show_progress_percentage?: boolean | null
          show_running_cats?: boolean | null
          show_stats_cards?: boolean | null
          show_status_badges?: boolean | null
          show_status_indicator?: boolean | null
          show_truck_icon?: boolean | null
          spacing?: number | null
          stats_card_height?: string | null
          stats_columns?: number | null
          stats_icon_color?: string | null
          status_completed_color?: string | null
          status_delivered_color?: string | null
          status_in_progress_color?: string | null
          status_indicator_font_size?: number | null
          status_indicator_padding?: number | null
          status_pending_color?: string | null
          subtitle?: string | null
          text_color?: string | null
          text_shadow_blur?: number | null
          text_shadow_color?: string | null
          text_shadow_enabled?: boolean | null
          text_shadow_offset_x?: number | null
          text_shadow_offset_y?: number | null
          touch_friendly_sizes?: boolean | null
          touch_target_size?: number | null
          truck_icon_size?: number | null
          updated_at?: string
        }
        Update: {
          always_show_customer_name?: boolean | null
          animation_speed?: string | null
          auto_hide_completed_customers?: boolean | null
          auto_hide_completed_timer?: number | null
          auto_refresh_interval?: number | null
          auto_screen_detection?: boolean | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          background_image_url?: string | null
          background_type?: string | null
          bakery_id?: string
          basket_display_format?: string | null
          body_font_size?: number | null
          border_radius?: number | null
          card_background_color?: string | null
          card_border_color?: string | null
          card_shadow_intensity?: number | null
          cat_animation_speed?: string | null
          created_at?: string
          customer_card_height?: string | null
          customer_cards_columns?: number | null
          customer_cards_gap?: number | null
          customer_priority_mode?: string | null
          customer_sort_order?: string | null
          display_margin?: number | null
          display_padding?: number | null
          enable_animations?: boolean | null
          enable_cat_animations?: boolean | null
          fade_transitions?: boolean | null
          font_family?: string | null
          force_single_screen?: boolean | null
          fullscreen_mode?: boolean | null
          header_font_size?: number | null
          header_text_color?: string | null
          hide_empty_customers?: boolean | null
          id?: string
          large_screen_optimization?: boolean | null
          line_height?: number | null
          main_title?: string | null
          manual_refresh_button_position?: string | null
          max_products_per_card?: number | null
          minimum_card_width?: number | null
          pause_mode_enabled?: boolean | null
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
          product_change_animation?: boolean | null
          product_list_style?: string | null
          product_text_color?: string | null
          progress_animation?: boolean | null
          progress_background_color?: string | null
          progress_bar_color?: string | null
          progress_height?: number | null
          responsive_breakpoint?: string | null
          screen_size_preset?: string | null
          screen_type?: string
          show_basket_quantity?: boolean | null
          show_bouncing_cats?: boolean | null
          show_customer_info?: boolean | null
          show_customer_numbers?: boolean | null
          show_date_indicator?: boolean | null
          show_delivery_date_indicators?: boolean | null
          show_delivery_dates?: boolean | null
          show_falling_cats?: boolean | null
          show_line_items_count?: boolean | null
          show_manual_refresh_button?: boolean | null
          show_order_numbers?: boolean | null
          show_product_images?: boolean | null
          show_progress_bar?: boolean | null
          show_progress_percentage?: boolean | null
          show_running_cats?: boolean | null
          show_stats_cards?: boolean | null
          show_status_badges?: boolean | null
          show_status_indicator?: boolean | null
          show_truck_icon?: boolean | null
          spacing?: number | null
          stats_card_height?: string | null
          stats_columns?: number | null
          stats_icon_color?: string | null
          status_completed_color?: string | null
          status_delivered_color?: string | null
          status_in_progress_color?: string | null
          status_indicator_font_size?: number | null
          status_indicator_padding?: number | null
          status_pending_color?: string | null
          subtitle?: string | null
          text_color?: string | null
          text_shadow_blur?: number | null
          text_shadow_color?: string | null
          text_shadow_enabled?: boolean | null
          text_shadow_offset_x?: number | null
          text_shadow_offset_y?: number | null
          touch_friendly_sizes?: boolean | null
          touch_target_size?: number | null
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
      display_stations: {
        Row: {
          bakery_id: string
          created_at: string
          description: string | null
          id: string
          is_shared: boolean
          name: string
          updated_at: string
        }
        Insert: {
          bakery_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_shared?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          bakery_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_shared?: boolean
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
      file_sync_logs: {
        Row: {
          bakery_id: string
          created_at: string
          error_message: string | null
          file_details: Json | null
          files_failed: number | null
          files_found: number | null
          files_processed: number | null
          id: string
          status: string
          sync_completed_at: string | null
          sync_setting_id: string
          sync_started_at: string
        }
        Insert: {
          bakery_id: string
          created_at?: string
          error_message?: string | null
          file_details?: Json | null
          files_failed?: number | null
          files_found?: number | null
          files_processed?: number | null
          id?: string
          status?: string
          sync_completed_at?: string | null
          sync_setting_id: string
          sync_started_at?: string
        }
        Update: {
          bakery_id?: string
          created_at?: string
          error_message?: string | null
          file_details?: Json | null
          files_failed?: number | null
          files_found?: number | null
          files_processed?: number | null
          id?: string
          status?: string
          sync_completed_at?: string | null
          sync_setting_id?: string
          sync_started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_sync_logs_bakery_id_fkey"
            columns: ["bakery_id"]
            isOneToOne: false
            referencedRelation: "bakeries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_sync_logs_sync_setting_id_fkey"
            columns: ["sync_setting_id"]
            isOneToOne: false
            referencedRelation: "file_sync_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      file_sync_settings: {
        Row: {
          bakery_id: string
          created_at: string
          delete_after_sync: boolean | null
          delete_old_files_after_days: number | null
          folder_path: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          last_sync_error: string | null
          last_sync_status: string | null
          notification_email: string | null
          schedule_cron: string | null
          send_failure_notifications: boolean | null
          service_config: Json
          service_type: string
          updated_at: string
        }
        Insert: {
          bakery_id: string
          created_at?: string
          delete_after_sync?: boolean | null
          delete_old_files_after_days?: number | null
          folder_path?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          notification_email?: string | null
          schedule_cron?: string | null
          send_failure_notifications?: boolean | null
          service_config?: Json
          service_type: string
          updated_at?: string
        }
        Update: {
          bakery_id?: string
          created_at?: string
          delete_after_sync?: boolean | null
          delete_old_files_after_days?: number | null
          folder_path?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          notification_email?: string | null
          schedule_cron?: string | null
          send_failure_notifications?: boolean | null
          service_config?: Json
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_sync_settings_bakery_id_fkey"
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
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "public_display_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_display_products"
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
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "public_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "public_display_customers"
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
          basket_quantity: number | null
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
          basket_quantity?: number | null
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
          basket_quantity?: number | null
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
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_customers: {
        Row: {
          bakery_id: string | null
          display_url: string | null
          has_dedicated_display: boolean | null
          id: string | null
          name: string | null
          status: string | null
        }
        Insert: {
          bakery_id?: string | null
          display_url?: string | null
          has_dedicated_display?: boolean | null
          id?: string | null
          name?: string | null
          status?: string | null
        }
        Update: {
          bakery_id?: string | null
          display_url?: string | null
          has_dedicated_display?: boolean | null
          id?: string | null
          name?: string | null
          status?: string | null
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
      public_display_customers: {
        Row: {
          bakery_id: string | null
          display_url: string | null
          has_dedicated_display: boolean | null
          id: string | null
          name: string | null
          status: string | null
        }
        Insert: {
          bakery_id?: string | null
          display_url?: string | null
          has_dedicated_display?: boolean | null
          id?: string | null
          name?: string | null
          status?: string | null
        }
        Update: {
          bakery_id?: string | null
          display_url?: string | null
          has_dedicated_display?: boolean | null
          id?: string | null
          name?: string | null
          status?: string | null
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
      public_display_order_products: {
        Row: {
          id: string | null
          order_id: string | null
          packing_status: string | null
          product_id: string | null
          quantity: number | null
        }
        Insert: {
          id?: string | null
          order_id?: string | null
          packing_status?: string | null
          product_id?: string | null
          quantity?: number | null
        }
        Update: {
          id?: string | null
          order_id?: string | null
          packing_status?: string | null
          product_id?: string | null
          quantity?: number | null
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
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "public_display_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_display_products"
            referencedColumns: ["id"]
          },
        ]
      }
      public_display_orders: {
        Row: {
          bakery_id: string | null
          customer_id: string | null
          delivery_date: string | null
          id: string | null
          status: string | null
        }
        Insert: {
          bakery_id?: string | null
          customer_id?: string | null
          delivery_date?: string | null
          id?: string | null
          status?: string | null
        }
        Update: {
          bakery_id?: string | null
          customer_id?: string | null
          delivery_date?: string | null
          id?: string | null
          status?: string | null
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
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "public_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "public_display_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      public_display_products: {
        Row: {
          bakery_id: string | null
          category: string | null
          id: string | null
          name: string | null
          unit: string | null
        }
        Insert: {
          bakery_id?: string | null
          category?: string | null
          id?: string | null
          name?: string | null
          unit?: string | null
        }
        Update: {
          bakery_id?: string | null
          category?: string | null
          id?: string | null
          name?: string | null
          unit?: string | null
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
    }
    Functions: {
      decrypt_credential: {
        Args: { encrypted_text: string; key: string }
        Returns: string
      }
      encrypt_credential: {
        Args: { key: string; plain_text: string }
        Returns: string
      }
      extend_user_session: { Args: never; Returns: undefined }
      generate_display_url: { Args: never; Returns: string }
      get_bakery_id_from_display_url: {
        Args: { display_url_param: string }
        Returns: string
      }
      get_current_user_bakery_id: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      get_user_primary_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      should_extend_session: { Args: never; Returns: boolean }
      update_sync_cron_jobs: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "super_admin" | "bakery_admin" | "bakery_user"
      user_role: "super_admin" | "bakery_admin" | "bakery_user"
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
    Enums: {
      app_role: ["super_admin", "bakery_admin", "bakery_user"],
      user_role: ["super_admin", "bakery_admin", "bakery_user"],
    },
  },
} as const
