'use client'

import { useEffect } from 'react'

export function MermaidScript() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mermaid = (window as any).mermaid
      mermaid.initialize({ startOnLoad: false, theme: 'dark' })
      mermaid.run()
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
