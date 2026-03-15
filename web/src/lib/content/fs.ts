import 'server-only'

import path from 'node:path'
import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import type { ContentKind, ContentSlug } from './types'

export type ContentSourceFile = {
  slug: ContentSlug
  absolutePath: string
}

/**
 * Returns the monorepo root.
 * Assumption: this file runs with cwd = `.../web` (npm --prefix web).
 */
export function getRepoRootDir(): string {
  const cwd = process.cwd()

  // Build tooling can execute with cwd at repo root or at `web/`.
  // Detect repo root by finding a `content/` directory.
  const candidates = [cwd, path.resolve(cwd, '..')]
  for (const candidate of candidates) {
    const contentDir = path.join(candidate, 'content')
    if (fsSync.existsSync(contentDir)) return candidate
  }

  throw new Error(
    `Unable to locate repo root. Expected a "content" directory in: ${candidates.join(', ')}`,
  )
}

export function getContentKindDir(kind: ContentKind): string {
  return path.join(getRepoRootDir(), 'content', kind)
}

export async function listContentSlugs(kind: ContentKind): Promise<ContentSlug[]> {
  const dir = getContentKindDir(kind)
  const entries = await fs.readdir(dir, { withFileTypes: true})

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name.slice(0, -'.mdx'.length))
    .sort((a, b) => a.localeCompare(b))
}

export async function readContentMdx(kind: ContentKind, slug: ContentSlug): Promise<string> {
  const filePath = path.join(getContentKindDir(kind), `${slug}.mdx`)
  return await fs.readFile(filePath, 'utf-8')
}
