<script lang="ts">
	import TwoCol from '$lib/sections/TwoCol.svelte';
	import CallToAction from '$lib/sections/CallToAction.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

  import SEO from '$lib/components/SEO.svelte';

  import Pricing from '$lib/components/Pricing.svelte';
  import PriceTimeline from '$lib/sections/PriceTimeline.svelte';



</script>


<SEO
  title="Join the Community"
  description="Get instant free access to a bunch of resources and join a community of like-minded growers."
  url="/"
  noIndex={false}
/>

<PageTitle
  subheading="Get instant free access to a bunch of resources and join a community of like-minded growers."
  alignment="center"
  bg="bg1"
>
  <svelte:fragment slot="top">
    <p class="eyebrow">Join Now!</p>
    <h1>
      Join the ultimate <em>gardening community</em>.
    </h1>
  </svelte:fragment>
</PageTitle>

<CallToAction
	headline="Join Now!"
	text="Join the ultimate gardening community. Get instant free access to a bunch of resources and join a community of like-minded growers."
	primaryButtonText="Join Free"
	primaryButtonLink="/signup"
	secondaryButtonText="Learn More"
	secondaryButtonLink="/signup"
	eyebrow="Grow with us"
	bg="bg1"
	useCard={true}
	centered={true}
/>