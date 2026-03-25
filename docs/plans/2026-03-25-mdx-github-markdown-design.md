## Goal

Improve MDX content rendering so it feels closer to GitHub-flavored Markdown (spacing, typography, tables, blockquotes, task lists) while still matching the site's dark-first theme.

## Current State

- MDX is rendered via `next-mdx-remote/rsc`.
- Code blocks are highlighted with `rehype-pretty-code` (theme: `github-dark-dimmed`).
- MDX pages wrap content in `article` with class `mdx` and rely on custom CSS in `web/src/app/globals.css`.

## Proposed Approach (Recommended)

### 1) GitHub-like styling via CSS

- Add dependency: `github-markdown-css`.
- Apply GitHub's `markdown-body` styles only inside MDX pages by using both classes on the article wrapper:
  - `className="mdx markdown-body ..."`
- Import GitHub markdown CSS globally (App Router global CSS), then layer small overrides in `web/src/app/globals.css` scoped to `.mdx.markdown-body`.

### 2) GitHub-flavored Markdown syntax

- Add dependency: `remark-gfm`.
- Wire it into `MDXRemote` options so MDX supports:
  - tables
  - task lists
  - strikethrough
  - autolinks

### 3) Theme alignment

- Keep the site background/gradient (do not let `markdown-body` paint a solid background).
- Map GitHub CSS variables to existing site tokens where possible:
  - text/links/borders to `--fg`, `--muted`, `--accent`, `--border`
  - code blocks keep the existing `--code-bg` look
- Ensure tables/blockquotes/hr/list spacing feel more spacious than current.

## Files / Touch Points

- `web/package.json`
  - add `github-markdown-css`
  - add `remark-gfm`

- `web/src/app/globals.css`
  - import GitHub markdown CSS
  - add scoped overrides for `.mdx.markdown-body`
  - add overrides to prevent conflicts with `rehype-pretty-code` output

- Article wrappers
  - `web/src/app/blog/[slug]/page.tsx`
  - `web/src/app/leetcode/[slug]/page.tsx`
  - `web/src/app/projects/[slug]/page.tsx`
  - change `article` className from `mdx ...` to `mdx markdown-body ...`

- MDX pipeline
  - `web/src/lib/content/mdx.tsx`
  - add `remarkPlugins: [remarkGfm]`

## Risks / Notes

- GitHub markdown CSS is opinionated; we will scope it strictly to `.mdx.markdown-body` to avoid global bleed.
- Some GitHub styles may fight existing `.mdx` rules; our overrides should be minimal and targeted.
- `rehype-pretty-code` may emit its own wrappers/spans; we will keep current `pre` look and ensure GitHub CSS doesn't override it.

## Success Criteria

- Headings, paragraphs, lists, and code blocks have comfortable vertical rhythm.
- Tables, blockquotes, and task lists look polished and readable.
- Visual style remains consistent with the site's theme (accent color, background, borders).
