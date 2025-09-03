<script lang="ts">
  export let primaryText: string = '';
  export let primaryLink: string = '';
  export let primaryNewTab: boolean = false;
  export let primaryAriaLabel: string = '';

  export let secondaryText: string = '';
  export let secondaryLink: string = '';
  export let secondaryNewTab: boolean = false;
  export let secondaryAriaLabel: string = '';

  export let lineText: string = '';
  export let lineLink: string = '';
  export let lineNewTab: boolean = false;
  export let lineAriaLabel: string = '';

  export let centered: boolean = true;
  export let fullWidth: boolean = false;
</script>

<div class={`btn-container u-flex u-flex-v-center${centered ? ' u-flex-h-center' : ''}`}>
  {#if primaryText && primaryLink}
    <a
      href={primaryLink}
      class={`btn btn-primary${fullWidth ? ' btn-full-width' : ''}`}
      target={primaryNewTab ? '_blank' : null}
      rel={primaryNewTab ? 'noopener noreferrer' : null}
      aria-label={primaryAriaLabel || primaryText}
    >
     {primaryText}
    </a>
  {/if}

  {#if secondaryText && secondaryLink}
    <a
      href={secondaryLink}
      class={`btn btn-secondary${fullWidth ? ' btn-full-width' : ''}`}
      target={secondaryNewTab ? '_blank' : null}
      rel={secondaryNewTab ? 'noopener noreferrer' : null}
      aria-label={secondaryAriaLabel || secondaryText}
    >
     {secondaryText}
    </a>
  {/if}

  {#if lineText && lineLink}
    <a
      href={lineLink}
      class="line-link"
      target={lineNewTab ? '_blank' : null}
      rel={lineNewTab ? 'noopener noreferrer' : null}
      aria-label={lineAriaLabel || lineText}
    >
      {lineText}
    </a>
  {/if}
</div>
