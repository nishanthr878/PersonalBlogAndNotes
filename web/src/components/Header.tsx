'use client'

import Link from 'next/link'
import { Container } from './Container'
import { NavLink } from './NavLink'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg tracking-tight">Nishanth R</span>
            <span className="text-xs font-medium text-zinc-500">engineering notes</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/blog" label="Blog" />
            <NavLink href="/leetcode" label="LeetCode" />
            <NavLink href="/projects" label="Projects" />
            <NavLink href="/about" label="About" />
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/nishanthr878/"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </header>
  )
}
