<!-- src/lib/components/CourseGrid.svelte -->
<script lang="ts">
  /** Number of columns on desktop (1–4 recommended) */
  export let columns: 1 | 2 | 3 | 4 = 3;

  /** Optional section title/description */
  export let heading: string = '';
  export let subheading: string = '';

  /** Control spacing */
  export let gap: string = '0.5rem'; // matches your .col-* padding
</script>

<section class="course-grid-section">
  {#if heading}
    <header class="grid-header flex-grid">
      <div class="col-12">
        <h2 class="grid-title">{heading}</h2>
        {#if subheading}<p class="grid-subtitle">{subheading}</p>{/if}
      </div>
    </header>
  {/if}

  <div class="flex-grid" style={`--grid-gap:${gap};`}>
    <slot />
  </div>
</section>

<style>
  .course-grid-section {
    padding: var(--section-padding-mobile);
    position: relative;
  }
  @media screen and (min-width: 900px) {
    .course-grid-section { padding: var(--section-padding); }
  }
  .grid-title {
    margin: 0 0 0.25rem 0;
    font-size: var(--text-xl);
    letter-spacing: var(--heading-letter-spacing);
    line-height: var(--heading-line-height);
    color: var(--text-color);
  }
  .grid-subtitle {
    margin: 0 0 1rem 0;
    color: var(--grey-700);
    line-height: var(--body-line-height);
    max-width: 65ch;
  }

  /* tighten the card gutters a bit while respecting your grid vars */
  .flex-grid > [class^="col-"] {
    padding: var(--card-padding, 10px);
  }
</style>
