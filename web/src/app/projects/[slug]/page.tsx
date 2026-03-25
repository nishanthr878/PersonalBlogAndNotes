import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { getAllProjects, getProjectBySlug } from '@/lib/content/collections'
import { renderMdx } from '@/lib/content/mdx'
import { defaultDescription } from '@/lib/seo/site'

export const dynamicParams = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  const title = project.frontmatter.title
  const description = project.frontmatter.description || defaultDescription
  const url = `/projects/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: '/og.svg', width: 1200, height: 630, alt: `${title} - ${description}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.svg'],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  let project: Awaited<ReturnType<typeof getProjectBySlug>>
  try {
    project = await getProjectBySlug(slug)
  } catch {
    notFound()
  }

  const content = await renderMdx(project.body)

  return (
    <Container>
      <div className="py-12">
        <header className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-zinc-500">Project</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">{project.frontmatter.title}</h1>
          <p className="mt-3 text-zinc-600">{project.frontmatter.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.frontmatter.stack.map((t) => (
              <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.frontmatter.repoUrl ? (
              <a
                className="text-sm font-medium text-zinc-900 hover:underline"
                href={project.frontmatter.repoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
            ) : null}
            {project.frontmatter.liveUrl ? (
              <a
                className="text-sm font-medium text-zinc-900 hover:underline"
                href={project.frontmatter.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                Live demo
              </a>
            ) : null}
          </div>
        </header>

        <article className="mdx markdown-body mx-auto mt-10 max-w-3xl">{content}</article>
      </div>
    </Container>
  )
}
