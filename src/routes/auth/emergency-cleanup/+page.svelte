<script lang="ts">
  import { enhance } from '$app/forms';
  
  let loading = false;
</script>

<div style="padding: 2rem; text-align: center; font-family: sans-serif;">
  <h1>🚨 Emergency Cookie Cleanup</h1>
  <p>If you're seeing 431 errors (Request Header Fields Too Large), click the button below to clear all cookies and reset your session.</p>
  
  <form method="POST" action="/auth/emergency-cleanup" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}>
    <button 
      type="submit" 
      disabled={loading}
      style="
        background: #ef4444;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.1rem;
        cursor: pointer;
        margin: 1rem;
      "
    >
      {#if loading}
        Clearing Cookies...
      {:else}
        🧹 Clear All Cookies & Reset Session
      {/if}
    </button>
  </form>
  
  <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px; max-width: 500px; margin: 2rem auto;">
    <h3>What this does:</h3>
    <ul style="text-align: left;">
      <li>Clears all authentication cookies</li>
      <li>Resets your session completely</li>
      <li>Redirects you to the home page</li>
      <li>Fixes 431 header size errors</li>
    </ul>
    <p><strong>Note:</strong> You'll need to log in again after this.</p>
  </div>
</div>
