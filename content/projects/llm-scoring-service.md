---
title: "LLM Scoring Service"
date: "2026-06-09"
description: "An LLM observability and scoring platform for evaluating, monitoring, and analyzing LLM responses in production pipelines."
tags: ["java", "spring-boot", "llm", "observability", "kafka", "postgresql"]
stack: ["Java 21", "Spring Boot 3.5", "PostgreSQL", "Kafka", "React", "Groq API"]
repoUrl: "https://github.com/nishanthr878/llm-scoring-service"
featured: true
---

## Overview

`llm-scoring-service` is a self-hosted observability and scoring platform for LLM-backed applications. It captures requests/responses from LLM pipelines, scores them on configurable dimensions, and surfaces metrics through a React dashboard.

## Why I Built This

Production LLM integrations have a measurement problem - you can't tell if quality is degrading without structured evaluation. This service addresses that by treating LLM scoring as a first-class infrastructure concern.

## Architecture

- **Ingest layer**: REST API receives LLM request/response pairs from client applications
- **Scoring engine**: Evaluates responses using Groq's API against configurable rubrics (relevance, faithfulness, toxicity, custom criteria)
- **Event pipeline**: Kafka decouples ingestion from scoring to handle burst traffic
- **Storage**: PostgreSQL stores evaluations, scores, and aggregated metrics
- **SDKs**: Java and Python client libraries for zero-friction integration
- **Dashboard**: React UI for querying evaluations, viewing score distributions, and setting alert thresholds

## Key Design Decisions

- Kafka buffer prevents scoring latency from blocking the caller's request path
- Scoring rubrics are runtime-configurable — no redeploy needed to add a new dimension
- SDK design mirrors OpenTelemetry's instrumentation pattern for familiar DX

## Status

Active development. Core scoring pipeline and Java SDK complete. Python SDK and dashboard in progress. 70+ test cases covering service and integration layers.