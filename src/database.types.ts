export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      colors: {
        Row: {
          id: string
          name: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: string
          created_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          note: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          note: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          note?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          display_name: string | null
          bio: string | null
          website: string | null
          avatar_url: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          bio?: string | null
          website?: string | null
          avatar_url?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          bio?: string | null
          website?: string | null
          avatar_url?: string | null
          updated_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_resources: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          progress: number
          completed: boolean
          enrolled_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          progress?: number
          completed?: boolean
          enrolled_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          progress?: number
          completed?: boolean
          enrolled_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_resources_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
