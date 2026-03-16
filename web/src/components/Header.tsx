'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { Container } from './Container'
import { NavLink } from './NavLink'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

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
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
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

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id={menuId}
            className="absolute left-4 right-4 top-16 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-lg"
          >
            <nav className="grid gap-1">
              <Link
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100"
                href="/blog"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100"
                href="/leetcode"
                onClick={() => setMenuOpen(false)}
              >
                LeetCode
              </Link>
              <Link
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100"
                href="/projects"
                onClick={() => setMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100"
                href="/about"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>

              <div className="my-1 h-px bg-zinc-200/70" />
              <a
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100"
                href="https://github.com/nishanthr878/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}
