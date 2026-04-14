# Markdown-Only Content + Theme Visibility Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace MDX with Markdown (`.md`) content rendering and fix light/dark theme contrast so content is readable everywhere.

**Architecture:** Load `.md` content (YAML frontmatter + Markdown body) from `content/`, render Markdown to HTML server-side via unified + remark/rehype (with async `rehype-pretty-code`), and scope GitHub Markdown styles to the article while mapping GitHub variables to site tokens. Replace hard-coded Tailwind zinc colors in pages with theme-token-based colors.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind v4, unified/remark/rehype, `remark-gfm`, `rehype-pretty-code`, `github-markdown-css`, `gray-matter`.

---

### Task 1: Add Markdown renderer (Markdown -> HTML)

**Files:**
- Create: `web/src/lib/content/markdown.ts`

**Step 1: Install dependencies**

Run:
- `npm --prefix web i unified remark-parse remark-rehype rehype-stringify`

Expected: packages added to `web/package.json` and lockfile.

**Step 2: Implement `renderMarkdownToHtml`**

Create `web/src/lib/content/markdown.ts`:

```ts
import 'server-only'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const { rehypePrettyCode } = await import('rehype-pretty-code')

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    // Do not allow raw HTML in Markdown by default.
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false })
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
```

**Step 3: Verify build still works**

Run:
- `npm --prefix web run build`

Expected: build succeeds.

**Step 4: Commit**

```bash
git add web/package.json web/package-lock.json web/src/lib/content/markdown.ts
git commit -m "feat: add markdown-to-html renderer"
```

### Task 2: Support `.md` files in content filesystem utilities

**Files:**
- Modify: `web/src/lib/content/fs.ts`

**Step 1: Expand slug discovery to include `.md`**

Update `listContentSlugs` to accept `.md` (and optionally `.mdx` during migration). A simple approach:

- Prefer `.md` when both exist for same slug.
- Keep `.mdx` support temporarily so existing content doesn’t break while you migrate.

Example logic (inline inside `listContentSlugs`):

```ts
const slugs = new Map<string, string>()
for (const entry of entries) {
  if (!entry.isFile()) continue
  const name = entry.name
  const isMd = name.endsWith('.md')
  const isMdx = name.endsWith('.mdx')
  if (!isMd && !isMdx) continue
  const slug = name.replace(/\.(md|mdx)$/, '')
  const ext = isMd ? 'md' : 'mdx'
  const existing = slugs.get(slug)
  if (!existing || existing === 'mdx' && ext === 'md') slugs.set(slug, ext)
}
return [...slugs.keys()].sort((a, b) => a.localeCompare(b))
```

**Step 2: Replace `readContentMdx` with a generic reader**

Rename and implement:

```ts
export async function readContentSource(kind: ContentKind, slug: ContentSlug): Promise<string> {
  const base = path.join(getContentKindDir(kind), slug)
  const md = `${base}.md`
  const mdx = `${base}.mdx`
  const filePath = fsSync.existsSync(md) ? md : mdx
  return await fs.readFile(filePath, 'utf-8')
}
```

Update exports accordingly.

**Step 3: Update imports/usages**

Update `web/src/lib/content/collections.ts` to import `readContentSource` instead of `readContentMdx`.

**Step 4: Verify build**

Run:
- `npm --prefix web run build`

Expected: build succeeds (still reading `.mdx` until migration is done).

**Step 5: Commit**

```bash
git add web/src/lib/content/fs.ts web/src/lib/content/collections.ts
git commit -m "feat: support md content sources"
```

### Task 3: Switch content pages from MDX rendering to Markdown HTML

**Files:**
- Modify: `web/src/app/blog/[slug]/page.tsx`
- Modify: `web/src/app/leetcode/[slug]/page.tsx`
- Modify: `web/src/app/projects/[slug]/page.tsx`
- (Optional cleanup later) Delete: `web/src/lib/content/mdx.tsx`

**Step 1: Replace `renderMdx` with `renderMarkdownToHtml`**

In each `[slug]/page.tsx`:

- Replace `import { renderMdx } from '@/lib/content/mdx'` with `import { renderMarkdownToHtml } from '@/lib/content/markdown'`.
- Replace `const content = await renderMdx(post.body)` with `const html = await renderMarkdownToHtml(post.body)`.

**Step 2: Render HTML string**

Replace article body:

```tsx
<article
  className="content markdown-body mx-auto mt-10 max-w-3xl"
  dangerouslySetInnerHTML={{ __html: html }}
/>
```

**Step 3: Verify locally**

Run:
- `npm --prefix web run dev`

Manual checks:
- Visit a blog post route and confirm Markdown renders.
- Confirm code blocks are highlighted.
- Confirm tables/task lists render if present.

**Step 4: Verify build**

Run:
- `npm --prefix web run build`

**Step 5: Commit**

```bash
git add web/src/app/blog/[slug]/page.tsx web/src/app/leetcode/[slug]/page.tsx web/src/app/projects/[slug]/page.tsx
git commit -m "feat: render content pages from markdown html"
```

### Task 4: Fix theme visibility by removing fixed zinc colors from UI pages

