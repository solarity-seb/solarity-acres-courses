<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import { onMount } from 'svelte';
  import type { Session, User } from '@supabase/supabase-js';
  import '../../app.css';

  let { data, children } = $props()
  let { supabase } = $derived(data)
  
  // Client-side session management
  let session = $state<Session | null>(null);
  let user = $state<User | null>(null);
  let loading = $state(true);

  onMount(() => {
    async function setupAuth() {
      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      session = initialSession;
      
      if (initialSession) {
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        user = initialUser;
      } else {
        // Redirect to signup if no session
        goto('/signup');
        return;
      }
      
      loading = false;
    }
    
    setupAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      session = newSession;
      if (newSession) {
        const { data: { user: newUser } } = await supabase.auth.getUser();
        user = newUser;
      } else {
        user = null;
        goto('/signup');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  });

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
      goto('/');
    } catch (error) {
      console.error('Logout error:', error);
      goto('/');
    }
  }
</script>

<div class="private-layout">
  {#if loading}
    <div style="padding: 2rem; text-align: center;">
      <p>Loading...</p>
    </div>
  {:else}
    <nav class="private-nav">
      <div class="nav-content">
        <div class="nav-left">
          <h2>Profile</h2>
        </div>
        <div class="nav-right">
          {#if user}
            <div class="user-info">
              {#if user.user_metadata?.avatar_url}
                <img src={user.user_metadata.avatar_url} alt="Profile" class="user-avatar" />
              {/if}
              <span>Welcome, {user.user_metadata?.display_name || user.user_metadata?.full_name || user.email}</span>
            </div>
            <button class="btn btn-secondary logout-btn" onclick={handleLogout}>
              Logout
            </button>
          {/if}
        </div>
      </div>
    </nav>

    <main>
      {@render children()}
    </main>
  {/if}
</div>

<style>
  .private-layout {
    min-height: 100vh;
  }

  .private-nav {
    background-color: var(--bg);
    border-bottom: 2px solid var(--text-color);
    padding: 1rem 0;
    margin-bottom: 2rem;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-left h2 {
    margin: 0;
    color: var(--text-color);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info {
    color: var(--text-light);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--text-light);
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .nav-right {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>