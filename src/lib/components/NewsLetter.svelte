<script lang="ts">
  export let heading: string = "Sign up for my Newsletter!";
  export let description: string = "Sign up for my newsletter! It's really fun and educational. Unsubscribe at anytime.";
  export let waitlistItem: string = "Newsletter";
  export let customSubmitText: string = "Subscribe to Newsletter";

  import WaitlistForm from '$lib/components/WaitlistForm.svelte';
</script>

<section class="bg1 newsletter-section">
  <div class="flex-grid">
    <div class="col-12 u-text-center">
      <h3>{heading}</h3>
      <p>{description}</p>
      <WaitlistForm
        waitlistItem={waitlistItem}
        customSubmitText={customSubmitText}
        showGardenDropdown={false}
      />
    </div>
  </div>
</section>

<style>

  .newsletter-section p {
    max-width: 600px;
    margin-inline: auto;
  }
</style>
