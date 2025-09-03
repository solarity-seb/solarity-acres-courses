<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import CourseCard from '$lib/components/CourseCard.svelte';
</script>

<SEO
  title="My Courses"
  description="Access your enrolled courses and continue your learning journey."
  url="/private/courses"
  noIndex={true}
/>

<PageTitle
  subheading="Your enrolled courses and learning progress."
  alignment="center"
  bg="bg1"
>
  <svelte:fragment slot="top">
    <h1>My Courses <span class="banner">Coming Soon!</span></h1>
  </svelte:fragment>
</PageTitle>

<section class="flex-grid">
  <div class="col-12">
    <div class="card card-1 u-card-padding coming-soon">
      <h2>Courses Feature Coming Soon</h2>
      <p>We're working hard to bring you structured courses! In the meantime, check out our free resources:</p>
      <div class="cta-buttons">
        <a href="/resources" class="btn btn-primary">Browse Free Resources</a>
        <a href="/private/resources" class="btn btn-secondary">My Resources</a>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="flex-grid">
    <div class="col-12">
      <div class="card card-1 u-card-padding">
        <h3>What's the Difference?</h3>
        <div class="flex-grid">
          <div class="col-6">
            <h4>📚 Resources (Available Now)</h4>
            <ul>
              <li>Complete guides and references</li>
              <li>Read at your own pace</li>
              <li>Progress tracking</li>
              <li>Free access</li>
            </ul>
            <a href="/resources" class="btn btn-outline">View Resources</a>
          </div>
          <div class="col-6">
            <h4>🎓 Courses (Coming Soon)</h4>
            <ul>
              <li>Structured learning paths</li>
              <li>Interactive assignments</li>
              <li>Community discussions</li>
              <li>Completion certificates</li>
            </ul>
            <button class="btn btn-outline" disabled>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .coming-soon {
    text-align: center;
    padding: 3rem 2rem;
  }

  .coming-soon h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .coming-soon p {
    margin-bottom: 2rem;
    color: var(--text-muted);
    font-size: 1.1rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .banner {
    background: var(--warning-color, #f59e0b);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-left: 1rem;
  }

  h3 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--primary-color);
  }

  h4 {
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 1.5rem;
  }

  li {
    padding: 0.3rem 0;
    color: var(--text-secondary);
  }

  li:before {
    content: "✓ ";
    color: var(--success-color, #22c55e);
    font-weight: bold;
  }

  .col-6 {
    text-align: center;
    padding: 1rem;
  }
</style>

