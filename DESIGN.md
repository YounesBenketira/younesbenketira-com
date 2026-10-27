# Younes Benketira

The fixed Three.js canvas fills the viewport. The hero keeps X 151.4 degrees, Y -7.3 degrees and distance 310, with the prayer hall centered. Mouse movement adds at most 2.4 scene units horizontally and 1.3 vertically in the hero only. Motion eases toward the pointer and resets on leave or blur. Touch stays static; reduced motion also disables parallax.

A natural vertical page provides four chapters: introduction, FlightHub at the tower base, CoachDiff along the ascent, and contact at the crown. Chapter positions are measured from the DOM. The hero occupies 260svh to slow the approach without intercepting scrolling; its title and scroll cue remain within the first viewport. The camera rises 65 scene units and follows a polar arc around (-5, 0, -10), decreasing its azimuth from the hero to the base. This passes around the left side as seen from the opening camera, rather than crossing the roofs. The radius interpolates between the hero and base distances, with an extra 90 scene units at mid-orbit. A squared sine envelope eases that outward offset to zero at both endpoints. The flight looks toward the mosque at (-10, 12, -15), opens its field of view by up to 10 degrees, then descends at the tower base.

Tower chapter camera positions keep x=-17 and z=222 while y rises through 32, 96 and 148.65. The raised base pose looks level toward the minaret, with enough lateral separation to see the dome behind it. Every tower pose uses direction (48, 0, -330), focus distance 130 and a 48-degree field of view. The ascent therefore changes only height. A projection offset keeps the tower at 22% of viewport width beside project and career content. The projection offset remains fixed through the summit, so the tower stays at the left and the final view matches the ascent. The summit stops with the nearest roof corner 9.99% below the viewport top. The roof is at world height 173.05; camera height 148.65 preserves the level viewing direction and avoids any extra tilt. Camera positions interpolate with smoothstep, with a short hold at each content chapter. Reduced motion selects static camera poses instead of flying. No scroll events are intercepted.

