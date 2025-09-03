<script lang="ts">
  export let url: string = "#";
  export let title: string;
  export let disabled: boolean = false;
  export let description: string = "";
</script>

<a
  href={disabled ? undefined : url}
  class="link-button {disabled ? 'disabled' : ''}"
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
>
  <div class="link-inner">
    <div class="link-main">
      <slot />
      <span>{title}</span>
    </div>
    {#if description}
      <p class="description text--sm">{description}</p>
    {/if}
  </div>
</a>

<style>
.link-button {
  border-radius: 3px;
  background-color: var(--accent);
  color: var(--dark) !important;
  align-self: center;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  max-width: 800px;
  padding: 15px 0;
  border: 2px solid var(--text-color);
  text-decoration: none;
  letter-spacing: -0.06em !important;
}

.link-button .description {
  color: var(--dark);
  opacity: 0.7;
}
.link-button.disabled .description {
  color: var(--dark);
}

.link-button.disabled {
  background-color: var(--grey-500);
  color: var(--dark);
  pointer-events: none;
}

.link-button:hover,
.link-button:focus,
.link-button:active {
  background-color: var(--accent-2);
}

.link-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.link-main {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-size: var(--text-md);
}
</style>
