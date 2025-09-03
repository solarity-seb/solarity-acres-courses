<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import ClientUserProfile from '$lib/components/ClientUserProfile.svelte';
	
	export let data;
</script>

<SEO
	title="Profile Settings"
	description="Manage your account settings and profile information."
	url="/private/profile"
	noIndex={true}
/>

<PageTitle
	subheading="Manage your account settings and profile information."
	alignment="center"
	bg="bg1"
>
	<svelte:fragment slot="top">
		<p class="eyebrow">Account</p>
		<h1>Profile <em>Settings</em></h1>
	</svelte:fragment>
</PageTitle>

<section>
	<div class="flex-grid">
		<div class="col-12">
			<div class="card card-1 u-card-padding">
				<ClientUserProfile {data} />
			</div>
		</div>
	</div>
</section>
