import type { Metadata } from 'next'
import { Container } from '@/components/Container'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'About',
  description: 'Backend engineer based in Bengaluru. Java, Kafka, distributed systems.',
  openGraph: { url: '/about' },
  alternates: { canonical: '/about' },
}

export default function About() {
  return (
    <Container>
      <div className="py-10">

        {/* Header */}
        <div className="mb-8 border-b border-[color:var(--border)] pb-6">
          <h1 className="font-display text-2xl tracking-tight">About</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">

          {/* Bio — takes 2 cols */}
          <div className="lg:col-span-2">
            <div className="space-y-4 text-sm leading-relaxed text-[color:var(--muted)]">
              <p>
                I build backend systems that don&apos;t fall apart under load — mostly in Java and
                Spring Boot, with Kafka for async pipelines when things need to scale beyond a single
                service. Based in Bengaluru.
              </p>
              <p>
                At <span className="text-[color:var(--fg)]">Société Générale</span>, I replaced a
                third-party asset management system with an in-house platform handling 45,000+ assets.
                The system reduced operational licensing cost by ~70% and gave us full control over
                auditability and event flows. I designed a Kafka-based event pipeline, migrated
                services from Flask to Spring Boot, and built an audit trail system to make state
                changes traceable and debuggable.
              </p>
              <p>
                Currently at <span className="text-[color:var(--fg)]">Target</span>, I work on IVR
                and contact center infrastructure, building systems that simulate, test, and validate
                voice workflows. This involves handling real-time communication constraints, external
                integrations (Genesys), and reliability issues that don&apos;t show up in happy-path
                demos.
              </p>
              <p>
                Independently, I built a{' '}
                <a
                  href="https://github.com/nishanthr878/Voice-AI-Test-Suite"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--fg)] underline underline-offset-2"
                >
                  Voice AI Testing Suite
                </a>{' '}
                — a custom SIP engine over raw UDP that simulates full voice conversations using STT
                and TTS pipelines. It exists because manual IVR testing doesn&apos;t scale, and most
                tools in this space are either expensive or inadequate.
              </p>
              <p>
                My current focus is the{' '}
                <a
                  href="https://demo.nishanthraj.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--fg)] underline underline-offset-2"
                >
                  LLM Scoring Service
                </a>{' '}
                — an open-source evaluation platform for scoring LLM responses in production. It uses
                an async Kafka pipeline, supports multiple scoring strategies, and provides real-time
                visibility into model performance. The goal is simple: make LLM behavior measurable
                instead of hand-wavy.
              </p>
              <p>
                This blog is where I write about systems I&apos;ve built, the tradeoffs behind them,
                and the mistakes that forced better designs.
              </p>
            </div>

            {/* Contact */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { label: 'nishanthr878@gmail.com', href: 'mailto:nishanthr878@gmail.com' },
                { label: 'GitHub', href: 'https://github.com/nishanthr878/' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nishanthr79/' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--fg)] hover:border-[color:var(--fg)]/30"
                >
                  {label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Experience */}
            <div>
              <div className="mb-4 text-xs font-medium uppercase tracking-widest text-[color:var(--muted)]">
                Experience
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {[
                  { company: 'Target', role: 'Backend Engineer', period: '2024 – now' },
                  { company: 'Société Générale', role: 'Backend Engineer', period: '2021 – 2024' },
                ].map(({ company, role, period }) => (
                  <li key={company} className="py-3">
                    <div className="text-sm font-medium text-[color:var(--fg)]">{company}</div>
                    <div className="text-xs text-[color:var(--muted)]">{role}</div>
                    <div className="mt-0.5 font-mono text-xs text-[color:var(--muted)]">{period}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div>
              <div className="mb-4 text-xs font-medium uppercase tracking-widest text-[color:var(--muted)]">
                Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL',
                  'Redis', 'Python', 'Docker', 'React', 'AWS',
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 font-mono text-xs text-[color:var(--muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Container>
  )
}