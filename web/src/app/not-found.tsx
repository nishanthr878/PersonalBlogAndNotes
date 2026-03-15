import Link from 'next/link'
import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto max-w-2xl py-20">
        <p className="text-sm font-medium text-zinc-500">404</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Page not found</h1>
        <p className="mt-4 text-zinc-600">
          The page you are looking for does not exist. If you typed the URL, double-check the slug.
        </p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50" href="/">
            Go home
          </Link>
          <Link className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium" href="/blog">
            Browse blog
          </Link>
        </div>
      </div>
    </Container>
  )
}
