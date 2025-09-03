<script lang="ts">
	import { onMount } from 'svelte';
	import { colorMode, toggleMode } from '$lib/stores/colorMode';

	let mode: string | null = null;

	onMount(() => {
		const unsubscribe = colorMode.subscribe((value: string) => {
			mode = value;
		});
		return unsubscribe;
	});

	$: label = `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`;
</script>

{#if mode}
	<button
		on:click={toggleMode}
		aria-label={label}
		class="theme-toggle"
	>
		{#if mode === 'dark'}
			<!-- Sun icon -->
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="5" />
				<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
			</svg>
		{:else}
			<!-- Moon icon -->
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path
					d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
			</svg>
		{/if}
	</button>
{/if}

<style>
	.theme-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-color);
		transition: color 0.3s;
	}

	svg {
		width: 1.5rem;
		height: 1.5rem;
		stroke: currentColor;
		transition: transform 0.3s ease, opacity 0.3s ease;
	}

	button:hover svg {
		transform: scale(1.1);
	}
</style>
