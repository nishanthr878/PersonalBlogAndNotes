import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getAllBlogPosts, getAllLeetCodePosts, getAllProjects } from '@/lib/content/collections'
import { defaultDescription } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Nishanth',
  description: defaultDescription,
  openGraph: { url: '/' },
  alternates: { canonical: '/' },
}

export default async function Home() {
  const [blog, leetcode, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllLeetCodePosts(),
    getAllProjects(),
  ])

  const latestBlog = blog.slice(0, 3)
  const latestLeet = leetcode.slice(0, 3)
  const featuredProjects = projects.slice(0, 2)

  return (
    <Container>
      <div className="py-14">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)]/70 p-8 shadow-[0_1px_0_var(--shadow)] backdrop-blur sm:p-10">
          <p className="text-sm font-medium text-zinc-600">Personal tech blog + portfolio</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-5xl">
            Notes on problem-solving, systems, and the things I build.
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-700">
            I publish short blog posts, LeetCode writeups, and project breakdowns. Everything is written in MDX and
            shipped as a fast static site.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50" href="/blog">
              Read the blog
            </Link>
            <Link className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm font-medium" href="/projects">
              View projects
            </Link>
            <Link className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm font-medium" href="/leetcode">
              LeetCode logs
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl tracking-tight">Latest posts</h2>
              <Link className="text-sm font-medium text-[color:var(--accent)] hover:underline" href="/blog">
                All posts
              </Link>
            </div>

            <div className="mt-4 grid gap-4">
              {latestBlog.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 hover:border-white/30"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-semibold tracking-tight group-hover:underline">{p.frontmatter.title}</h3>
                    <time className="text-sm text-zinc-500">{p.frontmatter.date.toISOString().slice(0, 10)}</time>
                  </div>
                  <p className="mt-2 text-zinc-700">{p.frontmatter.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl tracking-tight">LeetCode</h2>
              <Link className="text-sm font-medium text-[color:var(--accent)] hover:underline" href="/leetcode">
                All
              </Link>
            </div>

            <div className="mt-4 grid gap-3">
              {latestLeet.map((p) => (
                <Link
                  key={p.slug}
                  href={`/leetcode/${p.slug}`}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 hover:border-white/30"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold tracking-tight">{p.frontmatter.problem}</h3>
                    <span className="text-xs font-medium text-zinc-500">{p.frontmatter.difficulty}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-700">{p.frontmatter.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl tracking-tight">Featured projects</h2>
            <Link className="text-sm font-medium text-[color:var(--accent)] hover:underline" href="/projects">
              All projects
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {featuredProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 hover:border-white/30"
              >
                <h3 className="text-lg font-semibold tracking-tight">{p.frontmatter.title}</h3>
                <p className="mt-2 text-zinc-700">{p.frontmatter.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.frontmatter.stack.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Container>
  )
}
