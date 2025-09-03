<!-- src/lib/components/SEO.svelte -->
<script lang="ts">
	export let title: string;
	export let description: string;
	export let image: string = '/images/opengraph.jpg';
	export let url: string;
	export let noIndex: boolean = false;
  </script>
  
  <svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- Conditionally add noindex -->
	{#if noIndex}
		<meta name="robots" content="noindex" />
	{/if}
  
	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
  
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
  </svelte:head>
  