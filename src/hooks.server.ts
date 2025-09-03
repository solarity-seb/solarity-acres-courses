import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

// CORS configuration
const corsHandler: Handle = async ({ event, resolve }) => {
  // Apply CORS headers for API routes
  if (event.url.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
  }

  const response = await resolve(event);

  // Add CORS headers to API responses
  if (event.url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }

  return response;
};

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   * The Supabase client gets the Auth user from the server session.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        /**
         * Note: You have to add the `httpOnly: false` flag to the
         * set and remove method due to sveltekit's cookie API
         * requiring the `httpOnly` flag to be explicitly set.
         *
         * The Supabase client sets cookies that are used for auth
         * and session management, these need to be available to the browser.
         */
        cookiesToSet.forEach(({ name, value, options }) => {
          // Limit cookie size to prevent 431 errors
          if (value.length > 4000) {
            console.warn(`Cookie ${name} too large (${value.length} chars), skipping`);
            return;
          }
          event.cookies.set(name, value, { 
            ...options, 
            httpOnly: false,
            path: options?.path || '/' 
          });
        });
      },
    },
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await event.locals.supabase.auth.getSession()
      if (error) {
        return { session: null, user: null }
      }

      const {
        data: { user },
        error: getUserError,
      } = await event.locals.supabase.auth.getUser()
      if (getUserError) {
        return { session: null, user: null }
      }

      return { session, user }
    } catch (err) {
      console.warn('Session validation failed:', err);
      return { session: null, user: null }
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
    transformPageChunk: ({ html }) => {
      // Add security headers via HTML meta tags for client-side enforcement
      return html.replace(
        '<head>',
        `<head>
          <meta http-equiv="X-Content-Type-Options" content="nosniff">
          <meta http-equiv="X-Frame-Options" content="DENY">
          <meta http-equiv="X-XSS-Protection" content="1; mode=block">
          <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
          <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">`,
      )
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  // Protected routes
  const protectedRoutes = ['/private']
  const isProtectedRoute = protectedRoutes.some(route => event.url.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    const redirectTo = event.url.pathname + event.url.search
    throw redirect(303, `/signin?redirectTo=${encodeURIComponent(redirectTo)}`)
  }

  return resolve(event)
}

export const handle: Handle = sequence(corsHandler, supabase, authGuard)