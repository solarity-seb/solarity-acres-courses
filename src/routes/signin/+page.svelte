<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import AuthDebug from '$lib/components/AuthDebug.svelte';
	import { dev } from '$app/environment';
	
	export let data;
</script>

{#if dev}
	<AuthDebug {data} />
{/if}

<SEO
	title="Sign In"
	description="Sign in to your account to access exclusive content and community features."
	url="/signin"
	noIndex={false}
/>

<PageTitle
	subheading="Sign in to access your account and continue your growing journey."
	alignment="center"
	bg="bg1"
>
	<svelte:fragment slot="top">
		<p class="eyebrow">Welcome Back!</p>
		<h1>Sign <em>In</em></h1>
	</svelte:fragment>
</PageTitle>

<section>
	<div class="flex-grid">
		<div class="col-12">
			<div class="card card-1 u-card-padding">
				<AuthForm 
					supabase={data.supabase} 
					mode="signin"
				/>
			</div>
		</div>
	</div>
</section>
