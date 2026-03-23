import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import './globals.css'

const bodyFont = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] })
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700'] })
const monoFont = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-code', weight: ['400', '500'] })

export const metadata: Metadata = {
  title: {
    default: 'Nishanth',
    template: '%s | Nishanth',
  },
  description: 'Personal tech blog, LeetCode logs, and projects.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <head>
        <script
          // Set theme before paint to avoid flash.
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem('theme')
    const theme = stored === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
  } catch {
    document.documentElement.dataset.theme = 'dark'
  }
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
