<script lang="ts">
  export let resource: {
    id: string;
    title: string;
    description: string;
    features: string[];
    image?: string;
    testimonials?: Array<{
      name: string;
      comment: string;
      rating: number;
    }>;
    cta: {
      text: string;
      link: string;
      type: 'primary' | 'secondary';
    };
  };
</script>

<svelte:head>
  <title>{resource.title} | Solarity Studio</title>
  <meta name="description" content={resource.description} />
</svelte:head>

<main class="resource-landing">
  <section class="hero bg1">
    <div class="grid-container">
      <div class="grid-x grid-margin-x align-middle">
        <div class="cell large-6">
          <h1 class="hero-title">{resource.title}</h1>
          <p class="hero-description">{resource.description}</p>
          <div class="cta-section">
            <a 
              href={resource.cta.link} 
              class="btn btn-{resource.cta.type}"
              aria-label="Access {resource.title}"
            >
              {resource.cta.text}
            </a>
          </div>
        </div>
        {#if resource.image}
          <div class="cell large-6">
            <img src={resource.image} alt={resource.title} class="hero-image" />
          </div>
        {/if}
      </div>
    </div>
  </section>

  <section class="features bg2">
    <div class="grid-container">
      <h2 class="section-title text-center">Key Features</h2>
      <div class="grid-x grid-margin-x">
        {#each resource.features as feature}
          <div class="cell large-4 medium-6">
            <div class="feature-card">
              <h3>{feature}</h3>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  {#if resource.testimonials && resource.testimonials.length > 0}
    <section class="testimonials bg3">
      <div class="grid-container">
        <h2 class="section-title text-center">What Users Say</h2>
        <div class="grid-x grid-margin-x">
          {#each resource.testimonials as testimonial}
            <div class="cell large-4">
              <div class="testimonial-card">
                <div class="rating">
                  {#each Array(testimonial.rating) as _}
                    <span class="star">★</span>
                  {/each}
                </div>
                <p class="comment">"{testimonial.comment}"</p>
                <p class="author">- {testimonial.name}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="final-cta bg1">
    <div class="grid-container text-center">
      <h2>Ready to Get Started?</h2>
      <a 
        href={resource.cta.link} 
        class="btn btn-{resource.cta.type} btn-large"
        aria-label="Get started with {resource.title}"
      >
        {resource.cta.text}
      </a>
    </div>
  </section>
</main>

<style>
  .resource-landing {
    min-height: 100vh;
  }

  .hero {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--dark);
  }

  .hero-description {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: var(--grey);
  }

  .hero-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .features {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: var(--dark);
  }

  .feature-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    text-align: center;
  }

  .testimonials {
    padding: 4rem 0;
  }

  .testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    text-align: center;
  }

  .rating {
    margin-bottom: 1rem;
  }

  .star {
    color: #ffc107;
    font-size: 1.5rem;
  }

  .comment {
    font-style: italic;
    margin-bottom: 1rem;
  }

  .author {
    font-weight: bold;
    color: var(--dark);
  }

  .final-cta {
    padding: 4rem 0;
  }

  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .section-title {
      font-size: 2rem;
    }
  }
</style>
