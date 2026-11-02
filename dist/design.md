# Younes Benketira — Site design guide

Theme reference for agents creating pages, illustrations, and other assets for
[younesbenketira.com](https://younesbenketira.com/).
This file describes the site's visual theme, not permission to change the site.

## Visual direction

The opening Scroll down link uses 18–22px responsive text at weight 600,
a larger arrow, and an ivory card with a bronze border, 16px corners, soft
shadow, and a minimum 56px target height. Keep its lower viewport
position and allow text to wrap on narrow screens. The desktop cue sits 88px
above the bottom edge; mobile keeps its 24px minimum safe-area-aware offset.
On desktop, after visitors scroll,
replace the cue with a bottom bar: Home, Experience, Project, Contact, Blog.
Blog is the last link in this bar rather than a top-right homepage button.
At 760px and below, do not show the bottom bar. Keep the initial Scroll down
cue and the Blog link in the contact card.

Contact links always show their labels below the icons. Order them Email,
LinkedIn, GitHub, Blog, X, YouTube in a three-column grid, or two columns at
760px and below. Desktop links have 12px gaps and 88px minimum height.
Mobile links use 10px gaps, 64px minimum height, 20px icons, and 13px labels.
Give the mobile grid 12px extra side padding and a 320px maximum width so
the buttons stay clear of the patterned border.
Contact hover feedback is immediate, with no color transition or movement.
Limit hover styling to hover-capable devices; retain visible keyboard focus.

Use warm ivory surfaces, charcoal text, and restrained bronze accents. Keep the
layout clear and quiet. The portfolio features a Three.js scene inspired by
Djamaa el Djazair; blog pages use a simple reading layout without the 3D scene.
The blog's spacing and article hierarchy take inspiration from Linear's blog.

## Palette

| Role | Color |
| --- | --- |
| Paper / blog background | `#f9f6ec` |
| Primary text | `#292620` |
| Secondary text | `#595348` |
| Bronze accent | `#785a2c` |
| Blog dividers | `#d9cdb7` |
| Illustration border | `#785a2c26` (bronze at 15% opacity) |
| Code block background | `#f0eadc` |
| Portfolio sky fallback | `#b4cddd` |

## Typography

- Body and section headings: `Arial, Helvetica, sans-serif`.
- Signature only: locally hosted **Great Vibes**, regular weight.
- Blog body: **17px**, **1.6 line height** (27.2px), **20px paragraph gaps**.
- Article title: locally hosted **Inter**, **48px**, weight **590**, line height
  **1**, letter spacing **-0.022em**, centered. At **640px and below**, use
  **32px** with **1.125** line height, matching Linear's article title metrics.
- Article subtitle: **17px**, line height **1.6**, muted text, centered below
  the title with a **24px** top gap. Preserve the supplied italic emphasis.
- Article section headings: **24px**, weight **600**, line height **1.35**.
- Article subheadings: **19px**, weight **600**, line height **1.4**.
- Code: `Consolas, monospace`, **14px**, line height **1.7**.

## Blog layout

- Main container: maximum **1280px**, with **48px side gutters** on desktop.
- Article title group: maximum **900px**. Subtitle and reading column:
  maximum **680px**.
- Main part headings (`h2`) are centered. Subsection headings (`h3`) and body
  text are left-aligned to distinguish parts from their sections.
- Article cover: maximum **960px**, wider than the reading column, square
  corners. Preserve the supplied cover's natural aspect ratio; the default
  cover ratio is **2:1**.
- Listing illustrations: **16:9** ratio, square corners.
- The cover opens in an image modal. Provide Close, Escape, and backdrop
  dismissal; without JavaScript, the cover link opens the image directly.
- Illustrations have a subtle **1px** bronze border.
- Index: three columns, **48px column gaps**, **72px row gaps**.
- Article cards have **16px padding**, **12px corner radius**, and no background
  or shadow highlight. The entire card links to its article.
- Blog pages have no top navigation bar. Articles have a compact All articles
  link and the shared footer.

## Responsive behavior

- Blog grid: two columns at **1100px and below**, one at **700px and below**.
- Blog side gutters: **20px** at **700px and below**.
- Article cover becomes **3:2** at **700px and below**.
- Portfolio work sections use cards at **760px and below**; desktop work
  sections retain open text layouts.

## Illustrations and interaction

Use illustrations, animation, and interactive examples to explain the article's
ideas. Match the warm palette and restrained borders. Keep reading and core
meaning available without JavaScript and with reduced motion.

Keep keyboard focus visible. Card arrows appear on hover or keyboard focus,
remain visible on touch devices, and do not shift the layout. Respect
`prefers-reduced-motion`.

The monitoring and full-system diagrams have a centered **Copy prompt** button
below their images, with a **16px** gap. Keep the buttons visible when JavaScript
is available. Copy build prompts with editable placeholders and the job JSON
format; show and announce copy success or failure. The goal-bound loop has no
copy prompt. Keep controls separate from the click-to-expand image link.
Use a **28px** minimum visible height, **12px / 16px** text at weight **500**,
**5px vertical / 10px horizontal** padding, and a **4px** radius. On devices
with a coarse pointer, extend the click area **8px** above and below for a
**44px** target without increasing the visible button size.

External article links use bronze underlined text and a visible external arrow.
Open them in a new tab with `rel="noopener"`, and include screen-reader text and
a tooltip stating that they lead to an external site and open in a new tab.

## Implementation references

- Blog styles: [/blog/blog.css](/blog/blog.css).
- Portfolio styles: [/style.css](/style.css), [/work.css](/work.css), and
  [/project.css](/project.css).
- Signature font: [/fonts/GreatVibes-Regular.woff2](/fonts/GreatVibes-Regular.woff2).

Keep this public guide aligned with the site's styles when theme decisions change.
