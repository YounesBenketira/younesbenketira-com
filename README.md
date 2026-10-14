# Younes Benketira

Personal portfolio with a Three.js scene inspired by Djamaa el Djazair, FlightHub experience, CoachDiff, and contact links.

## Local preview

Run `npm ci`, then `npm run build`. Start `python scripts/serve.py --port 8767` and open http://localhost:8767. Rebuild after changing scene modules.

The complete static site is in `dist/`. Node is used only to build optimized assets; production needs no Node server or runtime API. JavaScript, styles, Three.js, fonts, images, and map data are bundled locally. The preview disables caching for local edits.

## VPS hosting

Serve `dist/` with Caddy behind Cloudflare Tunnel. The intended public domain is `younesbenketira.com`, with `www` redirecting to the apex.

Release files belong under `/opt/younesbenketira-com/releases/<commit>/`. The `current` symlink selects the active release; retain the prior release for rollback. Import `deployment/portfolio.caddy` inside the existing Caddy port 8080 route, before its fallback 404. The existing listener handles response compression.

Cloudflare must route both hostnames to the public tunnel and its `http://127.0.0.1:8080` origin. DNS activation is separate from installing the site on the VPS. Do not change unrelated routes or mail records.

## Content and assets

Edit `dist/index.html` for portfolio copy. Styles live in `dist/*.css`; scene modules in `dist/*.js`. See `TEXTURES.md` for the generated limestone asset and `dist/data/SOURCES.html` for map attribution. Third-party licenses are retained with their assets.

The Mila Voice audio demo features GPT-Live as the simulated customer. The Midnight Inline player provides playback, pause, seeking, and mute in a compact charcoal-and-gold layout. Native controls remain available if JavaScript does not load. Audio loads only when requested; there is no autoplay.

## Loading and performance

The white loading screen reports weighted startup stages: scene code, mosque geometry, textures/font, and the first rendered mosque frame. City loading starts after the opening view is revealed and does not contribute to the loading percentage. The percentage is completed startup work, not a download-byte counter. Failures release the screen and keep the portfolio readable. The city fades in over 0.8 seconds when ready; reduced-motion visitors get an immediate reveal. A failed city download leaves the mosque usable.

`npm run build` produces hashed ES module bundles, a dedicated city geometry worker, WebP images, and the original font compressed losslessly to WOFF2. Original images and the font remain build inputs. The worker transfers typed geometry buffers instead of blocking the page while parsing and building the city. Shader compilation uses the same offscreen render target as the live scene.

### Measured results, October 14, 2026

Three cold-load Lighthouse 13.5.0 runs per version, mobile simulated throttling, Chromium 156.0.8078.4, headless SwiftShader. Both versions used the same localhost server with gzip, no-cache, and identical hardware. Baseline: commit `4e8fb5f`. Raw reports are in `benchmarks/2026-10-14/`.

| Metric (median) | Before | After |
| --- | ---: | ---: |
| Performance score | 35 | 67 |
| First contentful paint | 2.73 s | 1.59 s |
| Largest contentful paint | 11.42 s | 3.65 s |
| Speed index | 6.64 s | 3.95 s |
| Total blocking time | 5.07 s | 0.88 s |
| Transferred bytes (Lighthouse) | 6.61 MB | 2.53 MB |
| Layout shift | 0 | 0.000009 |

A separate alternating before/after check measured the actual `.scene-ready` state at 390 ? 844 with 4? CPU throttling, reduced motion, and unthrottled localhost network: median **3.37 s ? 2.11 s**, three runs per version. This guards against mistaking an earlier loader paint for a ready scene. Browser was shared across runs with fresh contexts, so GPU shader caching may affect these timings. Lighthouse runs used separate browser instances.

Lighthouse numbers are lab results, not field Core Web Vitals or real-device guarantees. Canvas content and workers have measurement limitations; the worker script transfer is underreported by Lighthouse. The mobile score remains below 90. Remaining costs include full city-data transfer and WebGL initialization. Lighting, bloom, geometry, and render resolution are preserved; the stone uses high-quality WebP compression.

Verified loader recovery for blocked bootstrap, scene bundle, worker, and texture; WebGL failure; no-JavaScript fallback; scrolling to contact; and no horizontal overflow at 320, 360, 390, 412, 768, 1024, 1280, 1440, and 1920 px. Custom agent-lint and `git diff --check` pass. Full shared quality validation is blocked by the existing stale affected path `dist/mila-preview.js`; it is not a passed gate. Hosting cache rules are prepared locally and have not been applied to production.

### Deferred city follow-up

The final version starts the city worker after `scene-complete`, so map data no longer competes with the opening view. City geometry is attached only after both opaque and fading shader variants are prepared. The fade also updates the ambient-occlusion mask, and every fade frame requests a render even when the camera is idle.

Three further Lighthouse runs under the same conditions all scored **71**. Median FCP: **1.59 s**; LCP: **3.586 s**; speed index: **3.142 s**; TBT: **0.728 s**; transfer: **2.534 MB**. The transfer total includes the later city download. Raw final reports: `benchmarks/2026-10-14/deferred-city/`.

Phone and desktop checks held the map request pending, confirmed the loader reached 100% and scrolling worked before releasing it, then verified city appearance. Further checks covered failed map requests and reduced-motion reveal. `scene-ready` now measures the usable mosque, `city-ready` the attached city, and `city-visible` the completed fade; these are intentionally separate milestones.

The final source-only custom lint and diff checks pass. Publication remains blocked: full quality validation still references obsolete generated files, and custom lint reports nested expressions in the generated minified vendor bundles. These are not recorded as passing checks or silently exempted.
