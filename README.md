# Younes Benketira

Personal portfolio with a Three.js scene inspired by Djamaa el Djazair, FlightHub experience, CoachDiff, and contact links.

## Local preview

Run `python scripts/serve.py --port 8767` and open http://localhost:8767.

The complete static site is in `dist/`. No Node build or runtime API is required. JavaScript, styles, Three.js, fonts, images, and map data are bundled locally. The preview disables caching for local edits.

## VPS hosting

Serve `dist/` with Caddy behind Cloudflare Tunnel. The intended public domain is `younesbenketira.com`, with `www` redirecting to the apex.

Release files belong under `/opt/younesbenketira-com/releases/<commit>/`. The `current` symlink selects the active release; retain the prior release for rollback. Import `deployment/portfolio.caddy` inside the existing Caddy port 8080 route, before its fallback 404. The existing listener handles response compression.

Cloudflare must route both hostnames to the public tunnel and its `http://127.0.0.1:8080` origin. DNS activation is separate from installing the site on the VPS. Do not change unrelated routes or mail records.

## Content and assets

Edit `dist/index.html` for portfolio copy. Styles live in `dist/*.css`; scene modules in `dist/*.js`. See `TEXTURES.md` for the generated limestone asset and `dist/data/SOURCES.html` for map attribution. Third-party licenses are retained with their assets.

The site has no video playback. The Mila Voice demo control remains disabled until a recording is provided.
