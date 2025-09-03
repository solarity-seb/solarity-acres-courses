/**
 * Rate limiting utility for authentication and sensitive operations
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstAttempt: number;
}

// In-memory rate limiting (for production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations
export const RATE_LIMITS = {
  AUTH: { requests: 5, window: 60 * 1000 }, // 5 attempts per minute
  AUTHENTICATION: { requests: 5, window: 60 * 1000 }, // 5 auth attempts per minute
  PROFILE_UPDATE: { requests: 10, window: 60 * 1000 }, // 10 updates per minute
  FILE_UPLOAD: { requests: 20, window: 60 * 1000 }, // 20 uploads per minute
  PASSWORD_RESET: { requests: 3, window: 60 * 60 * 1000 }, // 3 resets per hour
  JWT_GENERATION: { requests: 10, window: 60 * 1000 }, // 10 JWT requests per minute
  API_REQUEST: { requests: 100, window: 60 * 1000 }, // 100 API requests per minute
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Check if an identifier is rate limited
 * @param identifier - Usually IP address or user ID
 * @param type - Type of rate limit to apply
 * @returns { allowed: boolean, remainingRequests: number, resetTime: number }
 */
export function checkRateLimit(identifier: string, type: RateLimitType): {
  allowed: boolean;
  remainingRequests: number;
  resetTime: number;
  retryAfter?: number;
} {
  const config = RATE_LIMITS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry) {
    // First request
    entry = {
      count: 1,
      resetTime: now + config.window,
      firstAttempt: now
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remainingRequests: config.requests - 1,
      resetTime: entry.resetTime
    };
  }
  
  // Check if window has expired
  if (now >= entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + config.window;
    entry.firstAttempt = now;
    
    return {
      allowed: true,
      remainingRequests: config.requests - 1,
      resetTime: entry.resetTime
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.requests) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }
  
  // Increment count
  entry.count++;
  
  return {
    allowed: true,
    remainingRequests: config.requests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Clean up expired rate limit entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get client identifier (IP address with fallbacks)
 * @param request - Request object
 * @returns Client identifier string
 */
export function getClientIdentifier(request: Request): string {
  // Try various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Create rate limit response headers
 * @param limitResult - Result from checkRateLimit
 * @param type - Rate limit type
 * @returns Headers object
 */
export function createRateLimitHeaders(
  limitResult: ReturnType<typeof checkRateLimit>,
  type: RateLimitType
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': RATE_LIMITS[type].requests.toString(),
    'X-RateLimit-Remaining': limitResult.remainingRequests.toString(),
    'X-RateLimit-Reset': Math.ceil(limitResult.resetTime / 1000).toString(),
  };
  
  if (limitResult.retryAfter) {
    headers['Retry-After'] = limitResult.retryAfter.toString();
  }
  
  return headers;
}

// Auto cleanup every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
