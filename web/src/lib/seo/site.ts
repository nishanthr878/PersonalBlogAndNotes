export const siteUrl = (process.env.SITE_URL || 'https://personalblogandnotes.pages.dev').replace(/\/$/, '')
export const metadataBase = new URL(siteUrl)

export const siteName = 'Nishanth'
export const defaultDescription = 'Personal tech blog, LeetCode logs, and projects.'
export const defaultOgImagePath = '/og.svg'

export function absoluteUrl(pathname: string): URL {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(p, metadataBase)
}
