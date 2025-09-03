// Utility functions for optimized session management

export function clearAuthCookies(cookies: any) {
  // Clear all Supabase auth cookies
  const authCookieNames = [
    'sb-access-token',
    'sb-refresh-token', 
    'sb-auth-token',
    'sb-provider-token',
    'sb-auth.token'
  ];

  authCookieNames.forEach(name => {
    cookies.delete(name, { path: '/' });
  });

  // Clear any other auth-related cookies
  cookies.getAll().forEach((cookie: any) => {
    if (cookie.name.startsWith('sb-') || 
        cookie.name.includes('auth') || 
        cookie.name.includes('session')) {
      cookies.delete(cookie.name, { path: '/' });
    }
  });
}

export function truncateCookieValue(value: string, maxLength: number = 1000): string {
  if (value.length <= maxLength) {
    return value;
  }
  
  // For JWT tokens, try to keep the essential parts
  if (value.includes('.')) {
    const parts = value.split('.');
    if (parts.length === 3) {
      // It's likely a JWT, try to preserve structure while truncating
      const header = parts[0];
      const payload = parts[1].substring(0, Math.floor(maxLength * 0.6));
      const signature = parts[2].substring(0, Math.floor(maxLength * 0.2));
      return `${header}.${payload}.${signature}`;
    }
  }
  
  return value.substring(0, maxLength);
}

export function getCookieSize(cookies: any[]): number {
  return cookies.reduce((total, cookie) => {
    return total + cookie.name.length + cookie.value.length + 10; // +10 for separators
  }, 0);
}

export function optimizeCookies(cookies: any[], maxTotalSize: number = 4000): any[] {
  let currentSize = getCookieSize(cookies);
  
  if (currentSize <= maxTotalSize) {
    return cookies;
  }

  // Sort by priority (auth cookies first, then by size)
  const sortedCookies = cookies.sort((a, b) => {
    const aIsAuth = a.name.startsWith('sb-') || a.name.includes('auth');
    const bIsAuth = b.name.startsWith('sb-') || b.name.includes('auth');
    
    if (aIsAuth && !bIsAuth) return -1;
    if (!aIsAuth && bIsAuth) return 1;
    
    return b.value.length - a.value.length; // Larger cookies first for truncation
  });

  const optimizedCookies = [];
  currentSize = 0;

  for (const cookie of sortedCookies) {
    const cookieSize = cookie.name.length + cookie.value.length + 10;
    
    if (currentSize + cookieSize <= maxTotalSize) {
      optimizedCookies.push(cookie);
      currentSize += cookieSize;
    } else {
      // Try to truncate the cookie value
      const remainingSpace = maxTotalSize - currentSize - cookie.name.length - 10;
      if (remainingSpace > 50) { // Only if we have reasonable space left
        optimizedCookies.push({
          ...cookie,
          value: truncateCookieValue(cookie.value, remainingSpace)
        });
        break; // No more space for additional cookies
      }
    }
  }

  return optimizedCookies;
}
