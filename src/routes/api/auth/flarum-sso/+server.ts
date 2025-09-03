import { json, redirect } from '@sveltejs/kit';
import { generateFlarumJWT } from '$lib/utils/jwtUtils';
import { checkRateLimit } from '$lib/utils/rateLimit';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ locals, url, getClientAddress }: RequestEvent) => {
  const clientId = getClientAddress();
  
  // Check rate limit for SSO requests
  const rateLimitResult = checkRateLimit(clientId, 'JWT_GENERATION');
  if (!rateLimitResult.allowed) {
    return new Response('Rate limit exceeded', { 
      status: 429,
      headers: {
        'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    // Get current user session
    const { session, user } = await locals.safeGetSession();
    
    if (!user || !session) {
      // Redirect to login with return URL for Flarum
      const returnUrl = url.searchParams.get('return_url') || 'https://community.solarity.farm/';
      const redirectTo = `/signin?redirectTo=${encodeURIComponent(`/api/auth/flarum-sso?return_url=${encodeURIComponent(returnUrl)}`)}`;
      throw redirect(303, redirectTo);
    }

    // Generate JWT for Flarum
    const token = generateFlarumJWT(user);
    
    // Get Flarum base URL from environment or default
    const flarumBaseUrl = process.env.FLARUM_BASE_URL || 'https://community.solarity.farm';
    
    // Build Flarum SSO URL
    const flarumUrl = new URL('/auth/sso', flarumBaseUrl);
    flarumUrl.searchParams.set('token', token);
    
    // Add return URL if provided
    const returnUrl = url.searchParams.get('return_url');
    if (returnUrl) {
      flarumUrl.searchParams.set('return_url', returnUrl);
    }
    
    // Log SSO attempt for monitoring
    console.log('Flarum SSO redirect:', {
      userId: user.id,
      email: user.email,
      returnUrl,
      timestamp: new Date().toISOString()
    });
    
    // Redirect to Flarum with JWT
    throw redirect(303, flarumUrl.toString());
    
  } catch (error) {
    console.error('Flarum SSO error:', error);
    
    // If it's already a redirect, re-throw it
    if (error instanceof Response && error.status >= 300 && error.status < 400) {
      throw error;
    }
    
    // Handle other errors
    return json(
      { 
        error: 'SSO authentication failed',
        message: 'Unable to authenticate with community platform' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
};

// Handle preflight requests for CORS
export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};
