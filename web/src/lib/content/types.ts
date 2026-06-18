export type ContentKind = 'blog' | 'leetcode' | 'projects'

export type PostType = 'deep-dive' | 'note' | 'reference'

export type BaseFrontmatter = {
  title: string
  date: Date
  description: string
  tags: string[]
  draft?: boolean
}

export type BlogFrontmatter = BaseFrontmatter & {
  // Explicitly set in frontmatter as: postType: deep-dive | note | reference
  // Falls back to tag-based derivation in the UI if not set.
  postType?: PostType
}

export type LeetCodeDifficulty = 'easy' | 'medium' | 'hard'

export type LeetCodeFrontmatter = BaseFrontmatter & {
  problem: string
  difficulty: LeetCodeDifficulty
  topics: string[]
  language: string
  time: string
  space: string
  sourceUrl: string
}

export type ProjectFrontmatter = BaseFrontmatter & {
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  featured?: boolean
}

export type ContentSlug = string

export type ContentEntry<TFrontmatter> = {
  kind: ContentKind
  slug: ContentSlug
  frontmatter: TFrontmatter
  /** Raw MDX body without frontmatter */
  body: string
}

export type BlogEntry   = ContentEntry<BlogFrontmatter>   & { kind: 'blog' }
export type LeetCodeEntry = ContentEntry<LeetCodeFrontmatter> & { kind: 'leetcode' }
export type ProjectEntry  = ContentEntry<ProjectFrontmatter>  & { kind: 'projects' }