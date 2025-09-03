<script lang="ts">
	import type { Picture } from 'vite-imagetools';
	import SocialProof from './SocialProof.svelte';

	export let eyebrow: string | undefined = undefined;
	export let heading: string | undefined = undefined;
	export let subheading: string | undefined = undefined;
	export let alignment: 'left' | 'center' = 'left';
	export let bg: 'bg1' | 'bg2' | 'bg3' = 'bg1';
	export let usePill: boolean = false;

	export let people: { name: string; image: Picture }[] = [];
	export let socialText: string = '';
	export let showSocialProof: boolean = false;
</script>

<section class={bg}>
	<div
		class="container"
		class:u-text-left={alignment === 'left'}
		class:u-text-center={alignment === 'center'}
		style="z-index: 1"
	>
		<slot name="top" />

		{#if eyebrow}
			<p class="eyebrow" class:pill={usePill}>{eyebrow}</p>
		{/if}

		<h1>{heading}</h1>

		{#if subheading}
			<p class="subheading">{@html subheading}</p>
		{/if}

		{#if showSocialProof && people.length > 0}
			<SocialProof {people} text={socialText} align="center" />
		{/if}

		<slot />
	</div>
</section>

<style>
	.container {
		max-width: var(--grid-max-width);
		width: var(--grid-width);
		margin: 0 auto;
		padding: 2rem 0;
	}
	.u-text-left {
		text-align: left;
	}
	.u-text-center {
		text-align: center;
	}
	.u-text-left .subheading {
		margin: 0;
	}
	@media (max-width: 768px) {
		.container {
			width: var(--grid-width-mobile);
		}
	}
</style>
