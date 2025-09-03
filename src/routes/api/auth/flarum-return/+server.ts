import { json, redirect } from '@sveltejs/kit';
import { verifyFlarumJWT } from '$lib/utils/jwtUtils';
import { checkRateLimit } from '$lib/utils/rateLimit';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ locals, url, getClientAddress }: RequestEvent) => {
  const clientId = getClientAddress();
  
  // Check rate limit for return requests
  const rateLimitResult = checkRateLimit(clientId, 'AUTHENTICATION');
  if (!rateLimitResult.allowed) {
    return new Response('Rate limit exceeded', { 
      status: 429,
      headers: {
        'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    const token = url.searchParams.get('token');
    const returnUrl = url.searchParams.get('return_url') || '/private';
    
    if (!token) {
      return json(
        { error: 'Missing authentication token' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Verify JWT token from Flarum
    const payload = verifyFlarumJWT(token);
    if (!payload) {
      return json(
        { error: 'Invalid or expired token' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Get user session to verify they're still logged in
    const { session, user } = await locals.safeGetSession();
    
    if (!user || user.id !== payload.userId) {
      // User not logged in or token doesn't match current user
      return json(
        { error: 'Authentication mismatch' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Log successful return for monitoring
    console.log('Flarum return successful:', {
      userId: user.id,
      email: user.email,
      returnUrl,
      timestamp: new Date().toISOString()
    });

    // Validate return URL for security
    const isValidReturnUrl = (url: string): boolean => {
      try {
        const urlObj = new URL(url, 'http://localhost');
        const hostname = urlObj.hostname.toLowerCase();
        
        // Allow localhost and specific domains
        const allowedDomains = ['localhost', '127.0.0.1', 'solarity.farm', 'www.solarity.farm'];
        return allowedDomains.some(domain => 
          hostname === domain || hostname.endsWith('.' + domain)
        );
      } catch {
        return false;
      }
    };
    
    const safeReturnUrl = isValidReturnUrl(returnUrl) ? returnUrl : '/private';
    
    // Redirect to return URL
    throw redirect(303, safeReturnUrl);
    
  } catch (error) {
    console.error('Flarum return error:', error);
    
    // If it's already a redirect, re-throw it
    if (error instanceof Response && error.status >= 300 && error.status < 400) {
      throw error;
    }
    
    // Handle other errors
    return json(
      { 
        error: 'Return authentication failed',
        message: 'Unable to complete authentication from community platform' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
};

export const POST = async ({ locals, request, getClientAddress }: RequestEvent) => {
  const clientId = getClientAddress();
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(clientId, 'AUTHENTICATION');
  if (!rateLimitResult.allowed) {
    return new Response('Rate limit exceeded', { 
      status: 429,
      headers: {
        'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const returnUrl = formData.get('return_url') as string || '/private';
    
    if (!token) {
      return json(
        { error: 'Missing authentication token' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Verify JWT token from Flarum
    const payload = verifyFlarumJWT(token);
    if (!payload) {
      return json(
        { error: 'Invalid or expired token' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Return success response for AJAX requests
    return json(
      { 
        success: true,
        userId: payload.userId,
        returnUrl 
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
    
  } catch (error) {
    console.error('Flarum POST return error:', error);
    
    return json(
      { 
        error: 'Return authentication failed',
        message: 'Unable to complete authentication from community platform' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};
