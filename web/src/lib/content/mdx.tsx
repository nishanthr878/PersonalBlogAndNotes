import 'server-only'

import type { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function renderMdx(source: string): Promise<ReactElement> {
  return <MDXRemote source={source} />
}
