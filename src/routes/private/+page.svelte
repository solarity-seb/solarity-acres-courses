<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/private/profile', { replaceState: true });
  });
</script>

<!-- This page will automatically redirect to profile -->
<div>Redirecting to profile...</div>