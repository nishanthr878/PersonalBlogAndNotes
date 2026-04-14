import 'server-only'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  // Input is trusted, author-controlled Markdown. Raw HTML is disabled, but this is not a sanitizer.
  const { default: rehypePrettyCode } = await import('rehype-pretty-code')

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypePrettyCode, {
      theme: 'github-dark-dimmed',
      keepBackground: false
    })
    .use(rehypeStringify, { allowDangerousHtml: false })
    .process(markdown)

  return String(file)
}
