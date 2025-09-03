<script>
    import LinkButton from '$lib/components/LinkButton.svelte';
    import headshot from '$lib/images/seb_headshot_green.webp?enhanced';
    import SocialLinks from '$lib/components/SocialLinks.svelte';
  </script>
  
  <section class="linktree-section">
    <div class="flex-grid">
      <div class="col-12 u-align-center">
        <div class="profile-image">
          <enhanced:img
  src={headshot}
  alt="Profile Image"
  width="150"
  height="200"
  style="width: 150px; height: 200px; margin-bottom: 20px;"
/>

        </div>
        
        <div class="name">
          <p class="eyebrow">Seb 💚</p>
          <h2>Solarity Acres <span class="banner">Feed your soil!</span></h2>
          <p class="description">Helping you build healthy soil and grow better vegetables.</p>
          <SocialLinks centered={true} width="32" />
        </div>
        </div>
        </div>


    <div class="flex-grid">
      <div class="col-12">
        <div class="linktree-links">
          <LinkButton url="/" title="Website">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
              <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
              <path d="M10 12h4v4h-4z"></path>
            </svg>
            Website
          </LinkButton>
          
          <LinkButton url="/" title="Downloadable resources" disabled description="[coming soon!]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15">
    <path fill="currentColor" fill-rule="evenodd" d="M7.5 1.05a.45.45 0 0 1 .45.45v6.914l2.232-2.232a.45.45 0 1 1 .636.636l-3 3a.45.45 0 0 1-.636 0l-3-3a.45.45 0 1 1 .636-.636L7.05 8.414V1.5a.45.45 0 0 1 .45-.45ZM2.5 10a.5.5 0 0 1 .5.5V12c0 .554.446 1 .996 1h7.005A.999.999 0 0 0 12 12v-1.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-1.999 2H3.996A1.997 1.997 0 0 1 2 12v-1.5a.5.5 0 0 1 .5-.5Z" clip-rule="evenodd"/>
</svg>
            Downloadable resources
          </LinkButton>

          

          <LinkButton url="/community" title="The Solarity Acres Community" description="Join waitlist now to secure your spot!">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
    <path fill="currentColor" fill-rule="evenodd" d="M5.482 4.344a2 2 0 1 0-2.963 0c-.08.042-.156.087-.23.136c-.457.305-.75.704-.933 1.073A3.457 3.457 0 0 0 1 6.978V9a1 1 0 0 0 1 1h2.5a3.69 3.69 0 0 1 .684-.962L5.171 9H2V7s0-2 2-2c1.007 0 1.507.507 1.755 1.01c.225-.254.493-.47.793-.636a2.717 2.717 0 0 0-1.066-1.03M4 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m10 6h-2.5a3.684 3.684 0 0 0-.684-.962L10.829 9H14V7s0-2-2-2c-1.007 0-1.507.507-1.755 1.01a3.012 3.012 0 0 0-.793-.636a2.716 2.716 0 0 1 1.066-1.03a2 2 0 1 1 2.963 0c.08.042.156.087.23.136c.457.305.75.704.933 1.073A3.453 3.453 0 0 1 15 6.944V9a1 1 0 0 1-1 1m-2-6a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/>
    <path fill="currentColor" fill-rule="evenodd" d="M10 8c0 .517-.196.989-.518 1.344a2.755 2.755 0 0 1 1.163 1.21A3.453 3.453 0 0 1 11 11.977V14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2.022a2.005 2.005 0 0 1 .006-.135a3.456 3.456 0 0 1 .35-1.29a2.755 2.755 0 0 1 1.162-1.21A2 2 0 1 1 10 8m-4 4v2h4v-2s0-2-2-2s-2 2-2 2m3-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/>
</svg>
            The Solarity Acres <em>Community</em>
          </LinkButton>

          <LinkButton url="/courses" title="Complete gardening courses" disabled description="[coming soon!]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M3 6a4 4 0 0 1 4-4h14v20H7a4 4 0 0 1-4-4V6Zm2 8.535A3.982 3.982 0 0 1 7 14h12V4H7a2 2 0 0 0-2 2v8.535ZM19 16H7a2 2 0 1 0 0 4h12v-4ZM10 6h7v2h-7V6Z"/>
</svg>
            Complete gardening courses
          </LinkButton>

          <LinkButton url="/resources/mulch" title="Free Mulch Cheatsheet" description="Get the free mulch cheatsheet to learn about the best types of mulch!
">
🌾 Free Mulch Cheatsheet

          </LinkButton>

          <LinkButton url="/donate" title="Support Me" description="Sharing my videos and commenting are the best free ways to support. Want to go further?
">

💰 Support Me


          </LinkButton>
          
      
        
          

        </div>
      </div>
    </div>
  </section>
  
  <style>
   .linktree-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.name {
  position: relative; /* Establish a positioning context for the banner */
  display: inline-block; /* Ensure the name and banner behave as a unit */
}



  </style>