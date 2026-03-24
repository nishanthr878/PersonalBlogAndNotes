import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { defaultDescription, metadataBase, siteName } from '@/lib/seo/site'
import './globals.css'

const bodyFont = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] })
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700'] })
const monoFont = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-code', weight: ['400', '500'] })

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
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: `${title} - ${defaultDescription}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: defaultDescription,
    images: ['/og.svg'],
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
