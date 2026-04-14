import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '..')
const contentRoot = path.join(repoRoot, 'content')
const publicDir = path.join(process.cwd(), 'public')

const siteUrl = (process.env.SITE_URL || 'https://personalblogandnotes.pages.dev').replace(/\/$/, '')

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

async function slugs(kind) {
  const dir = path.join(contentRoot, kind)
  const names = await fs.readdir(dir)

  // Prefer .md over .mdx for same slug
  const slugMap = new Map()
  for (const name of names) {
    const isMd = name.endsWith('.md')
    const isMdx = name.endsWith('.mdx')
    if (!isMd && !isMdx) continue

    const slug = isMd ? name.slice(0, -'.md'.length) : name.slice(0, -'.mdx'.length)
    const ext = isMd ? 'md' : 'mdx'
    const existing = slugMap.get(slug)
    if (!existing || existing === 'mdx' && ext === 'md') {
      slugMap.set(slug, ext)
    }
  }

  return Array.from(slugMap.keys())
}

const urls = []

// Static routes
urls.push('/')
urls.push('/about')
urls.push('/blog')
urls.push('/leetcode')
urls.push('/projects')
urls.push('/rss.xml')

for (const slug of await slugs('blog')) urls.push(`/blog/${slug}`)
for (const slug of await slugs('leetcode')) urls.push(`/leetcode/${slug}`)
for (const slug of await slugs('projects')) urls.push(`/projects/${slug}`)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
  .sort()
  .map((u) => `\n  <url><loc>${escapeXml(`${siteUrl}${u}`)}</loc></url>`)
  .join('')}
</urlset>
`

await fs.mkdir(publicDir, { recursive: true })
await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
