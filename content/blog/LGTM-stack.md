---
title: "Observability & the LGTM Stack - Reference Notes"
date: "2026-09-14"
description: "LGTM implementation"
tags: [observability, lgtm, spring-boot-4, docker, grafana, tempo, loki, debugging]
---


## 1. The three pillars of observability

| Pillar | Answers | Example |
|---|---|---|
| **Logs** | What happened, in detail? | "Order 1001 lookup failed: connection refused" |
| **Metrics** | How is the system behaving in aggregate, over time? | "p99 request latency: 340ms", "error rate: 0.2%" |
| **Traces** | What was the path of *this one request* through the system, and where did time go? | "Request → Kafka publish (2ms) → consumer pickup (40ms) → Groq call (1.1s) → DB write (5ms)" |

None of the three replaces the others. Metrics tell you *something* is wrong (a dashboard spikes). Traces tell you *where in the request path* it's wrong. Logs tell you *why*, in human-readable detail. Good observability lets you jump between all three for the same request/time window.

---

## 2. LGTM - what each letter is and why

- **L - Loki**: log aggregation. Stores logs, indexed cheaply by a small set of *labels* (not full-text indexing everything - this is Loki's core design difference from something like Elasticsearch). Cheap to run, good at "give me all logs for container X in the last hour."
- **G - Grafana**: the UI. Doesn't store anything itself - it's a query/visualization layer over Loki, Tempo, Prometheus/Mimir, and many other data sources. One pane of glass across all of them.
- **T - Tempo**: distributed tracing backend. Stores traces (trees of spans), lets you search by service, span name, duration, tags. Ingests via the OTLP protocol.
- **M - Mimir** (or Prometheus for a smaller/simpler setup): metrics storage. Time-series database, built for numeric data over time (counters, gauges, histograms).

**Why this combination specifically**: all four are open-source, self-hostable, and built by the same company (Grafana Labs) to interoperate cleanly - same query language conventions where possible, same UI, designed to cross-reference each other (trace → logs → metrics for the same request).

---

## 3. How data actually gets from your app to Grafana

Two different collection patterns, don't confuse them:

**Pull-based (older, still common for metrics):** Prometheus periodically scrapes a `/metrics` HTTP endpoint your app exposes. The backend initiates.

**Push-based (what this whole stack uses for logs and traces):** your app (or an agent sitting next to it) actively sends data outward.
- **Logs**: your app writes to stdout as normal → a small agent (Promtail, or its successor Alloy) reads container logs from the Docker daemon and pushes them to Loki's HTTP API.
- **Traces**: your app's own process holds an in-memory OpenTelemetry SDK, batches spans, and pushes them via the **OTLP protocol** directly to Tempo (or to an intermediate OpenTelemetry Collector, which then forwards to Tempo - the Collector is optional; apps can push straight to a backend for simpler setups).

**Key distinction to remember:** logs generally don't need any code changes - the log-shipping agent is pure infrastructure, watching what your app already writes. Traces generally *do* need your app to actively participate - either via auto-instrumentation (a starter/agent that patches common libraries) or manual span creation.

---

## 4. OTLP - the protocol that ties it together

OTLP (OpenTelemetry Protocol) is the standard wire format almost every modern observability backend accepts. Knowing its two transports and their default ports removes a whole class of "why is nothing arriving" bugs:

| Transport | Default port | Notes |
|---|---|---|
| gRPC | **4317** | Lower overhead, binary, preferred for high-volume production |
| HTTP/protobuf | **4318** | Needs an explicit path suffix per signal type - `/v1/traces`, `/v1/metrics`, `/v1/logs` |

**Common mistake, transferable to any stack, not just Spring:** pointing an HTTP-transport exporter at the gRPC port (or vice versa), or forgetting the `/v1/...` path suffix on HTTP. This class of bug often fails *silently* - a gRPC-only receiver getting an HTTP request, or an HTTP receiver getting hit on the wrong path, frequently doesn't produce a clean, loggable application-level error. If a trace/log/metric pipeline is fully configured, dependencies resolve, the app starts clean, and *still* nothing arrives at the backend - check port + path + transport type first, before anything else.

---

## 5. Spring Boot's observability building blocks (general shape, not version-pinned)

- **Micrometer**: a vendor-neutral instrumentation facade. Your code (and Spring's own auto-instrumentation) talks to Micrometer's API; Micrometer talks to whatever backend-specific "bridge" is on the classpath.
- **Micrometer Tracing**: the tracing-specific part of Micrometer. Needs a **bridge** dependency to pick a concrete tracer implementation - commonly the OpenTelemetry bridge (`micrometer-tracing-bridge-otel`).
- **Spring Boot Actuator**: exposes management/introspection endpoints (`/actuator/health`, `/actuator/env`, etc.) and is the layer that auto-wires most of this together.
- **The starter model**: recent Spring Boot generations have moved toward one focused starter dependency per concern (a REST client starter, a test-client starter, an OpenTelemetry starter) rather than requiring you to manually assemble several lower-level libraries yourself. **General lesson: when a "modern Spring" integration silently doesn't work despite dependencies resolving and no errors, suspect a missing purpose-built starter before suspecting your configuration.** Manually reassembling what a starter would have bundled is a common source of subtle, silent gaps.

---

## 6. A repeatable methodology for "it's configured correctly but nothing happens"

This is the actual valuable, transferable skill - not any one fix. Steps, in order, cheapest/most-certain first:

1. **Ask the running application what it actually loaded**, don't trust the file on disk. (Actuator's `/actuator/env` for Spring; equivalent introspection endpoints exist in most frameworks.) A property can be present in your file and still not be what the app is using - stale build, wrong file path inside a container, wrong profile active.
2. **Confirm the dependency actually resolved**, not just that the build succeeded. A build can succeed with a dependency silently missing if nothing else strictly requires it.
3. **Check the *receiving* side's logs, not just the sender's.** A working exporter with a wrong destination often produces *zero* error on the sending side (fire-and-forget push patterns swallow connection failures more often than you'd expect) - but the receiver's own logs will show either a connection attempt or, tellingly, nothing at all.
4. **Bypass the UI layer and query the backend directly** (a raw `curl` against the storage backend's own API) before trusting a dashboard/explorer UI - this separates "no data arrived" from "data arrived but the UI query/config is wrong," which are different bugs needing different fixes.
5. **Only after 1–4 are all confirmed correct**, start reconsidering the underlying theory itself (wrong port, wrong protocol, missing starter, version mismatch) - don't jump here first.

---

## 7. Distributed tracing across async boundaries (queues, message brokers)

This is a genuinely different problem from tracing a synchronous HTTP call chain, worth understanding as its own concept:

- In a synchronous call (service A → HTTP → service B), trace context propagates naturally via request headers - the caller injects it, the callee extracts it, auto-instrumentation on both ends usually handles this for free.
- Across a **message broker** (Kafka, RabbitMQ, SQS), there's no synchronous request/response to carry headers through by default - the producer finishes and moves on before the consumer ever runs, possibly on a different process/thread entirely, possibly much later.
- The correct pattern: the producer explicitly injects trace context into the **message's own headers** at publish time; the consumer explicitly extracts it and re-attaches it as the parent context for its own processing span.
- **Auto-instrumentation for this exists in most modern frameworks, but it's frequently scoped to a specific, idiomatic consumption pattern** (e.g., annotation-driven listeners) rather than every possible way of consuming from the broker. A manually configured, lower-level consumer setup may fall outside what gets automatically instrumented, even when the framework's official docs say "Kafka tracing works out of the box" - that claim usually has fine print about *which* consumption style it covers.
- **General diagnostic tell**: if HTTP-level spans show up in your tracing backend but nothing past a queue boundary does, suspect exactly this - check whether your actual consumer code matches the idiomatic pattern the auto-instrumentation targets.

---

## 8. Log ↔ trace correlation - the general pattern

Two-sided, and both sides are independently necessary (a common documented mistake is configuring only one direction):

1. **Prerequisite**: trace ID and span ID must actually appear inside the *text* of your log lines, not just exist internally in the tracing SDK. Most frameworks with active tracing will do this automatically once wired up (injected via something like MDC/context propagation into the default log format) - worth explicitly verifying this is happening before configuring anything in the UI layer.
2. **Logs → Traces direction**: the log backend's UI needs a rule extracting the trace ID from log text (usually a regex with one capture group) and a link pointing at the tracing backend, passing the extracted value as the query.
3. **Traces → Logs direction**: the tracing backend's UI needs to know which log backend to query, plus a way to scope that query correctly - typically a small time-window (spans are millisecond-precise; log line timestamps can drift slightly around the span boundary, so an exact-match window often returns nothing) and a tag/label mapping so it filters to the right service rather than every log in the system.

---

## 9. Quick property/concept glossary (deliberately not version-pinned - verify against current docs for the exact framework version in use)

- **Span**: one unit of work in a trace - has a start time, duration, name, and a set of key-value attributes/tags.
- **Trace**: a tree of spans sharing one trace ID, representing one logical request's full journey.
- **Sampling**: what fraction of requests actually get traced. `1.0` = trace everything (fine for low-traffic dev/demo; expensive/wasteful at real production scale - production systems typically sample a small percentage).
- **Resource attributes**: metadata describing *what emitted* the telemetry (service name, environment, version) - distinct from span-level attributes describing *what happened in one span*. A missing `service.name` resource attribute is why a tracing backend shows `unknown_service` instead of your app's real name.
- **Auto-instrumentation vs. manual instrumentation**: auto-instrumentation patches common libraries (HTTP clients/servers, JDBC, common message-broker clients) to emit spans with no code changes; manual instrumentation is you explicitly creating/naming spans in your own business logic for things auto-instrumentation can't see (a specific algorithm step, a call to a niche external API, a particular branch of business logic worth timing on its own).

---

## 10. Mental checklist for next time

- [ ] Confirm the property namespace against docs **dated for the exact major version** in use, not just "current-looking" search results - major-version property renames are common and easy to miss.
- [ ] Confirm dependencies resolve at the correct version, not just that the build succeeds.
- [ ] Confirm the destination port matches the transport protocol being used (gRPC vs HTTP), and the path suffix is present for HTTP.
- [ ] Check the receiver's own logs before assuming the sender is broken.
- [ ] Query the storage backend directly, bypassing any dashboard UI, to isolate "no data" from "UI/query is wrong."
- [ ] For anything crossing an async/queue boundary: don't assume "auto-instrumented" means *every* consumption pattern - check what the auto-instrumentation is actually scoped to.