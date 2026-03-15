import { Container } from '@/components/Container'

export const dynamic = 'force-static'

export default function AboutPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display text-3xl tracking-tight">About</h1>
        <p className="mt-4 max-w-2xl text-zinc-700">
          Write a short bio here. Mention what you build, what you are learning, and what kinds of roles you are
          interested in.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50" href="mailto:you@example.com">
            Email
          </a>
          <a className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium" href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </Container>
  )
}
