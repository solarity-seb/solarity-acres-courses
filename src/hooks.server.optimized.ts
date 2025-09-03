import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sessionStore } from '$lib/server/sessionStore';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Session, User } from '@supabase/supabase-js';

const SESSION_COOKIE_NAME = 'session-id';

const supabase: Handle = async ({ event, resolve }) => {
  // Create Supabase client with minimal cookie usage
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        // Only get necessary cookies, not all cookies
        const authCookies = event.cookies.getAll().filter(cookie => 
          cookie.name.startsWith('sb-') || cookie.name === SESSION_COOKIE_NAME
        );
        return authCookies;
      },
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Set minimal cookies with size optimization
          event.cookies.set(name, value, { 
            ...options, 
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
          });
        });
      },
    },
  });

  // Enhanced session management
  event.locals.safeGetSession = async (): Promise<{ session: Session | null; user: User | null }> => {
    try {
      // Fallback to Supabase session for proper typing
      const {
        data: { session },
      } = await event.locals.supabase.auth.getSession();

      if (!session) {
        return { session: null, user: null };
      }

      const {
        data: { user },
        error,
      } = await event.locals.supabase.auth.getUser();

      if (error) {
        console.error('Auth error:', error);
        return { session: null, user: null };
      }

      // Store session in our session store and set lightweight cookie
      if (user) {
        const newSessionId = sessionStore.createSession(
          user.id, 
          user.email || '', 
          user.user_metadata
        );
        
        // Set a small session ID cookie instead of large JWT
        event.cookies.set(SESSION_COOKIE_NAME, newSessionId, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
      }

      return { session, user };
    } catch (error) {
      console.error('Session error:', error);
      return { session: null, user: null };
    }
  };

  // Add session management helpers
  event.locals.createSession = (userId: string, email: string, userMetadata?: any) => {
    const sessionId = sessionStore.createSession(userId, email, userMetadata);
    event.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    return sessionId;
  };

  event.locals.destroySession = () => {
    const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
    if (sessionId) {
      sessionStore.deleteSession(sessionId);
    }
    event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
  };

  event.locals.updateSession = (updates: any) => {
    const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
    if (sessionId) {
      return sessionStore.updateSession(sessionId, updates);
    }
    return false;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  // Handle logout by destroying session
  if (event.url.pathname === '/auth/logout') {
    event.locals.destroySession();
    await event.locals.supabase.auth.signOut();
    throw redirect(303, '/');
  }

  if (!event.locals.session && event.url.pathname.startsWith('/private')) {
    throw redirect(303, '/signup');
  }

  if (event.locals.session && event.url.pathname === '/signup') {
    throw redirect(303, '/private');
  }

  return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
