<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { onMount, tick } from 'svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { fade } from 'svelte/transition';
	import SiteLogo from '$lib/components/SiteLogo.svelte';
	import { navLinks } from '$lib/data/navLinks.js';
	import ColorModeToggle from '$lib/components/ColorModeToggle.svelte';

	import type { User } from '@supabase/supabase-js';
  	const { user } = $props<{ user: User | null }>();

	const location = 'header';
const mainLayout = 'main';
const mobileLayout = 'mobile';


const getFilteredNavLinks = (links: any[], authenticated: boolean) => {
	return links.filter(link => {
		
		if (link.href === '/signup' || link.href === '/signin') {
			return !authenticated;
		}
		
		if (link.href.startsWith('/private')) {
			return authenticated;
		}
		
		return true;
	}).filter(link =>
		['both', location].includes(link.location)
	);
};

// main nav (desktop)
const mainNavLinks = $derived(
	getFilteredNavLinks(navLinks, !!user).filter(link =>
		['both', mainLayout].includes(link.layout)
	)
);

// mobile nav
const mobileNavLinks = $derived(
	getFilteredNavLinks(navLinks, !!user).filter(link =>
		['both', mobileLayout].includes(link.layout)
	)
);


const navCTA = $derived(mainNavLinks.find(link => link.cta));
const navLinksWithoutCTA = $derived(mainNavLinks.filter(link => !link.cta));




let menuOpen = $state(false);

	let menuRef: HTMLElement;



	const currentPath = derived(page, $page => $page.url.pathname);

	let firstFocusable: HTMLElement;
	let lastFocusable: HTMLElement;

	async function trapFocus() {
		await tick();
		const focusables = menuRef?.querySelectorAll<HTMLElement>(
			'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
		);
		if (!focusables?.length) return;
		firstFocusable = focusables[0];
		lastFocusable = focusables[focusables.length - 1];
		firstFocusable.focus();
	}



	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			menuOpen = false;
		}
		if (event.key === 'Tab' && menuOpen && firstFocusable && lastFocusable) {
			if (event.shiftKey && document.activeElement === firstFocusable) {
				event.preventDefault();
				lastFocusable.focus();
			} else if (!event.shiftKey && document.activeElement === lastFocusable) {
				event.preventDefault();
				firstFocusable.focus();
			}
		}
	}

	import { afterNavigate } from '$app/navigation';

onMount(() => {
	document.addEventListener('keydown', handleKeydown);

	afterNavigate(() => {
		menuOpen = false;
	});

	return () => {
		document.removeEventListener('keydown', handleKeydown);
	};
});


$effect(() => {
	if (menuOpen) runTrapFocusSafely();
});


async function runTrapFocusSafely() {
	await tick();
	if (menuRef) {
		trapFocus();
	}
}


$effect(() => {
	if (typeof document !== 'undefined') {
		document.body.classList.toggle('menu-open', menuOpen);
	}
});

let showFixedHamburger = $state(false);

onMount(() => {
	const handleScroll = () => {
		showFixedHamburger = window.scrollY > 80;
	};

	handleScroll(); // in case user is already scrolled
	window.addEventListener('scroll', handleScroll);
	return () => window.removeEventListener('scroll', handleScroll);
});

import { goto } from '$app/navigation';

async function handleNav(href: string) {
  menuOpen = false;
  await tick();
  await new Promise((resolve) => setTimeout(resolve, 300)); // adjust for animation timing
  goto(href);
}



</script>


<div class:menu-open={menuOpen}>
	<nav class="navbar">
	<div class="nav-inner">
		<div class="nav-left">
			<SiteLogo width={50} hideTextMobile={true} centered={false} />

		</div>

		<!-- Desktop Nav -->
