import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getAllLeetCodePosts } from '@/lib/content/collections'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'LeetCode',
  description: 'Solutions with approach notes, complexity, and final code.',
  openGraph: { url: '/leetcode' },
  alternates: { canonical: '/leetcode' },
}

export default async function LeetCodeIndexPage() {
  const posts = await getAllLeetCodePosts()

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display text-3xl tracking-tight">LeetCode</h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">Solutions with approach notes, complexity, and final code.</p>

        <ul className="mt-10 grid gap-4">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  <Link className="hover:underline" href={`/leetcode/${p.slug}`}>
                    {p.frontmatter.problem}
                  </Link>
                </h2>
                <span className="text-sm font-medium text-[color:var(--muted)]">{p.frontmatter.difficulty}</span>
              </div>
              <p className="mt-2 text-[color:var(--muted)]">{p.frontmatter.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.frontmatter.topics.map((t) => (
                  <span key={t} className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2.5 py-1 text-xs font-medium text-[color:var(--muted)]">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
