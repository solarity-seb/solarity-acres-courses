<script lang="ts">
  import ButtonGroup from '$lib/components/Buttons.svelte';

  export let headline: string;
  export let text: string = '';
  export let primaryButtonText: string;
  export let primaryButtonLink: string;
  export let secondaryButtonText: string = '';
  export let secondaryButtonLink: string = '';
  export let lineText: string = '';
  export let lineLink: string = '';
  export let bg: 'bg1' | 'bg2' | 'bg3' = 'bg1';
  export let useCard: boolean = true;
  export let centered: boolean = true;
  export let eyebrow: string = '';
</script>

<section class={`${bg} u-flex-center`}>
  <div class={`grid-container full u-card-padding ${useCard ? 'card card-1' : ''} ${centered ? 'u-text-center u-flex-center' : 'u-text-left'}`}>
    <div class="cta-inner">
      
      <slot name="above" />

      {#if eyebrow}
        <p class="u-text-accent u-text-sm">{eyebrow}</p>
      {/if}

      {#if headline}<h2>{headline}</h2>{/if}
      {#if text}<p>{text}</p>{/if}

      <ButtonGroup
        primaryText={primaryButtonText}
        primaryLink={primaryButtonLink}
        secondaryText={secondaryButtonText}
        secondaryLink={secondaryButtonLink}
        lineText={lineText}
        lineLink={lineLink}
      />

      <slot name="below" />
    </div>
  </div>
</section>