<div class="nav-center">
	<ul class="nav-links">
		{#each navLinksWithoutCTA as link}
			<li>
				<a
					href={link.href}
					class:active={$currentPath === link.href}
				>
					{link.name}
				</a>
			</li>
		{/each}
	</ul>
</div>

<div class="nav-right">
	{#if user}
		<a href="/private/profile" class="btn btn-secondary nav-cta">Profile</a>
	{:else}
		<!-- Show Login and Sign Up buttons when not authenticated -->
		<a href="/signin" class="nav-link">Login</a>
		<a href="/signup" class="btn btn-primary nav-cta">Sign Up</a>
	{/if}

	<button
		class="hamburger"
		onclick={() => (menuOpen = !menuOpen)}
		aria-label="Toggle menu"
		aria-expanded={menuOpen}
		aria-controls="mobile-menu"
	>
		<div class="hamburger-icon" class:open={menuOpen}>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</button>
</div>


		
	</div>

	{#if menuOpen}
	<!-- Backdrop -->
	<div class="menu-backdrop" 
		role="button" 
		tabindex="0"
		onclick={() => (menuOpen = false)} 
		onkeydown={(e) => e.key === 'Enter' && (menuOpen = false)}
		transition:fade>
	</div>
{/if}


	<!-- Mobile menu -->
	<div
	id="mobile-menu"
	class="mobile-menu"
	class:open={menuOpen}
	bind:this={menuRef}
	role="dialog"
	aria-modal="true"
	aria-label="Main navigation menu"
>

	
		<div class="mobile-menu-content" 
			role="dialog"
			onclick={(e) => e.stopPropagation()}
		>
			<div inert>
				<SiteLogo />
			</div>
			
			<!-- Mobile Nav -->
<ul>
	{#each mobileNavLinks as link}
	<li>
		<a
  href={link.href}
  tabindex="0"
  class:active={$currentPath === link.href}
  class:nav-cta={link.cta}
  onclick={(e) => { e.preventDefault(); handleNav(link.href); }}
>
  {link.name}
</a>

	  

	</li>
{/each}

	<!-- Mobile Auth Links -->
	{#if !user}
		<li>
			<a href="/signin" tabindex="0" onclick={(e) => { e.preventDefault(); handleNav('/signin'); }}>
				Login
			</a>
		</li>
		<li>
			<a href="/signup" tabindex="0" class="nav-cta" onclick={(e) => { e.preventDefault(); handleNav('/signup'); }}>
				Sign Up
			</a>
		</li>
	{/if}
</ul>

			
<div class="socials-dark-mode">

	<SocialLinks
		direction="h"
		fixedPosition = {false}
		hideOnMobile = {false}
		width = "24"
/>

<ColorModeToggle />
</div>
		
		</div>
		

	</div>
</nav>
{#if showFixedHamburger}
	<button
		class="hamburger fixed-hamburger"
		onclick={() => (menuOpen = !menuOpen)}
		aria-label="Toggle menu"
		aria-expanded={menuOpen}
		aria-controls="mobile-menu"
		transition:fade
	>
		<div class="hamburger-icon" class:open={menuOpen}>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</button>
{/if}

</div>


<style>
	:global(body) {
		overflow-x: hidden;
	}

	.navbar {
		background: var(--bg);
		padding: 1rem;
		position: relative;
		z-index: 1000;
	}

	.nav-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 1200px;
	margin: 0 auto;
	position: relative;
	height: 64px;
}

.nav-left {
	flex: 1;
	display: flex;
	justify-content: flex-start;
}

.nav-center {
	flex: 1;
	display: flex;
	justify-content: center;
}

.nav-right {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}


	/* .logo img {
		display: block;
		height: auto;
	} */

	.nav-links {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		margin-bottom: 0;
	}

	.nav-links a {
		text-decoration: none;
		color: var(--text);
		font-weight: 500;
	}

	.nav-link {
		text-decoration: none;
		color: var(--text-color);
		font-weight: 500;
		margin-right: 1.5rem;
		padding: 0.5rem 0;
		transition: color 0.3s ease;
	}

	.nav-link:hover {
		color: var(--accent);
	}

	a.active {
		border-bottom: 2px solid var(--accent);
	}

	
	/* Backdrop */
	.menu-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.3);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease;
	z-index: 999;
	/* backdrop-filter: blur(99px); */
}

:global(body.menu-open) .menu-backdrop {
	opacity: 1;
	pointer-events: auto;
}



	/* Slide-in menu */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: -100%;
		width: 80%;
		max-width: 100vw;
		height: 100vh;
		background: var(--bg);
		transition: right 0.8s var(--cubic);
		box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}

	.mobile-menu.open {
		right: 0;
	}
	
	.mobile-menu-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 2rem;
	padding-bottom: 5rem;
}
@media screen and (min-width: 386px) {
	.mobile-menu-content {
	padding-bottom: 2rem;
}
}

.mobile-menu-nav {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin: 0;
}

.mobile-menu a {
	text-decoration: none;
	color: var(--text);
	font-weight: 500;
	font-size: 1.5rem;
	text-align: center;
}


.mobile-menu ul {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: center;
}

.mobile-menu a {
	text-align: center;
	width: 100%; /* Optional: ensures bigger clickable area */
}


	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}
		.hamburger {
			display: block;
		}
	}

	.hamburger {
	display: block;
	position: relative;
	z-index: 1001; /* higher than mobile menu */
	background: none;
	border: none;
	padding: 0.5rem;
	cursor: pointer;
}
.hamburger:focus {
	box-shadow: none;
}

.hamburger:hover .hamburger-icon span {
	background-color: var(--accent);
	transform: scaleX(1.3);
}
.hamburger-icon span {
	transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}


	.hamburger-icon {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 24px;
	height: 18px;
	position: relative;
	transition: transform 0.3s ease;
}

.hamburger-icon span {
	display: block;
	width: 100%;
	height: 2px;
	background-color: var(--text-color);
	border-radius: 2px;
	transition: transform 0.3s ease, opacity 0.3s ease;
}


/* Animation to X */
.hamburger-icon.open span:nth-child(1) {
	transform: translateY(8px) rotate(45deg);
}

.hamburger-icon.open span:nth-child(2) {
	opacity: 0;
}

.hamburger-icon.open span:nth-child(3) {
	transform: translateY(-8px) rotate(-45deg);
}
.socials-dark-mode {
	display: flex;
  width: 100%;
  justify-content: center;
  gap: 1rem;
}

.fixed-hamburger {
	position: fixed;
	top: 1rem;
	right: 1rem;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	z-index: 1002; /* higher than everything else */
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.3s ease;
	fill: white;
	mix-blend-mode: difference;
}
.fixed-hamburger span {
	background-color: white; /* needs contrast to show difference */
	mix-blend-mode: difference;
}

@media (max-width: 327px) {
	.nav-left {
		display: none;
	}
}


.nav-links:hover a:not(:hover) {
	opacity: 0.6;
}
.nav-links:hover a {
	color: var(--text) !important;
}


</style>
