/**
 * Parallax action for Svelte components
 * Usage: <div use:parallax={{ speed: 0.5 }}>Content</div>
 */

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  disabled?: boolean;
  y?: number;
  start?: string;
  end?: string;
}

export function parallax(node: HTMLElement, options: ParallaxOptions = {}) {
  const {
    speed = 0.5,
    direction = 'up',
    disabled = false
  } = options;

  let ticking = false;
  let initialOffset = 0;

  function updateParallax() {
    if (disabled) return;

    const rect = node.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const nodeTop = rect.top + scrollTop;
    
    // Calculate the offset based on scroll position
    const offset = (scrollTop - nodeTop) * speed;
    const transform = direction === 'up' 
      ? `translateY(${-offset}px)` 
      : `translateY(${offset}px)`;
    
    node.style.transform = transform;
    
    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function init() {
    if (disabled) return;
    
    // Get initial position
    const rect = node.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    initialOffset = rect.top + scrollTop;
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateParallax();
  }

  function destroy() {
    window.removeEventListener('scroll', handleScroll);
    node.style.transform = '';
  }

  // Initialize on mount
  init();

  return {
    update(newOptions: ParallaxOptions) {
      Object.assign(options, newOptions);
      if (options.disabled) {
        destroy();
      } else {
        init();
      }
    },
    destroy
  };
}

/**
 * Simple parallax implementation using data attributes
 * Looks for elements with data-y-value attributes
 */
export function initDataParallax() {
  const elements = document.querySelectorAll('[data-y-value]');
  
  elements.forEach(element => {
    const yValue = parseFloat(element.getAttribute('data-y-value') || '0');
    
    function updateElement() {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset;
      const elementTop = rect.top + scrollTop;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax offset
      const offset = (scrollTop - elementTop + windowHeight) / windowHeight * yValue;
      (element as HTMLElement).style.transform = `translateY(${offset}px)`;
    }
    
    // Throttled scroll handler
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateElement();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateElement(); // Initial call
  });
}
