<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { Session, User } from '@supabase/supabase-js';
  
  let { data } = $props();
  
  let debugInfo = $state<{
    session: Session | null;
    user: User | null;
    localStorage: any;
    timestamp: string;
  }>({
    session: null,
    user: null,
    localStorage: null,
    timestamp: new Date().toISOString()
  });
  
  onMount(async () => {
    if (browser) {
      // Check localStorage
      const localStorageData = localStorage.getItem('supabase.auth.token');
      
      // Get current session from Supabase
      const { data: sessionData } = await data.supabase.auth.getSession();
      
      debugInfo = {
        session: sessionData.session,
        user: sessionData.session?.user || null,
        localStorage: localStorageData,
        timestamp: new Date().toISOString()
      };
    }
  });
</script>

{#if browser}
  <div style="position: fixed; top: 10px; right: 10px; background: white; border: 2px solid #ccc; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 12px; max-width: 300px; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h4 style="margin: 0 0 10px 0; color: #333;">🐛 Auth Debug</h4>
    
    <div><strong>Server Data:</strong></div>
    <div>Session: {data.session ? '✅' : '❌'}</div>
    <div>User: {data.user ? '✅' : '❌'}</div>
    
    <div style="margin-top: 10px;"><strong>Client State:</strong></div>
    <div>Session: {debugInfo.session ? '✅' : '❌'}</div>
    <div>User: {debugInfo.user ? '✅' : '❌'}</div>
    <div>LocalStorage: {debugInfo.localStorage ? '✅' : '❌'}</div>
    
    {#if debugInfo.user}
      <div style="margin-top: 10px; color: green;">
        <strong>User ID:</strong> {debugInfo.user.id.slice(0, 8)}...
      </div>
    {/if}
    
    <div style="margin-top: 10px; font-size: 10px; color: #666;">
      Last updated: {debugInfo.timestamp.split('T')[1].split('.')[0]}
    </div>
  </div>
{/if}
