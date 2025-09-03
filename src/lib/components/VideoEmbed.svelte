<!-- <VideoEmbed
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Never Gonna Give You Up"
  thumbnail=""
  aspectRatio="16:9"
  autoplay={true}
/> -->

<script lang="ts">
    export let src: string;
    export let title: string = 'Video';
    export let thumbnail: string | undefined;
    export let aspectRatio: string = '16:9';
    export let autoplay: boolean = true;
    export let playLabel: string = 'Play video';
  
    let isPlaying = false;
    let hasTransitioned = false;
  
    const getEmbedUrl = (src: string) => {
      const youtubeMatch = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=${autoplay ? 1 : 0}`;
      }
  
      const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoplay ? 1 : 0}`;
      }
  
      return '';
    };
  
    const getYouTubeThumbnail = (src: string) => {
      const match = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
    };
  
    function playVideo() {
      hasTransitioned = true;
      setTimeout(() => (isPlaying = true), 300);
    }
  
    $: embedUrl = getEmbedUrl(src);
    $: aspect = aspectRatio.split(':').map(Number);
    $: paddingBottom = aspect.length === 2 ? `${(aspect[1] / aspect[0]) * 100}%` : '56.25%';
    $: placeholderImage = thumbnail || getYouTubeThumbnail(src);
  </script>
  
  <div class="video-wrapper" style="--aspect-ratio: {paddingBottom}">
    {#if !isPlaying}
      <button
        class="video-placeholder {hasTransitioned ? 'fade-out' : ''}"
        on:click={playVideo}
        aria-label={playLabel}
      >
        <img
          src={placeholderImage}
          alt={title}
          class="video-thumbnail"
          loading="lazy"
          width="1280"
          height="720"
        />
        <div class="play-button" aria-hidden="true">▶</div>
      </button>
    {:else if embedUrl}
      <iframe
        src={embedUrl}
        title={title}
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        class="video-iframe fade-in"
      ></iframe>
    {/if}
  </div>
  
  <style>
    .video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: var(--aspect-ratio);
      background-color: var(--grey-800);
      overflow: hidden;
    }
  
    .video-wrapper iframe,
    .video-wrapper .video-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  
    .video-placeholder {
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      background: none;
      display: block;
      transition: opacity 0.3s ease;
    }
  
    .video-placeholder.fade-out {
      opacity: 0;
      pointer-events: none;
    }
  
    .video-iframe.fade-in {
      animation: fadeIn 0.3s ease forwards;
    }
  
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  
    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border: none;
    }
  
    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      background-color: var(--dark-transparent);
      color: var(--light);
      border-radius: 50%;
      padding: 0.5em 0.6em;
      line-height: 1;
      transition: background-color 0.3s ease;
    }
  
    .video-placeholder:hover .play-button,
    .video-placeholder:focus .play-button {
      background-color: var(--accent-transparent);
    }
  </style>
  