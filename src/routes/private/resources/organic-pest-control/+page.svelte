<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getResourceById, updateResourceProgress } from '$lib/utils/resourceUtils';
  import PageTitle from '$lib/components/PageTitle.svelte';
  import SEO from '$lib/components/SEO.svelte';

  export let data;
  
  const { user, supabase } = data;
  const resource = getResourceById('organic-pest-control');

  let enrolled = false;
  let progress = 0;
  let completed = false;
  let loading = true;
  let scrollProgress = 0;

  onMount(async () => {
    if (!user) {
      goto('/signin');
      return;
    }

    await checkEnrollment();
    setupScrollTracking();
  });

  async function checkEnrollment() {
    if (!user) return;
    
    try {
      const { data: userResource } = await supabase
        .from('user_resources')
        .select('*')
        .eq('user_id', user.id)
        .eq('resource_id', 'organic-pest-control')
        .single();
      
      if (userResource) {
        enrolled = true;
        progress = userResource.progress || 0;
        completed = userResource.completed || false;
      } else {
        // User not enrolled, redirect to resource page
        goto('/resources/organic-pest-control');
        return;
      }
    } catch (err) {
      // User not enrolled
      goto('/resources/organic-pest-control');
      return;
    } finally {
      loading = false;
    }
  }

  function setupScrollTracking() {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const newScrollProgress = Math.min(100, Math.max(0, (scrolled / scrollHeight) * 100));
      
      scrollProgress = newScrollProgress;
      
      // Update progress in database if significantly changed
      if (Math.abs(newScrollProgress - progress) > 5) {
        updateUserProgress(newScrollProgress);
      }
    };

    window.addEventListener('scroll', updateProgress);
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }

  async function updateUserProgress(newProgress: number) {
    if (!user) return;
    
    const isCompleted = newProgress >= 95;
    
    if (newProgress > progress || isCompleted !== completed) {
      progress = newProgress;
      completed = isCompleted;
      
      await updateResourceProgress(supabase, user.id, 'organic-pest-control', newProgress, isCompleted);
    }
  }

  function markAsCompleted() {
    updateUserProgress(100);
  }
</script>

<SEO
  title="Organic Pest Control Mastery - My Resources"
  description="Your personal copy of the Organic Pest Control Mastery guide"
  url="/private/resources/organic-pest-control"
  noIndex={true}
/>

