import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  // EMERGENCY: Clear ALL cookies to reset the session
  const allCookies = cookies.getAll();
  
  allCookies.forEach(cookie => {
    cookies.delete(cookie.name, { path: '/' });
    cookies.delete(cookie.name, { path: '/', domain: '.localhost' });
    cookies.delete(cookie.name, { path: '/', domain: 'localhost' });
  });

  // Also clear specific Supabase cookies that might exist
  const supabaseCookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-auth-token',
    'sb-provider-token',
    'sb-auth.token',
    'sb-localhost-auth-token'
  ];

  supabaseCookieNames.forEach(name => {
    cookies.delete(name, { path: '/' });
    cookies.delete(name, { path: '/', domain: '.localhost' });
    cookies.delete(name, { path: '/', domain: 'localhost' });
  });

  console.log('Emergency cookie cleanup completed');
  
  throw redirect(303, '/');
};
