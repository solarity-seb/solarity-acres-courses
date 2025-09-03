<!-- routes/signup/+page.svelte -->

<svelte:head>
	<meta name="description" content="Join our community of growers" />
</svelte:head>

<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';
	
	export let data;
	
	let currentMode: 'signin' | 'signup' | 'forgot' = 'signup';
	
	function handleModeChange(event: CustomEvent) {
		currentMode = event.detail;
		updatePageContent();
	}
	
	let pageTitle = 'Join the Community';
	let pageSubtitle = 'Join likeminded growers and get access to exclusive content and a supportive community.';
	let eyebrowText = 'Join Us!';
	
	function updatePageContent() {
		if (currentMode === 'signin') {
			pageTitle = 'Welcome Back';
			pageSubtitle = 'Sign in to access your account and continue your growing journey.';
			eyebrowText = 'Welcome!';
		} else if (currentMode === 'signup') {
			pageTitle = 'Join the Community';
			pageSubtitle = 'Join likeminded growers and get access to exclusive content and a supportive community.';
			eyebrowText = 'Join Us!';
		} else if (currentMode === 'forgot') {
			pageTitle = 'Reset Password';
			pageSubtitle = 'Enter your email address and we\'ll send you a link to reset your password.';
			eyebrowText = 'No Worries!';
		}
	}
</script>

<SEO
	title={pageTitle}
	description={pageSubtitle}
	url="/signup"
	noIndex={false}
/>

<PageTitle
	subheading={pageSubtitle}
	alignment="center"
	bg="bg1"
>
	<svelte:fragment slot="top">
		<p class="eyebrow">{eyebrowText}</p>
		<h1>
			{#if currentMode === 'signin'}
				Welcome <em>Back</em>
			{:else if currentMode === 'signup'}
				Join the <em>Community</em>
			{:else if currentMode === 'forgot'}
				Reset Your <em>Password</em>
			{/if}
		</h1>
	</svelte:fragment>
</PageTitle>

<section>
	<div class="flex-grid">
		<div class="col-12">
			<div class="card card-1 u-card-padding">
				<AuthForm 
					supabase={data.supabase} 
					mode={currentMode}
					on:modeChange={handleModeChange}
				/>
			</div>
		</div>
	</div>
</section>