{#if loading}
  <div class="loading-container">
    <p>Loading resource...</p>
  </div>
{:else if resource && enrolled}
  <div class="progress-bar-fixed">
    <div class="progress-fill" style="width: {scrollProgress}%"></div>
  </div>

  <PageTitle
    subheading="Your guide to sustainable, chemical-free pest management"
    alignment="center"
    bg="bg2"
  >
    <svelte:fragment slot="top">
      <h1>{resource.title}</h1>
    </svelte:fragment>
  </PageTitle>

  <div class="resource-header">
    <div class="flex-grid">
      <div class="col-8">
        <div class="progress-info">
          <span class="progress-text">Progress: {Math.round(progress)}%</span>
          {#if completed}
            <span class="completed-badge">✓ Completed</span>
          {/if}
        </div>
      </div>
      <div class="col-4">
        <div class="resource-actions">
          <a href="/private/resources" class="btn btn-secondary">← Back to My Resources</a>
          {#if !completed}
            <button class="btn btn-primary" onclick={markAsCompleted}>
              Mark as Complete
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <main class="resource-content">
    <div class="flex-grid">
      <div class="col-2">
        <nav class="table-of-contents sticky-nav">
          <h3>Contents</h3>
          <ul>
            <li><a href="#chapter-1">Integrated Pest Management</a></li>
            <li><a href="#chapter-2">Prevention Through Design</a></li>
            <li><a href="#chapter-3">Identifying Common Pests</a></li>
            <li><a href="#chapter-4">Biological Pest Control</a></li>
            <li><a href="#chapter-5">Mechanical Controls</a></li>
            <li><a href="#chapter-6">Organic Spray Solutions</a></li>
            <li><a href="#chapter-7">Seasonal Management</a></li>
            <li><a href="#chapter-8">Troubleshooting</a></li>
          </ul>
        </nav>
      </div>
      <div class="col-8">
        <article class="content-article">
          {@html resource.content
            .replace(/^# /gm, '<h1 id="chapter-1">')
            .replace(/^## Chapter 1:/gm, '<h2 id="chapter-1">Chapter 1:')
            .replace(/^## Chapter 2:/gm, '<h2 id="chapter-2">Chapter 2:')
            .replace(/^## Chapter 3:/gm, '<h2 id="chapter-3">Chapter 3:')
            .replace(/^## Chapter 4:/gm, '<h2 id="chapter-4">Chapter 4:')
            .replace(/^## Chapter 5:/gm, '<h2 id="chapter-5">Chapter 5:')
            .replace(/^## Chapter 6:/gm, '<h2 id="chapter-6">Chapter 6:')
            .replace(/^## Chapter 7:/gm, '<h2 id="chapter-7">Chapter 7:')
            .replace(/^## Chapter 8:/gm, '<h2 id="chapter-8">Chapter 8:')
            .replace(/^### /gm, '<h3>')
            .replace(/^- /gm, '<li>')
            .replace(/^\d+\. /gm, '<li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^([^<])/gm, '<p>$1')
            .replace(/([^>])$/gm, '$1</p>')
          }
        </article>
      </div>
      <div class="col-2">
        <div class="reading-progress sticky-progress">
          <h4>Reading Progress</h4>
          <div class="circular-progress">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle"
                stroke-dasharray="{progress}, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" class="percentage">{Math.round(progress)}%</text>
            </svg>
          </div>
          {#if completed}
            <div class="completion-message">
              <p>🎉 Congratulations!</p>
              <p>You've completed this resource.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>
{/if}

<style>
  .loading-container {
    text-align: center;
    padding: 3rem;
  }

  .progress-bar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--bg-secondary, #e5e7eb);
    z-index: 1000;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-color, #3b82f6);
    transition: width 0.2s ease;
  }

  .resource-header {
    background: var(--bg-light, #f8f9fa);
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .progress-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-text {
    font-weight: 500;
    color: var(--text-primary);
  }

  .completed-badge {
    background: var(--success-color, #22c55e);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 16px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .resource-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .resource-content {
    padding: 2rem 0;
  }

  .table-of-contents {
    background: var(--bg-light, #f8f9fa);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #e5e7eb);
  }

  .sticky-nav {
    position: sticky;
    top: 2rem;
  }

  .table-of-contents h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .table-of-contents ul {
    list-style: none;
    padding: 0;
  }

  .table-of-contents li {
    margin: 0.5rem 0;
  }

  .table-of-contents a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    padding: 0.3rem 0;
    display: block;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .table-of-contents a:hover {
    color: var(--primary-color);
    background: var(--bg-primary, rgba(59, 130, 246, 0.1));
    padding-left: 0.5rem;
  }

  .content-article {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    line-height: 1.7;
  }

  .content-article :global(h1) {
    color: var(--primary-color);
    margin: 2rem 0 1rem 0;
    font-size: 2rem;
  }

  .content-article :global(h2) {
    color: var(--text-primary);
    margin: 2rem 0 1rem 0;
    font-size: 1.5rem;
    border-bottom: 2px solid var(--border-color, #e5e7eb);
    padding-bottom: 0.5rem;
  }

  .content-article :global(h3) {
    color: var(--text-primary);
    margin: 1.5rem 0 0.8rem 0;
    font-size: 1.2rem;
  }

  .content-article :global(p) {
    margin: 1rem 0;
    color: var(--text-secondary);
  }

  .content-article :global(li) {
    margin: 0.5rem 0;
    color: var(--text-secondary);
  }

  .content-article :global(strong) {
    color: var(--text-primary);
    font-weight: 600;
  }

  .reading-progress {
    background: var(--bg-light, #f8f9fa);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #e5e7eb);
    text-align: center;
  }

  .sticky-progress {
    position: sticky;
    top: 2rem;
  }

  .reading-progress h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .circular-progress {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }

  .circular-chart {
    width: 80px;
    height: 80px;
  }

  .circle-bg {
    fill: none;
    stroke: var(--bg-secondary, #e5e7eb);
    stroke-width: 2.8;
  }

  .circle {
    fill: none;
    stroke: var(--primary-color, #3b82f6);
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }

  .percentage {
    fill: var(--text-primary);
    font-family: sans-serif;
    font-size: 0.4em;
    text-anchor: middle;
  }

  .completion-message {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--success-bg, #f0fdf4);
    border-radius: 8px;
    color: var(--success-color, #22c55e);
  }

  .completion-message p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }
</style>
