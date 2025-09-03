<script lang="ts">
  export let bgClass: 'bg1' | 'bg2' | 'bg3' | '' = 'bg1';
  export let col1Width: string = 'col-6';
  export let col2Width: string = 'col-6';
  export let reverseMobile: boolean = false;
  export let reverseDesktop: boolean = false;
</script>

<section class={`two-col ${bgClass}`}>
  <div class={`flex-grid ${bgClass} ${reverseMobile ? 'reverse-mobile' : ''} ${reverseDesktop ? 'reverse-desktop' : ''}`}>
    <div class={`${col1Width} u-flex-v-center`}>
      <slot name="left" />
    </div>

    <div class={`${col2Width} u-flex-v-center`}>
      <slot name="right" />
    </div>
  </div>
</section>
