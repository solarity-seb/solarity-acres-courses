<script lang="ts">
  import { slide } from 'svelte/transition';

  export let faqs: { question: string; answer: string }[] = [];
  export let theme: 'light' | 'dark' = 'light';

  let openIndex: number | null = null;

  const toggle = (index: number) => {
    openIndex = openIndex === index ? null : index;
  };
</script>

<style>
  .faq-item {
    margin-bottom: 1rem;
    padding: 10px 24px 10px 10px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: background-color 0.3s;
    border: var(--main-border-grey);
  }

  .light-theme {
    background-color: var(--light);
    color: var(--dark);
    transition: 0.3s ease-in-out;
  }

  .light-theme:hover {
    border: 2px solid var(--accent);
    opacity: 0.9;
  }

  .dark-theme {
    background-color: var(--dark);
    color: var(--light);
    transition: 0.3s ease-in-out;
  }

  .dark-theme:hover {
    border: 2px solid var(--accent);
    opacity: 0.9;
  }

  .faq-question {
    font-size: var(--text-md);
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    width: 100%;
    padding: 0.5rem 0;
    text-align: left;
    cursor: pointer;
  }

  .faq-question:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .light-text {
    color: var(--dark);
  }

  .dark-text {
    color: var(--light);
  }

  .icon {
    display: inline-block;
    transition: transform 0.3s var(--cubic), color 0.2s ease;
    font-weight: bold;
    font-size: var(--text-md);
  }

  .rotate {
    transform: rotate(45deg);
  }

  .faq-answer {
    opacity: 0.8;
    font-size: var(--text-sm);
    line-height: var(--body-line-height);
    font-weight: 400;
    margin-top: 0.5rem;
    padding-right: 0.5rem;
    padding-left: 10px;
    margin-bottom: 10px;
  }

  .dark-theme .faq-answer {
    color: var(--light);
  }

  .light-theme .faq-answer {
    color: var(--dark);
  }

  .faq-question {
  all: unset;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: var(--text-md);
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  text-align: left;
}

.faq-question:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.number {
  padding-right: 0.3rem;
  display: none;
}

</style>

<div>
  {#each faqs as faq, index}
    <div
      class="faq-item"
      class:light-theme={theme === 'light'}
      class:dark-theme={theme === 'dark'}
    >
      <button
        type="button"
        class="faq-question"
        class:light-text={theme === 'light'}
        class:dark-text={theme === 'dark'}
        aria-expanded={openIndex === index}
        aria-controls={"faq-answer-" + index}
        on:click={() => toggle(index)}
      >
        <span><span class="number">{index}: </span><span>{@html faq.question}</span></span>
        <span
          class="icon"
          class:rotate={openIndex === index}
          class:light-text={theme === 'light'}
          class:dark-text={theme === 'dark'}
        >+</span>
      </button>

      {#if openIndex === index}
        <div
          id={"faq-answer-" + index}
          class="faq-answer"
          transition:slide
        >
          {@html faq.answer}
        </div>
      {/if}
    </div>
  {/each}
</div>
