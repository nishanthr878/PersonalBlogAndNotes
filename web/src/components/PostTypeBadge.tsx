import type { BlogFrontmatter, PostType } from '@/lib/content/types'

// Derive post type from tags if not explicitly set in frontmatter.
// Tag signals: anything with 'architecture', 'kafka', 'system-design', 'llm', 'event-driven' = deep-dive
// Anything with 'meta', 'writing', 'DSA', 'java', 'notes' and no system-design tag = note
// Anything tagged 'reference', 'cheat-sheet' = reference
function derivePostType(fm: BlogFrontmatter): PostType {
  if (fm.postType) return fm.postType

  const tags = fm.tags.map((t) => t.toLowerCase())

  const deepDiveSignals = ['architecture', 'kafka', 'system-design', 'event-driven', 'observability', 'async', 'distributed']
  const referenceSignals = ['reference', 'cheat-sheet', 'cheatsheet', 'quick-reference']
  const noteSignals = ['metawriting', 'notes', 'meta']

  if (referenceSignals.some((s) => tags.includes(s) || fm.title.toLowerCase().includes('cheat') || fm.title.toLowerCase().includes('reference'))) {
    return 'reference'
  }
  if (deepDiveSignals.some((s) => tags.includes(s))) return 'deep-dive'
  if (noteSignals.some((s) => tags.includes(s))) return 'note'

  // Default: treat as note
  return 'note'
}

const TYPE_CONFIG: Record<PostType, { label: string; className: string }> = {
  'deep-dive': {
    label: 'deep dive',
    className: 'bg-[color:var(--accent)]/10 text-[color:var(--accent)] border border-[color:var(--accent)]/20',
  },
  note: {
    label: 'note',
    className: 'bg-[color:var(--surface)] text-[color:var(--muted)] border border-[color:var(--border)]',
  },
  reference: {
    label: 'reference',
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
}

export function PostTypeBadge({ frontmatter }: { frontmatter: BlogFrontmatter }) {
  const type = derivePostType(frontmatter)
  const { label, className } = TYPE_CONFIG[type]

  return (
    <span className={`inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${className}`}>
      {label}
    </span>
  )
}

export { derivePostType }