import { json } from '@sveltejs/kit';
import { getCookieSize } from '$lib/server/cookieUtils';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals }) => {
  // Only available in development or for authenticated admin users
  const { safeGetSession } = locals;
  const { session, user } = await safeGetSession();

  if (!dev && (!user || !user.user_metadata?.is_admin)) {
    return new Response('Not found', { status: 404 });
  }

  const allCookies = cookies.getAll();
  const authCookies = allCookies.filter(cookie => 
    cookie.name.startsWith('sb-') || 
    cookie.name.includes('auth') ||
    cookie.name.includes('session')
  );

  const totalCookieSize = getCookieSize(allCookies);
  const authCookieSize = getCookieSize(authCookies);

  const cookieStats = {
    totalCookies: allCookies.length,
    authCookies: authCookies.length,
    totalSize: totalCookieSize,
    authSize: authCookieSize,
    hasSession: !!session,
    hasUser: !!user,
    userEmail: user?.email || null,
    cookieDetails: authCookies.map(cookie => ({
      name: cookie.name,
      size: cookie.value.length,
      truncated: cookie.value.length > 50 ? cookie.value.substring(0, 50) + '...' : cookie.value
    })),
    recommendations: {
      sizeStatus: totalCookieSize > 4000 ? 'CRITICAL' : totalCookieSize > 2000 ? 'WARNING' : 'OK',
      message: totalCookieSize > 4000 
        ? 'Cookie size is too large and may cause issues'
        : totalCookieSize > 2000
        ? 'Cookie size is getting large, consider optimization'
        : 'Cookie size is within acceptable limits'
    }
  };

  return json(cookieStats);
};
