<script lang="ts">
  import { onMount } from 'svelte';
  import PageTitle from '$lib/components/PageTitle.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import CourseCard from '$lib/components/CourseCard.svelte';
  import { getUserResources, getAvailableResources } from '$lib/utils/resourceUtils';
  import type { User } from '@supabase/supabase-js';

  export let data;
  
  const { user, supabase }: { user: User | null, supabase: any } = data;
  const allResources = getAvailableResources();

  let userResources: any[] = [];
  let enrolledResources: any[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    if (user && supabase) {
      await loadUserResources();
    }
  });

  async function loadUserResources() {
    if (!user) return;
    
    loading = true;
    try {
      const result = await getUserResources(supabase, user.id);
      enrolledResources = result.resources;
      userResources = result.userResources;
    } catch (err) {
      console.error('Error loading resources:', err);
      error = 'Failed to load your resources';
    } finally {
      loading = false;
    }
  }

  function getResourceProgress(resourceId: string): number {
    const userResource = userResources.find(ur => ur.resourceId === resourceId);
    return userResource?.progress || 0;
  }

  function isResourceCompleted(resourceId: string): boolean {
    const userResource = userResources.find(ur => ur.resourceId === resourceId);
    return userResource?.completed || false;
  }

  function getEnrollmentDate(resourceId: string): string {
    const userResource = userResources.find(ur => ur.resourceId === resourceId);
    if (userResource?.enrolledAt) {
      return new Date(userResource.enrolledAt).toLocaleDateString();
    }
    return '';
  }

  // Get recommended resources (not enrolled)
  $: recommendedResources = allResources.filter(
    resource => !enrolledResources.find(er => er.id === resource.id)
  );
</script>

<SEO
  title="My Resources"
  description="Access your personal collection of gardening and soil health resources."
  url="/private/resources"
  noIndex={true}
/>

<PageTitle
  subheading="Your personal collection of gardening guides and resources."
  alignment="center"
  bg="bg1"
>
  <svelte:fragment slot="top">
    <h1>My Resources</h1>
  </svelte:fragment>
</PageTitle>

{#if loading}
  <section class="flex-grid">
    <div class="col-12">
      <div class="card card-1 u-card-padding">
        <p>Loading your resources...</p>
      </div>
    </div>
  </section>
{:else if error}
  <section class="flex-grid">
    <div class="col-12">
      <div class="card card-1 u-card-padding">
        <p class="error-message">{error}</p>
        <button class="btn btn-primary" onclick={loadUserResources}>Retry</button>
      </div>
    </div>
  </section>
{:else}
  {#if enrolledResources.length > 0}
    <section class="flex-grid">
      <div class="col-12">
        <h2>Your Collection ({enrolledResources.length})</h2>
      </div>
      {#each enrolledResources as resource}
        <div class="col-6">
          <div class="resource-card">
            <CourseCard
              showImage={true}
              title={resource.title}
              description={resource.description}
              primaryText="Read Resource"
              primaryLink="/private/resources/{resource.id}"
              primaryNewTab={false}
              primaryAriaLabel="Read {resource.title}"
              secondaryText="View Details"
              secondaryLink="/resources/{resource.id}"
              secondaryNewTab={false}
              secondaryAriaLabel="View details for {resource.title}"
              centered={false}
              fullWidth={false}
            />
            <div class="resource-meta">
              <div class="progress-info">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    style="width: {getResourceProgress(resource.id)}%"
                  ></div>
                </div>
                <span class="progress-text">
                  {getResourceProgress(resource.id)}% Complete
                  {#if isResourceCompleted(resource.id)}
                    <span class="completed-badge">✓ Completed</span>
                  {/if}
                </span>
              </div>
              <div class="enrollment-date">
                Added: {getEnrollmentDate(resource.id)}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </section>
  {:else}
    <section class="flex-grid">
      <div class="col-12">
        <div class="card card-1 u-card-padding empty-state">
          <h2>No Resources Yet</h2>
          <p>You haven't added any resources to your collection yet. Browse our available resources to get started!</p>
          <a href="/resources" class="btn btn-primary">Browse Resources</a>
        </div>
      </div>
    </section>
  {/if}

  {#if recommendedResources.length > 0}
    <section class="flex-grid recommended-section">
      <div class="col-12">
        <h2>Recommended for You</h2>
      </div>
      {#each recommendedResources as resource}
        <div class="col-6">
          <CourseCard
            showImage={true}
            title={resource.title}
            description={resource.description}
            primaryText="View Resource"
            primaryLink="/resources/{resource.id}"
            primaryNewTab={false}
            primaryAriaLabel="View {resource.title}"
            secondaryText="Learn More"
            secondaryLink="/resources/{resource.id}"
            secondaryNewTab={false}
            secondaryAriaLabel="Learn more about {resource.title}"
            centered={false}
            fullWidth={false}
          />
        </div>
      {/each}
    </section>
  {/if}
{/if}

<style>
  h2 {
    margin: 2rem 0 1rem 0;
    color: var(--primary-color);
  }

  .resource-card {
    position: relative;
  }

  .resource-meta {
    padding: 1rem;
    background: var(--bg-light, #f8f9fa);
    border-radius: 0 0 8px 8px;
    border-top: 1px solid var(--border-color, #e5e7eb);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-secondary, #e5e7eb);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: var(--success-color, #22c55e);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.9rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .completed-badge {
    background: var(--success-color, #22c55e);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .enrollment-date {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
  }

  .empty-state h2 {
    margin-bottom: 1rem;
  }

  .empty-state p {
    margin-bottom: 2rem;
    color: var(--text-muted);
  }

  .recommended-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid var(--border-color, #e5e7eb);
  }

  .error-message {
    color: var(--error-color, #dc2626);
    background: var(--error-bg, #fef2f2);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
</style>