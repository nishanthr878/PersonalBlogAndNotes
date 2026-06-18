// web/src/app/icon.tsx
// Next.js App Router auto-generates /favicon.ico from this file.
// No external image needed.

import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        <span
          style={{
            color: '#e2e2e2',
            fontSize: 20,
            fontWeight: 600,
            fontFamily: 'serif',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          N
        </span>
      </div>
    ),
    { ...size },
  )
}