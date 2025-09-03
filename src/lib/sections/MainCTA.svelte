<script lang="ts">
  import ButtonGroup from '$lib/components/Buttons.svelte';
</script>

<!-- Hardcoded so you can use this anywhere and change in multiple places at once. -->

<section class="bg2 u-flex-center">
  <div class="grid-container full u-card-padding card card-1 u-text-center u-flex-center">
    <div class="cta-inner">

      <p class="u-text-accent u-text-sm">Want to join the best gardening community?</p>

      <h2>Join our community. <span class="banner">Coming Soon!</span></h2>

      <p>
        Get instant access to all of our resources and a community of other gardeners. Ask me questions directly, or disucss with other farmers and gardeners.
      </p>

     <ButtonGroup
  primaryText="Join Community"
  primaryLink="/community"
  lineText="More Info"
  lineLink="/community"
  lineAriaLabel="Learn more about Solarity Acres Community"
/>


    </div>
  </div>
</section>