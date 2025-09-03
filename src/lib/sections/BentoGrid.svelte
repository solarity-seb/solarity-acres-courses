<script>
  import foxgloves from '$lib/images/seb_jagoe_foxgloves.jpg?enhanced';
  const bgUrl = foxgloves.img.src;
</script>

<section class="bento-grid bg2">
  <div class="bento-grid__wrapper">
    
    <!-- Soil Facts Card -->
    <div class="card card-1 u-card-padding bento-grid__wide">
        
      <div class="bento-grid__facts">
        <span class="banner-2">
          <h2 class="text--md" style="line-height: 1rem; margin: 0;">Some Fun Soil Facts ✨</h2>
        </span>
        <div>
          <h3>1 billion</h3>
          <p class="text--sm">soil organisms in a teaspoon of active soil</p>
        </div>
        <div>
          <h3>10 km</h3>
          <p class="text--sm">of fungal hyphae in a teaspoon of soil</p>
        </div>
        <div>
          <h3>1000+ lbs</h3>
          <p class="text--sm">of earthworms in 1 acre of healthy soil</p>
        </div>
        <div>
          <h3>1 gram</h3>
<p class="text--sm">of healthy soil contains up to 10 billion living cells</p>

        </div>
      </div>
    </div>

    <!-- Image Card -->
<div class="card card-1 bento-grid__image-card">
  <enhanced:img
    src={foxgloves}
    alt="Foxgloves"
    width=400
    height=400
    class="bento-grid__image"
    loading="lazy"
  />
</div>





    <!-- Feed Your Soil Card -->
    <div class="card card-1 u-card-padding bento-grid__narrow">
      <h3>Feed your soil...</h3>
      <p class="text--sm">And you’ll never need to worry about pests or nutrient defficiencies.</p>
    </div>

    <!-- CTA Card -->
    <div class="card card-1 u-card-padding bento-grid__wide">
      <div class="bento-grid__cta">
        <div>
          <h3>Healthy soil is the key.</h3>
        </div>
        <div>
          <p class="text--sm">Want to make your own? I've got tons of resources about exactly how to make amazing soil!</p>
          <a href="course/build-soil" class="line-link">👉 How to build healthy soil</a>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .bento-grid {
    padding: var(--section-padding-mobile);
    position: relative;
  }

.bento-grid__wrapper .card {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-2 {
	border: var(--main-border);
	border-radius: 10px;
	background-color: var(--bg);
	position: absolute;
	padding: 12px 10px 8px 10px;
	margin-top: -40px;
    margin-left: 10px;
	transform: rotate(-2deg);
  }

  @media screen and (min-width: 900px) {
    .banner-2 {
        margin-top: -80px;
    }
  }

  @media screen and (min-width: 900px) {
    .bento-grid {
      padding: var(--section-padding);
    }
  }

  .bento-grid__wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 0 auto;
    width: var(--grid-width-mobile);
    max-width: var(--grid-max-width);
  }

  @media (min-width: 900px) {
    .bento-grid__wrapper {
      grid-template-columns: repeat(12, 1fr);
    }

    .bento-grid__wide {
      grid-column: span 12;
    }

    .bento-grid__narrow {
      grid-column: span 12;
    }

    .bento-grid__image-card {
      grid-column: span 12;
    }

    /* Desktop layout */
    .bento-grid__wide:nth-of-type(1) { grid-column: span 8; }
    .bento-grid__image-card { grid-column: span 4; }
    .bento-grid__narrow { grid-column: span 4; }
    .bento-grid__wide:nth-of-type(4) { grid-column: span 8; }
  }

  .bento-grid__facts {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 600px) {
    .bento-grid__facts {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .bento-grid__cta {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 600px) {
    .bento-grid__cta {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .bento-grid__image {
    width: 100%;
    height: 100%;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: top right;
    border-radius: inherit;
  }
</style>
