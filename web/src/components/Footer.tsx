import { Container } from './Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200/60 py-10">
      <Container>
        <div className="flex flex-col gap-3 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium text-zinc-800">Your Name</span> — built with Next.js + MDX.
          </p>
          <div className="flex gap-4">
            <a className="hover:text-zinc-900" href="/rss.xml">RSS</a>
            <a className="hover:text-zinc-900" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="hover:text-zinc-900" href="mailto:you@example.com">Email</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
