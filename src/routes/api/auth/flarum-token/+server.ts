import { json } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/utils/rateLimit';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request, getClientAddress }: RequestEvent) => {
  const clientId = getClientAddress();
  
  // Check rate limit for token requests
  const rateLimitResult = checkRateLimit(clientId, 'JWT_GENERATION');
  if (!rateLimitResult.allowed) {
    return json({ 
      error: 'rate_limit_exceeded',
      error_description: `Too many requests. Try again in ${rateLimitResult.retryAfter} seconds.`
    }, { status: 429 });
  }

  try {
    const body = await request.formData();
    const code = body.get('code') as string;
    const clientId = body.get('client_id') as string;
    const clientSecret = body.get('client_secret') as string;
    const grantType = body.get('grant_type') as string;
    
    // Validate grant type
    if (grantType !== 'authorization_code') {
      return json({ 
        error: 'unsupported_grant_type',
        error_description: 'Only authorization_code grant type is supported'
      }, { status: 400 });
    }
    
    // Validate client credentials (these should match your Flarum OAuth configuration)
    const expectedClientId = 'solarityfarm-main';
    const expectedClientSecret = process.env.FLARUM_CLIENT_SECRET || 'your-secure-secret-key';
    
    if (clientId !== expectedClientId || clientSecret !== expectedClientSecret) {
      return json({ 
        error: 'invalid_client',
        error_description: 'Invalid client credentials'
      }, { status: 401 });
    }
    
    // In a real implementation, you'd validate the authorization code here
    // For this MVP, we'll accept any code that looks valid
    if (!code || code.length < 10) {
      return json({
        error: 'invalid_grant',
        error_description: 'Invalid authorization code'
      }, { status: 400 });
    }
    
    // Generate access token (in production, this should be a proper JWT)
    const accessToken = `sk_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    return json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'openid profile email'
    }, {
      headers: {
        'Access-Control-Allow-Origin': process.env.FLARUM_BASE_URL || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Token endpoint error:', error);
    return json({ 
      error: 'server_error',
      error_description: 'An internal server error occurred'
    }, { status: 500 });
  }
};

export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.FLARUM_BASE_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};
