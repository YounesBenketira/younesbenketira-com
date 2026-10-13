export function createScrollbar() {
  const scrollbar = document.createElement('input');
  scrollbar.type = 'range';
  scrollbar.className = 'page-scroll';
  scrollbar.min = '0';
  scrollbar.max = '100';
  scrollbar.step = 'any';
  scrollbar.value = '0';
  scrollbar.setAttribute('aria-label', 'Page scroll position');
  scrollbar.setAttribute('aria-controls', 'experience');
  document.body.append(scrollbar);
  const extent = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const sync = () => {
    const range = extent();
    const percentage = range > 0 ? scrollY / range * 100 : 0;
    const upperBound = Math.min(100, percentage);
    const progress = Math.max(0, upperBound);
    scrollbar.value = String(progress);
    scrollbar.setAttribute('aria-valuetext', `${Math.round(progress)}% of page`);
    scrollbar.hidden = range === 0;
    const height = Math.max(28, innerHeight * innerHeight / document.documentElement.scrollHeight);
    scrollbar.style.setProperty('--thumb-size', `${height}px`);
  };
  scrollbar.addEventListener('input', () => {
    window.scrollTo({ top: Number(scrollbar.value) / 100 * extent(), behavior: 'instant' });
  });
  scrollbar.addEventListener('keydown', (event) => {
    const destinations = {
      ArrowDown: scrollY + 40, ArrowUp: scrollY - 40,
      PageDown: scrollY + innerHeight * .9, PageUp: scrollY - innerHeight * .9,
      Home: 0, End: extent(),
    };
    const top = destinations[event.key];
    if (top === undefined) return;
    event.preventDefault();
    window.scrollTo({ top, behavior: 'instant' });
  });
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  new ResizeObserver(sync).observe(document.querySelector('#experience'));
  sync();
}
