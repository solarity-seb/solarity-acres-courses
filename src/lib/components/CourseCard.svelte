<script lang="ts">
  import Buttons from './Buttons.svelte';
  import placeholderImg from '$lib/images/placeholder_landscape.jpg?enhanced';
   import siteLogo from '$lib/images/site-logo.png?enhanced';

  export let title = 'Sample Course Title';
  export let description =
    'This is a short course or resource description that gives visitors a quick idea of what it’s about.';

  export let primaryText = '';
  export let primaryLink = '';
  export let primaryNewTab = false;
  export let primaryAriaLabel = '';

  export let secondaryText = '';
  export let secondaryLink = '';
  export let secondaryNewTab = false;
  export let secondaryAriaLabel = '';

  export let lineText = '';
  export let lineLink = '';
  export let lineNewTab = false;
  export let lineAriaLabel = '';

  export let centered = true;
  export let fullWidth = false;

  // Image controls
  export let showImage: boolean = true;
  export let imageSrc: typeof placeholderImg | string | null = null;
  export let imageAlt: string = 'Course cover image';

  // Per-card fixed cover height (in px)
  export let imageHeightPx: number = 320;
</script>

<article class="card card-1">
  {#if showImage}
    <a
      href={primaryLink}
      aria-label={primaryAriaLabel || title}
      target={primaryNewTab ? '_blank' : '_self'}
      rel={primaryNewTab ? 'noopener noreferrer' : undefined}
      class="cover"
      style={`height:${imageHeightPx}px;`}
    >
      <enhanced:img
         src={imageSrc || placeholderImg}
        alt={imageAlt}
        loading="lazy"
        class="cover-img"
      />
    </a>
  {/if}

  <div class="content">
    <h3>
      <a
        href={primaryLink}
        aria-label={primaryAriaLabel || title}
        target={primaryNewTab ? '_blank' : '_self'}
        rel={primaryNewTab ? 'noopener noreferrer' : undefined}
      >
        {title}
      </a>
    </h3>
    <p>{description}</p>

    <Buttons
      {primaryText}
      {primaryLink}
      {primaryNewTab}
      {primaryAriaLabel}
      {secondaryText}
      {secondaryLink}
      {secondaryNewTab}
      {secondaryAriaLabel}
      {lineText}
      {lineLink}
      {lineNewTab}
      {lineAriaLabel}
      {centered}
      {fullWidth}
    />
  </div>
</article>

<style>

  .cover {
    position: relative;
    width: 100%;
    overflow: hidden;
    flex: 0 0 auto;
    border-top-left-radius: var(--card-border-radius, 8px);
    border-top-right-radius: var(--card-border-radius, 8px);
    display: block;
  }

  .cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.4s ease;
  }

  .cover:hover .cover-img {
    transform: scale(1.05);
  }

  .content {
    padding: 1rem 1.5rem;
  }

</style>