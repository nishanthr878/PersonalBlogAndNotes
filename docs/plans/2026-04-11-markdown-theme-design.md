# Markdown-Only Content + Theme Visibility Fix (Design)

Date: 2026-04-11

## Goals

- Drop MDX: content is authored and stored as plain Markdown (`.md`) files.
- Keep frontmatter: YAML frontmatter remains the source of metadata.
- Keep existing content kinds: `blog`, `leetcode`, `projects`.
- Fix theme visibility: text/background contrast remains correct in both light and dark themes.
- Preserve current UX: routes, metadata, RSS, sitemap, and code highlighting remain functional.

## Non-Goals

- Supporting JSX/components inside content (MDX).
- Allowing arbitrary raw HTML in Markdown by default.
- Major redesign of layout or navigation.

## Current State (Repo Findings)

- Next.js App Router site under `web/`.
- Content stored under `content/{blog,leetcode,projects}/*.mdx`.
- Rendering uses `next-mdx-remote/rsc` via `web/src/lib/content/mdx.tsx`.
- GitHub Markdown CSS is imported globally in `web/src/app/globals.css` and scoped via `article.mdx.markdown-body`.
- Theme is driven by `data-theme` on `<html>` and CSS variables in `web/src/app/globals.css`.
- Several UI pages use fixed Tailwind palette classes like `text-zinc-700`, `text-zinc-900`, `bg-zinc-100`, which do not adapt to theme tokens and can become low-contrast/invisible in dark mode.
- RSS and sitemap scripts currently enumerate `.mdx` only.

## Proposed Architecture

### Content Source Files

- New canonical extension: `.md`.
- Frontmatter stays YAML, parsed by `gray-matter` (already in use).
- During migration, optionally support both `.md` and `.mdx`:
  - Prefer `.md` when both exist for the same slug.
  - This allows a gradual conversion with no broken routes.

### Content Loading API

Update `web/src/lib/content/fs.ts` to:

- List slugs by scanning both `.md` (and optionally `.mdx` during transition).
- Read content source by resolving the correct file extension.
- Rename the API to avoid MDX-specific naming.

Suggested API:

- `listContentSlugs(kind)` -> returns slugs found in the kind directory.
- `readContentSource(kind, slug)` -> reads the resolved file (preferring `.md`).

`web/src/lib/content/collections.ts` continues to:

- Read source
- Parse frontmatter via `parseMdxByKind` (can be renamed later; function itself is generic for Markdown)
- Return `{ frontmatter, body }` where `body` is the Markdown body string.

### Markdown Rendering (No MDX)

Replace MDX rendering with a Markdown-to-HTML pipeline using unified so we can keep async syntax highlighting:

- `remark-parse` (parse Markdown)
- `remark-gfm` (tables/task lists/strikethrough)
- `remark-rehype` (to HTML AST)
- `rehype-pretty-code` (syntax highlighting; async)
- `rehype-stringify` (to HTML)

Expose:

- `web/src/lib/content/markdown.ts`: `renderMarkdownToHtml(markdown: string): Promise<string>`.

Page rendering updates:

- `web/src/app/blog/[slug]/page.tsx`
- `web/src/app/leetcode/[slug]/page.tsx`
- `web/src/app/projects/[slug]/page.tsx`

They will render:

- `<article className="content markdown-body ..." dangerouslySetInnerHTML={{ __html }} />`

Security posture:

- Do not enable raw HTML in Markdown by default.
- If later needed, add sanitization or an explicit allowlist.

### Markdown Styling

- Keep using `github-markdown-css` for baseline typography and element styling.
- Keep scoping to the article only (`.content.markdown-body`) so global styles do not bleed.
- Add a small CSS variable mapping so GitHub CSS variables (e.g. `--fgColor-default`, `--bgColor-default`) resolve to the site tokens, preventing white boxes / unreadable text.

### Theme Visibility Fix

Root cause:

- Non-token Tailwind palette utilities (`text-zinc-*`, `bg-zinc-*`, `border-zinc-*`) are hard-coded colors and do not change with `data-theme`.

Fix:

- Replace those fixed palette utilities with token-based utilities:
  - Text: `text-[color:var(--fg)]`, `text-[color:var(--muted)]`
  - Background: `bg-[color:var(--surface)]`, `bg-[color:var(--bg)]`
  - Borders: `border-[color:var(--border)]`
  - Accents/links: `text-[color:var(--accent)]`

Primary targets include:

- `web/src/app/page.tsx`
- `web/src/app/about/page.tsx`
- `web/src/app/blog/page.tsx`
- `web/src/app/blog/[slug]/page.tsx`
- `web/src/app/leetcode/page.tsx`
- `web/src/app/leetcode/[slug]/page.tsx`
- `web/src/app/projects/page.tsx`
- `web/src/app/projects/[slug]/page.tsx`
- `web/src/app/not-found.tsx`

### RSS + Sitemap

- Update `web/scripts/generate-rss.mjs` and `web/scripts/generate-sitemap.mjs` to include `.md`.
- During migration, optionally include both `.md` and `.mdx` with `.md` taking precedence.

## Success Criteria

- Content pages render from `.md` files.
- MDX is not required for any route.
- Syntax-highlighted code blocks still render correctly.
- Markdown tables/task lists render (GFM).
- Dark and light themes keep text readable across all pages (no `text-zinc-900` on dark background, etc.).
- RSS and sitemap generation include Markdown content.

## Rollout Plan (High-Level)

1. Add Markdown renderer and switch content pages to it.
2. Update FS/content indexing to support `.md` (and optionally `.mdx` temporarily).
3. Update RSS/sitemap scripts to include `.md`.
4. Replace fixed zinc palette classes with theme-token-based styling.
5. Convert content files from `.mdx` -> `.md` as a follow-up migration step.
