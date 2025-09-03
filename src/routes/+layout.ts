import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth')

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data?.cookies ?? []
          },
          setAll(cookiesToSet) {
            // Client-side cookie setting handled by browser
          },
        },
      })

  // Use server data as primary source, then sync with client
  let session = data?.session || null;
  let user = data?.user || null;

  // On client-side, also check Supabase directly
  if (isBrowser()) {
    try {
      const {
        data: { session: clientSession },
      } = await supabase.auth.getSession();
      
      // Use client session if no server session
      if (!session && clientSession) {
        session = clientSession;
        user = clientSession.user;
      }
    } catch (error) {
      console.error('Client auth session error:', error);
    }
  }

  return { session, supabase, user }
}