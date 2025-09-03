<script lang="ts">
  import { onMount } from 'svelte';
  import lightGallery from 'lightgallery';
  import lgZoom from 'lightgallery/plugins/zoom';
  import lgThumbnail from 'lightgallery/plugins/thumbnail';

  import 'lightgallery/css/lightgallery.css';
  import 'lightgallery/css/lg-zoom.css';
  import 'lightgallery/css/lg-thumbnail.css';

  import { urlFor } from '$lib/sanityImage';
  import type Masonry from 'masonry-layout';

  interface GalleryImage {
    _id: string;
    image?: {
      asset?: {
        _ref: string;
      };
    };
    caption?: string;
    alt?: string;
    title?: string;
  }

  export let images: GalleryImage[] = [];
  
  let masonryInstance: Masonry | null = null;

  let galleryContainer: HTMLElement;

  onMount(async () => {
    
    const Masonry = (await import('masonry-layout')).default;

    
    lightGallery(galleryContainer, {
      selector: '.lightbox-trigger',
      plugins: [lgZoom, lgThumbnail],
      speed: 300,
      download: false,
    });

    const masonry = new Masonry(galleryContainer, {
      itemSelector: '.grid-item',
      gutter: 10,
      percentPosition: true,
    });
    
    masonryInstance = masonry;

    
    const imgs = galleryContainer.querySelectorAll('img');
    let loaded = 0;
    imgs.forEach((img: HTMLImageElement) => {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length && masonryInstance) {
          masonryInstance.layout();
        }
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === imgs.length && masonryInstance) {
            masonryInstance.layout();
          }
        });
      }
    });
  });
</script>

  
  <style>
    .gallery-grid {
      display: block; 
    }
  
    .grid-item {
      width: 100%;
      max-width: 400px;
      margin-bottom: 10px;
    }
  
    .grid-item img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      display: block;
    }
  
    @media (min-width: 600px) {
      .grid-item {
        width: 48%;
      }
    }
  
    @media (min-width: 900px) {
      .grid-item {
        width: 31%;
      }
    }
  </style>
  
  <section class="gallery-section">
    <div class="container">
      <div bind:this={galleryContainer} class="gallery-grid">
        {#each images as img (img._id)}
      {#if img.image && img.image.asset}
        <div class="grid-item">
          <a
            href={urlFor(img.image).width(1600).format('jpg').url()}
            class="lightbox-trigger"
            data-sub-html={img.caption}
          >
            <img
              src={urlFor(img.image).width(500).format('jpg').url()}
              alt={img.alt || img.title}
              loading="lazy"
            />
          </a>
        </div>
      {/if}
    {/each}
    
      </div>
    </div>
  </section>
  
  


  