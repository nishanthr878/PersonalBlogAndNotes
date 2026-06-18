// web/src/app/opengraph-image.tsx
// Auto-generates /opengraph-image.png used by Twitter, LinkedIn, WhatsApp previews.
// Next.js App Router picks this up automatically — no config needed.

import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {/* Top — name + role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#e2e2e2',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              fontFamily: 'ui-serif, Georgia, serif',
            }}
          >
            Nishanth
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(226,226,226,0.45)',
              letterSpacing: '0.04em',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            backend engineer · bengaluru
          </div>
        </div>

        {/* Middle — tagline */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(226,226,226,0.7)',
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          Writing about Java, Kafka, distributed systems,
          and whatever I&apos;m building.
        </div>

        {/* Bottom — site + live badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: 'rgba(226,226,226,0.3)',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            portfolio.nishanthraj.in
          </div>

          {/* Live badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 100,
              padding: '8px 20px',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#4ade80',
                letterSpacing: '0.06em',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              demo.nishanthraj.in
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}