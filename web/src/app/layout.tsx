import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { defaultDescription, metadataBase, siteName } from '@/lib/seo/site'
import './globals.css'

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})
const displayFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700'],
})
const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  weight: ['400', '500'],
})

const title = 'Nishanth'

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName,
    title,
    description: defaultDescription,
    url: '/',
    // opengraph-image.tsx in /app is picked up automatically by Next.js.
    // No manual images array needed — removing /og.svg reference.
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: defaultDescription,
    // Next.js auto-wires opengraph-image.tsx to twitter:image too.
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <head>
        <script
          suppressHydrationWarning
          // Runs before paint — reads localStorage and sets data-theme.
          // Default is dark (no attribute = dark via :root in globals.css).
          // Stored 'light' switches to html[data-theme='light'] vars.
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      document.documentElement.dataset.theme = 'light'
    }
    // No else — absence of data-theme = dark (default :root)
  } catch {}
})()`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-[color:var(--bg)] text-[color:var(--fg)] antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}