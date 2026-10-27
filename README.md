# Younes Benketira

Personal portfolio with a Three.js scene inspired by Djamaa el Djazair, FlightHub experience, CoachDiff, and contact links.

## Local preview

Run `npm ci`, then `npm run build`. Start `python scripts/serve.py --port 8767` and open http://localhost:8767. Rebuild after changing scene modules.

The complete static site is in `dist/`. Node is used only to build optimized assets; production needs no Node server or runtime API. JavaScript, styles, Three.js, fonts, images, and map data are bundled locally. The preview disables caching for local edits.

## VPS hosting

Serve `dist/` with Caddy behind Cloudflare Tunnel. The intended public domain is `younesbenketira.com`, with `www` redirecting to the apex.

Release files belong under `/opt/younesbenketira-com/releases/<commit>/`. The `current` symlink selects the active release; retain the prior release for rollback. Import `deployment/portfolio.caddy` inside the existing Caddy port 8080 route, before its fallback 404. The existing listener handles response compression.

Cloudflare must route both hostnames to the public tunnel and its `http://127.0.0.1:8080` origin. DNS activation is separate from installing the site on the VPS. Do not change unrelated routes or mail records.

`/resume` and `/resume/` download `dist/Younes-Benketira-Resume.pdf` with an attachment header. To update the resume, replace that PDF and deploy it with `deployment/portfolio.caddy`.

## Content and assets

The blog index is at `/blog/`. Edit `dist/blog/index.html` for the article list and
`dist/blog/blog.css` for its shared reading layout. Each article is a directory
with its own `index.html`, so direct links work on both the preview and Caddy.
The list is empty until real articles are added. Sample articles and their assets
are excluded from the release.
Blog pages are plain HTML and need no 3D scene or JavaScript to read or navigate.

Edit `dist/index.html` for portfolio copy. Styles live in `dist/*.css`; scene modules in `dist/*.js`. See `TEXTURES.md` for the generated limestone asset and `dist/data/SOURCES.html` for map attribution. Third-party licenses are retained with their assets.

The Mila Voice audio demo features GPT-Live as the simulated customer. The Midnight Inline player provides playback, pause, seeking, and mute in a compact charcoal-and-gold layout. Native controls remain available if JavaScript does not load. Audio loads only when requested; there is no autoplay.

## Loading and performance

The white loading screen reports weighted startup stages: scene code, mosque geometry, textures/font, and the first rendered mosque frame. City loading is included in the loading percentage. The loading screen stays up until the city, mosque, and first complete rendered frame are ready. The percentage is completed startup work, not a download-byte counter. Failures release the screen and keep the portfolio readable. There is no city fade or background city insertion during scrolling. A failed city download releases the loader and leaves the mosque usable.

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

### Deferred city experiment (superseded)

The final version starts the city worker after `scene-complete`, so map data no longer competes with the opening view. City geometry is attached only after both opaque and fading shader variants are prepared. The fade also updates the ambient-occlusion mask, and every fade frame requests a render even when the camera is idle.

Three further Lighthouse runs under the same conditions all scored **71**. Median FCP: **1.59 s**; LCP: **3.586 s**; speed index: **3.142 s**; TBT: **0.728 s**; transfer: **2.534 MB**. The transfer total includes the later city download. Raw final reports: `benchmarks/2026-10-14/deferred-city/`.

Phone and desktop checks held the map request pending, confirmed the loader reached 100% and scrolling worked before releasing it, then verified city appearance. Further checks covered failed map requests and reduced-motion reveal. `scene-ready` now measures the usable mosque, `city-ready` the attached city, and `city-visible` the completed fade; these are intentionally separate milestones.

The final source-only custom lint and diff checks pass. Publication remains blocked: full quality validation still references obsolete generated files, and custom lint reports nested expressions in the generated minified vendor bundles. These are not recorded as passing checks or silently exempted.

### Restore complete-scene loading and prevent stale styles

The deferred-city experiment was reverted at the user's request. The city worker starts alongside mosque initialization, and the loading screen stays visible through city construction and shader preparation. The loading percentage includes city work again. There is no deferred city fade during scrolling.

Production served the unversioned stylesheet with `Cache-Control: max-age=14400`, allowing a returning browser to retain a stylesheet from before the loader existed. The build now combines styles under a content-hashed URL, and embeds the small loading styles into the HTML. CSS image and font paths are rebased for the bundle directory. This avoids relying on a manual hard refresh for new styles. A fresh-production visit already showed the loader; the cached-styles explanation applies to returning visits, not every browser.

Verified on 390px and 1440px viewports: held the city request pending and confirmed the white loader remains visible; after release, `city-ready` precedes `scene-ready` and the percentage reaches 100%. Scrolling starts only with the full scene attached. The existing camera path and chapter pacing are unchanged.

Final complete-scene Lighthouse runs: 67, 69, 69 (median **69**). Median FCP **1.503 s**, LCP **3.507 s**, TBT **0.850 s**; transfer **2.531 MB**. Reports are in `benchmarks/2026-10-14/complete-scene/`. A 4,500px constant-speed scroll gesture after loading had no frame gaps above 100ms at either 390px or 1440px width in the lab browser. This does not establish frame pacing on every real device.


## Portfolio analytics

PostHog Web Analytics uses a separate free organization, **Younes Benketira Portfolio**, and project `691928`. Open https://us.posthog.com/project/691928/web to see visits, unique visitors, referrers, campaigns, countries, and devices. CoachDiff data remains in its own organization. The free allowance is 1 million analytics events per month; no payment method was added.

Copy `.env.example` to `.env.local` and set the project's browser capture key as `POSTHOG_PROJECT_KEY`, and its exact regional ingestion origin as `POSTHOG_API_HOST`. `npm run build` reads that ignored file. The capture key is public browser configuration, not a personal API key. Do not put personal API keys in the website or repository. Both fields must be configured together. Without both, analytics stays disabled. The generated release bundles contain the public capture key; keep the configuration file for future builds.

The SDK is bundled locally and starts after the document load event, outside the 3D startup and error handling. Capture is restricted to `younesbenketira.com` and `www.younesbenketira.com`, so local previews do not pollute production data. A page view is sent once per page load; chapter/hash navigation does not create duplicate page views. PostHog captures pageleave for engagement. Custom events are `portfolio_chapter_reached` (each chapter once per visit), `portfolio_link_clicked` (a fixed destination label), and `portfolio_demo_played` (once per visit). URLs omit query strings and fragments, referrers retain only their origin, and string properties are bounded. Standard campaign fields remain available. Anonymous IDs persist in first-party local storage and cookies; there is no account identification or fingerprinting.

Session replay, automatic click capture, heatmaps, surveys, feature flags, and error tracking are disabled. This integration adds PostHog, not CoachDiff's separate Google Analytics setup. Run `node --test scripts/test-analytics.mjs` for focused tracking checks.
