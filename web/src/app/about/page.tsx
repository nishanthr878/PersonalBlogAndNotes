import type { Metadata } from 'next'
import { Container } from '@/components/Container'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, experience, and links.',
  openGraph: { url: '/about' },
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display text-3xl tracking-tight">About</h1>
        <p className="mt-4 max-w-2xl text-zinc-700">
          Full-stack Developer with 2+ years of experience in building scalable enterprise applications using Spring
          Boot, PostgreSQL, React.js, Kafka and Python. Proven expertise in designing and managing solutions
          like the Asset Management tool and in improving operational efficiency and automation. Skilled in incident
          management, server administration, and team leadership, ensuring reliable, business critical systems
          with measurable results. Focused on delivering high-quality, data-driven solutions that streamline operations and
          enhance productivity.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50" href="mailto:nishanthr878@gmail.com">
            nishanthr878@gmail.com
          </a>
          <a className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium" href="https://github.com/nishanthr878/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium" href="https://www.linkedin.com/in/nishanthr79/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </Container>
  )
}
