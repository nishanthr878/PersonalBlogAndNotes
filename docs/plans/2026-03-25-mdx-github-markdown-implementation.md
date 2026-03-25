# MDX GitHub Markdown Styling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make MDX pages render with GitHub-like Markdown spacing + GFM features (tables/task lists) while matching the site's existing theme.

**Architecture:** Scope GitHub markdown CSS to MDX articles only (`article.mdx.markdown-body`). Add `remark-gfm` to the MDX pipeline for GitHub-flavored syntax. Layer small CSS overrides in `web/src/app/globals.css` so GitHub defaults inherit the site's tokens.

**Tech Stack:** Next.js App Router, `next-mdx-remote/rsc`, `github-markdown-css`, `remark-gfm`, existing `rehype-pretty-code`.

---

### Task 1: Add dependencies

**Files:**
- Modify: `web/package.json`

**Step 1: Install packages**

Run (from `web/`): `npm install github-markdown-css remark-gfm`

Expected: `package.json` + lockfile updated, install succeeds.

**Step 2: Verify packages exist**

Run (from `web/`): `npm ls github-markdown-css remark-gfm`

Expected: both are listed with resolved versions.

**Step 3: Commit (optional)**

Run:
```bash
git add web/package.json web/package-lock.json
git commit -m "chore: add github markdown css and remark-gfm"
```

---

### Task 2: Enable GFM syntax in MDX rendering

**Files:**
- Modify: `web/src/lib/content/mdx.tsx`

**Step 1: Update MDXRemote options to include remark-gfm**

Change the MDX options to include `remarkPlugins: [remarkGfm]` alongside the existing `rehypePlugins`.

Target shape:
```ts
import remarkGfm from 'remark-gfm'

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [/* existing rehype-pretty-code config */],
  },
} as unknown as RemoteOptions
```

**Step 2: Smoke-check with an existing MDX file**

Run (from `web/`): `npm run dev`

Expected: pages load; no server errors related to MDX plugins.

**Step 3: Commit (optional)**

Run:
```bash
git add web/src/lib/content/mdx.tsx
git commit -m "feat: enable github-flavored markdown in mdx"
```

---

### Task 3: Apply GitHub markdown body styles to MDX pages only

**Files:**
- Modify: `web/src/app/blog/[slug]/page.tsx`
- Modify: `web/src/app/leetcode/[slug]/page.tsx`
- Modify: `web/src/app/projects/[slug]/page.tsx`

**Step 1: Add `markdown-body` class to the MDX article wrapper**

Update the article wrapper in each file from:

`<article className="mdx mx-auto mt-10 max-w-3xl">...`

to:

`<article className="mdx markdown-body mx-auto mt-10 max-w-3xl">...`

**Step 2: Commit (optional)**

Run:
```bash
git add web/src/app/blog/[slug]/page.tsx web/src/app/leetcode/[slug]/page.tsx web/src/app/projects/[slug]/page.tsx
git commit -m "feat: scope github markdown styling to mdx pages"
```

---

### Task 4: Import GitHub markdown CSS and add theme-scoped overrides

**Files:**
- Modify: `web/src/app/globals.css`

**Step 1: Import the GitHub markdown stylesheet**

Add an import near the top (keep Tailwind import first):
```css
@import "tailwindcss";
@import "github-markdown-css/github-markdown.css";
```

**Step 2: Add scoped overrides under `.mdx.markdown-body`**

Add CSS overrides that:
- set `background: transparent` so the site gradient remains visible
- set `color` and link colors to match `--fg` / `--accent`
- map common GitHub vars (if present) to your tokens (keep it small + targeted)
- keep your existing `pre` look (radius/padding/border/background) by increasing specificity

Example override intent (exact selectors can be adjusted based on what wins in cascade):
```css
.mdx.markdown-body {
  background: transparent;
  color: var(--fg);
}

.mdx.markdown-body a {
  color: var(--accent);
}

.mdx.markdown-body pre {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 1px 0 var(--shadow);
}
```

**Step 3: Visual verification checklist**

Run (from `web/`): `npm run dev`

Check in browser:
- Blog post: `web/src/app/blog/[slug]/page.tsx` route
- LeetCode post: `web/src/app/leetcode/[slug]/page.tsx` route
- Project post: `web/src/app/projects/[slug]/page.tsx` route

Expected:
- noticeably better vertical rhythm (headings, paragraphs, lists)
- blockquotes + hr + tables look polished
- code blocks keep the current dark IDE feel
- no white backgrounds inside MDX content on either theme

**Step 4: Commit (optional)**

Run:
```bash
git add web/src/app/globals.css
git commit -m "style: apply github markdown styles with site theme overrides"
```

---

### Task 5: Build verification

**Files:**
- None

**Step 1: Lint**

Run (from `web/`): `npm run lint`

Expected: PASS (or fix lint errors introduced by the MDX plugin import).

**Step 2: Production build**

Run (from `web/`): `npm run build`

Expected: PASS; static export build completes; no MDX-related errors.
