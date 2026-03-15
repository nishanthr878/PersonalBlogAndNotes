# Personal Blog + Portfolio (Next.js + MDX)

A fully static personal website for:
- Blog posts
- LeetCode solution logs
- Projects/portfolio

Content is written in MDX and stored in this repo. The site is exported as static files and is deployable on Cloudflare Pages.

## Tech Stack

- Next.js (App Router)
- TypeScript
- MDX via `next-mdx-remote`
- Tailwind CSS
- Static export (`output: "export"` in production)
- RSS + sitemap generated at build time

## Project Structure


## Routes

- `/` home
- `/blog` blog index
- `/blog/[slug]` blog post
- `/leetcode` leetcode index
- `/leetcode/[slug]` leetcode post
- `/projects` projects index
- `/projects/[slug]` project page
- `/about` about page

## Authoring Content (MDX)

Slugs are derived from filenames.

### Blog

Create a file: `content/blog/<slug>.mdx`

Required frontmatter:
- `title` (string)
- `date` (ISO string, e.g. `2026-03-08`)
- `description` (string)
- `tags` (string array)
- `draft` (optional boolean)

### LeetCode

Create a file: `content/leetcode/<slug>.mdx`

Required frontmatter (in addition to base fields above):
- `problem` (string)
- `difficulty` (`easy` | `medium` | `hard`)
- `topics` (string array)
- `language` (string)
- `time` (string, e.g. `O(n)`)
- `space` (string, e.g. `O(n)`)
- `sourceUrl` (string URL)

### Projects

Create a file: `content/projects/<slug>.mdx`

Required frontmatter (in addition to base fields above):
- `stack` (string array)

Optional:
- `repoUrl` (string URL)
- `liveUrl` (string URL)
- `featured` (boolean)

## Local Development

From repo root:

Install:
```bash
npm ci --prefix web

