<script lang="ts">
    export let leftTitle: string = "Design";
    export let leftItems: string[] = [];
  
    export let rightTitle: string = "Development";
    export let rightItems: string[] = [];
</script>  <section style='z-index: 2;'>
    <div class="flex-grid">
        <div class="col-12">
            <h2>👋 hi, we’re a design studio founded by <a 
                class="link-effect" 
                href="https://sebjagoe.com/" 
                data-original="seb jagoe" 
                data-hover="seb jagoe"
                target="_blank" 
                rel="noopener noreferrer">
                <span>seb jagoe</span>
              </a>. we like to make <em>good stuff</em>.</h2>
        </div>
    </div>
    <div class="flex-grid" style="width: 70%; max-width: 800px;">
      <div class="col-6">
        <h3 class="feature-heading">{leftTitle}</h3>
        <ul class="feature-list">
          {#each leftItems as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
      <div class="col-6">
        <h3 class="feature-heading">{rightTitle}</h3>
        <ul class="feature-list">
          {#each rightItems as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    </div>
  </section>
  
  <style>

    .feature-heading {
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: 0.6   em;
      font-weight: bold;
      color: var(--text-color);
      margin-bottom: 1rem;
    }
  
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    .feature-list li {
      position: relative;
      padding-left: 1.5em;
      margin-bottom: 0.75rem;
      color: var(--text-color);
    }
  
    .feature-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--accent);
      font-size: 1.2em;
      line-height: 1;
    }
  </style>
  