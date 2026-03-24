import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

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

async function readCollection(kind, basePath) {
  const dir = path.join(contentRoot, kind)
  const names = await fs.readdir(dir)

  const items = []
  for (const name of names) {
    if (!name.endsWith('.mdx')) continue
    const slug = name.slice(0, -'.mdx'.length)
    const raw = await fs.readFile(path.join(dir, name), 'utf8')
    const { data } = matter(raw)

    if (process.env.NODE_ENV === 'production' && data.draft === true) continue

    items.push({
      slug,
      link: `${siteUrl}${basePath}/${slug}`,
      title: data.title || data.problem || slug,
      description: data.description || '',
      date: data.date || null,
    })
  }

  return items
}

const toRfc822 = (dateLike) => {
  const d = new Date(dateLike)
  // If invalid date, omit pubDate.
  return Number.isNaN(d.getTime()) ? null : d.toUTCString()
}

const blog = await readCollection('blog', '/blog')
const leetcode = await readCollection('leetcode', '/leetcode')

const all = [...blog, ...leetcode]
  .map((i) => ({ ...i, pubDate: i.date ? toRfc822(i.date) : null }))
  .sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0
    const bd = b.date ? new Date(b.date).getTime() : 0
    return bd - ad
  })

const channelTitle = 'Your Name'
const channelDescription = 'Personal tech blog, LeetCode logs, and projects.'

const itemsXml = all
  .map((i) => {
    const pubDateXml = i.pubDate ? `<pubDate>${escapeXml(i.pubDate)}</pubDate>` : ''
    return `\n    <item>\n      <title>${escapeXml(i.title)}</title>\n      <link>${escapeXml(i.link)}</link>\n      <guid>${escapeXml(i.link)}</guid>\n      <description>${escapeXml(i.description)}</description>\n      ${pubDateXml}\n    </item>`
  })
  .join('')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(channelDescription)}</description>${itemsXml}
  </channel>
</rss>
`

await fs.mkdir(publicDir, { recursive: true })
await fs.writeFile(path.join(publicDir, 'rss.xml'), rss, 'utf8')
