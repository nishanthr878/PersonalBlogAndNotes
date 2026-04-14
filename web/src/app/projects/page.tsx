import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getAllProjects } from '@/lib/content/collections'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work and experiments.',
  openGraph: { url: '/projects' },
  alternates: { canonical: '/projects' },
}

export default async function ProjectsIndexPage() {
  const projects = await getAllProjects()

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display text-3xl tracking-tight">Projects</h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">Selected work and experiments.</p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <h2 className="text-lg font-semibold tracking-tight">
                <Link className="hover:underline" href={`/projects/${p.slug}`}>
                  {p.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-2 text-[color:var(--muted)]">{p.frontmatter.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.frontmatter.stack.map((t) => (
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
