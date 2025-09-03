import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from './database.types.ts' 

declare global {
  namespace App {
   
    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
      createSession: (userId: string, email: string, userMetadata?: any) => string
      destroySession: () => void
      updateSession: (updates: any) => void
    }
    interface PageData {
      session: Session | null
    }
   
  }
}

export {}