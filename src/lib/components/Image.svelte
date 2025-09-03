<script lang="ts">
  // Define Picture type locally since it's not exported from @sveltejs/enhanced-img
  interface Picture {
    img: {
      src: string;
      w: number;
      h: number;
    };
    sources: Record<string, string>;
  }

  export let src: string | Picture;
  export let alt: string;
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;
  export let loading: 'lazy' | 'eager' = 'lazy';
  export let className: string = '';
  export let style: string = '';
  export let objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
  export let objectPosition: string = 'center';
  export let aspectRatio: string | undefined = undefined;

  // Calculate responsive styles
  $: imageStyles = [
    style,
    aspectRatio ? `aspect-ratio: ${aspectRatio}` : '',
    `object-fit: ${objectFit}`,
    `object-position: ${objectPosition}`
  ].filter(Boolean).join('; ');
</script>

{#if typeof src === 'string'}
  <img
    {src}
    {alt}
    {width}
    {height}
    {loading}
    class={className}
    style={imageStyles}
  />
{:else}
  <enhanced:img
    {src}
    {alt}
    {width}
    {height}
    {loading}
    class={className}
    style={imageStyles}
  />
{/if}

<style>
  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
</style>