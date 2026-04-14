import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/content/collections'
import { renderMarkdownToHtml } from '@/lib/content/markdown'
import { defaultDescription } from '@/lib/seo/site'

export const dynamicParams = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof getBlogPostBySlug>>
  try {
    post = await getBlogPostBySlug(slug)
  } catch {
    notFound()
  }

  const title = post.frontmatter.title
  const description = post.frontmatter.description || defaultDescription
  const url = `/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.frontmatter.date.toISOString(),
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof getBlogPostBySlug>>
  try {
    post = await getBlogPostBySlug(slug)
  } catch {
    notFound()
  }

  const html = await renderMarkdownToHtml(post.body)

  return (
    <Container>
      <div className="py-12">
        <header className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-[color:var(--muted)]">Blog</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">{post.frontmatter.title}</h1>
          <p className="mt-3 text-[color:var(--muted)]">{post.frontmatter.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <time className="text-sm text-[color:var(--muted)]">{post.frontmatter.date.toISOString().slice(0, 10)}</time>
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((t) => (
                <span key={t} className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2.5 py-1 text-xs font-medium text-[color:var(--muted)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        <article
          className="content markdown-body mx-auto mt-10 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Container>
  )
}
