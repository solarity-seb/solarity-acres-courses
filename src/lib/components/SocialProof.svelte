<script lang="ts">
	// Define Picture type locally to match usage
	interface Picture {
		img: { src: string; w: number; h: number; };
		sources: Record<string, string>;
	}
	
	export let people: { name: string; image: string | Picture }[] = [];
	export let align: 'left' | 'center' = 'left';
	export let text: string;
	
	// Helper function to get image src
	function getImageSrc(image: string | Picture): string {
		return typeof image === 'string' ? image : image.img.src;
	}
</script>

<div class="social-proof {align === 'center' ? 'center' : ''}">
	<div class="avatars">
		{#each people as person}
			<span class="tooltip-wrapper" tabindex="0">
				<enhanced:img
					src={getImageSrc(person.image)}
					alt={person.name}
					loading="lazy"
					width="40"
					height="40"
					class="avatar"
				/>
				<span class="tooltip-content">
					{person.name}
					<span class="tooltip-arrow"></span>
				</span>
			</span>
		{/each}
	</div>
	<p class="social-proof-text text--xs">
		{text}
	</p>
</div>

<style>
	.social-proof {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: var(--grey-900);
		font-size: var(--text-xs);
	}
	.social-proof.center {
		justify-content: center;
		text-align: center;
	}
	.social-proof-text {
		margin: 0;
	}
	.avatars {
		display: flex;
		justify-content: flex-start;
	}
	.social-proof.center .avatars {
		justify-content: center;
	}

	.avatars > * {
		margin-left: -15px;
	}
	.avatars > *:first-child {
		margin-left: 0;
	}

	.avatar {
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid var(--light);
		background-color: white;
		display: block;
		width: 46px;
		height: 46px;
		margin: 0;
		position: relative;
	}

	.tooltip-wrapper {
		position: relative;
		display: inline-block;
		vertical-align: top;
		transition: transform 0.4s var(--cubic);
		will-change: transform;
	}
	.tooltip-wrapper:hover,
	.tooltip-wrapper:focus-within {
		transform: translateY(-10px) rotate(-3deg);
	}

	.tooltip-content {
		position: absolute;
		bottom: 125%;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--dark);
		color: var(--light);
		padding: 0.4em 0.6em;
		border-radius: 4px;
		font-size: var(--text-xs);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.2s var(--cubic);
		pointer-events: none;
		z-index: 10;
	}
	.tooltip-wrapper:hover .tooltip-content,
	.tooltip-wrapper:focus-within .tooltip-content {
		opacity: 1;
	}

	.tooltip-arrow {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid var(--dark);
	}
</style>
