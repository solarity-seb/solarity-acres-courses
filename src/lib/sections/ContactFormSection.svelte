<script lang="ts">
  import ContactForm from "$lib/components/ContactForm.svelte";
  import SocialLinks from "$lib/components/SocialLinks.svelte";
  import defaultImage from '$lib/images/headshot.jpg?enhanced';

  export let backgroundClass: string = 'bg1';
  export let image: any = defaultImage;
  export let eyebrow: string = 'Contact';
  export let title: string = "let's work <em>together</em>.";
  export let introText: string = "If we're a good fit, I'll be in touch personally soon!";
</script>

<section class={backgroundClass + ' contact-form-section'}>
  <div class="grid-container thirds">
    <div>
      {#if image}
        <enhanced:img src={image} alt="" class="headshot" width="100" height="100" loading="lazy" />
      {/if}
      {#if eyebrow}
        <p class="eyebrow">{eyebrow}</p>
      {/if}
      {#if title}
        <h3>{@html title}</h3>
      {/if}
      {#if introText}
        <p>{introText}</p>
      {/if}
      <SocialLinks />
    </div>
    <div class="span-2">
      <ContactForm />
    </div>
  </div>
</section>

<style>
  .contact-form-section .headshot {
    width: 100px;
    border-radius: 100%;
    border: 4px solid var(--accent);
    margin-bottom: 1rem;
  }
</style>
