<script lang="ts">
	import { onMount } from 'svelte';
import { initGsapAnimations } from '$lib/animations/gsap';
    import Buttons from './Buttons.svelte';

	import asset1 from '$lib/images/asset1.png?enhanced';
import asset2 from '$lib/images/asset2.png?enhanced';
import asset3 from '$lib/images/asset3.png?enhanced';
    import TriangleContainer from './TriangleContainer.svelte';

import img1 from '$lib/images/seb_jagoe_kale_greenhouse.webp?enhanced';


onMount(() => {
	initGsapAnimations();
});

</script>

<section class="hero-section-container bg1">

	<div class="section-content-container">
		<div class="hero-text-container u-align-center">
			<p class="eyebrow">solarity<span class="heavy">acres</span></p>

			<enhanced:img
      src={img1}
      alt="Profile Image"
      width="400"
      height="400"
    />
			
			<h1 class="hero-text split-text">
				Build healthy soil and <em>grow better vegetables</em>.
			</h1>

			<p class="fade_up">I teach people how to get bountiful yields with <strong>less work, fewer inputs and no fertilizers or pesticides</strong>.</p>

			<Buttons lineLink="course/build-soil" lineText="👉 How to make healthy soil?"/>

			
		</div>
	</div>

</section>

<style>
	/* Hero Section */


/* CSS for the Hero Section Container */
.hero-section-container {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center; /* Center children vertically */
	min-height: 80vh;
	transition: 0.4s;
}

.section-content-container {
	display: flex;
	flex-direction: column; /* Stack children vertically */
	padding: 0 40px;
	
	text-align: center;
	max-width: var(--grid-max-width);
  }
  
  
</style>
