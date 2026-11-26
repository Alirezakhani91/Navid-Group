(() => {
  // Keep content visible if JS or IntersectionObserver isn't available.
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-enhanced');
  const items = document.querySelectorAll('.about-premium-page [data-reveal]');
  const watcher = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        watcher.unobserve(entry.target);
      }
    }
  }, { threshold: .09, rootMargin: '0px 0px -30px 0px' });
  items.forEach(el => watcher.observe(el));
})();