**Files:**
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/about/page.tsx`
- Modify: `web/src/app/blog/page.tsx`
- Modify: `web/src/app/blog/[slug]/page.tsx`
- Modify: `web/src/app/leetcode/page.tsx`
- Modify: `web/src/app/leetcode/[slug]/page.tsx`
- Modify: `web/src/app/projects/page.tsx`
- Modify: `web/src/app/projects/[slug]/page.tsx`
- Modify: `web/src/app/not-found.tsx`

**Step 1: Replace text colors**

Replace patterns:
- `text-zinc-900` -> `text-[color:var(--fg)]`
- `text-zinc-700` / `text-zinc-600` / `text-zinc-500` -> `text-[color:var(--muted)]` (or keep stronger text as `--fg`)

Examples:

```tsx
<p className="mt-3 text-[color:var(--muted)]">...</p>
```

**Step 2: Replace chip backgrounds/borders**

Replace:
- `bg-zinc-100` -> `bg-[color:var(--surface)]`
- `text-zinc-700` inside chips -> `text-[color:var(--fg)]`

Example:

```tsx
<span className="rounded-full bg-[color:var(--surface)] px-2.5 py-1 text-xs font-medium text-[color:var(--fg)]">...</span>
```

**Step 3: Fix link colors inside content headers**

Replace:
- `text-zinc-900` links -> `text-[color:var(--fg)]`

Example:

```tsx
<a className="text-sm font-medium text-[color:var(--fg)] hover:underline" ...>View on LeetCode</a>
```

**Step 4: Verify manually**

Run:
- `npm --prefix web run dev`

Manual checks:
- Toggle theme using header.
- Confirm all headings/descriptions/chips remain readable in both themes.

**Step 5: Commit**

```bash
git add web/src/app/page.tsx web/src/app/about/page.tsx web/src/app/blog/page.tsx web/src/app/blog/[slug]/page.tsx web/src/app/leetcode/page.tsx web/src/app/leetcode/[slug]/page.tsx web/src/app/projects/page.tsx web/src/app/projects/[slug]/page.tsx web/src/app/not-found.tsx
git commit -m "fix: use theme tokens for page text and chips"
```

### Task 5: Ensure GitHub Markdown CSS matches site theme tokens

**Files:**
- Modify: `web/src/app/globals.css`

**Step 1: Scope variable mapping to `.content.markdown-body`**

Add token mappings so GitHub CSS variables resolve to site variables (prevents white backgrounds or mismatched text):

```css
.content.markdown-body {
  --fgColor-default: var(--fg);
  --fgColor-muted: var(--muted);
  --fgColor-accent: var(--accent);
  --bgColor-default: transparent;
  --bgColor-muted: color-mix(in oklab, var(--surface) 85%, transparent);
  --borderColor-default: var(--border);
  --borderColor-muted: var(--border);
}
```

Keep existing code block overrides, but prefer scoping them under `.content.markdown-body` instead of `.mdx`.

**Step 2: Verify in both themes**

Manual checks:
- Tables, blockquotes, inline code, and separators have correct contrast.

**Step 3: Commit**

```bash
git add web/src/app/globals.css
git commit -m "style: align github markdown tokens with site theme"
```

### Task 6: Update RSS and sitemap scripts to include `.md`

**Files:**
- Modify: `web/scripts/generate-rss.mjs`
- Modify: `web/scripts/generate-sitemap.mjs`

**Step 1: Include `.md` (and `.mdx` during migration)**

Update file checks:
- RSS: accept `.md` and `.mdx`; prefer `.md` if both exist.
- Sitemap: same slug enumeration behavior.

Implementation hint:
- Build a slug set where `.md` wins over `.mdx`.

**Step 2: Verify build**

Run:
- `npm --prefix web run build`

Expected:
- `web/public/rss.xml` generated.
- `web/public/sitemap.xml` generated.

**Step 3: Commit**

```bash
git add web/scripts/generate-rss.mjs web/scripts/generate-sitemap.mjs
git commit -m "feat: include markdown content in rss and sitemap"
```

### Task 7: Migrate content files from `.mdx` to `.md`

**Files:**
- Modify: `content/blog/*.mdx` -> rename to `.md`
- Modify: `content/leetcode/*.mdx` -> rename to `.md`
- Modify: `content/projects/*.mdx` -> rename to `.md`

**Step 1: Identify MDX-only posts**

Search for JSX usage (MDX components). If any exist, convert them to pure Markdown equivalents or remove.

**Step 2: Rename files**

Rename each file to `.md` keeping the same slug.

**Step 3: Build + manual spot check**

Run:
- `npm --prefix web run build`

Manual:
- Visit a few representative posts from each kind.

**Step 4: Commit**

```bash
git add content
git commit -m "chore: migrate content from mdx to md"
```

### Task 8: Remove MDX-only code and enforce `.md` only (cleanup)

**Files:**
- Modify: `web/src/lib/content/fs.ts`
- Delete: `web/src/lib/content/mdx.tsx`
- Modify: `web/README.md` (and repo `README.md` if it mentions MDX)

**Step 1: Drop `.mdx` fallback**

Update `listContentSlugs` and `readContentSource` to only accept `.md`.

**Step 2: Delete unused MDX renderer**

Remove `web/src/lib/content/mdx.tsx` once no code imports it.

**Step 3: Update docs**

Update instructions to create `content/<kind>/<slug>.md`.

**Step 4: Verify**

Run:
- `npm --prefix web run lint`
- `npm --prefix web run build`

**Step 5: Commit**

```bash
git add web/src/lib/content/fs.ts web/README.md README.md
git rm web/src/lib/content/mdx.tsx
git commit -m "chore: remove mdx pipeline and document markdown workflow"
```
