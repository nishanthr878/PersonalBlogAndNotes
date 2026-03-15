import 'server-only'

import type {
  BlogEntry,
  ContentSlug,
  LeetCodeEntry,
  ProjectEntry,
} from './types'
import { listContentSlugs, readContentMdx } from './fs'
import { parseMdxByKind } from './frontmatter'

const isDraftHidden = (draft: boolean | undefined): boolean =>
  process.env.NODE_ENV === 'production' ? draft === true : false

export async function getAllBlogPosts(): Promise<BlogEntry[]> {
  const slugs = await listContentSlugs('blog')

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readContentMdx('blog', slug)
      const parsed = parseMdxByKind('blog', slug, raw)

      return {
        kind: 'blog' as const,
        slug,
        frontmatter: parsed.frontmatter,
        body: parsed.body,
      }
    }),
  )

  const filtered = entries.filter((e) => !isDraftHidden(e.frontmatter.draft))
  filtered.sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
  return filtered
}

export async function getAllLeetCodePosts(): Promise<LeetCodeEntry[]> {
  const slugs = await listContentSlugs('leetcode')

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readContentMdx('leetcode', slug)
      const parsed = parseMdxByKind('leetcode', slug, raw)

      return {
        kind: 'leetcode' as const,
        slug,
        frontmatter: parsed.frontmatter as LeetCodeEntry['frontmatter'],
        body: parsed.body,
      }
    }),
  )

  const filtered = entries.filter((e) => !isDraftHidden(e.frontmatter.draft))
  filtered.sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
  return filtered
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  const slugs = await listContentSlugs('projects')

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readContentMdx('projects', slug)
      const parsed = parseMdxByKind('projects', slug, raw)

      return {
        kind: 'projects' as const,
        slug,
        frontmatter: parsed.frontmatter as ProjectEntry['frontmatter'],
        body: parsed.body,
      }
    }),
  )

  const filtered = entries.filter((e) => !isDraftHidden(e.frontmatter.draft))
  filtered.sort((a, b) => {
    const af = a.frontmatter.featured ? 1 : 0
    const bf = b.frontmatter.featured ? 1 : 0
    if (af !== bf) return bf - af
    return b.frontmatter.date.getTime() - a.frontmatter.date.getTime()
  })
  return filtered
}

export async function getBlogPostBySlug(slug: ContentSlug): Promise<BlogEntry> {
  const raw = await readContentMdx('blog', slug)
  const parsed = parseMdxByKind('blog', slug, raw)

  const entry: BlogEntry = {
    kind: 'blog',
    slug,
    frontmatter: parsed.frontmatter as BlogEntry['frontmatter'],
    body: parsed.body,
  }

  if (isDraftHidden(entry.frontmatter.draft)) {
    throw new Error(`Blog post "${slug}" is a draft and is hidden in production`)
  }

  return entry
}

export async function getLeetCodePostBySlug(slug: ContentSlug): Promise<LeetCodeEntry> {
  const raw = await readContentMdx('leetcode', slug)
  const parsed = parseMdxByKind('leetcode', slug, raw)

  const entry: LeetCodeEntry = {
    kind: 'leetcode',
    slug,
    frontmatter: parsed.frontmatter as LeetCodeEntry['frontmatter'],
    body: parsed.body,
  }

  if (isDraftHidden(entry.frontmatter.draft)) {
    throw new Error(`LeetCode post "${slug}" is a draft and is hidden in production`)
  }

  return entry
}

export async function getProjectBySlug(slug: ContentSlug): Promise<ProjectEntry> {
  const raw = await readContentMdx('projects', slug)
  const parsed = parseMdxByKind('projects', slug, raw)

  const entry: ProjectEntry = {
    kind: 'projects',
    slug,
    frontmatter: parsed.frontmatter as ProjectEntry['frontmatter'],
    body: parsed.body,
  }

  if (isDraftHidden(entry.frontmatter.draft)) {
    throw new Error(`Project "${slug}" is a draft and is hidden in production`)
  }

  return entry
}
