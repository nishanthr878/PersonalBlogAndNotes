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
                I build backend systems — mostly Java and Spring Boot, occasionally Python and everything else.
                Based in Bengaluru.
              </p>
              <p>
                My strongest production work was at{' '}
                <span className="text-[color:var(--fg)]">Société Générale</span>{' '}
                — I built an Asset Management System from scratch that replaced a third-party tool,
                managed 45,000+ assets, and cut costs significantly. That project involved a
                Flask-to-Spring Boot migration, Kafka-based event streaming, and a full audit trail system.
              </p>
              <p>
                Currently at <span className="text-[color:var(--fg)]">Target</span>, working on
                IVR and contact center AI infrastructure with Genesys.
              </p>
              <p>
                The most technically interesting thing I&apos;ve built independently is the{' '}
                <a
                  href="https://github.com/nishanthr878/Voice-AI-Test-Suite"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--fg)] underline underline-offset-2"
                >
                  Voice AI Testing Suite
                </a>{' '}
                — a custom SIP engine over raw UDP that simulates end-to-end voice conversations
                using Groq Whisper and Piper TTS. Built out of frustration with manual IVR testing.
              </p>
              <p>
                The{' '}
                <a
                  href="https://demo.nishanthraj.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--fg)] underline underline-offset-2"
                >
                  LLM Scoring Service
                </a>{' '}
                is my current main project — an open-source observability platform for evaluating
                LLM responses in production, with 11 scorers, a Kafka async pipeline, and a live demo.
              </p>
              <p>
                This blog is a public notebook. Some posts are deep dives into things I&apos;ve built.
                Some are just notes I&apos;d otherwise Google.
              </p>
            </div>

            {/* Contact buttons */}
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

          {/* Sidebar — stack + experience */}
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
                    <div className="text-sm font-medium text-[color:var(--fg))]">{company}</div>
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