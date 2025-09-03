<!-- Hero Product -->

<script>
    export let textAlignment = 'center'; // 'start', 'center', 'end'
    export let eyebrow = '';
    export let heading = '';
    export let text = '';


    import { parallax } from '$lib/actions/parallax.js';
    
    import SocialLinks from '$lib/components/SocialLinks.svelte';
    import TextBlock from '$lib/components/TextBlock.svelte';

    import ButtonGroup from '$lib/components/Buttons.svelte';
    export let primaryButtonText = '';
export let primaryButtonLink = '';
export let secondaryButtonText = '';
export let secondaryButtonLink = '';
export let lineText = '';
export let lineLink = '';
export let badge = '';


import bg from '$lib/images/bg.jpg?enhanced';
  </script>
  
  <section id="hero-section" class="hero-product bg1">
  
    <div class={`grid-container full hero-grid ${textAlignment}`}>
        
        <TextBlock 
        centered={true}
        eyebrow={eyebrow}
        heading={heading}
        text={text}
        badge={badge}
        headingLevel="h1"
        />
  
        <ButtonGroup
        primaryText={primaryButtonText}
        primaryLink={primaryButtonLink}
        secondaryText={secondaryButtonText}
        secondaryLink={secondaryButtonLink}
        lineText={lineText}
        lineLink={lineLink}
        centered={true}
      />
    </div>
    <div class="grid-container full">
      <div class="hero-image">
        <enhanced:img src={bg} alt="" />
      </div>
    </div>
  </section>
  
  


  <SocialLinks
		direction="v"
		fixedPosition = {true}
		hideOnMobile = {false}
		width = "30"
/>
  
  <style>
  


  </style>