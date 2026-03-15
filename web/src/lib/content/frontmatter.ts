import 'server-only'

import matter from 'gray-matter'
import type {
  BaseFrontmatter,
  BlogFrontmatter,
  ContentKind,
  ContentSlug,
  LeetCodeDifficulty,
  LeetCodeFrontmatter,
  ProjectFrontmatter,
} from './types'


export type ParsedMdx<TFrontmatter> = {
  frontmatter: TFrontmatter
  body: string
}

/** Parse + validate fields shared by all content kinds. */
export function parseBaseFrontmatter(data: Record<string, unknown>, slug: ContentSlug): BaseFrontmatter {
  const fail = (field: string, message: string): never => {
    throw new Error(`Invalid frontmatter in "${slug}": "${field}" ${message}`)
  }

  const requireNonEmptyString = (value: unknown, field: string): string => {
    if (typeof value !== 'string') return fail(field, 'must be a non-empty string')

    const trimmed = value.trim()
    if (trimmed.length === 0) return fail(field, 'must be a non-empty string')

    return trimmed
  }

  const parseDate = (value: unknown): Date => {
    if (typeof value === 'string') {
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return fail('date', 'must be a valid date')
      return d
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) return fail('date', 'must be a valid date')
      return value
    }

    return fail('date', 'must be an ISO date string')
  }


  const title = requireNonEmptyString(data.title, 'title')
  const description = requireNonEmptyString(data.description, 'description')
  const date = parseDate(data.date)

  const rawTags = data.tags
  const tags =
    rawTags == null
      ? []
      : typeof rawTags === 'string'
        ? [rawTags]
        : Array.isArray(rawTags) && rawTags.every((t) => typeof t === 'string')
          ? rawTags
          : fail('tags', 'must be a string or an array of strings')

  const rawDraft = data.draft
  const draft =
    rawDraft === undefined
      ? undefined
      : typeof rawDraft === 'boolean'
        ? rawDraft
        : fail('draft', 'must be a boolean')

  return { title, date, description, tags, draft }
}

const isLeetCodeDifficulty = (v: unknown): v is LeetCodeDifficulty =>
  v === 'easy' || v === 'medium' || v === 'hard'

/** Parse + validate a single MDX file (frontmatter + body). */
export function parseMdxByKind(
  kind: ContentKind,
  slug: ContentSlug,
  rawMdx: string,
): ParsedMdx<BlogFrontmatter | LeetCodeFrontmatter | ProjectFrontmatter> {
  const fail = (field: string, message: string): never => {
    throw new Error(`Invalid frontmatter in "${slug}": "${field}" ${message}`)
  }

  const { data, content } = matter(rawMdx)
  const d = data as Record<string, unknown>
  const base = parseBaseFrontmatter(d, slug)

  if (kind === 'blog') {
    const frontmatter: BlogFrontmatter = { ...base }
    return { frontmatter, body: content }
  }

  if (kind === 'leetcode') {
    const problem = typeof d.problem === 'string' ? d.problem : fail('problem', 'must be a string')
    const language = typeof d.language === 'string' ? d.language : fail('language', 'must be a string')
    const time = typeof d.time === 'string' ? d.time : fail('time', 'must be a string')
    const space = typeof d.space === 'string' ? d.space : fail('space', 'must be a string')
    const sourceUrl = typeof d.sourceUrl === 'string' ? d.sourceUrl : fail('sourceUrl', 'must be a string URL')

    const difficultyRaw = d.difficulty
    if (!isLeetCodeDifficulty(difficultyRaw)) {
      return fail('difficulty', 'must be one of: easy, medium, hard')
    }
    const difficulty: LeetCodeDifficulty = difficultyRaw

    const topicsRaw = d.topics
    const topics =
      topicsRaw == null
        ? []
        : Array.isArray(topicsRaw) && topicsRaw.every((t) => typeof t === 'string')
          ? topicsRaw
          : fail('topics', 'must be an array of strings')

    const frontmatter: LeetCodeFrontmatter = {
      ...base,
      problem,
      difficulty,
      topics,
      language,
      time,
      space,
      sourceUrl,
    }

    return { frontmatter, body: content }
  }

  if (kind === 'projects') {
    const stackRaw = d.stack
    const stack =
      Array.isArray(stackRaw) && stackRaw.every((t) => typeof t === 'string')
        ? stackRaw
        : fail('stack', 'must be an array of strings')

    const repoUrl =
      d.repoUrl == null ? undefined : typeof d.repoUrl === 'string' ? d.repoUrl : fail('repoUrl', 'must be a string URL')
    const liveUrl =
      d.liveUrl == null ? undefined : typeof d.liveUrl === 'string' ? d.liveUrl : fail('liveUrl', 'must be a string URL')
    const featured =
      d.featured == null
        ? undefined
        : typeof d.featured === 'boolean'
          ? d.featured
          : fail('featured', 'must be a boolean')

    const frontmatter: ProjectFrontmatter = {
      ...base,
      stack,
      repoUrl,
      liveUrl,
      featured,
    }

    return { frontmatter, body: content }
  }

  return fail('kind', 'is not supported')
}