The hero title is Younes Benketira in locally hosted Great Vibes. An ivory texture plane with a soft shadow and no border sits behind the minaret. A second pass uses GreaterDepth with warm bronze (#785a2c) and full opacity to show only the strokes hidden by geometry. Both planes fade together when leaving the hero. The semantic h1 stays available to assistive technology but is visually clipped before first paint when JavaScript is enabled. The canvas stays hidden until the font, signature, limestone and city assets finish and the complete scene has been framed and rendered. It then fades in over 450ms; reduced motion reveals it without a transition. This removes the temporary HTML-to-3D name switch and visible asset changes. WebGL failure or context loss restores the HTML fallback, which also remains visible without JavaScript. The old application header and walking interface remain removed. A small chapter navigator, a scroll cue, and a skip link support page navigation. The scene stays at the selected 9:15 AM without a visible time control.

Project and career content use cream surfaces and a soft right-side gradient. The gradient remains transparent until the project section top reaches 20% of viewport height (80% section coverage). It fades to full opacity as the section reaches the top, and reverses when scrolling back. CoachDiff's rounded card combines a real public replay still with an illustrative review panel, not a claim to be a complete product screenshot. It links to the real project. The FlightHub section includes only work, dates and technologies listed in the public portfolio. Contact contains the same email and profile links in an ivory card up to 760px wide, centered horizontally in the viewport. Its gold eight-point border follows the minaret lattice, with rounded corners and a soft shadow. It fades at a fixed viewport position during the final quarter-viewport of the ascent and reaches full opacity at the summit. Hidden contact links are inert. The last section uses dynamic viewport height so collapsing phone browser chrome cannot prevent reaching full opacity. The card sits lower on phones, and short screens can scroll inside its fixed frame. Without JavaScript or after WebGL failure it returns to normal document flow. On narrow screens the card remains centered with equal side margins, smaller headings and wrapping icon links. Short viewports allow the content to grow and scroll. Desktop project and career content is capped at 800px wide and centered inside the right-hand half, with a 50% left inset and a 4.5% right inset (at least 28px). Body copy uses a 60-character maximum line length; at 760px and below it moves beneath the visible tower. Content is allowed to grow and scroll on short screens. Body text uses the system sans-serif stack, headings use Georgia, and the existing cursive font accents the hero and contact title.

The three main zones are the domed prayer hall, an inner forecourt, and a second forecourt toward the minaret. A transverse covered arcade separates the courts. The model follows KSP Engel's published site plan, ground-floor plan, section, and exterior photographs. The minaret stands within the second forecourt at (-27, 140), clear of the side arcade. Its shared position also anchors the tower camera stops and title depth. An open beam-and-column entrance pergola stands beyond it; the mapped solid block previously closing this view is omitted. The earlier invented reflecting pools are removed.

The prayer hall has a 114-unit lower footprint, a broad terrace at height 14.9, and a recessed 94-unit upper volume reaching height 31.25. Its lower perimeter has deep arched portals, tall screened panels, and a separate band of narrow openings. The upper volume has six broad, recessed, downward-tapering trapezoids per face, with flat lower ends and sloped reveals. The central dome is retained. Gold vertical panels sit behind pale geometric ornament and eight broad dome ribs. The minaret has five screened sections separated by glass levels and a dark glazed crown. The floral columns have flared capitals. Dimensions, doors, and decorative patterns are approximations; the model is not a measured reconstruction.

Ivory stone, warm gold, and a blue sky form the scene palette. Page text uses warm charcoal (#292620), dark neutral secondary text (#595348), and bronze accents (#785a2c). The embedded CoachDiff preview retains its own brand palette. Directional sunlight gives the walls distinct lit and shaded faces. A generated environment provides metallic reflections. GTAO adds depth at surface junctions. A small HDR highlight glow and restrained saturation increase provide the requested effects. Repeated static geometry is instanced. Unchanged scenes do not render repeatedly.

The generated limestone image uses world-space triplanar sampling so scaled and instanced geometry share a consistent grain size. Mirrored repetition avoids abrupt texture borders. Sample intensity drives restrained bump and roughness variation; these are artistic material approximations, not calibrated physical scans. Courtyard paving includes antialiased joints. The image is generated with the built-in image tool; TEXTURES.md records the exact prompt. The existing procedural textures remain fallback materials.

References inspected on 2026-10-09:
- KSP Engel architecture, photographs, site plan, floor plan, and section: https://www.ksp-engel.com/en/projekte/grosse-moschee
- A direct exterior photograph from the 19 May 2026 visit, published 20 May 2026: https://news.detik.com/berita/d-8495995/menembus-langit-aljir-dari-masjid-terbesar-di-dataran-afrika
- Coverage published 10 August 2026 describing the gold dome and aerial views: https://www.tsa-algerie.com/la-grande-mosquee-dalger-vue-du-ciel-a-couper-le-souffle/
- Structural engineer's exterior photograph: https://www.kuk.de/aktuelles/artikel/iconic-award-2023-grosse-moschee-von-algier-in-der-kategorie-innovative-architecture-ausgezeichnet

These references were inspected, not embedded or redistributed. Google Maps satellite views were inspected for the surrounding-city update; no Google imagery or photogrammetry is embedded or redistributed. The mosque geometry and base textures are procedural; surrounding geometry follows mapped footprints; the limestone bitmap was generated with the built-in image tool. Three.js 0.180.0 and required addons remain bundled with their license.

Browser checks cover full viewport framing, desktop and portrait layouts, title occlusion, pointer direction and bounded movement, reduced motion, texture loading and runtime errors. Authored modules receive syntax and custom lint checks. Shared complete quality checks still have missing analyzers; publication remains blocked. The hosted site has not been updated.

Typography delivery guidance reviewed on 2026-10-09: https://web.dev/articles/font-best-practices. Great Vibes is hosted locally with its SIL Open Font License in dist/fonts/OFL.txt; source: https://github.com/google/fonts/tree/main/ofl/greatvibes. Three.js material reference: https://threejs.org/docs/pages/MeshStandardMaterial.html.

Portfolio sources inspected on 2026-10-09:
- CoachDiff product and public example: https://www.coachdiff.com and the local website/src/landing/App.tsx. The replay still is copied from website/public/media/ahri-dragon-setup-insight.webp into dist/images/coachdiff-replay.webp.
- FlightHub work and technologies: https://github.com/YounesBenketira/younesbenketira-com/blob/main/src/data/careerData.ts. The user asked for Full Stack Developer, so that title is retained instead of adopting the public file's Senior Full Stack Engineer label.
- Email and LinkedIn: https://github.com/YounesBenketira/younesbenketira-com/blob/main/src/data/socialsData.ts.
- Current GitHub profile: https://github.com/YounesBenketira.

Scoped validation covers each scroll chapter, representative phone/tablet/desktop sizes, the 760px breakpoint, short screens, text enlargement, reduced motion, anchor navigation, contact/project destinations, runtime errors and the two-color title. Full quality analysis remains incomplete because shared analyzers are missing; this is not publication clearance.


## Surrounding city update

The local `dist/data/algiers-context.json` snapshot contains 24,363 building footprints and 7,027 road/path features from OpenStreetMap, timestamped 2026-10-10T00:31:50Z. It includes building multipolygons and their courtyard holes, roads, the El Harrach river, the coast and marina, mapped green areas, and the campus boundary. Buildings in the custom mosque core are excluded to avoid double geometry. Mapped IDs remain in the derived data. Google Maps satellite views at 900m and 2200m were inspected; their individual imagery capture dates were unavailable. No claim of complete survey accuracy is made.

The geographic transform maps the prayer hall center (36.7346126, 3.14186175) to (0, -78) and the minaret center (36.7358016, 3.137990225) to (-48, 163). Its scale is 0.6643517132 scene units per meter. This is the original map registration. The October 10 photo-based correction places the detailed minaret at (-27, 140); the surrounding geographic data retains its original transform. Tower camera stops move with the minaret, preserving their relative framing. Of the rendered buildings, 833 have OSM height or level tags; the rest use documented building-type estimates. Windows and material colors are illustrative. Roads use mapped paths and tagged widths where present; otherwise widths and bridge elevations are estimates.

Mapzen Terrain Tiles from AWS provide the elevation grid (zoom 11, tiles 1041/798, 1041/799, 1042/798, 1042/799). Heights are decoded from Terrarium RGB, sampled over [36.68, 3.075, 36.80, 3.205], and transformed into a 129 by 129 scene grid. The campus is flattened and joins the measured terrain over 180 scene units. Buildings follow that ground. Sea level is tied to the same elevation datum. The coast remains geographically traced rather than a straight invented beach.

City geometry is batched into 650-unit spatial cells for culling and a small set of shared materials. Window textures are procedural. Tree crowns use instancing. A distance mask fades near-camera buildings during the hero so the existing low camera is not blocked by real neighboring structures. The mask retreats as the hero fades and is shared by the color and ambient-occlusion passes. City blocks do not cast shadow maps; the detailed mosque retains its shadows. The haze range now covers the surrounding districts rather than hiding them at 2,000 units. Existing scroll motion, content sizing, and reduced-motion behavior remain unchanged.

The page displays map attribution and links to `dist/data/SOURCES.html`, including the ODbL download and terrain attribution. `scripts/import-context.py <source-directory> <output-json>` reproduces the derived database from `algiers-osm.json`, `algiers-osm-extra.json`, `algiers-osm-relations.json`, and `algiers-terrain.json`. The original input exports are transient working files; the self-contained derived data is distributed under ODbL. Refresh queries use the bbox in the data metadata and Overpass `out tags geom` for ways, `out body geom` for building relations. These exports were retrieved from https://overpass-api.de/api/interpreter. Terrain source: https://registry.opendata.aws/terrain-tiles/.

## Photo-based architecture correction - 2026-10-10

The user supplied three exterior references and clarified that the design of the two hall levels was wrong. The lower terrace, facade recesses, screened openings, minaret placement, and open entrance pergola were revised from those images. The geometry remains an approximation, not a surveyed reconstruction. OSM building 1311601128 remains in the downloadable source database but is omitted from rendering because its generic solid extrusion closes the open approach behind the minaret. The source database has 24,363 footprints; 24,362 are rendered.

The facade facing the opening camera has a rectangular central portico, as clarified by the user. The lower building shell leaves a 32-unit-wide, 10-unit-deep vestibule clear. Six freestanding straight pillars support a flat ceiling; rectangular double doors sit at the back and on both side walls. The entrance has no arched wall or pointed openings. Full shared quality checks remain incomplete because analyzers are unavailable.

## Entrance doors and recessed facade - 2026-10-10

The user clarified that doors occupy all three walls inside the rectangular portico. The model now has five rear double doors and two on each side wall. Side doors face into the recess and use the same patterned bronze finish as the rear doors. This arrangement follows the user observation; an exact door schedule for this particular entrance was not found, so counts, dimensions, and ornament remain approximations. The front remains open between the pillars.

KSP Engel exterior photographs show broad tapered facade folds, rather than applied vertical bars. The model replaces the raised strips with six trapezoidal recesses on each upper face, wider at the top and ending in a flat lower edge. Each recess has a back plane 0.6 scene units inside the facade and sloped stone reveals. The wall is cut around these shapes, so shadows follow actual recessed geometry. The 94-unit exterior envelope is preserved; its hidden core is reduced to leave room for the recesses.

References inspected for this correction:
- Architect project, plans and exterior photographs: https://www.ksp-engel.com/en/projekte/grosse-moschee
- Mosque official architecture description, including stone folds and copper-clad exterior doors: https://eldjamaa.dz/%D8%A7%D9%84%D8%AC%D9%85%D8%A7%D9%84%D9%8A%D8%A7%D8%AA-%D9%88%D8%A7%D9%84%D8%B9%D9%85%D8%A7%D8%B1%D8%A9/
- Riad Salih door photograph, taken September 18, 2024: https://commons.wikimedia.org/wiki/File:Une_des_portes_de_Djamaa_el_Djaza%C3%AFr,_Alger_-_04.jpg

Reference images were inspected only, not embedded in the site. They support the forms and finishes, not a claim of measured reconstruction.

## Side entrances, daylight and minaret screens - 2026-10-10

The positive-X lower facade, on the left in the opening view, now has three thin black rectangular door surfaces instead of five projecting arched portals. The central portico retains its separate rear and side doors.

The original time slider supported a stylized daily cycle. The user later requested a fixed 9:15 AM, so scene startup uses 9.25. The user then approved removing the time control entirely. Sun direction, shadow map, light intensity, environment intensity, sky colors, haze and lamp emission are set once to that morning state. This is not an astronomical model. No requested nighttime entrance or dome glow was added after the user withdrew that request.

Ductal's project close-ups show dense connected concrete bands, broad eight-point openings and softened corners. The model replaces the sparse isolated spiky stars with twelve columns of connected rounded octagrams in each screen, using warm pale stone and actual extruded openings. Shared instanced geometry limits draw calls. The five screen sections and intervening glass levels are retained. Panel count, motif scale and the fine scroll and incised ornament remain approximations; the model does not reproduce fabrication drawings.

Reference photographs inspected, not embedded:
- Panel supplier and close-ups: https://www.ductal.com/en/great-mosque-algeria
- Architect's minaret description: https://www.ksp-engel.com/en/journal/das-minarett-als-hochhaus-der-superlative

The user's supplied street photograph and architectural rendering clarify the minaret: a broad white stone frame surrounds narrow projecting screens with dark openings. The earlier white backing made the screens read as applied linework and was incorrect. Each screen now has a dark recessed backing, a thin perimeter return and a dark-gold perforated face 1.1 units ahead of the wall. The screen width is 8.6 units and height is 23.2, matching the photograph's approximate 2.7:1 ratio. Five panels have centers 28.7 units apart. Blue glazed gaps are 5.5 units tall and match the screen width, with fine window mullions. The last panel ends at local height 140.2, leaving a short stone margin beneath the crown. Thin engraved geometric strips run within the broad side borders. The open surrounding colonnades are retained. Dimensions and ornament remain approximations, not surveyed measurements.

The two user-provided references were inspected locally: `AP24052551007502-1708930790.webp` and `architektur-visualisierung.jpg`. They are not embedded or redistributed.

## Sky and surface color separation

The visible sky remains blue with fuller white clouds. The surface-lighting map is baked from a separate sky mesh with its color converted to warm-neutral luminance. The visible sky's saturation therefore does not tint stone, grilles or shadows blue. Hemisphere light uses warm-neutral colors, and daytime distance haze is neutral. Sun direction and intensity stay fixed at 9:15 AM. The local preview helper disables browser caching to prevent stale material and sky modules after edits.

## Name readability and scroll glow

The opening glow masks the rendered mosque geometry on layer 1, including instanced details. Coverage and glow eligibility use separate color channels: floor coverage still blocks interior glow, while surfaces below world height 1.5 cannot emit the halo. Eligibility fades in by height 3. The same geometry supplies the depth texture, so no approximate envelope displaces the glow from the walls. Scene-depth comparison with a half-unit tolerance hides the halo behind foreground objects. Several soft sampling radii create the approved Smooth bloom falloff with no noise or hard rim. The opening opacity uses one minus smoothstep over scrollY zero to 20% of viewport height. Changes request a render even with a stationary camera; the pass is disabled only when opacity reaches zero.

Four independent blue glass materials brighten as the ascent reaches their world heights (28.65, 57.35, 86.05 and 114.75). Each transition spans 12 units below to 4 units above its band. The crown brightens from camera height 135 to 148.65, matching the lower summit stop. Emission is zero during the opening approach. During the existing base hold, its height rises smoothly from -4 to 32 while the camera stays at height 32. After that it follows camera height. The same base reveal applies to reduced-motion chapter poses. Scrolling back reverses the effects. There is no automatic pulse or change to daylight.

The grille ribbons and engraved stone borders on the positive-Z face, which faces the ascent camera, use separate warm-emissive materials. A world-height shader reveals their emission through an eight-unit transition around the current ascent height. The engraved borders use a black-background emission mask drawn from the same paths as their surface texture; only those lines emit light. Grille returns, solid walls and dark backing retain their original materials. At the summit, a second instance of the same halo pass masks only the dome and crown geometry on layer 2. It uses Smooth bloom with a gold color, depth-tested against the scene, so the dome has an outward halo as well as the crown. The old crown-only projected rim pass is removed. The crown emits gold at intensity 2.2 and the dome shell at intensity 2; both halo and material emission increase from camera height 135 to 148.65 and reverse with scrolling.

Fixed-morning comparisons with ambient occlusion, bump detail and warm light separately removed showed only local shading differences. They did not establish a global rendering fault. The glass previously used a metallic response (.45 on the bands, .32 on the crown); it now uses metalness zero, a bluer base color and reduced clearcoat. White stone and dark-gold grilles retain their materials and natural differences between lit and shaded faces.

Earlier browser checks confirmed the original first-pixel outline removal, reset at zero, ordered band illumination, crown illumination, fixed time, and reduced-motion behavior without runtime errors. The earlier 390-by-844 opening terrain obstruction was reproduced and later fixed in the portrait camera update below. Desktop screenshots were visually checked. Syntax and custom lint pass; complete shared analysis still has unavailable tools.

Screenshot comparisons allow one RGB level for observed render-target rounding differences. The actual-geometry mask replaces the offset solid envelope after the user reported air gaps at the side walls.


## Summit birds and contact buttons

Seven low-poly birds appear over the final 10% of the last camera transition. Their flight paths are placed 360 to 504 scene units away using camera projection, so they remain in the background and the minaret can occlude them. Wings flap and paths drift only while the summit is visible. Reduced-motion mode keeps the flock still. The scene requests animation renders only while visible birds move; leaving the summit hides them. The existing hidden-tab pause remains active.

Email, LinkedIn and GitHub use white icon links with charcoal SVGs, 56 pixels on desktop and 44 pixels on phones, accessible names, titles, keyboard focus indicators and the original destinations. The duplicate email address, back-to-top link, and "03 - A new perspective" label are removed; the email icon remains. Desktop and phone browser checks confirm the 10% top margin, fixed 9:15 AM lighting, bird movement and reduced-motion behavior, link dimensions and destinations, and no horizontal overflow or runtime errors.

The opening-glow comparison found visible glow around the minaret tip; floor emission is excluded. An opaque foreground test plane suppressed every outline pixel behind it, with zero changed pixels beyond the one-level rounding tolerance. Desktop and phone summit screenshots were visually reviewed.

The current browser checks confirm a continuous base reveal at both hold boundaries, reversible gold summit emission on desktop and phone, zero halo pixels from an isolated floor surface, and the previous immediate opening-glow removal. The fade now replaces that immediate removal. Foreground occlusion still suppresses every hidden halo pixel. The base, opening and summit screenshots were visually reviewed.


## Final bloom and controls

The user chose Smooth bloom. Both opening and summit passes now use its fixed radii (2, 6, 13, 22) and weights (.026, .018, .008, .003), with no noise, directional stretch, or hard edge. The time and style controls, their event bindings, the alternate presets, and storage reads are removed. Old mosque-glow-style storage values are ignored. The opening fade and outward gold crown/dome halos stay in place. Daylight stays at 9:15 AM.

The contact card uses an opaque #fffaf0 surface, charcoal primary text, neutral secondary text and bronze heading accents. Its contact destinations remain intact. The contact heading scales from 3rem to 4.5rem on desktop, and 2.35rem to 3rem on wider phones, with 1.85rem at 360px and below. Short screens can scroll to reach the full card; the camera and tower framing are unchanged.

Browser checks cover desktop, tablet, 390- and 320-pixel phones, and a short landscape viewport. The earlier right-aligned contact card cleared the projected crown in these views, with no horizontal or internal overflow. The user then requested a centered contact card; that alignment replaces the previous right-side placement. A separate reflow check passes 200% text with expanded text spacing, and confirms the back link remains reachable on short screens. The revised text colors measure 5.78:1 to 13.70:1 against the ivory surface. Old saved Off preferences do not override Smooth bloom; both controls are absent, time remains 9.25, and summit halos render without runtime errors. Syntax and custom lint pass; complete shared analysis still reports unavailable tools.

The user requested a softer replacement for black behind the minaret. Warm bronze (#785a2c) matches the page accent and the mosque's gold ornament. The color choice is a design judgment informed by W3C contrast guidance (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), not a prescribed universal color. The signature crosses variable stone, glass and grille backgrounds, so a flat-color contrast ratio is not a whole-image accessibility claim.

Current layout checks confirm exact horizontal contact-card centering at 1440, 1024 and 390 pixels, and a 20-pixel desktop shift for both project and career content without changing their widths. The desktop placement stays unchanged; the later mobile update below adds ivory reading cards. The bronze signature and centered contact card were visually checked in the rendered desktop scene with no runtime errors.

The contact card now contains only the larger heading and five icon links. The generic project invitation was removed for the recruiter-focused contact use. Desktop padding is 56px by 48px; current phone padding is 48px by 22px, changing to 44px by 24px at 360px and below. It stays centered, and the prior 20px project/career shift stays in place.

The simplified "Scroll to explore (down arrow)" cue has a fixed viewport position. It shares the opening glow's scroll-based fade over 20% of viewport height, with visibility hidden at zero opacity so it cannot intercept input or receive keyboard focus after leaving the opening. It reverses when scrolling back and does not use timed animation.

Focused browser checks confirm the cue stays at the same viewport Y position at every sampled scroll offset, fades through 0.5 halfway through its range, becomes hidden at the end, and returns at zero. The contact heading measures about 69px at desktop width and 38px on phones. Centering, three retained icon links, removed auxiliary content, and no horizontal overflow pass at desktop, phone and short-screen sizes, including enlarged text.

Delayed-font and delayed-city checks reproduced the remaining startup jump: the HTML title changed to the 3D signature while an incomplete scene was visible. The revised startup keeps both intermediate states hidden and reveals the finished scene once. Slow loading and refresh checks record zero frames with an exposed HTML title or an incomplete visible scene. WebGL context loss, startup failure and JavaScript-disabled checks retain the HTML fallback.


The scrollbar is a six-pixel white thumb over the scene, with no visible track or reserved gutter. A vertical range input handles dragging; its value and proportional thumb height follow native window scroll and document resizing. Page, arrow, Home and End keys retain scrolling behavior, as do normal wheel and touch scrolling. The no-JavaScript fallback keeps the browser scrollbar. A Chromium pixel check confirms white thumb pixels and unaltered scene pixels below it, with zero gutter; dragging, wheel, keyboard and phone-width overflow checks pass. Range orientation follows https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range.


## Contact and portrait update, 2026-10-10

The border asset copies the rounded outer and inner eight-point paths from minaret-screen.js, using radii .55/.421 and .505/.386. The 16px motifs use an expanded SVG viewBox that contains each complete star. Separate horizontal and vertical CSS backgrounds use space repeats: motifs never stretch or clip, and the side strips exclude the corners to avoid double painting. Contact opacity uses smoothstep over the last 25% of a viewport before the contact section; it reverses when leaving the summit and has no vertical translation. The 320-360px heading uses 1.85rem to avoid covering most of the crown. The removed invitation has no replacement copy; email, LinkedIn and GitHub destinations stay intact.

Portrait framing had multiplied the negative vertical camera offset with distance, clamping the camera to y=2.4 below the terrain. A smooth aspect-dependent clearance now raises it to y=34.4 on narrow portraits while preserving landscape framing. The opening context-clear radius grows with portrait viewing distance, keeping foreground mapped buildings out of the opening; mapped context returns during the ascent. Phone project/career cards use an ivory surface, smaller headings, larger body text and safe-area-aware navigation spacing.

DOM checks at 320x568, 360x800, 390x844, 412x915, 759/760/761x900, 768x1024, 1024x768, 1440x900 and 844x390 verify fixed contact position throughout its fade, hidden-link inertness, three retained destinations, reachable content and no horizontal overflow. The 390x568 check also passes 200% text with expanded spacing. Rendered 320px, 390px and desktop views were inspected. Delayed font/city loading and refresh still show no temporary title or partial scene. WebGL failure restores contact in document flow, and the heading remains available without JavaScript.

Startup now waits for all assets before its first main scene render. Camera framing is prepared without an intermediate draw, and the initial ResizeObserver delivery no longer repeats the same resize/render. The scene retains its single completed-scene reveal.

## Performance evidence, 2026-10-10

Measured http://localhost:8767 with Lighthouse 13.5.0 and Chromium 156.0.8078.4 on Windows. Command: `npm exec --yes --package=lighthouse@13.5.0 -- lighthouse http://localhost:8767 --only-categories=performance --output=json --output-path=<report.json> --chrome-flags="--headless" --quiet`, repeated three times after the startup repair. CHROME_PATH selected the installed full Chromium binary. Mobile settings: 412x823, device scale 1.75, simulated 150ms RTT / 1,638.4 Kbps throughput and 4x CPU slowdown. Raw reports are temporary local artifacts named mosque-lighthouse-final-1.json through -3.json; no production audit was run.

Scores were 26, 25 and 26 (median 26/100). Median LCP was 15.307 seconds; median TBT was 6,645 ms; CLS was 0 in all runs. Transfer was 12,184,710 bytes. This development server intentionally sends no-store and no content compression. LCP does not establish when a WebGL scene becomes useful, and Lighthouse TBT is a lab signal, not field INP.

A separate three-run 1440x900, DPR 1, unthrottled test on an RTX 4060 laptop GPU measured the completed-scene marker at 4.031, 4.419 and 4.071 seconds (median 4.071). A 60-frame scripted ascent averaged 63.4 fps, with a 150ms maximum interval. This is a short desktop test, not a sustained real-phone frame-rate claim. Software-rendered headless-shell results were excluded from hardware performance conclusions.

The scene contains about 4.83 million triangles across 276 mesh objects before view culling and repeated rendering passes. Main uncompressed assets: city JSON 6,334,602 bytes, stone PNG 3,126,740 bytes, Three.js core/module about 2 MB and font 457,588 bytes. Local gzip measurements reduce the city JSON to 1,617,664 bytes and all shipped JS from 2,185,725 to 449,127 bytes; compression is not enabled by this change. Priorities are compressed production delivery, a smaller stone texture/font, and lower distant-scene detail on phones. These require a further performance pass; no scenery or effects were removed to improve a score.

Targets reviewed from https://web.dev/articles/vitals: good field LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile. The current load is well outside that LCP target. No field data or real-phone benchmark is available. Three.js guidance on reducing geometry/draw overhead: https://threejs.org/manual/pages/optimize-lots-of-objects.html. Syntax and custom lint pass. Complete shared quality remains unavailable for Halstead and the unconfigured project adapters, so this is not publication clearance.


The contact heading now renders its cursive phrase as a block with .98 line height and a .16em gap below the first line, tightening wrapped words without reducing the approved desktop type size. Contact buttons use ivory fills, bronze icons and circular bronze outlines, with a bronze hover fill and visible keyboard focus. Desktop, 390px and 320px scene screenshots confirm consistent whole-star borders, tighter text and matching controls. The viewport/fade checks, short-screen link reachability and 200% text checks continue to pass.


The contact card now allows 760px on desktop so "something meaningful" fits one line at the existing type size. Five matching icon links include X (https://x.com/MuslimSoftware) and YouTube (https://www.youtube.com/@MuslimSoftware). Direct public pages returned the titles "Younes (@MuslimSoftware) / X" and "MuslimSoftware - YouTube" on 2026-10-10. Phone buttons retain 44px targets, with 6px gaps at 360px and below so all five fit one row at 320px. Checks verify the phrase stays on one line and all five links stay in one row at the normal type size across the existing viewport matrix; enlarged text remains allowed to wrap.


## Mobile framing and spacing revision, 2026-10-10

Narrow portrait views now blend toward a 178-degree opening yaw, a focus shifted 17.5 scene units along X, a focus raised 20 scene units, and a .72/aspect distance multiplier. The existing 34.4-unit portrait camera clearance remains. Landscape camera values stay unchanged. This places the dome beside the minaret within the phone frame. The portrait title uses cached two-row lettering for Younes and Benketira; its front/occluded maps switch together when rotating or resizing. Desktop and landscape keep the original single-row title.

At widths up to 760px, project and career frames have no gradient backdrop; their ivory cards remain. Contact is now vertically centered on phones, replacing its earlier bottom alignment. Equal safe-area-aware top/bottom padding and automatic margins preserve centering when it fits and keep oversized cards scrollable. Desktop card width is 800px with 56px/48px padding; phone padding is 48px/22px. At 360px and below, 44px/24px padding, 16px page gutters and 4px button gaps keep five 44px targets in one row clear of the border motifs.

Validation covers 320-1440px layouts, exact phone card centering, unchanged fixed position through the fade, no phone background wash, one-line contact phrase, five 44px buttons, and 200% text reflow. Rendered 320px/390px openings and contacts plus desktop were inspected; portrait/landscape rotation swaps both title maps together. Delayed-font/city startup, refresh and context-loss fallback checks pass with no runtime errors. Shared complete quality still has unavailable analyzers; these local checks do not establish publication clearance or real-phone performance.

The follow-up phone framing moves the opening camera 20% closer and raises its aim to reduce foreground paving. The full minaret and dome remain visible at 320-412px portrait widths. Mobile chapter navigation now sits at horizontal center with its existing safe-area-aware bottom offset; desktop navigation remains at the left.


## FlightHub-first portfolio, 2026-10-11

The first work chapter is now FlightHub; CoachDiff is second. DOM order, visible numbers, chapter links, skip link and opening scroll cue agree. Camera stops still follow DOM order and retain the existing minaret ascent. No additional project has been added.

The landing headline is AI Product Engineer. This describes the portfolio focus on building AI products; the FlightHub employment title remains Full Stack Developer. The user rejected the background badge. The role is now plain text drawn into the existing transparent name texture beneath the cursive lettering. Both front and occluded passes therefore share the same depth, ivory/bronze treatment, camera movement, visibility and scroll fade. No additional mesh or texture is needed. The HTML paragraph remains available to assistive technology and as the no-WebGL/no-JavaScript fallback, with no visible duplicate during the 3D experience. The two-row phone name and bronze occluded strokes remain unchanged.

FlightHub content uses the user's first-person employment profile and its October 9 corrections, not inferred achievements from a job description. Employment begins December 2022 and the confirmed title is Full Stack Developer. Published work covers search API integrations for a search engine handling millions of daily searches; ownership of email and SMS systems; a Cloudflare checkout screenshot service that removed approximately one minute of main-thread blocking and associated crashes; and contributions to Mila Voice agent UX, evaluations and monitoring. The uncertain 20% booking-completion recollection is omitted. AI agent work is explicitly a contribution, not sole ownership. The source profile remains private and is not bundled with the website.

The flight route/globe illustration is an original HTML/SVG explanation of the company's flight-search and booking service, not a product screenshot or an assertion that the user built the whole platform. Company context was checked against https://corporate.flighthub.com/ on October 11. Both the illustration and Visit FlightHub link open https://www.flighthub.com/. A teal inset distinguishes the company illustration within the existing ivory/bronze site.

Focused browser checks cover section/link order, navigation clicks, startup/refresh, role-line visibility and scroll fade, phone overflow, access to all career content, 200% text, and the retained contact-card fade/centering. Desktop and 320/390px scene screenshots were inspected. Shared complete quality remains limited by unavailable analyzers.

The role-line correction was checked at 320/390px and desktop sizes. The role texture has transparent background pixels; both depth-tested materials share it and retain the bronze occluded color. Scroll samples confirm matched opacity through fade-out and restoration. Delayed startup, refresh and WebGL-loss checks continue to pass.

The role line is positioned closer to the name at canvas Y=330 on desktop and Y=640 on portrait layouts, preserving name placement. The AI Product Engineer headline reflects the user's product-building focus, the saved applied-AI/agent/full-stack roles, and their documented AI-agent and CoachDiff work. It does not change their official employment title. Current employer terminology was checked against https://jobs.ashbyhq.com/speak/e91eb4bc-93bf-4e3a-b7c9-4a2f506df43f/ on October 11, 2026.


## FlightHub layout comparison, 2026-10-11

The user requested multiple variants for Experience & impact only, built around three outcome-led stories: checkout screenshots, email/SMS engines, and Mila Voice contributions. The earlier company banner, search integration paragraph and tags are replaced by these stories. The FlightHub link and official employment details remain. No other section or scene geometry changes.

Six layouts share one semantic content tree: Impact rows, Visual cards, Blueprint, Spotlight, Timeline, and Minimal. Impact rows is the default and preserves the requested metric-first format. Cards, Blueprint, Spotlight and Timeline add small original SVG diagrams; these are explanatory illustrations, not product screenshots. Checkout retains the approximately one-minute delay removed; the other stories use capability labels rather than invented metrics.

The temporary comparison control uses native radio buttons in a labelled fieldset inside FlightHub. All CSS is scoped to #career, and the independent module changes only its data-variant attribute and radio state. The browser stores the selected value in localStorage under portfolio-career-style, validates it against the available options, and falls back to Impact rows. Storage denial leaves switching functional. Without JavaScript, the selector stays hidden and all three default stories remain visible. Switching preserves the selector position in the viewport. Existing journey measurement responds to section-height changes.

Browser checks passed for all six styles at 320, 390, 1024 and 1440px, including 200% text and text-spacing overrides. Real-scene screenshots were inspected, with no runtime errors. Keyboard selection, saved preference, invalid preference, blocked storage, no-JavaScript fallback and switch anchoring passed. Syntax and custom lint are checked separately; shared complete quality still has unavailable analyzers and is not publication clearance.


The user selected Visual cards as the preferred layout. It is now the default, including the no-JavaScript fallback; the comparison control and existing saved choices remain available. Copy now emphasizes booking completion, company-wide email/SMS infrastructure with automatic SMS retries, and building customer-service voice agents. The user supplied the retries and communications scope in this conversation. The proposed 20% conversion lift needs its relative-versus-percentage-point definition confirmed; Mila's proposed 50% needs a verified scope and distinction between calls handled and inquiries resolved without human help. Neither percentage is displayed yet. No customer recording or audio sample is bundled.


The user finalized Visual cards and requested removal of the comparison switch. Only its styles remain in career.css; the variant script and controls are removed. Browser reproduction confirmed that a saved portfolio-career-style value restored an older layout even though the HTML default was cards and the server returned Cache-Control: no-store, max-age=0. The old key is no longer read. The renamed stylesheet and versioned preview URL also avoid reusing the previous asset/document URL; no unrelated browser data is cleared.


The user clarified the checkout result: booking success after customers had already clicked Book increased by 20%. The card now leads with "20% increase in booking success rate" and describes the Cloudflare service removing roughly one minute of browser blocking and associated crashes after that action. This supersedes the earlier conversion-rate interpretation. The percentage is a user-reported result; no baseline, experiment design or percentage-point claim is invented. Mila's statistic remains pending.


## FlightHub impact hierarchy revision, 2026-10-11

Research used the authors' live portfolios: [Brittany Chiang](https://brittanychiang.com/) for readable role/date grouping, [Jon Jordan's checkout case study](https://www.jonjordanixd.com/checkout-page-revenue-growth) for separating business impact and personal contribution, [Rauno Freiberg's craft gallery](https://rauno.me/craft) for visible work samples, and [Emil Kowalski's Sonner demo](https://sonner.emilkowal.ski/) for showing working behavior. Brittany and Jon's pages were also inspected in desktop screenshots. These are design references, not evidence about FlightHub or a ranking of hiring outcomes.

The selected card treatment remains. Booking success is now the featured full-width card with a larger 20% figure, its post-Book-click scope, ownership copy and a before/after capture comparison. The comparison uses the known minute of browser blocking and Cloudflare relocation, not an invented baseline chart or guaranteed booking outcome. Two supporting cards cover company-wide communications and Mila Voice; the email/SMS flow makes automatic SMS retries visible. The waveform is decorative and has no player or fabricated recording.

FlightHub itself links to the company with a visible external-link arrow and keyboard focus. The separate booking link is removed. Desktop role text is 1.0625rem, dates/location .9375rem, card body 1rem, headings 1.75rem, and the result 5-7rem. The company heading is reduced slightly to give the result stronger priority. On phones the role is 1rem and dates .875rem; all three cards stack. At 761-1100px the narrow desktop content column also stacks. No other section, camera or effect changes.

Real-scene desktop and phone screenshots were inspected. Browser checks passed at 320, 390, 844, 1024 and 1440px, including enlarged text, text-spacing overrides, one company link, keyboard focus, the exact 20% metric and no runtime errors. No new JavaScript, remote assets or animation were added.


The user clarified their current FlightHub scope: Solutions team, sole responsibility for Mila Voice, and close collaboration with the CEO and COO over the past 2-3 years on technical challenges across the company stack. A short paragraph beneath the employment metadata now explains that remit before the achievement cards. "Sole technical owner" describes current responsibility, not a claim that the user originally built the whole product alone. The official title stays Full Stack Developer.


The FlightHub header now uses the official app icon from its publisher listing, https://play.google.com/store/apps/details?id=com.flighthub.app (downloaded October 11, 2026), stored unchanged as images/flighthub-icon.png. The direct website SVG asset required a browser challenge, so the public app listing supplied the icon. The mark sits left of the linked company name, with an empty alt because the adjacent name labels the same link. The title period is removed. The section eyebrow and number are larger; dates and location are grouped with a divider and location pin. Copy now explicitly places the 2-3 years of company-wide work before Mila Voice ownership, as corrected by the user.


At the user's request, the displayed FlightHub icon now uses a white background. The original downloaded dark icon remains available; flighthub-icon-white.png is an imagegen-edited derivative for the header, not an official alternate asset. Logo placement and dimensions are unchanged.


## CoachDiff engineering story, 2026-10-11

The CoachDiff chapter now follows the chosen FlightHub hierarchy: larger numbered eyebrow, linked name without a period, logo on the left, plain role and short ownership description, one featured metric card, and two supporting visual cards. Only the name is underlined; its external arrow is not. The logo uses CoachDiff's own website favicon with its background rectangle changed to white. The scene, FlightHub chapter, navigation and contact behavior are unchanged. New styles are scoped to #project in project.css; no new JavaScript or animation is added.

The headline describes data engineering scale, not user adoption or a business outcome. On October 11, local saved player-game.json artifacts from three earlier games measured 6,056,958; 10,628,674; and 7,271,561 tokens. The newer ahri-combined-recall-stable-full-20260926 saved run measured 63,912,896 tokens. Its Riot gameDuration is 1,926 seconds (32:06), and its player-game.json is 449,937,117 bytes on disk. The displayed ~64M refers to that single example, not all games or one prompt.

Measurement uses tiktoken o200k_base.encode_ordinary over json.dumps(parsed_player_game, ensure_ascii=False, separators=(',', ':')). Removing indentation avoids inflating the headline with pretty-print whitespace. The same tokenizer applied to the prompt string of all 33 saved minute traces totals 7,088,442 tokens (range 43,025 to 309,117 per prompt). The comparison bars use 7,088,442 / 63,912,896 = 11.09%. The prompt total includes instructions and the carried ledger. It excludes separate matchup-plan and final-review calls. It is a comparison of uncompacted source representation with combined model-facing minute prompt text, not an isolated codec benchmark, a proof of no information loss, a billing estimate, or a claim of 89% API cost savings. Provider-reported input usage totals 7,534,931 tokens for those minute calls and is deliberately not conflated with the locally tokenized prompt strings. No raw games, traces, player identities, credentials or local absolute paths are bundled with the portfolio.

Code verification used coach-diff and the newer coachdiff-wave-stream checkout. coach_game_data.py creates minute-local periods; coach_frames.py builds compact_v7_participant_blocks_five_second_focus; coach_minions.py stores defaults, change forms and entity changes; coach_runner.py carries a factual ledger. The saved inputs actually identify compact_v7 and compact minion streams. Extraction cards describe existing Riot providers, minimap YOLO, HUD OCR/OpenCV and SAM screen-minion processing. Timestamp alignment, player-vision filtering, compact state changes and explicit uncertainty are the technical story. The saved run is a paced saved-evidence benchmark that reused HUD OCR, not a new live capture or proof of current production deployment. No pipelines or model calls were started for this portfolio work.

[Anthropic's context-engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) supports the terminology of context curation, compaction and structured memory. The portfolio names the actual implemented techniques instead of claiming a formal industry standard or optimal efficiency. This external article is context, not evidence for CoachDiff's measured numbers.

The retained Ahri replay still links to the matching public example at https://www.coachdiff.com/#example. Its 18:32-18:45 insight describes a successful Teleport and Water Dragon setup. The separate /coaching-session currently shows Urgot, so it is not the destination for this Ahri card.

Focused Chromium checks passed at 320, 390, 844, 1024 and 1440px, with normal text, 200% text and text-spacing overrides. Real-scene desktop and phone screenshots were inspected. Link labels, keyboard focus, title-only underlining, the displayed metric and absence of runtime errors were checked. HTML/CSS are outside the shared runtime-metric analyzers; their not-applicable result is not a whole-site quality or performance audit.

The shared publication validator also reports an uncaptured historical intro-glow-shader.js baseline. That file has no current Git diff and was not edited for this task. The explicit complete check scoped to this task's HTML/CSS reports not-applicable; no publication clearance is claimed. Custom lint and git diff --check passed.


## CoachDiff processing-cost emphasis, 2026-10-11

The user supplied a total processing cost of $3 per game and asked to connect it to the measured ~64M-token example. The featured card retains that source-data metric and now shows $3 total processing cost for the same 32-minute game. This is a user-reported cost, not inferred from tokenizer estimates or independently audited billing. The source-versus-33-prompts bars are removed to simplify the story. The earlier measurements remain documented above; the source data is preprocessed before model calls, so the card does not assert that 64M tokens were sent to one model request.

The ambiguous request to remove a line was interpreted as the technical token-estimate footnote after asking for clarification. That footnote is removed along with the comparison bars; the measured example remains scoped to one 32-minute game.


## Verified CoachDiff compression comparison, 2026-10-11

The user requested a direct relationship between the cost and workload, plus the compression algorithm's before/after token counts and a no-data-loss claim. The featured result now reads "$3 to process ~64 million tokens of replay data", scoped to the same 32-minute example. Cost remains user-reported. The two raw-versus-full-prompt bars are not restored.

The full preprocessing comparison is 63.9M source tokens to 6.9M prepared-data tokens. Its exact output count is 6,884,821: the sum of minified game_period payloads in all 33 saved minute input files, excluding matchup_plan and prior_insight_coverage. This excludes the separate ledger and prompt instructions. It still includes format/schema metadata, coverage and focus indexes. As before, counts use o200k_base, ensure_ascii=False and comma/colon separators. Full preprocessing removes some source metadata and is not labelled globally lossless.

A separate card identifies the actual lossless algorithm: minion_deltas_v2, implemented in coach_minions.py with coach_minion_fields.py and coach_minion_numbers.py. Original per-minute minion sample lists total 53,268,095 tokens; their archived compact representations total 4,075,274 tokens (92.35% smaller, displayed as 92%). The displayed comparison is 53.3M to 4.1M. These minion observations are a subset of the 63.9M-token source game; they are not two interchangeable measurements of the entire game.

Verification used the repository's existing decoding helpers from tests/test_coach_minions.py. For every saved minute, decoded minion_waves was compared with the corresponding original player-game.json minion_waves sample list using sorted-key JSON equality. All 33 periods and all 11,543 samples matched exactly, including numeric serialization, field values, source availability and timestamps. The temporary measurement script loaded only the existing decoder functions and their imports; it did not run unrelated tests, call a provider, change the CoachDiff repo or start a worker. The no-data-loss statement is scoped to this tested minion codec, not the broader filtering pipeline, extraction accuracy, or the raw video.

Focused real-scene Chromium checks passed at 320, 390, 844, 1024 and 1440px, with 200% text and text-spacing overrides. Desktop and phone screenshots were inspected. The cost, two comparisons, links, focus, title-only underline and absence of runtime errors were checked. Shared runtime checks remain not-applicable to the edited HTML/CSS; the earlier historical publication-validator limit remains unchanged.


## CoachDiff technology links and preprocessing bars, 2026-10-11

The user requested removal of the "From data to a decision" replay-example block, a bar comparison for full preprocessing, and linked technology names in place of the extraction explanation. The public replay card is removed from this chapter; its existing image asset is retained. The full preprocessing bars show 63.9M raw tokens versus 6.9M prepared-data tokens, with the shorter bar at 10.772% of the full bar based on the unrounded measurements. Text labels and values carry the meaning independently of color. The separately scoped lossless minion codec card is unchanged.

The technology card groups 18 official links: Python, TypeScript, React and Vite; OpenAI, OpenRouter, SAM 3.1, PyTorch and OpenCV; Riot API, FFmpeg, SQLite and Redis; Cloudflare and Caddy; Sentry, PostHog and OpenTelemetry. These reflect the inspected application dependencies, provider/extractor code, Redis cache implementation, telemetry code and deployment documentation. Redis is supported shared-cache infrastructure, not a claim that every runtime enables it. The user asked to exclude the minimap tooling, so the public card contains no minimap, YOLO or Ultralytics entry. This portfolio edit makes no change to CoachDiff processing and makes no legal assertion about the tools.

Links use official project sites or docs, open in a separate tab and retain keyboard focus. Focused browser checks passed at 320, 390, 844, 1024 and 1440px, including 200% text and text-spacing overrides. The checks covered all 18 links, the proportional bar, removal of the replay block and excluded tool names, and no scene runtime errors. A desktop screenshot was inspected. Custom lint and git diff --check passed; HTML/CSS remain outside the shared runtime-metric analyzers.


## Illustrated portfolio films, 2026-10-12

The user requested removal of all career/project cards and replacement with generated videos. Both achievement grids and their outer card backgrounds are removed. Company headers, links and employment metadata remain. Each chapter has an original silent 30-second illustrated MP4, native controls and a collapsible text alternative. Contact and the mosque scene are unchanged.

No video-generation model was connected. The builtin imagegen tool created two original ivory, teal and gold concept illustrations, then a local canvas renderer animated them with restrained movement, highlights, captions and a waveform. FFmpeg produced H.264 MP4s. Source artwork, exact prompts, storyboard and renderer live in assets/films; reproducible export instructions are in its README. These are conceptual explainers, not product recordings. No customer calls or private data were used.

FlightHub covers the earlier 2-3 years with the CEO/COO, the Cloudflare screenshot service and user-reported 20% booking-success gain after Book, company-wide email/SMS with retries, then current sole technical ownership of Mila Voice including experience, evaluations and monitoring. CoachDiff explains replay evidence, event/screen alignment, compact context and moment-linked advice. Its 63.9M-to-6.9M comparison and $3 cost remain scoped to the previously measured 32-minute example; cost is user-reported and full preprocessing is not labelled lossless. Excluded minimap tooling does not appear.

Desktop exports are 1280x1000 and portrait exports are 720x1000. Videos are about 29.93 seconds, 2.37-4.24 MiB each. Posters are about 107-170 KiB. Native controls start paused with preload=none; browser checks confirmed no MP4 requests before play. Offscreen videos pause. Viewport changes choose the matching version. No video animation runs until explicitly started, including for reduced-motion visitors.

The local Python preview now supports single HTTP byte ranges for MP4s. Without them Chromium reset seeking to zero despite successful playback. The fix returns 206 for valid ranges and 416 for unsatisfiable ranges. Ordinary static-file serving and no-cache headers remain.

Focused Chromium checks passed at 320, 390, 844, 1024 and 1440px with normal text, 200% text and text-spacing overrides. Both versions of both videos played and sought to 26 seconds. Offscreen pause, keyboard-accessible transcripts, removal of old card grids and absence of scene runtime errors were checked. Encoded frames and real-scene desktop/phone screenshots were inspected. These are local checks, not production or real-device performance measurements.

Shared complete JavaScript checks passed cyclomatic complexity, cognitive complexity and file size. Halstead analysis is unavailable due to a missing analyzer dependency; coverage, CRAP, mutation, dead-code, duplicates and types have no configured adapters. The historical publication baseline limitation remains. The Python preview has no configured shared analyzer adapter. Custom lint, syntax checks and MP4 range-response checks passed. No full quality/publication clearance is claimed.


## Code-rendered motion explainers, 2026-10-12

The user rejected the static illustrations with changing text and explicitly requested animation code rendered frame by frame into MP4. Both films now use original Canvas-drawn scenes. No external video-generation provider is required. The prior PNG artwork, prompts and storyboard are archived source history and are not loaded by the current renderer.

Each film is 42 seconds at 30 fps: 1,260 deterministic frames per export. Desktop is 1280x720; portrait is 720x1280 with independently positioned objects, metrics and paths. Playwright evaluates explicit timestamps and sends Canvas JPEG frames through an FFmpeg pipe. H.264/AAC output includes fast-start metadata. A quiet original soundtrack and timed cues are synthesized in code; there is no narration or customer audio. Current file sizes are approximately 4.09-5.05 MiB per video.

FlightHub animates the travel-service network, screenshot work moving out of the blocked browser, booking confirmation, company-wide email/SMS routes and retry recovery, then Mila Voice with alternating waveforms and experience/evaluation/monitoring nodes. Earlier company-wide work and current sole technical ownership remain distinct. The user-reported +20% still describes booking success after Book, not conversion rate.

CoachDiff animates an original stylized replay, tracking and observation extraction, aligned timestamps, data compaction and advice linked back to a replay moment. The illustrated player moves along a coached positioning path. These are conceptual interfaces and an illustrative game moment, not product screenshots or actual measured gameplay. The 63.9M-to-6.9M comparison remains before prompt instructions; $3 remains user-reported for the same single example. No minimap tooling is shown and the overall pipeline is not called lossless.

Short labels are attached to actions and objects. Screen text does not carry the whole film through changing paragraphs. The linked company headers and collapsible text alternatives remain. Video controls, pause when offscreen and preload=none are retained. Versioned media URLs prevent the old slide-based files being reused from cache. Page layout reserves the new aspect ratios before metadata loads.

Browser checks passed at 320, 390, 844, 1024 and 1440px, including 200% text and text-spacing overrides. Both variants of both films played and sought correctly, reported 42 seconds and the correct dimensions, and paused offscreen. No video requests occurred before play. Keyboard transcript access and scene runtime checks passed. FFmpeg decoded all 1,260 frames plus audio in every export without errors. Representative rendered frames and transitions were inspected. This does not constitute real-device or whole-site performance testing.

Custom lint and syntax checks passed. Scoped complete JavaScript analysis passed cyclomatic complexity, cognitive complexity and file size after splitting the compression drawing function. The existing missing Halstead dependency and missing project adapters remain unavailable; no full shared-quality or publication clearance is claimed.

The renderer uses a CPU-backed Canvas to avoid pixel differences when Chromium switches rendering paths after frame readback. Repeated timestamp exports were byte-identical for both films and aspect ratios. Frame comparisons excluding headings also confirmed moving image content in each of the four sequences.


## Videos removed, 2026-10-12

At the user's request, both video figures, their captions, the playback module, and the served MP4/poster files are removed. The linked headings, employment details, CoachDiff summary and collapsible text descriptions remain. Achievement cards remain removed. Shared text/layout styles are retained in work.css with work-details class names. The animation source is archived outside dist and is not loaded by the website.


## Mila Voice ownership highlight, 2026-10-13

Added the requested play icon on the left and a heading on the right: "Sole owner of the Mila Voice Customer Support AI Agent". The supporting copy reads "Mila Voice handles 60,000 calls per month, representing 88% of all service calls." A separate note says "Based on August 2026 figures." These figures were supplied by the user, who confirmed August 2026 as the reporting period. The user clarified that the 60,000 calls handled by Mila Voice constitute the 88% share of all service calls. This does not assert an autonomous resolution or containment rate.

The highlight is an open row, not a restored achievement card. The icon is decorative because no playback source was supplied; it has no fake button action. Videos remain removed. Existing company metadata and expandable descriptions are unchanged.


## Mila Voice role wording, 2026-10-13

The user clarified that they lead engineering while working with a QA/PM, and approved separating the product from the role. The highlight now reads "Customer Support AI Agent: Mila Voice", with "AI Product Engineer" beneath it. A description bullet reads "Lead engineering and continuous improvement for Mila Voice, partnering with a QA/PM." The expanded story uses the same responsibility wording. The August 2026 metrics and the official FlightHub employment title, Full Stack Developer, remain unchanged.


The user simplified the Mila highlight hierarchy: "Mila Voice" is the title and "Customer Support AI Agent" is the subtitle. The repeated AI Product Engineer role is removed from this highlight. Responsibility and call volume/share now form two bullets, followed by the August 2026 note. The landing role remains unchanged.

The reporting period now appears inline in the statistics bullet as "(August 2026 figures)". The separate date note is removed.


## Story sections removed, 2026-10-13

Removed both "Read the story" disclosures and their contents at the user's request. Mila Voice, company headers and metadata, and the CoachDiff summary remain. Removed unused disclosure styles. "Customer Communications Infrastructure" was proposed for the next SMS/email section; that new section is not yet added.


## Customer communications highlight, 2026-10-13

Added "Customer Communications Infrastructure" beneath Mila Voice, subtitled "Company-wide Email & SMS Engines". The three bullets describe scalable email rendering with reliable data retrieval, introducing customer SMS with the previously confirmed automatic retries, and 1.77 million emails plus 269,000 SMS messages sent through the user's APIs. Sent volume is not described as confirmed delivery. The user supplied these volumes and confirmed August 2026 as their reporting period. The volume bullet includes "(August 2026 figures)".

The new highlight shares Mila Voice's open icon-and-text layout, with a decorative email/message icon. Shared class names replace Mila-specific styling without changing its appearance. No cards, videos or story disclosures are restored.

The communications highlight now uses two bullets: one concise description of scalable email rendering, reliable data retrieval and introducing SMS with retries; one monthly volume statement. The user requested "per month" for the 1.77 million emails and 269,000 SMS messages, retaining the August 2026 reference.

The user removed the communications icon and circle. That highlight now uses a single full-width text column; the Mila Voice play icon remains unchanged.


## Exact Mila volume and communications reliability wording, 2026-10-13

The user supplied exact August 2026 counts: 58,946 Mila Voice calls and 7,949 non-Mila calls, totaling 66,895. The displayed share is 58,946 / 66,895 * 100 = 88.11719859%, rounded to 88.12%. The monthly count now displays 58,946. This remains a share of service calls, not an autonomous resolution rate.

The user asked to describe the value of queue/job infrastructure, including recovery and observability. The communications description now says "resilient, observable job processing" instead of "automatic retries". Email rendering and reliable data retrieval remain in the same concise bullet.

The user provided exact communications volumes for August 2026: 1,774,190 emails and 269,308 SMS messages. These replace the rounded numbers in the monthly volume bullet.

The user clarified that the Mila Voice volume and percentage refer specifically to inbound customer service calls. Both the count and percentage labels now use that wording, retaining the August 2026 reference.


## Horizontal Mila demo control, 2026-10-13

Removed the circular icon and left gutter from Mila Voice so its heading, subtitle and bullets align with the communications highlight. Added a compact ivory horizontal demo bar below the bullets, with a rectangular play control, label and decorative waveform. On narrow phones the waveform fits below the label within the bar. No recording source is available yet, so the control is disabled and clearly says "Recording not available"; it does not display fabricated duration or progress. The user was asked for an audio/demo URL. No removed videos are restored.


## Specific engineering scope and measured-month wording, 2026-10-13

Applied the user's supplied revision to the two FlightHub highlights. Mila Voice explicitly names evaluations, production monitoring and customer experience improvements alongside the QA/PM partnership. The communications description now states that the user designed and implemented FlightHub's email engine and SMS system, rather than describing only email rendering.

Both metrics bullets now use past tense and "in August 2026", not ongoing monthly rates. The exact counts and 88.12% share are unchanged. The previously clarified "inbound customer service calls" scope is retained for Mila. No new architecture, tooling, resolution, satisfaction or savings claims were added. The accepted headings, two-bullet structure and horizontal demo bar remain.


## CoachDiff technical achievement sections, 2026-10-13

Applied the user's supplied CoachDiff copy: the subtitle is "AI-powered League of Legends coaching", and the summary emphasizes over 60 million tokens of raw match telemetry. Three open text sections describe Multimodal Data Extraction, Context Engineering & Evaluation, and Long-Sequence AI Reasoning. No cards or videos were restored.

The new copy names YOLO champion detection, SAM 3.1, OpenCV HUD analysis and Riot APIs as expressly supplied in the latest request; this supersedes the earlier instruction to omit YOLO from this portfolio section. The eight-format / 67% result is user-supplied and scoped to a repeated benchmark, with targeted evaluations of decision identification. It is not presented as universal performance equivalence, a new measurement of the older full-game preprocessing comparison, or a billing reduction. No benchmark was rerun for this copy edit.

The reasoning description uses sequential minute-by-minute analysis and a persistent factual ledger, with structured output validation, checkpoint recovery and final synthesis. It does not describe overlapping frame windows. The company's existing links and the rest of the portfolio are unchanged.

The user replaced the model-specific extraction paragraph with: "Combined computer vision models, HUD analysis, and game APIs to extract player positions, ability usage, health, and minion observations from replay footage." This supersedes the earlier public model-name list. No model-training or custom-trained LLM claim is made.


## Responsive work cards, 2026-10-27

The desktop opening camera now uses a 34-degree field of view, easing to the existing 30-degree portrait view. The landscape signature spans 84% rather than 94% of the camera plane. This gives the opening scene and name more breathing room. Tower chapter camera poses remain unchanged.

Cards are mobile-only at 760px and below. FlightHub and CoachDiff have opaque ivory outer section cards, with a separate warm cream surface, border, and rounded corners for each highlight or achievement. Desktop retains open text sections without the new card surfaces, borders, rounded corners, padding, or shadows. On phones, the work card type scale uses `clamp(.75rem, 3.2vw, .9375rem)`; headings, copy, metadata, and demo labels use relative sizes. Padding and gaps follow that scale. Text remains in document flow and can extend vertically.


## Mobile hero contrast, 2026-10-27

The portrait signature uses white lettering with a dark warm glow and a subtle dark outline so it stays visible against clouds, sky, and stone. At the user's request, the mobile name fills more of the hero: the portrait font increases from 240 to 280 texture pixels and its plane spans 102% rather than 94% of the viewport, with the actual lettering capped inside the texture to keep side margins. The occluded pass retains the white portrait lettering and dark glow across the minaret. Desktop retains its ivory lettering and bronze occluded strokes. The HTML fallback uses larger white portrait text with a dark glow.


## Deployment exception, 2026-10-27

The user approved deploying the desktop framing, responsive work cards, and larger white mobile signature with dark glow without full agent quality validation. This exception applies only to this portfolio release. Build, syntax, custom lint, and diff checks passed; the full quality gate remains incomplete, with generated-bundle findings and missing or failing analyzers. This is not a passing quality result or a permanent rule change.


## Desktop hero glow, 2026-10-27

The desktop signature now uses the same dark warm glow as the approved mobile signature. Its ivory lettering, size, framing, and bronze occluded strokes remain. The HTML fallback uses the same shadow. This follows the approved landing-page work and the user's instruction to deploy these website changes without full quality validation; that waiver does not mark the incomplete gate as passed or change tooling policy.


## Portfolio visit analytics, 2026-10-27

PostHog uses a separate free organization and project 691928. The bundled browser SDK starts after document load, outside the scene startup path, and only on the public portfolio hostnames. It records one pageview per page load, pageleave, and bounded chapter, outbound-link, and audio engagement events. No session replay or automatic interaction capture is enabled. The integration does not change the visible page. Browser configuration comes from ignored `.env.local` values at build time.
