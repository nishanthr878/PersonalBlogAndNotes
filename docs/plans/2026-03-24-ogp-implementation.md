# Open Graph Protocol (OGP) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Open Graph + Twitter Card metadata across all pages (including dynamic `[slug]` routes) with correct absolute URLs for `https://personalblogandnotes.pages.dev`.

**Architecture:** Use Next.js App Router Metadata API. Define site-wide defaults in the root layout, add per-route overrides for static pages, and implement `generateMetadata()` on dynamic routes to derive tags from MDX frontmatter. Provide a default OG image as a static asset in `public/`.

**Tech Stack:** Next.js App Router, TypeScript, static export (`output: 'export'`), MDX content loaders, Cloudflare Pages env vars.

---

### Task 1: Add a single source of truth for site metadata

**Files:**
- Create: `web/src/lib/seo/site.ts`

**Step 1: Create `site.ts` with constants + helpers**

Create `web/src/lib/seo/site.ts` with:

- `siteUrl`: reads `process.env.SITE_URL` and falls back to `https://personalblogandnotes.pages.dev`; strips trailing `/`.
- `siteName`: `Nishanth`
- `defaultDescription`: `Personal tech blog, LeetCode logs, and projects.`
- `defaultOgImagePath`: `/og.svg`
- `absoluteUrl(pathname: string): URL`

Code:

```ts
export const siteUrl = (process.env.SITE_URL || 'https://personalblogandnotes.pages.dev').replace(/\/$/, '')
export const metadataBase = new URL(siteUrl)

export const siteName = 'Nishanth'
export const defaultDescription = 'Personal tech blog, LeetCode logs, and projects.'
export const defaultOgImagePath = '/og.svg'

export function absoluteUrl(pathname: string): URL {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(p, metadataBase)
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build --prefix web`

Expected: build succeeds.

**Step 3: Commit**

```bash
git add web/src/lib/seo/site.ts
git commit -m "add site seo constants"
```

---

### Task 2: Add global OGP/Twitter defaults in the root layout

**Files:**
- Modify: `web/src/app/layout.tsx`

**Step 1: Extend `metadata` with OGP/Twitter/canonical defaults**

In `web/src/app/layout.tsx`, import from `web/src/lib/seo/site.ts` and update `export const metadata`:

- Add `metadataBase`
- Keep existing `title` and `description`, but ensure `description` uses `defaultDescription`
- Add:
  - `openGraph: { type: 'website', siteName, title, description, url: '/', images: [{ url: '/og.svg', width: 1200, height: 630, alt: ... }] }`
  - `twitter: { card: 'summary_large_image', title, description, images: ['/og.svg'] }`
  - `alternates: { canonical: '/' }`

Use path strings for `images.url` so Next resolves them against `metadataBase`.

**Step 2: Verify build**

Run: `npm run build --prefix web`

Expected: build succeeds.

**Step 3: Commit**

```bash
git add web/src/app/layout.tsx
git commit -m "add global og and twitter metadata"
```

---

### Task 3: Add page-level metadata for static routes

