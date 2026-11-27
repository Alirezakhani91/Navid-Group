(() => {
  // All motion is purely decorative; navigation works without JavaScript.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  const halo = document.createElement('div');
  halo.className = 'cursor-halo';
  halo.setAttribute('aria-hidden', 'true');
  document.body.appendChild(halo);

  const radius = 245; // Half the CSS halo diameter.
  let targetX = -1000, targetY = -1000;
  let currentX = -1000, currentY = -1000;
  let active = false;
  let frame = 0;

  const animate = () => {
    frame = 0;
    // Smooth, understated easing instead of a cursor spotlight that snaps.
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    halo.style.transform = `translate3d(${currentX - radius}px, ${currentY - radius}px, 0)`;
    if (active && (Math.abs(targetX - currentX) > .25 || Math.abs(targetY - currentY) > .25)) {
      frame = requestAnimationFrame(animate);
    }
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!active) {
      active = true;
      // Start directly underneath first movement; subsequent movement eases.
      currentX = targetX;
      currentY = targetY;
    }
    halo.classList.add('is-visible');
    halo.classList.toggle('is-link', !!event.target.closest('a, button'));
    if (!frame) frame = requestAnimationFrame(animate);
  }, {passive:true});

  const hide = () => {
    halo.classList.remove('is-visible', 'is-link');
    active = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) hide();
  });
  window.addEventListener('blur', hide);
})();
