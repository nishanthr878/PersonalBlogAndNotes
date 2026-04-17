import 'server-only'

 import { unified } from 'unified'
 import remarkParse from 'remark-parse'
 import remarkGfm from 'remark-gfm'
 import remarkCallout from 'remark-callout'
 import remarkRehype from 'remark-rehype'
 import rehypeStringify from 'rehype-stringify'
 import { visit } from 'unist-util-visit'
 import type { Root, Element } from 'hast'

 // Rehype plugin: extracts mermaid fences BEFORE rehype-pretty-code sees them.
 // Converts <pre><code class="language-mermaid">…</code></pre>
 // into     <pre class="mermaid">…raw diagram text…</pre>
 // Returns whether any mermaid block was found (via the `onFound` callback).
 function rehypeExtractMermaid({ onFound }: { onFound: () => void }) {
   return (tree: Root) => {
     visit(tree, 'element', (node: Element, index, parent) => {
       if (
         node.tagName !== 'pre' ||
         !parent ||
         index === undefined
       ) return

       const code = node.children[0]
       if (
         !code ||
         code.type !== 'element' ||
         (code as Element).tagName !== 'code'
       ) return

       const codeEl = code as Element
       const classes = (codeEl.properties?.className as string[]) ?? []
       if (!classes.includes('language-mermaid')) return

       // Extract raw text from the code node
       const text = codeEl.children
         .filter(c => c.type === 'text')
         .map(c => (c as { value: string }).value)
         .join('')

       // Mutate the <pre> in place: turn it into <pre class="mermaid">…</pre>
       node.properties = { className: ['mermaid'] }
       node.children = [{ type: 'text', value: text }]
       onFound()
     })
   }
 }

 export async function renderMarkdownToHtml(markdown: string): Promise<{ html: string; hasMermaid: boolean }> {
   const { default: rehypePrettyCode } = await import('rehype-pretty-code')

   let hasMermaid = false

   const file = await unified()
     .use(remarkParse)
     .use(remarkGfm)
     .use(remarkCallout)                                        // Obsidian callouts → div.callout
     .use(remarkRehype, { allowDangerousHtml: false })
     .use(rehypeExtractMermaid, { onFound: () => { hasMermaid = true } })  // before pretty-code!
     .use(rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false })
     .use(rehypeStringify, { allowDangerousHtml: false })
     .process(markdown)

   return { html: String(file), hasMermaid }
 }