import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getAllProjects } from '@/lib/content/collections'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I\'ve built.',
  openGraph: { url: '/projects' },
  alternates: { canonical: '/projects' },
}

export default async function ProjectsIndexPage() {
  const projects = await getAllProjects()

  return (
    <Container>
      <div className="py-10">

        {/* Header */}
        <div className="mb-8 border-b border-[color:var(--border)] pb-6">
          <h1 className="font-display text-2xl tracking-tight">Projects</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Things I&apos;ve built. {projects.length} total.
          </p>
        </div>

        {/* Project list */}
        <ul className="divide-y divide-[color:var(--border)]">
          {projects.map((p) => (
            <li key={p.slug} className="flex gap-5 py-6 border-b border-[color:var(--border))] sm:gap-8">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-sm font-medium text-[color:var(--fg)] hover:underline sm:text-base"
                  >
                    {p.frontmatter.title}
                  </Link>
                  {p.frontmatter.liveUrl && (
                    <span className="flex items-center gap-1 rounded border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-green-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                      </span>
                      live
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--muted)] sm:text-sm">
                  {p.frontmatter.description}
                </p>
                {p.frontmatter.stack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.frontmatter.stack.map((t) => (
                      <span key={t} className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {(p.frontmatter.repoUrl || p.frontmatter.liveUrl) && (
                  <div className="mt-3 flex gap-3">
                    {p.frontmatter.repoUrl && (
                      <a href={p.frontmatter.repoUrl} target="_blank" rel="noreferrer"
                        className="text-xs text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                        GitHub ↗
                      </a>
                    )}
                    {p.frontmatter.liveUrl && (
                      <a href={p.frontmatter.liveUrl} target="_blank" rel="noreferrer"
                        className="text-xs text-green-400 hover:text-green-300">
                        Live demo ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}