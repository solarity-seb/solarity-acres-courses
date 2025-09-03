<script lang="ts">
	export let eyebrow: string | null = null;
	export let heading: string | null = null;
	export let text: string = '';
	export let headingLevel: string = 'h2';
	export let centered: boolean = false;
	export let badge: string = '';

	$: alignmentClass = centered ? 'u-text-center' : 'u-text-left';
</script>

<div class={`textblock-container ${alignmentClass}`}>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}

	{#if heading}
		<div class="heading-wrapper">
			{@html `<${headingLevel}>${heading}</${headingLevel}>`}
			{#if badge}
				<span class="badge">{badge}</span>
			{/if}
		</div>
	{/if}

	{#if text}
		<p>{@html text}</p>
	{/if}
</div>

<style>
  .heading-wrapper {
	position: relative;
	display: inline-block;
}

/* You can adapt this if you're using utility classes for text size */
.heading-wrapper h1,
.heading-wrapper h2,
.heading-wrapper h3,
.heading-wrapper h4,
.heading-wrapper h5,
.heading-wrapper h6 {
	margin: 0;
}


/* Badge styling */
.badge {
	position: absolute;
	top: 1em;
	right: -3.6em;
	background-color: var(--accent);
	color: var(--light);
	padding: 0.2em 0.6em;
	border-radius: 999px;
	font-size: var(--text-xs);
	font-weight: bold;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
	white-space: nowrap;
}

</style>