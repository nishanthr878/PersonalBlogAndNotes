'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from './Container'
import { NavLink } from './NavLink'

type Theme = 'dark' | 'light'

export function Header() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  })

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // ignore
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--surface)]/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg tracking-tight">Nishanth R</span>
            <span className="text-xs font-medium text-[color:var(--muted)]">engineering notes</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/blog" label="Blog" />
            <NavLink href="/leetcode" label="LeetCode" />
            <NavLink href="/projects" label="Projects" />
            <NavLink href="/about" label="About" />
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <a
              href="https://github.com/nishanthr878/"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10"
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
