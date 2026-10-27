import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeEvent, scheduleAnalytics, trackPortfolio } from '../dist/analytics.js';

test('visit URLs omit query strings and fragments and bound campaign values', () => {
  const event = { properties: {
    $current_url: 'https://younesbenketira.com/?example=value#project',
    $initial_referrer: 'https://example.com/route?example=value',
    utm_campaign: 'x'.repeat(200),
    $viewport_width: 390,
  } };
  const result = sanitizeEvent(event).properties;
  assert.equal(result.$current_url, 'https://younesbenketira.com/');
  assert.equal(result.$initial_referrer, 'https://example.com');
  assert.equal(result.utm_campaign.length, 160);
  assert.equal(result.$viewport_width, 390);
  assert.equal(sanitizeEvent(null), null);
});

test('local preview never starts provider loading', () => {
  globalThis.POSTHOG_PROJECT_KEY = 'example';
  globalThis.POSTHOG_API_HOST = 'https://us.i.posthog.com';
  globalThis.location = { hostname: 'localhost' };
  globalThis.document = { get readyState() { throw new Error('Must not start locally'); } };
  assert.doesNotThrow(scheduleAnalytics);
  delete globalThis.document;
  delete globalThis.location;
  delete globalThis.POSTHOG_PROJECT_KEY;
  delete globalThis.POSTHOG_API_HOST;
});

test('chapter visits deduplicate and outbound events omit destination URLs', () => {
  const events = [];
  const listeners = {};
  let changed;
  globalThis.MutationObserver = class {
    constructor(callback) { changed = callback; }
    observe() {}
  };
  const page = {
    body: { dataset: { chapter: '0' } },
    addEventListener(name, callback) { listeners[name] = callback; },
    querySelector() { return null; },
  };
  trackPortfolio({ capture: (event, properties) => events.push({ event, properties }) }, page);
  page.body.dataset.chapter = '2';
  changed();
  changed();
  const href = 'https://www.coachdiff.com/?example=value';
  listeners.click({ target: { closest: () => ({ href }) } });
  assert.deepEqual(events, [
    { event: 'portfolio_chapter_reached', properties: { chapter: 'home' } },
    { event: 'portfolio_chapter_reached', properties: { chapter: 'project' } },
    { event: 'portfolio_link_clicked', properties: { destination: 'coachdiff' } },
  ]);
  delete globalThis.MutationObserver;
});
