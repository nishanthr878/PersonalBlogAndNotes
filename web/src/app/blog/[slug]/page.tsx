import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/content/collections'
import { renderMdx } from '@/lib/content/mdx'

export const dynamicParams = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof getBlogPostBySlug>>
  try {
    post = await getBlogPostBySlug(slug)
  } catch {
    notFound()
  }

  const content = await renderMdx(post.body)

  return (
    <Container>
      <div className="py-12">
        <header className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-zinc-500">Blog</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">{post.frontmatter.title}</h1>
          <p className="mt-3 text-zinc-600">{post.frontmatter.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <time className="text-sm text-zinc-500">{post.frontmatter.date.toISOString().slice(0, 10)}</time>
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((t) => (
                <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        <article className="mdx mx-auto mt-10 max-w-3xl">{content}</article>
      </div>
    </Container>
  )
}
