import { scheduleAnalytics } from './analytics.js';

scheduleAnalytics();
const loader = document.querySelector('#loading-screen');
const meter = loader.querySelector('[role="progressbar"]');
const label = loader.querySelector('output');
const content = document.querySelector('#experience');
content.inert = true;
document.documentElement.classList.add('is-loading');

window.addEventListener('scene-progress', event => {
  const value = event.detail;
  meter.style.setProperty('--progress', value);
  meter.setAttribute('aria-valuenow', String(value));
  label.textContent = `${value}%`;
});

function reveal() {
  content.inert = false;
  document.documentElement.classList.remove('is-loading');
  loader.hidden = true;
}

window.addEventListener('scene-complete', reveal, { once: true });
window.addEventListener('scene-failed', reveal, { once: true });
// Paint the lightweight loading screen before evaluating the 3D application.
requestAnimationFrame(() => requestAnimationFrame(() => {
  import('./app.js').catch(error => {
    content.classList.add('scene-failed');
    document.querySelector('#notice').textContent = 'The 3D view could not load. Reload to try again.';
    reveal();
    console.error('Scene module failed:', error);
  });
}));
