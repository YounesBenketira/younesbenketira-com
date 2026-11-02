import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPreloads } from './build-preloads.mjs';

test('preloads static startup dependencies once and leaves analytics deferred', () => {
  const outputs = {
    'dist/bundles/boot.js': {
      entryPoint: 'dist/boot.js',
      imports: [
        { path: 'dist/bundles/shared.js', kind: 'import-statement' },
        { path: 'dist/bundles/analytics.js', kind: 'dynamic-import' },
        { path: 'external.js', kind: 'import-statement', external: true },
      ],
    },
    'dist/bundles/app.js': {
      entryPoint: 'dist/app.js',
      imports: [{ path: 'dist/bundles/shared.js', kind: 'import-statement' }],
    },
    'dist/bundles/shared.js': {
      imports: [{ path: 'dist/bundles/leaf.js', kind: 'import-statement' }],
    },
    'dist/bundles/leaf.js': {
      imports: [{ path: 'dist/bundles/shared.js', kind: 'import-statement' }],
    },
  };
  const result = buildPreloads({ outputs });
  for (const name of ['boot', 'app', 'shared', 'leaf']) {
    const occurrences = result.split(`./bundles/${name}.js`).length - 1;
    assert.equal(occurrences, 1);
  }
  assert.ok(!result.includes('analytics.js'));
  assert.ok(!result.includes('external.js'));
});

test('missing startup entries or static chunks fail the build', () => {
  assert.throws(() => buildPreloads({ outputs: {} }), /Missing preload entry/);
  const outputs = {
    'dist/bundles/boot.js': {
      entryPoint: 'dist/boot.js',
      imports: [{ path: 'missing.js', kind: 'import-statement' }],
    },
  };
  assert.throws(() => buildPreloads({ outputs }), /Missing preload output/);
});
