<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import SEO from '$lib/components/SEO.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	
	$: errorMessage = $page.url.searchParams.get('message');
	
	$: specificMessage = (() => {
		switch (errorMessage) {
			case 'invalid-token':
				return 'Your email is already confirmed! The verification link has been used or expired.';
			case 'verification-failed':
				return 'Email verification failed. This could be because the link has expired or was already used. Please try signing up again or request a new verification email.';
			case 'unexpected-error':
				return 'An unexpected error occurred during verification. Please try again or contact support.';
			default:
				return 'There was an issue with your authentication. Please try again.';
		}
	})();

	$: isAlreadyConfirmed = errorMessage === 'invalid-token';
</script>

<SEO
	title="Authentication Error"
	description="There was an error with authentication."
	url="/auth/error"
	noIndex={true}
/>

<PageTitle
	subheading={specificMessage}
	alignment="center"
	bg="bg1"
>
	<svelte:fragment slot="top">
		<p class="eyebrow">Oops!</p>
		<h1>Authentication <em>Error</em></h1>
	</svelte:fragment>
</PageTitle>

<section>
	<div class="flex-grid">
		<div class="col-12">
			<div class="card card-1 u-card-padding">
				<div style="text-align: center;">
					{#if isAlreadyConfirmed}
						<p><strong>Good news!</strong> Your email is already confirmed and ready to use.</p>
						<p>You can now log in to your account.</p>
						<div class="btn-container" style="margin-top: 2rem;">
							<button class="btn btn-primary" on:click={() => goto('/signin')}>
								Go to Login
							</button>
							<button class="btn btn-secondary" on:click={() => goto('/')}>
								Go Home
							</button>
						</div>
					{:else}
						<p>We encountered an issue while trying to authenticate you.</p>
						<p>This could be due to:</p>
						<ul style="text-align: left; max-width: 400px; margin: 2rem auto;">
							<li>An expired or invalid authentication link</li>
							<li>A network connection issue</li>
							<li>The authentication provider is temporarily unavailable</li>
						</ul>
						<div class="btn-container" style="margin-top: 2rem;">
							<button class="btn btn-primary" on:click={() => goto('/signup')}>
								Try Again
							</button>
							<button class="btn btn-secondary" on:click={() => goto('/')}>
								Go Home
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
