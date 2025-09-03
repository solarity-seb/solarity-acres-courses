import { redirect } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/utils/rateLimit';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ url, getClientAddress }: RequestEvent) => {
  const clientId = getClientAddress();
  
  // Check rate limit for login redirects
  const rateLimitResult = checkRateLimit(clientId, 'AUTHENTICATION');
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
    // Handle incoming requests from Flarum community
    const returnUrl = url.searchParams.get('return_url');
    const flarumSource = url.searchParams.get('source') === 'flarum';
    
    // Build redirect URL to signin page
    let redirectTo = '/signin';
    
    if (returnUrl || flarumSource) {
      const params = new URLSearchParams();
      
      if (returnUrl) {
        // Create the full SSO return URL
        const ssoReturnUrl = `/api/auth/flarum-sso?return_url=${encodeURIComponent(returnUrl)}`;
        params.set('redirectTo', ssoReturnUrl);
      } else if (flarumSource) {
        // Default redirect to community after login
        params.set('redirectTo', '/api/auth/flarum-sso');
      }
      
      if (flarumSource) {
        params.set('source', 'flarum');
        params.set('message', 'Please sign in to access the community');
      }
      
      redirectTo += '?' + params.toString();
    }
    
    // Log the login attempt for monitoring
    console.log('Flarum login redirect:', {
      returnUrl,
      flarumSource,
      redirectTo,
      clientId,
      timestamp: new Date().toISOString()
    });
    
    // Redirect to signin page with appropriate parameters
    throw redirect(303, redirectTo);
    
  } catch (error) {
    console.error('Flarum login redirect error:', error);
    
    // If it's already a redirect, re-throw it
    if (error instanceof Response && error.status >= 300 && error.status < 400) {
      throw error;
    }
    
    // Fallback to basic signin page
    throw redirect(303, '/signin?message=Please sign in to access the community');
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
