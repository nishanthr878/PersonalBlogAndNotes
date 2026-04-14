import { Container } from "@/components/Container";

export default function About() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display text-3xl tracking-tight">About</h1>

        <div className="mt-4 max-w-2xl space-y-4 text-[color:var(--muted)]">
          <p>
            I build backend systems and infrastructure — mostly in Java and Python, occasionally everything else.
          </p>
          <p>
            My day job involves LLM-driven voice bots and contact center AI at Target, integrating
            conversational AI with Genesys IVR infrastructure. Before that I spent 2+ years at Société
            Générale building an enterprise Asset Management System from scratch — replacing a third-party
            tool, cutting costs by 70%, and handling 15,000+ active assets in production.
          </p>
          <p>
            The most interesting thing I've built independently is a{" "}
            <a
              href="https://github.com/nishanthr878/Voice-AI-Test-Suite"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--fg)] underline underline-offset-2"
            >
              Voice AI Testing Suite
            </a>{" "}
            — a custom SIP engine over raw UDP that simulates end-to-end voice conversations using Groq
            and Piper TTS. It came out of frustration with manual IVR call testing at work.
          </p>
          <p>
            Currently exploring the DevOps and infrastructure side of backend engineering — Kubernetes,
            Terraform, and observability stacks.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <p className="text-sm text-[color:var(--muted)]">
            <span className="font-medium text-[color:var(--fg)]">Stack:</span>{" "}
            Java · Spring Boot · Python · Docker · PostgreSQL · Kafka · AWS · React
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            <span className="font-medium text-[color:var(--fg)]">Interests:</span>{" "}
            Backend systems · DevOps · Voice AI · LLM infrastructure · Developer tooling
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--bg)]"
            href="mailto:nishanthr878@gmail.com"
          >
            nishanthr878@gmail.com
          </a>
          <a
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--fg)]"
            href="https://github.com/nishanthr878/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--fg)]"
            href="https://www.linkedin.com/in/nishanthr79/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </Container>
  );
}