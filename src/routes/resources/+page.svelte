<script lang="ts">
  import PageTitle from '$lib/components/PageTitle.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import CourseCard from '$lib/components/CourseCard.svelte';
  import { getAvailableResources } from '$lib/utils/resourceUtils';

  const resources = getAvailableResources();
</script>

<SEO
  title="Resources - Free Learning Materials"
  description="Access our comprehensive collection of free gardening and soil health resources. Learn sustainable farming techniques and organic growing methods."
  url="/resources"
  noIndex={false}
/>

<PageTitle
  subheading="Comprehensive guides to help you build better soil and grow healthier food naturally."
  alignment="center"
  bg="bg1"
>
  <svelte:fragment slot="top">
    <h1>
      Free Resources
    </h1>
  </svelte:fragment>
</PageTitle>

<section class="flex-grid">
  {#each resources as resource}
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

<section>
  <div class="flex-grid">
    <div class="col-12">
      <div class="card card-1 u-card-padding">
        <h2>How It Works</h2>
        <div class="flex-grid">
          <div class="col-4">
            <h3>1. Browse Resources</h3>
            <p>Explore our collection of comprehensive guides covering soil health, pest control, and sustainable gardening practices.</p>
          </div>
          <div class="col-4">
            <h3>2. Access Content</h3>
            <p>Click "View Resource" to read the full guide. All content is completely free and always available.</p>
          </div>
          <div class="col-4">
            <h3>3. Build Your Collection</h3>
            <p>Sign in to add resources to your personal collection and track your learning progress.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  h2 {
    text-align: center;
    margin-bottom: 2rem;
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .flex-grid .col-4 {
    text-align: center;
    padding: 1rem;
  }

  .flex-grid .col-4 p {
    margin-top: 1rem;
    color: var(--text-muted);
  }
</style>