**Files:**
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/about/page.tsx`
- Modify: `web/src/app/blog/page.tsx`
- Modify: `web/src/app/leetcode/page.tsx`
- Modify: `web/src/app/projects/page.tsx`

**Step 1: Add `export const metadata` to each static page**

For each file above:

- `import type { Metadata } from 'next'`
- `import { defaultDescription } from '@/lib/seo/site'` (or specific description per page)
- `export const metadata: Metadata = { title: '...', description: '...', openGraph: { url: '/route' } , alternates: { canonical: '/route' } }`

Suggested titles/descriptions:

- Home: `title: 'Nishanth'`, `description: defaultDescription`, `url: '/'`
- About: `title: 'About'`, `description: 'Background, experience, and links.'`, `url: '/about'`
- Blog: `title: 'Blog'`, `description: 'Short, practical notes on algorithms, systems, and building things.'`, `url: '/blog'`
- LeetCode: `title: 'LeetCode'`, `description: 'Solutions with approach notes, complexity, and final code.'`, `url: '/leetcode'`
- Projects: `title: 'Projects'`, `description: 'Selected work and experiments.'`, `url: '/projects'`

**Step 2: Verify build**

Run: `npm run build --prefix web`

Expected: build succeeds.

**Step 3: Commit**

```bash
git add web/src/app/page.tsx web/src/app/about/page.tsx web/src/app/blog/page.tsx web/src/app/leetcode/page.tsx web/src/app/projects/page.tsx
git commit -m "add per-page canonical and og urls"
```

---

### Task 4: Generate metadata for dynamic `[slug]` routes

**Files:**
- Modify: `web/src/app/blog/[slug]/page.tsx`
- Modify: `web/src/app/leetcode/[slug]/page.tsx`
- Modify: `web/src/app/projects/[slug]/page.tsx`

**Step 1: Implement `generateMetadata()` for blog posts**

In `web/src/app/blog/[slug]/page.tsx`, add:

- `import type { Metadata } from 'next'`
- `import { defaultDescription } from '@/lib/seo/site'`

Implement:

```ts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  const title = post.frontmatter.title
  const description = post.frontmatter.description || defaultDescription
  const url = `/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.frontmatter.date.toISOString(),
      images: [{ url: '/og.svg', width: 1200, height: 630, alt: `${title} - ${description}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.svg'],
    },
  }
}
```

**Step 2: Implement `generateMetadata()` for LeetCode posts**

In `web/src/app/leetcode/[slug]/page.tsx`:

- Title from `post.frontmatter.problem`
- Description from `post.frontmatter.description || defaultDescription`
- URL `/leetcode/${slug}`
- `openGraph.type: 'website'`

**Step 3: Implement `generateMetadata()` for project pages**

In `web/src/app/projects/[slug]/page.tsx`:

- Title from `project.frontmatter.title`
- Description from `project.frontmatter.description || defaultDescription`
- URL `/projects/${slug}`
- `openGraph.type: 'website'`

**Step 4: Verify build**

Run: `npm run build --prefix web`

Expected: build succeeds.

**Step 5: Quick artifact check (static export)**

After build, verify rendered HTML contains OG tags:

Run: `node -e "const fs=require('fs'); const html=fs.readFileSync('web/out/blog/index.html','utf8'); console.log(/og:title/.test(html), /twitter:card/.test(html));"`

Expected: prints `true true`.

**Step 6: Commit**

```bash
git add web/src/app/blog/[slug]/page.tsx web/src/app/leetcode/[slug]/page.tsx web/src/app/projects/[slug]/page.tsx
git commit -m "add og metadata for content pages"
```

---

### Task 5: Add a default OG image asset

**Files:**
- Create: `web/public/og.svg`

**Step 1: Add `og.svg` (1200x630)**

Create `web/public/og.svg` with a simple brand card:

- Background rectangle + subtle gradient
- Large `Nishanth`
- Subtitle: `Personal tech blog, LeetCode logs, and projects.`

Keep it simple and high contrast.

**Step 2: Verify build**

Run: `npm run build --prefix web`

Expected: build succeeds; `web/out/og.svg` exists.

**Step 3: Commit**

```bash
git add web/public/og.svg
git commit -m "add default og image"
```

---

### Task 6: Align sitemap/RSS base URL defaults with production

**Files:**
- Modify: `web/scripts/generate-sitemap.mjs`
- Modify: `web/scripts/generate-rss.mjs`

**Step 1: Update fallback `siteUrl`**

Change the fallback from `https://example.com` to `https://personalblogandnotes.pages.dev` in both scripts.

**Step 2: Verify build**

Run: `npm run build --prefix web`

Expected: build succeeds; `web/public/sitemap.xml` and `web/public/rss.xml` contain the correct domain.

**Step 3: Commit**

```bash
git add web/scripts/generate-sitemap.mjs web/scripts/generate-rss.mjs
git commit -m "use production site url for rss and sitemap"
```

---

### Task 7: End-to-end verification

**Step 1: Lint**

Run: `npm run lint --prefix web`

Expected: no errors.

**Step 2: Production build**

Run: `npm run build --prefix web`

Expected: build succeeds.

**Step 3: Manual unfurl checks (post-deploy)**

After deploying to Cloudflare Pages, test:

- Home: `https://personalblogandnotes.pages.dev/`
- Blog index: `https://personalblogandnotes.pages.dev/blog`
- A blog detail URL

Tools:

- Facebook Sharing Debugger
- LinkedIn Post Inspector

If the image does not render (common for SVG), replace `web/public/og.svg` with a PNG (`web/public/og.png`) and update metadata to use `/og.png`.
