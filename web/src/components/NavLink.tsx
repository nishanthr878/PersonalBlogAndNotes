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
          ? 'rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50'
          : 'rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100'
      }
    >
      {label}
    </Link>
  )
}
