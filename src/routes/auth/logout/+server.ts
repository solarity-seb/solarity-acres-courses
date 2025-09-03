import { redirect } from '@sveltejs/kit';
import { clearAuthCookies } from '$lib/server/cookieUtils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  const { supabase } = locals;

  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear cookies, even if Supabase signout fails
    clearAuthCookies(cookies);
  }

  throw redirect(303, '/');
};
