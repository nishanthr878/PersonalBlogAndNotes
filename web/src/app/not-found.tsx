import Link from 'next/link'
import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto max-w-2xl py-20">
        <p className="text-sm font-medium text-[color:var(--muted)]">404</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Page not found</h1>
        <p className="mt-4 text-[color:var(--muted)]">
          The page you are looking for does not exist. If you typed the URL, double-check the slug.
        </p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--bg)]" href="/">
            Go home
          </Link>
          <Link className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--fg)]" href="/blog">
            Browse blog
          </Link>
        </div>
      </div>
    </Container>
  )
}
