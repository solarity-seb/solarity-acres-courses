<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  let isHovering = false;
  let isClicking = false;

  let dotEl: HTMLDivElement;
  let ringEl: HTMLDivElement;

  const speed = 0.15;

  function updateMouse(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animate() {
  dotX += (mouseX - dotX) * speed * 2;
  dotY += (mouseY - dotY) * speed * 2;
  ringX += (mouseX - ringX) * speed;
  ringY += (mouseY - ringY) * speed;

  if (dotEl) {
    dotEl.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`;
  }
  if (ringEl) {
  const scale = isClicking ? 0.8 : isHovering ? 1.6 : 1;
  ringEl.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${scale})`;
}


  checkHoverElements(); // <-- ADD THIS

  requestAnimationFrame(animate);
}


  function checkHoverElements() {
  const el = document.elementFromPoint(mouseX, mouseY);
  if (el?.closest('a, button, .faq-item, [data-cursor-hover]')) {
    isHovering = true;
  } else {
    isHovering = false;
  }
}


  function handleMouseDown() {
    isClicking = true;
  }

  function handleMouseUp() {
    isClicking = false;
  }

  onMount(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      updateMouse(e);
    });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    animate();
  }
});


  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('mousemove', checkHoverElements);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  });
</script>

<div class="cursor-dot u-hide-mobile {isHovering ? 'hover' : ''} {isClicking ? 'click' : ''}" bind:this={dotEl}></div>
<div class="cursor-ring u-hide-mobile {isHovering ? 'hover' : ''} {isClicking ? 'click' : ''}" bind:this={ringEl}></div>


<style>
  .cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  transform: translate3d(0, 0, 0) scale(1);
  transition: transform 0.3s var(--cubic);

  z-index: 999999;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent);
  border-radius: 50%;
}

.cursor-ring {
  width: 32px;
  height: 32px;
  border: 2px solid var(--accent);
  border-radius: 50%;
}



</style>
