---
title: "Designing an LLM Observability Platform from Scratch"
date: "2026-06-09"
description: "How I designed the system architecture for llm-scoring-service — a self-hosted LLM observability platform — and the tradeoffs I made along the way."
tags: ["java", "spring-boot", "system-design", "llm", "architecture", "postgresql"]
---

LLMs in production have a measurement problem. You deploy a pipeline, it works in testing, and then something drifts  prompts change, model behavior shifts, retrieval quality degrades  and you find out from a user complaint, not a dashboard. `llm-scoring-service` is my attempt to solve that by making LLM evaluation a first-class infrastructure concern.

This post covers the system design: the core components, why I made the structural decisions I did, and what I'd change if I were starting over.

---

## What the System Needs to Do

Before picking any technology, I wrote out the minimum set of behaviors:

1. Client applications instrument their LLM calls with minimal code changes
2. Request/response pairs are captured and stored durably
3. Each response is scored against configurable criteria (relevance, faithfulness, toxicity, etc.)
4. Scores and trends are queryable via a dashboard

The constraint that shaped everything: **scoring cannot block the caller**. If the scoring engine is slow or down, the application making the LLM call should be unaffected.

---

## High-Level Architecture

```
Client App (Java/Python SDK)
        │
        │  POST /api/v1/evaluations
        ▼
┌─────────────────────┐
│   Ingest API        │  Spring Boot REST layer
│  (non-blocking)     │
└────────┬────────────┘
         │  publish event
         ▼
┌─────────────────────┐
│      Kafka          │  llm-evaluation-events topic
│  (durable buffer)   │
└────────┬────────────┘
         │  consume
         ▼
┌─────────────────────┐
│   Scoring Engine    │  Calls Groq API, applies rubrics
└────────┬────────────┘
         │  persist
         ▼
┌─────────────────────┐
│    PostgreSQL       │  Evaluations, scores, metadata
└────────┬────────────┘
         │  query
         ▼
┌─────────────────────┐
│   React Dashboard   │  Score trends, filtering, alerts
└─────────────────────┘
```

The Kafka layer is the critical design choice. Everything else follows from it.

---

## Why Kafka, Not a Direct DB Write

The obvious simpler design: ingest API writes directly to PostgreSQL, a background thread picks up unscored rows and processes them. This would work. So why Kafka?

**Burst handling.** LLM applications tend to spike — a feature launch, a batch job, a burst of user traffic. With a direct DB write + polling pattern, the scoring backlog piles up in the database. With Kafka, the topic absorbs the burst and consumers drain it at their own pace without creating table lock contention.

**Consumer group scaling.** If scoring becomes the bottleneck, adding a second scoring consumer instance is one config change. With a DB polling pattern, you need to implement your own distributed lock to prevent two workers from picking up the same row.

**Decoupled failure modes.** If the Groq API is rate-limiting or temporarily down, Kafka retains the events. A DB polling approach requires you to implement retry state tracking yourself (a `status` column, retry count, backoff logic). Kafka gives you offset management for free.

The tradeoff: operational complexity. Kafka requires a broker running locally (or managed). For a solo project, that's real overhead. I use Docker Compose to bundle it — but it's still a dependency you have to care about.

---

## The Ingest API Contract

The API accepts a single evaluation unit:

```json
POST /api/v1/evaluations
{
  "applicationId": "my-rag-service",
  "sessionId": "user-session-abc123",
  "prompt": "What is the refund policy?",
  "response": "You can return items within 30 days.",
  "context": "Returns are accepted within 30 days of purchase...",
  "modelId": "llama3-8b-8192",
  "latencyMs": 420,
  "metadata": {
    "userId": "u_98234",
    "featureFlag": "rag-v2"
  }
}
```

Response is immediate — a 202 Accepted with an `evaluationId`. Scoring happens asynchronously. This is the contract the SDK wraps.

Key design decision: **`context` is optional but changes scoring behavior**. When present, the scoring engine can evaluate faithfulness (did the response stay grounded in the context?). Without it, only relevance and quality criteria apply. This matters for RAG pipelines specifically.

---

## Schema Design

The core tables:

```sql
-- One row per LLM call submitted for evaluation
CREATE TABLE evaluations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  VARCHAR(100) NOT NULL,
    session_id      VARCHAR(200),
    prompt          TEXT NOT NULL,
    response        TEXT NOT NULL,
    context         TEXT,
    model_id        VARCHAR(100),
    latency_ms      INTEGER,
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per scoring dimension per evaluation
CREATE TABLE scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id   UUID NOT NULL REFERENCES evaluations(id),
    dimension       VARCHAR(50) NOT NULL,   -- 'relevance', 'faithfulness', 'toxicity'
    score           NUMERIC(4,3) NOT NULL,  -- 0.000 to 1.000
    reasoning       TEXT,                  -- LLM-generated explanation
    rubric_version  VARCHAR(20) NOT NULL,
    scored_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scores_evaluation_id ON scores(evaluation_id);
CREATE INDEX idx_evaluations_app_created ON evaluations(application_id, created_at DESC);
```

The `scores` table stores one row per dimension, not a wide row with columns per dimension. This means adding a new scoring dimension is a data change, not a schema change. The dashboard aggregates across `dimension` values dynamically.

`metadata JSONB` on evaluations is intentional — callers attach arbitrary context (user IDs, A/B flags, request IDs) without schema migrations.

---

## Runtime-Configurable Rubrics

The scoring criteria are not hardcoded. They're loaded at scoring time from a `rubrics` table:

```sql
CREATE TABLE rubrics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) UNIQUE NOT NULL,
    prompt      TEXT NOT NULL,      -- injected into Groq scoring request
    enabled     BOOLEAN NOT NULL DEFAULT true,
    version     VARCHAR(20) NOT NULL
);
```

The scoring engine loads active rubrics on startup (and can refresh them). This means you can disable the `toxicity` rubric for an internal tool, or add a custom `conciseness` criterion for a specific application — without redeploying anything.

The tradeoff: rubric changes take effect on new evaluations only. Past evaluations were scored under the old rubric version. The `rubric_version` column on `scores` tracks this so you can filter correctly in the dashboard.

---

## What I Would Change

**1. Separate ingest and scoring into distinct services.** Right now they're modules in the same Spring Boot app. For a production system, you'd want independent deployability and scaling. The Kafka contract already makes this a clean cut.

**2. Add evaluation sampling.** Right now every LLM call is scored. At volume, that's expensive (Groq API calls add up). A sampling strategy — score 10% of calls, or score all calls for new model versions — would be more practical.

**3. Schema: store the raw Groq scoring response.** Currently only the parsed score and reasoning are persisted. Storing the raw response would make debugging rubric quality much easier.

---

## What This Is Not

This is not a benchmarking framework (MMLU, HellaSwag, etc.). It's not for offline eval on curated datasets. It's specifically for **production runtime evaluation** — scoring real user interactions in real pipelines. That's a different problem than model benchmarking, and the design reflects it.