<script lang="ts">
export let direction: 'h' | 'v' = 'h';
export let fixedPosition = false;
export let hideOnMobile = false;
export let width = "24"
export let centered = false;

// Hardcoded links (you can replace these with your actual links)
const website = 'https://solarity.farm';
const facebook = '';
const twitter = '';
const instagram = 'https://www.instagram.com/solarity.acres/';
const patreon = '';
const youtube = 'https://www.youtube.com/@solarityacres';
const vimeo = '';
const linkedin = '';
const tiktok = 'https://www.tiktok.com/@solarity.acres';
const spotify = '';
const appleMusic = '';
const bandcamp = '';
const bluesky = 'https://bsky.app/profile/solarity-acres.bsky.social';
const threads = '';
const soundcloud = '';
const twitch = '';
const pinterest = '';
const substack = '';
const discord = '';
const snapchat = '';
const github = '';

</script>

<div
	class="social-links"
	class:vertical={direction === 'v'}
	class:fixed-bottom-left={fixedPosition}
	class:u-hide-mobile={hideOnMobile}
	class:centered={centered}
>

{#if website}
	<a href={website} target="_blank" rel="noopener noreferrer" aria-label="Website" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" width={width} height={width}>
			<path d="M15.29 20.663h3.017a2.194 2.194 0 0 0 2.193-2.194v-6.454a3.3 3.3 0 0 0-1.13-2.48l-5.93-5.166a2.194 2.194 0 0 0-2.88 0L4.63 9.534a3.3 3.3 0 0 0-1.13 2.481v6.454c0 1.212.982 2.194 2.194 2.194h3.29m6.306 0v-6.581c0-.908-.736-1.645-1.645-1.645H10.63c-.909 0-1.645.737-1.645 1.645v6.581m6.306 0H8.984"/>
		</svg>
	</a>
{/if}


	{#if facebook}
		<a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
              </svg>
		</a>
	{/if}
	{#if twitter}
		<a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z"></path>
              </svg>
              <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
              </svg> -->
		</a>
	{/if}
	{#if instagram}
		<a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M16.5 7.5l0 .01"></path>
              </svg>
		</a>
	{/if}
	{#if patreon}
		<a href={patreon} target="_blank" rel="noopener noreferrer" aria-label="Patreon" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M20 8.408c-.003 -2.299 -1.746 -4.182 -3.79 -4.862c-2.54 -.844 -5.888 -.722 -8.312 .453c-2.939 1.425 -3.862 4.545 -3.896 7.656c-.028 2.559 .22 9.297 3.92 9.345c2.75 .036 3.159 -3.603 4.43 -5.356c.906 -1.247 2.071 -1.599 3.506 -1.963c2.465 -.627 4.146 -2.626 4.142 -5.273z"></path>
              </svg>
		</a>
	{/if}
	{#if youtube}
		<a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path>
                <path d="M10 9l5 3l-5 3z"></path>
              </svg>
		</a>
	{/if}
    {#if vimeo}
        <a href={vimeo} target="_blank" rel="noopener noreferrer" aria-label="Vimeo" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M3 8.5l1 1s1.5 -1.102 2 -.5c.509 .609 1.863 7.65 2.5 9c.556 1.184 1.978 2.89 4 1.5c2 -1.5 7.5 -5.5 8.5 -11.5c.444 -2.661 -1 -4 -2.5 -4c-2 0 -4.047 1.202 -4.5 4c2.05 -1.254 2.551 1 1.5 3c-1.052 2 -2 3 -2.5 3c-.49 0 -.924 -1.165 -1.5 -3.5c-.59 -2.42 -.5 -6.5 -3 -6.5s-5.5 4.5 -5.5 4.5z"></path>
              </svg>
        </a>
    {/if}
	{#if linkedin}
		<a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M8 11l0 5"></path>
                <path d="M8 8l0 .01"></path>
                <path d="M12 16l0 -5"></path>
                <path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
              </svg>
		</a>
	{/if}
	{#if tiktok}
		<a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"></path>
              </svg>
		</a>
	{/if}
	{#if spotify}
		<a href={spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527"></path>
                <path d="M9 15c1.5 -1 4 -1 5 .5"></path>
                <path d="M7 9c2 -1 6 -2 10 .5"></path>
              </svg>
		</a>
	{/if}
	{#if appleMusic}
		<a href={appleMusic} target="_blank" rel="noopener noreferrer" aria-label="Apple Music" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
				<path d="M8.286 7.008c-3.216 0 -4.286 3.23 -4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165 -.05 1.799 -.538 3.214 -.538c1.406 0 1.607 .538 3.214 .538s4.286 -3.229 4.286 -5.381c-.03 -.011 -2.649 -.434 -2.679 -3.23c-.02 -2.335 2.589 -3.179 2.679 -3.228c-1.096 -1.606 -3.162 -2.113 -3.75 -2.153c-1.535 -.12 -3.032 1.077 -3.75 1.077c-.729 0 -2.036 -1.077 -3.214 -1.077z"></path>
				<path d="M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2"></path>
			  </svg>
		</a>
	{/if}
	{#if bandcamp}
		<a href={bandcamp} target="_blank" rel="noopener noreferrer" aria-label="Bandcamp" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M8.5 6h13.5l-7 12h-13z"></path>
              </svg>
		</a>
	{/if}
	{#if bluesky}
		<a href={bluesky} target="_blank" rel="noopener noreferrer" aria-label="Bluesky" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
                <path d="M6.335 5.144c-1.654 -1.199 -4.335 -2.127 -4.335 .826c0 .59 .35 4.953 .556 5.661c.713 2.463 3.13 2.75 5.444 2.369c-4.045 .665 -4.889 3.208 -2.667 5.41c1.03 1.018 1.913 1.59 2.667 1.59c2 0 3.134 -2.769 3.5 -3.5c.333 -.667 .5 -1.167 .5 -1.5c0 .333 .167 .833 .5 1.5c.366 .731 1.5 3.5 3.5 3.5c.754 0 1.637 -.571 2.667 -1.59c2.222 -2.203 1.378 -4.746 -2.667 -5.41c2.314 .38 4.73 .094 5.444 -2.369c.206 -.708 .556 -5.072 .556 -5.661c0 -2.953 -2.68 -2.025 -4.335 -.826c-2.293 1.662 -4.76 5.048 -5.665 6.856c-.905 -1.808 -3.372 -5.194 -5.665 -6.856z"></path>
              </svg>
		</a>
	{/if}
    {#if threads}
	<a href={threads} target="_blank" rel="noopener noreferrer" aria-label="Threads" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M19 7.5c-1.333 -3 -3.667 -4.5 -7 -4.5c-5 0 -8 2.5 -8 9s3.5 9 8 9s7 -3 7 -5s-1 -5 -7 -5c-2.5 0 -3 1.25 -3 2.5c0 1.5 1 2.5 2.5 2.5c2.5 0 3.5 -1.5 3.5 -5s-2 -4 -3 -4s-1.833 .333 -2.5 1"></path>
          </svg>
	</a>
{/if}
{#if soundcloud}
	<a href={soundcloud} target="_blank" rel="noopener noreferrer" aria-label="SoundCloud" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z"></path>
            <path d="M9 8l0 9"></path>
            <path d="M6 17l0 -7"></path>
            <path d="M3 16l0 -2"></path>
          </svg>
	</a>
{/if}
{#if twitch}
	<a href={twitch} target="_blank" rel="noopener noreferrer" aria-label="Twitch" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z"></path>
            <path d="M16 8l0 4"></path>
            <path d="M12 8l0 4"></path>
          </svg>
	</a>
{/if}
{#if pinterest}
	<a href={pinterest} target="_blank" rel="noopener noreferrer" aria-label="Pinterest" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M8 20l4 -9"></path>
            <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
          </svg>
	</a>
{/if}
{#if substack}
	<a href={substack} target="_blank" rel="noopener noreferrer" aria-label="Substack" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" width={width}
	height={width} fill="currentColor" class="bi bi-substack" viewBox="0 0 16 16">
			<path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208zM15 0H1v1.89h14z"/>
		  </svg>
	</a>
{/if}
{#if discord}
	<a href={discord} target="_blank" rel="noopener noreferrer" aria-label="Discord" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
            <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
            <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"></path>
            <path d="M7 16.5c3.5 1 6.5 1 10 0"></path>
          </svg>
	</a>
{/if}
{#if snapchat}
	<a href={snapchat} target="_blank" rel="noopener noreferrer" aria-label="Snapchat" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M16.882 7.842a4.882 4.882 0 0 0 -9.764 0c0 4.273 -.213 6.409 -4.118 8.118c2 .882 2 .882 3 3c3 0 4 2 6 2s3 -2 6 -2c1 -2.118 1 -2.118 3 -3c-3.906 -1.709 -4.118 -3.845 -4.118 -8.118zm-13.882 8.119c4 -2.118 4 -4.118 1 -7.118m17 7.118c-4 -2.118 -4 -4.118 -1 -7.118"></path>
          </svg>
	</a>
{/if}
{#if github}
	<a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" tabindex="0">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={width}
	height={width} stroke-width="2">
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
          </svg>
	</a>
{/if}

</div>

<style>
	.social-links {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 1rem;
	mix-blend-mode: difference;
}

.social-links.vertical {
	flex-direction: column;
	align-items: flex-start;
}

.social-links a {
	display: inline-flex;
	transition: opacity 0.2s ease;
}

.social-links a svg {
    stroke: white;
}

.social-links a:hover svg,
.social-links a:focus svg,
.social-links a:active  svg{
	stroke: var(--accent);
	transform: scale(1.05);
}


.fixed-bottom-left {
	position: fixed;
	left: 1rem;
	bottom: 1rem;
	z-index: 999;
}

.social-links.centered {
	justify-content: center;
}


</style>
