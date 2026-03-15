import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { getAllLeetCodePosts, getLeetCodePostBySlug } from '@/lib/content/collections'
import { renderMdx } from '@/lib/content/mdx'

export const dynamicParams = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllLeetCodePosts()
  return posts.map((p) => ({ slug: p.slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export default async function LeetCodePostPage({ params }: PageProps) {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof getLeetCodePostBySlug>>
  try {
    post = await getLeetCodePostBySlug(slug)
  } catch {
    notFound()
  }

  const content = await renderMdx(post.body)

  return (
    <Container>
      <div className="py-12">
        <header className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-zinc-500">LeetCode</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">{post.frontmatter.problem}</h1>
          <p className="mt-3 text-zinc-600">{post.frontmatter.description}</p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              {post.frontmatter.difficulty}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              time: {post.frontmatter.time}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              space: {post.frontmatter.space}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
              lang: {post.frontmatter.language}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.topics.map((t) => (
              <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <a
              className="text-sm font-medium text-zinc-900 hover:underline"
              href={post.frontmatter.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on LeetCode
            </a>
          </div>
        </header>

        <article className="mdx mx-auto mt-10 max-w-3xl">{content}</article>
      </div>
    </Container>
  )
}
