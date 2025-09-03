/**
 * Sanity image utilities
 * This is a stub implementation for projects not using Sanity CMS
 * Replace with actual Sanity client configuration if needed
 */

interface ImageAsset {
  _ref?: string;
  asset?: {
    _ref: string;
  };
}

interface SanityImage {
  asset: ImageAsset;
  alt?: string;
  caption?: string;
}

class ImageUrlBuilder {
  private _url: string;

  constructor(url: string) {
    this._url = url;
  }

  width(w: number) {
    return this;
  }

  height(h: number) {
    return this;
  }

  format(fmt: string) {
    return this;
  }

  quality(q: number) {
    return this;
  }

  url(): string {
    // Return a placeholder image if no Sanity setup
    return this._url || '/lib/images/placeholder_landscape.jpg';
  }
}

/**
 * Creates a URL builder for Sanity images
 * @param image - Sanity image object
 * @returns ImageUrlBuilder instance
 */
export function urlFor(image: SanityImage | ImageAsset | string): ImageUrlBuilder {
  if (typeof image === 'string') {
    return new ImageUrlBuilder(image);
  }

  if (image && typeof image === 'object') {
    // Handle different Sanity image formats
    const ref = image.asset?._ref || (image as ImageAsset)._ref;
    
    if (ref) {
      // In a real Sanity setup, this would construct the actual CDN URL
      // For now, return a placeholder
      return new ImageUrlBuilder('');
    }
  }

  // Fallback to placeholder
  return new ImageUrlBuilder('/lib/images/placeholder_landscape.jpg');
}

/**
 * Extract alt text from Sanity image
 */
export function getImageAlt(image: SanityImage): string {
  return image?.alt || 'Image';
}

/**
 * Extract caption from Sanity image
 */
export function getImageCaption(image: SanityImage): string {
  return image?.caption || '';
}

/**
 * Check if image has valid asset
 */
export function hasImageAsset(image: SanityImage | null | undefined): boolean {
  return !!(image?.asset?._ref);
}
