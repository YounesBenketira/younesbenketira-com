const publicHosts = new Set(['younesbenketira.com', 'www.younesbenketira.com']);
const chapters = ['home', 'career', 'project', 'contact'];
const destinations = new Map([
  ['www.flighthub.com', 'flighthub'], ['www.coachdiff.com', 'coachdiff'],
  ['www.linkedin.com', 'linkedin'], ['github.com', 'github'],
  ['x.com', 'x'], ['www.youtube.com', 'youtube'],
]);

export function sanitizeEvent(event) {
  if (!event) return event;
  for (const [key, value] of Object.entries(event.properties)) {
    if (typeof value !== 'string') continue;
    if (key.includes('url') || key.includes('referrer')) {
      event.properties[key] = safeLocation(value, key.includes('referrer'));
    } else {
      event.properties[key] = value.slice(0, 160);
    }
  }
  return event;
}

function safeLocation(value, referrer) {
  try {
    const url = new URL(value);
    return referrer ? url.origin : url.origin + url.pathname;
  } catch {
    return '';
  }
}

export function trackPortfolio(client, page = document) {
  const reached = new Set();
  const captureChapter = () => {
    const chapter = chapters[Number(page.body.dataset.chapter)];
    if (!chapter || reached.has(chapter)) return;
    reached.add(chapter);
    client.capture('portfolio_chapter_reached', { chapter });
  };
  captureChapter();
  new MutationObserver(captureChapter).observe(page.body, {
    attributes: true, attributeFilter: ['data-chapter'],
  });
  page.addEventListener('click', event => {
    const link = event.target.closest?.('a');
    if (!link) return;
    const url = new URL(link.href);
    const destination = url.protocol === 'mailto:' ? 'email' : destinations.get(url.hostname);
    if (destination) client.capture('portfolio_link_clicked', { destination });
  });
  page.querySelector('audio')?.addEventListener('play', () => {
    client.capture('portfolio_demo_played', { demo: 'mila_voice' });
  }, { once: true });
}

async function startAnalytics() {
  const { default: client } = await import('posthog-js/dist/module.full.no-external');
  client.init(POSTHOG_PROJECT_KEY, {
    api_host: POSTHOG_API_HOST,
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_heatmaps: false,
    capture_performance: false,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
    disable_surveys: true,
    person_profiles: 'identified_only',
    persistence: 'localStorage+cookie',
    cross_subdomain_cookie: true,
    advanced_disable_feature_flags: true,
    before_send: sanitizeEvent,
    loaded(instance) {
      instance.register({ site: 'portfolio' });
      trackPortfolio(instance);
    },
  });
}

export function scheduleAnalytics() {
  const configured = Boolean(POSTHOG_PROJECT_KEY && POSTHOG_API_HOST);
  const publicSite = publicHosts.has(location.hostname);
  if (!configured || !publicSite) return;
  const start = () => void startAnalytics().catch(() => console.warn('Visit analytics could not start.'));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
