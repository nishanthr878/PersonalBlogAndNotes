import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getAllBlogPosts } from '@/lib/content/collections'
import { PostTypeBadge } from '@/components/PostTypeBadge'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Deep dives, notes, and references on Java, Kafka, distributed systems, and things I build.',
  openGraph: { url: '/blog' },
  alternates: { canonical: '/blog' },
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts()

  return (
    <Container>
      <div className="py-10">

        {/* Page header */}
        <div className="mb-8 border-b border-[color:var(--border)] pb-6">
          <h1 className="font-display text-2xl tracking-tight">Writing</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Deep dives, notes, and references. {posts.length} posts total.
          </p>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { type: 'deep-dive', label: 'deep dive', className: 'bg-[color:var(--accent)]/10 text-[color:var(--accent)] border border-[color:var(--accent)]/20' },
              { type: 'note', label: 'note', className: 'bg-[color:var(--surface)] text-[color:var(--muted)] border border-[color:var(--border)]' },
              { type: 'reference', label: 'reference', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
            ].map(({ label, className }) => (
              <span key={label} className={`inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${className}`}>
                {label}
              </span>
            ))}
            <span className="text-xs text-[color:var(--muted)]">— post types</span>
          </div>
        </div>

        {/* Feed */}
        <ul className="divide-y divide-[color:var(--border)]">
          {posts.map((post) => {
            const dateObj = new Date(post.frontmatter.date)
            const mon = dateObj.toLocaleString('en', { month: 'short' })
            const day = dateObj.getDate().toString().padStart(2, '0')
            const year = dateObj.getFullYear()

            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex gap-5 py-5 sm:gap-7"
                >
                  {/* Date column */}
                  <div className="w-16 shrink-0 pt-0.5 font-mono text-xs leading-snug text-[color:var(--muted)]">
                    <span className="block">{mon} {day}</span>
                    <span className="block">{year}</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <PostTypeBadge frontmatter={post.frontmatter} />
                    <h2 className="mt-1.5 text-sm font-medium leading-snug tracking-tight text-[color:var(--fg)] group-hover:underline sm:text-base">
                      {post.frontmatter.title}
                    </h2>
                    {post.frontmatter.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[color:var(--muted)] sm:text-sm">
                        {post.frontmatter.description}
                      </p>
                    )}
                    {post.frontmatter.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {post.frontmatter.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </Container>
  )
}
