<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getResourceById, enrollInResource } from '$lib/utils/resourceUtils';
  import PageTitle from '$lib/components/PageTitle.svelte';
  import SEO from '$lib/components/SEO.svelte';

  export let data;

  const resource = getResourceById('soil-health-guide');
  const { user, supabase } = data;

  let enrolling = false;
  let enrolled = false;
  let error = '';

  // Check if user is already enrolled
  $: if (user && supabase) {
    checkEnrollment();
  }

  async function checkEnrollment() {
    if (!user || !supabase) return;
    
    try {
      const { data: userResource } = await supabase
        .from('user_resources')
        .select('*')
        .eq('user_id', user.id)
        .eq('resource_id', 'soil-health-guide')
        .single();
      
      enrolled = !!userResource;
    } catch (err) {
      // User not enrolled
      enrolled = false;
    }
  }

  async function handleEnroll() {
    if (!user) {
      goto('/signin?redirectTo=' + encodeURIComponent($page.url.pathname));
      return;
    }

    if (!supabase) {
      error = 'Unable to connect to database';
      return;
    }

    enrolling = true;
    error = '';

    const result = await enrollInResource(supabase, user.id, 'soil-health-guide');
    
    enrolling = false;

    if (result.success) {
      enrolled = true;
      // Redirect to user's resources page
      goto('/private/resources');
    } else {
      error = result.error || 'Failed to enroll';
    }
  }

  function viewContent() {
    if (enrolled) {
      goto('/private/resources/soil-health-guide');
    } else {
      // Scroll to content section
      document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<SEO
  title="Complete Soil Health Guide - Free Resource"
  description="Transform your garden with our comprehensive guide to building healthy, living soil that grows nutrient-dense plants naturally."
  url="/resources/soil-health-guide"
  noIndex={false}
/>

{#if resource}
  <PageTitle
    subheading={resource.description}
    alignment="center"
    bg="bg2"
  >
    <svelte:fragment slot="top">
      <h1>{resource.title}</h1>
    </svelte:fragment>
  </PageTitle>

  <section class="flex-grid">
    <div class="col-8">
      <div class="card card-1 u-card-padding">
        <h2>What You'll Learn</h2>
        <div class="features-grid">
          {#each resource.features as feature}
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>{feature}</span>
            </div>
          {/each}
        </div>

        <div class="testimonials">
          <h3>What Others Say</h3>
          <div class="testimonial">
            <p>"This guide completely changed how I approach gardening. My vegetables have never been healthier!"</p>
            <cite>- Sarah Johnson</cite>
          </div>
          <div class="testimonial">
            <p>"Clear, actionable advice that actually works. Highly recommended for any gardener."</p>
            <cite>- Mike Chen</cite>
          </div>
        </div>
      </div>
    </div>

    <div class="col-4">
      <div class="card card-2 u-card-padding sticky-card">
        <h3>Get This Resource</h3>
        <p class="price">FREE</p>
        
        {#if error}
          <div class="error-message">{error}</div>
        {/if}

        {#if enrolled}
          <button class="btn btn-primary btn-large" onclick={viewContent}>
            View in My Resources
          </button>
          <p class="success-message">✓ Added to your collection</p>
        {:else}
          <button 
            class="btn btn-primary btn-large" 
            onclick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Adding...' : 'Add to My Resources'}
          </button>
          <button class="btn btn-secondary btn-large" onclick={viewContent}>
            Preview Content
          </button>
        {/if}

        <div class="resource-info">
          <div class="info-item">
            <strong>Category:</strong> {resource.category}
          </div>
          <div class="info-item">
            <strong>Updated:</strong> {resource.updatedAt}
          </div>
          <div class="info-item">
            <strong>Reading Time:</strong> ~45 minutes
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="content" class="content-preview">
    <div class="flex-grid">
      <div class="col-12">
        <div class="card card-1 u-card-padding">
          <h2>Content Preview</h2>
          <div class="content-text">
            {@html resource.content.split('\n').slice(0, 30).join('\n')}
          </div>
          <div class="content-fade">
            <p>Continue reading by adding this resource to your collection...</p>
            {#if !enrolled}
              <button class="btn btn-primary" onclick={handleEnroll} disabled={enrolling}>
                {enrolling ? 'Adding...' : 'Add to My Resources'}
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkmark {
    color: var(--success-color, #22c55e);
    font-weight: bold;
    font-size: 1.2rem;
  }

  .testimonials {
    margin-top: 2rem;
  }

  .testimonial {
    margin: 1rem 0;
    padding: 1rem;
    background: var(--bg-light, #f8f9fa);
    border-radius: 8px;
  }

  .testimonial p {
    font-style: italic;
    margin-bottom: 0.5rem;
  }

  .testimonial cite {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .sticky-card {
    position: sticky;
    top: 2rem;
  }

  .price {
    font-size: 2rem;
    font-weight: bold;
    color: var(--success-color, #22c55e);
    text-align: center;
    margin: 1rem 0;
  }

  .btn-large {
    width: 100%;
    padding: 1rem;
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  .resource-info {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color, #e5e7eb);
  }

  .info-item {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .content-preview {
    background: var(--bg-light, #f8f9fa);
    padding: 3rem 0;
  }

  .content-text {
    max-height: 600px;
    overflow: hidden;
    position: relative;
  }

  .content-fade {
    position: relative;
    margin-top: -100px;
    height: 100px;
    background: linear-gradient(transparent, white);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 2rem;
  }

  .error-message {
    color: var(--error-color, #dc2626);
    background: var(--error-bg, #fef2f2);
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
    text-align: center;
  }

  .success-message {
    color: var(--success-color, #22c55e);
    background: var(--success-bg, #f0fdf4);
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
    text-align: center;
    font-weight: 500;
  }
</style>
