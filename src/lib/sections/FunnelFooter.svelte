<script lang="ts">
	import { navLinks } from '$lib/data/navLinks.js';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import SiteLogo from '$lib/components/SiteLogo.svelte';


import { derived } from 'svelte/store';
    import NewsLetter from '$lib/components/NewsLetter.svelte';



	const location = 'footer';

	$: footerLinks = navLinks.filter(
		link => link.location === 'both' || link.location === location
	);

	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="footer-grid">
		<!-- Column 1: Logo -->
		<div class="footer-logo">
			<SiteLogo width={50} hideTextMobile={false} centered={true} />
			<SocialLinks direction="h" fixedPosition={false} hideOnMobile={false} width="24" />
		</div>

		

	</div>


	<!-- Bottom Line -->
	<div class="footer-bottom">
		<p aria-hidden="true" class="text--xs">&copy; {year} All rights reserved.</p>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--bg);
		color: var(--text);
		padding: 3rem 1rem 0rem 1rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	h4 {
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.footer-logo {
		justify-self: center;
		align-self: start;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.footer-nav ul {
	display: flex;
	flex-direction: row; /* 👈 make it horizontal */
	flex-wrap: wrap;     /* optional, allows wrapping on small screens */
	gap: 1rem;           /* space between items */
	list-style: none;
	padding: 0;
	margin: 0;
}


	.footer-nav a {
		color: var(--text);
		text-decoration: none;
	}

	.footer-nav a:hover {
		color: var(--accent);
	}

	.footer-social {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.footer-bottom {
		text-align: center;
		margin-top: 3rem;
	}

	.footer-bottom a {
		text-decoration: underline;
	}

    .site-footer a.active {
	font-weight: 600;
}

</style>


<div class="gradient-line"></div>