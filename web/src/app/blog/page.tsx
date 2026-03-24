import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getAllBlogPosts } from '@/lib/content/collections'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Short, practical notes on algorithms, systems, and building things.',
  openGraph: { url: '/blog' },
  alternates: { canonical: '/blog' },
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts()

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display text-3xl tracking-tight">Blog</h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          Short, practical notes on algorithms, systems, and building things.
        </p>

        <ul className="mt-10 grid gap-4">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  <Link className="hover:underline" href={`/blog/${p.slug}`}>
                    {p.frontmatter.title}
                  </Link>
                </h2>
                <time className="text-sm text-zinc-500">{p.frontmatter.date.toISOString().slice(0, 10)}</time>
              </div>
              <p className="mt-2 text-zinc-700">{p.frontmatter.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.frontmatter.tags.map((t) => (
                  <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
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
