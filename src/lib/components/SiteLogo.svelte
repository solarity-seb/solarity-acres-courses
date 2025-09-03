<script lang="ts">
	import siteLogo from '$lib/images/site-logo.png?enhanced';
	export let width: number = 24;
	export let hideTextMobile: boolean = false;
	export let centered: boolean = false;
</script>


<a
	href="/"
	class="eyebrow"
	class:centered={centered}
>
	<enhanced:img
		src={siteLogo}
		alt="Site Logo"
		loading="lazy"
		class="logo-image"
		style={`width: ${width}px; height: auto;`}
	/>
	<span class:hide-on-mobile={hideTextMobile}>
		solarity<span class="heavy">acres</span>
	</span>
</a>



<style>
	.heavy {
	font-weight: bold;
	color: var(--text-color);
}

a.eyebrow {
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	color: inherit;
}

a.eyebrow.centered {
	justify-content: center;
	width: 100%;
	text-align: center;
}

.logo-image {
	display: block;
	flex-shrink: 0;
	margin-right: 0.5rem;
	transition: transform 0.3s var(--cubic);
}

.logo-image:hover {
	transform: rotate(-10deg) scale(1.1);
}


.hide-on-mobile {
	display: inline;
}

@media (max-width: 900px) {
	.hide-on-mobile {
		display: none;
	}
}


</style>
