// lib/utils/redirectUrls.ts
import { browser } from '$app/environment';
import { dev } from '$app/environment';
import { PUBLIC_BASE_URL } from '$env/static/public';

// Fallback production domain if env var is not set
const PRODUCTION_DOMAIN = PUBLIC_BASE_URL || 'https://solarity.farm';

/**
 * Get the base URL for redirects based on environment
 */
export function getBaseUrl(): string {
  if (browser) {
    // Client-side: use window.location.origin
    return window.location.origin;
  }
  
  // Server-side: use production domain in production, localhost in dev
  if (dev) {
    return 'http://localhost:5175'; // Current SvelteKit dev port
  }
  
  return PRODUCTION_DOMAIN;
}

/**
 * Get the auth callback URL (for OAuth)
 */
export function getAuthCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`;
}

/**
 * Get the email confirmation URL (for email verification)
 */
export function getEmailConfirmUrl(): string {
  return `${getBaseUrl()}/auth/confirm`;
}

/**
 * Get the reset password URL
 */
export function getResetPasswordUrl(): string {
  return `${getBaseUrl()}/auth/reset-password`;
}

/**
 * Get the email verification URL  
 */
export function getEmailVerificationUrl(): string {
  return `${getBaseUrl()}/auth/confirm`;
}
