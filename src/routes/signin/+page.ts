import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent, url }) => {
  const { supabase, session, user } = await parent()
  
  // If user is already logged in, redirect them away from signin page
  if (session && user) {
    const redirectTo = url.searchParams.get('redirectTo') || '/private';
    throw redirect(303, redirectTo);
  }
  
  return {
    supabase,
    session
  }
}
