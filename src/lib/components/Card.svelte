<script lang="ts">
    export let title: string = '';
    export let description: string = '';
    export let image: string = '';
    export let alt: string = '';
    export let link: string = '';
    export let ctaText: string = 'Learn More';
    export let variant: 'basic' | 'horizontal' | 'overlay' | 'bordered' | 'glass' | 'noImage' | 'compact' | 'highlighted' = 'basic';
    export let icon: string = '';
    export let tags: string[] = [];
    export let badge: string = '';
    export let hoverEffect: boolean = false;
    export let clickable: boolean = false;
    export let aspectRatio: string = '16/9';
  </script>
  
  <a class={`card ${variant} ${hoverEffect ? 'hover-effect' : ''} ${clickable ? 'clickable' : ''} `} href={clickable && typeof link === 'string' ? link : undefined}  >
    {#if image && variant !== 'noImage'}
      <div class="card-image" style={`aspect-ratio: ${aspectRatio}`}> 
        <enhanced:img src={image} alt={alt} loading="lazy" width="1000" height="400" />
        {#if variant === 'overlay'}
          <div class="overlay"></div>
        {/if}
        {#if badge}
          <span class="badge">{badge}</span>
        {/if}
      </div>
    {/if}
  
    <div class="card-content">
      {#if tags.length}
        <ul class="tags">
          {#each tags as tag}
            <li>{tag}</li>
          {/each}
        </ul>
      {/if}
  
      <h3 class="card-title">
        {#if icon}<img src={icon} alt="" class="icon" />{/if}{title}
      </h3>
  
      <slot>{description}</slot>
  
      {#if !clickable && link}
        <div class="cta-wrapper">
          <span class="cta" role="button" tabindex="0"
            on:click={() => window.location.href = link}
            on:keydown={(e) => e.key === 'Enter' && (window.location.href = link)}
          >
            {ctaText}
          </span>
        </div>
      {/if}
  
      <slot name="footer" />
    </div>
  </a>
  
  <style>
    .card {
      --border-radius: var(--btn-border-radius);
      --padding: var(--card-padding);
      border-radius: var(--border-radius);
      padding: var(--padding);
      text-decoration: none;
      color: inherit;
      background: var(--card-color);
      transition: transform 0.2s var(--cubic);
      display: block;
    }
  
    .hover-effect:hover {
      transform: scale(1.02);
    }
  
    .clickable {
      cursor: pointer;
    }
  
    .card-image {
      position: relative;
      overflow: hidden;
      border-radius: var(--border-radius);
    }
  
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    }
  
    .badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--accent);
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: var(--text-xs);
    }
  
    .card-content {
      margin-top: 0.8rem;
    }
  
    .card-title {
      font-size: var(--text-md);
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .icon {
      width: 1.2em;
      height: 1.2em;
    }
  
    .tags {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 0.5rem;
      list-style: none;
      padding: 0;
    }
  
    .tags li {
      background: var(--grey-300);
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      font-size: var(--text-xs);
    }
  
    .cta {
      display: inline-block;
      margin-top: 0.6rem;
      padding: 0.4rem 1rem;
      background: var(--accent);
      color: white;
      border-radius: var(--btn-border-radius);
      font-size: var(--text-sm);
      text-decoration: none;
    }
  
    /* === Variant Styles === */
  .horizontal {
    display: flex;
    flex-direction: column;
  }

  .horizontal .card-image {
    flex: 1 1 50%;
  }

  .horizontal .card-content {
    flex: 1 1 50%;
    padding-left: 1rem;
  }

  @media (min-width: 900px) {
    .horizontal {
      flex-direction: row;
      align-items: stretch;
    }
  }

  .glass {
    background: var(--light-transparent);
    backdrop-filter: blur(10px);
    border: 1px solid var(--grey-300);
  }

  .bordered {
    border: 2px solid var(--grey);
  }

  .highlighted {
    background: var(--accent-transparent);
  }

  .compact {
    padding: 0.5rem;
  }
  </style>
  