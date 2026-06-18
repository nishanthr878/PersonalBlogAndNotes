'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { Container } from './Container'
import { NavLink } from './NavLink'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  const toggleTheme = () => {
  const current = document.documentElement.dataset.theme
  if (current === 'light') {
    // Switch back to dark — remove the attribute entirely
    delete document.documentElement.dataset.theme
    try { localStorage.removeItem('theme') } catch {}
  } else {
    // Switch to light
    document.documentElement.dataset.theme = 'light'
    try { localStorage.setItem('theme', 'light') } catch {}
  }
}

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--bg)]">
      <Container>
        <div className="flex h-14 items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg tracking-tight">Nishanth</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/blog"     label="Writing"  />
            <NavLink href="/leetcode" label="LeetCode" />
            <NavLink href="/projects" label="Projects" />
            <NavLink href="/about"    label="About"    />
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Live demo pill — desktop only */}
            <a
              href="https://demo.nishanthraj.in"
              target="_blank"
              rel="noreferrer"
              className="mr-2 hidden items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 hover:bg-green-500/20 md:flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              demo live
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              Theme
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>

            <a
              href="https://github.com/nishanthr878/"
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10 md:block"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id={menuId}
            className="absolute left-4 right-4 top-14 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg)] p-3 shadow-lg"
          >
            <nav className="grid gap-1">
              {[
                { href: '/blog',     label: 'Writing'  },
                { href: '/leetcode', label: 'LeetCode' },
                { href: '/projects', label: 'Projects' },
                { href: '/about',    label: 'About'    },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10"
                  href={href}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              <div className="my-1 h-px bg-[color:var(--border)]" />

              <a
                className="rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--fg)] hover:bg-white/10"
                href="https://github.com/nishanthr878/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                GitHub ↗
              </a>

              <a
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-green-400 hover:bg-white/10"
                href="https://demo.nishanthraj.in"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                Live demo ↗
              </a>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}