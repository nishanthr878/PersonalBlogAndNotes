"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-full bg-[color:var(--fg)] px-3 py-1.5 text-sm font-medium text-[color:var(--bg)]'
          : 'rounded-full px-3 py-1.5 text-sm font-medium text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--fg)]'
      }
    >
      {label}
    </Link>
  )
}
