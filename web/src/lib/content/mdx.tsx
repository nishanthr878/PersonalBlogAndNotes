import 'server-only'

import type { ComponentProps, ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

export async function renderMdx(source: string): Promise<ReactElement> {
  const { default: rehypePrettyCode } = await import('rehype-pretty-code')

  type RemoteOptions = NonNullable<ComponentProps<typeof MDXRemote>['options']>
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      // IDE-like syntax highlighting at build time.
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'github-dark-dimmed',
            keepBackground: false,
          },
        ],
      ],
    },
  } as unknown as RemoteOptions

  return (
    <MDXRemote
      source={source}
      options={options}
    />
  )
}
