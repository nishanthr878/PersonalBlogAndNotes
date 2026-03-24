# Open Graph Protocol (OGP) Metadata Design

**Goal:** Ensure every page has correct Open Graph + Twitter Card metadata so links unfurl well on social platforms.

**Context:** This project is a Next.js App Router site that is statically exported (`next.config.ts` sets `output: 'export'` in production). The site already uses `SITE_URL` in build scripts that generate `public/sitemap.xml` and `public/rss.xml`.

## Requirements

- Use absolute URLs for `og:url` and images.
- Provide sensible global defaults (site title/description, site-level image).
- Allow per-page overrides for index pages.
- Generate per-entry metadata for dynamic content pages (blog/leetcode/projects detail pages).
- Work with static export (no runtime-only metadata generation).

## Approach (Recommended)

Use the Next.js Metadata API:

- Set global defaults in `web/src/app/layout.tsx` via `export const metadata`.
- Add per-page `export const metadata` for static routes.
- Add `export async function generateMetadata()` for `[slug]` routes to derive metadata from MDX frontmatter.

This keeps metadata colocated with routes, stays type-safe, and is compatible with static export.

## Canonical Base / Absolute URLs

- `metadataBase`: `https://personalblogandnotes.pages.dev`
- Environment variable: `SITE_URL=https://personalblogandnotes.pages.dev` (used by sitemap/RSS generation; also used as the single source of truth for absolute URLs)

All per-page URLs will be expressed as pathnames (e.g. `/blog/foo`) and resolved against `metadataBase`.

## Metadata Defaults

Global defaults (in the root layout):

- `title`: default + template (already present)
- `description`: already present
- `openGraph`:
  - `type: 'website'`
  - `siteName: 'Nishanth'`
  - `title`/`description`: match defaults
  - `url: '/'`
  - `images`: one default image
- `twitter`:
  - `card: 'summary_large_image'`
  - `title`/`description`: match defaults
  - `images`: same default image
- `alternates`:
  - `canonical`: base canonical for the site; detail pages override to their own permalink

## Per-Page Overrides

Static index pages should set:

- `title` and `description` tailored to the page
- `openGraph.url` to the page pathname

Dynamic detail pages (`/blog/[slug]`, `/leetcode/[slug]`, `/projects/[slug]`) should implement `generateMetadata()` that:

- Reads the entry by slug (same source used to render the page)
- Uses frontmatter to set `title`/`description`
- Sets `openGraph.url` to the canonical permalink
- Sets `openGraph.type`:
  - Blog: `'article'`
  - LeetCode/projects: `'website'`
- Optionally sets `openGraph.publishedTime` for blog posts based on `date`

## Default Social Image

Since there is no existing image, add a generated placeholder:

- File: `web/public/og.svg`
- Dimensions: 1200x630
- Content: simple brand card (site name + short tagline) in a high-contrast layout

Note: Some platforms do not render SVG previews consistently. If a platform fails to display it, we will replace it with a PNG at the same path (`web/public/og.png`) and update metadata accordingly.

## Validation / Acceptance Criteria

- Blog, LeetCode, projects, and static pages include `og:title`, `og:description`, `og:url`, and `og:image` with absolute URLs.
- Twitter card tags are present and match the OG values.
- Canonical URLs are correct for detail pages.
- Static export build succeeds.

Manual checks:

- Facebook Sharing Debugger
- LinkedIn Post Inspector
- X/Twitter card preview (or any unfurl tester)
