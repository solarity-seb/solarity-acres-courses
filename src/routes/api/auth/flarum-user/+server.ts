import { json } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/utils/rateLimit';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ request, locals, getClientAddress }: RequestEvent) => {
  const clientId = getClientAddress();
  
  // Check rate limit for user info requests
  const rateLimitResult = checkRateLimit(clientId, 'API_REQUEST');
  if (!rateLimitResult.allowed) {
    return json({ 
      error: 'rate_limit_exceeded',
      message: `Too many requests. Try again in ${rateLimitResult.retryAfter} seconds.`
    }, { status: 429 });
  }

  try {
    // Check for Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ 
        error: 'unauthorized',
        message: 'Missing or invalid authorization header'
      }, { status: 401 });
    }

    // Extract token (in production, you'd validate this properly)
    const token = authHeader.substring(7);
    if (!token.startsWith('sk_')) {
      return json({ 
        error: 'invalid_token',
        message: 'Invalid access token format'
      }, { status: 401 });
    }

    // Get current user session
    const { session, user } = await locals.safeGetSession();
    
    if (!user || !session) {
      return json({ 
        error: 'unauthorized',
        message: 'User not authenticated'
      }, { status: 401 });
    }
    
    // Return user info in OpenID Connect standard format
    const userInfo = {
      sub: user.id, // Subject (user ID)
      email: user.email,
      email_verified: user.email_confirmed_at ? true : false,
      name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      preferred_username: user.user_metadata?.display_name || user.email?.split('@')[0],
      picture: user.user_metadata?.avatar_url || null,
      updated_at: user.updated_at,
      // Additional custom fields
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at
    };
    
    return json(userInfo, {
      headers: {
        'Access-Control-Allow-Origin': process.env.FLARUM_BASE_URL || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('User info endpoint error:', error);
    return json({ 
      error: 'server_error',
      message: 'An internal server error occurred'
    }, { status: 500 });
  }
};

export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.FLARUM_BASE_URL || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};
