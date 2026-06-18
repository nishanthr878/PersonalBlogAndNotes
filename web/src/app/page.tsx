import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts, getAllProjects } from '@/lib/content/collections'
import { PostTypeBadge } from '@/components/PostTypeBadge'
import { defaultDescription } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Nishanth',
  description: defaultDescription,
  openGraph: { url: '/' },
  alternates: { canonical: '/' },
}

export default async function Home() {
  const [blog, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
  ])

  const featuredProjects = projects.slice(0, 2)

  return (
    // Edge-to-edge — no Container wrapper here, we handle padding ourselves
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-0 px-4 sm:px-6 lg:flex-row lg:px-8">

        {/* ── FEED (left, grows) ─────────────────────────────────────── */}
        <main className="min-w-0 flex-1 py-10 lg:border-r lg:border-[color:var(--border)] lg:pr-10">

          {/* Feed header */}
          <div className="mb-8 flex items-baseline justify-between border-b border-[color:var(--border)] pb-4">
            <span className="text-xs font-medium uppercase tracking-widest text-[color:var(--muted)]">
              All writing
            </span>
            <span className="font-mono text-xs text-[color:var(--muted)]">
              {blog.length} posts
            </span>
          </div>

          {/* Post rows */}
          <ul className="divide-y divide-[color:var(--border)]">
            {blog.map((post) => {
              const dateObj = new Date(post.frontmatter.date)
              const mon = dateObj.toLocaleString('en', { month: 'short' })
              const day = dateObj.getDate().toString().padStart(2, '0')

              return (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex gap-5 py-5 sm:gap-7"
                  >
                    {/* Date column */}
                    <div className="w-10 shrink-0 pt-0.5 font-mono text-xs leading-snug text-[color:var(--muted)] sm:w-12">
                      <span className="block">{mon}</span>
                      <span className="block">{day}</span>
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
                          {post.frontmatter.tags.slice(0, 4).map((tag) => (
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
        </main>

        {/* ── SIDEBAR (right, fixed width on lg) ────────────────────── */}
        <aside className="shrink-0 py-10 lg:w-72 lg:pl-10 xl:w-80">

          {/* About */}
          <div className="mb-8">
            <p className="font-display text-xl tracking-tight">Nishanth</p>
            <p className="mt-0.5 font-mono text-xs text-[color:var(--muted)]">
              backend engineer · bengaluru
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
              Writing about <span className="text-[color:var(--fg)]">Java, Kafka, distributed systems</span>,
              and whatever I&apos;m building or debugging. Some posts are deep dives.
              Some are just notes I&apos;d Google otherwise.
            </p>
          </div>

          <div className="h-px bg-[color:var(--border)]" />

          {/* Projects */}
          <div className="my-8">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-[color:var(--muted)]">
                Projects
              </span>
              <Link href="/projects" className="text-xs text-[color:var(--accent)] hover:underline">
                All →
              </Link>
            </div>

            <ul className="divide-y divide-[color:var(--border)]">
              {featuredProjects.map((proj) => (
                <li key={proj.slug} className="py-3">
                  <Link href={`/projects/${proj.slug}`} className="group block">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[color:var(--fg)] group-hover:underline">
                        {proj.frontmatter.title}
                      </span>
                      {proj.frontmatter.liveUrl && (
                        <span className="rounded border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-green-400">
                          live
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">
                      {proj.frontmatter.description}
                    </p>
                    {proj.frontmatter.stack.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {proj.frontmatter.stack.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--muted)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px bg-[color:var(--border)]" />

          {/* Links */}
          <div className="mt-8">
            <div className="mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[color:var(--muted)]">
                Links
              </span>
            </div>
            <ul className="divide-y divide-[color:var(--border)]">
              {[
                { label: 'GitHub', href: 'https://github.com/nishanthr878/' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nishanthr79/' },
                { label: 'demo.nishanthraj.in', href: 'https://demo.nishanthraj.in', live: true },
                { label: 'Email', href: 'mailto:nishanthr878@gmail.com' },
              ].map(({ label, href, live }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-center justify-between py-2.5 text-xs text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                  >
                    <span className="flex items-center gap-1.5">
                      {live && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                        </span>
                      )}
                      {label}
                    </span>
                    <span className="text-[color:var(--muted)]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </aside>
      </div>
    </div>
  )
}