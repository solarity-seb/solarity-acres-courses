<script>
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import '../app.css';
  import Header from '$lib/sections/Header.svelte';

  let { data, children } = $props()
  let { session, supabase } = $derived(data)

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })
  return () => subscription?.unsubscribe()
  })
</script>

<Header user={data.user} />

{@render children()}