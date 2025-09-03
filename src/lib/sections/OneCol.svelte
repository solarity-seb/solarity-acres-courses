<!-- src/lib/components/OneCol.svelte -->

<script lang="ts">
    export let bgClass: 'bg1' | 'bg2' | 'bg3' | '' = 'bg1';
</script>

<section class={`one-col ${bgClass}`}>
    <div class="grid-container full">
        <slot />
    </div>
</section>
  