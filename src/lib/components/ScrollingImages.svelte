<script lang="ts">
    import mockup1 from '$lib/images/mockup1.png?enhanced';
    import mockup2 from '$lib/images/mockup2.png?enhanced';
    import mockup3 from '$lib/images/mockup3.png?enhanced';
    import mockup4 from '$lib/images/mockup4.png?enhanced';
    import mockup5 from '$lib/images/mockup5.png?enhanced';
    import mockup6 from '$lib/images/mockup6.png?enhanced';
    import mockup7 from '$lib/images/mockup7.png?enhanced';
    import mockup8 from '$lib/images/mockup8.png?enhanced';
    import mockup9 from '$lib/images/mockup9.png?enhanced';
    import mockup10 from '$lib/images/mockup10.png?enhanced';
    import smMockup1 from '$lib/images/sm_mockup1.png?enhanced';
    import smMockup2 from '$lib/images/sm_mockup2.png?enhanced';
    import smMockup3 from '$lib/images/sm_mockup3.png?enhanced';
    import smMockup4 from '$lib/images/sm_mockup4.png?enhanced';
    import smMockup5 from '$lib/images/sm_mockup5.png?enhanced';
  </script>
  

  <section class="mockups-section bg1" id="work" style="z-index: 2;">
    <div class="mockups-container">
      <enhanced:img class="parallax" data-y-value="-50" src={mockup1} alt="Mockup 1" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="100" src={mockup2} alt="Mockup 2" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="-20" src={mockup3} alt="Mockup 3" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="30" src={mockup4} alt="Mockup 4" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="-70" src={mockup5} alt="Mockup 5" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="50" src={mockup6} alt="Mockup 6" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="-100" src={mockup7} alt="Mockup 7" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="80" src={mockup8} alt="Mockup 8" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax" data-y-value="20" src={mockup9} alt="Mockup 9" loading="lazy" width="1000" height="600" />
      <enhanced:img class="parallax u-hide-mobile" data-y-value="-40" src={mockup10} alt="Mockup 10" loading="lazy" width="1000" height="600" />
  
      <enhanced:img class="parallax sm-mockup sm-mockup1" data-y-value="-300" src={smMockup1} alt="Small Mockup 1" loading="lazy" width="400" height="300" />
      <enhanced:img class="parallax sm-mockup sm-mockup2" data-y-value="190" src={smMockup2} alt="Small Mockup 2" loading="lazy" width="400" height="300" />
      <enhanced:img class="parallax sm-mockup sm-mockup3" data-y-value="-250" src={smMockup3} alt="Small Mockup 3" loading="lazy" width="400" height="300" />
      <enhanced:img class="parallax sm-mockup sm-mockup4" data-y-value="200" src={smMockup4} alt="Small Mockup 4" loading="lazy" width="400" height="300" />
      <enhanced:img class="parallax sm-mockup sm-mockup5" data-y-value="320" src={smMockup5} alt="Small Mockup 5" loading="lazy" width="400" height="300" />
    </div>
  </section>
  

  <style>
/* Mockups Section */
.mockups-container img {
	border: 4px solid var(--text-color);
	border-radius: 8px;
	box-shadow: rgba(100, 100, 111, 1) 0px 7px 29px 0px;

  }
  
  .mockups-container {
	max-width: 1800px;
	margin: 0 auto;
	position: relative;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 20px;
	position: relative;
  }

  .mockups-container {
	position: relative; /* Ensure parent container is a positioning context */
  }
  
  .sm-mockup {
	position: absolute;
	max-width: 400px;
	width: 30%;
	z-index: 10; /* Layer on top of main mockups */
  }
  
  .sm-mockup1 {
	top: 60%;
	left: 25%;
  }
  
  .sm-mockup2 {
	top: 20%;
	right: 20%;
  }
  
  .sm-mockup3 {
	bottom: 15%;
	left: 30%;
  }
  
  .sm-mockup4 {
	bottom: 25%;
	right: 25%;
  }
  
  .sm-mockup5 {
	top: 5%;
	right: 60%;
  }
  

  /* Desktop styles */
  @media (min-width: 900px) {
	.mockups-container {
	  grid-template-columns: repeat(5, 1fr);
	}
  
	.mockups-section {
	  padding: 0;
	}
  }
  
  /* Mobile styles */
  @media (max-width: 899px) {
	.mockups-container {
	  grid-template-columns: repeat(3, 1fr);
	  gap: 10px;
	}
  }
  </style>