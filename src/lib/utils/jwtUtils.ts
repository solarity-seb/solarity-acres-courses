import jwt from 'jsonwebtoken';
import { JWT_SECRET, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { User } from '@supabase/supabase-js';
import { checkRateLimit, type RateLimitType } from './rateLimit';

// Create Supabase admin client for server-side operations
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Check if user/IP is rate limited for JWT operations
 * @param identifier - User ID or IP address
 * @returns Rate limit result
 */
export function checkJWTRateLimit(identifier: string) {
  return checkRateLimit(identifier, 'JWT_GENERATION');
}

// Proper TypeScript interfaces for user data
export interface UserMetadata {
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  is_moderator?: boolean;
  subscription_tier?: string;
  [key: string]: any;
}

export interface UserWithMetadata extends User {
  user_metadata: UserMetadata;
}

export interface FlarumSSOPayload {
  userId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  groups?: string[];
  iat: number;
  exp: number;
  iss: string; // issuer
  aud: string; // audience
}

export interface FlarumUserData {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  groups?: string[];
}

/**
 * Generate JWT token for Flarum SSO
 * @param userData - User object (can be User or UserWithMetadata)
 * @returns JWT token string
 */
export function generateFlarumJWT(userData: User | UserWithMetadata): string {
  if (!userData) {
    throw new Error('User is required to generate JWT');
  }

  const now = Math.floor(Date.now() / 1000);
  const expiration = now + (60 * 60); // 1 hour expiration

  // Handle both direct user objects and user response objects
  const user = ('user' in userData) ? (userData as any).user : userData as User;
  
  // Safely extract user information
  const userMetadata = user.user_metadata as UserMetadata || {};
  const username = userMetadata.display_name || 
                  userMetadata.full_name || 
                  user.email?.split('@')[0] || 
                  `user_${user.id.slice(0, 8)}`;

  const payload: FlarumSSOPayload = {
    userId: user.id,
    username: sanitizeUsername(username),
    email: user.email || '',
    avatarUrl: userMetadata.avatar_url || '',
    groups: determineUserGroups(user),
    iat: now,
    exp: expiration,
    iss: 'sveltekit-app',
    aud: 'flarum-community'
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h'
  });
}

/**
 * Verify JWT token from Flarum
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyFlarumJWT(token: string): FlarumSSOPayload | null {
  if (!token || !JWT_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'sveltekit-app',
      audience: 'flarum-community'
    }) as FlarumSSOPayload;

    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Get user data formatted for Flarum
 * @param userId - Supabase user ID
 * @returns Formatted user data for Flarum
 */
export async function getFlarumUserData(userId: string): Promise<FlarumUserData | null> {
  try {
    const { data: userResponse, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error || !userResponse) {
      console.error('Failed to get user:', error);
      return null;
    }

    // Extract user from response
    const user = userResponse.user;
    const userMetadata = user.user_metadata as UserMetadata || {};
    
    const username = userMetadata.display_name || 
                    userMetadata.full_name || 
                    user.email?.split('@')[0] || 
                    `user_${user.id.slice(0, 8)}`;

    return {
      id: user.id,
      email: user.email || '',
      username: sanitizeUsername(username),
      displayName: userMetadata.display_name || userMetadata.full_name || username,
      avatarUrl: userMetadata.avatar_url || '',
      isEmailVerified: user.email_confirmed_at !== null,
      groups: determineUserGroups(user)
    };
  } catch (error) {
    console.error('Error getting Flarum user data:', error);
    return null;
  }
}

/**
 * Create a new JWT token for an existing user session
 * @param sessionToken - Supabase session token
 * @returns JWT token for Flarum or null if invalid session
 */
export async function createJWTFromSession(sessionToken: string): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionToken);
    
    if (error || !user) {
      console.error('Invalid session token:', error);
      return null;
    }

    return generateFlarumJWT(user);
  } catch (error) {
    console.error('Error creating JWT from session:', error);
    return null;
  }
}

/**
 * Refresh JWT token if it's close to expiration
 * @param token - Current JWT token
 * @param user - User object (optional, will fetch if not provided)
 * @returns New JWT token or original if not needed
 */
export async function refreshJWTIfNeeded(token: string, user?: any): Promise<string | null> {
  try {
    const decoded = verifyFlarumJWT(token);
    
    if (!decoded) {
      return null;
    }

    // Refresh if token expires in less than 15 minutes
    const fifteenMinutes = 15 * 60;
    const timeUntilExpiration = decoded.exp - Math.floor(Date.now() / 1000);
    
    if (timeUntilExpiration > fifteenMinutes) {
      return token; // Token is still valid for a while
    }

    // Need to refresh - get user if not provided
    if (!user) {
      const userData = await getFlarumUserData(decoded.userId);
      if (!userData) {
        return null;
      }
      // Convert FlarumUserData back to user object format
      user = {
        id: userData.id,
        email: userData.email,
        user_metadata: {
          display_name: userData.displayName,
          avatar_url: userData.avatarUrl
        }
      };
    }

    return generateFlarumJWT(user);
  } catch (error) {
    console.error('Error refreshing JWT:', error);
    return null;
  }
}

/**
 * Sanitize username for Flarum compatibility
 * @param username - Raw username
 * @returns Sanitized username
 */
function sanitizeUsername(username: string): string {
  // Remove special characters, keep only alphanumeric, underscore, and hyphen
  let sanitized = username.replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Ensure minimum length of 3 characters
  if (sanitized.length < 3) {
    sanitized = sanitized.padEnd(3, '0');
  }
  
  // Ensure maximum length of 30 characters
  if (sanitized.length > 30) {
    sanitized = sanitized.substring(0, 30);
  }
  
  return sanitized || 'user';
}

/**
 * Determine user groups based on user metadata or other criteria
 * @param user - Supabase user object
 * @returns Array of group names
 */
function determineUserGroups(user: User): string[] {
  const groups = ['member']; // Default group
  const userMetadata = user.user_metadata as UserMetadata || {};
  
  // Add additional groups based on user metadata
  if (userMetadata.is_admin) {
    groups.push('admin');
  }
  
  if (userMetadata.is_moderator) {
    groups.push('moderator');
  }
  
  // Add groups based on email domain (example)
  if (user.email?.endsWith('@solarity.farm')) {
    groups.push('staff');
  }
  
  // Add premium group if user has premium subscription
  if (userMetadata.subscription_tier === 'premium') {
    groups.push('premium');
  }
  
  return groups;
}

/**
 * Validate JWT payload structure
 * @param payload - JWT payload to validate
 * @returns True if valid, false otherwise
 */
export function validateJWTPayload(payload: any): payload is FlarumSSOPayload {
  return (
    payload &&
    typeof payload.userId === 'string' &&
    typeof payload.username === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.iat === 'number' &&
    typeof payload.exp === 'number' &&
    typeof payload.iss === 'string' &&
    typeof payload.aud === 'string' &&
    payload.iss === 'sveltekit-app' &&
    payload.aud === 'flarum-community'
  );
}

/**
 * Create error response for JWT operations
 * @param message - Error message
 * @param code - Error code
 * @returns Standardized error object
 */
export function createJWTError(message: string, code: string = 'JWT_ERROR') {
  return {
    error: true,
    message,
    code,
    timestamp: new Date().toISOString()
  };
}

/**
 * Log JWT operations for debugging and security monitoring
 * @param operation - Operation being performed
 * @param details - Additional details
 */
export function logJWTOperation(operation: string, details: any = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[JWT] ${operation}:`, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }
}
