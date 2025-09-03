<script>
  export let tiers = [
    {
      label: 'Now',
      price: '$49',
      note: 'Early Supporter Price'
    },
    {
      label: 'Late 2025',
      price: '$79',
      note: 'Closer to Full Launch'
    },
    {
      label: 'Late 2026',
      price: '$99+',
      note: 'Final Launch Price'
    }
  ];
</script>

<div class="price-timeline">
  {#each tiers as tier, i}
    <div class="timeline-step">
      <p class="timeline-label">{tier.label}</p>
      <div class="timeline-circle">{tier.price}</div>
      <p class="timeline-note">{tier.note}</p>
    </div>

    {#if i < tiers.length - 1}
      <div class="timeline-connector"></div>
    {/if}
  {/each}
</div>

<style>
  .price-timeline {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    margin-top: 2rem;
    position: relative;
  }

  .timeline-step {
    text-align: center;
    max-width: 150px;
    flex: 1;
  }

  .timeline-label {
    font-weight: bold;
    font-size: var(--text-sm);
    margin-bottom: 0.5rem;
  }

  .timeline-circle {
    background: var(--accent);
    color: white;
    font-weight: bold;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    font-size: var(--text-md);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .timeline-note {
    font-size: var(--text-xs);
    margin-top: 0.5rem;
    color: var(--grey);
  }

  .timeline-connector {
    width: 40px;
    height: 2px;
    background: var(--grey-400);
    margin-top: 3.5rem;
  }

  @media (max-width: 600px) {
    .price-timeline {
      flex-direction: column;
      align-items: center;
    }

    .timeline-connector {
      width: 2px;
      height: 40px;
      margin: 0 auto;
    }
  }
</style>
