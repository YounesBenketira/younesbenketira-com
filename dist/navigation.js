export function initializeNavigation() {
  const navigation = document.querySelector('.chapter-nav');
  const root = document.documentElement;
  const desktop = matchMedia('(min-width: 761px)');
  const update = () => {
    const scrolled = window.scrollY > 0;
    root.classList.toggle('has-scrolled', scrolled);
    navigation.hidden = !scrolled || !desktop.matches;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('pageshow', update);
  desktop.addEventListener('change', update);
  update();
}
