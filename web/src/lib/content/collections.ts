import 'server-only'

import type {
  BlogEntry,
  ContentKind,
  ContentSlug,
  LeetCodeEntry,
  ProjectEntry,
} from './types'
import { listContentSlugs, readContentMdx } from './fs'
import { parseMdxByKind } from './frontmatter'

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

  entries.sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
  return entries
}


export async function getAllLeetCodePosts(): Promise<LeetCodeEntry[]> {
  // TODO: same pattern; sort by date desc
  return []
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  // TODO: same pattern; sort by date desc (or featured first, then date)
  return []
}

export async function getBlogPostBySlug(slug: ContentSlug): Promise<BlogEntry> {
  // TODO: read + parse a single file; throw if missing
  return {} as BlogEntry
}

export async function getLeetCodePostBySlug(slug: ContentSlug): Promise<LeetCodeEntry> {
  // TODO
  return {} as LeetCodeEntry
}

export async function getProjectBySlug(slug: ContentSlug): Promise<ProjectEntry> {
  // TODO
  return {} as ProjectEntry
}
