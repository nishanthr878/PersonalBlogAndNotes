import { Container } from './Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[color:var(--border)] py-10">
      <Container>
        <div className="flex flex-col gap-3 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium text-[color:var(--fg)]">Nishanth R</span>
          </p>
          <div className="flex gap-4">
            <a className="hover:text-[color:var(--fg)]" href="https://www.linkedin.com/in/nishanthr79/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="hover:text-[color:var(--fg)]" href="mailto:nishanthr878@gmail.com">Email</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
