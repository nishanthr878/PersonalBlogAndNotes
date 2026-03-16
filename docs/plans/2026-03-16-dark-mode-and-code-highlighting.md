# Dark Mode + Code Highlighting Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dark-by-default theme toggle and IDE-like code syntax highlighting for MDX posts.

**Architecture:** Theme is driven by `data-theme` on `<html>` and CSS variables. A small inline script sets the theme before paint. MDX rendering uses a Shiki-based rehype plugin at build time.

**Tech Stack:** Next.js App Router, Tailwind (existing), CSS variables, `next-mdx-remote`, Shiki, `rehype-pretty-code`.

---

### Task 1: Add theme system (dark default)

**Files:**
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/globals.css`
- Modify: `web/src/components/Header.tsx`

**Step 1: Add early theme init script**

- In `web/src/app/layout.tsx`, set `<html data-theme="dark">` by default.
- Add an inline `<script>` that:
  - reads `localStorage.theme`
  - falls back to `dark`
  - sets `document.documentElement.dataset.theme`
  - sets `document.documentElement.style.colorScheme`

**Step 2: Define light overrides**

- In `web/src/app/globals.css`, keep dark tokens in `:root`.
- Add `html[data-theme='light']` token overrides.

**Step 3: Add Header toggle**

- In `web/src/components/Header.tsx`, add a button toggling `dark <-> light`.
- Persist to `localStorage` and update `document.documentElement.dataset.theme`.

**Step 4: Verify**

Run: `npm run dev --prefix web`
Expected: dark by default; toggle persists across refresh.

---

### Task 2: Add MDX code highlighting

**Files:**
- Modify: `web/package.json`
- Modify: `web/src/lib/content/mdx.tsx`
- Modify: `web/src/app/globals.css`

**Step 1: Add rehype plugin**

Run: `npm install --prefix web rehype-pretty-code`

**Step 2: Wire plugin into MDXRemote**

- In `web/src/lib/content/mdx.tsx`, dynamically import `rehype-pretty-code`.
- Add `mdxOptions.rehypePlugins`.

**Step 3: Style code blocks**

- Update `.mdx pre` / `.mdx code` styles to match an IDE-like block.

**Step 4: Verify**

Run: `npm run build --prefix web`
Expected: build succeeds; code blocks are syntax highlighted.

---

### Task 3: Commit + verify

**Step 1: Lint/build**

Run:

- `npm run lint --prefix web`
- `npm run build --prefix web`

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add dark mode and mdx code highlighting"
```
