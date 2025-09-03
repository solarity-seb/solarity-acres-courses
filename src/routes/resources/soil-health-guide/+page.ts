import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { user, supabase } = await parent();
  return {
    user,
    supabase
  };
};
