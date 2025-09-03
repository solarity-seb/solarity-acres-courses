import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize GSAP animations for the hero section
 */
export function initGsapAnimations() {
  // Hero text animations
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroButtons = document.querySelector('.hero-buttons');
  const heroImage = document.querySelector('.hero-image');

  if (heroTitle) {
    gsap.fromTo(heroTitle, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power2.out" 
      }
    );
  }

  if (heroSubtitle) {
    gsap.fromTo(heroSubtitle, 
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        delay: 0.2, 
        ease: "power2.out" 
      }
    );
  }

  if (heroButtons) {
    gsap.fromTo(heroButtons, 
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        delay: 0.4, 
        ease: "power2.out" 
      }
    );
  }

  if (heroImage) {
    gsap.fromTo(heroImage, 
      { 
        opacity: 0, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        delay: 0.3, 
        ease: "power2.out" 
      }
    );
  }

  // Parallax effects for images with data-y-value attribute
  const parallaxElements = document.querySelectorAll('[data-y-value]');
  
  parallaxElements.forEach((element) => {
    const yValue = element.getAttribute('data-y-value');
    if (yValue) {
      gsap.to(element, {
        y: yValue,
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });

  // Fade in animations for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    gsap.fromTo(section, 
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

/**
 * Clean up GSAP animations and ScrollTriggers
 */
export function cleanupGsapAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
}
